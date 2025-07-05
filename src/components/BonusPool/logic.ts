import { useRouter } from 'vue-router'
import { menuController } from "@ionic/vue";
import { convertMoneyToShow } from '@/utils/custom';
import { useTenantStore } from '@/store/tenant';
import { useActivityStore } from '@/store/activity'
import { useOpenSwiperLink } from "@/hooks/useLinkHandle";
import { handleInlineNavigation, handleCarouselJumpType } from '@/utils/inlineNavigation'

export default () => {
  // 一天1440 分钟 每分钟增长694 时间戳1724664586683
  // 给定的时间戳
  const tenantStore = useTenantStore();
  const router = useRouter();

  /**
   * @description 奖金池数据
   * @param {Boolean} switch 是否开启奖金池
   * @param {String} background 奖金池背景
   * @param {String} previewText 奖金池预览文字
   * @param {Number} randomInterval 请求接口间隔时间
   */
  const {
    tenantInfo,
  } = toRefs(tenantStore);

  const merchantCy = toRef(tenantStore.tenantInfo?.merchantCy); 

  const moneyClassName = computed(() => {
    const imgNumber = tenantInfo.value?.background.match(/(?<=SKIN_)\d+(?=\.png)/);
    return `money-${imgNumber}`
  });

  const moneyRef = ref();
  const bonusPoolData = inject('bonusPoolData') as { money: Ref<number> };

  const showMoney = computed(() => {
    const numberStr = convertMoneyToShow(bonusPoolData.money.value, 2);
    let zoomOut = 1 - (numberStr.length - 10) / 30;
    if (zoomOut > 1) {
      zoomOut = 1;
    }
    if (moneyRef.value) {
      moneyRef.value.$el.style.fontSize = `calc(1.25rem * ${zoomOut})`;
    }
    return numberStr
  });

  const activityStore = useActivityStore(); // 活动store
  // 点击奖金池
  function bonusClick() {
    const { targetValue, type } = tenantInfo.value?.target || {};
    if (!targetValue) {
      activityStore.pageType = 4;
      router.push(`/main/promo`);
      return;
    }
    let linkValue = null;
    if (type == 'internal') {
      linkValue = handleInlineNavigation(targetValue);
    } else {
      linkValue = targetValue
    }
    const linkType = handleCarouselJumpType(type);
    useOpenSwiperLink(linkType, linkValue)
    menuController.close('main-menu')
  }
  
  return {
    merchantCy,
    tenantInfo,
    moneyRef,
    showMoney,
    bonusClick,
    moneyClassName,
  }
}
