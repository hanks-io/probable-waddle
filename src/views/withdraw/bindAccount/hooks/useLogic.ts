import { editAccountApi } from '@/api/assets'
import { showToast } from '@/utils'
import router from '@/router'
import { TabInfo, SelectInfo } from '../../type'
import { useElementBounding } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import useWidthdrawData from '../../hooks/useWidthdrawData'
import useSpecialChar from '../../hooks/useSpecialChar'
import { delay } from '@/utils'
import{ isEmpty } from "@/utils"
import { LoginType } from "@/enums/common";
const specialCodeList = ['GCASH', 'MAYA_WALLET'] as const
const accountCode = ['GCASH', 'MYW'] as const
type SpecialCodeType = (typeof specialCodeList)[number]
type AccountCodeType = (typeof accountCode)[number]
export default () => {
	const withdrawStore = useWithdrawStore() // 提现信息 phoneCode
	const userStore = useUserStore() // 用户信息
	const appStore = useAppStore()
	const tenantStore = useTenantStore() // 商户信息
	const isSpecialCode = ref(false)
	const { t } = useI18n() // 国际化
	const footEl = ref(null)
	const { height } = useElementBounding(footEl)
	const distance = computed(() => `${(height.value * 3) / 16}rem`)
	const { phoneCode, tenantInfo } = toRefs(tenantStore)
	const { tabId: activeId, accountItems } = toRefs(withdrawStore)
	const { withdrawType } = toRefs(userStore)
	const loading = ref(false)
	const tabId = ref(activeId.value)
	const tabList = ref<TabInfo[]>([])
	const typeList = ref<SelectInfo[]>([])
	const list = ['realName', 'BANKACCOUNT', 'code']
	const accountInfo = reactive<Record<string, any>>({})
	const accountCodeMap: Record<SpecialCodeType, AccountCodeType> = {
		'GCASH': 'GCASH',
		'MAYA_WALLET': 'MYW',
	}
	const formEl = ref(null)
	const tabName = ref('')
	const tabCode = ref('')
	const withdrawTypeSubMap = new Map() // 提现类型子类Map
	const withdrawIdNameMap = new Map() // 提现类型子类Map
	const withdrawIdCodeMap = new Map() // 提现类型子类Map
	const withdrawIdMap = new Map() // 提现类型子类Map
	let accountCodeValueMap = new Map() // 提现类型子类Map
	const isReadonlyRealName = ref(false)
	const isReadonlyBANKACCOUNT = ref(false)
	const elObj: Record<string, any> = {}
	list.forEach((it) => {
		accountInfo[it] = ''
		elObj[`${it}El`] = ref(null)
	})
	const setRealName = (accountList: any[]) => {
		if (!accountList.length) return
		const valueTypeMap = new Map(accountList.map((item) => [item.valueType, item]))
		const realNameAccount = valueTypeMap.get('REALNAME')
		if (realNameAccount) {
			accountInfo.realName = realNameAccount.value
			isReadonlyRealName.value = true
		}
	}
	withdrawStore.setAccount().then((accountList) => {
		setRealName(accountList)
		accountCodeValueMap = new Map(accountList.map((item) => [`${item.code}-${item.valueType}`, item]))
	})

	const setBankAccount = async (accountList: any[], tabCode: string) => {
		if (!accountList.length) return

		const processAccount = (account: any, isReadonly: boolean = false) => {
			accountInfo.BANKACCOUNT = account.value.substring(1)
			isReadonlyBANKACCOUNT.value = isReadonly
		}
		const resetAccount = () => {
			accountInfo.BANKACCOUNT = ''
			isReadonlyBANKACCOUNT.value = false
		}

		const loginType = (await appStore.getLoginType()) || ''

		if (tenantInfo.value?.registerBindGcashMaya && loginType === LoginType.Phone) {
			const bankAccount =
				accountCodeValueMap.get(`${accountCode[0]}-BANKACCOUNT`) ||
				accountCodeValueMap.get(`${accountCode[1]}-BANKACCOUNT`)
			bankAccount && processAccount(bankAccount, true)
			return
		}

		// const account = accountCodeValueMap.get(`${accountCodeMap[tabCode as keyof typeof accountCodeMap]}-BANKACCOUNT`)
		// account ? processAccount(account) : resetAccount()
		resetAccount()
	}

	const currentRegionCode = computed(() => tenantInfo.value?.code)
	const btnDisabled = computed(() => list.every((key: string) => accountInfo[key]?.trim().length > 0))

	const init = (tabId: number) => {
		typeList.value = withdrawTypeSubMap.get(tabId)
		tabName.value = withdrawIdNameMap.get(tabId)
		tabCode.value = withdrawIdCodeMap.get(tabId)
		isSpecialCode.value = specialCodeList.includes(withdrawIdCodeMap.get(tabId))
		accountInfo.code = typeList.value.length === 1 ? typeList.value[0].code : ''
		if (isSpecialCode.value) {
			setBankAccount(accountItems.value, tabCode.value)
		} else {
			accountInfo.BANKACCOUNT = ''
		}
	}
	onMounted(async () => {
		withdrawTypeSubMap.clear()
		withdrawIdNameMap.clear()
		withdrawIdCodeMap.clear()
		withdrawIdMap.clear()
		let { activeTabId, mainTabList } = await useWidthdrawData((it: any) => {
			withdrawTypeSubMap.set(it.id, it.tenantPayWithdrawTypeSub)
			withdrawIdNameMap.set(it.id, it.name)
			withdrawIdCodeMap.set(it.id, it.code)
			withdrawIdMap.set(it.code, it.id)
		})
		tabId.value = activeTabId
		tabList.value = mainTabList
		await delay(300)
		init(tabId.value)
	})

	const tabChange = (activeId: number) => {
		withdrawStore.tabId = activeId
		init(activeId)
	}
	const getoperationType = async () => {
		const loginType = (await appStore.getLoginType()) || ''
		if (!tenantInfo.value?.registerBindGcashMaya || !isSpecialCode.value || loginType !== LoginType.Phone) {
			return 'add'
		}

		const hasGCASHAndMYW = accountCode.every((code) => accountCodeValueMap.has(`${code}-BANKACCOUNT`))
		return hasGCASHAndMYW ? 'update' : 'add'
	}

	const handleGcashMayaAccount = async (accounts: any[]) => {
		const code = accountInfo.code
		const loginType = (await appStore.getLoginType()) || ''

		if (!tenantInfo.value?.registerBindGcashMaya || !accountCode.includes(code) || loginType !== LoginType.Phone)
			return
		const newWithdrawInfo: any[] = []
		const extraCode = code === accountCode[0] ? accountCode[1] : accountCode[0]
		const hasExtraCodeList = accountItems.value.filter((item) => item.code === extraCode)
		if (hasExtraCodeList.length >= 2) return

		const currentAccount = accountCodeValueMap.get(`${extraCode}-BANKACCOUNT`) as {
			value: string
			valueType: string
			relatedCode: string
		}

		const extraAccountInfo = [
			{
				value: accountInfo.BANKACCOUNT,
				valueType: 'BANKACCOUNT',
			},
			{
				value: accountInfo.realName,
				valueType: 'REALNAME',
			},
		]

		const relatedCode = !isEmpty(currentAccount?.relatedCode) ? currentAccount.relatedCode : uuidv4()
		extraAccountInfo.forEach(({ value, valueType }) => {
			newWithdrawInfo.push({
				code: extraCode,
				valueType,
				value,
				isDefault: true,
				relatedCode,
			})
		})

		const extraMainCode = tabCode.value === specialCodeList[0] ? specialCodeList[1] : specialCodeList[0]
		accounts.push({
			tenantWithdrawTypeId: withdrawIdMap.get(extraMainCode),
			withdrawInfo: newWithdrawInfo,
		})
	}

	const addAccount = async () => {
		let nodeList = formEl.value?.querySelectorAll('.ion-invalid')
		if (nodeList && nodeList.length) return
		let withdrawInfo: any[] = []
		let code = accountInfo.code
		let relatedCode = uuidv4()
		const loginType = (await appStore.getLoginType()) || ''
		//  真实姓名只保留128个字符
		if (accountInfo.realName.length > 128) {
			accountInfo.realName = accountInfo.realName.slice(0, 128)
		}

		const isGcashMayaCode = (value: string) => {
			return (
				tenantInfo.value?.registerBindGcashMaya &&
				accountCode.includes(value as AccountCodeType) &&
				loginType === LoginType.Phone
			)
		}

		if (isGcashMayaCode(accountInfo.code)) {
			const currentAccount = accountCodeValueMap.get(`${accountInfo.code}-BANKACCOUNT`)
			if (!isEmpty(currentAccount?.relatedCode)) {
				relatedCode = currentAccount.relatedCode
			}
		}
		// 处理主账户信息
		Object.entries(accountInfo).forEach(([key, value]) => {
			if (key !== 'code' && value) {
				withdrawInfo.push({
					code,
					valueType: key.toUpperCase(),
					value,
					isDefault: true,
					relatedCode,
				})
			}
		})
		let accounts = [
			{
				tenantWithdrawTypeId: tabId.value,
				withdrawInfo,
			},
		]

		// 处理关联账户信息

		handleGcashMayaAccount(accounts)

		console.log(accounts, 'withdrawInfo222', await getoperationType())
		try {
			await editAccountApi({ accounts, operationType: await getoperationType() })
			showToast(`${t(`toast.bindSuccess`)}`)
			router.back()
		} catch (error) {
			// showToast(`${t(`toast.bindFail`)}`)
		}
	}
	const selectChange = (e: CustomEvent) => {
		accountInfo.code = e.detail.value
	}
	const handleInput = (event: CustomEvent) => {
		setTimeout(() => {
			accountInfo.realName = useSpecialChar(event)
		})
	}
	const handleInputBankCard = (event: CustomEvent) => {
		if (currentRegionCode.value === 'VN') {
			accountInfo.BANKACCOUNT = event.detail.value
			return
		}
		setTimeout(() => {
			accountInfo.BANKACCOUNT = event.detail.value.replace(/[^\d]/g, '')
		}, 0)
	}

	return {
		loading,
		tabId,
		typeList,
		withdrawType,
		accountInfo,
		btnDisabled,
		tabList,
		elObj,
		formEl,
		tabName,
		distance,
		footEl,
		phoneCode,
		currentRegionCode,
		tabCode,
		isReadonlyRealName,
		isSpecialCode,
		isReadonlyBANKACCOUNT,
		t,
		addAccount,
		selectChange,
		tabChange,
		handleInput,
		handleInputBankCard,
	}
}
