import router from '@/router'
import { showLoading } from '@/utils/loading'
import { gameListApi } from '@/api/normal'
import type { GameListParams } from '@/api/normal/model'
import { setFavorite } from '@/hooks/SetFavorite'
import { InfiniteScrollCustomEvent } from '@ionic/vue'
import { setSportsPlatformGameFavorites } from '@/hooks/useGetFavoriteGame'
import { isEmpty } from '@/utils'
export default () => {
	const gameStore = useGameStore() // 游戏信息
	const userStore = useUserStore() // 用户信息
	const sideValue = ref(0) // 游戏平台标签动态值
	const loading = ref(false) // 搜索框加载动画
	const infiniteRef = ref() // 触底加载更多组件
	const tabValue = ref('') // 游戏类型标签动态值
	const loadMore = ref('more') // 加载更多状态
	const gameList = ref<any>([]) // 游戏列表
	const limitGameList = ref<any>([]) // 限制游戏列表
	const isHall = ref(false) //
	const gameParams = reactive<GameListParams>({
		// 游戏列表请求参数
		// gameType: undefined,
		// platformId: 0,
		page: 1,
		pageSize: 20,
		gameIdList: [],
	})
	let index = 1
	let gameIdList: number[] = []
	// const {} = toRefs(gameStore)
	const homeGameList = computed(() => gameStore.homeGames) // 首页游戏列表
	const tabs = computed(() => limitGameList.value.map((v) => v.gameType)) // 游戏类型标签列表
	const segmentList = computed(() => {
		// 游戏平台标签列表
		const platformDataList = limitGameList.value.find((v: any) => v.gameType == tabValue.value)?.platformData
		const homePlatformList = homeGameList.value.find((v: any) => v.gameType == tabValue.value)?.platformList
		const tempArr = []
		if (platformDataList?.length && homePlatformList?.length) {
			let idMap = new Map()
			homePlatformList.forEach((it: any) => idMap.set(it.id, it))
			platformDataList.forEach((it: any) => {
				if (idMap.has(it.platformId)) {
					tempArr.push(idMap.get(it.platformId))
				}
			})
		}
		return tempArr
	})

	// 监听游戏类型列表变化
	watch(tabs, (v) => {
		if (v.length) {
			tabValue.value = v[0]
		}
	})

	// 监听游戏平台列表变化
	watch(segmentList, (v) => {
		if (v.length) {
			sideValue.value = v[0].id
			isHall.value = false
			updateGameList()
		}
	})
	/**
	 * @description 更新游戏列表
	 */
	function updateGameList() {
		index = 0
		gameList.value = []
		gameParams.gameIdList = []
		let platformData = limitGameList.value.find((it: any) => it.gameType === tabValue.value)?.platformData
		let gameData = platformData.find((it: any) => it.platformId === sideValue.value)?.gameData
		gameIdList = gameData.map((it: any) => it.gameId)

		if (gameIdList.length <= gameParams?.pageSize!) {
			gameParams.gameIdList = gameIdList
		} else {
			let size = gameParams.pageSize
			gameParams.gameIdList = gameIdList.slice(index * size!, (index + 1) * size!)
		}
		isHall.value = false
		onGetGame()
	}
	/**
	 * @description 游戏类型标签切换事件
	 * @param event 事件对象
	 */
	function tabChange(event: any) {
		sideValue.value = segmentList.value[0].id
		isHall.value = false
		updateGameList()
	}

	/**
	 * @description 游戏平台标签切换事件
	 * @param event 事件对象
	 */
	function sideChange(e: CustomEvent) {
		sideValue.value = e.detail.value
		updateGameList()
	}

	/**
	 * @description 游戏卡片样式
	 */
	function gameCardStyle(item: any) {
		if (item.gameName || item.name) {
			const logo = item.logo || item.gameLogo
			const gradient =
				'360deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 16.23%, rgba(0, 0, 0, 0) 29.9%, rgba(0, 0, 0, 0) 100%'
			return `background:linear-gradient(${gradient}),url("${logo}"); background-size: cover; background-position: center`
		}
		return `background: url(${
			item.background || item.plateformBackground
		}); background-size: cover; background-position: center`
	}

	/**
	 * @description 触底加载更多事件
	 */
	async function ionInfinite(event: InfiniteScrollCustomEvent) {
		if (loadMore.value == 'noMore' || gameList.value.length == 0) return
		const size = gameParams.pageSize
		const count = Math.ceil(gameIdList.length / size)
		if (index >= count) {
			loadMore.value = 'noMore'
			return
		}
		onGetGame()
	}

	/**
	 * @description 游戏跳转
	 */
	function gameHandle(item: any) {
		gameStore.enterGame(item)
	}

	/**
	 * @description 生命周期-页面加载前
	 */
	onBeforeMount(async () => {
		//  await showLoading();
		await gameStore.getHomeGames()
		const params = await getPageParam(PageParam.LIMIT_GAME)
		limitGameList.value = params?.limitData ?? []
	})

	/**
	 * @description 收藏按钮事件
	 */
	async function favoriteHandle(item: any, platform?: any, remove?: boolean) {
		if (remove) item.isFavorite = false
		else item.isFavorite = !item.isFavorite

		if (item.isFavorite) await userStore.addFavorite(item, platform)
		else await userStore.cancelFavorite(item, platform)
	}

	/**
	 * 接口调用-获取游
	 */
	async function onGetGame() {
		if (loading.value) return
		loading.value = true
		const platformList = homeGameList.value.find((it: any) => it.gameType == tabValue.value)?.platformList
		if (isEmpty(platformList)) {
			loadMore.value = 'noMore'
			loading.value = false
			return
		}
		const isHallGame = platformList.find((it: any) => it.id == sideValue.value)?.target === 'hall'
		// 处理大厅游戏
		if (isHallGame) {
			const platformMap = new Map()
			platformList.filter((item: any) => item.target === 'hall').forEach((it: any) => platformMap.set(it.id, it))
			if (platformMap.has(sideValue.value)) {
				gameList.value.push({ ...platformMap.get(sideValue.value) })
				gameList.value = setSportsPlatformGameFavorites(gameList.value)
				isHall.value = true
				loadMore.value = 'noMore'
				loading.value = false
				return
			}
		}
		// 处理非大厅游戏 处理没有游戏ID的
		if (!gameParams?.gameIdList?.length) {
			loadMore.value = 'noMore'
			loading.value = false
			return
		}
		// 处理有游戏ID的
		await showLoading()
		try {
			const res = await gameListApi(gameParams)
			if (res && 'gameList' in res) {
				let size = gameParams.pageSize
				const count = Math.ceil(gameIdList.length / size)
				if (index >= count) {
					loadMore.value = 'noMore'
				} else {
					loadMore.value = 'more'
					index += 1
					gameParams.gameIdList = gameIdList.slice(index * size!, (index + 1) * size!)
				}
				gameList.value.push(...res.gameList)
				setFavorite(gameList.value)
			}
		} catch (error) {
			console.error(error)
		} finally {
			loading.value = false
			infiniteRef.value.$el.complete()
		}
	}

	return {
		tabValue,
		tabs,
		sideValue,
		segmentList,
		loadMore,
		gameList,
		loading,
		infiniteRef,
		isHall,
		gameHandle,
		gameCardStyle,
		favoriteHandle,
		ionInfinite,
		tabChange,
		sideChange,
	}
}
