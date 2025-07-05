import { useRouter } from 'vue-router'
import { redirectUrl } from '@/utils/app';
import { getTheme } from "@/theme/hooks";
import { useVipStore } from '@/store/vip';
import { useTenantStore } from '@/store/tenant';
import { useActivityStore } from '@/store/activity';
import { useAgentStore } from '@/store/agent';
import { jumpActivityId } from '@/utils/url'
import { bannerListApi } from '@/api/normal/index'
import { ActivityListModel } from "@/api/activity/model";
import { CarouselConfigModel } from '@/api/normal/model';
import { handleInlineNavigation, handleCarouselJumpType } from '@/utils/inlineNavigation'
import { maxBy, isNaN, isInteger, random, showToast, httpCompletion,checkNumByStr } from '@/utils'
const { skin, theme } = getTheme();


type ItemType = {
  targetType: string,
  targetValue: string,
}


export default function useActivityBarLogic() {
  const router = useRouter();               // 路由对象
  const tenantStore = useTenantStore();     // 租户store
  const activityStore = useActivityStore(); // 活动store
  const agentStore = useAgentStore();       // 代理store
  const activity = ref<any[]>([]);  // 活动
  const conditionAmount = ref('');  // 奖励条件金额
  const promotionalOne = reactive<any>({})    // 营销图片1
  const promotionalTwo = reactive<any>({})    // 营销图片2
  const promotionalThree = reactive<any>({})  // 营销图片3
  const showContent = ref(false);             // 解决ion-img刷新出现白框问题

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 商户货币

  initVuePageInfo() // created初始化页面数据

  /**
  * @description 生命周期: 页面挂载前
  */
  async function initVuePageInfo() {
    showContent.value = false;
    try {
      const lobbyBannerList: any = await bannerListApi({ bannerType: 'lobby_banner' });
      let newArr = [];
      if (lobbyBannerList?.length) {
        forPromotionalList(lobbyBannerList)
        newArr = lobbyBannerList.map((item: any) => {
          const linkType: any = handleCarouselJumpType(item.targetType);
          let linkValue: any = '';
          if (item.targetType == 'internal') {
            const targetValue = JSON.parse(item.targetValue);
            linkValue = handleInlineNavigation(targetValue);
          } else {
            linkValue = item.targetValue
          }
          return {
            id: item.id,
            name: item.name,
            content: item.imageUrl,
            sort: item.sort,
            linkType,
            linkValue
          }
        })
      }
      const oneObj = newArr.find((item: any) => item.sort == 1);
      const twoObj = newArr.find((item: any) => item.sort == 2);
      const threeObj = newArr.find((item: any) => item.sort == 3);
      Object.assign(promotionalOne, { ...oneObj });
      Object.assign(promotionalTwo, { ...twoObj });
      Object.assign(promotionalThree, { ...threeObj });
    } catch (error) {
    } finally {
      showContent.value = true;
    }
  }

  const promotionalList = ref<any[]>([]); // 营销图片列表
  function forPromotionalList(list: any[]) {
    type ItemType = {
      targetType: string,
      targetValue: string,
    }

    promotionalList.value = list.sort((a, b) => a.sort - b.sort).map((item: ItemType) => {
      const linkType: any = handleCarouselJumpType(item.targetType);
          let linkValue: any = '';
          if (item.targetType == 'internal') {
            const targetValue = JSON.parse(item.targetValue);
            linkValue = handleInlineNavigation(targetValue);
          } else {
            linkValue = item.targetValue
          }

          return {
            ...item,
            linkType,
            linkValue
          }
    })
  }

  // 监听活动列表
  watch(() => activityStore.activityList, (val) => {
    if (val.length) {
      const activityList = val.filter(item => item.type === 'Recharge');
      let firstRechargeList: ActivityListModel['activityList'] = [];
      activityList.forEach(item => {
        try {
          const condition = JSON.parse(item.condition as string);
          if (condition.type === 'FIRST') {
            item.condition = condition
            firstRechargeList.push(item);
          }
        } catch (e) {
          return;
        }
      });
      if (firstRechargeList.length) {
        // condition.rewardLevels 是数组  先获取condition.rewardLevels 数组中的最大rewardAmount值
        const list: any[] = firstRechargeList.map(it => {
          // 获取it.condition.rewardLevels 数组 rewardAmount最大的值的对象
          const target = maxBy(it.condition.rewardLevels, (el) => el?.rewardAmount)
          //在外添加一个属性，
          it.maxRewardAmount = Number(target?.rewardAmount)
          return it
        })
        const target = maxBy(list, (it) => it.maxRewardAmount)
        const currentList = list.filter(it => it.maxRewardAmount === target.maxRewardAmount)
        //  如果有最大奖励金额活动相同时  收集起来点击时随机跳转一个
        if (currentList.length > 1) {
          activity.value = currentList
        } else {
          activity.value = [target]
        }
        const value = target?.maxRewardAmount / 100
        conditionAmount.value = isNaN(value) ? '' : isInteger(value) ? `${value}` : formatMoneyToShow(value)
      }
    }
  }, { immediate: true });

  /**
   * @description: 跳转到活动详情
   */
  function navigate() {
    if (!activity.value.length) return;
    let i = 0
    // 最大奖励金额活动相同时  随机跳转一个
    if (activity.value.length > 1) {
      i = random(0, activity.value.length - 1)
    }

    router.push(`/activity/recharge/${activity.value[i]?.id}`)
  }

  // 营销图片 click 事件
  async function promotionalClick(item: CarouselConfigModel[0]) {
    if (item.linkType === 'url') {
      redirectUrl(httpCompletion(item.linkValue))
    } else if (item.linkType === 'activity') {
      if (checkNumByStr(item.linkValue)) {
        const activityList = await activityStore.getActivityList();
        const activity: any = activityList.find(it => it?.id === Number(item.linkValue));
        if (!activity) {
          showToast('activity.notMet')
          return
        }
        if (activity?.type === 'Rebate') {
          activityStore.pageType = 2;
          router.push(`/main/promo`);
        } else {
          const activityRouterId = jumpActivityId(activity);
          router.push(`/activity/${activity?.type}/${activityRouterId}`);
        }
      } else if (item.linkValue === '/Redeem') {
        activityStore.pageType = 4;
        router.push(`/main/promo`);
      } else if (item.linkValue == '/') {
        router.replace('/launch').then(() => {
          location.reload();
        });
      } else {
        let linkValue = item.linkValue
        if (linkValue == '/main/entrar' || linkValue == '/recharge/apply') {
          const bool = await useHandleRecharge()
          if (bool) return
        } else if (linkValue == '/main/withdraw' || linkValue == '/withdraw/apply') {
          const bool = await useHandleWithdraw()
          if (bool) return
        }
        if (linkValue == '/activity/vip') {
          // 如果是vip页面, 则检测是否有权限
          const vipStore = useVipStore()
          await vipStore.getActivityVipType()
          if (!vipStore.activityVipType) return;
        }
        router.push(item.linkValue);
      }
    }
  }


  const jumpPage = (item: { linkValue: ItemType, linkType: string }, index: number) => {
    const { linkValue, linkType } = item;
    if (linkType && linkValue) {
      promotionalClick(item);
      return;
    }
    if (index === 0) {
      const path = agentStore.agentConfig.agencyMode ==='unlimitedLevel' ? '/spread' : '/mlmAgent'
      router.push({ path })
    };
    if (index === 1) navigate();
    if (index === 2) router.push('/main/promo');
  }


  return {
    theme,
    activity,
    promotionalList,
    conditionAmount,
    merchantCy,
    promotionalOne,
    promotionalTwo,
    promotionalThree,
    showContent,
    promotionalClick,
    navigate,
    jumpPage
  }
}
