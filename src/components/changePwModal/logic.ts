// 忘记密码 逻辑层
import { delay } from '@/utils/delay';
import { reactive, ref, watch, onBeforeMount } from 'vue';
import { ForgetParams, OptGenParams, OptVerifyParams } from '@/api/normal/model';
import { authForgetApi, authValidateUserApi, optGenApi, optVerifyApi } from '@/api/normal';
import { modalController } from '@ionic/vue';
import { showToast } from '@/utils/toast';
import i18n from '@/i18n';

export default function useForgetLogic() {
  const { t } = i18n.global

  const tenantStore = useTenantStore();

  const step = ref(1);                                // 步骤
  const identifier = ref('');                         // 用户标识
  const validateType = ref<'phone'|'email'>('email'); // 验证类型: phone/email
  const verifySended = ref(false);                    // 是否发送验证码
  const countdown = ref(0);                           // 倒计时
  const loading = ref(false);                         // 确认按钮加载状态
  const verifyLoading = ref(false);                   // 发送验证码加载动画
  const verifyIndex = ref(9);                         // 验证类型索引
  const verifyTypeList = ref<any>([]);                // 验证类型列表
  const verifyIdentifier = ref('');                   // 验证码加载动画
  const confirmPassword = ref('');                    // 确认密码
  const accountType = ref("");                        // 账号类型

  const optGenParams = reactive<OptGenParams>({       // 验证码参数
    type: 'forgot_password',
    identifier: '',
    identifierMode: 'fullMatch',
    identifierType: 'email'
  })
  const optVerifyParams = reactive<OptVerifyParams>({ // 验证码参数
    type: 'forgot_password',
    identifierMode: 'fullMatch',
    identifier: '',
    identifierType: 'email',
    otp: ''
  })
  const forgetParams = reactive<ForgetParams>({       // 忘记密码参数
    token: '',
    newPassword: ''
  })

  watch(() => accountType.value, (value) => {    // 监听账号类型变化
    identifier.value = '';
  })

  watch(() => identifier.value, (value) => {    // 监听用户标识变化
    optGenParams.identifier = value;
    optVerifyParams.identifier = value;
  })
  watch(() => verifyIndex.value, (value) => {  // 监听验证类型索引变化
    validateType.value = verifyTypeList.value[value].type;
    verifyIdentifier.value = verifyTypeList.value[value].value;
    optGenParams.identifierType = optVerifyParams.identifierType = validateType.value;
  })
  watch(() => countdown.value, (value) => {	    // 监听倒计时变化
    if (value > 0) {
      setTimeout(() => {
        countdown.value--;
      }, 1000);
    } else {
      verifySended.value = false;
    }
  })

  /**
   * @description 切换验证类型
   */
  function changeVerifyType() {
    verifyIndex.value = verifyIndex.value == 0 ? 1 : 0;
  }

  /**
   * @description 发送验证码
   */
  function verifyHandle() {
    optGenParams.identifierType = validateType.value;
    if (optGenParams.identifierType == 'email') {
      if (!optGenParams.identifier) return showToast('toast.pleaseEnterEmail');
    } else {
      if (!optGenParams.identifier) return showToast('toast.pleaseEnterPhone');
    }
    onOptGen();
  }

  /**
   * @description 关闭模态框
   */
  function closeModal() {
    modalController.dismiss();
  }

  /**
   * @description 获取背景图片样式
   * @returns 背景图片样式
   */
  function getBgImgStyle() {
    const { theme } = tenantStore.themeConfig!;
    return {
        backgroundImage: `url(/first/login/${theme}-bg.png)`,
        backgroundSize: 'cover'
    }
  }

  /**
   * @description 提交表单
   * @param event 事件对象
   */
  function submitForm(event: Event) {  
    event.preventDefault(); // 阻止默认事件
    if (step.value == 1) {
      onValidateUser();     // 验证用户是否存在
    } else if (step.value == 2) {
      if (!identifier.value) return showToast('toast.enterVerifyCode');
      onOptVerify();        // 验证验证码
    } else {
      if (forgetParams.newPassword != confirmPassword.value)
      return showToast('toast.twoPsInconsistent');
      onForget();// 提交新密码
    }
  }

  /**
   * @description 接口请求: 验证用户是否存在
   */
  async function onValidateUser() {
    if (loading.value) return;
    loading.value = true;
    try {
      const res = await authValidateUserApi({ identifier: identifier.value });
      if (!res?.email && !res?.phoneNumber) {
        return showToast(t('toast.unAccountSecurity') + '，' + t('toast.toCustomerService'));
      }
      if (res?.phoneNumber) {
        validateType.value = 'phone';
        verifyIdentifier.value = res.phoneNumber;
        verifyTypeList.value.push({ type: 'phone', value: res.phoneNumber });
      }
      if (res?.email) {
        validateType.value = 'email';
        verifyIdentifier.value = res.email;
        verifyTypeList.value.push({ type: 'email', value: res.email });
      }
      step.value = 2;
      verifyIndex.value = 0;
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description 接口调用-发送验证码
   */
  async function onOptGen() {
    if (verifyLoading.value) return;
    verifyLoading.value = true;
    try {
      await optGenApi(optGenParams);showToast('toast.sendSuccessfully');
      countdown.value = 60;
      verifySended.value = true;
    } finally {
      verifyLoading.value = false;
    }
  }

  /**
   * @description 接口调用-验证验证码
   */
  async function onOptVerify() {
    if (loading.value) return;
    loading.value = true;
    try {
      const res = await optVerifyApi(optVerifyParams);
      forgetParams.token = res.token;
      showToast('toast.verificationSuccess');
      step.value = 3;
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description 接口调用-忘记密码
   */
  async function onForget() {
    if (loading.value) return;
    loading.value = true;
    try {
      await authForgetApi(forgetParams);
      showToast('toast.modificationSuccessful');
      await delay(500);
      closeModal();
    } finally {
      loading.value = false;
    }
  }

  onBeforeMount(async ()=>{
    accountType.value = tenantStore.getLoginTypes()[0]; // 获取登录类型
  })

  return {
    step,
    identifier,
    validateType,
    verifySended,
    countdown,
    loading,
    verifyLoading,
    verifyTypeList,
    verifyIdentifier,
    confirmPassword,
    optVerifyParams,
    forgetParams,
    changeVerifyType,
    verifyHandle,
    submitForm,
    closeModal,
    getBgImgStyle,
    accountType,
  }
}
