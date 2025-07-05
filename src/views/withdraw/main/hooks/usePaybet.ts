export const isNeedRegisterAccount = ref(false)
export const paybetAccountInfo = ref({
  address: '',
  walletUserId: '',
  accountInfo: '',
})

export const isPaybetWallet = ref(false)
export const usePaybet = (code: string, mainTabId: number) => {


  if (code !== 'PAYBETWALLET'){
    isPaybetWallet.value = false
    isNeedRegisterAccount.value = false
    paybetAccountInfo.value = {
      address: '',
      walletUserId: '',
      accountInfo: '',
    }
    return
  } 
  
  const withdrawStore = useWithdrawStore()
  const { accountItems } = toRefs(withdrawStore)
  isPaybetWallet.value = true
  // Create map of accounts by tenantWithdrawTypeId and code
  const accountMap = new Map(
    accountItems.value.filter((account: any) => account.code === code).map((account: any) => [
      `${account.tenantWithdrawTypeId}-${account.code}`, 
      {accountInfo: account.value, ...(JSON.parse(account.value as string))}
    ])
  )

  // Check if account needs to be registered
  const accountKey = `${mainTabId}-${code}`
  isNeedRegisterAccount.value = !accountItems.value.length || !accountMap.has(accountKey)

  if (isNeedRegisterAccount.value) return

  // Get account info if registered
  
  paybetAccountInfo.value = accountMap.get(accountKey) as any
}

