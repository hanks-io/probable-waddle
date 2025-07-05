import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/game'


export default (props: any) => {
  const { t } = useI18n()
  const router = useRouter()
  const gameStore = useGameStore()

  const hotTab = computed(() => ({
    id: 'null',
    code: "ONE_API_HOT",
    gameType: 'POPULAR',
    name: t('sort.POPULAR'),
    src: props.loadImage.image('ONE_API_HOT')
  }))

  const list = computed(() => {
    return [hotTab.value].concat(gameStore.homePlatformList.map(item => {
      const { code } = item;
      const { loadImage } = props;
      return {
        ...item,
        src: loadImage.image(code)
      }
    }))
  })

  const gameTypeList = ['ELECTRONIC', 'CHESS', 'FISHING', 'LOTTERY', 'VIDEO', 'SPORTS']
  const sortHomeGamesList = computed(() => {
    if (gameStore.homeGames.length) {
      return gameStore.homeGames.sort(<T extends { gameType: string }>(a: T, b: T) => {
        const indexA = gameTypeList.indexOf(a.gameType ?? '');
        const indexB = gameTypeList.indexOf(b.gameType ?? '');
        return indexA - indexB;
      });
    }
    return [];
  });

  const goToCategory = (platformId: string) => {
    if (platformId == 'null') {
      router.push(`/game/category/ELECTRONIC/0`);
      return;
    }
    for (let i = 0; i < sortHomeGamesList.value.length; i++) {
      const { gameType, platformList } = sortHomeGamesList.value[i] as { gameType: "SPORTS" | "ELECTRONIC" | "CHESS" | "FISHING" | "VIDEO" | "LOTTERY", platformList: any[] };
      for (let j = 0; j < platformList.length; j++) {
        const { id } = platformList[j];
        if (id === platformId) {
          if(gameType === 'SPORTS') {
            router.push('/game/category/sport');
            return;
          }
          router.push(`/game/category/${gameType}/${platformId}`);
          return;
        }
      }
    }
  }

  return {
    list,
    goToCategory
  }
}