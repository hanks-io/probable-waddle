import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { useTenantStore } from '@/store/tenant'
import { useRouter, useRoute } from 'vue-router';
import { validatePasswordApi } from '@/api/normal'; 
import { hideLoading, showLoading } from '@/utils/loading';
import { ValidatePasswordParams } from '@/api/normal/model';
import { computed, onBeforeMount, reactive, ref } from 'vue';

export function useSecurityVerifyLogic() {
  
  const route = useRoute();         // 当前路由信息
  const router = useRouter();       // 路由实例
  const appStore = useAppStore();   // 应用信息
  const userStore = useUserStore(); // 用户信息
  const tenantStore = useTenantStore() // 商户store

  const btnLoading = ref(false);      // 按钮加载状态
  const showPassword = ref(false);    // 是否显示密码
  const bindType = computed(() => route.params.type?.toString());// 绑定类型

  const verifyPasswordParams = reactive<ValidatePasswordParams>({ // 验证密码参数
    password: '',
    tokenType: "bind",
  })

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
  function submitForm(event: Event) {
    event.preventDefault(); // 阻止默认事件
    onOptVerify();  // 验证验证码
  }

  /**
   * 生命周期函数: 组件挂载前
   */
  onBeforeMount(async() => {
    userStore.getUser();  // 获取用户信息
    tenantStore.resetAuthInfo() // 重置认证信息
  })

  /**
   * @description 接口请求: 验证验证码
   */
  async function onOptVerify() {
    if (btnLoading.value) return;
    showLoading()
    btnLoading.value = true;
    try {
      const res = await validatePasswordApi(verifyPasswordParams);
      appStore.setOldVerifyToken(res.token);
      if (bindType.value == 'phone' || bindType.value == 'email') {
        router.push(`/security/bind/${bindType.value}`);
      }
      else if (bindType.value == 'asset') {
        router.replace('/withdrawPW');
      }
      else
        router.push(`/security/confirm/${bindType.value}`);
    } finally {
      btnLoading.value = false;
      hideLoading()
    }
  }

  return {
    btnLoading,
    bindType,
    verifyPasswordParams,
    showPasswordHandle,
    submitForm,
  }
}
