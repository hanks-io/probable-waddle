// 充值活动 逻辑层
import { computed, onBeforeMount, reactive, ref } from "vue";
import { activityRechargeInfoApi } from "@/api/activity";
import { moneyConvertToClient, getCustomerActivityId } from "@/utils/custom";
import { useI18n } from "vue-i18n";
import { ActivityRechargeInfoModel, ActivityRechargeRewardItem } from "@/api/activity/model";
import { ZActivityRuleType, ZNameType, ZTActivityTypes, ZAwardType } from "@/enums/types/activity.type";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { useTenantStore } from "@/store/tenant";
import { validationActivityClaimLimits } from "@/hooks/ValidActivityClaimLimit";
import { generateDefultRules, Language, getActivityDefaultName } from "@/i18n/ruleHelper/activityRule";
import { hideLoading, showLoading } from "@/utils/loading";
import { activityApplyApi } from "@/api/activity";
import { isEmpty } from "@/utils";
import { isJSONStr } from "@/utils/verify";
import { showPopup } from "@/hooks/ShowPopup";
import { PopupType } from "@/components/Popup/data";
import { throttleActivity } from "@/utils";
import { getTheme } from "@/theme/hooks";
import { ActivityNames } from "@/router/modules/activity";

export default function useLogic() {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const tenantStore = useTenantStore();

  const { t } = useI18n();

  const { id: activityId } = getCustomerActivityId();
  const isLoaded = ref(false);
  const activityInfo = reactive({
    name: "",
    awardType: "",
    awardCount: 0,
    description: "",
    mainMediaShare: false, // 充值活动的主媒体分享卡片开关
  });

  const rewardList = ref<ActivityRechargeRewardItem[]>([]);
  const showBtnClaim = computed(() => {
    return ZAwardType.enum.ACTIVITY === activityInfo.awardType;
  });
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 当前商户货币

  /**
   * @description 生命周期: 页面挂载前
   */
  onBeforeMount(async () => {
    await getActivityConfig();
  });

  const descriptionList = computed(() => {
    if (activityInfo.description) {
      return activityInfo.description.split("\n");
    }
    return [];
  });

  async function getActivityConfig() {
    isLoaded.value = false;
    const data = (await activityRechargeInfoApi(Number(activityId))) as ActivityRechargeInfoModel;
    const { type, nameType, nameParams, name, rule, ruleType, awardType, awardCount, config } = data;

    activityInfo.awardType = awardType;
    activityInfo.awardCount = moneyConvertToClient(awardCount);
    activityInfo.mainMediaShare = config.mainMediaShare === 'ON';

    const language = (await appStore.getLocale()) as Language;
    if (nameType === ZNameType.enum.DEFAULT && isJSONStr(nameParams)) {
      const nameParamsObj = JSON.parse(`${nameParams}`);
      activityInfo.name = getActivityDefaultName(language, type, nameParamsObj.variablesValue);
    } else {
      activityInfo.name = name;
    }
    if (ruleType === ZActivityRuleType.enum.DEFAULT) {
      if (isEmpty(rule)) return;
      const ruleParams = JSON.parse(rule);
      activityInfo.description = generateDefultRules(language, ZTActivityTypes.enum.Recharge, ruleParams.variablesValue);
    } else {
      activityInfo.description = rule;
    }

    rewardList.value = config.rewardLevels.map((item) => {
      item.conditionAmount = moneyConvertToClient(item.conditionAmount);
      item.rewardAmount = moneyConvertToClient(item.rewardAmount);
      return item;
    });
    isLoaded.value = true;
  }

  // 领取按钮
  const claimHandle = throttleActivity(async () => {
    if (!activityInfo.awardCount) return;
    showLoading();
    const data = await activityApplyApi({
      id: activityId,
      applyInfo: {
        type: ZTActivityTypes.enum.Recharge,
        info: {
          userId: userStore.user?.userId!
        }
      }
    });
    // 未满足领取限制
    if (data?.result && !data?.allMark) {
      return validationActivityClaimLimits(data, PopupType.BONUS, activityInfo?.name);
    }
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t("popup.tips04", { amount: merchantCy.value + convertMoneyToShow(data.awardCount) })
      });
    }
    await getActivityConfig();
    hideLoading();
  });

  return {
    merchantCy,
    descriptionList,
    activityInfo,
    rewardList,
    showBtnClaim,
    isLoaded,
    claimHandle
  };
}

export const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const { skin, activityConfig } = getTheme();
  const template = activityConfig?.[ActivityNames.Recharge]?.template as keyof typeof templateList;

  const templateList: Record<string, () => Promise<typeof import("*.vue")>> = {
    "default": () => import("@/views/activity/recharge/default/index.vue"),
    "first": () => import("@/views/activity/recharge/first/index.vue"),
    "second": () => import("@/views/activity/recharge/second/index.vue"),
    "style_1": () => import("@/views/activity/recharge/style_1/index.vue"),
    "style_18": () => import("@/views/activity/recharge/style_18/index.vue"),
  };

  const component = templateList[template] ?? templateList[defStyle] ?? templateList[skin as keyof typeof templateList];
  return markRaw(defineAsyncComponent(component)) as unknown as ComponentPublicInstance;
};
