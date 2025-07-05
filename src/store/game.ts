import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { emitter } from '@/utils/event'
import { Storage } from '@ionic/storage'
import { useTenantStore } from './tenant'
import { setFavorite } from '@/hooks/SetFavorite'
import { homeHotApi, homeListApi, homePlatformListApi, gameListApi } from '@/api/normal'
import type { HomeListModel, HotModel, HotParams } from '@/api/normal/model'
import router from '@/router'
import { cloneDeep, isEmpty } from '@/utils'
import { gameLoginApi, gameGetSportTokenApi } from '@/api/game'
import { GameLoginParams } from '@/api/game/model'
import { showToast } from '@/utils'
import { RedirectUrl } from '@/common/data'
import { showLoading } from '@/utils/loading'
import { showLogin } from '@/hooks/ShowLogin'
import { sportsType } from '@/enums/common';
import { useHotGameCard } from '@/hooks/useLoadComponent';
import { throttle } from '@/utils';

const storage = new Storage();
(async () => {
	await storage.create()
})()

export type TGameInfo = {
	gameId?: string
	gameName: string
	gameType: string
	id?: string
	name: string
	code?: string
	status?: string
	gameTypeStatus?: string
	platformStatus?: string
	platformId: string | number
	target?: 'gamelist' | 'hall'
	horizontalScreen: boolean
	test?: boolean
}

/**
 * @description 游戏信息状态管理
 */
export const useGameStore = defineStore({
	id: 'game',
	state: () => ({
		homePlatformList: [] as any[],									// 首页平台列表
		platformUnderMaintenanceList: [] as (string | number)[],				// 平台维护列表id
		platformHotGameList: [] as any[],								// 平台热门游戏列表
		gamePlatformList: [] as any[],									// 游戏平台列表
		gameUrl: '',																		// 游戏链接
		gameSportsUrl: '',															//  体育游戏链接
		gameDoc: '',																		// 游戏文档
		recentGames: [] as any[], 											// 最近游戏
		popularGames: [] as HotModel['hotList'], 				// 热门游戏
		popularPlatform: [] as HotModel['hotList'], 		// 热门平台
		popularPlatformGames: [] as any[],							// 热门平台所有游戏
		homeGames: [] as HomeListModel['gameTypeList'], // 首页游戏
		btSportsInfo: {},                                 //  bt体育游戏信息
		currentSegment: {
			segment: '-1',
			index: -1,
			event: '',
		},                                            //  左边弹窗控制首页segment正在正在显示的数据类型
		betByGame: null as Record<string, (params?: any) => void> | null
	}),

	getters: {
		// 厂商平台游戏列表
		allGameList(): any[] {
			const newList = this.gamePlatformList?.reduce((acc, cur) => {
				const cList = cur.list.map((item: any[]) => {
					return {
						...cur,
						list: item,
						total: item.length,
						gameType: item[0].gameType
					}
				})
				acc = acc.concat(cList)
				return acc;
			}, [])
			return this.platformHotGameList.concat(newList)

		},
		// 获取用户绑定信息
		sortNames(): string[] {
			return this.homeGames.map((item) => item.gameType)
		},
		// 获取所有分类(加入热门分类)
		sortAll(): string[] {
			return ['POPULAR', ...this.sortNames]
		},
		// 获取平台列表
		platformList() {
			let list: string[] = [];
			this.homeGames.forEach((item: any) => {
				item.platformList.forEach((platform: any) => {
					if (!list[platform.id]) {
						list[platform.id] = platform.logo;
					}
				})
			})
			return list;
		},
		// 是否游戏中
		isInGame(): boolean {
			return !!(this.gameUrl || this.gameDoc)
		},
	},

	actions: {
		async getPlatformHotGameList(platformList: any[]) {
			// 获取热门界面的平台热门游戏列表
			if (platformList.length) {
				const userStore = useUserStore()
				userStore.getFavoriteList()
				const gameParamsList = platformList.map(({ platformId, gameType }) => ({
					platformId,
					gameType,
					page: 1,
					pageSize: 999,
				}))
				try {
					const storageKeyParams = gameParamsList.sort((a, b) => {
						const platformComparison = a.platformId - b.platformId;
						if (platformComparison === 0) {
							return a.gameType.localeCompare(b.gameType);
						}
						return platformComparison;
					});
					const storageKey = JSON.stringify({
						url: 'gameListApi',
						params: storageKeyParams,
					});
					storage.get(storageKey)
						.then((cacheList) => {
							if (cacheList) {
								this.setHomeHotGameList(cacheList)
								this.popularPlatformGames = cacheList;
							}
						})
						.catch((error) => {
							console.error('Failed to fetch getPlatformHotGameList', error)
						})
					const resList: any[] = await gameListApi(gameParamsList);
					if (resList?.length) {
						this.popularPlatformGames = resList;
						const platformHotGameList = platformList.reduce((acc, cur, index) => {
							const { platformId, gameType } = cur;
							const item = resList.find((item) => item.gameList.length && item.gameList[0].platformId === platformId && item.gameList[0].gameType === gameType);
							if (item) {
								const { gameList, total } = item;
								// 设置收藏状态
								setFavorite(gameList);
								acc.push({
									...cur,
									total,
									list: gameList,
								})
							}
							return acc;
						}, []);
						storage.set(storageKey, platformHotGameList);
						this.setHomeHotGameList(platformHotGameList)
					}
				} catch (error) {
					console.error('Failed to fetch getPlatformHotGameList', error)
				}
			} else {
				this.setHomeHotGameList([])
			}
		},
		// 设置平台热门游戏列表
		setHomeHotGameList(platformHotGameList: any[]) {
			const {
				hotGameOptions,
			} = useHotGameCard();
			const specialSkinSettings = {
				hotGameOptions: {
					logo1: '/first/svg/sort/POPULAR.svg',
					logo2: '/first/svg/sort/SPORTS.svg'
				}
			}
			const tenantStore = useTenantStore();
			let newHotGameOptions = hotGameOptions;
			const { theme } = tenantStore.themeConfig || {};
			if (theme === 'amber-purple') {
				newHotGameOptions = specialSkinSettings.hotGameOptions;
			}
			// 热门，体育，厂商热门
			let list = [];
			const hallGamePlatformList = this.homeGames.reduce((acc: any[], cur: any) => {
				const { platformList = [], ...rest } = cur;
				const hallList = platformList.filter((item: any) => item.target === 'hall' && item.hot)

				if (hallList.length) {
					setFavorite(hallList, cur.gameType)
					hallList.forEach((item: any) => {
						const { hotSort, ...hRest } = item;
						acc.push({
							...rest,
							...hRest,
							list: [item],
							sort: hotSort,
							hotTab: true,
							total: 1,
						})
					})
				}
				return acc;
			}, [])
			if (hallGamePlatformList.length) {
				list = list.concat(hallGamePlatformList)
			}
			list = list.concat(platformHotGameList).sort((a, b) => b.sort - a.sort)
			if (this.popularGames.length) {
				const popularGamesList = this.popularGames.map((item: any) => {
					const { platformId } = item;
					const platformLogo = this.platformList[platformId] || '';
					return {
						...item,
						platformLogo,
					}
				});
				list.unshift({
					gameType: 'POPULAR',
					logo: newHotGameOptions.logo1,
					list: popularGamesList,
					total: popularGamesList.length,
				})
			}
			this.setPlatformHotGameList(list)
		},
		setPlatformHotGameList(list: any[]) {
			this.platformHotGameList = list
		},
		// 获取平台游戏
		async getPlatformGameTotal(list: any[]) {
			const gameParamsList = list.map((item) => {
				// 游戏列表请求参数
				return {
					platformId: item.id,
					page: 1,
					pageSize: 999,
				}
			})
			try {
				const storageKeyParams = gameParamsList.sort((a, b) => a.platformId - b.platformId);
				const storageKey = JSON.stringify({
					url: 'gameListApi',
					params: storageKeyParams,
				});
				storage.get(storageKey)
					.then((cacheList) => {
						if (cacheList) {
							this.setGamePlatformList(cacheList)
						}
					})
					.catch((error) => {
						console.error('Failed to fetch getPlatformGameTotal', error)
					})
				const resList: { gameList: any; total: any; }[] | undefined = await gameListApi(gameParamsList);

				if (resList?.length) {
					const hallGameList = this.homeGames?.reduce((acc, cur) => {
						const { platformList = [], ...rest } = cur;
						const hallList = platformList.filter((item: any) => item.target === 'hall').map((item: any) => ({
							...rest,
							...item,
						}));
						acc.push(...hallList)
						return acc;
					}, [])
					const newList = list.reduce((acc, cur, index) => {
						const item = resList.find((item) => item.gameList.length && item.gameList[0].platformId === cur.id)
						if (!item) {
							let hTotal = 0;
							const hallObj = hallGameList.reduce((hAcc: any, hCur: TGameInfo) => {
								if (hCur.id === cur.id) {
									hTotal += 1;
									const { gameType } = hCur;
									if (hAcc[gameType]) {
										hAcc[gameType].push(hCur)
									} else {
										hAcc[gameType] = [hCur]
									}
								}
								return hAcc;
							}, {})
							cur.total = hTotal;
							cur.gameTypes.sort((a, b) => b.gameTypeSort - a.gameTypeSort)
							cur.list = cur.gameTypes.reduce((gAcc: TGameInfo[], gCur: TGameInfo) => {
								const sortList = hallObj[gCur.gameType]
								if (sortList) {
									gAcc.push(sortList)
								}
								return gAcc;
							}, [])
						} else {
							const { gameList, total } = item;
							// 设置收藏状态
							setFavorite(gameList);
							// 区分游戏类型
							const objList = gameList.reduce((gAcc: any, gCur: TGameInfo) => {
								const { gameType } = gCur;
								if (gAcc[gameType]) {
									gAcc[gameType].push(gCur);
								} else {
									gAcc[gameType] = [gCur];
								}
								return gAcc;
							}, {})
							cur.total = total;
							// 游戏类型排序
							cur.gameTypes.sort((a, b) => b.gameTypeSort - a.gameTypeSort)
							cur.list = cur.gameTypes.reduce((gAcc: TGameInfo[], gCur: TGameInfo) => {
								const sortList = objList[gCur.gameType]
								if (sortList) {
									gAcc.push(sortList)
								}
								return gAcc;
							}, [])
						}
						acc.push(cur)
						return acc;
					}, [])
					storage.set(storageKey, newList);
					this.setGamePlatformList(newList);
				} else {
					storage.set(storageKey, list);
					this.setGamePlatformList(list);
				}
			} catch (error) {
				console.error('Failed to fetch getPlatformGameTotal', error)
			}
		},
		setGamePlatformList(list: any[]) {
			this.gamePlatformList = list;
			this.homePlatformList = list;
		},
		// 获取首页游戏平台列表
		async getHomePlatformList() {
			try {
				const res: any = await homePlatformListApi()
				if (res.platformList.length) {
					await this.getPlatformGameTotal(res.platformList);
					Promise.resolve({ err: false })
				}
			} catch (error) {
				Promise.resolve({ err: true })
			}
		},
		// 获取热门游戏
		async getPopularGames() {
			if (!this.popularGames.length)
				await this.loadPopularGames()
			if (!this.popularGames.length)
				await this.requestPopularGames()
			return this.popularGames
		},
		// 请求最新热门游戏
		async requestPopularGames(): Promise<any[]> {
			const params: HotParams = { page: 1, pageSize: 2000 }
			const res: any = await homeHotApi(params)
			if (res) {
				const games: any[] = res?.hotList.filter((item: any) => item.type === 'game')
				const popularPlatform: any[] = res?.hotList.filter((item: any) => item.type === 'gameType')
				setFavorite(games)
				this.popularPlatform = popularPlatform;
				this.popularGames = games;
				this.getPlatformHotGameList(popularPlatform);
				await storage.set('popularPlatform', popularPlatform)
				await storage.set('popularGames', games)
				return games
			}
			return [];
		},
		// 加载本地热门游戏
		async loadPopularGames() {
			this.popularGames = (await storage.get('popularGames')) ?? []
		},
		// 加载本地热门平台
		async loadPopularPlatform() {
			this.popularPlatform = (await storage.get('popularPlatform')) ?? []
		},
		// 获取首页游戏
		async getHomeGames() {
			if (!this.homeGames.length)
				await this.loadHomeGames()
			if (!this.homeGames.length)
				await this.requestHomeGames()
			return this.homeGames
		},
		// 请求最新首页游戏
		async requestHomeGames() {
			return this.homeGames = await onHomeGamesRequest()
		},
		// 加载本地首页游戏
		async loadHomeGames() {
			this.homeGames = (await storage.get('homeGames')) ?? []
		},
		// 获取最近游戏
		async getRecentGames() {
			if (!this.recentGames.length) {
				const games = await storage.get('recentGames')
				this.recentGames = games ? JSON.parse(games) : []
			}
			return this.recentGames
		},
		// 添加最近游戏
		addRecentGame(game: TGameInfo) {
			let newGame = cloneDeep(game)
			if (!this.recentGames.length) {
				this.recentGames.push(newGame)

			} else {

				let i = -1
				if (game.gameType === 'SPORTS' && game.target === 'hall') {
					i = this.recentGames.findIndex(it => it.platformId == game.platformId)
				} else {
					let getCurrentId = (item: TGameInfo) => Number(item.gameId ?? item.id)
					let gameId = getCurrentId(game)
					i = this.recentGames.findIndex(it => getCurrentId(it) === gameId)
				}

				//  如果i等于0 最近玩的在最前面，不需要任何操作
				if (i === 0) return

				//  i >0  将已经存在最近游戏的删除， 放在在最前面
				if (i > 0) {
					this.recentGames.splice(i, 1)
				}

				this.recentGames = [newGame, ...this.recentGames]
			}

			storage.set('recentGames', JSON.stringify(this.recentGames))



		},
		resetRecentGames(recentGamesList: TGameInfo[]) {
			storage.set('recentGames', JSON.stringify(recentGamesList))
		},
		// 设置游戏链接
		setGameUrl(url: string) {
			this.gameUrl = url
			storage.set('gameUrl', url)
		},
		// 获取游戏链接
		async getGameUrl() {
			if (!this.gameUrl)
				this.gameUrl = (await storage.get('gameUrl')) ?? ''
			return this.gameUrl
		},
		// 设置游戏文档
		setGameDoc(doc: string) {
			this.gameDoc = doc
			storage.set('gameDoc', doc)
		},
		// 获取游戏文档
		async getGameDoc() {
			if (!this.gameDoc)
				this.gameDoc = (await storage.get('gameDoc')) ?? ''
			return this.gameDoc
		},
		// 获取游戏链接
		async requestGameUrl(gameLoginParams: GameLoginParams) {
			await gameUrlRequest(gameLoginParams);
			if (this.gameUrl || this.gameDoc)
				return true
			return false
		},

		/**
		 * 进入游戏
		 */
		enterGame: throttle(async function (this: any, game: TGameInfo) {
			if (game.target === 'hall') return
			const userStore = useUserStore();
			await userStore.getUser();
			if (!userStore.user?.id) return showLogin();

			const gameLoginParams = {
				gameId: Number(game.gameId || game.id),	// 游戏id
				lobbyUrl: RedirectUrl,									// 基础链接(退出重定向)
			}
			await gameUrlRequest(gameLoginParams)
			if (!this.gameUrl && !this.gameDoc) return
			this.addRecentGame(game)
			sessionStorage.setItem('gameCode', game.code || '')
			router.push({ path: `/game/action/${game.gameId || game.id}` })

			emitter.emit('user/play-game', {
				gameId: game.gameId || game.id || '',
				userId: userStore.user.userId,
				tenantId: Number(useTenantStore().tenantId),
			})

			if (window.jsBridge) {
				const isHorizontalScreen = typeof game.horizontalScreen === "string" ? Number(game.horizontalScreen) : game.horizontalScreen
				const orientation = isHorizontalScreen ? 'landscape' : 'portrait'
				// @ts-ignore
				window.jsBridge.postMessage('rotatingScreen', orientation)
			}
		}, 2000, { leading: true, trailing: false }),

		// 获取btSports游戏信息
		async getSportToken(userId: number) {
			if (isEmpty(this.btSportsInfo)) {
				await this.setSportToken(userId)
			}
			return this.btSportsInfo
		},
		// 设置返水活动信息
		async setSportToken(userId: number) {
			let result = await gameGetSportTokenApi(userId)
			this.btSportsInfo = result
			return result
		},
	},
})


/**
 * @description 获取首页游戏列表
 */
async function onHomeGamesRequest() {
	const res = await homeListApi()
	storage.set('homeGames', res.gameTypeList)
	return res.gameTypeList
}

/**
 * @description 获取游戏链接
 */
export async function gameUrlRequest(gameLoginParams: GameLoginParams) {
	showLoading();
	const res = await gameLoginApi(gameLoginParams);
	const gameStore = useGameStore();
	if (res.loginUrl) {
		if (res.loginUrl.indexOf('http') === 0) {
			gameStore.setGameUrl(res.loginUrl);
			gameStore.setGameDoc('');
		} else if (res.loginUrl.indexOf('<!doctype html>') === 0) {
			gameStore.setGameUrl('');
			gameStore.setGameDoc(res.loginUrl);
		} else {
			gameStore.setGameUrl('');
			gameStore.setGameDoc('');
			showToast(res.loginUrl);
		}
	}
}
