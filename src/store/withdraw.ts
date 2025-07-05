import { Storage } from '@ionic/storage'
import { defineStore } from 'pinia'
import { TWithdrawAccountItem, WithdrawPageType } from '@/hooks/useWithdraw'
import { withdrawAccountApi } from '@/api/assets'
import { WithdrawAccountParams } from '@/api/assets/model'
import { getUserWithdrawInfoApi } from '@/api/assets'

const storage = new Storage()
	; (async () => {
		await storage.create()
	})()

interface WithdrawState {
	tabPageIndex: WithdrawPageType
	typeId: number
	subTypeId: number
	tabId: number
	accountItems: TWithdrawAccountItem[]
	userWithdrawInfo: Record<string, any>
	isHideAuditRecords: boolean

}
const getValue = (state: WithdrawState, type: string) => (
	state.accountItems.find(it => it.tenantWithdrawTypeId === state.tabId && it.code === type)?.value ?? ""

)
export const useWithdrawStore = defineStore({
	id: 'withdraw',
	state: (): WithdrawState => ({
		tabPageIndex: WithdrawPageType.WITHDRAW_RECORD,
		typeId: 0,
		subTypeId: 0,
		accountItems: [],
		tabId: -1,
		isHideAuditRecords: true,
		userWithdrawInfo: {}
	}),

	getters: {
		getName(state) {
			return getValue(state, 'REALNAME')
		},
		getCPF(state) {
			return getValue(state, 'CPF')
		},
		getPhone(state) {
			return getValue(state, 'PHONE')
		},
		getEmail(state) {
			return getValue(state, 'EMAIL')
		},
		getCNPJ(state) {
			return getValue(state, 'CNPJ')

		},
		getEVP(state) {
			return getValue(state, 'EVP')
		},
	},

	actions: {
		setTabPageIndex(index: WithdrawPageType) {
			this.tabPageIndex = index
		},
		setWithdrawTypeId(id: number) {
			this.typeId = id
		},
		setWithdrawSubTypeId(id: number) {
			this.subTypeId = id
		},
		async setUserWithdrawInfo() {
			this.userWithdrawInfo = await getUserWithdrawInfoApi()
			this.isHideAuditRecords = this.userWithdrawInfo.withdrawConfig.appAuditRecordsSwitch === "OFF"
			return this.userWithdrawInfo

		},
		async setAccount(params?: WithdrawAccountParams) {
			if (!params) {
				params = { tenantWithdrawTypeId: undefined }
			}
			const res = await withdrawAccountApi(params)
			this.accountItems = res.queryData

			return res.queryData
		},
	},
})
