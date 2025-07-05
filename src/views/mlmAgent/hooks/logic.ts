import { t } from '@/i18n';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user';
import { useAgentStore } from '@/store/agent';
import { showPopup } from '@/hooks/ShowPopup'
import { useTenantStore } from '@/store/tenant';
import { PopupType } from '@/components/Popup/data';
import { agencyRewardApi } from '@/api/agent/index';
import { moneyConvertToClient } from "@/utils/custom";
import { agencyMlmInfoApi } from '@/api/agent/index'
import { PageParam, setPageParam } from '@/store/pageParam';
import { modalController } from '@ionic/vue';
import ReceiveRuleModal from '@/views/spread/common/receiveRule/index.vue';
import { throttleActivity } from '@/utils';

export function useMlmAgentLogic() {
  const appStore = useAppStore(); 	    // 用户信息
  const router = useRouter();           // 路由实例
  const agentStore = useAgentStore();   // 代理store
  const tenantStore = useTenantStore(); // 商户store
  const userStore = useUserStore();     // 用户store

  const agencyInfo = reactive({         // 当前代理信息
    claimedCommission: 0,
    currentLevel: 1,
    subordinateInfo: [
      {
        type: 'direct', title: t('mlmAgent.directSubordinate'), icon: 'agent-direct', data: [
          { name: t('mlmAgent.memberCount'), value: 0, format: false },
          { name: t('main.entrar') + t('toggle.numberofpeople'), value: 0, format: false },
          { name: t('main.entrar') + t('viewsAssets.amount'), value: 0, icon: 'agent-currency', format: true },
          { name: t('mlmAgent.firstCount'), value: 0, format: false }]
      },
      {
        type: 'team', title: t('mlmAgent.teamSubordinate'), icon: 'agent-team', data: [
          { name: t('mlmAgent.memberCount'), value: 0, format: false },
          { name: t('main.entrar') + t('toggle.numberofpeople'), value: 0, format: false },
          { name: t('main.entrar') + t('viewsAssets.amount'), value: 0, icon: 'agent-currency', format: true },
          { name: t('mlmAgent.firstCount'), value: 0, format: false }]
      }
    ],
    myAgentInfoList: [
      { name: t('mlmAgent.weekCommAmt'), value: 0, icon: 'agent-currency', format: true },
      { name: t('spread.totalCommission'), value: 0, icon: 'agent-currency', format: true },
      { name: t('mlmAgent.directSub'), value: 0, format: false },
      { name: t('mlmAgent.teamSub'), value: 0, format: false }
    ]
  });

  const isToken = computed(() => appStore.token ? true : false);        // 是否未登录
  const tenantInfo = computed(() => tenantStore.tenantInfo);            // 商户信息
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const userCommission = computed(() => moneyConvertToClient(userStore.assets?.commission || 0))    // 用户财务信息
  const claimDisabled = computed(() => userCommission.value <= 0);      //  是否可领取佣金
  const isShowClaimBtn = computed(() => agentStore.config?.receiveType == 'Normal')                 // 是否手动领取
  const isShowLeaderBoard = computed(() => agentStore.agentConfig?.isOpen);                         // 是否显示排行榜
  const config = computed(() => agentStore.config);         // 代理配置信息
  // 多级分销 jump列表数据
  const nlnAgentJumpList = computed(() => {
    return [
      { name: t('mlmAgent.nextLevelData'), bgIcon: 'jump-bg1', fun: () => { router.push({ path: '/mlmAgent/subordinate' }) } },
      { name: t('main.commissionDetails'), bgIcon: 'jump-bg2', fun: () => { router.push({ path: '/mlmAgent/commissionDetail' }) } },
      { name: t('label.invite') + t('main.rules'), bgIcon: 'jump-bg3', fun: () => { router.push({ path: '/mlmAgent/invitationRules' }) } },
      { name: t('mlmAgent.agentLevel'), bgIcon: 'jump-bg4', fun: () => { router.push({ path: '/mlmAgent/agentLevel' }) } },
      { name: t('mlmAgent.commissionRate'), bgIcon: 'jump-bg5', fun: () => { router.push({ path: '/mlmAgent/commissionRate' }) } },
    ]
  });

  initVuePageInfo() // created初始化页面数据

  /**
   * @description 生命周期: 页面挂载前
   */
  async function initVuePageInfo() {
    agentStore.setAgentConfig();          // 获取代理配置
    agentStore.getConfig();               // 获取代理配置信息
    if (!isToken.value) return            // 未登录不获取用户信息，代理信息
    await userStore.getAssets()           // 获取用户财务信息
    handleAgentInfo()                     // 处理获取的代理信息
  }

  // 处理获取的代理信息
  async function handleAgentInfo() {
    const res: any = await agencyMlmInfoApi();
    if (res && res.info) {
      const agentInfo = res.info;
      const claimedCommission = moneyConvertToClient(agentInfo?.yesterdayComm)  // 已领取佣金
      const currentLevelObj = Object.keys(agentInfo.level).length > 0 ? JSON.parse(agentInfo.level) : { level: 1 }
      const currentLevel = currentLevelObj.level;
      const subordinateInfo = [
        {
          type: 'direct', title: t('mlmAgent.directSubordinate'), icon: 'agent-direct', data: [
            { name: t('mlmAgent.memberCount'), value: agentInfo?.dayDirectAdd, format: false },
            { name: t('main.entrar') + t('toggle.numberofpeople'), value: agentInfo?.dayDirectRechargeCnt, format: false },
            { name: t('main.entrar') + t('viewsAssets.amount'), value: moneyConvertToClient(agentInfo?.dayDirectRechargeAmt), icon: 'agent-currency', format: true },
            { name: t('mlmAgent.firstCount'), value: agentInfo?.dayDirectFirstRechargeCnt, format: false }]
        },
        {
          type: 'team', title: t('mlmAgent.teamSubordinate'), icon: 'agent-team', data: [
            { name: t('mlmAgent.memberCount'), value: agentInfo?.dayTeamAdd, format: false },
            { name: t('main.entrar') + t('toggle.numberofpeople'), value: agentInfo?.dayTeamRechargeCnt, format: false },
            { name: t('main.entrar') + t('viewsAssets.amount'), value: moneyConvertToClient(agentInfo?.dayTeamRechargeAmt), icon: 'agent-currency', format: true },
            { name: t('mlmAgent.firstCount'), value: agentInfo?.dayTeamFirstRechargeCnt, format: false }]
        }
      ]
      const myAgentInfoList = [
        { name: t('mlmAgent.weekCommAmt'), value: moneyConvertToClient(agentInfo?.weekComm), icon: 'agent-currency', format: true },
        { name: t('spread.totalCommission'), value: moneyConvertToClient(agentInfo?.histComm), icon: 'agent-currency', format: true },
        { name: t('mlmAgent.directSub'), value: agentInfo?.histDirectCnt, format: false },
        { name: t('mlmAgent.teamSub'), value: agentInfo?.histTeamCnt, format: false }
      ]
      Object.assign(agencyInfo, { ...agentInfo, claimedCommission, currentLevel, subordinateInfo, myAgentInfoList })
    }
  }

  // 历史记录
  function historyClick() {
    setPageParam(PageParam.REPORT_TYPE, 'statement')
    router.push('/user/report')
  }

  // 领取佣金按钮
  const claimClick = throttleActivity(async () => {
    if (claimDisabled.value) return;
    await agencyRewardApi();
    showPopup({
      type: PopupType.BONUS,
      msg: t('popup.tips05', { amount: merchantCy.value + formatMoneyToShow(userCommission.value) }),
    })
    agentStore.resetAgencyInfo();  // 重置代理信息
    userStore.setAssets()          // 重置财务信息
  })

  // 显示佣金领取规则弹窗
  const showBonusRuleModal = async () => {
    const modal = await modalController.create({
      component: ReceiveRuleModal,
    });
    modal.present();
  }

  // 邀请链接 click
  function invitationLink() {
    router.push({ path: '/mlmAgent/invitation' });
  }

  // 排行榜 click
  function leaderBoardClick() {
    router.push({ path: '/mlmAgent/leaderBord' });
  }

  return {
    agencyInfo,
    tenantInfo,
    config,
    nlnAgentJumpList,
    claimDisabled,
    isShowClaimBtn,
    isShowLeaderBoard,
    invitationLink,
    leaderBoardClick,
    historyClick,
    claimClick,
    showBonusRuleModal
  }
}
