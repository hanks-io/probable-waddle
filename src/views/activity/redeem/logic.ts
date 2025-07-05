// 兑换码 逻辑层
import { ref, computed, onMounted, watch } from 'vue';
import { showToast } from '@/utils'
import { activityRedeemCodeApi, activityRedeemConfigApi } from '@/api/activity';
import { ActivityRedeemConfigModel } from '@/api/activity/model';
import { hideLoading, showLoading } from '@/utils/loading';
import { useTenantStore } from '@/store/tenant'
import { useSystemStore } from '@/store/system';
import { useRoute } from 'vue-router';
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { useI18n } from 'vue-i18n';
import { throttleActivity } from '@/utils';
import useLinkHandle from "@/hooks/useLinkHandle";

export default function useLogic() {
  const { t } = useI18n()
  const route = useRoute()

  const inputRef = ref()
  const redeemCode = ref('')
  const tenantStore = useTenantStore()
  const systemStore = useSystemStore()

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const activityConfig = ref<ActivityRedeemConfigModel | null>(null)
  const description = ref<string>('')
  const imgUrl = ref('')



  // 监听当前路由变动
  watch(() => route.fullPath, () => {
    if (route.path == '/main/promo') {
      getRedeemConfig()
    }
    else {
      redeemCode.value = '';
    }
  })

  function isValidRedeemCode(input: string): boolean {
    // 5 到 12 位任意字符
    const passwordRegex = /^.{5,12}$/;
    return passwordRegex.test(input);
  }

  // 图片跳转
  function onImgClick() {
    if (activityConfig.value) {
      const { LinkType, valueType, value } = activityConfig.value
      useLinkHandle(LinkType, value, valueType)
    }
  }

  // 兑换奖励
  const redemptionHandle = throttleActivity(async () => {
    if (!isValidRedeemCode(redeemCode.value)) {
      showToast(t('activity.redeem4'));
      return;
    }
    showLoading();
    const res = await activityRedeemCodeApi({
      code: redeemCode.value,
      appType: systemStore.app?.build,
    })
    if (res?.rewardAmount) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(res.rewardAmount)}),
      })
    }
    redeemCode.value = '';
    hideLoading();
  });

  // 获取图文配置
  async function getRedeemConfig() {
    showLoading();
    activityConfig.value = await activityRedeemConfigApi()
    imgUrl.value = activityConfig.value.image
    description.value = activityConfig.value.introText
  }

  onMounted(() => {
    getRedeemConfig()
  })

  /**
 * @description 输入框事件
 */
  const inputHandle = (e: CustomEvent) => {
    let value = e.detail.value
    if (value.length >= 5) {
      inputRef.value.$el.classList.remove('ion-invalid')
    } else {
      inputRef.value.$el.classList.add('ion-invalid')
    }
  }
  /**
 * @description 清空输入框事件
 */
  function clearHandle() {
    redeemCode.value = ''
    inputRef.value.$el.classList.remove('ion-invalid')
  }
  /**
 * @description 停止按钮 按下弹出右键菜单
 */
  const forbidContextmenu = (e: any) => {
    e.preventDefault();
   }
  return {
    inputRef,
    redeemCode,
    description,
    imgUrl,
    redemptionHandle,
    t,
    onImgClick,
    inputHandle,
    clearHandle,
    forbidContextmenu
  }
}
