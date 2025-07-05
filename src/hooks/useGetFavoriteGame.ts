

import { useAppStore } from '@/store/app'
import { favoriteListApi } from '@/api/personal';
import { FavoriteListParams } from '@/api/personal/model';
import { FilterParams } from './useGetRecentGame'
import useCategoryGames from './useCategoryGames'
import { cloneDeep } from '@/utils'

const useGetFavoriteGame = async (favoriteListParams?: FavoriteListParams, filterParams?: FilterParams) => {
    const appStore = useAppStore();   // 应用信息
    const userStore = useUserStore()
    const token = await appStore.getToken()
    const gameStore = useGameStore() // 游戏信息
    if (!token) return []
    const homeGameList = computed(() => gameStore.homeGames) // 首页游戏列表
    let params: FavoriteListParams = {
        page: 1,
        pageSize: 1000
    }
    let { favortieList } = await favoriteListApi(favoriteListParams ?? params);
    if (!favortieList?.length) {
        userStore.favoriteList = []
        return []
    }

    favortieList = favortieList.map((it: any) => {
        it.isFavorite = true
        if (!it.status) {
            it.status = it.gameStatus
        }
        if (!it.gameId) {
            it.gameId = it.id
        }
        return it
    })



    userStore.favoriteList = favortieList;
    // await storageFavorite(favortieList)

    if (filterParams) {
        favortieList = favortieList.filter((it: any) => {
            if (filterParams.platformId) {
                return it.gameType == filterParams.gameType && (it.platformId == filterParams.platformId || it.id == filterParams.platformId);
            } else {
                return it.gameType == filterParams.gameType
            }
        })
    }
    favortieList = await useCategoryGames(favortieList, true)
    return favortieList

}


export const setSportsPlatformGameFavorites = (gameList: any[]) => {
    const userStore = useUserStore()
    const favoriteList = userStore.favoriteList?.filter((it: any) => it.gameType === 'SPORTS')?.map((it: any) => it.platformId);
    if (!favoriteList.length) return gameList
    return cloneDeep(gameList).map((it: any) => {
        let id = it.platformId ?? it.id
        it.isFavorite = favoriteList.includes(id)
        return it
    })

}

export const getSportsPlatformGameFavorites = (gameList: any[]) => {
    const userStore = useUserStore()
    const favoriteList = userStore.favoriteList?.filter((it: any) => it.gameType === 'SPORTS')?.map((it: any) => it.platformId);
    if (!favoriteList.length) return []
    return gameList.filter((it: any) => {
        let id = it.platformId ?? it.id
        return favoriteList.includes(id)
    })

}

export default useGetFavoriteGame
