import { useRouter } from 'vue-router';
import { useGameStore } from '@/store/game';
import { useI18n } from 'vue-i18n';
import useCardStyle from '@/components/GameCard/useCardStyle';


export default () => {
  const { t } = useI18n();
  const gameStore = useGameStore();			    // 游戏信息
  const router = useRouter();					    // 路由
  const {
    cardStyle,
    getImageSrc,
  } = useCardStyle()

  const hotGameCodeList = [ 
    { code: 'HHSC', translate: '000001' }, 
    { code: 'JQT',  translate: '000002' }, 
    { code: 'PGS_98', translate: '000003' }, 
    { code: 'JLSB', translate: '000004' }, 
    { code: 'SSFF', translate: '000005' }
  ]; // 热门游戏code列表
  const hotGameList = computed(() => {
    const list = gameStore.allGameList.flatMap(item => item.list)
    if (list.length) {
      return hotGameCodeList.map(info => {
        const item = list.find(game => game.code === info.code);
        if (item) {
          const { 
            code,
            regionCode,
            platformCode,
          } = item;
          return {
            ...item,
            name: t(`game.${info.translate}`),
            logo: getImageSrc({
              code,
              regionCode,
              platformCode,
            }),
          }
        }
      }).filter(Boolean)
    } else {
      return [];
    }
  });

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

  return {
    goToGame,
    cardStyle,
    hotGameList,
  };
}
