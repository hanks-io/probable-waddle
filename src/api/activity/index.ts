import { appTrpc } from '@/trpc/app.trpc'
import { apiHandle } from '../handle'
import type {
	ActivityAgentValidUsersParams,
	ActivityApplyParams,
	ActivityRecordParams,
	ActivityVipReceiveParams,
	ActivityRedeemCodeParams,
	RedPointParams,
	BatchDiscountReceiveParams,
	ActivityBatchReceiveParams,
	directRechargeParams,
	InviteCpfRecordParams,
	UserReceivedListParams,
	bonusPoolContributionListParams
} from './model'
import { TActivityType } from '@/enums/types/activity.type'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'

/**
 * @description 获取活动列表
 */
export const activityListApi = async () => {
	const api = await useAppStore().checkUserHasLogin() ? appTrpc.activity.list.query : appTrpc.activity.listPublic.query
	return apiHandle(api, undefined, false)
}

/**
 * @description 获取活动配置
 */
export const activityConfigApi = () => apiHandle(appTrpc.activity.config.query, undefined, false)

/**
 * @description 用户VIP等级信息
 */
export const activityVipInfoApi = () => apiHandle(appTrpc.vip.info.query)

/**
 * @description VIP层级列表
 */
export const activityVipLevelListApi = () => apiHandle(appTrpc.vip.list.query)

/**
 * @description 一键领取奖励
 */
export const activityVipReceiveApi = (params: ActivityVipReceiveParams = {}) =>
	apiHandle(appTrpc.vip.receiveAll.mutate, params)

/**
 * @description 获取充值活动信息
 */
export const activityRechargeInfoApi = (activityId: number) => getActivityDetail(activityId, 'Recharge')

/**
 * @description 获取兑换码活动配置
 */
export const activityRedeemConfigApi = () => apiHandle(appTrpc.redeemCode.redeemCodeConfig.mutate, {}, false)

/**
 * @description 兑换码活动兑换奖券
 */
export const activityRedeemCodeApi = (params: ActivityRedeemCodeParams) => apiHandle(appTrpc.redeemCode.info.mutate, params)

/**
 * @description 获取救援金活动信息
 */
export const assistanceDetailApi = (activityId: number) => getActivityDetail(activityId, 'Assistance')

/**
 * @description 申请活动奖励
 */
export const activityApplyApi = (params: ActivityApplyParams) => {
	return apiHandle(appTrpc.activity.apply.mutate, { ...params, appType: useSystemStore().app?.build })
}

/**
 * @description 获取幸运大转盘活动信息
 */
export const luckWheelDetailApi = (activityId: number) => getActivityDetail(activityId, 'LuckyWheel')

/**
 * @description 获取返水活动信息
 */
export const rebateDetailApi = (activityId: number) => getActivityDetail(activityId, 'Rebate')

/**
 * @description 获取代理活动信息
 */
export const activityAgentDetailApi = (activityId: number) => getActivityDetail(activityId, 'Agency')

/**
 * @description 获取会员答谢活动信息
 */
export const appreciationDetailApi = (activityId: number) => getActivityDetail(activityId, 'MemberReward')

/**
 * @description 获取会员答谢(多日)活动信息
 */
export const appreciationMultiDayDetailApi = (activityId: number) => getActivityDetail(activityId, 'MemberRewardMultiDay')

/**
 * @description 获取神秘彩金活动信息
 */
export const mysteriousDetailApi = (activityId: number) => getActivityDetail(activityId, 'MysteryReward')

/**
 * @description 获取代理有效会员列表
 */
export const activityAgentMemberApi = (params: ActivityAgentValidUsersParams) =>
	apiHandle(appTrpc.activity.validUsers.query, params)

/**
 * @description 获取签到活动信息
 */
export const signDetailApi = (activityId: number) => getActivityDetail(activityId, 'SignIn')

/**
 * @description 获取签到奖励活动信息
 */
export const levelSignDetailApi = (activityId: number) => getActivityDetail(activityId, 'SignInVolume')

/**
 * @description 获取CPF-邀请活动-邀请记录
 */
export const inviteCpfRecordApi = (params: InviteCpfRecordParams) => apiHandle(appTrpc.activity.inviteRecords.query, params, false)

/**
 * @description 获取充值大酬宾-活动信息
 */
export const rechargePromotionApi = (activityId: number) => getActivityDetail(activityId, 'RechargePromotion')

/**
 * @description 获取助力领现活动信息
 */
export const assistanceCashDetailApi = (activityId: number) => getActivityDetail(activityId, 'AssistanceCash')

/**
 * @description 获取全平台助力领现金兑现玩家列表
 */
export const assistanceCashAwardsApi = (activityId: number) =>
	apiHandle(appTrpc.activity.assistanceCashAwards.query, { activityId }, false)

/**
 * @description 获取助力领现金我的助力列表
 */
export const assistanceCashHelpsApi = (activityId: number) =>
	apiHandle(appTrpc.activity.assistanceCashHelps.query, { activityId })

/**
 * @description 获取/设置分享电话号码使用
 */
export const sharePhoneApi = (params: { phones: string[] }) => apiHandle(appTrpc.activity.sharePhone.mutate, params)

/**
 * @description 获取奖励记录
 */
export const rewardRecordApi = (params: ActivityRecordParams) => apiHandle(appTrpc.activity.recordList.query, params)

/**
 * @description 获取当前可领取的奖励列表
 */
export const rewardListApi = () => apiHandle(appTrpc.activity.receiveList.query)

/**
 * @description 一键领取奖励
 */
export const batchAwardApi = (params: ActivityBatchReceiveParams) => apiHandle(appTrpc.activity.batchAward.mutate, params)

/**
 * @description 获取自定义活动信息
 */
export const activityCustomDetailApi = (activityId: number) => getActivityDetail(activityId, 'Custom')

/**
 * @description 获取红包雨活动信息
 */
export const redPacketDetailApi = async (activityId: number) => {
	const type: TActivityType = 'RedPacket'
	return (await useAppStore().checkUserHasLogin() ? activityDetailApi : activityDetailPublicApi)(activityId, type)
}

/**
 * @description 获取充值赠送活动信息
 */
export const rechargeGiveDetailApi = (activityId: number) => getActivityDetail(activityId, 'RechargeReward')

/**
 * @description 获取活动详情
 * @param activityId
 * @param type
 * @returns
 */
export const activityDetailApi = (activityId: number, type: TActivityType) =>
	apiHandle(appTrpc.activity.activityDetail.query, { activityId, type })

export const activityDetailPublicApi = (activityId: number, type: TActivityType) =>
	apiHandle(appTrpc.activity.activityDetailPublic.query, { activityId, type }, false)

export async function getActivityDetail(activityId: number, type: TActivityType) {
	return (await useAppStore().checkUserHasLogin() ? activityDetailApi : activityDetailPublicApi)(activityId, type)
}

/**
 * @description 获取推荐活动列表
 */
export const suggestionActivityListApi = () => apiHandle(appTrpc.suggestionActivity.list.query, undefined, false)

/**
 * @description 获取活动红点
 */
export const redPointApi = (params: RedPointParams) => apiHandle(appTrpc.activity.redPoint.query, params)

/**
 * @description 获取批量优惠彩金列表
 */
export const batchDiscountListApi = () => apiHandle(appTrpc.reward.list.query)

/**
 * @description 领取批量优惠彩金
 */
export const batchDiscountReceiveApi = (params: BatchDiscountReceiveParams) => apiHandle(appTrpc.reward.receive.mutate, params)


/**
 * @description 查询直属下级充值列表
 */
export const directRechargeListApi = (params: directRechargeParams) => apiHandle(appTrpc.activity.directRechargeList.query, params)

/**
 * @description 领取强制更新奖励
 */
export const getBindingNewPwaRewardApi = (params: BatchDiscountReceiveParams) => apiHandle(appTrpc.activity.googleDomainReward.mutate, params)



/**
 * @description 领取强制更新奖励
 */
export const getUserReceivedListApi = (params: UserReceivedListParams) => apiHandle(appTrpc.activity.userReceivedList.query, params)

/**
 * @description 获取新用活动状态 例如新人专享
 */
export const getUserHomeTopApi = () => apiHandle(appTrpc.activity.homeTop.query, undefined, false)


/**
 * @description 获取新用活动状态 例如新人专享
 */
export const getNewUserExclusiveApi = (activityId: number) => getActivityDetail(activityId, 'NewUserExclusive')


/**
 * @description 奖金池贡献列表
 */
export const getBonusPoolContributionListApi = (params: bonusPoolContributionListParams) => apiHandle(appTrpc.activity.bonusPoolContributionList.query, params, )
