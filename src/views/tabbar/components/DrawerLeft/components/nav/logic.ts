import { useI18n } from 'vue-i18n';
import { menuController } from "@ionic/vue";
import { getImageUrl } from '@/utils/url'
import useNavigator from '@/views/tabbar/components/tabBar/useNavigator';




export default () => {
  const { t } = useI18n();

  const { navigator } = useNavigator();

  const initNavList = [
    {
      tab: 'sort.SEARCH',
      icon: '/svg/search.svg',
      path: '/game/search/POPULAR',
    },
    {
      tab: 'sort.FAVORITE',
      icon: '/icons/sort/FAVORITE_on.svg',
      path: '/game/search/FAVORITE',
    },
    {
      tab: ['main.agent', 'main.center'],
      icon: getImageUrl('svg/agent.svg'),
      path: '/spread',
    },
    {
      tab: 'sort.RECENT',
      icon: getImageUrl('svg/recent.svg'),
      path: '/game/search/RECENT',
    },
  ]

  const navList = computed(() => {
    return initNavList.map(item => {
      const { tab, ...rest } = item;
      const tabName = Array.isArray(tab) ? tab.map(item => t(item)).join('') : t(tab);
      return {
        ...rest,
        tab: tabName,
      }
    })
  })

  const jumpToPage = (path: string) => {
    menuController.close('main-menu')
    navigator(path)
  }

  return {
    navList,
    jumpToPage,
  }
}