import i18n from '@/i18n';
import { showToast } from '@/utils'
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user';
import { showPopup } from '@/hooks/ShowPopup'
import { useAgentStore } from '@/store/agent';
import { useTenantStore } from '@/store/tenant'
import { PopupType } from '@/components/Popup/data';
import { agencyRewardApi } from '@/api/agent/index';
import { moneyConvertToClient } from '@/utils/custom'
import { generatePoster } from '@/utils/generatePoster';
import { hideLoading, showLoading } from '@/utils/loading';
import { computed, inject, onBeforeMount, ref } from 'vue';
import { PageParam, setPageParam } from '@/store/pageParam';
import { transformMoney, unTokenPeferralInfo, shareAgentUrl } from '@/utils/agentShare'
import { modalController } from '@ionic/vue';
import ReceiveRuleModal from '@/views/spread/common/receiveRule/index.vue';
import { throttleActivity } from '@/utils';



export function useReferralInfoLogic () {
  const { t } = i18n.global;


  const appStore = useAppStore() 		      // 用户信息
  const tenantStore = useTenantStore()	  // 租户信息
  const userStore = useUserStore();       // 用户store
  const agentStore = useAgentStore();     // 代理store
  const router = useRouter();             // 路由类实例
  
  const loaded = ref(false);              // 页面是否加载完成

  const userId = computed(() => userStore.user?.id);               // 用户id
  const isToken = computed(() => appStore.token ? true : false)    // 是否未登录
  const userCommission = computed(() => moneyConvertToClient(userStore.assets?.commission || 0))    // 用户财务信息
  const agencyInfo = computed(() => isToken.value ? transformMoney(agentStore.agencyInfo) : unTokenPeferralInfo());    // 代理信息
  const segmentList = computed(() => agentStore.shareConfig?.filter((v:any) => v.isOpen) ?? []);    // 分享平台按钮列表
  const claimDisabled = computed(() => userCommission.value <= 0)  // 是否可领佣金
  const agancyInfo = computed(() => isToken.value ? transformMoney(agentStore.agencyInfo) : unTokenPeferralInfo());    // 代理信息 
  const config = computed(() => agentStore.config);         // 代理配置信息
  const shareTitle = computed(() => tenantStore.tenantInfo?.name)  // 商户名称
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const { shareUrl } = useShareUrl();

  const setSideValue: Function | undefined = inject('setSideValue');

  /**
   * 生命周期: 页面加载前
   */
  onBeforeMount(async () => {
    if (isToken.value) {  // token存在 已登录
      await agentStore.resetAgencyInfo();  // 重置代理信息
      await userStore.getAssets()          // 获取用户财务信息
    }
    loaded.value = true
  });

  /**
   * @description 显示佣金领取规则弹窗
   */
  const showBonusRuleModal = async () => {
    const modal = await modalController.create({
      component: ReceiveRuleModal,
    });
    modal.present();
  }


  /**
   * @description 保存二维码
   */
  async function saveQrCode() {
    showLoading();
    await generatePoster(
      config.value?.logo!,
      shareUrl.value,
      config.value?.siteName!,
      config.value?.icon!,
      config.value?.background!,
      config.value?.intro!
    );
    hideLoading();
  }

  /**
   * @description 路由跳转
   */
  function routerReplace(type: string) {
    setSideValue && setSideValue(type);
  }

  // 领取记录 click 事件 跳转到报表-》账户明细
  function claimHistory() {
    setPageParam(PageParam.REPORT_TYPE, 'statement')
    router.push('/user/report')
  }

  /**
   * @description 领取佣金
   */
  const receiveHandle = throttleActivity(async () => {
    // if (claimDisabled.value) return;
    await agencyRewardApi();
    showPopup({
      type: PopupType.BONUS,
      msg: t('popup.tips05', { amount: merchantCy.value + formatMoneyToShow(userCommission.value) }),
    })
    agentStore.resetAgencyInfo();  // 重置代理信息
    userStore.setAssets()          // 重置财务信息
  })



  return {
    loaded,
    userId,
    isToken,
    agencyInfo,
    segmentList,
    claimDisabled,
    agancyInfo,
    config,
    shareTitle,
    merchantCy,
    shareUrl,
    userCommission,
    saveQrCode,
    routerReplace,
    claimHistory,
    receiveHandle,
    showBonusRuleModal,
  }

  function openSchemeUrl(url: any) {
    return new Promise((resolve) => {
      // 创建一个iframe用于尝试打开scheme URL
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
  
      // 设置一个计时器，如果一段时间后iframe没有被打开，则认为操作失败
      const timer = setTimeout(() => {
        document.body.removeChild(iframe);
        resolve(false);
      }, 600);
  
      // 监听页面激活事件，如果页面被激活，则认为scheme URL被成功打开
      window.addEventListener('visibilitychange', function onVisibilityChange() {
        if (document.visibilityState === 'visible') {
          clearTimeout(timer);
          document.body.removeChild(iframe);
          window.removeEventListener('visibilitychange', onVisibilityChange);
          resolve(true);
        }
      });
    });
  }
}
