import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useTenantStore } from '@/store/tenant';
import { convertMoneyToShow } from '@/utils/custom';
import { showLogin } from "@/hooks/ShowLogin";

import { ZUserType } from '@/enums/types';


export default (props) => {
  const router = useRouter();

  const userStore = useUserStore();
  const tenantStore = useTenantStore();
  const userId = computed(() => userStore.user?.userId);
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);                        // 当前商户货币符号

  const balance = computed(() => {                                                              // 用户余额
    let num = 0;
    const { user, assets } = userStore;
    if (user && (user.type === ZUserType.enum.demo)) {
      num = user.trialPlayBalance
      return num;
    }
    if (assets) {
      num = assets.balance || 0;
    }
    return num;
  });

  const asset = computed(() => convertMoneyToShow(balance.value));

  const handleClick = computed(() => {
    const fns = {
      apply: depositHandle,
      entrar: rechargeHandle,
    }
    return fns[props.clickType]
  })
    /**
   * @description 充值按钮点击事件
   */
    async function depositHandle() {
      const bool = await useHandleRecharge()
      if (bool) return
      router.push('/recharge/apply');
    }

      /**
   * @description 充值按钮点击事件
   */
  async function rechargeHandle() {
    const bool = await useHandleRecharge()
    if (!bool) router.push('/main/entrar');
  }

  return {
    asset,
    userId,
    showLogin,
    merchantCy,
    handleClick,
  }
}