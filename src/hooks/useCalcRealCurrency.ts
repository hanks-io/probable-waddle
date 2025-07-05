export const useCalcRealCurrencyRatio = async () => {
  const tenantStore = await useTenantStore()
  return 10000 / (tenantStore.tenantInfo?.rechargeRatio || 10000)
}

//  通过虚拟货币（游戏币），获取真实货币
export const useGetRealCurrency = async (virtualCurrency: number) => {
  const ratio = await useCalcRealCurrencyRatio()
  return virtualCurrency * ratio
}


//  通过真实货币，获取虚拟货币（游戏币）
export const useGetVirtualCurrency = async (realCurrency: number) => {
  const ratio = await useCalcRealCurrencyRatio()
  return realCurrency / ratio
}
