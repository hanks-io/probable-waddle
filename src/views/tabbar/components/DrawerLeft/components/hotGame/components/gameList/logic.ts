import { useRouter } from 'vue-router';
import { useGameStore } from '@/store/game';
import useCardStyle from '@/components/GameCard/useCardStyle';


export default () => {
  const gameStore = useGameStore();			    // 游戏信息
  const router = useRouter();					    // 路由

  const {
    cardStyle,
  } = useCardStyle()



  /**
   * @description 热门游戏点击事件
   */
  function goToGame(item: any) {
    if (item.gameId || item.name) {
      gameStore.enterGame(item)
    } else {
      router.push({ path: `/game/category/${item.gameType}${item.platformId}` });
    }
  }

  const { hotGameList } = inject('hotGameData') as { hotGameList: any[] };

  return {
    goToGame,
    cardStyle,
    hotGameList,
  };
}
