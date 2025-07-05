<!-- 开始游戏 -->
<template>
  <ion-page class="overflow-hidden bg-black">
    <!-- 退出操作栏 -->
    <div ref="draggableBox"
      style="position: absolute; top: 40px; right: -14.5rem; width: 17.6875rem; height: 3.2rem; cursor: pointer; z-index: 30; overflow: hidden"
      :class="{ 'animation_box': showRight, 'un_animation': !showRight }" @mousedown="startDrag">
      <!-- 动画图标 -->
      <div class="w-[2.8rem] h-[2.8rem]" @touchmove.stop.passive="setTouchMove">
        <ion-icon class="w-[2.8rem] h-[2.8rem]" src="/svg/game_out_box.svg" @click="animationClick" />
        <ion-icon class="z-50 text-[0.8rem] text-white animation_icon"
          :class="{ 'show-right': showRight, 'un-show-right': !showRight }" src="/svg/game_change_icon.svg"
          @click="animationClick" />
      </div>
      <ion-icon class="text-white show-icon" src="/svg/game_out.svg" />
      <!-- 说明文本 -->
      <p class="absolute top-[1.5rem] left-[3.375rem] text-sm leading-loose w-16"
        :class="currentLanguage == 'en-US' ? 'out-msg' : ''" @click="isLoginOut">
        {{ $t('label.logout') }}
      </p>
      <!-- 线条 -->
      <div class="line-rotate absolute top-[2.25rem] left-[6.5rem] w-[1.25rem] h-[0.0625rem] bg-[#fff] opacity-[.3]" />
      <!-- 退出按钮 -->
      <div class="w-[3rem] h-[3rem] absolute top-[.875rem] left-[7.125rem] flex justify-center items-center z-50"
        @click="isLoginOut">
        <ion-icon src="/svg/game_out_icon.svg" class="text-[1rem] text-white " />
      </div>
    </div>
    <!-- 加载游戏 -->
    <iframe id="game-active-iframe" v-if="url" v-show="loaded" :src="url" frameborder="0" width="100%" height="100%"
      @load="handleLoad" @error="handleError" @unload="handleUnload" />
    <iframe id="game-active-iframe" v-else-if="doc" v-show="loaded" :srcdoc="doc" frameborder="0" width="100%"
      height="100%" @load="handleLoad" @error="handleError" @unload="handleUnload" />
    <!-- 退出确认弹窗 -->
    <IonAlert :alertOptions="alertOptions" @sureClick="backHandle" v-if="isOpen" @cancelClick="isOpen = false"
      @maskClick="isOpen = false" />
    <!-- 蒙层 -->
    <div class="absolute z-10 w-full h-full" v-show="showRight && !isOpen && !dragging" @click="shieldClick" />
  </ion-page>
</template>

<script setup lang="ts">
import { maxWidth } from '@/data';
import { throttle } from '@/utils';
import { t, locale } from '@/i18n';
import { gameEndApi } from '@/api/game';
import { SD_MODEL } from '@/enums/device';
import { useUserStore } from '@/store/user';
import { RedirectUrl } from '@/common/data';
import { IonPage, IonIcon } from '@ionic/vue';
import { pcHorizontalGameCodes } from './data';
import { useSystemStore } from '@/store/system';
import { useElementStore } from '@/store/element';
import { gameUrlRequest, useGameStore } from '@/store/game';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { ref, onBeforeMount, onMounted, computed, reactive } from 'vue';
import { PageParam, setPageParam, getPageParam } from '@/store/pageParam';
import IonAlert from '@/components/IonAlert/index.vue'
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
const isOpen = ref(false);    // alert 弹窗
const draggableBox = ref();   // 悬浮DOM按钮
const dragging = ref(false);  // 开始移动
const showRight = ref(false); // 展示从左到右
const isMoveing = ref(false); // 是否移动中

// 对话框配置
const alertOptions = reactive({
  title: t('components.logoutGameTitle'),
  message: t('components.logoutGameMessage'),
  bgColor: 'warning',
  cancelOption: {
    expand: 'block',
    fill: 'solid',
    color: 'warning'
  },
  sureOption: {
    expand: 'block',
    fill: 'outline',
    color: 'warning'
  },
})

const url = computed(() => gameStore.gameUrl);        // 游戏链接
const doc = computed(() => gameStore.gameDoc);        // iframe内容
const currentLanguage = computed(() => locale.value); // 当前选择语言

let windowHeight = window.innerHeight;  // 窗口高度
let startY = 0;
let startTop = 0;

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

// 生命周期-页面加载完成
onMounted(() => {
  // @ts-ignore
  window.isGame = true;
  window.addEventListener('message', messageListener);

  // 获取退出游戏按钮上次浮动的位置并回显
  const appScrollHeight = getPageParam(PageParam.LOGOUT_HEIGHT);
  const oldHeightNum = appScrollHeight ? Number(appScrollHeight.replace('px', '')) : 0;
  if (appScrollHeight && draggableBox.value && oldHeightNum < windowHeight) {
    draggableBox.value.style.top = appScrollHeight
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
  gameEndApi(userStore.user?.userId!).then(() => {
    localStorage.removeItem('enteredGame');
  })
}, 1000, { leading: true, trailing: false })

// web端增加拖动 mousedown事件
function startDrag(event: any) {
  event.preventDefault();                // web端移动 阻止默认事件 解决移动时出现遮盖层
  isMoveing.value = false                // 区分点击事件和move事件
  dragging.value = true;                 // 开始移动
  startY = event.clientY;
  startTop = parseInt(draggableBox.value.style.top, 10) || 0;
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
  isMoveing.value = true
  const draggableHeight = draggableBox.value.offsetHeight
  if (dragging.value && !showRight.value && event.clientY > draggableHeight && event.clientY < (windowHeight - draggableHeight)) {
    const diffY = event.clientY - startY;
    draggableBox.value.style.top = `${startTop + diffY}px`;
    setPageParam(PageParam.LOGOUT_HEIGHT, `${startTop + diffY}px`)
  }
}

// wed 监听dom鼠标离开事件
function documentMouseUp(event: any) {
  event.preventDefault();
  const iframe = document.querySelector('iframe');
  if (iframe) {
    iframe.style.pointerEvents = 'auto';
  }
  dragging.value = false;
  setTimeout(() => { isMoveing.value = false }, 100)
}

/**
 * @description 移动端 悬浮按钮移动事件
 *
 */
function setTouchMove(e: any) {
  isMove.value = true
  const clientY = e.touches[0].clientY;
  const draggableHeight = draggableBox.value.offsetHeight
  if (clientY > draggableHeight && clientY < (windowHeight - draggableHeight) && !showRight.value) {
    draggableBox.value.style.top = `${clientY - draggableHeight / 2}px`
    setPageParam(PageParam.LOGOUT_HEIGHT, `${clientY - draggableHeight / 2}px`)
  }
}

/**
 * @description game_change_icon 点击事件
 */
function animationClick(event: any) {
  event.stopPropagation();              // 阻止事件冒泡
  if (isMoveing.value) return           // move事件中不触发点击
  showRight.value = !showRight.value
}

// 遮盖层点击事件
function shieldClick(event: any) {
  event.stopPropagation();              // 阻止事件冒泡
  showRight.value = !showRight.value
}

// 退出游戏弹窗
function isLoginOut() {
  showRight.value = false;
  isOpen.value = true
}
/**
 * @description 返回上一页
 */
const backHandle = () => {
  useNavigaterBack();
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

<style scoped>
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

.animation_box {
  transition: all 0.3s;
  transform: translateX(-6.875rem)
}

.un_animation {
  transition: all 0.3s;
  transform: translateX(0)
}

.un-show-right {
  transition: all 0.3s;
  transform: rotate(0);
}

.out-msg {
  left: 3.4rem;
}
</style>
