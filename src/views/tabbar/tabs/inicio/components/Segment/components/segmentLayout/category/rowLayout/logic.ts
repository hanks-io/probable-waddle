import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/store/game'


export default (props: any, emit: any) => {
  const { t } = useI18n();
  const router = useRouter();
  const gameStore = useGameStore()

  const segmentRef = ref(null);
  const hotTab = computed(() => {
    const total = gameStore.popularGames.length;
    return {
      id: 'null',
      name: t('sort.POPULAR'),
      code: "ONE_API_HOT",
      total,
    }
  })
  const tabValue = ref(hotTab.value.id);

  const sortGameTypeList = computed(() => gameStore.homeGames.sort((a, b) => (b.gameTypeSort ?? 0) - (a.gameTypeSort ?? 0)))

  const tabs = computed(() => {
    const list = sortGameTypeList.value.map((item) => {
      const { gameType } = item
      return {
        ...item,
        id: gameType,
        code: gameType,
        name: t(`sort.${gameType}`),
      }
    })
    list.unshift(hotTab.value)
    return list
  })

  const tabsList = computed(() => {
    if (props.noHot) {
      return sortGameTypeList.value.map((item) => {
        const { gameType } = item
        return {
          ...item,
          id: gameType,
          code: gameType,
          name: t(`sort.${gameType}`),
        }
      });
    }
    return tabs.value;
  })

  const tabClick = (tab: any) => {
    tabValue.value = tab.id;
    if (tabValue.value === hotTab.value.id) {
      router.push('/game/search/POPULAR');
    } else if (tabValue.value === 'SPORTS') {
      router.push('/game/category/sport');
    } else {
      router.push(`/game/category/${tabValue.value}/0`);
    }
  }

  // row布局专用watch
  watch(() => gameStore.platformHotGameList, (list) => {
    emit('tabChange', { filterGameList: list })
  }, { immediate: true });

  return {
    tabs,
    hotTab,
    tabsList,
    tabClick,
    tabValue,
    segmentRef,
  }
}