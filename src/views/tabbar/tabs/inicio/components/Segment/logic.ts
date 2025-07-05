import { useRoute, useRouter } from 'vue-router'

const disableTab = ref(false); // 定义导航标签禁用状态

let isDown: boolean;
let startX: number;
let scrollLeft: number;

export default function useSegmentLogic(props: any, emit: any) {
  const gameStore = useGameStore(); // 导入游戏store
  const route = useRoute();
  const router = useRouter();
  const tabValue = ref(''); // 定义接参对应使用变量(props不推荐组件内赋值)

  const tabs = computed(() => gameStore.sortAll); // 定义导航标签数组
  const checkedLineleft = ref('1.9375rem');    //定义下划线初始位置
  const checkedLineWidth = ref('24.375rem');    //定义下划线可活动区域总的长度


  /**
   * @description 导航标签切换事件
   * @param event 事件对象
   */
  function tabChange(event: any) {
    tabValue.value = event.detail.value;
    emit('update:modelValue', event.detail.value);  // 传值予父组件,父组件使用v-model接参
    emit('segmentChange', event);                   // 传值予父组件,父组件使用@segmentChange接参
    if (tabValue.value === 'POPULAR') {
      router.push('/game/search/POPULAR');
    } else if (tabValue.value === 'SPORTS') {
      router.push('/game/category/sport');
    } else {
      router.push(`/game/category/${tabValue.value}/0`);
    }
  }
  /**
   * @description 导航下方线切换事件
   * @param event 事件对象
   */
  function checkedLineChange(event: any) {
    checkedLineleft.value = `${event.target.offsetLeft + event.target.offsetWidth / 2 - 4}px`;
  }

  /**
   * @description 鼠标按下事件
   * @param e 事件
   */
  function handleMouseDown(e: any) {
    isDown = true;
    startX = e.pageX - e.currentTarget.offsetLeft;
    scrollLeft = e.currentTarget.scrollLeft;
  }
  function handleMouseUp(e: any) {
    isDown = false;
    disableTab.value = false;
  }
  function handleMouseLeave() {
    isDown = false;
    disableTab.value = false;
  }
  function handleMouseMove(e: any) {
    if (!isDown) return;
    e.preventDefault();
    disableTab.value = true;
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX);
    e.currentTarget.scrollLeft = scrollLeft - walk;
  }

  // row布局专用watch
  watch(() => gameStore.platformHotGameList, (list) => {
    emit('tabChange', { filterGameList: list })
  }, { immediate: true });

  watch(() => route.name, (routeName) => {
    if (routeName !== 'inicio') {
      tabValue.value = ''
    }
  });

  // 生命周期钩子: 组件挂载前
  onBeforeMount(() => {
    gameStore.loadHomeGames(); // 加载首页游戏
  });

  return {
    router,
    tabValue,
    tabs,
    disableTab,
    tabChange,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
    checkedLineleft,
    checkedLineWidth,
    checkedLineChange,
  }
}