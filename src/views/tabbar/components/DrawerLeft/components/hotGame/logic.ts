import { useGameStore } from '@/store/game';
import { useI18n } from 'vue-i18n';
import useCardStyle from '@/components/GameCard/useCardStyle';
import useTransformFavoriteParameter from '@/views/game/search/useTransformFavoriteParameter';


export default () => {
  const { t } = useI18n();
  const gameStore = useGameStore();			    // 游戏信息

  const {
    getImageSrc,
  } = useCardStyle()

  const { transformFavoriteParameter } = useTransformFavoriteParameter();

  const hotGameCodeList = [ 
    { code: 'HHSC', translate: '000001' }, 
    { code: 'JQT',  translate: '000002' }, 
    { code: 'SBJN', translate: '000003' }, 
    { code: 'JLSB', translate: '000004' }, 
    { code: 'SSFF', translate: '000005' }
  ]; // 热门游戏code列表
  const hotGameList = computed(() => {
    const list = gameStore.allGameList.flatMap(item => item.list)
    if (list.length) {
      return hotGameCodeList.map(info => {
        const item = list.find(game => game.code === info.code || game.gameCode === info.code);
        if (item) {
          const transformItem = transformFavoriteParameter([item])[0];
          const {
            code,
            regionCode,
            platformCode,
          } = transformItem;
          return {
            ...transformItem,
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

  provide('hotGameData', {
    hotGameList,
  });


  return {
    hotGameList,
  };
}
