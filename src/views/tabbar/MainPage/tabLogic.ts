// 首页底部导航栏逻辑
import { menuController } from "@ionic/vue";
import { TabbarEnum } from '@/enums/common'
import { useGameStore } from '@/store/game'
import router from '@/router'

export default function useTabLogic() {
	const route = router.currentRoute
	const activityStore = useActivityStore() // 活动store
	const gameStore = useGameStore() // 游戏store
	const { isShowPromoRedPoint, isShowProfileRedPoint } = toRefs(activityStore)

  const tabBarRef = ref() // 底部导航栏ref

  // 获取底部导航栏数据
	const tabs = computed(() => {
		return [
			{ tab: TabbarEnum.INITIO, text: 'main.inicio', route: '/main/inicio', point: false },
			{ tab: TabbarEnum.PROMO, text: 'main.promo', route: '/main/promo', point: isShowPromoRedPoint.value },
			{ tab: TabbarEnum.ENTRAR, text: 'main.entrar', route: '/main/entrar', point: false },
			{ tab: TabbarEnum.WITHDRAW, text: 'main.withdraw', route: '/main/withdraw', point: false },
			{ tab: TabbarEnum.PERFIL, text: 'main.perfil', route: '/main/perfil', point: isShowProfileRedPoint.value },
		]
	})

  const tabs1 = computed(() => {
		const agencyId = activityStore.activityList?.find(it => it.type === 'Agency')?.id || 0;
		return [
			{ tab: TabbarEnum.INITIO, text: 'main.inicio', route: '/main/inicio', point: false },
			{ tab: TabbarEnum.PROMO, text: 'main.promo', route: '/main/promo', point: isShowPromoRedPoint.value },
			{ tab: TabbarEnum.INVITE, text: 'main.invite', route: `/activity/agency/${agencyId}`, point: false },
			{ tab: TabbarEnum.PERFIL, text: 'main.perfil', route: '/main/perfil', point: isShowProfileRedPoint.value },
			{ tab: 'menu', text: 'main.menu', slot: 'menu', point: isShowProfileRedPoint.value },
		]
	})

  /**
	 * @description 路由跳转
	 * @param route 当前路由
	 */
	async function navigator(path: string) {
		if (path === route.value.path) return
		const pathHandlers = {
			'/main/entrar': async () => {
				return await useHandleRecharge()
			},

			'/main/withdraw': async () => {
				return await useHandleWithdraw()
			},
		}

		const handler = pathHandlers[path as keyof typeof pathHandlers] || null
		if (handler) {
			const result = await handler()

			if (result) return
		}
		router.push(path)
	}

  /**
   * @description 监听元素高度变化
   */
  const resizeObserver = new ResizeObserver((entries) => {
    const elementStore = useElementStore() // 元素信息

    for (const entry of entries) {
      const { height } = entry.contentRect
      elementStore.setTabBarHeight(height)
    }
  })

	const showMenu = () => {
		if (gameStore.allGameList.length === 0) {
			gameStore.requestPopularGames()
		}
		menuController.open('main-menu')
	}

  // 生命周期: 组件挂载完成
	onMounted(async () => {
		await nextTick()
		if (tabBarRef.value) {
			resizeObserver.observe(tabBarRef.value)
		}
	})

  // 生命周期: 组件卸载完成
	onUnmounted(() => {
		if (tabBarRef.value) {
			resizeObserver.unobserve(tabBarRef.value)
		}
	})

  return {
    tabs,
    tabs1,
		showMenu,
    navigator,
    tabBarRef
  }
}
