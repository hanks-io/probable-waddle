<!-- 开始游戏 -->
<template>
  <ion-page ref="gamePageRef" :key="url">
    <!-- 退出操作栏 -->
    <div ref="draggableBox"
      style="position: absolute; top: 40px; left: 0; cursor: pointer; z-index: 30; overflow: hidden"
      class="draggable-box" @mousedown="startDrag" @touchmove.stop.passive="setTouchMove" @touchend="setMoveEnd" @click="backHandle">
      <!-- 动画图标 -->
      <ion-icon src="/svg/home.svg" />
      <!-- 说明文本 -->
      <p class="label">
        Lobby
      </p>
    </div>
    <!-- 加载游戏 -->
    <div v-if="loaded === 0" id="placeholder">Loading...</div>
    <iframe id="game-active-iframe" v-if="url" :src="url" frameborder="0" width="100%" height="100%"
      @load="handleLoad" @error="handleError" @unload="handleUnload" />
    <iframe id="game-active-iframe" v-else-if="doc" :srcdoc="doc" frameborder="0" width="100%"
      height="100%" @load="handleLoad" @error="handleError" @unload="handleUnload" />
  </ion-page>
</template>

<script setup lang="ts">
  import { maxWidth } from '@/data';
  import { throttle, debounce } from '@/utils';
  import { t, locale } from '@/i18n';
  import { gameEndApi } from '@/api/game';
  import { SD_MODEL } from '@/enums/device';
  import { useUserStore } from '@/store/user';
  import { RedirectUrl } from '@/common/data';
  import useNoSleep from '@/hooks/useNoSleep';
  import { IonPage, IonIcon } from '@ionic/vue';
  import { pcHorizontalGameCodes } from './data';
  import { useSystemStore } from '@/store/system';
  import { useElementStore } from '@/store/element';
  import { gameUrlRequest, useGameStore } from '@/store/game';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { ref, onBeforeMount, onMounted, computed, reactive } from 'vue';
  import { PageParam, setPageParam, getPageParam } from '@/store/pageParam';
  import useNavigaterBack from '@/hooks/useNavigaterBack';

  const route = useRoute();               // 路由参数
  const router = useRouter();             // 路由
  const gameStore = useGameStore();       // 游戏信息
  const userStore = useUserStore();       // 用户信息
  const systemStore = useSystemStore();   // 系统信息
  const elementStore = useElementStore(); // 元素信息

  const loaded = ref(0);        // iframe加载完成状态
  const error = ref(false);     // 加载失败状态
  const isMove = ref(false);    // false == click, true == move
  const gamePageRef = ref();    // 游戏页面
  const draggableBox = ref();   // 悬浮DOM按钮
  const dragging = ref(false);  // 开始移动

  const url = computed(() => gameStore.gameUrl);        // 游戏链接
  const doc = computed(() => gameStore.gameDoc);        // iframe内容
  const currentLanguage = computed(() => locale.value); // 当前选择语言

  const pageRect = ref();

  let windowHeight = window.innerHeight;  // 窗口高度
  let startY = 0;
  let startTop = 0;
  let startX = 0;
  let startLeft = 0;

  useNoSleep('GameAction'); // 保持屏幕常亮
  // 生命周期-页面加载前
  onBeforeMount(async () => {
    const gameCode = sessionStorage.getItem('gameCode') || '';
    if (pcHorizontalGameCodes.includes(gameCode) && systemStore.app?.build === SD_MODEL.DESKTOP_OS) {
      elementStore.setScreenWidth(window.innerWidth);
    }
    if (!url.value && !doc.value) {
      gameUrlRequest({ gameId: Number(route.params.id), lobbyUrl: RedirectUrl });
    }
  })

  const getPageRect = () => {
    if (gamePageRef.value) {
      const pageElement = gamePageRef.value.$el;
      pageRect.value = pageElement.getBoundingClientRect();
    }
  }

  // 生命周期-页面加载完成
  onMounted(() => {
    // @ts-ignore
    window.isGame = true;
    window.addEventListener('message', messageListener);
    window.addEventListener('popstate', switchPortrait, { once: true });
    window.addEventListener('resize', getPageRect);
    getPageRect();
    // 获取退出游戏按钮上次浮动的位置并回显
    const appScrollHeight = getPageParam(PageParam.LOGOUT_HEIGHT);
    const appScrollWidth = getPageParam(PageParam.LOGOUT_WIDTH);
    const oldHeightNum = appScrollHeight ? Number(appScrollHeight.replace('px', '')) : 0;
    if (appScrollHeight && draggableBox.value && oldHeightNum < windowHeight) {
      draggableBox.value.style.top = appScrollHeight
    }
    if (appScrollWidth && draggableBox.value) {
      draggableBox.value.style.left = appScrollWidth
    }
  })

  // 生命周期-路由离开前
  onBeforeRouteLeave(() => {
    leaveGame();
  })

  /**
   * @description 离开路由执行方法
   */
  const leaveGame = throttle(() => {
    // @ts-ignore
    window.isGame = false;
    gameStore.setGameUrl('');
    gameStore.setGameDoc('');
    elementStore.setScreenWidth(maxWidth);
    window.removeEventListener('message', messageListener);
    document.removeEventListener('mousemove', documentMove)
    document.removeEventListener('mouseup', documentMouseUp)
    window.removeEventListener('resize', getPageRect);
    gameEndApi(userStore.user?.userId!).then(() => {
      localStorage.removeItem('enteredGame');
    })
  }, 1000, { leading: true, trailing: false })

  // web端增加拖动 mousedown事件
  function startDrag(event: any) {
    event.preventDefault();                // web端移动 阻止默认事件 解决移动时出现遮盖层
    isMove.value = false                // 区分点击事件和move事件
    dragging.value = true;                 // 开始移动
    const { clientY, clientX } = event;
    startY = clientY;
    startX = clientX;
    startTop = parseInt(draggableBox.value.style.top, 10) || 0;
    startLeft = parseInt(draggableBox.value.style.left, 10) || 0;
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'none'; // 屏蔽iframe 否则无法实现mousemove，mouseup事件触发
    }
    // 添加全局 mousemove 事件监听器
    document.addEventListener('mousemove', documentMove);
    // 添加全局 mouseup 事件监听器
    document.addEventListener('mouseup', documentMouseUp);
  }

  // wed 监听dom鼠标移动事件
  function documentMove(event: any) {
    if (!dragging.value) return;
    isMove.value = true
    const { clientY, clientX } = event;
    const valY = `${startTop + clientY - startY}px`;
    draggableBox.value.style.top = valY
    setPageParam(PageParam.LOGOUT_HEIGHT, valY)
    const valX = `${startLeft + clientX - startX}px`;
    draggableBox.value.style.left = valX
    setPageParam(PageParam.LOGOUT_WIDTH, valX)
  }

  // wed 监听dom鼠标离开事件
  function documentMouseUp(event: any) {
    event.preventDefault();
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.pointerEvents = 'auto';
    }
    dragging.value = false;
  }

  /**
   * @description 移动端 悬浮按钮移动事件
   *
   */
  function setTouchMove(e: any) {
    isMove.value = true
    const { clientY, clientX } = e.touches[0];
    const { top, left } = pageRect.value;
    const { clientWidth: windowWidth, clientHeight: windowHeight } = gamePageRef.value?.$el
    const { offsetHeight: draggableHeight, offsetWidth: draggableWidth } = draggableBox.value
    const valY = `${(clientY - top - draggableHeight / 2) / windowHeight * 100}%`
    const valX = `${(clientX - left - draggableWidth / 2) / windowWidth * 100}%`
    draggableBox.value.style.top = valY
    draggableBox.value.style.left = valX
    setPageParam(PageParam.LOGOUT_HEIGHT, valY)
    setPageParam(PageParam.LOGOUT_WIDTH, valX)
    setMoveEndDebounce()
  }

  const checkBoundary = () => {
    if (!draggableBox.value) return;
    const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = draggableBox.value;
    const windowWidth = gamePageRef.value?.$el.clientWidth
    if (offsetTop < 0) {
      draggableBox.value.style.top = 0
      setPageParam(PageParam.LOGOUT_HEIGHT, 0)
    }
    if (offsetTop > windowHeight - offsetHeight) {
      const top = `${(windowHeight - offsetHeight) / windowHeight * 100}%`
      draggableBox.value.style.top = top
      setPageParam(PageParam.LOGOUT_HEIGHT, top)
    }
    if (offsetLeft < 0) {
      draggableBox.value.style.left = 0
      setPageParam(PageParam.LOGOUT_WIDTH, 0)
    }
    if (offsetLeft > windowWidth - offsetWidth) {
      const left = `${(windowWidth - offsetWidth) / windowWidth * 100}%`
      draggableBox.value.style.left = left
      setPageParam(PageParam.LOGOUT_WIDTH, left)
    }
  }

  // 移动结束
  const setMoveEndDebounce = debounce(() => {
    checkBoundary()
  }, 1000)

  /**
   * @description 移动收尾工作
   */
  const setMoveEnd = throttle(() => {
    checkBoundary()
    setTimeout(() => {
      isMove.value = false
    }, 100)
  }, 1000, { leading: true, trailing: false }) 

  /**
   * @description 原生平台切换竖屏
   */
  function switchPortrait() {
    if (window.jsBridge) {
      // @ts-ignore
      window.jsBridge.postMessage('rotatingScreen', 'portrait')
    }
  }

  /**
   * @description 返回上一页
   */
  async function backHandle() {
    if (!isMove.value) { // 不是移动事件，就跳转页面
      router.replace(history.state.back);
    }
    switchPortrait();
  }

  /**
   * @description iframe卸载事件
   */
  function handleUnload() {
    console.error('unload');
  }

  /**
   * @description iframe加载完成事件
   */
  function handleLoad() {
    loaded.value++;
    localStorage.setItem('enteredGame', 'true');
  }

  /**
   * @description iframe加载失败事件
   */
  function handleError() {
    error.value = true;
  }

  /**
   * @description 消息监听事件
   */
  function messageListener(e: MessageEvent) {
    if (e.data.type === 'pageLoaded' || e.data.name === 'EXIT_GAME') {
      backHandle();
    }
  }
</script>

<style scoped lang="less">
  ion-fab {
    width: 3em;
    height: 3rem;
  }

  ion-fab-button {
    --color: #fff;
    /* 按钮字体图标颜色 */
    --background: #F44939;
    /* 按钮背景色 */
    width: 3em;
    height: 3rem;
    font-size: inherit;
  }

  ion-fab-button::part(native) {
    width: 3em;
    height: 3rem;
  }

  ion-fab-list {
    min-width: 3em;
    min-height: 3em;
  }

  ion-spinner {
    --color: #1680DC;
  }

  ion-page {
    --background: #000;
    overflow: hidden;
    position: relative;
  }

  #placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.5rem;
  }

  iframe {
    background-color: transparent;
    margin: auto;
  }

  .game_icon {
    position: absolute;
    top: 2.5rem;
    right: -14.5rem;
    width: 17.6875rem;
    height: 3.2rem;
    z-index: 30;
    overflow: hidden;
  }

  .show-icon {
    position: absolute;
    width: 9rem;
    height: 3.125rem;
    top: 1rem;
    left: 1.5rem;
  }

  .animation_icon {
    position: absolute;
    top: .78rem;
    left: .975rem;
  }

  .line-rotate {
    transform: rotate(-72deg);
  }

  .show-right {
    transition: all 0.3s;
    transform: rotate(180deg);
  }

  .draggable-box {
    width: 3.375rem;
    height: 3.375rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .6);
    border: 0.0625rem solid rgba(255, 255, 255, 0.80);
    box-shadow: 0 .03rem .06rem 0 rgba(0, 0, 0, .16);

    ion-icon {
      font-size: 1.5rem;
    }

    .label {
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1.2;
    }
  }

</style>
