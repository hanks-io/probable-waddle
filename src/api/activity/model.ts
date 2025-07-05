import type { RouterInput, RouterOutput } from '@/trpc/app.trpc'
import { ActivityMap } from '@/enums/types/activity.type'
import z from 'zod/lib'

// ---------------------------------活动总览---------------------------------
// 获取活动列表
export type ActivityListModel = RouterOutput['activity']['list']

// 获取活动配置
export type ActivityConfigModel = RouterOutput['activity']['config']

// ---------------------------------VIP活动---------------------------------

// 获取用户VIP等级信息
export type ActivityVIPInfoModel = RouterOutput['vip']['info']


// 获取VIP层级列表
export type ActivityVIPLevelListModel = RouterOutput['vip']['list']
export type ActivityVIPUserReceiveItem = RouterOutput['vip']['list']['vipUserReceiveList'][number]

// 一键领取奖励
export type ActivityVipReceiveParams = RouterInput['vip']['receiveAll']
export type ActivityReceiveType = ActivityVipReceiveParams['receiveType']
export type ActivityVipReceiveModel = RouterOutput['vip']['receiveAll']

// ---------------------------------充值活动---------------------------------
// 获取充值活动信息
export type ActivityRechargeInfoModel = z.infer<typeof ActivityMap.Recharge.showData>
export type ActivityRechargeRewardItem = ActivityRechargeInfoModel['config']['rewardLevels'][number]

// ---------------------------------兑换码活动---------------------------------
export type ActivityRedeemConfigModel = RouterOutput['redeemCode']['redeemCodeConfig']
export type ActivityRedeemCodeParams = RouterInput['redeemCode']['info']

// ---------------------------------救援金活动---------------------------------
// 获取救援金活动信息
export type AssistanceDetailModel = z.infer<typeof ActivityMap.Assistance.showData>
// 申请救援金传参
export type ActivityApplyParams = RouterInput['activity']['apply']

// ---------------------------------幸运转盘活动---------------------------------
// 获取幸运转盘活动信息返回值
export type LuckWheelDetailModel = z.infer<typeof ActivityMap.LuckyWheel.showData>

// ---------------------------------代理活动---------------------------------
export type ActivityAgentDetailModel = z.infer<typeof ActivityMap.Agency.showData>
export type ActivityAgentRewardItem = ActivityAgentDetailModel['rewardConfig'][number] & {
	rewardAmount: number
	isOpen: boolean
	isMeet: boolean
	showOpenAni: boolean
}
export type ActivityAgentValidUsersParams = RouterInput['activity']['validUsers']
export type ActivityAgentValidUsersModel = RouterOutput['activity']['validUsers']
export type ActivityAgentValidUserItem = ActivityAgentValidUsersModel['pageData'][number]

// ---------------------------------返水活动---------------------------------
// 获取返水活动信息返回值
export type RebateDetailModel = z.infer<typeof ActivityMap.Rebate.showData>

// ---------------------------------活动总览---------------------------------
// 获取奖励记录传参
export type ActivityRecordParams = RouterInput['activity']['recordList']
// 获取奖励记录返回值
export type ActivityRecordModel = RouterOutput['activity']['recordList']
export type ActivityRecordItemOrigin = ActivityRecordModel['recordList'][number]
export type ActivityRecordItem = Omit<ActivityRecordItemOrigin, 'remake'> & { remake: { [key: string]: any } }
// 可领取奖励列表
export type ActivityRewardListModel = RouterOutput['activity']['receiveList']
// 一键领取奖励
export type ActivityBatchReceiveParams = RouterInput['activity']['batchAward']

// ---------------------------------自定义活动---------------------------------
// 获取自定义活动信息返回值
export type CustomDetailModel = z.infer<typeof ActivityMap.Custom.showData>

// ---------------------------------助力领现活动---------------------------------
// 获取助力领现活动信息返回值
export type AssistanceCashDetailModel = z.infer<typeof ActivityMap.AssistanceCash.showData>

// ---------------------------------红包雨活动---------------------------------
// 获取红包雨活动信息返回值
export type RedPacketDetailModel = z.infer<typeof ActivityMap.RedPacket.showData>
// export type RedPacketTimeConfigItem = RedPacketDetailModel['']

// ---------------------------------充值优惠活动---------------------------------
export type RechargeRewardModel = z.infer<typeof ActivityMap.RechargeReward.showData>

// ---------------------------------推荐活动---------------------------------
export type SuggestionActivityListModel = RouterOutput['suggestionActivity']['list']


// ---------------------------------红点现实列表---------------------------------
export type RedPointParams = RouterInput['activity']['redPoint']
export type RedPointModel = RouterOutput['activity']['redPoint']

// ---------------------------------批量优惠---------------------------------
export type BatchDiscountModel = RouterOutput['reward']['list'][number]
export type BatchDiscountReceiveParams = RouterInput['reward']['receive']

// ---------------------------------签到---------------------------------
export type SignRewardModel = RouterOutput['activity']['activityDetail']


export type directRechargeParams = RouterInput['activity']['directRechargeList']

// ---------------------------------CPF---------------------------------
export type InviteCpfRecordParams = RouterInput['activity']['inviteRecords']
export type InviteCpfRecordModel = RouterOutput['activity']['inviteRecords']


// ---------------------------------CPF---------------------------------
export type UserReceivedListParams = RouterInput['activity']['userReceivedList']
export type UserReceivedListModel = RouterOutput['activity']['userReceivedList']

// ---------------------------------充值酬宾---------------------------------
export type rechargeBonusModel = RouterOutput['activity']['activityDetail']

export type bonusPoolContributionListParams = RouterOutput['activity']['bonusPoolContributionList']
