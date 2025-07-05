import router from '@/router'
import { WithdrawPasswordParams } from '@/api/assets/model';
import { withdrawPasswordApi } from '@/api/assets/index';
import { showToast } from '@/utils'
import { PageParam, setPageParam } from '@/store/pageParam';
import i18n from '@/i18n';

export default () => {
  const { t } = i18n.global
  const appStore = useAppStore();   // 全局信息
  const userStore = useUserStore(); // 用户信息
  const password = ref('');         // 密码
  const confirmPassword = ref('');  // 确认密码
  const loaded = ref(false);        // 是否加载完成
  const btnLoading = ref(false);    // 按钮加载状态
  const withdrawPasswordParams = reactive<WithdrawPasswordParams>({
    password: '',
    operatingType: { operatingType: 'add' },
  });

  /**
   * @description 密码输入事件
   */
  const passwordHandle = (evet: string) => {
    password.value = evet;
  }

  /**
   * @description 确认密码输入事件
   */
  const confirmPasswordHandle = (evet: string) => {
    confirmPassword.value = evet;
  }

  /**
   * @description 确认按钮事件
   */
  const confirmHandle = () => {
    if (password.value.length < 6) return showToast('toast.invalidPassword');
    if (password.value !== confirmPassword.value) return showToast('toast.twoPsInconsistent');
    withdrawPasswordParams.password = password.value;
    addWithdrawPassword();
  }

  /**
   * 生命周期: 组件加载前
   */
  onBeforeMount(() => {
    onGetUserAssets();  // 获取用户财务信息
  })

  /**
   * @description 接口调用: 获取用户财务信息
   */
  const onGetUserAssets = async () => {
    const res = await userStore.setAssets();  // 获取用户财务信息
    if (res) {
      loaded.value = true;
      if (res.isAssetPassword) {
        setPageParam(PageParam.WITHDRAW_MAIN, WithdrawPageType.WITHDRAW)
        router.replace({ path: '/main/withdraw' });
      }
    } else {
      setTimeout(() => {
        onGetUserAssets();
      }, 3000);
    }
  }

  /**
   * @description 接口调用: 添加提现密码
   */
  const addWithdrawPassword = async () => {
    if (btnLoading.value) return;
    btnLoading.value = true;
    try {
      await withdrawPasswordApi(withdrawPasswordParams)
      showToast(t('main.set') + ' ' + t('main.success'));
      router.replace({ path: '/withdrawPWCompletion' });
    } catch (error) {
      showToast('toast.settingFailed');
    } finally {
      setTimeout(() => {
        btnLoading.value = false;
      }, 1000);
    }
  }

  return {
    password,
    confirmPassword,
    loaded,
    btnLoading,
    confirmHandle,
    passwordHandle,
    confirmPasswordHandle,
    onGetUserAssets
  }

}




