import i18n from '@/i18n';
import { showToast } from '@/utils'
import { showLoading } from '@/utils/loading';
import { validatePhone, getPhoneLength, validateAccount, filterNullParams, validateRealName } from '@/utils'
import { useTenantStore } from '@/store/tenant';
import { agencyRegisterApi } from '@/api/agent';
import { useSystemStore } from '@/store/system'
import { AgencyRegisterParams } from '@/api/agent/model';
import { RegisterType } from "@/api/normal/model";
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useCFTurntile } from "@/hooks/useCFTurntile";

// 注册参数的默认值
const defaultRegisterParams: AgencyRegisterParams = {
  username: '',
  password: '',
  registerDevice: '',
  phoneNumber: '',
  registerDeviceModel: '',
  hToken: undefined,
  registerType: undefined,
}

export function useRegisterSubordinatesLogic() {
  const { t } = i18n.global
  const tenantStore = useTenantStore(); // 租户store
  const systemStore = useSystemStore()  // 系统store

  const formRef = ref();            // 表单element
  const phoneRef = ref();           // 手机号element
  const usernameRef = ref();        // 用户名输入框element
  const passwordRef = ref();        // 密码输入框element
  const realNameRef = ref();      // 真实姓名输入框element
  const showPassword = ref(false);  // 是否显示密码
  const confirmPassword = ref('');  // 确认密码
  const hToken = ref(undefined); // 人机验证token
  const cpfValue = ref('');      // CPF
  const realName = ref(''); // 真实姓名
  
  const authInfo = computed(() => tenantStore.authInfo);                // 认证信息
  const language = computed(() => tenantStore.tenantInfo?.language) // 语言
  const country = computed(() => tenantStore.tenantInfo?.code || 'US'); // 国家代码
  const areaCode = computed(() => tenantStore.tenantInfo?.phoneCode); // 区号
  const maxLength = computed(() => getPhoneLength(country.value));// 电话号码默认最大长度
  const registerType = ref<RegisterType>(undefined); // 注册类型
  const imageCaptchaSwitch = computed(() => tenantStore.authInfo?.imageCaptchaSwitch === 'ON'); // 图形验证码开关
  const captchaSwitch = computed(() => tenantStore.authInfo?.captchaSwitch === 'ON'); // 人机验证开关
  const showCpfInput = computed(() => authInfo.value?.needCpf); // 是否显示CPF输入框
  const needRealName = computed(() => authInfo.value?.needRealNameInput); // 注册是否需要真实姓名(越南地区配置)
  
  // 注册参数
  const registerParams = reactive<AgencyRegisterParams>({ ...defaultRegisterParams});

  // CF人机验证
  const { initCFTurntile, resetCFTurntile } = useCFTurntile("agencyRegister", hToken, "#cf-turnstile-register");

  // 阿里云图形验证
  const { initAliyunCaptcha, verify } = useCaptcha(onRegister);

  watchEffect(() => registerParams.hToken = hToken.value);

  watch(()=> registerType.value, () => resetRegisterParams());

  /**
   * 生命周期--页面加载前
   */
  onBeforeMount(async () => {
    await tenantStore.resetAuthInfo();// 获取认证信息
    captchaSwitch.value && initCFTurntile();// 初始化CF人机验证
    imageCaptchaSwitch.value && initAliyunCaptcha(); // 初始化阿里云图形验证
    registerType.value = tenantStore.getRegisterTypes()[0]; // 设置默认注册类型
  })

  /**
   * @description 重置注册参数/验证码参数
   */
  function resetRegisterParams() {
    Object.assign(registerParams, defaultRegisterParams)
    registerParams.hToken = hToken.value;
    registerParams.registerType = registerType.value;
    confirmPassword.value = "";
    cpfValue.value = "";
    realName.value = "";
  }

  /**
   * @description 用户名输入事件监听回调(验证格式)
   * @param value 输入值
   */
  function usernameInput(ev: any) {
    const value = ev.target.value;
    usernameRef.value.$el.classList.remove('ion-valid');
    usernameRef.value.$el.classList.remove('ion-invalid');
    validateAccount(value) ? usernameRef.value.$el.classList.add('ion-valid') : usernameRef.value.$el.classList.add('ion-invalid');
  }

  /**
   * @description 用户名输入框失去焦点事件
   */
  function usernameBlur() {
    if (usernameRef.value) {
      usernameRef.value.$el.classList.add('ion-touched');
    }
  }

  /**
   * @description 密码输入事件监听回调(验证格式)
   * @param value 输入值
   */
  function passwordInput(ev: any) {
    const value = ev.target.value;
    passwordRef.value.$el.classList.remove('ion-valid');
    passwordRef.value.$el.classList.remove('ion-invalid');
    passwordCheck(value) ? passwordRef.value.$el.classList.add('ion-valid') : passwordRef.value.$el.classList.add('ion-invalid');
  }

  /**
   * @description 密码输入框失去焦点事件
   */
  function passwordBlur() {
    if (passwordRef.value) {
      passwordRef.value.$el.classList.add('ion-touched');
      passwordCheck(registerParams.username);
    }
  }

  /**
   * @description 手机号输入事件
   */
  function phoneInput(e: any) {
    registerParams.phoneNumber = e.detail.value;
  
    phoneRef.value.$el.classList.add('ion-touched');
  
    phoneRef.value.$el.classList.remove('ion-valid') // 移除有效样式类名,后面重新判断
    phoneRef.value.$el.classList.remove('ion-invalid') // 移除无效样式类名,后面重新判断
  
    if (e.detail.value === '') return // 输入值为空,不做判断
  
    validatePhone(e.detail.value, country.value)
      ? phoneRef.value.$el.classList.add('ion-valid') // 手机号格式正确,添加有效样式类名
      : phoneRef.value.$el.classList.add('ion-invalid') // 手机号格式错误,添加无效样式类名
  }

  /**
   * @description 真实姓名输入事件
   */
  function realNameInput(e: any) {
    registerParams.realName = e.detail.value;
    realNameRef.value.$el.classList.add('ion-touched');
    realNameRef.value.$el.classList.remove('ion-valid') // 移除有效样式类名,后面重新判断
    realNameRef.value.$el.classList.remove('ion-invalid') // 移除无效样式类名,后面重新判断
    if (e.detail.value === '') return // 输入值为空,不做判断
    validateRealName(e.detail.value)
      ? realNameRef.value.$el.classList.add('ion-valid') // 真实姓名格式错误,添加无效样式类名
      : realNameRef.value.$el.classList.add('ion-invalid') // 真实姓名格式正确,添加有效样式类名
  }

  /**
   * @description 显示密码
   */
  function showPasswordHandle() {
    showPassword.value = !showPassword.value;
  }

  /**
   * @description 提交表单
   * @param event 事件对象
   */
  function submitForm(event: any) {
    event.preventDefault();                                            // 阻止默认事件
    const classList = formRef.value.querySelectorAll('.ion-invalid');  // 获取所有未通过验证的元素
    if (classList.length) return;                                      // 未通过验证的元素存在时, 阻止提交
    if (registerParams.password !== confirmPassword.value)
      return showToast('toast.twoPsInconsistent');
    if (registerType.value == 'Phone') {
      registerParams.username = registerParams.phoneNumber!;
    }
    if (showCpfInput.value) {
      registerParams.cpf = cpfValue.value;
    }
    if (needRealName.value) {
      registerParams.realName = realName.value;
    }
    if (imageCaptchaSwitch.value) {
      verify();
    } else {
      onRegister();
    }
  }

  return {
    formRef,
    phoneRef,
    usernameRef,
    passwordRef,
    showPassword,
    confirmPassword,
    authInfo,
    language,
    country,
    maxLength,
    areaCode,
    registerParams,
    usernameInput,
    usernameBlur,
    passwordInput,
    passwordBlur,
    phoneInput,
    showPasswordHandle,
    submitForm,
    registerType,
    cpfValue,
    realName,
    showCpfInput,
    needRealName,
    realNameRef,
    realNameInput,
  }

  /**
   * @description 密码格式校验
   * @param value 校验值
   */
  function passwordCheck(value: string) {
    return value.match(
      /^\S{6,18}$/
    );
  }

  /**
   * @description 接口调用-注册
   */
  async function onRegister(captchaVerifyParam?: string) {
    try {
      registerParams.registerDevice = systemStore.deviceId
      registerParams.registerDeviceModel = systemStore.deviceModel
      captchaVerifyParam && (registerParams.captchaVerifyParam = captchaVerifyParam);
      await showLoading();
      const res = await agencyRegisterApi(filterNullParams(registerParams));
      if (res && res.userId) {
        return showToast(`${t('main.register')}${t('main.success')}`)
      }
      resetCFTurntile();
    } catch (error) {
    } finally {
      resetCFTurntile();
    }
  }
}
