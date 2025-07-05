import router from '@/router'
import { useTenantStore } from '@/store/tenant'
import { showToast,debounce } from '@/utils'
import { PopupType } from '@/components/Popup/data';
import { setPageParam, PageParam } from '@/store/pageParam';
import { showLoading } from '@/utils/loading';
import useBetByGoto from './useBetByGoto'
import { RegisterRequireSchema } from '@/enums/types';
import { ZWithdrawPWAuthType } from '@/enums/types';



export default debounce(async () => {
  const appStore = useAppStore();				// 应用信息
  const userStore = useUserStore();			// 用户信息
  const tenantStore = useTenantStore() // 商户store
  const { t } = useI18n()
  if (!appStore.token) {
    showLogin();
    return true
  }

  showLoading()

  await Promise.all([
    userStore.setWithdrawType(),
    userStore.setAssets(),
    tenantStore.resetAuthInfo()
  ])

  if (!userStore.withdrawType.length || !userStore.withdrawSwitch) {
    showToast('toast.maintenanceWithdraw');
    return true
  }        // 判断提现类型是否为空或关闭, 弹出提示

  // 如果未设置资金密码，跳转设置资金密码页面
  if ((!userStore.assets?.passwordSwitch || userStore.assets?.passwordSwitch === 'ON') && !userStore.assets?.isAssetPassword) {
    showPopup({
      type: PopupType.TIPS,
      msg: t('popup.tips06'),
      leftBtnCallback: () => {
        setPageParam(PageParam.IS_TAB_WITHDRAW, true); // 设置去提现的类型 true首页一级提现 false 二级提现
        const type = tenantStore.tenantInfo?.withdrawPasswordAuthMethod;
        if (type === ZWithdrawPWAuthType.enum.NONE) {
          router.push('/withdrawPW');
        }
        else {
          router.push('/security/verify/asset');
        }
      }
    })
    return true;
  }
  setPageParam(PageParam.WITHDRAW_MAIN, WithdrawPageType.WITHDRAW);
  return false         // 设置提现页面类型(提现)
}, 1000, { leading: true, trailing: false });



