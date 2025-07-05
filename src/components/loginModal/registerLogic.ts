// 注册 逻辑层
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { loginModal } from "@/hooks/ShowLogin";
import { useTenantStore } from "@/store/tenant";
import { useSystemStore } from "@/store/system";
import { useRouter, useRoute } from "vue-router";
import { authRegisterApi, optGenApi } from "@/api/normal";
import { OptGenParams, RegisterParams, RegisterType, RegisterModel, AppType } from "@/api/normal/model";
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import { useCFTurntile } from "@/hooks/useCFTurntile";
import { useCaptcha } from "@/hooks/useCaptcha";
import useGetTracker from "@/utils/ad/useGetTracker";
import { showToast, emitter, filterNullParams } from '@/utils'
import loginSuccessCb from "./loginSuccessCb";
import { LoginType } from "@/enums/common";


// 注册参数的默认值
const defaultRegisterParams: RegisterParams = {
  channelId: 0,
  username: '',
  parentId: undefined,
  password: '',
  phoneNumber: '',
  email: undefined,
  otp: undefined,
  registerDevice: '',
  registerDeviceModel: '',
  hToken: undefined,
  registerType: undefined,
  cpf: '',
  realName: '',
  birthday: '',
}

export default function useRegisterLogic({ emit }: { emit: any }) {
  const route = useRoute() // 路由实例
  const router = useRouter() // 路由实例
  const appStore = useAppStore() // 全局store
  const userStore = useUserStore() // 用户store
  const tenantStore = useTenantStore() // 商户store
  const systemStore = useSystemStore() // 系统store

  const formRef = ref(); // 表单element
  const agree = ref(true); // 是否同意协议
  const countdown = ref(0); // 倒计时
  const loading = ref(false); // 发送验证码加载动画
  const btnLoading = ref(false); // 按钮加载状态
  const verifySended = ref(false); // 是否发送验证码
  const confirmPassword = ref(""); // 确认密码
  const hToken = ref(undefined); // 人机验证token
  const cpfValue = ref('');      // CPF

  const authInfo = computed(() => tenantStore.authInfo) // 认证信息
  const tenantId = computed(() => tenantStore.tenantId) // 商户ID
  const parentId = computed(() => Number(appStore.parentId)) // 推广员ID
  const disabledBtn = computed(() => (!registerParams.username && !registerParams.phoneNumber) || btnLoading.value) // 注册按钮是否禁用
  const registerType = ref<RegisterType>(undefined); // 注册类型
  const showCaptchaInput = computed(() => { // 是否显示验证码输入框
    if (registerType.value === 'Account') return authInfo.value?.accountRegisterPhoneValidate
    else if (registerType.value === 'Phone') return authInfo.value?.phoneRegisterPhoneValidate
    else return false
  })
  const birthdayInputRef = ref();
  const realNameInputRef = ref();
  const showCpfInput = computed(() => registerType.value == LoginType.Phone && tenantStore.tenantInfo?.code === 'BR' && authInfo.value?.needCpf);
  const showBirthdayInput = computed(() => authInfo.value?.needBirthday);
  const showRealNameInput = computed(() => authInfo.value?.needRealName);
  const needRealName = computed(() => authInfo.value?.needRealNameInput); // 注册是否需要真实姓名(越南地区配置)
  const imageCaptchaSwitch = computed(() => tenantStore.authInfo?.imageCaptchaSwitch === 'ON'); // 图形验证码开关
  const captchaSwitch = computed(() => tenantStore.authInfo?.captchaSwitch === 'ON'); // 人机验证开关

  const registerParams = reactive<RegisterParams>({ ...defaultRegisterParams })// 注册参数

  // 发送验证码参数
  const optGenParams = reactive<OptGenParams>({
    type: "signup",
    identifier: "",
    identifierType: "phone",
  });

  // CF人机验证
  const { initCFTurntile, resetCFTurntile } = useCFTurntile("register", hToken, "#cf-turnstile-register");

  // 阿里云图形验证
  const { initAliyunCaptcha, verify } = useCaptcha(onRegister);

  // 同步人机验证token
  watchEffect(() => registerParams.hToken = hToken.value);

  // 监听商户ID变化
  watch(() => tenantId.value, () => tenantStore.resetAuthInfo());

  // 监听注册类型变化
  watch(() => registerType.value, () => resetRegisterParams());

  // 监听倒计时变化
  watch(() => countdown.value, (value) => {
    if (value > 0) {
      setTimeout(() => {
        countdown.value--;
      }, 1000);
    } else {
      verifySended.value = false;
    }
  }
  );

  const initModalOption = {
    visibility: false,
    slotType: '',
  }
  const modalOption = reactive(JSON.parse(JSON.stringify(initModalOption)));

  function openModal(type: string) {
    Object.assign(modalOption, initModalOption);
    modalOption.visibility = true;
    modalOption.slotType = type;
  }

  /**
   * @description 关闭模态框
   */
  function closeModal() {
    loginModal?.dismiss();
    useAppStore().modalVisible = false;
  }

  /**
   * @description 重置注册参数/验证码参数
   */
  function resetRegisterParams() {
    Object.assign(registerParams, defaultRegisterParams)
    registerParams.channelId = Number(appStore.channelId) || Number(route.query.ch) || 0;
    registerParams.hToken = hToken.value;
    registerParams.registerType = registerType.value;
    registerParams.parentId = parentId.value || undefined;
    optGenParams.identifier = "";
    confirmPassword.value = "";
    cpfValue.value = "";

    // 获取用于广告统计的tracker参数
    const tracker = useGetTracker();
    tracker && (registerParams.tracker = tracker);
  }

  /**
   * @description 发送验证码
   */
  function verifyHandle() {
    optGenParams.identifier = registerParams.phoneNumber ?? "";
    if (!optGenParams.identifier) return showToast("toast.pleaseEnterPhone");
    onOptGen();
  }

  /**
   * @description 立即登录点击事件
   */
  function loginHandle() {
    emit("toggle", "login");
  }

  /**
   * @description 提交表单
   * @param event 事件对象
   */
  function submitForm(event: Event) {
    event.preventDefault(); // 阻止默认事件
    if (showCpfInput.value && showBirthdayInput.value) {
      birthdayInputRef.value.validateFields();
    }

    const classList = formRef.value.querySelectorAll(".ion-invalid"); // 获取所有未通过验证的元素
    if (classList.length) return; // 未通过验证的元素存在时, 阻止提交
    if (registerParams.password !== confirmPassword.value) {
      return showToast("toast.twoPsInconsistent");
    }
    if (!agree.value) {
      return showToast("toast.agreeProtocol");
    }
    if (registerType.value == "Phone") {
      registerParams.username = registerParams.phoneNumber ?? "";
    }
    if (showCpfInput.value) {
      registerParams.cpf = cpfValue.value;
    }


    if (imageCaptchaSwitch.value) {
      verify();
    } else {
      onRegister();
    }
  }

  /**
   * 生命周期-页面加载完成
   */
  onMounted(async () => {
    resetRegisterParams(); // 重置注册参数
    await tenantStore.resetAuthInfo(); // 重置认证信息
    captchaSwitch.value && initCFTurntile(); // 初始化CF人机验证
    imageCaptchaSwitch.value && initAliyunCaptcha(); // 初始化阿里云图形验证
    registerType.value = tenantStore.getRegisterTypes()[0]; // 设置默认注册类型
    tenantStore.resetTenantInfo(); // 重置商户信息
    emitter.emit("user/registerClick", {});
  });

  /**
   * @description 接口调用-发送验证码
   */
  async function onOptGen() {
    loading.value = true;
    try {
      await optGenApi(optGenParams);
      showToast("toast.sendSuccessfully");
      countdown.value = 60;
      verifySended.value = true;
    } finally {
      loading.value = false;
    }
  }

  /**
   * @description 接口调用-注册
   */
  async function onRegister(captchaVerifyParam?: string) {
    if (btnLoading.value) return;
    btnLoading.value = true;
    const activityStore = useActivityStore();
    try {
      registerParams.appType = systemStore.app?.build as AppType;
      registerParams.registerDevice = systemStore.deviceId;
      registerParams.registerDeviceModel = systemStore.deviceModel;
      captchaVerifyParam && (registerParams.captchaVerifyParam = captchaVerifyParam);
      if (tenantId.value) {
        tenantStore.tenantId = tenantId.value;
      }
      const res = await authRegisterApi(filterNullParams(registerParams));
      closeModal();
      await activityStore.setNewUserExclusivePopup(0); // 注册时重置新人专享活动状态
      handleLoginSuccess(res);
    } catch (error) {
      // 注册报错重新获取配置接口
      resetCFTurntile();
      const errorMessage = error?.message?.startsWith('{') ? JSON.parse(error?.message) : {};
      const errorCode = errorMessage.code;
      let registerTypeList: RegisterType[] = [];
      if ([10133, 10134, 10135].includes(errorCode)) {
        await tenantStore.resetAuthInfo(); // 重置认证信息
        registerTypeList = tenantStore.getRegisterTypes();
        if (!registerTypeList.includes(registerType.value)) {
          // 如果注册类型不在登录类型中，则设置默认注册类型
          registerType.value = registerTypeList[0]; // 设置默认注册类型
        }
      }
      if (errorCode === 10133) {
        registerType.value = registerTypeList[0]; // 设置默认注册类型
      }
      if (errorCode === 10134) {
        realNameInputRef.value?.addErrTip();
      }
      if (errorCode === 10135) {
        birthdayInputRef.value?.addErrTip();
      }
    } finally {
      btnLoading.value = false;
    }
  }

  /**
   * @description 处理注册成功后的逻辑
   */
  function handleLoginSuccess(res: RegisterModel) {
    userStore.setExperienceGold(res?.data.giftTrialPlayAmount ?? 0);
    userStore.setExperienceGoldType(`${res?.data.trialPlayAmountType}`);
    appStore.setAccount(registerParams.username, registerParams.password); // 默认记住账号
    window.sessionStorage.setItem("accountInfo", JSON.stringify({ acc: registerParams.username, pwd: registerParams.password })) // 默认记住账号
    window.sessionStorage.setItem("token", res?.data.token);
    const eventParams = {
      userId: res?.data.userId,
      tenantId: Number(tenantId.value),
      channelId: Number(appStore.channelId || 0),
    };
    emitter.emit("user/register", eventParams);
    emitter.emit("user/login", eventParams);
    loginSuccessCb(res?.data.token, { acc: registerParams.username, pass: registerParams.password });
    bindUserUrlIds(); // 绑定用户URL ID
  }

  return {
    realNameInputRef,
    showBirthdayInput,
    showRealNameInput,
    birthdayInputRef,
    modalOption,
    openModal,
    disabledBtn,
    formRef,
    agree,
    countdown,
    loading,
    verifySended,
    confirmPassword,
    authInfo,
    parentId,
    registerParams,
    btnLoading,
    verifyHandle,
    loginHandle,
    submitForm,
    registerType,
    showCaptchaInput,
    cpfValue,
    showCpfInput,
    needRealName,
  };
}

/**
 * @description 绑定用户URL ID
 */
function bindUserUrlIds() {
  const keys = ['kwaiId', 'fbPixelId', 'ttPixelId', 'ch', 'sdmode', 'bgPixel', 'gtagId', 'test', 'tt_test_id', 'ttclid', 'afId', 'mgSkyPixelId'];
  const urlParams = new URLSearchParams(window.location.search);
  keys.forEach(key => {
    const value = urlParams.get(key) || window?.[key];
    if (value) {
      localStorage.setItem(key, value);
    }
  });
}
