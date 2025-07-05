import i18n from '@/i18n';
import { showToast } from '@/utils'
import { delay } from '@/utils/delay';
import { useAppStore } from '@/store/app';
import { userBindApi } from '@/api/personal';
import { useUserStore } from '@/store/user';
import { useRoute, useRouter } from 'vue-router';
import { UserBindParams } from '@/api/personal/model';
import { hideLoading, showLoading } from '@/utils/loading';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { UserBindIdentifier } from '@/api/personal/model';


export function useSecurityBindLogic() {
  const { t } = i18n.global
  const route = useRoute();             // 当前路由信息
  const router = useRouter();           // 路由实例
  const appStore = useAppStore();       // 应用状态
  const userStore = useUserStore();     // 用户状态

  const formRef = ref();               // 表单element
  const btnLoading = ref(false);       // 按钮加载状态
  const bindType = computed(() => (route.params.type?.toString() || '') as UserBindIdentifier); // 绑定类型

  const userBindParams = reactive<UserBindParams>({   // 绑定新手机号/邮箱参数
    identifierType: bindType.value,
    token: '',
    identifier: ''
  })

  /**
   * @description 提交表单
   * @param event 事件对象
   */
  function submitForm(event: Event) {  
    event.preventDefault();// 阻止默认事件
    if (userBindParams.identifier.length  > 64) return showToast(t('toast.validEmailTips'));
    const classList = formRef.value.querySelectorAll(".ion-invalid"); // 获取所有未通过验证的元素
    if (classList.length) return; // 未通过验证的元素存在时, 阻止提交
    onUserBind();// 绑定新手机号/邮箱
  }

  /**
   * @description 接口请求: 绑定新手机号/邮箱
   */
  async function onUserBind() {
    if (btnLoading.value) return;
    showLoading();
    btnLoading.value = true;
    try {
      userBindParams.token = appStore.oldVerifyToken;
      await userBindApi(userBindParams);
      showToast('toast.bindSuccess');
      userStore.removeUser();
      await delay(1000);
      router.go(-2);
    } finally {
      btnLoading.value = false;
      hideLoading();
    }
  }

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    appStore.getOldVerifyToken(); // 获取旧验证码token
  })


  return {
    btnLoading,
    formRef,
    bindType,
    userBindParams,
    submitForm
  }
}
