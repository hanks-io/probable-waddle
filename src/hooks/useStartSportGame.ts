
import useSportGame from './useSportGame'
import useBetbySprotGame from "./useBetbySprotGame";
import { TGameInfo } from '@/store/game'
import router from '@/router'
import { emitter } from '@/utils/event'
import { getMobileOperatingSystem } from '@/utils/custom'
import { goMain } from './navigate'
import { showLogin } from '@/hooks/ShowLogin'


export default async (game: TGameInfo, isForce: boolean = false) => {

  if (game.target !== 'hall') return
  const gameStore = useGameStore()
  const tenantStore = useTenantStore()
  const userStore = useUserStore()
  await userStore.getUser()
  const userId = userStore.user?.userId!

  if (!userId) {
    showLogin()
    return
  }

  let { name, platformId, code, gameType } = game

  const bridgeGameList = ['Betby']
  const externalGameList = ['M8SPORTS']

  if (bridgeGameList.includes(code)) {
    await useBetbySprotGame()
  }

  if (externalGameList.includes(code)) {
    await useSportGame(game)
  }

  if (game) {
    gameStore.addRecentGame(game)
    sessionStorage.setItem('gameCode', game.name || '')
  }


  if (externalGameList.includes(code)) {
    window.open(gameStore.gameSportsUrl, '_blank');
  } else if (bridgeGameList.includes(code)) {
    if (isForce) {
      goMain("/main/Betby")
    } else {
      router.push("/main/Betby")
    }

  } else {
    if (isForce) {
      goMain(`/main/gameSports/${gameType}/${platformId}`)
    } else {
      router.push(`/main/gameSports/${gameType}/${platformId}`)
    }

  }


  emitter.emit('user/play-game', {
    gameId: '',
    userId: userId,
    tenantId: Number(tenantStore.tenantId),
  })

}
