
import { useGameStore } from '@/store/game';
import { gameListApi } from '@/api/normal';
import { setFavorite } from '@/hooks/SetFavorite';
import { TGameInfo } from '@/store/game'

export interface FilterParams {
    gameType: string
    platformId?: number
    target?: 'gameList' | 'hall'
    hot?: boolean
}


export default async (filterParams?: FilterParams, getAllGame: boolean = false) => {
    const gameStore = useGameStore(); // 游戏信息
    let cacheList = await gameStore.getRecentGames();
    if (!cacheList.length) return []
    // 处理体育游戏，体育不需要获取最新的游戏的状态
    if (filterParams?.gameType === 'SPORTS' && filterParams.target === 'hall') {
        return cacheList.filter((it: any) => it.gameType === 'SPORTS' && it.target === 'hall')
    }

    if (filterParams?.target === 'hall') {
        return cacheList.filter((it: any) => it.gameType !== 'SPORTS' && it.target === 'hall')
    }

    // 请求数据 更新最近游戏的状态
    let getCurrentId = (item: TGameInfo) => Number(item.gameId ?? item.id)
    let hallGameList: any[] = [];
    let otherGameList: any[] = [];
    cacheList.forEach((it: any) => {
      if (it.target === 'hall') {
        hallGameList.push(it)
      } else {
        otherGameList.push(it)
      }
    })
    const gameIdList = otherGameList.map(it => getCurrentId(it))
    let gameData = (await gameListApi({ gameIdList, pageSize: 1000, page: 1 })) as Record<string, any>
    //  创建id和status 的map对象
    const statuseMap = new Map();
    gameData.gameList.forEach((item: any) => statuseMap.set(getCurrentId(item), item.status))
   
    // 修改原对象中的status值
    let recentGameList = otherGameList.map((it: any) => {
        let currentId = getCurrentId(it)
        if (statuseMap.has(currentId)) {
            it.status = statuseMap.get(currentId)
            return it
        }
        return undefined
    }).filter(Boolean)
    // 设置收藏的游戏isFavorites 为true
    setFavorite(recentGameList);
    const newRecentGameList = [ ...hallGameList, ...recentGameList]
    // 更新本地的缓存最近玩游戏
    gameStore.resetRecentGames(newRecentGameList)

    if (filterParams) {
        recentGameList = recentGameList.filter((it: any) => {
            if (filterParams.platformId) {
                return it.gameType == filterParams.gameType && (it.platformId == filterParams.platformId || it.id == filterParams.platformId);
            } else {
                return it.gameType == filterParams.gameType
            }
        })
    }

    if (getAllGame) {
        return newRecentGameList
    }
    return recentGameList
}
