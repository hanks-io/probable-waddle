

export default (accountList: any[], subTypeList: any[]) => {
  console.log(accountList,subTypeList, 'accountList');
  if (!accountList.length) return []
  const codeMay = new Map()
  subTypeList.forEach((it: any) => codeMay.set(it.code, { icon: it.icon, name: it.name, id: it.id, logo: it.logo || it.icon }))
  const relatedCodelist: any[] = []

  return accountList.reduce((init: any[], cur: any, index: number, list: any[]) => {
    const { relatedCode, tenantWithdrawTypeId, isDefault } = cur
    if (relatedCode && !relatedCodelist.includes(relatedCode)) {
      relatedCodelist.push(relatedCode)

      const samelist = list.filter(it => it.relatedCode === cur.relatedCode)
      const code = samelist.find(it => it.valueType === 'BANKACCOUNT')?.code
      if (code && codeMay.get(code)) {
        const {  name, id , logo} = codeMay.get(code)
        const ids = samelist.map((it: any) => it.id)
        const valueTypeMay = { icon:logo, name, ids, relatedCode, isDefault, tenantWithdrawTypeId, tenantWithdrawTypeSubId: id }
        samelist.forEach((it: any) => valueTypeMay[it.valueType] = it.value)
        samelist.length > 1 && init.push(valueTypeMay) 
      }

    }
    return init
  }, []).sort((it1, it2) => it2.isDefault - it1.isDefault)
}
