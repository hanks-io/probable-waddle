import { useRouter } from 'vue-router'
import { showToast } from '@/utils'
import { showLogin } from '@/hooks/ShowLogin'
import { useActivityStore } from '@/store/activity'
import { useAppStore } from '@/store/app'
import { useVipStore } from '@/store/vip'
import { useAgentStore } from '@/store/agent';
import useHandleRecharge from '@/hooks/useHandleRecharge'
import useHandleWithdraw from '@/hooks/useHandleWithdraw'

export default () => {
  const router = useRouter()
  const route = router.currentRoute
  const activityStore = useActivityStore()
  const appStore = useAppStore()
  const vipStore = useVipStore()
  const agentStore = useAgentStore()


  const jumpToEntrar = async () => {
    const noPass = await useHandleRecharge()
    if (noPass) return
    router.push('/main/entrar')
  }

  const jumpToWithdraw = async () => {
    const noPass = await useHandleWithdraw()
    if (noPass) return
    router.push('/main/withdraw')
  }

  const jumpToVIP = async () => {
    await vipStore.getActivityVipType()
    if (!vipStore.activityVipType) return
    router.push('/activity/vip')
  }

  const jumpToPromo = async () => {
    const token = await appStore.getToken();
    if (!activityStore.activityList.length && (!token)) {
      showLogin()
      return
    }
    router.push('/main/promo')
  }

  const jumpToAgent = () => {
    const path = agentStore.agentConfig?.agencyMode ==='unlimitedLevel' ? '/spread' : '/mlmAgent'
    router.push({ path })
  }

  const navigator = async (path: string) => {
		if (path === route.value.path) return
		
		const pathHandlers = {
			'/main/entrar': jumpToEntrar,
			'/main/withdraw': jumpToWithdraw,
      '/activity/vip': jumpToVIP,
      '/main/promo': jumpToPromo,
      '/spread': jumpToAgent,
      '/mlmAgent': jumpToAgent,
		}
		
		// 代理活动不存在
		const regex = /^\/activity\/agency\/\d+$/;
		if (regex.test(path)) {
			const agencyActivity = activityStore.activityList?.find(it => it.type === 'Agency')
			if (!agencyActivity) {
				showToast('activity.notMet')
				return
			}
		}

		const handler = pathHandlers[path as keyof typeof pathHandlers] || null
		if (handler) {
			await handler()
      return
		}
		router.push(path)
	}

  return {
    navigator
  }
}