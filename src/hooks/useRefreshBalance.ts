
import { delay } from "@/utils/delay";
import { ZUserType } from "@/enums/types";
import { isEmpty } from '@/utils'
interface BalanceParams {
  userId: number,
  balance: number
}

const completed = ref(false);           // 是否计算开始计算余额
const loaded = ref(false);
const balance = ref(0)
// const userStore = useUserStore();           // 是否加载完成(获取用户财务信息)
// const tenantStore = useTenantStore();

const user = computed(() => useUserStore().user);
const merchantCy = computed(() => useTenantStore().tenantInfo?.merchantCy);

export default () => {
  /**
   * @description 接口调用-获取用户财务信息
   * @param isEmitter 是否触发事件
   */
  const onGetUserAssets = async (isEmitter = false, balanceParams?: BalanceParams) => {
    loaded.value = false;
    let userBalance = 0;

    if (!isEmitter && user.value && (user.value.type === ZUserType.enum.demo)) {
      await delay(800)  // 模拟调用接口 加一个延迟
      userBalance = user.value.trialPlayBalance
    } else if (isEmitter && isEmpty(balanceParams)) {
      const userId = useUserStore().user?.userId!
      if (userId == balanceParams?.userId) {
        userBalance = balanceParams?.balance!
      } else {
        const res = await useUserStore().setAssets();
        userBalance = res?.balance || 0;
      }

    } else {
      const res = await useUserStore().setAssets();
      userBalance = res?.balance || 0;
    }
    loaded.value = true;
    if (userBalance) {
      let animationFrameId = null;
      if (window.cancelAnimationFrame && animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      
      completed.value = true;
      const targetBalance = userBalance / 100;
      const startTime = performance.now();
      const duration = 1000; // 动画持续 1 秒
      const easeOutQuad = (t) => 1 - (1 - t) * (1 - t); // 缓动函数
      
      const animateBalance = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        balance.value = easeOutQuad(progress) * targetBalance;
        
        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(animateBalance);
        } else {
          balance.value = targetBalance;
          completed.value = false;
          animationFrameId = null;
        }
      };
      
      animationFrameId = window.requestAnimationFrame(animateBalance);
    } else {
      balance.value = 0;
    }
  }


  /**
   * @description 计算余额
   * @param num
   */
  function fixedNumber(num: number) {
    const str = Math.round(num).toFixed(0);
    const long = str.length;
    let res = '';
    for (let i = 0; i <= long; i++) {
      res += '0';
    }
    return res + '.00'
  }

  /**
 * @description 刷新余额
 */
  const refreshBalance = (isEmitter = false, amount?: number) => {
    if (!loaded.value) return;

    completed.value = true;
    try {
      onGetUserAssets(isEmitter, amount);  // 获取用户财务信息
    } finally {
      setTimeout(() => { completed.value = false }, 2000);
    }
  }


  return {
    completed,
    balance,
    onGetUserAssets,
    refreshBalance,
    fixedNumber,
    merchantCy
  }

}
