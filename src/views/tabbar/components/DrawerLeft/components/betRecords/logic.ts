import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';
import { useTenantStore } from '@/store/tenant';
import { userProfitApi } from '@/api/personal';
import { moneyConvertToClient } from '@/utils/custom'
import {  handlePersonSelectTime } from '@/utils/reportTime'
import { showLogin } from '@/hooks/ShowLogin';


export default () => {
  const router = useRouter();

  const appStore = useAppStore();
  const tenantStore = useTenantStore();

  const personTodayBet = ref(0.00)                          // 获取用户当天投注金额

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);
  // 判断是否登录,登录则跳转,未登录则弹出登录框
  function jumpBet() {
    if (appStore.token) {
      router.push('/user/report')
    } else {
      showLogin()
   }
  }

  // 获取用户当天投注金额
  async function getAssetsChange() {
    if (!appStore.token) return;
    const res: any = await userProfitApi({
      page: 1,
      pageSize: 15,
      startTime: ''+handlePersonSelectTime('today')?.startTime,
      endTime: ''+handlePersonSelectTime('today')?.endTime,
      gameType:undefined,
      platformId:undefined,
      gameId:undefined,
    },);
      personTodayBet.value = moneyConvertToClient(res.totalBetAmount || 0)
  }

  onMounted( () => {
    getAssetsChange()
  })

  return {
    jumpBet,
    merchantCy,
    personTodayBet,
  }
}