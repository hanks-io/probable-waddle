// 登录 逻辑层
import { useRoute, useRouter } from "vue-router";
import { computed, reactive, ref, watch } from "vue";
import loginSuccessCb from "./loginSuccessCb";
import { useActivityStore } from "@/store/activity";
import { authLoginApi, authCanFindPasswordApi } from "@/api/normal";
import { useUserStore } from "@/store/user";
import { loginModal } from "@/hooks/ShowLogin";
import { useSystemStore } from "@/store/system";
import { useTenantStore } from "@/store/tenant";
import type { LoginParams } from "@/api/normal/model";
import useGetTracker from "@/utils/ad/useGetTracker";
import { showChangePwModal } from "@/hooks/ShowChangePwModal";
import { emitter } from "@/utils";
import { useAppStore } from "@/store/app";
import { AccountStatus } from '@/enums/common'

interface Params {
  emit: any;
}

export default function useLoginLogic({ emit }: Params) {
  const route = useRoute(); // 当前路由
  const router = useRouter(); // 路由实例
  const appStore = useAppStore(); // 全局store
  const userStore = useUserStore(); // 用户store
  const tenantStore = useTenantStore(); // 商户store
  const systemStore = useSystemStore(); // 系统store

  const formRef = ref(); // 表单element
  const phoneRef = ref(); // 手机号element
  const passwordRef = ref(); // 密码输入框element
  const btnLoading = ref(false); // 按钮加载状态
  const loginType = ref(""); // 登录类型

  // 登陆参数
  const loginParams = reactive<LoginParams>({
    username: "",
    password: "",
    hToken: undefined,
  });

  // 获取用于广告统计的tracker参数
  const tracker = useGetTracker();
  tracker && (loginParams.tracker = tracker);

  const disabledBtn = computed(() => !loginParams.username); // 登录按钮是否禁用
  const tenantId = computed(() => tenantStore.tenantId); // 商户ID
  const channelId = computed(() => appStore.channelId || route.query.ch || 0); // 渠道ID
  const imageCaptchaSwitch = computed(() => tenantStore.authInfo?.loginCaptcha === 'IMAGE'); // 图形验证码开关
  const captchaSwitch = computed(() => tenantStore.authInfo?.loginCaptcha === 'CF'); // 人机验证开关
  const accountStatus = computed(() => userStore.accountStatus); // 账户状态
  const hToken = ref(undefined); // 人机验证token

  // 是否记住账号密码
  const remember = computed({
    get: () => appStore.rememberAccount,
    set: (value) => appStore.setRememberAccount(value),
  });

  // CF人机验证
  const { initCFTurntile, resetCFTurntile } = useCFTurntile("login", hToken, '#cf-turnstile-login');

  // 阿里云图形验证
  const { initAliyunCaptcha, verify } = useCaptcha(onLogin);

  // 同步人机验证token
  watchEffect(() => loginParams.hToken = hToken.value);

  // 监听商户ID变化
  watch(() => tenantId.value, () => tenantStore.resetAuthInfo());

  // 监听登录方式变化
  watch(() => loginType.value,
    async (value) => {
      loginParams.username = "";
      loginParams.password = "";
      if (await appStore.getLoginType() === value) {
        loginParams.username = await appStore.getAccount();
        loginParams.password = await appStore.getPassword();
      }
    },
  );

  /**
   * @description 关闭模态框
   */
  function closeModal() {
    loginModal?.dismiss();
    useAppStore().modalVisible = false;
  }

  /**
   * @description 立即注册点击事件
   */
  function registerHandle() {
    emit("toggle", "register");
  }

  /**
   * @description 提交表单
   * @param event 事件对象
   */
  function submitForm(event: Event) {
    event.preventDefault(); // 阻止默认事件
    const classList = formRef.value.querySelectorAll(".ion-invalid"); // 获取所有未通过验证的元素
    if (classList.length || !loginParams.username || !loginParams.password) return; // 未通过验证的元素存在或账号密码为空值时, 阻止提交
    if (imageCaptchaSwitch.value) {
      verify();
    } else {
      onLogin();
    }
  }

  /**
   * 生命周期-页面加载完成
   */
  onMounted(async () => {
    await tenantStore.resetAuthInfo(); // 获取认证信息
    captchaSwitch.value && initCFTurntile(); // 初始化CF人机验证
    imageCaptchaSwitch.value && initAliyunCaptcha(); // 初始化阿里云图形验证
    loginType.value = tenantStore.getLoginTypes()[0]; // 获取注册类型
    if (await appStore.getAccount()) remember.value = true; // 如果账号存在, 设置记住账号密码为true
  });

  /**
   * @description 忘记密码点击事件
   */
  async function forgetHandle() {
    if (await authCanFindPasswordApi()) {
      showChangePwModal();
    }
    else {
      router.push('/notification')
      closeModal()
    }
  }

  /**
   * @description 接口调用-登录
   */
  async function onLogin(captchaVerifyParam?: string) {
    btnLoading.value = true;
    try {
      loginParams.appType = systemStore.app?.build as LoginParams["appType"];
      loginParams.lastLoginDevice = systemStore.deviceId;
      loginParams.loginDeviceModel = systemStore.deviceModel;
      captchaVerifyParam && (loginParams.captchaVerifyParam = captchaVerifyParam);
      const res = await authLoginApi(loginParams);
      closeModal();
      userStore.setExperienceGold(res.data.giftTrialPlayAmount);
      userStore.setExperienceGoldType(res.data.trialPlayAmountType);
      window.sessionStorage.setItem("accountInfo", JSON.stringify({ acc: loginParams.username, pwd: loginParams.password }))
      if (remember.value) {
        await appStore.setAccount(loginParams.username, loginParams.password);
      } else {
        appStore.removeAccount();
      }
      useUserStore().accountStatus = AccountStatus.NORMAL;
      emitter.emit("user/login", {
        userId: res?.data.userId,
        tenantId: Number(tenantId.value),
        channelId: Number(channelId.value || 0),
      });
      window.sessionStorage.setItem("token", res?.data.token);
      loginSuccessCb(res?.data.token, { acc: loginParams.username, pass: loginParams.password });
    } catch (error) {
      resetCFTurntile();
    } finally {
      btnLoading.value = false;
    }
  }

  return {
    disabledBtn,
    btnLoading,
    formRef,
    phoneRef,
    passwordRef,
    loginParams,
    remember,
    registerHandle,
    forgetHandle,
    submitForm,
    loginType,
    accountStatus,
  };
}
