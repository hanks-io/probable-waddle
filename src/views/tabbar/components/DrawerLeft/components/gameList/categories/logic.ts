import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/game'


export default (props: any) => {
  const { t } = useI18n()
  const router = useRouter()
  const gameStore = useGameStore()

  // 最流行分类
  const hotTab = computed(() => ({
    gameType: 'POPULAR',
    name: t('sort.POPULAR'),
    src: props.loadImage.icon('POPULAR')
  }))

  const list = computed(() => {
    return [hotTab.value].concat(gameStore.homeGames.map(item => {
      const { gameType } = item;
      const { loadImage } = props;
      return {
        ...item,
        name: t(`sort.${gameType}`),
        src: loadImage.icon(gameType)
      }
    }))
  })

  const goToCategory = (item: any) => {
    const { gameType } = item;
    if (gameType === 'POPULAR') {
      router.push('/game/search/POPULAR');
      return;
    }
    if (gameType === 'SPORTS') {
      router.push(`/game/category/sport`);
      return;
    }
    router.push(`/game/category/${gameType}/0`);
  }

  return {
    list,
    goToCategory
  }
}