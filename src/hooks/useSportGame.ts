import { platformLoginApi } from '@/api/game'
import { RedirectUrl } from '@/common/data'
import { TGameInfo } from '@/store/game'
import { showLoading } from '@/utils/loading'
import { isMobileDevice } from '@/utils/custom'
export default async (game: TGameInfo) => {
  const userStore = useUserStore()
  const gameStore = useGameStore()
  const tenantStore = useTenantStore()
  await userStore.getUser()
  const userId = userStore.user?.userId!
  if (!userId) return
  const language = computed(() => tenantStore.tenantInfo?.language) // 语言
  let apptype = isMobileDevice() ? 2 : 1
  let { platformId, gameType, name } = game
  let params = {
    gameType,
    lobbyUrl: RedirectUrl,
    platformId,
    userId,
    apptype


  }
  showLoading();

  let result = await platformLoginApi(params);
  gameStore.gameSportsUrl = result.loginUrl
  return result.loginUrl
  // gameStore.gameSportsUrl = name === "SABA" ? `${result.loginUrl}&lang=${langMap?.[language.value]}` : result.loginUrl
  // console.log(gameStore.gameSportsUrl, 'gameStore.gameSportsUrl');
 
}
