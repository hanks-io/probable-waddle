
import { copy } from '@/hooks/Copy';
import { useAppStore } from '@/store/app';

export default (props) => {
  const appStore = useAppStore(); // app信息
  const webPushRegId = computed(() => appStore.webPushRegId);

  const pressTimer = ref<NodeJS.Timeout>(); // 按压定时器

  const { markChange } = inject('footerData') as { markChange: (value: boolean) => void };

  const iconUrl = computed(() => props.loadImage?.icon1 || props.src);
  /**
   * @description 开始按压
   */
  function startPress() {
    pressTimer.value = setTimeout(() => {
      markChange(true)
      copy(webPushRegId.value);
    }, 2000);
  }
  /**
   * @description 结束按压
   */
  function endPress() {
    if (pressTimer.value) {
      clearTimeout(pressTimer.value);
      pressTimer.value = undefined;
    }
    markChange(false)
  }



  return {
    iconUrl,
    endPress,
    startPress,
  }
}
