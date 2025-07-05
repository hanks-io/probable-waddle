import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app'
import { showLoading } from '@/utils/loading';
import { computed, ref, reactive } from 'vue';
import { useTenantStore } from '@/store/tenant';
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { useActivityStore } from '@/store/activity';
import { moneyConvertToClient } from '@/utils/custom'
import { getCustomerActivityId, type TemplateType } from '@/utils/custom'
import { getActivityDetail, activityApplyApi } from '@/api/activity';
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { throttleActivity } from '@/utils';

export function useInviteCpfLogic() {
  const { t } = useI18n();
  const appStore = useAppStore();
  const activityStore = useActivityStore(); // 活动store
  const tenantStore = useTenantStore();

  const { id, activityType } = getCustomerActivityId();

  const activityName = ref<string>('');
  const activityRule = ref<string[]>([]);
  const openShareModal = ref<boolean>(false);
  const availableMoney = ref<number>(0);
  const isAvailable = ref<boolean>(false);

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 商户币种
  const isToken = computed(() => appStore.token ? true : false);
  const activityFinished = computed(() => {
    const signActivity = activityStore.activityList.find(item => item.id == id);
    return signActivity?.status == 'FINISHED'
  })

  initVue();
  // create init初始化
  function initVue() {
    getInviteCpfActivityDetail();
  }

  // 获取活动详情
  async function getInviteCpfActivityDetail() {
    showLoading();
    const res = await getActivityDetail(Number(id), activityType);
    isAvailable.value = res?.rewardAmount > 0;
    // 处理可领取金额
    availableMoney.value = moneyConvertToClient(res?.rewardAmount);
    if (res?.multilingual) {
      const language = (await appStore.getLocale()) as Language
      const multilingual = res.multilingual as Record<string, string>;
      // 处理活动名称
      activityName.value = await getCurrentActivityName(multilingual, language, activityType);
      // 处理活动规则
      if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
        const ruleParam = JSON.parse(multilingual.rule)
        activityRule.value = generateDefultRules(language, activityType, ruleParam.variablesValue).split('\n').map(item => item.trim())
      } else {
        activityRule.value = multilingual.rule.split('\n').map(item => item.trim());
      }
    }
  }

  // 复制链接 按钮
  function copyClick() {
    openShareModal.value = true
  }

  // 领取按钮
  const availableClick = throttleActivity(async () => {
    if (!isAvailable.value) return;
    try {
      const res = await activityApplyApi({
        id: Number(id),
        applyInfo: {
          type: activityType,
          info: {}
        }
      })
      if (res?.result && !res?.allMark) {
        return validationActivityClaimLimits(res, PopupType.BONUS, activityName.value);
      }
      const msg = t('activity.receiveSuccessfully', { amount: merchantCy.value + availableMoney.value });
      showPopup({ type: PopupType.BONUS, msg });
      getInviteCpfActivityDetail();
    } catch (error) {}
  });

  // 关闭分享弹窗
  function closeShareModalFun() {
    openShareModal.value = false;
  }

  return {
    activityName,
    activityRule,
    isToken,
    activityFinished,
    merchantCy,
    openShareModal,
    availableMoney,
    isAvailable,
    closeShareModalFun,
    copyClick,
    availableClick
  }
}


export const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const templateList = {
    'style_0': () => import(`@/views/activity/inviteCpf/components/default/index.vue`),
    'style_1': () => import(`@/views/activity/inviteCpf/components/first/index.vue`),
    'style_2': () => import(`@/views/activity/inviteCpf/components/second/index.vue`)
  }
  return markRaw(defineAsyncComponent(templateList[defStyle])) as unknown as ComponentPublicInstance;
}
