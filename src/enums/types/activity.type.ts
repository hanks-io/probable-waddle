import * as z from 'zod'
import {
	GameTypes,
	RedeemCodeAmountType,
	RedeemCodeAwardType,
	RedeemCodeTimeRangeType,
	TargetSelectSchema,
	TaskTypeEnumTypes,
	typeObjectKeys,
} from '../types'
import { v4 } from 'uuid'

export const ForeverYearTime = 2035
export const MinForeverTime = '2035-01-01 00:00:00'
export const ForeverTime = '2035-12-30 00:00:00'

const minMaxSchema = z.object({
	min: z.number().describe('最小值'),
	max: z.number().describe('最大值'),
})

/**
 * 充值条件类型
 */
export const RechargeConditions = [
	/** 首充 */
	'FIRST',
	/** 累积 */
	'SUM',
	/** 单笔 */
	'SINGLE',
] as const

export type RechargeConditionsType = (typeof RechargeConditions)[keyof typeof RechargeConditions]
export const ZRechargeConditionsType = z.enum(RechargeConditions)

/**
 * 充值参与条件
 */
export const JoinTypes = [
	/** 全部玩家 */
	'ALL',
	/** 活动期间注册玩家 */
	'NEW_REGISTER',
] as const
export type TJoinType = (typeof JoinTypes)[number]
export const ZJoinType = z.enum(JoinTypes)

/**
 * 金额类型
 */
export const AmountTypes = ['FIXED', 'RANDOM'] as const
export type TAmountType = (typeof AmountTypes)[number]
export const ZAmountType = z.enum(AmountTypes)

/**
 * 开关
 */
export const SwitchTypes = ['ON', 'OFF'] as const
export type TSwitchType = (typeof SwitchTypes)[number]
export const ZSwitchType = z.enum(SwitchTypes)

/**
 * 基础档位配置
 */
export const BaseConfig = z.object({
	/** 档位uuid */
	uuid: z.string(),
	/** 条件数量 */
	conditionAmount: z.number(),
	/** 奖励数量 */
	rewardAmount: z.number(),
})

/**
 * 基础档位配置 包含奖励上限
 */
export const BaseConfigPlus = z.object({
	/** 档位uuid */
	uuid: z.string(),
	/** 个数 */
	count: z.number(),
	/** 条件数量 */
	condition: z.string(),
	/** 奖励数量 */
	rewardAmount: z.number(),
	/** 奖励上限 */
	rewardLimit: z.number(),
})
export type TBaseConfigPlus = z.infer<typeof BaseConfigPlus>

/**
 * 充值活动配置 zod
 */
export const RechargeActivityConfigSchema = z.object({
	/** 参与条件 */
	joinType: z.enum(JoinTypes),
	/** 类型 */
	type: z.enum(RechargeConditions),
	/** 奖励档位 */
	rewardLevels: z.array(BaseConfig).default([]),
	// 充值活动稽核方式 1 表示赠送部分  2 表示赠送+本金
	rewardAuditType: z.enum(['Gift', 'GiftAndRecharge']).default('Gift').describe('充值活动稽核方式'),
  // 是否开启主媒体分享
  mainMediaShare: z.enum(SwitchTypes).default('OFF').describe('是否开启主媒体分享'),
})
export type TRechargeActivityConfig = z.infer<typeof RechargeActivityConfigSchema>
//===========================================================================================
// 实时反水活动配置

export const rebateConfigType = ['validBet', 'vipLevel'] as const

/**
 * 平台反水比例
 */
export const platformRebateSchema = z.object({
	/** 平台id */
	platformId: z.number().int().describe('平台id'),
	/** 平台名称 */
	platformName: z.string().optional().describe('平台名称'),
	/** 反水比例 */
	rebateRatio: z.number().gte(0).describe('反水比例'),
})

/**
 * 游戏类型分组
 */
export const platformByGameTypeGroupSchema = z.object({
	/** 游戏类型 */
	gameType: z.enum(GameTypes).describe('游戏类型'),
	/** 平台反水list */
	platformRebateList: z.array(platformRebateSchema).default([]),
})

/**
 * 有效投注
 */
export const validBetRebateSchema = z.object({
	/** 有效投注 */
	validBet: z.number().gte(0).describe('有效投注'),
	/** 游戏类型分组list */
	platformByGameTypeGroupList: z.array(platformByGameTypeGroupSchema).default([]),
})

/**
 * vipLevel
 */
export const vipLevelRebateSchema = z.object({
	/** vip等级 */
	vipLevel: z.number().int().describe('vip等级'),
	/** 游戏类型分组list */
	platformByGameTypeGroupList: z.array(platformByGameTypeGroupSchema).default([]),
})

/**
 * 排除的游戏信息
 */
export const excludeGameSchema = z.object({
	/** 游戏类型 */
	gameType: z.enum(GameTypes).describe('游戏类型'),
	/** 平台id */
	platformId: z.number().int().describe('平台id'),
	/** 平台名称 */
	platformName: z.string().describe('平台名称'),
	/** 游戏id */
	gameId: z.number().describe('游戏id'),
	/** 游戏名称 */
	gameName: z.string().describe('游戏名称'),
})

/**
 * 实时反水活动配置 zod
 */
export const RebateActivityConfigSchema = z.object({
	/** 游戏类型 */
	gameTypes: z.array(z.enum(GameTypes)).default([]),
	/** 充值要求 */
	rechargeLimit: z.number().gte(0).describe('充值要求'),
	/** 配置类型 */
	configType: z.enum(rebateConfigType).describe('配置类型'),
	/** 有效投注 */
	validBetRebate: z.array(validBetRebateSchema).default([]),
	/** vip等级 */
	vipLevelRebate: z.array(vipLevelRebateSchema).default([]),
	/** 排除游戏 */
	excludeGame: z.array(excludeGameSchema).default([]),
})

//===========================================================================================
// 救援金活动配置

/**
 * 亏损类型
 */
export const LossTypes = [
	/** 正常亏损 */
	'NORMAL',
	/** 不计入优惠金额的亏损 */
	'EXCLUDE_GIFT',
	/** 累计亏损(扣除优惠) */
	'CUMULATIVE_LOSS',
] as const

export type TLossType = (typeof LossTypes)[keyof typeof LossTypes]
export const ZTLossType = z.enum(LossTypes)

/**
 * 救援金活动配置 zod
 */
export const AssistanceActivityConfigSchema = z.object({
	/** 类型 */
	type: z.enum(LossTypes),
	/** 奖励类型 */
	rewardType: z.enum(['FIXED', 'RANGE']),
	/** 奖励档位 */
	rewardLevels: z.array(BaseConfig).default([]),
	/** 奖励档位按照百分比 */
	rewardLevelsPercent: z.array(BaseConfig).default([]),
})

export const ZAssistancerewardType = z.enum(['FIXED', 'RANGE'])

//===========================================================================================
// 幸运转盘活动配置

// 奖项类型 Award
export const LuckyWheelAwardType = ['prop_H', 'prop_A', 'prop_P', 'prop_Y', 'goldCoins', 'nothing'] as const
export type TLuckyWheelAwardType = (typeof LuckyWheelAwardType)[number]
export const ZTLuckyWheelAwardType = z.enum([...LuckyWheelAwardType])

// 转盘奖项
export const LuckyWheelAwardSchema = z.object({
	/** 档位uuid */
	uuid: z.string(),
	/** 奖项类型 */
	type: z.enum(LuckyWheelAwardType).describe('奖项类型'),
	/** 奖项数量 */
	amount: z.number().int().gte(0).describe('奖项数量'),
	/** 出现权重 */
	weight: z.number().int().gte(0).describe('出现权重'),
	/** 奖项概率 */
	probability: z.number().int().gte(0).describe('奖项概率'),
	/** 是否大奖 */
	isBigAward: z.boolean().describe('是否大奖'),
})

// 奖券获取方式
export const LuckyWheelLotteryTicketGetType = [
	/** 首次登录 */
	'firstLogin',
	/** 账号首次充值  */
	'firstRecharge',
	/** 每日首次充值 */
	'everyDayFirstRecharge',
	/** 每笔充值 */
	'recharge',
	/** 累计充值 */
	'cumulativeRecharge',
	/** 每次下注 */
	'validBet',
	/** 累计下注 */
	'cumulativeValidBet',
] as const
export const ZLuckyWheelLotteryTicketGetType = z.enum(LuckyWheelLotteryTicketGetType)

// 奖券获取
export const LuckyWheelLotteryTicketGetSchema = z.object({
	/** 档位uuid */
	uuid: z.string(),
	/** 奖券获取方式 */
	type: z.enum(LuckyWheelLotteryTicketGetType).describe('奖券获取方式'),
	/** 条件数量 */
	conditionAmount: z.number().int().describe('条件数量'),
	/** 奖券数量 */
	amount: z.number().int().gte(0).describe('奖券数量'),
	/** 可触发次数 */
	triggerCount: z.number().int().gte(0).describe('可触发次数'),
	/** 是否开放 */
	isOpen: z.boolean().describe('是否开放'),
})

/**
 * 幸运转盘活动配置 zod
 */
export const LuckyWheelActivityConfigSchema = z.object({
	/** 转盘奖项list */
	awardList: z.array(LuckyWheelAwardSchema).default([]),
	/** 兑换奖励 */
	exchangeReward: z.number().int().gte(0).describe('兑换奖励'),
	/** 奖券获取 */
	lotteryTicketGet: z.array(LuckyWheelLotteryTicketGetSchema).default([]),
})

//===========================================================================================
// 充值活动

/**
 * 充值活动比例
 */
export const RechargeRewardRateSchema = z.object({
	// 充值金额
	amount: z.number().int().describe('充值金额'),
	// 赠送比例
	rate: z.number().int().describe('赠送比例'),
	// 打码倍数
	betMultiple: z.number().int().describe('打码倍数'),
})

/**
 * 充值活动配置 zod
 */
export const RechargeRewardActivityConfigSchema = z.object({
	rewardRate: z.array(RechargeRewardRateSchema).default([]).describe('充值活动比例'),
	// 充值活动稽核方式 1 表示赠送部分  2 表示赠送+本金
	rewardAuditType: z.enum(['Gift', 'GiftAndRecharge']).default('Gift').describe('充值活动稽核方式'),
	// 图片类型
	imageType: z.enum(['DEFAULT', 'CUSTOM']).default('DEFAULT').describe('图片类型'),
	// 广告图地址
	bannerUrl: z.string().default('').describe('广告图地址'),
	// 是否跳转详情
	isJumpDetail: z.boolean().default(false).describe('是否跳转详情'),
	// 公告内容
	notice: z.string().default('').describe('公告内容'),
})

//===========================================================================================

/**
 * 签到等级配置 zod
 */
export const SignInRewardConfigSchema = z.object({
	/**签到天 */
	day: z.number().int().default(1),
	/**金额类型 */
	amountType: z.enum(AmountTypes),
	/**金额最大值 */
	amountMax: z.number().int().default(0),
	/**金额最小值 */
	amountMin: z.number().int().default(0),
	/**充值金额 */
	rechargeAmount: z.number().int().default(0),
	/**有效投注 */
	validBet: z.number().int().default(0),
	/**额外奖励 */
	extraReward: z.number().int().default(0),
	/**签到图标类型 */
	iconType: z.enum(['DEFAULT', 'CUSTOM']).default('DEFAULT'),
	/**签到图标 */
	icon: z.string().default(''),
})
export type TSignInRewardConfigSchema = z.infer<typeof SignInRewardConfigSchema>
export const SignInActivityConfigSchema = z.object({
	/** 参与条件 */
	joinType: z.enum(JoinTypes),
	/**签到方式：连续签到 ，累计签到 */
	signInType: z.enum(['CONTINUOUS', 'CUMULATIVE']),
	/**循环类型：一次性，周期性循环 */
	cycleType: z.enum(['ONCE', 'CYCLE']).default('ONCE'),
	/**签到周期 */
	signInCycleDay: z.number().int().min(1).default(1),
	/**充值成功后直接弹窗 */
	rechargeSuccessPopup: z.enum(SwitchTypes),
	/**额外奖励是否需要稽核 */
	rewardAudit: z.enum(SwitchTypes).default('OFF'),
	/**额外奖励稽核倍数 */
	rewardAuditMultiple: z.number().int().default(0),
	/**APP端是否显示奖励金额 */
	appShowRewardAmount: z.enum(['ON', 'OFF']).default('OFF'),
	/**
	 * app是否显示额外奖励金额
	 */
	appShowExtraRewardAmount: z.enum(['ON', 'OFF']).default('OFF'),
	/**同注册IP参与人数 */
	ipLimit: z.number().int().default(0),
	/**奖励方式 */
	rewardConfig: z.discriminatedUnion('rewardType', [
		z.object({
			rewardType: z.literal('TIERED_REWARDS'),
			configList: z.object({
				config: z.array(SignInRewardConfigSchema),
			}),
		}),
		z.object({
			rewardType: z.literal('VIP_LEVEL_REWARDS'),
			configList: z.array(
				z.object({
					vipLevel: z.array(z.number().int()),
					config: z.array(SignInRewardConfigSchema),
				}),
			),
		}),
	]),
} as const)

export type TSignInActivityConfigSchema = z.infer<typeof SignInActivityConfigSchema>

/**
 * 有效条件类型 zod
 */
export const ValidCondition = ['ALL', 'ONE', 'NONE', 'RECHARGE'] as const
export type TValidCondition = (typeof ValidCondition)[number]
export const ZValidCondition = z.enum(ValidCondition)

/**
 * 代理活动配置 zod
 */
export const AgencyActivityConfigSchema = z.object({
	uuid: z.string(),
	validUsers: z.object({
		/**首充金额 */
		firstRechargeAmount: z.object({ amount: z.number(), status: z.enum(SwitchTypes) }),
		/**累计充值金额 */
		recharge: z.object({ amount: z.number(), status: z.enum(SwitchTypes) }),
		/**累计投注金额 */
		bet: z.object({ amount: z.number(), status: z.enum(SwitchTypes) }),
		/**充值天数 */
		rechargeDays: z.object({ days: z.number(), status: z.enum(SwitchTypes) }),
		/**充值次数 */
		rechargeCount: z.object({ count: z.number(), status: z.enum(SwitchTypes) }),
		/**满足有效条件 */
		type: z.enum(ValidCondition),
		/**下级限制 */
		userLimit: z.enum(JoinTypes),
	}),
	/** 统计限制 */
	limitStats: z.object({
		/** ip限制 */
		limitIP: z.number(),
		/**设备限制 */
		limitDevice: z.number(),
	}),
	/** 奖励类型 */
	rewardType: z.enum(AmountTypes),
	/** 显示方式 */
	displayMode: z.enum(['RED_PACKET', 'BOX', 'RECEIVE']),
	/** 是否显示 */
	isShow: z.boolean(),
	/** 奖励数量 */
	rewardConfig: z.array(
		z.object({
			uuid: z.string(),
			userCount: z.number(),
			...minMaxSchema.shape,
		}),
	),

	/**游戏限制类型 */
	gameLimitType: z.enum(['ALL', 'SELECT']).default('ALL'),

	/**游戏限制 */
	gameLimit: z
		.array(
			z.object({
				/** 游戏类型 */
				gameType: z.enum(GameTypes).default(GameTypes[0]),
				/**平台数据 */
				platformData: z
					.array(
						z.object({
							platformId: z.number().int().default(0),
							gameData: z.array(z.object({ gameId: z.number().int() })).default([]),
						}),
					)
					.default([]),
			}),
		)
		.default([]),
})

export type TAgencyActivityConfig = z.infer<typeof AgencyActivityConfigSchema>
export type DisplayMode = TAgencyActivityConfig['displayMode']
export type RewardType = TAgencyActivityConfig['rewardType']
export const ZDisplayMode = z.enum(['RED_PACKET', 'BOX', 'RECEIVE'])
export const ZRewardType = z.enum(AmountTypes)

export const RedPacketRewardTypeSchema = z.discriminatedUnion('amountType', [
	z.object({
		amountType: z.literal('RECHARGE').describe('类型'),
		amount: z.number().int().nonnegative().default(0).describe('奖励金额'),
		...minMaxSchema.shape,
	}),
	z.object({
		amountType: z.literal('PROFIT').describe('类型'),
		amount: z.number().default(0).describe('奖励金额'),
		...minMaxSchema.shape,
	}),
	z.object({
		amountType: z.literal('UNLIMITED').describe('类型'),
		amount: z.number().default(0).describe('奖励金额'),
		...minMaxSchema.shape,
	}),
	z.object({
		amountType: z.literal('BET').describe('类型'),
		amount: z.number().int().nonnegative().default(0).describe('奖励金额'),
		...minMaxSchema.shape,
	}),
])
export type TRedPacketRewardTypeSchema = z.infer<typeof RedPacketRewardTypeSchema>

export const RedPacketTimeConfigSchema = z.object({
	uuid: z.string(),
	hour: z.number().int().lte(24),
	durationIn: z.number().int().lte(60),
})

export type TRedPacketTimeConfigSchema = z.infer<typeof RedPacketTimeConfigSchema>

export const RedPacketRewardConfigSchema = z.object({
	type: z.enum([
		/**充值 */
		'RECHARGE',
		/**输赢 */
		'PROFIT',
		/**不限制 */
		'UNLIMITED',
		/** 下注*/
		'BET',
	]),
	rewardRange: z.array(RedPacketRewardTypeSchema),
	//status: z.enum(['ON', 'OFF']),
})

export type TRedPacketRewardConfigSchema = z.infer<typeof RedPacketRewardConfigSchema>

/**
 * 红包雨活动配置 zod
 */
export const RedPacketActivityConfigSchema = z.object({
	uuid: z.string(),
	timeConfig: z.array(RedPacketTimeConfigSchema),
	setting: z.object({
		/** 每波派奖上限(实际生效) */
		roundMaxAmount: z.number().gte(0),
		roundMaxAmountShow: z.number().gte(0),
		/** 单笔最大金额 */
		maxAmount: z.number().gte(0),
		maxAmountShow: z.number().gte(0),
		/** 参与条件 所有都满足或者满足其中一个条件 */
		type: z.enum(ValidCondition),
		rechargeAmount: z.number().gte(0),
		betAmount: z.number().gte(0),
		awardType: z.enum(RedeemCodeAwardType),
		amountType: z.enum(RedeemCodeAmountType),
		timeRangeType: z.enum(RedeemCodeTimeRangeType),
		rewardConfig: z.array(RedPacketRewardTypeSchema),
		/**每日最多参与次数 */
		dailyMaxCount: z.number().gte(0).default(0),
	}),
	appIconUrl: z.string().optional(),
})

export type TRedPacketActivityConfigSchema = z.infer<typeof RedPacketActivityConfigSchema>

// 奖项类型 Award
export const AssistanceCashAwardType = ['rangeAmount', 'fixedAmount', 'bonus'] as const
export type TAssistanceCashAwardType = (typeof AssistanceCashAwardType)[number]
export const ZTAssistanceCashAwardType = z.enum([...AssistanceCashAwardType])
/**
 * 助力领现金
 */
export const AssistanceCashConfigSchema = z.object({
	/** 活动周期 */
	cycle: z.number().int().gt(0).describe('活动周期'),
	/** 转盘奖项设置 */
	awardList: z.array(
		z.object({
			/** 档位uuid */
			uuid: z.string(),
			/** 奖项类型 */
			type: z.enum(AssistanceCashAwardType).describe('奖项类型'),
			/** 奖励上限 */
			amount: z.number().int().gte(0).describe('奖励上限'),
			/** 出现权重 */
			weight: z.number().int().gte(0).describe('出现权重'),
		}),
	),
	/** 每日免费抽奖次数 */
	freeDrawCount: z.number().int().gt(0).describe('每日免费抽奖次数'),
	/** 同ip注册最大限制人数 */
	ipLimit: z.number().int().gt(0).describe('同ip注册最大限制人数'),
	/** 获取条件 */
	condition: z.array(
		z.object({
			/** 档位uuid */
			uuid: z.string(),
			/** 轮数 */
			round: z.number().int().gt(0).describe('轮数'),
			/** 奖励金额 */
			amount: z.number().int().gte(0).describe('奖励金额'),
			/** 直属人数 */
			directCount: z.number().int().gte(0).describe('直属人数'),
			/** 直属累计投注 */
			directBet: z.number().int().gte(0).describe('直属累计投注'),
			/** 直属累计投注 */
			directRecharge: z.number().int().gte(0).describe('直属累计充值'),
			/** 首次抽奖最小金额 */
			firstDrawMinAmount: z.number().int().gte(0).describe('首次抽奖最小金额'),
			/** 首次抽奖最大金额 */
			firstDrawMaxAmount: z.number().int().gte(0).describe('首次抽奖最大金额'),
		}),
	),
	/** 分享域名 */
	shareDomain: z.string().describe('分享域名'),
	/** 域名图片 */
	domainImg: z.string().describe('域名图片'),
	/** 邀请手机号 */
	invitePhone: z.string().describe('邀请手机号'),
})
export type TAssistanceCashConfigSchema = z.infer<typeof AssistanceCashConfigSchema>

/**
 * 会员答谢活动配置
 */
export const MemberRewardConfigSchema = z.object({
	/**参与条件 */
	joinType: z.enum(JoinTypes).default('ALL'),
	/**前端显示最大可领取值 */
	displayMaxAmount: z.number().int().optional().default(0),
	/**奖励唯一值 */
	uuid: z.string().default(v4()),
	/**奖励配置 */
	setting: z.object({
		/**奖励类型
		 * 1. 固定金额，2. 随机金额，3固定比例，4. 随机比例
		 */
		awardType: z.enum(RedeemCodeAwardType).default('FIXED_AMOUNT'),
		amountType: z.enum(RedeemCodeAmountType),
		timeRangeType: z.enum([...RedeemCodeTimeRangeType, 'HISTORY_MEMBER_DAY', 'MEMBER_DAY']),
		rewardConfig: z.array(RedPacketRewardTypeSchema),
	}),
})
export type TMemberRewardConfigSchema = z.infer<typeof MemberRewardConfigSchema>

/**神秘彩金 */

export const MysteryReward_RewardConfigSchema = z.object({
	uuid: z.string(),
	/**充值金额 */
	rechargeAmount: z.number().int().min(0),
	/**显示奖励最小值 */
	minDisplayReward: z.number().int().min(0),
	/**显示奖励最大值 */
	maxDisplayReward: z.number().int().min(0),
	/**领取配置 */
	receiveConfig: z.array(
		z.object({
			/**流水倍数 */
			betMultiple: z.number().int().min(0),
			/**金额最小值 */
			minAmount: z.number().int().min(0),
			/**金额最大值 */
			maxAmount: z.number().int().min(0),
		}),
	),
})

export type TMysteryReward_RewardConfigSchema = z.infer<typeof MysteryReward_RewardConfigSchema>

export const MysteryReward_SettingSchema = z.object({
	/**能领取奖励的天数 */
	day: z.number().int().min(1).max(30),
	/**奖励配置 */
	rewardConfig: z.array(MysteryReward_RewardConfigSchema),
})

export type TMysteryReward_SettingSchema = z.infer<typeof MysteryReward_SettingSchema>

export const MysteryRewardConfigSchema = z.object({
	/**参与条件 */
	joinType: z.enum(JoinTypes).default('ALL'),
	/**领取奖励时间 */
	receiveTime: z.number().int().min(0).max(23).default(0),
	/**奖励保留天数 */
	awardKeepDays: z.number().int().min(1).default(1),

	/**奖励配置 */
	setting: z.array(MysteryReward_SettingSchema),
})
export type TMysteryRewardConfigSchema = z.infer<typeof MysteryRewardConfigSchema>

/**
 * 返奖类型
 * 领取佣金，结算佣金，直属会员累计充值
 */
export const CommissionRewardType = ['RECEIVE', 'SETTLE', 'RECHARGE'] as const
export type TCommissionRewardType = (typeof CommissionRewardType)[number]
export const ZCommissionRewardType = z.enum(CommissionRewardType)

/**
 * 奖励类型
 * 固定金额，比例
 */
export const CommissionRewardAwardType = ['BALANCE', 'RATE'] as const
export type TCommissionRewardAwardType = (typeof CommissionRewardAwardType)[number]
export const ZCommissionRewardAwardType = z.enum(CommissionRewardAwardType)

export const CommissionRewardConfigSchema = z.object({
	/** 返奖类型 */
	rewardType: z.enum(CommissionRewardType),
	/** 奖励配置 */
	rewardConfig: z.array(BaseConfig),
	/** 奖励类型 */
	awardType: z.enum(CommissionRewardAwardType),
})

/**
 * 奖励类型
 */
export const rewardType = ['DIRECT_RECHARGE_TOTAL', 'DIRECT_BET_TOTAL', 'EACH_RECHARGE', 'REGISTRATION_BONUS'] as const
export type TrewardType = (typeof rewardType)[number]
export const ZrewardType = z.enum(rewardType)

export const CPFActivityAmountTypes = [...AmountTypes, 'FIXED_RATIO'] as const
export type TCPFActivityAmountTypes = (typeof CPFActivityAmountTypes)[number]
export const ZCPFActivityAmountTypes = z.enum(CPFActivityAmountTypes)

export const CPFActivityConfigSchema = z.object({
	/**
	 * 同IP统计上限
	 */
	ipLimit: z.number().int().default(0),
	/**
	 * 同设备统计上限
	 */
	deviceLimit: z.number().int().default(0),
	/**
	 * 奖励配置
	 */
	tenantRewardConfig: z.array(
		z.object({
			uuid: z.string(),
			/**
			 * 奖励方式
			 */
			rewardType: z.enum(rewardType),
			/**
			 * 需要达成的目标
			 */
			target: z.number(),
			/**
			 * 金额类型
			 */
			amountType: z.enum(CPFActivityAmountTypes),
			/**
			 * 最小金额
			 */
			minAmount: z.number(),
			/**
			 * 最大金额
			 */
			maxAmount: z.number(),
			/**
			 * 状态
			 */
			status: z.enum(SwitchTypes),
		}),
	),
})

export type TCPFActivityConfigSchema = z.infer<typeof CPFActivityConfigSchema>

/**
 * 活动游戏限制结构配置
 */
export const ActivityGameLimitSchema = z.object({
	status: z.enum(SwitchTypes).describe('状态:关闭的时候不限制，ON开启的时候限制游戏').default('OFF'),
	limitData: z
		.preprocess(
			(input) => {
				// If the input is an empty object, convert it to an empty array
				if (typeof input === 'object' && Object.keys(input as {}).length === 0) {
					return []
				}
				// Otherwise, return the original input
				return input
			},
			z.array(
				z.object({
					/** 游戏类型 */
					gameType: z.enum(GameTypes).default(GameTypes[0]),
					/**平台数据 */
					platformData: z
						.array(
							z.object({
								platformId: z.number().int().default(0),
								gameData: z.array(z.object({ gameId: z.number().int() })).default([]),
							}),
						)
						.default([]),
				}),
			),
		)
		.default([]), // 默认为空数组
})

export type TActivityGameLimitSchema = z.infer<typeof ActivityGameLimitSchema>

//==================================================================================================================================================================================
// 自定义活动

export const CustomActivityConfigSchema = z
	.object({
		uuid: z.string(),
		content: z.string(),
		isShowApply: z.boolean().default(true),
		// 宣传图跳转类型 详情 链接
		jumpType: z.enum(['DETAIL', 'LINK']).default('DETAIL'),
		target: TargetSelectSchema.optional(),
	})

//==================================================================================================================================================================================
// 幸运注单

export const LuckyBetGameLimitSchema = z
	.array(
		z.object({
			/** 游戏类型 */
			gameType: z.enum(GameTypes).default(GameTypes[0]),
			/**平台数据 */
			platformData: z
				.array(
					z.object({
						platformId: z.number().int().default(0),
						gameData: z.array(z.object({ gameId: z.number().int() })).default([]),
					}),
				)
				.default([]),
		}),
	)
	.default([])

export type TLuckyBetGameLimitSchema = z.infer<typeof LuckyBetGameLimitSchema>
/**
 * 领取次的限制类型 固定次数，当日充值，当日打码
 */
export const ReceiveCountLimitMap = z.object({
	FIXED_COUNT: z.object({
		/** 每天领取上限 */
		dayLimit: z.number().int().default(0),
	}),
	RECHARGE: z.object({
		/** 限制档位 */
		limitLevel: z.array(BaseConfig).default([]),
	}),
	BET: z.object({
		/** 限制档位 */
		limitLevel: z.array(BaseConfig).default([]),
	}),
})

export type TReceiveCountLimitMap = z.infer<typeof ReceiveCountLimitMap>
export const ReceiveCountLimitTypes = typeObjectKeys(ReceiveCountLimitMap.shape)
export type TReceiveCountLimitType = (typeof ReceiveCountLimitTypes)[number]
export const ZReceiveCountLimitType = z.enum(ReceiveCountLimitTypes)

/**
 * 幸运注单活动配置 zod
 */
export const LuckyBetConfigSchema = z.object({
	/**游戏限制类型 */
	gameLimitType: z.enum(['ALL', 'SELECT']).default('ALL'),
	/**游戏限制 */
	gameLimit: LuckyBetGameLimitSchema,
	/** 有效投注的金额限制 */
	validBetAmount: z.number().int().default(0),
	/** 领取次数类型 */
	receiveCountType: ZReceiveCountLimitType,
	/** 领取次数限制 */
	receiveCountLimit: ReceiveCountLimitMap,
	/** 活动领取上限 */
	receiveLimit: z.number().int().default(0),
	/** 奖励方式 固定金额，有效投注的倍数 */
	rewardType: z.enum(['FIXED', 'BET_MULTIPLE']),
	/** 是否显示奖励上限 */
	showRewardLimit: z.boolean().default(false),
	/** 中奖方式  尾号 连号(任意位置) 包含(任意位置)*/
	winType: z.enum(['TAIL_NUMBER', 'CONSECUTIVE_NUMBER', 'CONTAINS_ANY_POSITION']),
	/** 奖励配置 */
	rewardConfigs: z.array(BaseConfigPlus).default([]),
})

export type TLuckyBetConfigSchema = z.infer<typeof LuckyBetConfigSchema>

//==================================================================================================================================================================================
// 充值大酬宾

/**
 * 奖励配置
 */
export const RechargePromotionRewardSchema = z.object({
	/** 档位uuid */
	uuid: z.string(),
	/** 充值金额 */
	rechargeAmount: z.number(),
	/** 奖励金额 */
	rewardAmount: z.number(),
	/** 稽核倍数 */
	auditMultiple: z.number(),
	/** 虚拟彩金比例 */
	virtualRewardRatio: z.number(),
})

/**
 * 幸运注单活动配置 zod
 */
export const RechargePromotionActivityConfigSchema = z.object({
	/** 活动日 */
	activityDay: z.number().int().min(1).max(7),
	// 充值活动稽核方式 1 表示赠送部分  2 表示赠送+本金
	rewardAuditType: z.enum(['Gift', 'GiftAndRecharge']).default('Gift').describe('充值活动稽核方式'),
	/** 首页入口 */
	homeEntry: z.boolean().default(false),
	/** 活动配置 */
	activityConfig: z.array(RechargePromotionRewardSchema).default([]),
	/** 首页图标地址 */
	appIconUrl: z.string().optional(),
})

export type TRechargePromotionActivityConfigSchema = z.infer<typeof RechargePromotionActivityConfigSchema>

//==================================================================================================================================================================================




//=======================/** 会员答谢_多日版 */====================================================================
export const MemberRewardMultiDaySettingSchema = z.object({
	/**
		 * 会员日
		 */
	memberDay: z.number().int().min(1).max(31),
	/**
	 * 奖励配置 ["RECHARGE", "PROFIT", "UNLIMITED", "BET"]
	 */
	sumAmountType: z.enum(RedeemCodeAmountType),
	/**
	 * 奖励类型
	 * 1. 固定金额，2. 随机金额，3固定比例，4. 随机比例
	 */
	awardType: z.enum(RedeemCodeAwardType).default('FIXED_AMOUNT'),
	/**
	 * 时间范围类型
	 */
	timeRangeType: z.enum([...RedeemCodeTimeRangeType, 'HISTORY_MEMBER_DAY', 'MEMBER_DAY', 'CUSTOMIZE']),
	/**
	 * 自定义天数
	 */
	customizeDay: z.number().int().min(0).optional(),

	rewardConfig: z.array(RedPacketRewardTypeSchema),
})
export type TMemberRewardMultiDaySettingSchema = z.infer<typeof MemberRewardMultiDaySettingSchema>

/**
 * 会员答谢_多日版
 */
export const MemberRewardMultiDayConfigSchema = z.object({
	/**参与条件 */
	joinType: z.enum(JoinTypes).default('ALL'),
	/**前端显示最大可领取值 */
	displayMaxAmount: z.number().int().optional().default(0),
	/**奖励唯一值 */
	uuid: z.string().default(v4()),
	/**
	 * 添加会员日-数组，可以添加多个会员日
	 */
	memberDayArray: z.array(z.number().int().min(1).max(31)),
	/**奖励配置 */
	setting: z.array(MemberRewardMultiDaySettingSchema),
})
export type TMemberRewardMultiDayConfigSchema = z.infer<typeof MemberRewardMultiDayConfigSchema>



//========================邀请好友2活动过==================================================================================================================================================
/**
 * 代理活动配置 zod
 */
export const ReferralRewardsNewActivityConfigSchema = z.object({
	
	/** 统计限制 */
	limitStats: z.object({
		/** ip限制 */
		limitIP: z.number().default(0),
		/**设备限制 */
		limitDevice: z.number().default(0),
	}),
	/**
	 * 奖池配置
	 */
	poolConfig: z.object({
		/**
		 * 注册邀请获取金额
		 */
		inviteRegisterAmount: z.number().default(0),
		/**
		 * 直属充值返点
		 */
		directRechargeRate: z.number().default(0),
	}),
	/**
	 * 奖励配置
	 */
	rewardConfig: z.array(
		z.object({
			/** 档位uuid */
			uuid: z.string(),
			/**亏损金额 */
			lossAmount: z.number().default(0),
			/** 返点比例 */
			rate: z.number().default(0),
		})
	)
})


/**
 * 活动名称类型
 * 系统默认 自定义
 */
export const NameTypes = ['DEFAULT', 'CUSTOM'] as const
export type TNameType = (typeof NameTypes)[number]
export const ZNameType = z.enum(NameTypes)

/**
 * 派发方式
 * 自动派发，玩家申请
 */
export const DistributeTypes = ['AUTO', 'MANUAL'] as const
export type TDistributeType = (typeof DistributeTypes)[number]
export const ZDistributeType = z.enum(DistributeTypes)
/**
 * 审核方式
 * 系统（周期内）审核，人工审核，系统（过期时）审核
 */
export const AuditTypes = ['AUTO', 'MANUAL', 'PERIODIC'] as const
export type TAuditTypes = (typeof AuditTypes)[number]
/**
 * 派奖时间
 * 立即到账，延迟到账
 */
export const DistributeTimeTypes = ['IMMEDIATELY', 'DELAY'] as const
export type TDistributeTimeTypes = (typeof DistributeTimeTypes)[number]
/**
 * 奖励作废类型
 * 过期自动派发，过期作废, 奖励保留天数自动派发，奖励保留天数作废
 */
export const ExpiredAwardTypes = ['AUTO', 'ABANDONED', 'RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'] as const
export type TExpiredAwardTypes = (typeof ExpiredAwardTypes)[number]
/**
 * 活动时间类型
 * 周期,永久
 */
export const ActivityTimeTypes = ['PERIOD', 'PERMANENT'] as const
export type TActivityTimeType = (typeof ActivityTimeTypes)[number]
export const ZActivityTimeType = z.enum(ActivityTimeTypes)
/**
 * 活动重置方式
 * 不重置,每日,每周,每周活动开始的那一天,每月活动开始的那一天,定期(自定义)
 */
export const ActivityResetTypes = ['NONE', 'DAILY', 'WEEKLY', 'WEEKLY_DAY', 'MONTHLY_DAY', 'PERIODIC'] as const
export type TActivityResetType = (typeof ActivityResetTypes)[number]
export const ZActivityResetType = z.enum(ActivityResetTypes)
/**
 * 宣传图样式类型
 */
export const ActivityBannerStyles = ['DEFAULT', 'CUSTOM'] as const
export type TActivityBannerStyle = (typeof ActivityBannerStyles)[number]
/**
 * 规则说明类型
 */
export const ActivityRuleTypes = ['DEFAULT', 'CUSTOM'] as const
export type TActivityRuleType = (typeof ActivityRuleTypes)[number]
export const ZActivityRuleType = z.enum(ActivityRuleTypes)
/**
 * 活动状态
 * 草稿，待生效，进行中，已结束，关闭
 */
export const ActivityStatus = ['DRAFT', 'PENDING', 'PROCESSING', 'FINISHED', 'CLOSED'] as const
export type TActivityStatus = (typeof ActivityStatus)[number]
export const ZActivityStatus = z.enum(ActivityStatus)
/**
 * 到账方式
 * 玩家余额，活动账户
 */
export const AwardTypes = ['BALANCE', 'ACTIVITY'] as const
export type TAwardType = (typeof AwardTypes)[number]
export const ZAwardType = z.enum(AwardTypes)
/**
 * 活动奖励类型
 * 余额，抽奖券，道具
 */
export const ActivityAwardTypes = [
	'BALANCE',
	'LOTTERY_TICKET',
	'ITEM',
	'LOTTERY_TICKET_H',
	'LOTTERY_TICKET_A',
	'LOTTERY_TICKET_P',
	'LOTTERY_TICKET_Y',
] as const
export type TActivityAwardType = (typeof ActivityAwardTypes)[number]
export const ZActivityAwardType = z.enum(ActivityAwardTypes)
/**
 * 活动奖励状态
 * 待审核，待派发，已派发，已领取，已过期，拒绝
 */
export const ActivityAwardStatus = ['REVIEWING', 'PENDING', 'DISTRIBUTED', 'RECEIVED', 'EXPIRED', 'REJECTED'] as const
export type TActivityAwardStatus = (typeof ActivityAwardStatus)[number]
export const ZActivityAwardStatus = z.enum(ActivityAwardStatus)
/**
 * 活动累计类型
 * 充值，流水，登录，优惠金额
 */
export const ActivitySumTypes = ['RECHARGE', 'BET', 'LOGIN', 'GIFT'] as const
export type TActivitySumType = (typeof ActivitySumTypes)[number]

/**
 * 申领限制
 */
export const ApplyLimits = [
	//绑定三方钱包
	'BIND_THIRD_WALLET',
	//绑定收款方式
	'BIND_WITHDRAW_METHOD',
	//完成首充可申领
	'FIRST_RECHARGE',
	//同姓名只能申领1次
	'SAME_NAME_ONLY_ONCE',
	//同类型活动只能申领1次
	'SAME_TYPE_ONLY_ONCE',
	//同登录IP只能申领1次
	'SAME_LOGIN_IP_ONLY_ONCE',
	//同注册IP只能申领1次
	'SAME_REGISTER_IP_ONLY_ONCE',
	/**仅注册设备号能领取 */
	'ONLY_REGISTER_DEVICE'
] as const
export type TApplyLimit = (typeof ApplyLimits)[number]
export const ZApplyLimit = z.enum(ApplyLimits)

/**
 * 活动前端显示类型
 * 无，首页弹窗
 */
export const ActivityFrontendTypes = ['NONE', 'HOME_POPUP'] as const
export type TActivityFrontendType = (typeof ActivityFrontendTypes)[number]
export const ZActivityFrontendType = z.enum(ActivityFrontendTypes)

//===========================================================================================
// 活动申请

export const AssistanceApplySchema = z.object({
	userId: z.number().int().describe('用户ID'),
	userActivityAwardId: z.number().int().describe('奖励id'),
})

export const RechargeApplySchema = z.object({
	userId: z.number().int().optional().describe('用户ID'),
})

export const CommonApplySchema = z.object({
	userId: z.number().int().optional().describe('用户ID'),
})

export const AgencyApplySchema = z.object({
	userId: z.number().int().describe('用户ID'),
	rewardId: z.string().optional().describe('奖励id'),
})

export const CustomApplySchema = z
	.object({ amount: z.number().positive().optional().describe('申请金额') })
	.merge(CommonApplySchema)

export const LuckyWheelApplySchema = z.object({
	/** 兑换次数 */
	exchangeCount: z.number().int().describe('兑换次数'),
	userId: z.number().int().describe('用户ID'),
})

export const AssistanceCashApplySchema = z.object({
	isRound: z.boolean().describe('是否为转盘'),
})

export const MemberRewardApplySchema = z.object({})

export const MysteryRewardApplySchema = z.object({
	/**申请天 */
	applyDay: z.number().int().min(1).max(30),
})

export const CommissionRewardApplySchema = z.object({})

export const SignInApplySchema = z.object({
	/**签到天 */
	signInDay: z.number().int().min(1).max(30),
})

export const CPFActivityApplySchema = z.object({})

export const LuckyBetApplySchema = z.object({
	userId: z.number().int().describe('用户ID'),
})
export const SignInVolumeApplySchema = z.object({
	/**签到天 */
	applySignInDay: z.number().int().min(1).max(7),
})


//===========================================================================================
// 活动展示

/**
 * 平台反水比例
 */
export const platformRebateToShowSchema = z.object({
	/** 游戏类型 */
	gameType: z.enum(GameTypes).optional().describe('游戏类型'),
	/** 平台id */
	platformId: z.number().int().describe('平台id'),
	/** 平台名称 */
	platformName: z.string().optional().describe('平台名称'),
	/** 平台logo */
	logo: z.string().optional().describe('平台logo'),
	/** 反水比例list */
	rebateRatioList: z.array(BaseConfig).describe('反水比例list'),
	/** 平台有效投注 */
	validBet: z.number().int().optional().describe('有效投注'),
})

export const platformByGameTypeGroupToShowSchema = z.object({
	/** 游戏类型 */
	gameType: z.enum(GameTypes).describe('游戏类型'),
	/** 平台反水list */
	platformRebateList: z.array(platformRebateToShowSchema).default([]),
})

export const RebateShowSchema = z.object({
	rebateList: z.array(platformByGameTypeGroupToShowSchema).default([]),
	validBetList: z.any(),
	/** 游戏类型 */
	gameTypes: z.array(z.enum(GameTypes)).default([]),
	startTime: z.date(),
	endTime: z.date(),
	rule: z.string(),
	ruleType: z.enum(ActivityRuleTypes),
	resetType: z.enum(ActivityResetTypes),
	// 可领取金额
	receiveAmount: z.number().optional().describe('可领取金额'),
})

/**
 * 救援金活动展示 zod
 */
export const AssistanceShowSchema = z.object({
	rule: z.string(),
	ruleType: z.enum(ActivityRuleTypes),
	resetType: z.enum(ActivityResetTypes),
	awardType: z.enum(AwardTypes),
	startTime: z.date(),
	endTime: z.date(),
	issueEndTime: z.date(),
	/** 生成的救援金金额 */
	rewardAmount: z.number().int(),
	/** 领取活动ID */
	receiveActivityId: z.number().int(),
	/** 类型 */
	type: z.enum(LossTypes),
	/** 奖励类型 */
	rewardType: z.enum(['FIXED', 'RANGE']),
	/** 奖励档位 */
	rewardLevels: z.array(BaseConfig).default([]),
	/** 优惠金额 */
	reward: z.number().int().default(0),
	/** 输赢金额 */
	profit: z.number().int().default(0),
})

export const LuckyWheelLottTicketGetShowSchema = LuckyWheelLotteryTicketGetSchema.pick({
	uuid: true,
	type: true,
	triggerCount: true,
	conditionAmount: true,
	amount: true,
}).merge(z.object({ receiveCount: z.number().describe('') }))

export const LuckyWheelAwardShowSchema = LuckyWheelAwardSchema.pick({
	uuid: true,
	type: true,
	amount: true,
})

/**
 * 幸运转盘活动展示 zod
 */
export const LuckyWheelShowSchema = z.object({
	startTime: z.date(),
	/** 结束时间 */
	endTime: z.date(),
	rule: z.string(),
	ruleType: z.enum(ActivityRuleTypes),
	/** 转盘奖项list */
	awardList: z.array(LuckyWheelAwardShowSchema).default([]),
	/** 奖券获取 */
	lotteryTicketGet: z.array(LuckyWheelLottTicketGetShowSchema).default([]),
	/** 兑换奖励 */
	exchangeReward: z.number().int().gte(0).describe('兑换奖励'),
	/** 奖券获取次数 */
	lotteryTicketGetCount: z.number().int().describe('奖券获取次数'),
	/** prop_H 的个数 */
	propHCount: z.number().int().describe('prop_H 的个数'),
	/** prop_A 的个数 */
	propACount: z.number().int().describe('prop_A 的个数'),
	/** prop_P 的个数 */
	propPCount: z.number().int().describe('prop_P 的个数'),
	/** prop_Y 的个数 */
	propYCount: z.number().int().describe('prop_Y 的个数'),
})

/**
 * 代理显示用schema
 */
export const AgencyActivityShowSchema = z
	.object({
		allCount: z.number(),
		validCount: z.number(),
		ruleType: z.enum(ActivityRuleTypes),
		rule: z.string(),
		startTime: z.date(),
		endTime: z.date(),
		rewardConfig: z.array(
			z.object({
				uuid: z.string(),
				userCount: z.number(),
				...minMaxSchema.shape,
			}),
		),
		rewardList: z.array(
			z.object({
				status: z.enum(ActivityAwardStatus),
				awardCount: z.number(),
				awardType: z.enum(ActivityAwardTypes),
				levelId: z.string(),
			}),
		),
	})
	.merge(AgencyActivityConfigSchema.pick({ validUsers: true, displayMode: true, isShow: true, rewardType: true }))

/**
 * 自定义活动展示
 */
export const CustomActivityShowSchema = z
	.object({
		content: z.string(),
		isShowApply: z.boolean().default(true),
		// 宣传图跳转类型 详情 链接
		jumpType: z.enum(['DETAIL', 'LINK']).default('DETAIL'),
		target: TargetSelectSchema.optional(),
	})

/**
 * 红包雨显示用schema
 */
export const RedPacketShowSchema = z.object({
	rewardCount: z.number(),
	ruleType: z.enum(ActivityRuleTypes),
	rule: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	canReceive: z.boolean(),
	timeConfig: z.array(RedPacketTimeConfigSchema.pick({ hour: true, durationIn: true })),
	maxAmount: z.number(),
	/**app端显示图标 url */
	appIconUrl: z.string().optional(),
	/**前端显示每一波上限 */
	roundMaxAmount: z.number().default(0),
	/**每天最多领取次数 */
	dailyMaxCount: z.number().default(0),
	/**
	 * 当前领取次数
	 */
	receiveCount: z.number().default(0),
	/**
	 * 当前参与类型
	 */
	JoinTypes: z.enum(ValidCondition),
	/**
	 * 当前用户充值
	 */
	rechargeAmount: z.number().default(0),
	/**
	 * 当前用户投注
	 */
	betAmount: z.number().default(0),
})

/**
 * 签到显示用schema
 */
export const SignInRewardLevelSchema = z.object({
	signInTime: z.string().describe('签到日期'),
	rewardCount: z.number().int().describe('奖励数量'),
})
export const SignInShowSchema = z
	.object({
		signInDays: z.number(),
		//奖励列表
		rewardList: z.array(SignInRewardLevelSchema).default([]),
		signInType: z.enum(['CONTINUOUS', 'CUMULATIVE']),
		rechargeSuccessPopup: z.enum(SwitchTypes),
		appShowRewardAmount: z.enum(SwitchTypes),
		appShowExtraRewardAmount: z.enum(SwitchTypes),
		signInTime: z.date().nullable().optional().describe('签到时间'),
		//充值金额
		validRecharge: z.number().optional().describe('充值金额'),
		//有效投注
		validBet: z.number().optional().describe('有效投注'),
		//当天是否已经签到
		isSignIn: z.boolean().default(false),
		//d当前时间
		currentTime: z.date().default(new Date()),
		/**
		 * 循环类型
		 */
		cycleType: z.enum(['ONCE', 'CYCLE']),
		/**
		 * 奖励类型
		 */
		rewardType: z.enum(['TIERED_REWARDS', 'VIP_LEVEL_REWARDS']),
	})
	.merge(
		z.object({
			rewardConfig: z.array(
				SignInRewardConfigSchema.pick({
					day: true,
					icon: true,
					extraReward: true,
					iconType: true,
					amountType: true,
					amountMin: true,
					amountMax: true,
					rechargeAmount: true,
					validBet: true,
				}),
			),
		}),
	)

export const RechargeShowSchema = z.object({
	ruleType: z.enum(ActivityRuleTypes),
	rule: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	config: RechargeActivityConfigSchema,
	awardCount: z.number(),
})

export const AssistanceCashShowSchema = z
	.object({
		startTime: z.string(),
		endTime: z.string(),
		rangeAmount: z.number(),
		roundAmount: z.number(),
		allRoundCount: z.number(),
		drawCount: z.number(),
		rule: z.string(),
	})
	.merge(
		AssistanceCashConfigSchema.pick({
			awardList: true,
			shareDomain: true,
			domainImg: true,
		}),
	)

/**
 * 会员答谢活动展示
 */
export const memberRewardShowSchema = z.object({
	rewardCount: z.number().default(0),
	ruleType: z.enum(ActivityRuleTypes),
	rule: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	canReceive: z.boolean().default(false),
	maxAmount: z.number(),
	memberDay: z.number().default(1),
	/**重置方式 */
	resetType: z.enum(ActivityResetTypes),
	/**当前服务器时间 */
	currentTime: z.date(),
})

/**
 * 神秘彩金活动展示
 */
export const MysteryRewardShowSchema = z.object({
	dayList: z.array(
		z.object({
			day: z.number().int().min(1).max(30),
			/**奖励保留天数 */
			awardKeepDays: z.number().int().min(1),
			/**累计充值充值金额 */
			dayRecharge: z.number().int().min(0).default(0).optional(),
			/**奖励配置 */
			config: z.array(
				z.object({
					recharge: z.number().int().min(0),
					minAmount: z.number().int().min(0),
					maxAmount: z.number().int().min(0),
				}),
			),
			/**是否已经领取过 */
			isCanReceive: z.boolean().default(false),
		}),
	),
	/**参与时间 */
	joinTime: z.date().optional(),
	/**可领取时间 */
	receiveTime: z.number(),
	/**领取方式 */
	receiveType: z.string(),
})

export const CommissionRewardShowSchema = z.object({
	/** 累计领奖金额 */
	rewardAmount: z.number().int().min(0).default(0),
	/** 本期累计金额 */
	currentAmount: z.number().int().min(0).default(0),
	/** 奖励配置 */
	rewardConfig: z.array(BaseConfig),
	/** 是否可以领取 */
	canReceive: z.boolean().default(false),
	/** 重置类型 */
	resetType: z.enum(ActivityResetTypes),
	/** 返奖类型 */
	rewardType: z.enum(CommissionRewardType),
	/** 奖励类型 */
	awardType: z.enum(CommissionRewardAwardType),
	/** 上期奖励金额 */
	lastRewardAmount: z.number().int().min(0).default(0),
})

export const CPFActivityShowSchema = z.object({
	/**
	 * 可领取金额
	 */
	rewardAmount: z.number().default(0),
})

/**
 * 幸运注单活动展示
 */
export const LuckyBetShowSchema = z.object({
	/**游戏限制类型 */
	gameLimitType: z.enum(['ALL', 'SELECT']).default('ALL'),
	/**游戏限制 */
	gameLimit: z
		.array(
			z.object({
				/** 游戏类型 */
				gameType: z.enum(GameTypes).default(GameTypes[0]),
				/**平台数据 */
				platformData: z
					.array(
						z.object({
							platformId: z.number().int().default(0),
							gameData: z.array(z.object({ gameId: z.number().int() })).default([]),
						}),
					)
					.default([]),
			}),
		)
		.default([]),
	/** 是否显示奖励上限 */
	showRewardLimit: z.boolean().default(false),
	/** 中奖方式  尾号 连号(任意位置) 包含(任意位置)*/
	winType: z.enum(['TAIL_NUMBER', 'CONSECUTIVE_NUMBER', 'CONTAINS_ANY_POSITION']),
	/** 奖励配置 */
	rewardConfigs: z.array(BaseConfigPlus).default([]),
	/** 当前可领取次数 */
	receiveCount: z.number().default(0),
	/** 活动领取上限 */
	receiveLimit: z.number().int().default(0),
	/** 奖励方式 固定金额，有效投注的倍数 */
	rewardType: z.enum(['FIXED', 'BET_MULTIPLE']),
	/** 已经领取次数 */
	numberTimesReceived: z.number().int().default(0),
	/** 可领取金额 */
	rewardAmount: z.number().default(0),
	/** 到账方式 */
	awardType: z.enum(['BALANCE', 'ACTIVITY']),
	/** 领取次数类型 */
	receiveCountType: ZReceiveCountLimitType,
	/** 领取次数限制 */
	receiveCountLimit: ReceiveCountLimitMap,
})



/**
 * 充值大酬宾展示
 */
export const RechargePromotionShowSchema = z.object({
	/** 活动日 */
	activityDay: z.number().int().min(1).max(7),
	// 充值活动稽核方式 1 表示赠送部分  2 表示赠送+本金
	rewardAuditType: z.enum(['Gift', 'GiftAndRecharge']).default('Gift').describe('充值活动稽核方式'),
	/** 首页入口 */
	homeEntry: z.boolean().default(false),
	/** 活动配置 */
	activityConfig: z.array(RechargePromotionRewardSchema).default([]),
	/** 已经获取的奖励层级ID */
	receivedLevelIds: z.array(z.string()).default([]),
	/** 首页图标地址 */
	appIconUrl: z.string().optional(),
	/** 活动开始时间 */
	startTime: z.date().optional(),
	/** 活动结束时间 */
	endTime: z.date().optional(),
	/** 活动展示开始时间 */
	showStartTime: z.date().optional(),
	/** 活动展示结束时间 */
	showEndTime: z.date().optional(),
	/** 活动状态 */
	status: ZActivityStatus.default('DRAFT'),
})

/**
 * 会员答谢多日版活动展示
 */
export const MemberRewardMultiDayShowSchema = z.object({
	rewardCount: z.number().default(0),
	ruleType: z.enum(ActivityRuleTypes),
	rule: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	canReceive: z.boolean().default(false),
	maxAmount: z.number(),
	memberDay: z.array(z.number().int().min(1).max(31)),
	/**重置方式 */
	resetType: z.enum(ActivityResetTypes),
	/**
	 * 当前时间
	 */
	currentTime: z.date(),

})


/**
 * 代理活动2相关配置
 */
/**
 * 代理活动2显示用schema
 */
export const ReferralRewardsNewActivityShowSchema = z
	.object({
		ruleType: z.enum(ActivityRuleTypes),
		rule: z.string(),
		startTime: z.date(),
		endTime: z.date(),
		/**当前时间 */
		currentTime: z.date(),
		/**用户奖池金额 */
		poolAmount: z.number().default(0),
		/**可领取奖励金额 */
		canReceiveAmount: z.number().default(0),
		/**结算日期 */
		settlementDate: z.string().optional(),
	})


//=======================================================================================================================
// 活动定义
/**
 * 签到奖励配置 zod
 */
export const SignInVolumeDayConfigSchema = z.object({
	/** 连续签到天数 */
	day: z.number().int().positive().min(1).max(7).describe('连续签到天数'),
	/** 奖励金额 */
	awardAmount: z.number().int().default(0).describe('奖励金额'),
})
export type TSignInVolumeDayConfigSchema = z.infer<typeof SignInVolumeDayConfigSchema>

export const gradeTypes = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5'] as const
/**
 * 签到奖励等级配置 zod
 */
export const SignInVolumeAwardConfigSchema = z.object({
	/** 等级标识 */
	grade: z.enum(gradeTypes).describe('等级标识'),
	/** 等级名称 */
	gradeName: z.string().describe('等级名称'),
	/** 打码量 */
	volume: z.number().int().default(0).describe('打码量'),

	dayConfig: z.array(SignInVolumeDayConfigSchema).describe('连续签到天数配置'),
})
export type TSignInVolumeAwardConfigSchema = z.infer<typeof SignInVolumeAwardConfigSchema>

export const SignInVolumeActivityConfigSchema = z.object({
	/** 参与条件 */
	joinType: z.enum(JoinTypes),
	/**签到方式：连续签到 */
	signInType: z.enum(['CONTINUOUS']).default('CONTINUOUS'),
	/**循环类型：周期性循环 */
	cycleType: z.enum(['CYCLE']).default('CYCLE'),
	/**同注册IP参与人数 */
	ipLimit: z.number().int().default(0),
	/**奖励配置 */
	rewardConfig: z
		.object({
			volumeDay: z.number().int().default(0).describe('打码量计算天数,0:历史总值'),
			volumeConfig: z.array(SignInVolumeAwardConfigSchema).describe('等级奖励配置'),
		})
		.describe('奖励配置'),
} as const)

export type TSignInVolumeActivityConfigSchema = z.infer<typeof SignInVolumeActivityConfigSchema>

/**
 * 签到奖励显示用schema
 */
export const SignInVolumeShowSchema = z.object({
	/** 连续签到天数 */
	signInVolumeDays: z.number(),
	// 当天对应的级别是否已经签到
	isSignInGrade: z.boolean().default(false),
	// 当天是否已经签到
	isSignInToday: z.boolean().default(false),
	// 用户打码量
	userVolume: z.number().describe('用户打码量'),
	// 用户打码量配置
	userVolumeConfig: SignInVolumeAwardConfigSchema,
	// 只有打码量配置
	onlyVolumeConfig: z.array(SignInVolumeAwardConfigSchema.omit({ dayConfig: true })),
	// 打码量计算天数,0:历史总值
	volumeDay: z.number().int().default(0).describe('打码量计算天数,0:历史总值'),
	// 当前时间
	currentTime: z.date().default(new Date()),
})

export const NewUserExclusiveConfigSchema = z.object({
	/** 玩家范围 全部玩家 自定义 */
	playerRange: z.enum(['ALL', 'CUSTOM']),
	/** 自定义玩家渠道id */
	customChannelIdList: z.string().describe('自定义玩家渠道id'),
	/** 奖励档位 */
	rewardList: z.array(z.object({
		uuid: z.string().describe('档位uuid'),
		rewardAmount: z.number().int().positive().describe('奖励金额'),
		weight: z.number().int().gte(0).describe('出现权重'),
		bonusRatio: z.number().int().gte(0).describe('虚拟彩金比例'),
	})).default([]),
})

export const NewUserExclusiveShowSchema = z.object({
	config: NewUserExclusiveConfigSchema,
	canRound: z.boolean().default(false),
	awardAmount: z.number().int().positive().describe('奖励金额'),
})

// =======================================================================================================================
// 首充返利
export const FirstRechargeRebateActivityConfigSchema = z.object({
	/** 参与条件 */
	joinType: z.enum(JoinTypes).default(ZJoinType.enum.NEW_REGISTER),
	/** app展示方式 */
	appShowType: z.enum(['POP-UP']),
	/** 弹窗备注 */
	popUpRemark: z.string().describe('弹窗备注'),
	/** 亏损比例 */
	lossRatio: z.number().int().positive().min(1).max(10000),
	/** 返奖比例 */
	giveRatio: z.number().int().positive().min(1),
})

/**
 * 首充返利显示用schema
 */
export const FirstRechargeRebateShowSchema = z.object({
	/** app展示方式 */
	appShowType: z.enum(['POP-UP']),
	/** 弹窗备注 */
	popUpRemark: z.string().describe('弹窗备注'),
	/** 返奖金额 */
	giveAmount: z.number().int().default(0),
	// 当前时间
	currentTime: z.date().default(new Date()),
	/** 活动类型 */
	activityType: z.enum(['FirstRechargeRebate']).default('FirstRechargeRebate').describe('活动类型'),
})

// 首提返利
export const FirstWithdrawRebateActivityConfigSchema = z.object({
		/** 参与条件 */
		joinType: z.enum(JoinTypes).default(ZJoinType.enum.NEW_REGISTER),
		/** app展示方式 */
		appShowType: z.enum(['POP-UP']),
		/** 弹窗备注 */
		popUpRemark: z.string().describe('弹窗备注'),
		/** 返奖比例 */
		giveRatio: z.number().int().positive().min(1),
})

/**
 * 首提返利显示用schema
 */
export const FirstWithdrawRebateShowSchema = z.object({
		/** app展示方式 */
		appShowType: z.enum(['POP-UP']),
		/** 弹窗备注 */
		popUpRemark: z.string().describe('弹窗备注'),
		/** 返奖金额 */
		giveAmount: z.number().int().default(0),
		// 当前时间
	  currentTime: z.date().default(new Date()),
		/** 活动类型 */
		activityType: z.enum(['FirstWithdrawRebate']).default('FirstWithdrawRebate').describe('活动类型'),
})

/**
 * 活动类型
 */
export const ActivityMap = {
	/** 充值 */
	Recharge: {
		activityTypeName: '充值',
		config: RechargeActivityConfigSchema,
		showData: RechargeShowSchema,
		applyInfo: z.object({}),
		distributeType: ['AUTO'],
		resetType: ['NONE', 'DAILY', 'WEEKLY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE', 'ACTIVITY'],
		expiredAwardType: ['AUTO', 'ABANDONED', 'RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 实时反水 */
	Rebate: {
		activityTypeName: '实时返水',
		config: RebateActivityConfigSchema,
		applyInfo: CommonApplySchema,
		showData: RebateShowSchema,
		resetType: ['NONE', 'DAILY'],
		distributeType: ['MANUAL'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE', 'ACTIVITY'],
		expiredAwardType: ['RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 救援金 */
	Assistance: {
		activityTypeName: '救援金',
		config: AssistanceActivityConfigSchema,
		applyInfo: AssistanceApplySchema,
		showData: AssistanceShowSchema,
		distributeType: ['AUTO'],
		resetType: ['DAILY', 'WEEKLY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY', 'DELAY'],
		awardType: ['BALANCE', 'ACTIVITY'],
		expiredAwardType: ['AUTO', 'ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 签到 */
	SignIn: {
		activityTypeName: '签到',
		config: SignInActivityConfigSchema,
		applyInfo: SignInApplySchema,
		showData: SignInShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE', 'MONTHLY_DAY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		MemberDay: 0,
	},
	/** 幸运转盘 */
	LuckyWheel: {
		activityTypeName: '幸运转盘',
		config: LuckyWheelActivityConfigSchema,
		applyInfo: LuckyWheelApplySchema,
		showData: LuckyWheelShowSchema,
		resetType: ['NONE', 'DAILY', 'WEEKLY'],
		distributeType: ['AUTO'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['AUTO'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 红包 */
	RedPacket: {
		activityTypeName: '红包雨',
		config: RedPacketActivityConfigSchema,
		applyInfo: CommonApplySchema,
		showData: RedPacketShowSchema,
		distributeType: ['AUTO'],
		resetType: ['DAILY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 代理 */
	Agency: {
		activityTypeName: '代理',
		config: AgencyActivityConfigSchema,
		applyInfo: AgencyApplySchema,
		showData: AgencyActivityShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['AUTO'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 自定义 */
	Custom: {
		activityTypeName: '自定义',
		config: CustomActivityConfigSchema,
		applyInfo: CustomApplySchema,
		showData: CustomActivityShowSchema,
		distributeType: ['MANUAL'],
		resetType: ['NONE'],
		auditType: ['MANUAL'],
		distributeTimeType: ['IMMEDIATELY', 'DELAY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['AUTO'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 助力领现金 */
	AssistanceCash: {
		activityTypeName: '助力领现金',
		config: AssistanceCashConfigSchema,
		showData: AssistanceCashShowSchema,
		applyInfo: AssistanceCashApplySchema,
		distributeType: ['MANUAL'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 充值活动 */
	RechargeReward: {
		activityTypeName: '充值赠送',
		config: RechargeRewardActivityConfigSchema,
		applyInfo: z.object({}),
		showData: z.object({ content: z.string() }),
		distributeType: ['MANUAL'],
		resetType: ['NONE'],
		auditType: ['MANUAL'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['AUTO'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 会员答谢 */
	MemberReward: {
		activityTypeName: '会员答谢',
		config: MemberRewardConfigSchema,
		applyInfo: MemberRewardApplySchema,
		showData: memberRewardShowSchema,
		distributeType: ['AUTO'],
		resetType: ['MONTHLY_DAY', 'WEEKLY_DAY', 'DAILY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['AUTO', 'ABANDONED'],
		/**会员日 */
		MemberDay: 0,
		auditLimitGame: ActivityGameLimitSchema,
	},
	/**神秘彩金 */
	MysteryReward: {
		activityTypeName: '神秘彩金',
		config: MysteryRewardConfigSchema,
		applyInfo: MysteryRewardApplySchema,
		showData: MysteryRewardShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE', 'PERIODIC'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE', 'ACTIVITY'],
		expiredAwardType: ['ABANDONED', 'AUTO', 'RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 佣金奖励 */
	CommissionReward: {
		activityTypeName: '佣金奖励',
		config: CommissionRewardConfigSchema,
		applyInfo: z.object({}),
		showData: CommissionRewardShowSchema,
		distributeType: ['AUTO'],
		resetType: ['DAILY', 'WEEKLY_DAY', 'MONTHLY_DAY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		MemberDay: 0,
	},
	/** CPF活动 */
	CPFActivity: {
		activityTypeName: '邀请好友',
		config: CPFActivityConfigSchema,
		applyInfo: z.object({}),
		showData: CPFActivityShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE', 'WEEKLY_DAY', 'MONTHLY_DAY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['ABANDONED', 'RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		MemberDay: 0,
	},
	/** 幸运注单 */
	LuckyBet: {
		activityTypeName: '幸运注单',
		config: LuckyBetConfigSchema,
		applyInfo: CommonApplySchema,
		showData: LuckyBetShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE', 'ACTIVITY'],
		expiredAwardType: ['RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/**
	 * 签到奖励
	 * 签到方式只有连续签到
	 * 重置方式只有循环
	 * */
	SignInVolume: {
		activityTypeName: '签到奖励',
		config: SignInVolumeActivityConfigSchema,
		applyInfo: SignInVolumeApplySchema,
		showData: SignInVolumeShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		MemberDay: 0,
	},
	/**
	 * 新人专享
	 */
	NewUserExclusive: {
		activityTypeName: '新人专享',
		config: NewUserExclusiveConfigSchema,
		showData: z.object({}),
		applyInfo: z.object({}),
		distributeType: ['AUTO'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		frontendType:['HOME_POPUP']
	},
	/** 会员答谢_多日版 */
	MemberRewardMultiDay: {
		activityTypeName: '会员答谢—多日版',
		config: MemberRewardMultiDayConfigSchema,
		applyInfo: z.object({memberDay: z.number().optional()}),
		showData: MemberRewardMultiDayShowSchema,
		distributeType: ['AUTO'],
		resetType: ['MONTHLY_DAY', 'WEEKLY_DAY', 'DAILY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['AUTO', 'ABANDONED'],
		/**会员日 */
		MemberDay: 0,
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** 充值大酬宾 */
	RechargePromotion: {
		activityTypeName: '充值大酬宾',
		config: RechargePromotionActivityConfigSchema,
		applyInfo: z.object({}),
		showData: RechargePromotionShowSchema,
		distributeType: ['AUTO'],
		resetType: ['WEEKLY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['BALANCE'],
		expiredAwardType: ['AUTO'],
		auditLimitGame: ActivityGameLimitSchema,
	},
	/** WalletUserActivity活动 */
	WalletUserActivity: {
		activityTypeName: '邀请好友',
		config: CPFActivityConfigSchema,
		applyInfo: z.object({}),
		showData: CPFActivityShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE', 'WEEKLY_DAY', 'MONTHLY_DAY'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['ABANDONED', 'RETAIN_DAY_AUTO', 'RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		MemberDay: 0,
	},

	/**
	 * 首充返利
	 * */
	FirstRechargeRebate: {
		activityTypeName: '首充返利',
		config: FirstRechargeRebateActivityConfigSchema,
		applyInfo: z.object({}),
		showData: FirstRechargeRebateShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		MemberDay: 0,
	},
	
	/**
	 * 首提返利
	 * */
	FirstWithdrawRebate: {
		activityTypeName: '首提返利',
		config: FirstWithdrawRebateActivityConfigSchema,
		applyInfo: z.object({}),
		showData: FirstWithdrawRebateShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['RETAIN_DAY_ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
		MemberDay: 0,
	},
	/** 邀请好友2 */
	ReferralRewardsNew: {
		activityTypeName: '邀请好友2',
		config: ReferralRewardsNewActivityConfigSchema,
		applyInfo: z.object({}),
		showData: ReferralRewardsNewActivityShowSchema,
		distributeType: ['AUTO'],
		resetType: ['NONE'],
		auditType: ['AUTO'],
		distributeTimeType: ['IMMEDIATELY'],
		awardType: ['ACTIVITY'],
		expiredAwardType: ['ABANDONED'],
		auditLimitGame: ActivityGameLimitSchema,
	},
} as const satisfies Record<
	string,
	{
		activityTypeName: string
		config: object
		/** 展示数据 */
		showData: object
		/** 申请参数 */
		applyInfo: object
		/** 派发方式 */
		distributeType?: readonly TDistributeType[]
		/** 重置方式 */
		resetType?: readonly TActivityResetType[]
		/** 审核方式 */
		auditType?: readonly TAuditTypes[]
		/** 派奖时间类型 */
		distributeTimeType?: readonly TDistributeTimeTypes[]
		/** 到账方式 */
		awardType?: readonly TAwardType[]
		/** 过期奖励作废方式 */
		expiredAwardType?: readonly TExpiredAwardTypes[]
		/**
		 * 游戏限制
		 */
		auditLimitGame?: object
		/**会员日 */
		MemberDay?: Number
		/** 前端显示类型 */
		frontendType?: readonly TActivityFrontendType[]
	}
>

export type TActivityType = keyof typeof ActivityMap
export const TActivityTypes = typeObjectKeys(ActivityMap)
export const OtherActivityTypes = ['VIP', 'RedeemCode', 'Other', 'DomainRescue', ...TaskTypeEnumTypes] as const
export const TAwardActivityTypesValues = [...TActivityTypes, ...OtherActivityTypes] as const
export type TOtherActivityTypes = (typeof OtherActivityTypes)[number]
export type TAwardActivityTypes = TActivityType | TOtherActivityTypes
export const ZTActivityTypes = z.enum(TAwardActivityTypesValues)

export type TActivityConfig<T extends TActivityType> = z.infer<(typeof ActivityMap)[T]['config']>
export type TActivityShow<T extends TActivityType> = z.infer<(typeof ActivityMap)[T]['showData']>
export type TActivityApply<T extends TActivityType> = z.infer<(typeof ActivityMap)[T]['applyInfo']> & {
	userId: number
	tenantId: number
}
export type TActivityAuditLimitGame<T extends TActivityType> = z.infer<(typeof ActivityMap)[T]['auditLimitGame']>

/** 只能创建一个的活动类型 */
export const OnlyOneActivityTypes = [
	'Rebate',
	'SignIn',
	'LuckyWheel',
	'RedPacket',
	'Agency',
	'AssistanceCash',
	'RechargeReward',
	'MemberReward',
	'MysteryReward',
	'CommissionReward',
	'CPFActivity',
	'LuckyBet',
	'SignInVolume',
	'MemberRewardMultiDay',
	'RechargePromotion',
	'WalletUserActivity',
	'NewUserExclusive',
	'RechargePromotion',
	'ReferralRewardsNew',
	'FirstRechargeRebate',
	'FirstWithdrawRebate',
] as const

export const NotShowFrontendActivityTypes = ['NewUserExclusive'] as const
export type TNotShowFrontendActivityTypes = (typeof NotShowFrontendActivityTypes)[number]

/** app活动列表不显示类型 */
export const AppActivityListNotShowTypes = [
	'FirstRechargeRebate',
	'FirstWithdrawRebate',
] as const
export type TAppActivityListNotShowType = (typeof AppActivityListNotShowTypes)[number]

export interface TActivityUpdateProgress {
	userId: number
	amount: number
	progressId: string
}

/**跳转链接类型 */
export const JumpPageType = ['CODE', 'ACTIVITY', 'URL'] as const
export type TJumpPageType = (typeof JumpPageType)[number]
export const ZJumpPageType = z.enum(JumpPageType)

/**自定义页面类型 */
export const CustomPageType = [
	'/main/entrar', //充值页
	'/spread', //推广中心页
	'/main/withdraw', //提现页
	'/main/promo', //活动页
	'/', //首页
	'/activity/vip', //vip页
	'/Redeem', //兑换码页
] as const
export type TCustomPageType = (typeof CustomPageType)[number]
export const ZCustomPageType = z.enum(CustomPageType)

/**邮件里面活动多语言配置 */
export const EmailsActivityConfig = z.object({
	activityName: z.string().nullable().optional(),
	nameType: z.enum(NameTypes),
	nameParams: z.any(),
	activityType: z.enum(TActivityTypes),
})
export type TEmailsActivityConfig = z.infer<typeof EmailsActivityConfig>

/**
 * 奖励领取方式
 * 自动领取，手动领取
 */
export const AwardReceiveTypes = ['AUTO', 'MANUAL'] as const
export type TAwardReceiveType = (typeof AwardReceiveTypes)[number]
export const ZAwardReceiveType = z.enum(AwardReceiveTypes)

/**活动详情页样式 */
export const DetailsStyle = [
	'style_0', //跟随皮肤
	'style_1', //样式一
] as const
export type TDetailsStyle = (typeof DetailsStyle)[number]
export const ZDetailsStyle = z.enum(DetailsStyle)

/**
 * 注册赠送奖励类型
 * 固定金额 随机金额 谢谢惠顾
 */
export const RegisterRewardAwardTypes = ['FIXED', 'RANDOM', 'THANKS'] as const
export type TRegisterRewardAwardType = (typeof RegisterRewardAwardTypes)[number]
export const ZRegisterRewardAwardType = z.enum(RegisterRewardAwardTypes)

/**
 * 奖励设置
 * 累计充值 累计充提差 累计提现
 */
export const RegisterRewardAwardSetting = ['RECHARGE', 'RECHARGE_WITHDRAW', 'WITHDRAW'] as const
export type TRegisterRewardAwardSetting = (typeof RegisterRewardAwardSetting)[number]
export const ZRegisterRewardAwardSetting = z.enum(RegisterRewardAwardSetting)

/** 防google救援金配置 */
export const rescueConfigSchema = z.object({
	status: z.enum(['enable', 'disable']).describe('开启状态'),
	domainIds: z.array(z.number()).max(100).describe('域名id'),
	content: z.string().describe('救援文案'),
	giftMinAmount: z.number().describe('奖励最小金额'),
	auditMultiple: z.number().describe('稽核倍数'),
	auditPlatformMd5: z.string().describe('稽核平台md5值'),
	bonusStatus: z.enum(['enable', 'disable']).describe('救援奖金状态'),
	giftAmountType: z.enum(['fixed', 'range']).describe('奖励金额类型'),
	giftMaxAmount: z.number().optional().nullable().describe('奖励最大金额'),
	forceBomb: z.boolean().default(false).describe('强制弹窗'),
	installType: z.enum(['pwa', 'apk']).default('pwa').describe('安装类型'),
	apkName: z.string().optional().nullable().describe('apk名称'),
	apkUrl: z.string().optional().nullable().describe('apk下载链接'),
})
export type TRescueConfig = z.infer<typeof rescueConfigSchema>
