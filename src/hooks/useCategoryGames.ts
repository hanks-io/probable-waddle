import router from '@/router'
import { isEmpty } from '@/utils'



export default async (gameList: any[], isFavorite: boolean = false) => {
  const gameStore = useGameStore() // 游戏信息
  await gameStore.getHomeGames()
  const route = router.currentRoute

  let sportGameList: any[] = [];
  let otherGameList: any[] = [];
  gameList.forEach((it: any) => {
    if (it.gameType === 'SPORTS') {
      sportGameList.push(it)
    } else {
      otherGameList.push(it)
    }
  })
  if (route.value.path === '/game/category/sport') {
    const sportPlatformList = gameStore.homeGames.find((it: any) => it.gameType == 'SPORTS')?.platformList || []
    return sportGameList.map((it: any) => {
      const sportPlatform = sportPlatformList.find((item: any) => item.id === it.platformId) || {}
      return {
        ...sportPlatform,
        isFavorite,
      }
    })
  } else {
    return gameList
  }
}
