import i18n from '@/i18n';
import { showToast } from '@/utils'
import { delay } from '@/utils/delay';
import { useAppStore } from '@/store/app';
import { userBindApi } from '@/api/personal';
import { useUserStore } from '@/store/user';
import { useTenantStore } from '@/store/tenant';
import { useRoute, useRouter } from 'vue-router';
import { validatePassword } from '@/utils/custom';
import { withdrawPasswordApi } from '@/api/assets';
import { UserBindParams } from '@/api/personal/model';
import { clearAllPageParam } from "@/store/pageParam";
import { hideLoading, showLoading } from '@/utils/loading';
import { WithdrawPasswordParams } from '@/api/assets/model';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { authChangePasswordApi, optVerifyApi } from '@/api/normal';
import { ChangePwdParams, OptVerifyParams } from '@/api/normal/model';

export function usrSecurityConfirmLogic() {
  const { t } = i18n.global

  const route = useRoute();             // 当前路由信息
  const router = useRouter();           // 路由实例
  const appStore = useAppStore();       // 应用状态
  const userStore = useUserStore();     // 用户状态
  const tenantStore = useTenantStore(); // 商户状态

  const formRef = ref();                // 表单ref
  const password = ref('');             // 资金密码
  const passwordRef = ref();            // 密码输入框ref
  const confirmPasswordRef = ref();     // 确认密码输入框ref
  const newPassword = ref('');          // 确认新密码
  const btnLoading = ref(false);        // 按钮加载状态
  const showPassword = ref(false);      // 是否显示密码

  const bindType = computed(() => route.params.type?.toString() || 'asset');                            // 绑定类型
  const isAssetPassword = computed(() => userStore?.assets?.isAssetPassword);                           // 是否设置资金密码
  const verifyType = computed(() => route.query.type?.toString() as OptVerifyParams['identifierType']); // 认证类型

  const changePwdParams = reactive<ChangePwdParams>({ // 修改密码参数
    token: '',
    newPassword: ''
  })
  const assetPasswordParams = reactive<WithdrawPasswordParams | any>({ // 添加资金密码参数
    password: 0,
    operatingType: { operatingType: 'add' },
  });
  const optVerifyParams = reactive<OptVerifyParams>({ // 验证验证码参数
    type: checkOptVerifyParams(),
    identifier: '',
    identifierMode: 'specificMatch',
    identifierType: verifyType.value == 'email' ? 'email' : 'phone',
    otp: ''
  })
  const userBindParams = reactive<UserBindParams>({   // 绑定新手机号/邮箱参数
    identifierType: bindType.value == 'email' ? 'email' : 'phone',
    oldIdentifierToken: '',
    newIdentifierToken: ''
  })

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    userStore.getUser();          // 获取用户信息
    appStore.getOldVerifyToken(); // 获取旧验证码token
    tenantStore.getTenantInfo();  // 获取商户信息(地区代码)
    userStore.setAssets();        // 获取资产信息(是否设置资金密码)
  })

  /**
   * @description 显示密码
   */
  function showPasswordHandle() {
    showPassword.value = !showPassword.value;
  }

  /**
   * @description 密码输入事件监听回调(验证格式)
   * @param value 输入值
   */
  function passwordInput(ev: any) {
    const value = ev.target.value;
    passwordRef.value.$el.classList.remove('ion-valid');
    passwordRef.value.$el.classList.remove('ion-invalid');
    validatePassword(value) ? passwordRef.value.$el.classList.add('ion-valid') : passwordRef.value.$el.classList.add('ion-invalid');
  }

  /**
   * @description 确认密码输入事件监听回调(验证格式)
   */
  function confirmPasswordInput(ev: any) {
    const value = ev.target.value;
    confirmPasswordRef.value.$el.classList.remove('ion-valid');
    confirmPasswordRef.value.$el.classList.remove('ion-invalid');
    validatePassword(value) ? confirmPasswordRef.value.$el.classList.add('ion-valid') : confirmPasswordRef.value.$el.classList.add('ion-invalid');
  }

  /**
   * @description 密码输入框失去焦点事件
   */
  function passwordBlur() {
    passwordRef.value.$el.classList.add('ion-touched');
  }

  /**
   * @description 确认密码输入框失去焦点事件
   */
  function confirmPasswordBlur() {
    confirmPasswordRef.value.$el.classList.add('ion-touched');
  }

  /**
   * @description 资金密码输入事件
   */
  function newPasswordHandle(event: string) {
    assetPasswordParams.password = event;
  }

  /**
   * @description 确认密码输入事件
   */
  function confirmPasswordHandle(value: string) {
    password.value = value;
    if (password.value.length == 6) {
      if (assetPasswordParams.password != Number(password.value))
        return showToast('toast.twoPsInconsistent');
      if (verifyType.value != 'password') {
        assetPasswordParams.operatingType = {
          operatingType: isAssetPassword.value ? 'editByToken' : 'add',
          token: appStore.oldVerifyToken
        };
      }
      showLoading();
      submitForm(new Event('submit'));
    }
  }

  /**
   * @description 提交表单
   * @param event 事件对象
   */
  function submitForm(event: Event) {
    event.preventDefault(); // 阻止默认事件
    const classList = formRef.value.querySelectorAll('.ion-invalid') // 获取所有未通过验证的元素
    if (classList.length) return // 未通过验证的元素存在时, 阻止提交
    if (bindType.value === 'password') {
      changePwdParams.token = appStore.oldVerifyToken;
      if (changePwdParams.newPassword != newPassword.value)
        return showToast('toast.twoPsInconsistent');
      return onChangePwd();                  // 修改密码
    } else if (bindType.value === 'asset') {
      return onAssetsPassword();             // 添加/修改资金密码
    }
    onOptVerify();                           // 验证新手机号/邮箱
  }

  return {
    formRef,
    passwordRef,
    confirmPasswordRef,
    newPassword,
    showPassword,
    bindType,
    changePwdParams,
    showPasswordHandle,
    passwordInput,
    confirmPasswordInput,
    passwordBlur,
    confirmPasswordBlur,
    newPasswordHandle,
    confirmPasswordHandle,
    submitForm
  }

  /**
   * @description 检测生成验证码参数
   */
  function checkOptVerifyParams() {
    switch (bindType.value) {
      case 'phone':
        return 'bind_phone'
      case 'email':
        return 'bind_email'
      case 'password':
        return 'change_password'
      default:
        return 'change_asset_password'
    }
  }

  /**
   * @description 接口请求: 验证验证码
   */
  async function onOptVerify() {
    if (btnLoading.value) return;
    btnLoading.value = true;
    const res = await optVerifyApi(optVerifyParams);
    btnLoading.value = false;
    if (res && 'message' in res) {
      showToast('toast.verifyCodeError');
    } else if (res && 'token' in res) {
      appStore.setNewVerifyToken(res.token);
      onUserBind(); // 绑定新手机号/邮箱
    }
  }

  /**
   * @description 接口请求: 绑定新手机号/邮箱
   */
  async function onUserBind() {
    userBindParams.oldIdentifierToken = appStore.oldVerifyToken;
    userBindParams.newIdentifierToken = appStore.newVerifyToken;
    showLoading();
    const res = await userBindApi(userBindParams);
    if (res && 'message' in res) {
      showToast('toast.bindFail');
    } else {
      showToast('toast.bindSuccess');
      userStore.removeUser();
      await delay(1000);
      router.go(-2);
    }
  }

  /**
   * @description 接口请求: 修改登录密码
   */
  async function onChangePwd() {
    if (btnLoading.value) return;
    showLoading();
    btnLoading.value = true;
    try {
      const res = await authChangePasswordApi(changePwdParams);
      if (res && 'success' in res) {
        showToast(t('main.change') + t('main.success'));
        const account = await appStore.getAccount();
        await appStore.setAccount(account, changePwdParams.newPassword, true);
        if (window?.jsBridge?.postMessage) {
          window.jsBridge.postMessage("savePasswordInfo", JSON.stringify({ pass: changePwdParams.newPassword }));
        }
        const previousUrl = document.referrer;
        if (previousUrl && previousUrl.includes(window.location.hostname)) {
          history.go(-2);
        } else {
          router.replace('/launch').then(() => {
            window.location.reload();
          });
        }
      } else {
        showToast(t('main.change') + t('main.fail'));
      }
    } finally {
      btnLoading.value = false;
      hideLoading();
    }
  }

  /**
   * @description 接口调用: 添加/修改资金密码
   */
  async function onAssetsPassword() {
    if (btnLoading.value) return;
    btnLoading.value = true;
    const res: any = await withdrawPasswordApi(assetPasswordParams)
    btnLoading.value = false;
    if (res && 'message' in res)
      return showToast(res.message);
    showToast('toast.settingSuccess');
    userStore.removeUser();
    await delay(1000);
    if (verifyType.value == 'password') {
      router.back();
    } else {
      router.go(-1);
    }
  }
}
