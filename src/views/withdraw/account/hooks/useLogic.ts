import useWithdrawAccount from '@/hooks/useWithdrawAccount'
import { editAccountApi, deleteWithdrawAccountApi, withdrawAccountApi } from '@/api/assets'
import { TabInfo, CardInfo } from '../../type'
import { showToast } from '@/utils'
import router from '@/router'
import useWidthdrawData from '@/views/withdraw/hooks/useWidthdrawData'


interface AccountList extends CardInfo {
  ids: number[],
  isDefault: boolean
}
export default () => {
  const route = router.currentRoute
  const withdrawStore = useWithdrawStore() // 提现信息
  const { tabId: activeId } = toRefs(withdrawStore)
  const loading = ref(false)
  const isDisabled = ref(false)
  const accountList = ref<AccountList[]>([])
  const relatedCode = ref('')
  const tabList = ref<TabInfo[]>([])
  const tabId = ref<number>(activeId.value)
  const subTabMap = new Map() // 提现类型子类Map
  const accountMaxMap = new Map() // 提现类型子类Map
  const bindAccountMax = ref(1)// 绑定账号最大数量
  let deleteRelatedCode = ''
  let deleteIFSC = ref('')
  let subTypeList: any[] = []
  let activeAccount: any[] = []
  const modelValue = ref(false)
  const closeHandle = () => {
    modelValue.value = false
  }
  const isShowAddCard = ref(false)
  const modifyAccount = async (relatedCode: string, extraData: any[] = [], operationType: string = 'update') => {
    let withdrawInfo = activeAccount.filter(it => it.relatedCode === relatedCode).map(it => {
      let { valueType, code, id, value } = it
      return { isDefault: true, valueType, code, id, value, relatedCode }
    })
    if (extraData.length) {
      withdrawInfo.push(...extraData)
    }
    let accounts = [
      {
        tenantWithdrawTypeId: tabId.value,
        withdrawInfo
      }

    ]

    try {
      await editAccountApi({ accounts, operationType })
      // showToast(`${t(`toast.bindSuccess`)}`)

    } catch (error) {
      // showToast(`${t(`toast.bindFail`)}`)
    }
  }
  const deleteAccount = async () => {
    let index = accountList.value.findIndex(it => it.relatedCode === deleteRelatedCode)
    if (index === -1) return
    let target = accountList.value[index]

    try {
      // 调用删除接口
      await deleteWithdrawAccountApi(target.ids)

      // 不用接口更新数据 ，手动删除数据
      accountList.value.splice(index, 1)

      modelValue.value = false
      //如果删除是默认，删除以后提款账号不为空， 要设置已有提款账号一个为默认的
      if (target.isDefault && accountList.value.length >= 1) {
        // 更新接口，把第一个设置为默认的 传给后端
        let code = accountList.value[0].relatedCode
        modifyAccount(code)
        // 修改已有提款列表第一个位默认的， 
        accountList.value[0].isDefault = true
        relatedCode.value = code
      }
      showToast(`${t(`toast.deleteSuccess`)}`)
    } catch (error) {
      showToast(`${t(`toast.deleteFail`)}`)
    }

  }

  const handleDelete = async (relatedCode: string) => {
    deleteRelatedCode = relatedCode
    deleteIFSC.value = accountList.value.find(it => it.relatedCode === deleteRelatedCode)?.IFSC!
    modelValue.value = true
  }
  const modifyDefault = async (e: CustomEvent) => {
    if (isDisabled.value) return
    isDisabled.value = true
    let relatedCode = e.detail.value
    let oldRelatedCode = ''
    let updateList = activeAccount.filter(it => it.isDefault).map(it => {
      let { valueType, code, id, value, relatedCode } = it
      oldRelatedCode = relatedCode
      return { isDefault: false, valueType, code, id, value, relatedCode }
    })
    try {
      await modifyAccount(relatedCode, updateList, 'editDefault')

      // 修改成功后，不用接口更新数据， 直接改以前数据

      const cbFn = (it: AccountList) => {
        if (it.relatedCode === relatedCode) {
          it.isDefault = true
        } else if (it.relatedCode === oldRelatedCode) {
          it.isDefault = false
        }
      }
      accountList.value.forEach(cbFn)
      activeAccount.forEach(cbFn)

      isDisabled.value = false

    } catch (error) {
      isDisabled.value = false
    }

  }

  const updateAccount = async (tenantWithdrawTypeId: number) => {
    if (loading.value) return 
    loading.value = true
    let accountResult = await withdrawAccountApi({ tenantWithdrawTypeId })
    activeAccount = [...accountResult.queryData]
    accountList.value = useWithdrawAccount(activeAccount, subTypeList)
    if (accountList.value.length) {
      relatedCode.value = accountList.value[0]?.relatedCode;
    }

    loading.value = false
  }
  const tabChange = async (activeId: number) => {
    withdrawStore.tabId = activeId
    subTypeList = subTabMap.get(activeId)
    await updateAccount(activeId)
    bindAccountMax.value = accountMaxMap.get(activeId)
    isShowAddCard.value = bindAccountMax.value > accountList.value.length
  }
 

  watch(() => route.value.path, async (newPath) => {
    if (newPath == '/withdrawalAccount') {
      let {
        activeTabId,
        subTabList,
        mainTabList,
      } = await useWidthdrawData((it: any) => {
        accountMaxMap.set(it.id, it.withdrawalAccountMax)
        subTabMap.set(it.id, it.tenantPayWithdrawTypeSub)
      })
      tabList.value = mainTabList
      tabId.value = activeTabId
      subTypeList = subTabList
   await updateAccount(tabId.value)
      bindAccountMax.value = accountMaxMap.get(activeTabId)
      isShowAddCard.value = bindAccountMax.value > accountList.value.length

    }


  }, { immediate: true })

  return {
    relatedCode,
    loading,
    modelValue,
    accountList,
    deleteIFSC,
    tabList,
    tabId,
    isDisabled,
    isShowAddCard,
    closeHandle,
    modifyDefault,
    handleDelete,
    deleteAccount,
    tabChange
  }
}
