import { useI18n } from 'vue-i18n'




export default (props: { listMaps: any[] }) => {
  const { t } = useI18n()

  const tabMaps = {
    withdraw: {
      text: 'main.withdraw',
      tab: 'withdraw',
      route: '/main/withdraw',
    },
    entrar: {
      text: 'main.entrar',
      tab: 'entrar',
      route: '/main/entrar',
    },
    vip: {
      text: 'activity.vip41',
      tab: 'vip',
      route: '/activity/vip',
    },
    promo: {
      text: 'main.promo',
      tab: 'promo',
      route: '/main/promo'
    }
  }

  const list = computed(() => {
    const { listMaps } = props;
    return listMaps.map(routerName => {
      const item = tabMaps[routerName as keyof typeof tabMaps]
      if (!item) return {};
      return {
        ...item,
        name: t(item.text),
      }
    })
  });

  return {
    list
  }
}