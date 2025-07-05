import { goMain } from '@/hooks/navigate'
import router from '@/router'
export default async (path: string, flag = false) => {
  const systemStore = useSystemStore();	// 系统信息
  const isPwa = computed(() => systemStore.isPwa);
  let game = window.sessionStorage.getItem('BetbyGame')
  if (game) {
    window.sessionStorage.removeItem("BetbyGame")
  }
  const gotoPage = (path: string) => {
    if (path.startsWith('/main/')) {
      goMain(path);
    } else {
      router.push(path)
    }
  }
  if ((game || flag) && isPwa.value) {
    router.go(-1)
    setTimeout(() => {
      gotoPage(path);
    }, 20);

  } else {
    gotoPage(path);
  }

}
