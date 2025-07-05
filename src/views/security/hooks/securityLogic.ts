import i18n from '@/i18n';
import { showToast } from '@/utils'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useTenantStore } from '@/store/tenant';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { PageParam, setPageParam } from '@/store/pageParam';
import { RegisterRequireSchema } from '@/enums/types';

export function useSecurityLogic() {
  const { t } = i18n.global
  const router = useRouter();
  const userStore = useUserStore();
  const tenantStore = useTenantStore();

  const user = computed(() => userStore.user);                                // 用户信息
  const isAssetPassword = computed(() => userStore?.assets?.isAssetPassword);  // 是否设置资金密码
  const allowChangePw = computed(() => tenantStore?.tenantInfo?.allowUserChangePassword); // 是否允许修改密码

  const basicList = ref([
    { name: 'label.account', icon: 'account', info: user.value?.userName, canBind: false },
    { name: 'label.phone', icon: 'phone', info: user.value?.phoneNumber, canBind: !user.value?.phoneNumber },
    { name: 'label.email', icon: 'email', info: user.value?.email, canBind: !user.value?.phoneNumber },
  ])
  
  const safeList = computed(() => {
    return [
      { name: `${t('label.loginPassword')}`, icon: 'password', info: 'set' },
      { name: `${t('viewsAssets.withdraw')}${t('label.password')}`, icon: 'assetsPassword', info: isAssetPassword.value ? 'set' : 'unset' },
    ]
  })

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    auto();
  })

  watch(() => userStore.user, () => auto())
  
  /**
   * @description 基础信息导航跳转
   */
  function basicNavigate(item: any) {
    if (item.icon == 'email' && !item.info) {
      router.push(`/security/verify/email`);
    }
    else if (item.icon == 'phone' && !item.info) {
      router.push(`/security/verify/phone`);
    }
  }
  
  /**
   * @description 安全信息导航跳转
   */
  function safeNavigate(item: any) {
    if (item.icon == 'password' && allowChangePw.value) {
      router.push('/security/verify/password');
    } else if (item.icon == 'assetsPassword' && !isAssetPassword.value && (!userStore.assets?.passwordSwitch || userStore.assets?.passwordSwitch === 'ON')) {
      if (item.info == 'set') {
        router.push(`/security/verify/asset`);
      }
      else if (!basicList.value[1].info && !basicList.value[2].info) {
        showToast('toast.bindPhoneOrEmail');
      }
      else {
        router.push('/security/verify/asset');
      }
    }
  }

  return {
    isAssetPassword,
    allowChangePw,
    basicList,
    safeList,
    basicNavigate,
    safeNavigate,
  }

  /**
   * @description 自动加载方法
   */
  async function auto() {
    await Promise.all([
      userStore.getUser(),                              // 获取用户信息
      userStore.setAssets(),                            // 获取资产信息(是否设置资金密码)
      tenantStore.resetAuthInfo(),                      // 重置认证信息
    ])
    basicList.value[0].info = user.value?.userName;
    basicList.value[1].info = user.value?.phoneNumber;
    basicList.value[2].info = user.value?.email;
  }
}
