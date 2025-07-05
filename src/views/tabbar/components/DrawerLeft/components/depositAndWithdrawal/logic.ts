import { useRouter } from 'vue-router'



export default () => {
  const router = useRouter()

  const events = computed(() => ({
    entrar: goToDeposit,
    withdraw: goToWithdraw
  }))
    /**
   * @description 跳转充值
   */
    const goToDeposit = async () => {
      const bool = await useHandleRecharge()
      if (!bool)
        router.push('/main/entrar')
    }
  
    /**
     * @description 跳转提现
     */
    const goToWithdraw = async () => {
      const bool = await useHandleWithdraw()
      if (!bool)
        router.push('/main/withdraw')
    }

    const jumpTo = (path: 'entrar' | 'withdraw') => {
      events.value[path]()
    }

  return {
    jumpTo
  }
}