import { debounce } from '@/utils'

export default debounce(async (to, from) => {
  if (['/main/entrar', '/recharge/apply'].includes(to.path)) {
    return await useHandleRecharge()
  }
  if (['/main/withdraw', '/withdraw/apply'].includes(to.path)) {
    return await useHandleWithdraw()
  }
  return false
}, 500)

