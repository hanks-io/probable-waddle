import { t } from '@/i18n';
import dayjs from 'dayjs';
import { switchTab } from '@/router/hooks';
import { emitter } from "@/utils/event";
import { useAppStore } from "@/store/app";
import { useVipStore } from '@/store/vip';
import { useUserStore } from "@/store/user";
import { useAgentStore } from "@/store/agent";
import { useElementStore } from '@/store/element'
import { useRouter, useRoute } from 'vue-router';
import { showLoading } from "@/utils/loading";
import { authLogoutApi } from "@/api/personal";
import { useTenantStore } from "@/store/tenant";
import { useActivityStore } from "@/store/activity";
import { activityVipInfoApi, activityVipLevelListApi } from "@/api/activity";
import { assetsChangeApi } from '@/api/personal';
import { clearAllPageParam } from "@/store/pageParam";
import { useTaskStore } from '@/store/task'
import { clearPopupQueue } from '@/hooks/ShowPopup';
import { getCurrentLocalTime, getUtcTime } from '@/utils/date';
import { formatVipLevelInfo } from "@/views/activity/vip/data";
import { moneyConvertToClient } from '@/utils/custom';
import { computed, reactive, ref, onBeforeMount, watch, onMounted, onUnmounted } from "vue";
import { showToast } from '@/utils'
import useRefreshBalance from '@/hooks/useRefreshBalance'
import { getImageUrl } from '@/utils'
const {
  completed,
  balance,
  onGetUserAssets,
  refreshBalance
} = useRefreshBalance()
export function usePerfilLogic() {
  const route = useRoute();             // 当前路由
  const router = useRouter();           // 路由实例
  const appStore = useAppStore();
  const userStore = useUserStore();
  const taskStore = useTaskStore();
  const agentStore = useAgentStore();
  const tenantStore = useTenantStore();
  const activityStore = useActivityStore();
  const vipStore = useVipStore();       // vip store实例
  const elementStore = useElementStore();
  const date = getCurrentLocalTime() as dayjs.Dayjs;       // 当前时间

  // const balance = ref(0);                 // 余额
  const loaded = ref(false);              // 是否加载完成(获取用户财务信息)
  // const completed = ref(false);           // 是否计算开始计算余额
  const isShowVipInfo = ref(false);       // 是否显示VIP信息
  const avatarModelVisible = ref(false);  // 图像选择弹窗
  const isOpen = ref(false)               // alert 弹窗
  const ifHasUnclaimedRewards = ref(false)               // vip是否有未领取奖励
  const myMainRef = ref<any>(null);
  const platformDefaultAvatar = computed(() => getImageUrl('svg/user-defluat-avatar.svg'));                        // 默认头像
  const alertOptions = computed(() => {
    return {
      title: t('components.logoutTitle'),
      message: t('components.logoutMessage'),
    }
  })
  const vipLevelInfo = reactive(
    {
      curVipLevel: 0, // 当前VIP等级
      nextVipLevel: 1, // 下一级VIP等级
      rechargeNeed: 0, // 晋级再充值
      betNeed: 0, // 晋级再投注
      rechargeRequirements: 0, // 下一级投注要求
      betRequirements: 0, // 下一级投注要求
      curRechargeAmount: 0, // 当前充值额
      curBetAmount: 0, // 当前投注额
      rechargeProgress: 0, // 充值进度
      betProgress: 0, // 投注进度
      firstLevelProgress: 0, // first皮肤 充值/提现进度
    }
  )
  // 累计领取优惠
  const assetsChangeInfo = reactive<any>({ totalRewardAmountChange: 0 })

  const tabHeight = computed(() => elementStore.tabBarHeight);                          // tabBar高度
  const user = computed(() => userStore.user);                                          // 用户信息
  const locale = computed(() => appStore.locale);                                       // 当前语言
  const agencyConfig = computed(() => agentStore.config);                               // 代理配置
  const agentConfig = computed(() => agentStore.agentConfig);                               // 代理配置
  const defaultAvatar = computed(() => userStore.defaultAvatar);                        // 默认头像
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);                // 当前商户货币
  const showLangChange = computed(() => !!tenantStore.getTenantLanguageList().length);  // 是否显示语言切换
  const ifShowRecharge = ref(false);                                                       // 是否显示充值
  const ifShowBet = ref(false);                                                             // 是否显示投注
  const unReadNum = computed(() => {                                                    // 客服中心未读总数量
    const emailNum = userStore?.unreadMailCount || 0;                                   // 未读邮件数量
    const announcementNum = userStore?.getUnreadAnnouncementCount || 0;                 // 未读公告数量
    return (emailNum + announcementNum) > 99 ? 99 : (emailNum + announcementNum);
  })
  const isHasCommission = computed(() => userStore.assets?.commission > 0);              // 是否有可领佣金
  const navLinks = computed(() => {                                                      // 功能导航
    return [
      { type: 'report', isShow: true, name: `${t('label.report')}`, icon: 'detail', fun: () => { router.push({ path: '/user/report' }) } },
      { type: 'invite', isShow: true, name: `${t('label.invite')}`, icon: 'convidar', fun: () => {   
           const path = agentConfig.value.agencyMode ==='unlimitedLevel' ? '/spread' : '/mlmAgent'
        router.push({ path })  } },
      { type: 'resgate', isShow: true, name: `${t('activity.redeem')}`, icon: 'resgate.svg', fun: goRedeem },
      { type: 'suporte', isShow: true, name: `${t('main.suporte')}`, icon: 'customer', fun: () => { router.push({ path: '/notification' }) } },
      { type: 'securityCenter', isShow: true, name: `${t('label.securityCenter')}`, icon: 'security', fun: () => { router.push({ path: '/security' }) } },
      { type: 'language', isShow: showLangChange.value, name: `${t('label.language')}`, icon: 'language', fun: () => { appStore.setLanguageModalVisible(true) } },
      { type: 'logout', isShow: true, name: `${t('label.logout')}`, icon: 'logout', fun: () => { isOpen.value = true } }
    ]
  })
  // VIP等级图片路径
  const vipIconPath = computed(() => vipStore.getVipIconPath(vipLevelInfo.curVipLevel));
  // VIP等级文本颜色
  const vipTextColor = computed(() => vipStore.getVipTextColor(vipLevelInfo.curVipLevel));

  watch(() => route.fullPath, () => {
    if (route.path === '/main/perfil') {
      balance.value = 0;
      onGetUserVip();                 // 获取用户VIP等级信息
      onGetUserAssets();              // 获取用户财务信息
      userStore.setUnreadMailCount(); // 获取未读消息数量
      getAssetsChange()               // 获取用户报表信息
    }
  })

  // 生命周期-页面加载前
  onBeforeMount(async () => {
    await userStore.getUser();        // 获取用户信息
    userStore.getReadAnnouncement();  // 获取已读公告列表
    userStore.getAnnouncements();     // 获取公告通知列表(编辑后)
    userStore.setUnreadMailCount();   // 获取未读消息数量
    agentStore.getConfig();           // 获取代理配置
    getAssetsChange()                 // 获取用户报表信息
    onGetUserVip();                   // 获取用户VIP等级信息
    if (!completed.value)             // 如果余额未在计算中，获取用户财务信息
      onGetUserAssets();
  })

  // 生命周期-页面加载后
  const paySuccessHandler = () => {
    refreshBalance(true);
  };
  // 生命周期-页面加载后
  onMounted(async () => {
    emitter.on('user/pay-success', paySuccessHandler); // 监听充值成功事件
    emitter.on('user/reward-success', paySuccessHandler); // 监听奖励到账事件

    const data = await activityVipLevelListApi();
    data.vipLevelDatas.forEach(element => {
      if (element.promotionRecharge != 0) {
        ifShowRecharge.value = true
      }
      if (element.promotionBet != 0) {
        ifShowBet.value = true
      }
    });
  })

  // 生命周期-页面卸载前
  onUnmounted(() => {
    emitter.off('user/pay-success', paySuccessHandler);
    emitter.off('user/reward-success', paySuccessHandler);
  });

  /**
   * @description 计算余额
   * @param num
   */
  function fixedNumber(num: number) {
    const str = Math.round(num).toFixed(0);
    const long = str.length;
    let res = '';
    for (let i = 0; i < long; i++) {
      res += '0';
    }
    return res + '.00'
  }

  /**
   * @description 提现按钮点击事件
   */
  async function withdrawHandle() {
    let bool = await useHandleWithdraw()
    if (bool) return
    router.push('/withdraw/apply');
  }

  /**
   * @description 充值按钮点击事件
   */
  async function rechargeHandle() {
    let bool = await useHandleRecharge()
    if (bool) return
    router.push('/recharge/apply');

  }

  /**
   * @description 刷新页面
   */
  async function handleRefresh(event: CustomEvent) {
    balance.value = 0;
    onGetUserVip();                 // 获取用户VIP等级信息
    onGetUserAssets();              // 获取用户财务信息
    userStore.setUnreadMailCount(); // 获取未读消息数量
    userStore.setAssets()           // 获取用户财务信息-推广可领取红点
    await getAssetsChange()         // 获取用户报表信息
    event.detail.complete();
  }

  /**
   * @description 跳转VIP页面
   */
  function vipHandle() {
    router.push({
      path: '/activity/vip',
    });
  }

  /**
   * @description 确定退出登录
   */
  function sureLogout() {
    isOpen.value = false
    onLogout()          // 退出登录
    clearAllPageParam() // 清除所有sessionStorage数据
    clearPopupQueue()   // 清除所有弹窗队列
    if (activityStore.pageType == 3) {   //活动页面里vip页面,用户退出后,未登录能显示,所以,清楚旧的page数据
      activityStore.pageType = 1
      activityStore.curPageType = 1
    }
  }

  /**
   * @description 接口调用-获取用户VIP等级信息
   */
  async function onGetUserVip() {
    try {
      const data = await activityVipInfoApi();
      if (data.status == true) {
        formatVipLevelInfo(data.data, vipLevelInfo);
        isShowVipInfo.value = true;
      } else {
        isShowVipInfo.value = false;
      }
      const vipListData = await activityVipLevelListApi() as any;
      ifHasUnclaimedRewards.value = vipListData.vipUserReceiveList.length ? true : false;
      vipStore.claimBtnIsEnable = vipListData.vipUserReceiveList.length ? true : false;
    } catch (error) {
      isShowVipInfo.value = false;
    }
  }

  /**
   * 去兑换码页面
   */
  const goRedeem = () => {
    activityStore.pageType = 4;

    queueMicrotask(() => {
      router.push(`/main/promo`); // 加一个延后执行， 用微任务
    })
  }

  return {
    myMainRef,
    user,
    balance,
    loaded,
    completed,
    isShowVipInfo,
    avatarModelVisible,
    merchantCy,
    locale,
    agencyConfig,
    defaultAvatar,
    showLangChange,
    unReadNum,
    isHasCommission,
    isOpen,
    alertOptions,
    navLinks,
    vipLevelInfo,
    assetsChangeInfo,
    onGetUserVip,
    onGetUserAssets,
    refreshBalance,
    sureLogout,
    handleRefresh,
    fixedNumber,
    rechargeHandle,
    withdrawHandle,
    vipHandle,
    goRedeem,
    vipIconPath,
    vipTextColor,
    ifShowRecharge,
    ifShowBet,
    tabHeight,
    ifHasUnclaimedRewards,
    agentConfig,
    platformDefaultAvatar
  };

  /**
   * @description 接口调用-退出登陆
   */
  async function onLogout() {
    await showLoading();
    try {
      await authLogoutApi();
    } finally {
      const userId = userStore.user?.id || 0;
      await appStore.removeToken();
      userStore.removeUser();
      userStore.removeAssets();
      taskStore.setTaskMap();
      activityStore.clearRedPointList();
      await activityStore.clearActivityList();
      activityStore.requestActivityList(true);
      tenantStore.clearAnnouncementInvisible();
      showToast('toast.logoutSuccess');
      setTimeout(() => {
        const params = route.query.hasOwnProperty('token') ? { token: '' } : {};
        switchTab('/main/inicio', params);
      }, 500);
      emitter.emit('user/logout', {
        userId: Number(userId),
        tenantId: Number(tenantStore.tenantId),
      })
    }
  }

  /**
   * @description 获取用户报表(账变记录)
   */
  async function getAssetsChange() {
    const today = (getUtcTime(date.endOf('day')) as dayjs.Dayjs).format();
    const assetsChangeParams = {
      changeTwoType: undefined,
      changeType: undefined,
      startTime: (getUtcTime(date.startOf('day')) as dayjs.Dayjs).format(),
      endTime: today,
      page: 1,
      pageSize: 998
    }

    try {
      const res: any = await assetsChangeApi(assetsChangeParams);
      const totalRewardAmountChange = moneyConvertToClient(res.totalRewardAmountChange ?? 0);
      Object.assign(assetsChangeInfo, { totalRewardAmountChange })
    } catch (error) {
      console.log(error);
    }
  }
}
