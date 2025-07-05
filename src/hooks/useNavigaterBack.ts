import { useEventStore } from '@/store/event'
import { useSystemStore } from '@/store/system';
import router from '@/router'

export default () => {
  const eventStore = useEventStore();
  const systemStore = useSystemStore();
  const routeSide = Number(router.options.history.state.position)

  if (systemStore.isIOS && systemStore.isPwa && router.currentRoute.value.query.sd != '2') {
    router.replace('/main/inicio?sd=2')
  } else if (routeSide > 0 && eventStore.previousRoute !== '/') {
    router.back()
  } else {
    sessionStorage.setItem('href', '/main')
    router.replace('/launch')
  }
}
