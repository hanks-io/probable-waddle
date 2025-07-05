import router from "@/router";
import { useI18n } from "@/hooks/useI18n";
import { showPopup } from '@/hooks/ShowPopup'

const { t } = useI18n();

type LimitType = "BIND_WITHDRAW_METHOD" | "FIRST_RECHARGE" | "SAME_NAME_ONLY_ONCE" | "SAME_TYPE_ONLY_ONCE" | "SAME_LOGIN_IP_ONLY_ONCE" | "SAME_REGISTER_IP_ONLY_ONCE"

interface LimitItemType {
  mark: boolean;
  limit: LimitType;
}

// 弹窗优先级：
export const limitOptions = [
  "SAME_TYPE_ONLY_ONCE",             // 同类型活动只能申领1次
  "SAME_REGISTER_IP_ONLY_ONCE",      // 同注册IP只能申领1次
  "SAME_LOGIN_IP_ONLY_ONCE",         // 同登录IP只能申领1次
  "BIND_WITHDRAW_METHOD",            // 绑定收款方式
  "SAME_NAME_ONLY_ONCE",             // 同姓名只能申领1次
  "FIRST_RECHARGE",                  // 完成首充可申领
	'ONLY_REGISTER_DEVICE'             // 仅限注册设备申领
]

export function validationActivityClaimLimits(res: any, type: number, activityName: any) {
  const popupType = handlePopupPriority(res);
  switch(popupType) {
    case "SAME_TYPE_ONLY_ONCE":
    case "SAME_LOGIN_IP_ONLY_ONCE":
    case "SAME_REGISTER_IP_ONLY_ONCE":
    case "SAME_NAME_ONLY_ONCE":
      return showPopup({
        type,
        msg: t("popup.activityLimitMsg03", { activityName }),
        showRightBtn: false,
        leftBtnText: t("popup.activityLimitMsg05"),
      })
    case "BIND_WITHDRAW_METHOD":
      return showPopup({
        type,
        msg: t("popup.activityLimitMsg01"),
        showRightBtn: true,
        reverseBtn: true,
        leftBtnText: t("popup.activityLimitMsg06"),
        rightBtnText: t("popup.activityLimitMsg05"),
        leftBtnCallback: bindWithdrawalAccount
      })
    case "FIRST_RECHARGE":
      return showPopup({
        type,
        msg: t("popup.activityLimitMsg02"),
        showRightBtn: true,
        reverseBtn: true,
        leftBtnText: t("label.depositNow"),
        rightBtnText:  t("popup.activityLimitMsg05"),
        leftBtnCallback: goRechargePage
      })
      case "ONLY_REGISTER_DEVICE":
        return showPopup({
          type,
          msg: t("popup.activityLimitMsg08"),
          showRightBtn: false,
          leftBtnText: t("popup.activityLimitMsg05"),
        })
      
  }
}

// 遍历限制条件，查找按limitOptions顺序没有被标记的条件
export function handlePopupPriority(res: any) {
  for (const optionItem of limitOptions) {
    const modal = res.result.some((limitItem: LimitItemType) => limitItem.limit === optionItem && !limitItem.mark);
    if (modal) {
      return optionItem ;
    }
  }
}

// 未绑定提现账户 去绑定账户页面
async function bindWithdrawalAccount() {
  const tenantStore = await useTenantStore(); // 租户store
  // 巴西跳绑定CPF 菲律宾跳绑定提现账号
  if (tenantStore?.tenantInfo?.code == 'BR') {
    router.push("/cpf")
  } else {
    router.push("/withdrawalBindAccount")
  }
}

// 去提现页面
async function goRechargePage() {
  const bool = await useHandleRecharge();
  if (bool) return;
  router.push('/recharge/apply');
}
