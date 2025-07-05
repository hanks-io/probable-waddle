import { useGameStore } from '@/store/game';
import { useUserStore } from '@/store/user';
import useStartSportGame from "@/hooks/useStartSportGame";
import { setSportsPlatformGameFavorites } from '@/hooks/useGetFavoriteGame';
import { isEmpty } from '@/utils'

export default function useSportViewLogic() {
  const gameStore = useGameStore();
  const userStore = useUserStore();

  // const gameList = computed(() => {
  //   const games = gameStore.homeGames.find((item) => item.gameType === 'SPORTS')
  //   if (games?.platformList) {
  //     let list = (games?.platformList as any).filter((item: any) => item.target === 'hall' && item.hot)
  //     return setSportsPlatformGameFavorites(list)
  //   }

  //   return []
  // });

  const gameList = ref<any[]>([])
  let { favoriteList } = toRefs(userStore)
  let { homeGames } = toRefs(gameStore)
  watch([homeGames, favoriteList], (newList) => {
    let [games] = newList
    if (!games.length) return
    let data = games.find((item: any) => item.gameType === 'SPORTS')
    if (isEmpty(data?.platformList)) return
    let list = (data?.platformList as any).filter((item: any) => item.target === 'hall' && item.hot)
    if (!list.length) return
    gameList.value = setSportsPlatformGameFavorites(list)
  }, { immediate: true })

  /**
   * @description 收藏事件
   */
  function favoriteHandle(item: Record<string, any>) {
    item.isFavorite = !item.isFavorite;
    const game = {
      gameId: item.id,
      gameName: item.gameName || item.name,
    };
    Object.assign(game, item);
    if (item.isFavorite) {
      userStore.addFavorite(game);
    } else {
      userStore.cancelFavorite(game);
    }
  }




  return {
    gameList,
    favoriteHandle,
    useStartSportGame,
  }
}
