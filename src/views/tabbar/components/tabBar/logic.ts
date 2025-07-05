// 首页底部导航栏逻辑
import { menuController } from "@ionic/vue";
import { useRoute } from 'vue-router'
import { TabbarEnum } from '@/enums/common'
import { useGameStore } from '@/store/game'
import { useActivityStore } from '@/store/activity'
import useNavigator from '@/views/tabbar/components/tabBar/useNavigator'

export default function useTabLogic(props?: { tabTextMaps: string[] }) {
	const route = useRoute()

	const activityStore = useActivityStore() // 活动store
	const gameStore = useGameStore() // 游戏store
	const elementStore = useElementStore()
	const { isShowPromoRedPoint, isShowProfileRedPoint } = toRefs(activityStore)

  const tabBarRef = ref() // 底部导航栏ref
	const taskStore = useTaskStore();

	const noTabRoute = ['/main/gameSports']
	const currentRouteShowTab = computed(() => {
		// 正则匹配是否包含noTabRoute数组中的字符串
		const regex = new RegExp(noTabRoute.join('|'))
		return !regex.test(route.path)
	})
	const promoRedPoint = computed(() => {
		return isShowPromoRedPoint.value || taskStore.completedTheTaskList.length > 0
	})
	// 获取底部导航栏数据
	const initTabTextMaps = ['main.inicio', 'main.promo', 'main.entrar', 'main.withdraw',  'main.perfil'];
	const tabList = computed(() => {
		const tabTextMaps = props?.tabTextMaps.length ? props?.tabTextMaps : initTabTextMaps;
		const tabMaps = {
			'main.inicio': () => {
				return { tab: TabbarEnum.INITIO, text: 'main.inicio', route: '/main/inicio', point: false }	
			},
			'main.promo': () => {
				return { tab: TabbarEnum.PROMO, text: 'main.promo', route: '/main/promo', point: promoRedPoint.value }
			},
			'main.entrar': () => {
				return { tab: TabbarEnum.ENTRAR, text: 'main.entrar', route: '/main/entrar', point: false }
			},
			'main.withdraw': () => {
				return { tab: TabbarEnum.WITHDRAW, text: 'main.withdraw', route: '/main/withdraw', point: false }
			},
			'main.invite': () => {
				const agencyId = activityStore.activityList?.find(it => it.type === 'Agency')?.id || 0;
				return { tab: TabbarEnum.INVITE, text: 'main.invite', route: `/activity/agency/${agencyId}`, point: false }
			},
			'main.perfil': () => {
				return { tab: TabbarEnum.PERFIL, text: 'main.perfil', route: '/main/perfil', point: isShowProfileRedPoint.value }
			},
			'main.menu': () => {
				return { tab: 'menu', text: 'main.menu', slot: 'menu' }
			},
		}
		return tabTextMaps.map(tab => {
			const fn = tabMaps[tab as keyof typeof tabMaps]
			if (fn) {
				return fn()
			}
		})
	})

  /**
	 * @description 路由跳转
	 * @param route 当前路由
	 */


	const showMenu = () => {
		if (gameStore.allGameList.length === 0) {
			gameStore.requestPopularGames()
		}
		menuController.open('main-menu')
	}

	useResizeObserver(tabBarRef, (entries) => {
    const entry = entries[0];
    const { clientHeight } = entry.target;
    if (clientHeight) {
      elementStore.setTabBarHeight(clientHeight)
    }
  })

  return {
		...useNavigator(),
    tabList,
		showMenu,
    tabBarRef,
		currentRouteShowTab,
  }
}
