import { RouterOutput } from '@/trpc/app.trpc'
import { moneyConvertToServer} from '@/utils/custom'

// 提现页面类型
export enum WithdrawPageType {
	WITHDRAW = 1,
	WITHDRAW_RECORD = 2,
	WITHDRAW_AUDIT = 3,
}

export type TWithdrawAccountData = RouterOutput['withdraw']['getWithdrawAccount']
export type TWithdrawAccountItem = TWithdrawAccountData['queryData'][number]

import { WithdrawTypeModel } from '@/api/assets/model'
import { useUserStore } from '@/store/user'
import { showToast } from '@/utils'

export async function checkCanWithdraw(amount: string, withdrawType: WithdrawTypeModel['withdrawType'][number]) {
	const userStore = useUserStore()
	await userStore.setAssets()

	const validations = [
		{
			condition: !Number.isInteger(Number(amount)),
			message: 'toast.0003'
		},
		{
			condition: () => {
				const serverAmount = moneyConvertToServer(amount)
				return !userStore.assets?.balance || userStore.assets?.balance < serverAmount
			},
			message: 'toast.insufficientAccountBalance'
		},
		{
			condition: () => moneyConvertToServer(amount) < withdrawType.minAmount,
			message: 'toast.withdrawalAmountTooSmall'
		},
		{
			condition: () => moneyConvertToServer(amount) > withdrawType.maxAmount,
			message: 'toast.withdrawalAmountTooLarge'
		}
	]

	for (const validation of validations) {
		const isInvalid = typeof validation.condition === 'function' 
			? validation.condition()
			: validation.condition

		if (isInvalid) {
			showToast(validation.message)
			return false
		}
	}


	return true
}
