import * as z from 'zod'
import { BankCodeEnum } from './type/bank.types'
import { WalletCodes } from './type/payment.type'

export const MainAdminID = 1

export function typeObjectKeys<T extends string>(obj: Record<T, any>) {
	return Object.keys(obj) as [T, ...T[]]
}

/**
 * 游戏类型
 */
export const GameTypes = [
	/* 电子游戏 */
	'ELECTRONIC',
	/* 棋牌游戏 */
	'CHESS',
	/* 捕鱼游戏 */
	'FISHING',
	/* 视讯游戏 */
	'VIDEO',
	/* 体育游戏 */
	'SPORTS',
	/* 彩票游戏 */
	'LOTTERY',
] as const

export const AllGameTypes = ['all', ...GameTypes] as const

export type GameType = (typeof GameTypes)[number]
export const ZGameType = z.enum(AllGameTypes)
export type TAllGameTypes = (typeof AllGameTypes)[number]

/*
 * platform 状态
 */
export const PlatformStatusList = [
	/** 关闭 */
	'OFF',
	/** 开启 */
	'ON',
	/** 维护 */
	'MAINTAIN',
] as const
export type PlatformStatus = (typeof PlatformStatusList)[number]
export const ZPlatformStatus = z.enum(['all', ...PlatformStatusList])

/*
 * game 经营类型
 */
export const GameBusinessTypeList = [
	/** 自营 */
	'OWN',
	/** 三方 */
	'THIRD',
] as const
export type GameBusinessType = (typeof GameBusinessTypeList)[number]
export const ZGameBusinessType = z.enum(['all', ...GameBusinessTypeList])

/*
 * platform 经营类型
 */
export const PlatformBusinessTypeList = [
	...GameBusinessTypeList,
	/** 自营 和 三方 */
	'OWN_THIRD',
] as const
export type PlatformBusinessType = (typeof PlatformBusinessTypeList)[number]
export const ZPlatformBusinessType = z.enum([...PlatformBusinessTypeList])

/*
 * platform 状态
 */
export const PlatformTargetList = [
	/** 游戏列表 */
	'gameList',
	/** 大厅 */
	'hall',
] as const
export type TPlatformTargetList = (typeof PlatformTargetList)[number]
export const ZPlatformTargetList = z.enum(['all', ...PlatformTargetList])

/*
 * GameType 状态
 */
export const GameTypeStatusList = [
	/** 关闭 */
	'OFF',
	/** 开启 */
	'ON',
	/** 维护 */
	'MAINTAIN',
] as const

export type GameTypeStatus = (typeof GameTypeStatusList)[number]
export const ZGameTypeStatus = z.enum(['all', ...GameTypeStatusList])

/*
 * game 状态
 */
export const GameStatusList = [
	/** 关闭 */
	'OFF',
	/** 开启 */
	'ON',
	/** 维护 */
	'MAINTAIN',
] as const

export type GameStatus = (typeof GameStatusList)[number]
export const ZGameStatus = z.enum(['all', ...GameStatusList])

/*
 * game 有效投注的计算方式
 */
export const ValidBetTypeList = [
	/** 输赢 */
	'PROFIT',
	/** 投注 */
	'BET',
] as const

export type ValidBetTypes = (typeof ValidBetTypeList)[number]
export const ZValidBetTypes = z.enum(['all', ...ValidBetTypeList])

/**
 * 游戏logo 样式
 */
export const GameLogoStyleList = [
	/** 样式1 */
	'style1',
	/** 样式2 */
	'style2',
	/** 样式3 */
	'style3',
] as const

export type GameLogoStyle = (typeof GameLogoStyleList)[number]
export const ZGameLogoStyle = z.enum(['all', ...GameLogoStyleList])

/**
 * 管理员账号类型
 */
export const AdminTypes = [
	/**
	 * 总商户总管理员
	 */
	'MasterMainAdmin',
	/**
	 * 总商户子管理员
	 */
	'MasterSubAdmin',
	/**
	 * 子商户主管理员
	 */
	'ChildMainAdmin',
	/**
	 * 子商户子管理员
	 */
	'ChildSubAdmin',
	/**
	 * 公司主管理员
	 */
	'CompanyMainAdmin',
	/**
	 * 公司子管理员
	 */
	'CompanySubAdmin',
] as const
export const ZAdminType = z.enum(['all', 'User', ...AdminTypes])
export type TAdminTypes = (typeof AdminTypes)[number]

export type TAdminPower = {
	[K in TAdminTypes]: number
}

/**
 * 定义管理员权利大小
 */
export const AdminPower: TAdminPower = {
	MasterMainAdmin: 1000,
	MasterSubAdmin: 100,
	ChildMainAdmin: 10,
	ChildSubAdmin: 1,
	CompanyMainAdmin: 10,
	CompanySubAdmin: 1,
} as const

/**
 * 可创建的管理员类型
 */
export const CanCreateAdminTypes = [
	/**
	 * 总商户子管理员
	 */
	'MasterSubAdmin',
	/**
	 * 子商户子管理员
	 */
	'ChildSubAdmin',
	/**
	 * 公司子管理员
	 */
	'CompanySubAdmin',
] as const
export const ZCanCreateAdminType = z.enum(['all', ...CanCreateAdminTypes])

/**
 * 后台类型
 */
export const BackEndAdminTypes = [
	/**
	 * 总后台
	 */
	'Master',
	/**
	 * 商户后台
	 */
	'Child',
	/**
	 * 公司后台
	 */
	'Company',
] as const
export const ZBackEndAdminTypes = z.enum(['all', ...BackEndAdminTypes])

/**
 * 时区列表
 */
export const TimeZoneCodeEnum = [
	'Etc/GMT+12',
	'Etc/GMT+11',
	'Etc/GMT+10',
	'Etc/GMT+9',
	'Etc/GMT+8',
	'Etc/GMT+7',
	'Etc/GMT+6',
	'Etc/GMT+5',
	'Etc/GMT+4',
	'Etc/GMT+3',
	'Etc/GMT+2',
	'Etc/GMT+1',
	'Etc/GMT',
	'Etc/GMT-1',
	'Etc/GMT-2',
	'Etc/GMT-3',
	'Etc/GMT-4',
	'Etc/GMT-5',
	// 印度
	'Asia/Kolkata',
	// 印尼
	'Asia/Jakarta',
	// 越南
	'Asia/Ho_Chi_Minh',
	// 美国华盛顿
	'America/New_York',
	// 泰国
	'Asia/Bangkok',
	// 美国华盛顿太平洋城
	'America/Los_Angeles',
	//费尔南多·迪诺罗尼亚群岛
	'America/Noronha',
	'Etc/GMT-6',
	'Etc/GMT-7',
	'Etc/GMT-8',
	'Etc/GMT-9',
	'Etc/GMT-10',
	'Etc/GMT-11',
	'Etc/GMT-12',
	'Etc/GMT-13',
	'Etc/GMT-14',
] as const

export type TimeZoneCodeType = (typeof TimeZoneCodeEnum)[number]

export const UserInfoNeedTimeZoneCode: TimeZoneCodeType[] = [
	'Etc/GMT+3', 'Etc/GMT-7', 'Etc/GMT+5', 'Etc/GMT-8', 'Etc/GMT+7'
]


/*
 * 游戏记录 状态
 */
export const GameRecordStatusList = [
	/** 未结算 */
	'UNSETTLED',
	/** 已结算 */
	'SETTLED',
	/** 系统撤销 */
	'SYSTEMCANCEL',
	/** 玩家撤销 */
	'MANUALLYCANCEL',
] as const
export type GameRecordStatus = (typeof GameRecordStatusList)[number]
export const ZGameRecordStatus = z.enum(['ALL', ...GameRecordStatusList])

/** 角色类型 */
export const ROLETYPE = ['tenant', 'admin', 'tenantSub', 'tenantChannelSub', 'company', 'companySub'] as const
export const ZROLETYPE = z.enum(['all', ...ROLETYPE])

/**
 * 资金帐变类型映射表
 */
export const AssetChangeTypeMap = {
	/** 充值 */
	recharge: [
		/** 人工 */
		'manual',
		/** 三方 */
		'external',
		/** 线下转账 */
		'offlineTransfer',
		/** 三方人工补单 */
		'externalManual',
	] as const,
	/** 提现 */
	withdraw: [
		/** 人工 */
		'manual',
		/** 申请 */
		'apply',
		/** 完成 */
		'complete',
		/** 拒绝 */
		'reject',
		/** 罚没 */
		'confiscation',
	] as const,
	/** 活动优惠 */
	activity: [
		/** 人工存入 */
		'manualRecharge',
		/** 三方充值 支付那边渠道本身的赠送*/
		'externalRecharge',
		/** 线下转账 支付那边渠道本身的赠送*/
		'offlineTransfer',
		/** 充值活动 */
		'rechargeReward',
		/** 人工赠送 */
		'manualGift',
		/** 渠道送金 */
		'channelGift',
		/** 首充活动 */
		'firstRecharge',
		/** 累充活动 */
		'sumRecharge',
		/** 单笔充值活动 */
		'singleRecharge',
		/** vip */
		'vip',
		/** 活动签到奖励 */
		'signIn',
		/** 每日救援金 */
		'dailyAssistance',
		/** 每周救援金 */
		'weeklyAssistance',
		/** 实时返水 */
		'rebate',
		/** 红包雨 */
		'redPacket',
		/** 代理 */
		'agency',
		/** 自定义 */
		'custom',
		/** 幸运转盘 */
		'luckyWheel',
		/** 兑换码 */
		'redeemCode',
		/** 助力领现金 */
		'assistanceCash',
		/** 安装pwa/App赠送 */
		'installGift',
		/**会员答谢 */
		'memberReward',
		/** 佣金排行榜奖励 */
		'commissionRankReward',
		/**注册奖励 */
		'registerReward',
		/**神秘彩金 */
		'mysteryReward',
		/** 佣金返奖 */
		'commissionReward',
		/**cpf邀请活动 */
		'cpfActivity',
		/** 防封google域名奖励 */
		'googleDomainReward',
		/** 幸运注单 */
		'luckyBet',
		/** 签到奖励 */
		'signInVolumeReward',
		/** 新人专享 */
		'newUserExclusive',
		/**钱包用户邀请活动 */
		'walletUserActivity',
		/**会员日多日版 */
		'memberRewardMultiDay',
		/** 充值大酬宾 */
		'rechargePromotion',
		/** 首充返利 */
		'firstRechargeRebate',
		/** 首提返利 */
		'firstWithdrawRebate',
		/**代理活动2 */
		'referralRewardsNew',
		/** 三方游戏优惠 */
		'thirdGameDiscount',
	] as const,
	/** 游戏 */
	game: [
		/** 投注 */
		'bet',
		/** 结算 */
		'settle',
		/** 撤单 */
		'cancel',
		/** 回退 */
		'rollback',
	] as const,
	/** 平台钱包 */
	platform: [
		/** 转入 */
		'in',
		/** 转出 */
		'out',
	] as const,
	/** 保险柜 */
	safebox: [
		/** 转入 */
		'in',
		/** 转出 */
		'out',
	] as const,
	/** 佣金 */
	commission: [
		/** 结算 */
		'settle',
		/** 领取 */
		'receive',
	] as const,
	task: [
		/**新人任务奖励 */
		'newbieTaskReward',
	] as const,
	other: [
		/** 小费 */
		'tip',
		/** 取消小费 */
		'cancelTip',
	] as const,
} as const

export type TAssetChangeTypeMap = typeof AssetChangeTypeMap

export type AssetChangeMainType = keyof typeof AssetChangeTypeMap
export const AssetChangeMainTypes = typeObjectKeys(AssetChangeTypeMap)

export type AssetChangeSubType = {
	[K in keyof TAssetChangeTypeMap]: `${K}:${TAssetChangeTypeMap[K][number]}`
}[keyof TAssetChangeTypeMap]

export const AssetChangeSubTypes: [AssetChangeSubType, ...AssetChangeSubType[]] = typeObjectKeys(
	AssetChangeTypeMap,
).flatMap((item: AssetChangeMainType) => AssetChangeTypeMap[item].map((subItem) => `${item}:${subItem}`)) as [
		AssetChangeSubType,
		...AssetChangeSubType[],
	]

/**
 * 彩金类型
 */
export const RewardTypeEnum = [
	'manual_reward', // 人工彩金
	'register_give', // 注册赠送
	'recharge_give', // 充值赠送
	'test_amount', // 测试金额
] as const
export type RewardType = (typeof RewardTypeEnum)[number]
export const ZRewardType = z.enum(['all', ...RewardTypeEnum])

/**
 * 操作类型
 */
export const OperationTypeEnum = [
	'manual_deposit', // 手动存款
	'manual_withdrawal', // 手动提现
	'manual_reward', // 手动奖励
] as const
export type OperationType = (typeof OperationTypeEnum)[number]
export const ZOperationType = z.enum(['all', ...OperationTypeEnum])

/** 
 * 领取方式
 */
export const ReceiveTypeEnum = [
	/** 手动 */
	'manual',
	/** 自动 */
	'auto',
] as const
export type ReceiveType = (typeof ReceiveTypeEnum)[number]
export const ZReceiveType = z.enum(['all', ...ReceiveTypeEnum])

/**
 * 领取状态
 */
export const ReceiveStatusEnum = [
	/** 未领取 */
	'notReceived',
	/** 已领取 */
	'received',
	/** 非法 */
	'invalid',
	/** 过期 */
	'expired',
] as const
export type ReceiveStatus = (typeof ReceiveStatusEnum)[number]
export const ZReceiveStatus = z.enum(['all', ...ReceiveStatusEnum])

/**
 * 用户账号状态
 */
export const UserStatusEnum = ['normal', 'freeze'] as const
export type UserStatus = (typeof UserStatusEnum)[number]
export const ZUserStatus = z.enum(['all', ...UserStatusEnum])

/**
 * 用户账号类型
 */
export const UserTypeEnum = ['normal', 'test', 'demo'] as const
export type UserType = (typeof UserTypeEnum)[number]
export const ZUserType = z.enum(['all', ...UserTypeEnum])

/**
 * 查询是否在线
 */
export const IsOnlineEnum = ['false', 'true'] as const
export type IsOnline = (typeof IsOnlineEnum)[number]
export const ZIsOnline = z.enum(['all', ...IsOnlineEnum])

/**
 * 用户分页数据查询类型
 */
export const UserPageQueryTypeEnum = [
	'userId', // 用户ID
	'account', // 账号
	'registerIp', // 注册IP
	'phone', // 手机号
	'email', // 邮箱
	'parentId', // 上级ID
	'topId', // 顶级ID
	'recommendedId', // 推荐人ID
	'CPF', // CPF
	'withdrawPhone', // 提现手机号
	'MAYA',
	'GCASH',
	'realName'
] as const
export type TUserPageQueryType = (typeof UserPageQueryTypeEnum)[number]
export const ZUserPageQueryType = z.enum(['all', ...UserPageQueryTypeEnum])

/**
 * 用户分页数据金币类型
 */
export const UserPageCoinType = [
	// "all", // 全部
	'dayPay', // 每日充值
	'dayBet', // 每日投注
	'dayWinsLoses', // 每日输赢
	'dayReward', // 每日奖励
	'dayWithdrawals', // 每日提现
	'historicalPay', // 历史充值
	'historicalWithdrawals', // 历史提现
	'historicalBet', // 历史投注
	'historyWinsLoses', // 历史输赢
	'historicalReward', // 历史奖励
] as const
export type TUserPageCoinType = (typeof UserPageCoinType)[number]
export const ZUserPageCoinType = z.enum(['all', ...UserPageCoinType])

/**
 * 用户详情返回数据
 */
export interface UserDetail {
	id: number
	type: 'normal' | 'test' | null
	status: 'normal' | 'freeze'
	isOnline: boolean
	channelId: number
	channelName: string | null
	level: {
		id: number
		name: string
		tenantId: number
		type: 'DEFAULT' | 'FORMAL' | 'CUSTOMIZE'
		createTime: Date
		updateTime: Date
		lastOperator: string | null
		sort: number | null
		remark: string | null
		recharge: number | null
		bet: number | null
		directRecharge: number | null
		direct: number | null
		withdrawalLimit: number | null
		maxDayWithdrawal: number | null
	} | null
	realName: string | null
	phoneNumber: string | null
	email: string | null
	parentId: number | null
	remark: string | null
	noBetting: boolean
	registerType: RegisterTypeSubMap
	userName: string
	tenantId: number
	registerIp: string
	lastLoginIp: string
	registerTime: Date
	lastLoginTime: Date
	lastLoginDevice: string
	registerDevice: string
	registerDeviceModel: string
	loginDeviceModel: string
	tenantName: string
	regionName: string | null
	regionId: number | null
	regionCurrency: string | null
	balance: number
	yuebaoBalance: number
	safeBalance: number
	freezeAmount: number
	commission: number
	historicalPay: number
	historyWithdrawals: number
	historicalBetting: number
	historicalReward: number
	historicalCommissions: number
	historyWinsLoses: number
	historicalValidBetting: number
	recharge: number
	withdrawals: number
	betting: number
	winsLose: number
	commissions: number
	winMax: number
	reward: number
	validBetting: number
	bankName: string | null
	parentName: string | null
	registerIpCount: number
	LoginIpCount: number
	realNameCount: number
	sameParentCount: number
	goalPoint: number
	strength: number
	curPoint: number
	needFlow: number
	rechargeMultiple: number
	rewardMultiple: number
	vipLevel: number
}

/**
 * 邮件类型
 */
export const MailOperationTypeEnum = ['users', 'level'] as const
export type MailOperationType = (typeof MailOperationTypeEnum)[number]
export const ZMailOperationTypeEnum = z.enum(['all', ...MailOperationTypeEnum])

export const MailStatusEnum = ['sending', 'terminate', 'success','delete'] as const
export type MailStatus = (typeof MailStatusEnum)[number]
export const ZMailStatusEnum = z.enum(['all', ...MailStatusEnum])

export const MailisOnlineEnum = ['all', 'online', 'offline'] as const
export type MailisOnline = (typeof MailisOnlineEnum)[number]
export const ZMailisOnlineEnum = z.enum(['all', ...MailisOnlineEnum])

// =================代理相关================================
/**
 * 代理模式
 * @unlimitedLevel 无限级差
 * @multipleLevel 多级分销
 */
export const AgencyMode = ['unlimitedLevel', 'multipleLevel'] as const
export type TAgencyMode = (typeof AgencyMode)[number]
export const ZAgencyMode = z.enum(['all', ...AgencyMode])
/**
 * 返佣类型
 * @gameType 区分游戏类型
 * @noGameType 不区分游戏类型
 */
export const CommissionType = ['gameType', 'noGameType'] as const
/**
 * 业绩统计类型
 * @validBet 有效投注
 * @recharge 充值
 */
export const AchievementType = ['validBet', 'recharge'] as const
/**
 * 代理状态
 * @normal 正常
 * @settled 佣金已结算
 * @issued 佣金已发放
 */
export const AgencyStatus = ['normal', 'settled', 'issued'] as const
export type TAgencyStatus = (typeof AgencyStatus)[number]
/**
 * 代理关系
 * @direct 直属
 * @team 团队
 */
export const AgencyRelationType = ['direct', 'team'] as const
export type TAgencyRelationType = (typeof AgencyRelationType)[number]
export type TSubLevel = number | TAgencyRelationType
/**
 * 跳转类型
 * @home 首页
 * @registe 注册页
 */
export const JumpType = ['home', 'registe'] as const
/**
 * 默认平台id
 */
export const DefaultPlatformId = 1
/**
 * 代理关系查询类型
 * @sub 下级
 * @top 上级
 */
export const AgencyQueryType = ['sub', 'top'] as const
export type TAgencyQueryType = (typeof AgencyQueryType)[number]
/**
 * 无限级差模式结构
 */
export const UnlimitedLevelConfig = z.array(z.object({
	/** 代理等级 */
	level: z.number(),
	/** 需要流水 */
	needFlow: z.number(),
	/** 游戏类型 */
	gameType: z.enum(GameTypes),
	/** 返佣比例 */
	rat: z.number(),
}))
export type TUnlimitedLevelConfig = z.infer<typeof UnlimitedLevelConfig>
/**
 * 多级分销模式结构
 */
export const MultipleLevelConfig = z.array(z.object({
	/** 代理级别名称 */
	name: z.string(),
	/** 代理等级 */
	level: z.number(),
	/** 成员数量 */
	count: z.number(),
	/** 累计代理线充值 */
	totalLineRecharge: z.number(),
	/** 累计直属充值 */
	totalDirectRecharge: z.number(),
	/** 累计团队充值 */
	totalTeamRecharge: z.number(),
	/** 当日代理线充值 */
	dayLineRecharge: z.number(),
	/** 当日直属充值 */
	dayDirectRecharge: z.number(),
	/** 当日团队充值 */
	dayTeamRecharge: z.number(),
	/** 当日代理线有效投注 */
	dayLineValidBet: z.number(),
	/** 当日直属有效投注 */
	dayDirectValidBet: z.number(),
	/** 当日团队有效投注 */
	dayTeamValidBet: z.number(),
	/** 返佣比例 */
	rats: z.array(z.object({
		/** 游戏类型 */
		gameType: z.enum(GameTypes),
		/** 代理等级 */
		level: z.number(),
		/** 返佣比例 */
		rat: z.number(),
	})),
}))

export type TMultipleLevelConfig = z.infer<typeof MultipleLevelConfig>

/**
 * 代理排行榜奖励类型
 * @day 日榜
 * @week 周榜
 * @month 月榜
 */
export const AgencyRankRewardType = ['day', 'week', 'month'] as const
export type TAgencyRankRewardType = (typeof AgencyRankRewardType)[number]
export const ZAgencyRankRewardType = z.enum(['all', ...AgencyRankRewardType])
// =================================================================================
// 支付相关

/**
 *
 * 平台类型
 */
export const PaymentTypes = [
	/* 支付 */
	'PAY',
	/* 代付 */
	'WITHDRAW',
] as const

export type PaymentType = (typeof PaymentTypes)[number]
export const ZPaymentType = z.enum([...PaymentTypes])

/**
 *
 * 处理方式
 */
export const ProcessModes = [
	/* 三方支付 */
	'THREE_PARTY_PAYMENT',
	/* 转账 */
	'TRANSFER',
	/** 三方钱包 */
	'THREE_PARTY_WALLET',
] as const

export type ProcessMode = (typeof ProcessModes)[number]
export const ZProcessMode = z.enum(['all', ...ProcessModes])

/**
 *
 * 处理方式
 */
export const MoneyTypes = [
	/* 固定金额 */
	'FIXED',
	/* 浮动金额 */
	'RANGE',
] as const

export type MoneyType = (typeof MoneyTypes)[number]
export const ZMoneyType = z.enum(['all', ...MoneyTypes])

/**
 *
 * 支付渠道状态
 */
export const PayChannelStatusList = [
	/* 测试 */
	'TEST',
	/* 启用 */
	'ON',
	/* 禁用 */
	'OFF',
	/* 删除 */
	'DELETE',
] as const

export type PayChannelStatus = (typeof PayChannelStatusList)[number]
export const ZPayChannelStatus = z.enum(['all', ...PayChannelStatusList])

/**
 *
 * 代付渠道状态
 */
export const WithdrawChannelStatusList = [
	/* 启用 */
	'ON',
	/* 禁用 */
	'OFF',
	/* 删除 */
	'DELETE',
] as const

export type WithdrawChannelStatus = (typeof WithdrawChannelStatusList)[number]
export const ZWithdrawChannelStatus = z.enum(['all', ...WithdrawChannelStatusList])

/**
 *
 * 支付子类型状态
 */
export const PayTypeStatusList = [
	/* 启用 */
	'ON',
	/* 禁用 */
	'OFF',
] as const

export type PayTypeStatus = (typeof PayTypeStatusList)[number]
export const ZPayTypeStatus = z.enum(['all', ...PayTypeStatusList])

/**
 *
 * 支付子类型标签
 */
export const PayTypeTagList = [
	/* 无 */
	'NOTHING',
	/* 赠送 */
	'GIVE_AWAY',
	/** 推荐 */
	'RECOMMEND',
	/** 优惠 */
	'DISCOUNT',
] as const

export type PayTypeTag = (typeof PayTypeTagList)[number]
export const ZPayTypeTag = z.enum(['all', ...PayTypeTagList])

/**
 *
 * 支付订单状态
 */
export const UPayRecordStatusList = [
	/* 待支付 */
	'BE_PAID',
	/** 已支付 */
	'PAID',
	/** 补单完成 */
	'MANUAL_COMPLETTION',
	/** 取消 */
	'CANCEL',
	/** 已超时 */
	'TIMEOUT',
] as const

export type UPayRecordStatus = (typeof UPayRecordStatusList)[number]
export const ZUPayRecordStatus = z.enum(['all', ...UPayRecordStatusList])

/**
 *
 * 用户金额变动状态
 */
export const UPayRecordChangeAmountStatusList = [
	/** 超出限制 */
	'LIMIT_EXCEEED',
	/* 已到帐 */
	'HAVE_ARRIVED',
	/** 未到帐 */
	'NOT_ARRIVED',
] as const

export type UPayRecordChangeAmountStatus = (typeof UPayRecordChangeAmountStatusList)[number]
export const ZUPayRecordChangeAmountStatus = z.enum(['all', ...UPayRecordChangeAmountStatusList])

/**
 *
 * 转账订单状态
 */
export const UTransferApplyStatusList = [
	/* 待支付 */
	'BE_PAID',
	/* 待审核 */
	'TO-BE-REVIEW',
	/** 审核中 */
	'UNDER-REVIEW',
	/** 已上分 */
	'SUCCESS',
	/** 人工结束 */
	'MANUALLY-END',
	/** 已超时 */
	'TIMEOUT',
	/** 取消 */
	'CANCEL',
] as const

export type UTransferApplyStatus = (typeof UTransferApplyStatusList)[number]
export const ZUTransferApplyStatus = z.enum(['all', ...UTransferApplyStatusList])

/**
 *
 * 提现类型
 */
export const WithdrawalTypeEnum = [
	/* 用户提现 */
	'withdrawal',
	/* 佣金提现 */
	'commission',
] as const

export type WithdrawalType = (typeof WithdrawalTypeEnum)[number]

/**
 *
 * 提现类型
 */
export const WithdrawalStatusEnum = [
	/* 申请,待审核订单 */
	'apply',
	/* 锁定 ，审核中 */
	'lock',
	/* 拒绝 */
	'refuse',
	/* 罚没 */
	'confiscate',
	/* 代付中 */
	'inprog',
	/* 代付失败 */
	'fail',
	/* 代付异常 */
	'error',
	/* 通过 */
	'success',
] as const

export type WithdrawalStatus = (typeof WithdrawalStatusEnum)[number]

export const ZWithdrawalStatus = z.enum(['all', ...WithdrawalStatusEnum])

/**
 * 支付渠道中自定义配置
 */
export const PayMethodConfig = {
	'BR': z.object({
		// 是否需要cpf
		needCPF: z.boolean().optional(),
		// 是否需要真实姓名
		needRealName: z.boolean().optional(),
		// 是否需要手机号
		needPhone: z.boolean().optional(),
		// 是否需要邮箱
		needEmail: z.boolean().optional(),
	}),
}

export type TPayMethodConfig = z.infer<typeof PayMethodConfig[keyof typeof PayMethodConfig]>

/**
 * 跳转方式
 */
export const RedirectTypes = [
	// 默认
	'DEFAULT',
	// 跳转
	'REDIRECT',
] as const

export type RedirectType = (typeof RedirectTypes)[number]
export const ZRedirectType = z.enum(RedirectTypes)

/**
 * 收银台类型
 */
export const CheckoutTypes = [
	// 默认
	'DEFAULT',
	// 自定义
	'CUSTOM',
] as const

export type CheckoutType = (typeof CheckoutTypes)[number]
export const ZCheckoutType = z.enum(CheckoutTypes)


/**
 * 拓展类型
 */
export const PayExtendType = [
	/** 活动 */
	'activity',
] as const

export type TPayExtendType = (typeof PayExtendType)[number]
export const ZPayExtendType = z.enum(PayExtendType)

/**
 * 拓展
 */
export const PayExtendSchema = z.discriminatedUnion('type', [
	/** 活动 */
	z.object({
		type: z.literal(ZPayExtendType.enum.activity),
		activityId: z.number().describe('活动id'),
		activityType: z.string().describe('活动类型'),
		rewardLevelId: z.string().optional().describe('奖励等级id'),
	}),
])

export type TPayExtendSchema = z.infer<typeof PayExtendSchema>


//=====================================================================================================================

/**
 * oAuth 三方认证schema
 */
export const OauthStateSchema = z.object({
	/** oauth state */
	state: z.string(),
	/** 商户id */
	tenantId: z.coerce.number().describe('商户id'),
	/** 渠道id */
	channelId: z.coerce.number().optional().describe('渠道id'),
	/** 重定向地址 */
	redirect: z.string().url().describe('重定向地址'),
	/** callback地址 */
	callback: z.string().url().optional().describe('callback地址'),
	/**
	 * auth 方式
	 * login: 登陆
	 * bind: 绑定
	 */
	action: z.enum(['login', 'bind']).default('login').describe('auth类型'),
	userId: z.coerce.number().optional().describe('用户id'),
})

export type TOauthStateSchema = z.infer<typeof OauthStateSchema>

/**
 * 设备类型
 */
export const DeviceTypes = [
	/* 安卓 */
	'ANDROID',
	/* ios */
	'IOS',
	/* web */
	'WEB',
] as const
export type DeviceType = (typeof DeviceTypes)[number]
export const ZDeviceType = z.enum(['all', ...DeviceTypes])

/**
 * 支付通道设备类型
 */
export const PaymentDeviceTypes = [
	/* 全部 */
	'ALL',
	...DeviceTypes,
] as const
export type PaymentDeviceType = (typeof PaymentDeviceTypes)[number]
export const ZPaymentDeviceType = z.enum([...PaymentDeviceTypes])

export const AccountLimitEnum = [
	// 不限制
	'NoLimit',
	// 没有充值用户
	'NoRechargeUser',
] as const

export type TAccountLimitEnum = (typeof AccountLimitEnum)[number]

export const FeeTypeEnum = [
	// shang
	'UP',
	// xia
	'DOWN',
] as const

export type TFeeTypeEnum = (typeof FeeTypeEnum)[number]

/**
 * 注册方式
 */
export const RegisterTypes = ['Account', 'Phone', 'Google'] as const
export type TRegisterType = (typeof RegisterTypes)[number]
export const RegisterType = z.enum(RegisterTypes)

/**
 * 注册所需信息
 */
export const RegisterRequireSchema = z.enum(['Null', 'Phone', 'Email'])

/**
 * 第三方登录方式
 */
export const ThirdPartyLoginSchema = z.enum(['google', 'facebook', 'twitter', 'github'])

export type TThirdPartyLoginSchema = z.infer<typeof ThirdPartyLoginSchema>


/**
 * 用户注册类型
 */
export const RegisterTypeMap = {
	/** 账号 */
	account: [
		/** 普通账号 */
		'account',
	] as const,
	/** 电话 */
	phone: [
		/** 电话 */
		'phone',
		/** 申请 */
	] as const,
	/** 邮箱 */
	email: [
		/**email */
		'email',
		/** github */
		'github',
		/** 谷歌*/
		'google',
		/**twitter */
		'twitter',
	] as const,
} as const

export type TRegisterTypeMap = typeof RegisterTypeMap

export type RegisterTypeMainType = keyof typeof RegisterTypeMap
export const RegisterTypeMainTypes = typeObjectKeys(RegisterTypeMap)

export type RegisterTypeSubMap = {
	[K in keyof TRegisterTypeMap]: `${K}:${TRegisterTypeMap[K][number]}`
}[keyof TRegisterTypeMap]

export const RegisterTypeSubMaps: [RegisterTypeSubMap, ...RegisterTypeSubMap[]] = typeObjectKeys(
	RegisterTypeMap,
).flatMap((item: RegisterTypeMainType) => RegisterTypeMap[item].map((subItem) => `${item}:${subItem}`)) as [
		RegisterTypeSubMap,
		...RegisterTypeSubMap[],
	]
export const ZRegisterTypeSubMaps = z.enum(RegisterTypeSubMaps)

export enum RegisterTypeALL {
	/** 账号 */
	Account = 'account:account',
	/** 电话 */
	Phone = 'phone:phone',
	/** 邮箱 */
	Email = 'email:email',
	/** github */
	Github = 'email:github',
	/** 谷歌 */
	Google = 'email:google',
	/** twitter */
	Twitter = 'email:twitter',
}


// =================渠道相关================================
/**
 * 跳转指向
 * home 首页
 * google google
 */
export const JumpToEnum = ['home', 'google'] as const

/**
 * 域名类型
 * app 主域名
 * promotion 推广域名
 * google 防封谷歌页
 * ios 仿ios应用商店
 */
export const DomainCategoryEnum = ['app', 'promotion', 'google', 'ios'] as const
export type TDomainCategoryEnum = (typeof DomainCategoryEnum)[number]

/**
 * 网络托管商
 */
export const DomainProviderEnum = ['cloudflare'] as const

/**
 * 样式类型
 */
export const StyleTypeEnum = ['style_1', 'style_2'] as const

/**
 * 域名有效性
 * 有效 valid
 * 未生效 notEffective
 * 已失效 invcalid
 */
export const DomainEfficacyEnum = ['valid', 'notEffective', 'invcalid'] as const

/**
 * 跳转域名类型 主域名 自定义 防封谷歌页 主域名防封页
 */
export const JumpDomainTypeEnum = ['main', 'custom', 'google', 'mainAntiSealing'] as const
export type TJumpDomainTypeEnum = (typeof JumpDomainTypeEnum)[number]

/**
 * 落地指向 首页 注册页 谷歌 助力活动 活动优惠
 */
export const LandingEnum = ['home', 'register', 'google', 'assistance', 'discount'] as const
export type TLandingEnum = (typeof LandingEnum)[number]
/**
 * 跳转方式 
 */
export const JumpTypeEnum = ['normal', 'google'] as const
export type TJumpTypeEnum = (typeof JumpTypeEnum)[number]

/**
 * 跳转方式 
 * 手动: manual 只能作为主域名的防封页用于主域名防封
 * 自动: auto 其他都为auto
 */
export const JumpWayEnum = ['auto', 'manual'] as const

/**
 * 跳转域名类型 主域名 落地页
 */
export const JumpDomainsTypeEnum = ['main', 'landing'] as const
export type TJumpDomainsTypeEnum = (typeof JumpDomainsTypeEnum)[number]

/**
 * 留存率统计类型
 */
export const RetentionRateTypeEnum = ['login', 'recharge', 'bet'] as const

export type TRetentionRateTypeEnum = (typeof RetentionRateTypeEnum)[number]
// ========================================================

/**
 * 提现小类code
 */
export const BRWithdrawTypeCodeEnum = ['', 'PHONE', 'EMAIL', 'CPF', 'CNPJ', 'EVP'] as const
export type TBRWithdrawTypeCodeEnum = (typeof BRWithdrawTypeCodeEnum)[number]
export const ZBRWithdrawTypeCodeEnum = z.enum(BRWithdrawTypeCodeEnum)

/**
 *
 * 平台提现大类codecode
 */
export const PayWithdrawTypeCodeEnum = [
	'',
	/* PIX */
	'PIX',
	/**银行卡 */
	'BANK',
	/**UPI */
	'UPI',
	/**网络钱包 */
	'WALLET',
	/**GCASH */
	'GCASH',
	/**Maya Wallet */
	'MAYA_WALLET',
	/**Grab 钱包 */
	'GRAB_WALLET',
	/**QRPH */
	'QRPH',
	/**越南momo钱包 */
	'MOMO_WALLET',
	/**越南ViettelPay钱包 */
	'VIETTELPAY_WALLET',
] as const

export type TPayWithdrawTypeCodeEnum = (typeof PayWithdrawTypeCodeEnum)[number]

export const OTPBindTypeArray = [
	/** 绑定邮箱 */
	'bind_email',
	/** 绑定手机 */
	'bind_phone',
] as const

/**
 * OTP 类型枚举
 */
export const OTPTypesArray = [
	/** 注册 */
	'signup',
	/** 忘记密码 */
	'forgot_password',
	/** 修改交易密码 */
	'change_asset_password',
	/** 修改密码 */
	'change_password',
	...OTPBindTypeArray,
] as const
export const OTPTypes = z.enum(OTPTypesArray).describe('验证码类型')
export type TOTPTypes = z.infer<typeof OTPTypes>

/**
 * 基础identifier 类型枚举
 */
export const BaseIdentifierTypesArray = [
	/** 交易密码 */
	'phone',
	/** 邮箱 */
	'email',
] as const

export const BaseIdentifierTypes = z.enum(BaseIdentifierTypesArray).describe('标识ID类型')
/**
 * identifier 类型枚举
 */
export const IdentifierTypesArray = [
	/** 密码 */
	'password',
	...BaseIdentifierTypesArray,
] as const
export const IdentifierTypes = z.enum(IdentifierTypesArray).describe('标识ID类型')
export type TIdentifierTypes = z.infer<typeof IdentifierTypes>

/**
 * 提现手续费类型
 */
export const WithdrawalFeeTypeEnum = [
	/* 比例 */
	'ratio',
	/* 固额 */
	'fixed',
] as const

export type TWithdrawalFeeTypeEnum = (typeof WithdrawalFeeTypeEnum)[number]
export const ZTWithdrawalFeeTypeEnum = z.enum(['all', ...WithdrawalFeeTypeEnum])
/**
 * 提现手续费结构体定义
 */
export interface WithdrawalFee {
	min: number
	max: number
	type: TWithdrawalFeeTypeEnum
	value: number
}

/**
 * 打码日志类型
 */
export const FlowLogTypeEnum = [
	/* 充值 */
	'recharge',
	/* 奖励 */
	'reward',
] as const

export type TFlowLogTypeEnum = (typeof FlowLogTypeEnum)[number]

// =================================================================================
// 层级相关

/**
 * 层级类型
 */
export const UserLevelTypes = [
	/* 默认 */
	'DEFAULT',
	/* 正式 */
	'FORMAL',
	/* 自定义 */
	'CUSTOMIZE',
] as const

export type TUserLevelType = (typeof UserLevelTypes)[number]
export const ZUserLevelTypeEnum = z.enum(['all', ...UserLevelTypes])

/**
 *用户每日数据- 用户属性
 */
export const UserAttrsEnum = [
	/* 代理 */
	'agent',
	/* 非代理 */
	'notAgent',
] as const

export type TUserAttrsEnum = (typeof UserAttrsEnum)[number]
export const ZUserAttrsEnum = z.enum(['all', ...UserAttrsEnum])

/**
 *用户每日数据- 查询数据类型
 */
export const UserDayQueryTypeEnum = [
	/* 提现 */
	'recharge',
	/* 提现 */
	'withdrawal',
	/* 输赢 */
	'winsLose',
	/* 充提差 */
	'rechargeWithdrawal',
	/* 有效投注 */
	'validBetting',
	/* 局数 */
	'gameRounds',
	/* 优惠 */
	'reward',
	/* 结算佣金 */
	'settle',
	/**游戏中奖倍数 */
	'gameRewardMultiple',
] as const

export type TUserDayQueryTypeEnum = (typeof UserDayQueryTypeEnum)[number]
export const ZUserDayQueryTypeEnum = z.enum(['all', ...UserDayQueryTypeEnum])

// =================================================================================
// 活动相关

/*
 * vipLevel 领取规则
 */
export const VipReceiveRules = [
	/** 跨天，跨周，跨月时，未领取奖励邮件下发 */
	'RESERVE',
	/** 跨天，跨周，跨月时，未领取奖励系统回收作废 */
	'ABOLISHMENT',
] as const

export type VipReceiveRule = (typeof VipReceiveRules)[number]

export const VipReceiveTimeTypes = [
	/** 每天 */
	'DAILY',
	/** 每周 */
	'WEEKLY',
	/** 每月 */
	'MONTHLY',
] as const

/*
 * vipLevel 领取规则
 */
export const VipReceiveTypes = [
	/** 晋级 */
	'PROMOTION',
	...VipReceiveTimeTypes,
] as const

export type VipReceiveType = (typeof VipReceiveTypes)[number]
export const ZVipReceiveType = z.enum(VipReceiveTypes)

/*
 * vip奖励 领取状态
 */
export const VipReceiveStatusList = [
	/** 未领取 */
	'UNRECEIVED',
	/** 已领取 */
	'RECEIVED',
	/** 作废 */
	'INVALID',
] as const

export type VipReceiveStatus = (typeof VipReceiveStatusList)[number]

/*
 * 兑换码类型
 */
export const RedeemCodeType = [
	/** 通用 */
	'GENERIC',
	/** 唯一 */
	'UNIQUE',
] as const

export type TRedeemCodeType = (typeof RedeemCodeType)[number]

/*
 * 兑换码金额类型
 */
export const RedeemCodeAmountType = [
	/** 充值 */
	'RECHARGE',
	/** 盈亏 */
	'PROFIT',
	/**无限制 */
	'UNLIMITED',
	/**有效投注 */
	'BET',
] as const

export type TRedeemCodeAmountType = (typeof RedeemCodeAmountType)[number]

/*
 * 兑换码奖励类型
 */
export const RedeemCodeAwardType = [
	/** 固定金额 */
	'FIXED_AMOUNT',
	/** 随机金额 */
	'RANDOM_AMOUNT',
	/**固定比例 */
	'FIXED_RATIO',
	/**随机比例 */
	'RANDOM_RATIO',
] as const

export type TRedeemCodeAwardType = (typeof RedeemCodeAwardType)[number]

/*
 * 兑换码时间范围类型
 */
export const RedeemCodeTimeRangeType = [
	/** 历史 */
	'HISTORY',
	/**当日 */
	'TODAY',
	/**本周 */
	'WEEK',
	/**本月 */
	'MONTH',
	/**昨日 */
	'YESTERDAY',
	/**上周 */
	'LAST_WEEK',
	/**上月 */
	'LAST_MONTH',
	/**近七天 */
	'RECENT_SEVEN_DAYS',
	/**近三十天 */
	'RECENT_THIRTY_DAYS',
] as const

export type TRedeemCodeTimeRangeType = (typeof RedeemCodeTimeRangeType)[number]

/**
 *
 * 兑换码状态
 */
export const RedeemCodeSwitch = [
	/* 启用 */
	'ON',
	/* 禁用 */
	'OFF',
] as const

export type TRedeemCodeSwitch = (typeof RedeemCodeSwitch)[number]

/**
 *
 *
 */
export const RegionLimitType = [
	/* ALLOW_ACCESS 允许访问 */
	'ALLOW_ACCESS',
	/* 禁止访问 */
	'DENY_ACCESS',
] as const

export type TRegionLimitType = (typeof RegionLimitType)[number]

/**
 *
 * 兑换码状态
 */
export const RedeemCodeStatus = [
	/* 已使用 */
	'USED',
	/* 未使用 */
	'UNUSED',
] as const

export type TRedeemCodeStatus = (typeof RedeemCodeStatus)[number]

/**流水类型 */
export const FlowType = [
	/** 充值 */
	'RECHARGE',
	/** 活动 */
	'ACTIVITY',
	/** 系统 */
	'SYSTEM',
	/**任务 */
	'TASK',
] as const
export type TFlowType = (typeof FlowType)[number]
export const ZFlowType = z.enum(FlowType)
/**
 * 资金帐变类型映射表
 */
export const BlackListLimitTypeMap = {
	/** 用户 */
	USERS: [
		/** 登录 */
		'LOGIN',
	] as const,
	/** ip */
	IP: [
		/** 登录 */
		'LOGIN',
		/** 注册 */
		'REGISTER',
		/**登录和注册 */
		'LOGIN_REGISTER',
	] as const,
	/** 设备 */
	DEVICE: [
		/** 登录 */
		'LOGIN',
		/** 注册 */
		'REGISTER',
		/**登录和注册 */
		'LOGIN_REGISTER',
	] as const,
	/** 充值 */
	RECHARGE: [
		/** 线上充值 */
		'RECHARGE',
		/** 转账充值 */
		'TRANSFER',
		/** 转账和线上充值 */
		'TRANSFER_RECHARGE',
	] as const,
	/** 提现 */
	WITHDRAW: [
		/** 提现 */
		'WITHDRAW',
	] as const,
} as const

type TBlackListLimitTypeMap = typeof BlackListLimitTypeMap

export type BlackListLimitType = keyof typeof BlackListLimitTypeMap
export const BlackListLimitTypes = typeObjectKeys(BlackListLimitTypeMap)

export type BlackListLimitSubType = {
	[K in keyof TBlackListLimitTypeMap]: `${K}:${TBlackListLimitTypeMap[K][number]}`
}[keyof TBlackListLimitTypeMap]

export const BlackListLimitSubTypes: [BlackListLimitSubType, ...BlackListLimitSubType[]] = typeObjectKeys(
	BlackListLimitTypeMap,
).flatMap((item: BlackListLimitType) => BlackListLimitTypeMap[item].map((subItem) => `${item}:${subItem}`)) as [
		BlackListLimitSubType,
		...BlackListLimitSubType[],
	]

export const ServiceTypeEnum = ['Telegram', 'Whatsapp', 'Skype', 'Facebook', 'Instagram', 'Line'] as const
export type TServiceTypeEnum = (typeof ServiceTypeEnum)[number]

export const PointTypeEnum = ['Normal', 'Facebook', 'TikTok', 'Kwai', 'ShelfPackage', 'APK', 'TikTokAPI', 'GTM', 'FacebookAPI', 'KwaiAPI', 'AFAPI',
	'MgSkyAds', 'IOSShelfPackage', 'ADAPI',
] as const
export type TPointTypeEnum = (typeof PointTypeEnum)[number]

export const InstallSendMoneyTypeEnum = ['OFF', 'recharge', 'login'] as const
export type TInstallSendMoneyTypeEnum = (typeof InstallSendMoneyTypeEnum)[number]

export const AdEventTypeEnum = ['register', 'recharge'] as const
export type TAdEventTypeEnum = (typeof AdEventTypeEnum)[number]

export const AdDeviceTypeEnum = ['idfa', 'gps_adid', 'android_id', 'android_id_lower_md5', 'android_id_lower_sha1', 'android_id_upper_md5', 'android_id_upper_sha1', 'idfv', 'imei', 'imei_lower_md5', 'meid', 'win_naid', 'win_hwid'] as const
export type TAdDeviceTypeEnum = (typeof AdDeviceTypeEnum)[number]

/**
 * 弹窗内容类型
 */
export const PopupContentTypeEnum = [
	/** 常规升级 */
	'NORMAL',
	/** 赠送彩金升级 */
	'REWARD',
] as const
export type TPopupContentTypeEnum = (typeof PopupContentTypeEnum)[number]

/**
 * ios弹窗内容类型
 */
export const IosPopupContentTypeEnum = [
	/** 保存桌面 */
	'DESK',
	/** 苹果商店 */
	'APPSTORE',
] as const
export type TIosPopupContentTypeEnum = (typeof IosPopupContentTypeEnum)[number]

/**
 * 弹窗时机类型
 */
export const PopupTimeTypeEnum = [
	/** 访问主页 */
	'HOME',
	/** 用户充值 */
	'RECHARGE',
	/** 首次提现 */
	'FIRST_WITHDRAWAL',
] as const
export type TPopupTimeTypeEnum = (typeof PopupTimeTypeEnum)[number]

/**
 * 安装方式
 */
export const PopupInstallTypeEnum = ['PWA', 'APK', 'PWA+APK'] as const
export type TPopupInstallTypeEnum = (typeof PopupInstallTypeEnum)[number]

/**
 * 稽核副表数据状态
 */
export const AuditSubTableStatusEnum = ['notStarted', 'ongoing', 'completed'] as const
export type TAuditSubTableStatusEnum = (typeof AuditSubTableStatusEnum)[number]

/**
 * 稽核解除方式
 */
export const AuditReleaseTypeEnum = ['manual', 'auto', 'balanceZero', ''] as const
export type TAuditReleaseTypeEnum = (typeof AuditReleaseTypeEnum)[number]

/**稽核解除设置 */
export const AuditReleaseSettingEnum = ['auto', 'notAuto'] as const
export type TAuditReleaseSettingEnum = (typeof AuditReleaseSettingEnum)[number]

/**
 * 稽核主表数据状态
 */
export const AuditMainTableStatusEnum = ['closed', 'unfinished', 'completed'] as const
export type TAuditMainTableStatusEnum = (typeof AuditMainTableStatusEnum)[number]

/**
 * 应用类型
 */
export const AppTypes = [
	/* 苹果H5 */
	'iOSH5',
	/* 安卓H5 */
	'AndroidH5',
	/* PWA */
	'PWA',
	/* APK */
	'APK',
	/* 苹果包 */
	'iOSApp',
	/* 苹果书签 */
	'iOSBookmark',
	/* APK上架包 */
	'APKRelease',
	/* 电脑系统 */
	'DesktopOS',
] as const
export type TAppTypes = (typeof AppTypes)[number]
export const ZAppTypes = z.enum(AppTypes)
/**
 * 游戏配置表发布状态
 */
export const GameConfigPublishStatusEnum = ['published', 'unpublished', 'publishing', 'failed', 'published_online'] as const
export type TGameConfigPublishStatusEnum = (typeof GameConfigPublishStatusEnum)[number]

export const GoogleStyleEnum = ['style_1', 'style_2', 'style_3', 'style_4'] as const
export type TGoogleStyleEnum = (typeof GoogleStyleEnum)[number]

/**
 * 仿应用商店模板类型
 * ios: 苹果应用商店
 * google: 谷歌应用商店
 */
export const ImitationAppTypeEnum = ['ios', 'google'] as const
export type TImitationAppTypeEnum = (typeof ImitationAppTypeEnum)[number]

export const AuthenticationEnum = ['google', 'custom'] as const
export type TAuthenticationEnum = (typeof AuthenticationEnum)[number]

export const AgencySoftwareTypeEnum = [
	'Facebook',
	'Telegram',
	'Instagram',
	'TikTok',
	'Whatsapp',
	'Twitter',
	'Kwai',
	'YouTube',
] as const
export type TAgencySoftwareTypeEnum = (typeof AgencySoftwareTypeEnum)[number]

export const FrontConfigCommonSchema = z
	.object({
		/** 下载按钮 */
		downloadBtn: z.boolean(),
		/** 引导安装 */
		guideInstall: z.boolean(),
		/** 弹窗类型 */
		popupType: z.enum(PopupContentTypeEnum),
		/** 显示赠送金额类型 */
		showGiftAmountType: z.number(),
		/** 显示赠送金额 */
		showGiftAmount: z.number(),
		/** 显示赠送金额上限 */
		showGiftMaxAmount: z.number(),
		/** 弹窗时间点 */
		popupTime: z.enum(PopupTimeTypeEnum),
		/** 弹窗间隔时间 */
		popupInterval: z.number(),
		/** 安装类型 */
		installType: z.enum(PopupInstallTypeEnum),
		/** 安装地址 */
		installUrl: z.string(),
	})

export const FrontConfigSchema = z.object({
	android: FrontConfigCommonSchema.default({
		downloadBtn: true,
		guideInstall: true,
		popupType: 'NORMAL',
		showGiftAmountType: 0,
		showGiftAmount: 0,
		showGiftMaxAmount: 0,
		popupTime: 'HOME',
		popupInterval: 0,
		installType: 'PWA',
		installUrl: '',
	}),
	ios: FrontConfigCommonSchema.extend({
		/** 安装类型 */
		installType: z.enum(IosPopupContentTypeEnum).default('DESK'),
		/** 上架包id */
		iosPackageId: z.number().default(0),
		/** 上架包地址类型 */
		iosAddressType: z.enum(['normal', 'onelink']).default('normal'),
	}).default({
		downloadBtn: true,
		guideInstall: true,
		popupType: 'NORMAL',
		showGiftAmountType: 0,
		showGiftAmount: 0,
		showGiftMaxAmount: 0,
		popupTime: 'HOME',
		popupInterval: 0,
		installType: 'DESK',
		installUrl: '',
	}),
})

export const PaymentPartnerTypeEnum = ['Default', 'Custom'] as const
export type TPaymentPartnerTypeEnum = (typeof PaymentPartnerTypeEnum)[number]

/**
 * 推荐活动分类 Custom：自定义 InternalLink：内链接
 */
export const SuggestionActivityTypeSchema = [
	/** 自定义 */
	'Custom',
	/** 内链接 */
	'InternalLink',
] as const

export type TSuggestionActivityTypeSchema = (typeof SuggestionActivityTypeSchema)[number]

/**
 * 追踪条件
 */
export const TrackingConditionsSchema = ['Recharge', 'NotRecharged', 'RechargeBet', 'RechargeNotBet'] as const

export type TTrackingConditionsSchema = (typeof TrackingConditionsSchema)[number]

/**
 * 商户使用类型
 */
export const TenantUseTypeEnum = ['Normal', 'Test'] as const
export type TTenantUseType = (typeof TenantUseTypeEnum)[number]

/**
 * 商户皮肤类型
 */
export const TenantSkinTypeMap = {
	/** 版面1 */
	Layout1: [
		/** 游戏-经典游戏蓝 */
		'Blue',
		/** 游戏-经典游戏绿 */
		'Green',
		/** 游戏-琥珀紫 */
		'AmberPurple',
		/** 游戏-游戏蓝v01 */
		'Blue_V01',
		/** 厂商-游戏蓝v01 */
		'BlueV01',
		/** 厂商-蓝色v02 */
		'BlueV02',
		/** 厂商-绿v01 */
		'GreenV01',
		/** 厂商-绿v02 */
		'GreenV02',
		/** 厂商-深林绿V01 */
		'PineGreenV01',
		/** 厂商-深林绿V02 */
		'PineGreenV02',
		/** 厂商-琥珀紫V01 */
		'AmberPurpleV01',
		/** 厂商-极光黄 */
		'AuroraYellow',
	] as const,
	/** 版面2 */
	Layout2: [
		/** 游戏-深翠绿 */
		'DarkGreen',
		/** 游戏-金熠黄 */
		'GoldenYellow',
		/** 游戏-蓝凝紫 */
		'BluePurple',
		/** 厂商-幻影蓝 */
		'PhantomBlue',
		/** 游戏/厂商-新纪元蓝 */
		'NeoBlue',
		/** 厂商-秘光蓝 */
		'MystLightBlue',
		/** 厂商-午夜紫 */
		'MidnightPurple',
	] as const,
	/** 版面3 */
	Layout3: [
		/** 游戏-琥珀紫 */
		'AmberPurple',
	] as const,
	/** 版面4 */
	Layout4: [
		/** 棕褐色 */
		'Highlight',
	] as const,
} as const

export type TTenantSkinTypeMap = typeof TenantSkinTypeMap

export type TenantSkinType = keyof typeof TenantSkinTypeMap
export const TenantSkinTypes = typeObjectKeys(TenantSkinTypeMap)

export type TenantSkinSubType = {
	[K in keyof TTenantSkinTypeMap]: TTenantSkinTypeMap[K][number]
}[keyof TTenantSkinTypeMap]

export const TenantSkinSubTypes: [TenantSkinSubType, ...TenantSkinSubType[]] = typeObjectKeys(
	TenantSkinTypeMap,
).flatMap((item: TenantSkinType) => TenantSkinTypeMap[item].map((subItem) => `${item}:${subItem}`)) as [
		TenantSkinSubType,
		...TenantSkinSubType[],
	]

/**
 * 首页类型
 */
export const HomeTypes = [
	/** 游戏类型 */
	'GameType',
	/** 厂商类型 */
	'Platform'
] as const

export type THomeTypes = (typeof HomeTypes)[number]
export const ZHomeType = z.enum(HomeTypes)

/**
 * 导出模块类型
 * @账变记录 AccountChange
 * @会员列表 UserList
 * @用户回访 UserVisit
 * @每日用户数据 UserDayData
 * @会员输赢报表 userDayProfit
 * @会员输赢明细 UserDayProfitDetail
 * @平台每日盈亏 PlatformDailyProfit
 * @平台每日盈亏明细 PlatformDailyProfitDetail
 * @已上分三方充值订单 SuccessPayRecord
 * @未上分三方充值订单 BeCompletedPayRecord
 * @三方充值记录 AllPayRecord
 * @已审核出款订单 WithdrawalRecord
 * @代理首页数据 AgencyHomeList
 * @代理首页数据(多级分销) AgencyMultipleHomeList
 * @优惠统计 RewardDiscount
 * @多日用户数据 UserDayDataMulti
 * @人工(提款/存款)记录 manualRechargeRecords
 * @优惠赠送记录 manualRewardRecords
 * @兑换码 RedeemCode
 * @按条件批量导入列表 ConditionBatchUserList
 * @批量导入列表 BatchUserList
 * @月账单 TenantBillDetail
 */
export const ExportModuleTypeEnum = ['AccountChange', 'UserList', 'UserVisit', 'UserDayData', 'userDayProfit', 'UserDayProfitDetail', 'PlatformDailyProfit', 'PlatformDailyProfitDetail', 'SuccessPayRecord', 'BeCompletedPayRecord', 'AllPayRecord', 'WithdrawalRecord', 'AgencyHomeList',
	'AgencyMultipleHomeList', 'RewardDiscount', 'UserDayDataMulti', 'manualRechargeRecords', 'manualRewardRecords', 'RedeemCode', 'ConditionBatchUserList', 'BatchUserList', 'TenantBillDetail'
] as const
export type TExportModuleTypeEnum = (typeof ExportModuleTypeEnum)[number]
export const ZExportModuleTypeEnum = z.enum(['all', ...ExportModuleTypeEnum])

/**
 * 导出状态类型
 * @导出中 Exporting
 * @导出成功 ExportSuccess
 * @导出失败 ExportFail
 */
export const ExportStatusEnum = ['Exporting', 'ExportSuccess', 'ExportFail'] as const
export type TExportStatusEnum = (typeof ExportStatusEnum)[number]
export const ZExportStatusEnum = z.enum(['all', ...ExportStatusEnum])

/**
 * 导出过期时间类型
 * @永久 Forever
 * @小时 Hour
 * @次数 Times
 */
export const ExportExpireTypeEnum = ['Forever', 'Hour', 'Times'] as const
export type TExportExpireTypeEnum = (typeof ExportExpireTypeEnum)[number]
export const ZExportExpireTypeEnum = z.enum([...ExportExpireTypeEnum])

/**
 * 下载身份类型
 * @导出本人 ExportSelf
 * @不限 Limit
 */
export const ExportIdentityTypeEnum = ['ExportSelf', 'Limit'] as const
export type TExportIdentityTypeEnum = (typeof ExportIdentityTypeEnum)[number]
export const ZExportIdentityTypeEnum = z.enum([...ExportIdentityTypeEnum])

/**
 * 保护策略类型
 * @按时间 Time
 * @按盈利 Profit
 */
export const ProtectionPolicyTypeEnum = ['Time', 'Profit'] as const
export type TProtectionPolicyTypeEnum = (typeof ProtectionPolicyTypeEnum)[number]
export const ZProtectionPolicyTypeEnum = z.enum([...ProtectionPolicyTypeEnum])

/**
 * 保护对象
 * @首充用户 FirstRecharge
 */
export const ProtectionTargetTypeEnum = ['FirstRecharge'] as const
export type TProtectionTargetTypeEnum = (typeof ProtectionTargetTypeEnum)[number]
export const ZProtectionTargetTypeEnum = z.enum([...ProtectionTargetTypeEnum])

/**
 * 执行配置方案
 * @默认 Default
 * @特殊1 Special1
 * @特殊2 Special2
 */
export const ExecutePlanTypeEnum = ['Default', 'Special1', 'Special2'] as const
export type TExecutePlanTypeEnum = (typeof ExecutePlanTypeEnum)[number]
export const ZExecutePlanTypeEnum = z.enum([...ExecutePlanTypeEnum])

/**
 * 玩家保护状态类型
 * @进行中 Ongoing
 * @已完成 Completed
 */
export const PlayerProtectionStatusEnum = ['Ongoing', 'Completed'] as const
export type TPlayerProtectionStatusEnum = (typeof PlayerProtectionStatusEnum)[number]
export const ZPlayerProtectionStatusEnum = z.enum([...PlayerProtectionStatusEnum])

/**
 * 盈利类型
 * @盈利金额 ProfitAmount
 * @盈利比例 ProfitRate
 */
export const ProtectProfitTypeEnum = ['ProfitAmount', 'ProfitRate'] as const
export type TProtectProfitTypeEnum = (typeof ProtectProfitTypeEnum)[number]
export const ZProtectProfitTypeEnum = z.enum([...ProtectProfitTypeEnum])

/**
 * 盈利策略结构
 */
export const ProtectProfitSchema = z.array(
	z.object({
		firstRechargeAmount: z.number().default(0),
		profitType: z.enum(ProtectProfitTypeEnum).default('ProfitAmount'),
		profitAmount: z.number().default(0),
	})
)
export type TProtectProfitSchema = z.infer<typeof ProtectProfitSchema>

/**
 * 地区提款配置
 */
export const RegionWithdrawConfigEnum = [
	/**先绑定 */
	'BindFirst',
	/**先提现 */
	'WithdrawFirst'
] as const
export type TRegionWithdrawConfigEnum = (typeof RegionWithdrawConfigEnum)[number]
export const ZRegionWithdrawConfigEnum = z.enum([...RegionWithdrawConfigEnum])

/**
 * 充值循环模式
 */
export const RegionRechargeCycleModeEnum = [
	/** 按照配置循环 */
	'ConfigCycle',
	/** 没有循环 */
	'NoCycle',
] as const
export type TRegionRechargeCycleModeEnum = (typeof RegionRechargeCycleModeEnum)[number]
export const ZRegionRechargeCycleModeEnum = z.enum([...RegionRechargeCycleModeEnum])

/*
 * 短信供应商
 */
export const SMSMap = {
	/** 畅亿云 */
	ChangYiYun: {
		name: '畅亿云',
		code: 'ChangYiYun',
		url: 'http://101.44.162.101:9090',
		defaultTemplate: 'Your verification code is {code}. Please enter it within 10 minutes.',
		params: ['appId', 'appKey', 'secret'],
	},
	/** TexcellSMS Group */
	TexcellSMS: {
		name: 'TexcellSMS',
		code: 'TexcellSMS',
		url: 'http://61.244.118.70:20003',
		defaultTemplate: 'Your verification code is {code}. Please enter it within 10 minutes.',
		params: ['appId', 'secret'],
	},
	/** Maco */
	Maco: {
		name: 'Maco',
		code: 'Maco',
		url: 'http://47.242.85.7:9090',
		defaultTemplate: 'Your verification code is {code}. Please enter it within 10 minutes.',
		params: ['appId', 'appKey', 'secret'],
	},
	/** Itniotech */
	Itniotech: {
		name: 'Itniotech',
		code: 'Itniotech',
		url: 'https://api.itniotech.com',
		defaultTemplate: 'Your verification code is {code}. Please enter it within 10 minutes.',
		params: ['appKey', 'secret', 'appId'],
	},
} as const satisfies Record<string, {
	// 名称
	name: string
	// Code
	code: string
	// URL
	url: string
	// 默认短信模版
	defaultTemplate: string
	// 需要参数
	params: string[]
}>

export type TSMSType = keyof typeof SMSMap
export const TSMSTypes = typeObjectKeys(SMSMap)
export const ZTSMSTypes = z.enum(TSMSTypes)

/**设置提现密码校验类型 */
export const ZWithdrawPWAuthType = z.enum(['NONE', 'LOGIN_PASSWORD', 'PHONE', 'EMAIL'])


/**
 *  banenr 类型
 */
export const BannerTypes = [
	/** 大厅推荐 */
	'lobby_banner',
	/** 轮播图 */
	'lobby_carousel',
	/** 侧边栏推荐 */
	'lobby_sidebar_banner',
] as const

export type TBannerTypes = (typeof BannerTypes)[number]

/**
 * 目标类型
 */
export const TargetTypes = [
	/** 不跳转 */
	'none',
	/** 内部链接 */
	'internal',
	/** 外部链接 */
	'external',
] as const

export type TTargetTypes = (typeof TargetTypes)[number]
export const ZTargetTypes = z.enum(TargetTypes)

/*
 * 批量 状态
 */
export const TargetValueList = [
	/** 活动 */
	'activity',
	/** 充值 */
	'recharge',
	/** 提现 */
	'withdraw',
	/** 推广 */
	'promotion',
	/** 活动列表页 */
	'activity_list',
	/** VIP */
	'vip',
	/** 兑换码 */
	'redeem_code',
	/** 首页 */
	'home',
	/** 游戏 */
	'game',
] as const

export type TTargetValueList = (typeof TargetValueList)[number]
export const ZTargetValueList = z.enum(TargetValueList)


/**
 * 用户关注类型
 */
export const UserFollowTypeEnum = ['auditAnomaly'] as const
export type TUserFollowTypeEnum = (typeof UserFollowTypeEnum)[number]
export const ZUserFollowTypeEnum = z.enum(UserFollowTypeEnum)

/**
 * 自动代付其他免审条件
 */
export const AutoPayOtherConditions = [
	//充提差额大于0的会员才免审核
	'MembersWithPositiveDepositWithdrawalDifference',
	//恶意刷稽核未处理的会员继续审核
	'MembersWithUnresolvedMaliciousAudits',
	//近3天有系统解除稽核的会员必须审核
	'MembersWithAuditReliefInLast3Days',
	//历史累计亏损会员才免审核
	'MembersWithCumulativeLosses',
	//已完成首充会员才免审
	'MembersWhoCompletedFirstDeposit',
	//代理活动领取后提现必须审核
	'AgentWithdrawalsReviewed',
	/**代理活动领取后只审核一次 */
	'AgentWithdrawalsReviewedOnce',

] as const
export type TAutoPayOtherConditions = (typeof AutoPayOtherConditions)[number]
export const ZAutoPayOtherConditions = z.enum(AutoPayOtherConditions)
//==========================================================================================================
// 动态奖池配置定义

/**
 * 浮动方式
 */
export const RandomTypes = [
	/** 只增不减 */
	'add',
	/** 只减不增 */
	'reduce',
	/** 增减随机 */
	'random',
] as const

export type TRandomType = (typeof RandomTypes)[number]
export const ZRandomTypes = z.enum(RandomTypes)


//=======================================================================================================================
// 目标值

/** 活动 */
export const ActivitySelect = z.object({
	type: z.literal(ZTargetValueList.enum.activity),
	info: z.object({
		/** 活动名 */
		activityName: z.string(),
		/** 活动ID */
		activityId: z.number(),
		/** 活动类型 */
		activityType: z.string().optional(),
	}),
})

/** 充值 */
export const RechargeSelect = z.object({
	type: z.literal(ZTargetValueList.enum.recharge),
	info: z.string().default('/main/entrar'),
})

/** 体现 */
export const WithdrawSelect = z.object({
	type: z.literal(ZTargetValueList.enum.withdraw),
	info: z.string().default('/main/withdraw'),
})

/** 推广 */
export const PromotionSelect = z.object({
	type: z.literal(ZTargetValueList.enum.promotion),
	info: z.string().default('/spread'),
})

/** 活动列表页 */
export const ActivityListSelect = z.object({
	type: z.literal(ZTargetValueList.enum.activity_list),
	info: z.string().default('/main/promo'),
})

/** VIP */
export const VipSelect = z.object({
	type: z.literal(ZTargetValueList.enum.vip),
	info: z.string().default('/activity/vip'),
})

/** 兑换码 */
export const RedeemCodeSelect = z.object({
	type: z.literal(ZTargetValueList.enum.redeem_code),
	info: z.string().default('/Redeem'),
})

/** 首页 */
export const HomeSelect = z.object({
	type: z.literal(ZTargetValueList.enum.home),
	info: z.string().default('/'),
})


export const TargetValueSelectSchema = z.discriminatedUnion('type', [
	ActivitySelect,
	RechargeSelect,
	WithdrawSelect,
	PromotionSelect,
	ActivityListSelect,
	VipSelect,
	RedeemCodeSelect,
	HomeSelect,
])

export const TargetSelectSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal(ZTargetTypes.enum.none),
		targetValue: z.string().default(''),
	}),
	z.object({
		type: z.literal(ZTargetTypes.enum.external),
		targetValue: z.string(),
	}),
	z.object({
		type: z.literal(ZTargetTypes.enum.internal),
		targetValue: TargetValueSelectSchema,
	}),
])


/**
 * 动态奖池配置定义
 */
export const DynamicPrizePoolConfigSchema = z.object({
	/** 奖池开关 */
	switch: z.boolean().default(false).describe('奖池开关'),
	/** 每日重置初始值 最小值 */
	initValueMinByDay: z.number().default(0).describe('每日重置初始值 最小值'),
	/** 每日重置初始值 最大值 */
	initValueMaxByDay: z.number().default(0).describe('每日重置初始值 最大值'),
	/** 浮动方式 */
	randomType: z.enum(RandomTypes).default('add').describe('浮动方式'),
	/** 每次浮动值 最小值*/
	randomValueMin: z.number().default(0).describe('每次浮动值 最小值'),
	/** 每次浮动值 最大值*/
	randomValueMax: z.number().default(0).describe('每次浮动值 最大值'),
	/** 每次浮动间隔时间 */
	// randomInterval: z.number().default(0).describe('每日重置初始值 间隔时间 单位是：分钟'),
	/** 背景底图 */
	background: z.string().default('').describe('背景底图'),
	/** 预览文本 */
	previewText: z.string().default('').describe('预览文本'),
	/** 跳转目标 */
	target: TargetSelectSchema.default(TargetSelectSchema.parse({ type: 'internal', targetValue: { type: 'redeem_code', info: '/Redeem' } })).describe('跳转目标'),
})

export type TDynamicPrizePoolConfig = z.infer<typeof DynamicPrizePoolConfigSchema>


/**
 * 用户排行榜配置
 */
export const UserRankConfigSchema = z.object({
	/** 排行榜开关 */
	switch: z.boolean().default(false).describe('排行榜开关'),
	/** 排行榜类型 投注金额 佣金金额 游戏盈利 获得奖金 */
	rankType: z.enum(['bet', 'commission', 'profit', 'bonus']).default('bet').describe('排行榜类型'),
	/** 展示条数 */
	showCount: z.number().default(10).describe('展示条数'),
	/** 排行榜时间 日 周 月 */
	rankTime: z.enum(['day', 'week', 'month']).default('day').describe('排行榜时间'),
	/** 初始值金额 最小值 */
	initValueMin: z.number().default(0).describe('初始值金额 最小值'),
	/** 初始值金额 最大值 */
	initValueMax: z.number().default(0).describe('初始值金额 最大值'),
	/** 每次浮动值 最小值*/
	randomValueMin: z.number().default(0).describe('每次浮动值 最小值'),
	/** 每次浮动值 最大值*/
	randomValueMax: z.number().default(0).describe('每次浮动值 最大值'),
})

export type TUserRankConfig = z.infer<typeof UserRankConfigSchema>




/**
 * 分控类型
 */
export const RiskTypesEnum = [
	/** 恶意刷稽核 */
	'MaliciousAudit',
] as const
export type TRiskTypesEnum = (typeof RiskTypesEnum)[number]
export const ZRiskTypesEnum = z.enum(RiskTypesEnum)


/**
 * 风控状态
 */
export const RiskStatusEnum = [
	/** 风控中 */
	'RiskControl',
	/** 解除 */
	'Release',
] as const
export type TRiskStatusEnum = (typeof RiskStatusEnum)[number]
export const ZRiskStatusEnum = z.enum(RiskStatusEnum)
/**
 * 事件状态
 */
export const EventStatusEnum = [
	/**
	 * 进入队列
	 */
	'Queued',
	/**
	 * 运行中
	 */
	'Running',
	/**
	 * 取消
	 */
	'Cancelled',
	/**
	 * 已完成
	 */
	'Completed',
	/**
	 * 等待重试
	 */
	'WaitingRetry',
	/**
	 * 失败
	 */
	'Failed',
] as const
export type TEventStatusEnum = (typeof EventStatusEnum)[number]
export const StepStatusEnum = EventStatusEnum
export type TStepStatusEnum = (typeof StepStatusEnum)[number]


/**
 * 马甲包类型
 */
export const AppTypeEnum = [
	/** APK */
	'APK',
] as const
export type TAppTypeEnum = (typeof AppTypeEnum)[number]
export const ZAppTypeEnum = z.enum(AppTypeEnum)
/**
 * 打包进度
 */
export const BuildProgressEnum = [
	/** 未打包 */
	'UnPackaged',
	/** 打包中 */
	'Packaging',
	/** 打包完成 */
	'Packaged',
	/** 打包失败 */
	'PackagingFailed',
] as const
export type TBuildProgressEnum = (typeof BuildProgressEnum)[number]
export const ZBuildProgressEnum = z.enum(BuildProgressEnum)

/**
 * 打包配置
 */
export const BuildConfigSchema = z.object({
	/** 封装的域名列表 */
	domainList: z.array(z.string()).default([]).describe('封装的域名列表'),
	/** 域名参数 */
	domainParams: z.string().default('').describe('域名参数'),
	/** app名称 */
	appName: z.string().describe('app名称'),
	/** 包名 */
	packageName: z.string().describe('包名'),
	/** app图标 */
	appIcon: z.string().describe('app图标'),
	/** app启动图 */
	appSplash: z.string().describe('app启动图'),
	/** apppush appkey */
	appPushAppKey: z.string().default('').describe('apppush appkey'),
	/**google服务配置文件*/
	googleServiceConfig: z.string().default('').describe('google服务配置文件'),
})
export type TBuildConfigSchema = z.infer<typeof BuildConfigSchema>

/**
 * 代付小类code
 */
export const WithdrawTypeSubCodeEnumNew = [...BRWithdrawTypeCodeEnum, ...BankCodeEnum, ...WalletCodes] as const
export type TWithdrawTypeSubCodeEnumNew = (typeof WithdrawTypeSubCodeEnumNew)[number]
export const ZWithdrawTypeSubCodeEnumNew = z.enum(WithdrawTypeSubCodeEnumNew)


/**
 * 对照code 小类的code 加上 实名的‘real_name’
 */
export const WithdrawalInfoCodes = ['REALNAME', ...WithdrawTypeSubCodeEnumNew] as const
export type TWithdrawalInfoCodes = (typeof WithdrawalInfoCodes)[number]
export const ZWithdrawalInfoCodes = z.enum(WithdrawalInfoCodes)

/**
 * valueType 值类型
 */
export const WithdrawalInfoValueTypes = ['REALNAME', 'IFSC', 'BANKACCOUNT', ...BRWithdrawTypeCodeEnum] as const
export type TWithdrawalInfoValueTypes = (typeof WithdrawalInfoValueTypes)[number]
export const ZWithdrawalInfoValueTypes = z.enum(WithdrawalInfoValueTypes)


/**
 * 任务类型
 */
export const TaskTypeEnum = {
	/** 新人任务 */
	NewbieTask: [
		/** 安装APP */
		'InstallAPK',
		/**注册账号 */
		'RegisterAccount',
		/**安装pwa */
		'InstallPWA',
		/**绑定cpf */
		'BindCPF',
		/**设置资产密码 */
		'SetAssetsPassword',
		/**绑定手机 */
		'BindPhone',
		/**绑定邮箱 */
		'BindEmail',
		/**首次提现 */
		'FirstWithdrawal',
		/**首次充值 */
		'FirstRecharge',
	] as const,
	/** 每日任务 */
	DailyTask: [
	] as const,
} as const

export type TTaskTypeEnum = typeof TaskTypeEnum

export type TaskTypeEnumType = keyof typeof TaskTypeEnum

export const TaskTypeEnumTypes = typeObjectKeys(TaskTypeEnum)
export const ZTaskTypeEnumType = z.enum(TaskTypeEnumTypes)

export type TaskTypeEnumSubMap = {
	[K in keyof TTaskTypeEnum]: `${K}:${TTaskTypeEnum[K][number]}`
}[keyof TTaskTypeEnum]

export const TaskTypeEnumSubMaps: [TaskTypeEnumSubMap, ...TaskTypeEnumSubMap[]] = typeObjectKeys(
	TaskTypeEnum,
).flatMap((item: TaskTypeEnumType) => TaskTypeEnum[item].map((subItem) => `${item}:${subItem}`)) as [
		TaskTypeEnumSubMap,
		...TaskTypeEnumSubMap[],
	]
export const ZTaskTypeEnumSubMap = z.enum(TaskTypeEnumSubMaps)

export const DomainStatusEnum = [
	/** 可用 */
	'Available',
	/** 不可用 */
	'Unavailable',
	/** 未检测 */
	'UnChecked',
] as const
export type TDomainStatusEnum = (typeof DomainStatusEnum)[number]
export const ZDomainStatusEnum = z.enum(DomainStatusEnum)

/**
 * ExportOssJob导出状态类型
 * @导出中 Exporting
 * @导出成功 ExportSuccess
 * @导出失败 ExportFail
 * @导出取消 ExportCancel
 * @写入完成 WritingCompleted
 */
export const ExportOssJobStatusEnum = ['Exporting', 'ExportSuccess', 'ExportFail', 'DataImportFail', 'CancelDataImport', 'WritingCompleted'] as const
export type TExportOssJobStatusEnum = (typeof ExportOssJobStatusEnum)[number]
export const ZExportOssJobStatusEnum = z.enum(['all', ...ExportOssJobStatusEnum])

/**
 * 返奖率策略类型
 * 投注分段
 * 玩家层级
 */
export const ReturnRateStrategyTypeEnum = ['BET_SEGMENT', 'USER_LEVEL'] as const
export type TReturnRateStrategyTypeEnum = (typeof ReturnRateStrategyTypeEnum)[number]
export const ZReturnRateStrategyTypeEnum = z.enum(ReturnRateStrategyTypeEnum)
export const RequestStatusEnum = [
	/** 成功 */
	'SUCCESS',
	/** 失败 */
	'FAIL',
	/** 错误 */
	'ERROR',
] as const
export type TRequestStatusEnum = (typeof RequestStatusEnum)[number]
export const ZRequestStatusEnum = z.enum(RequestStatusEnum)

/**
 * cpf验证请求类型
 */
export const RequestTypeEnum = ['THREE', 'LOCAL'] as const
export type TRequestTypeEnum = (typeof RequestTypeEnum)[number]
export const ZRequestTypeEnum = z.enum(RequestTypeEnum)


/**
 * 资金帐变类型映射表
 */
export const VirtualRewardTypeMap = {
	/** 注册 */
	register: [
		/** 奖励 */
		'reward',
	] as const,
	/** 活动优惠 */
	activity: [
		/** 充值大酬宾 */
		'rechargePromotion',
		/** 新人专属 */
		'newUserExclusive',
	] as const,
	/** ip */
	bet: [
		/** 赢 */
		'win',
		/** 输 */
		'lose',

	] as const,
} as const

type TVirtualRewardTypeMap = typeof VirtualRewardTypeMap

export type VirtualRewardType = keyof typeof VirtualRewardTypeMap
export const VirtualRewardTypes = typeObjectKeys(VirtualRewardTypeMap)

export type VirtualRewardSubType = {
	[K in keyof TVirtualRewardTypeMap]: `${K}:${TVirtualRewardTypeMap[K][number]}`
}[keyof TVirtualRewardTypeMap]

export const VirtualRewardSubTypes: [VirtualRewardSubType, ...VirtualRewardSubType[]] = typeObjectKeys(
	VirtualRewardTypeMap,
).flatMap((item: VirtualRewardType) => VirtualRewardTypeMap[item].map((subItem) => `${item}:${subItem}`)) as [
		VirtualRewardSubType,
		...VirtualRewardSubType[],
	]

export const ReturnRateStrategyTypeEnumMap = {
	[ReturnRateStrategyTypeEnum[0]]: '投注分段策略',
	[ReturnRateStrategyTypeEnum[1]]: '会员层级策略',
} as const;

/**
 * 冻结金额状态
 */
export const PendingBonusStatusEnum = [
	/** 冻结 */
	'PENDING',
	/** 解冻 */
	'UNLOCKED',
] as const
export type TPendingBonusStatusEnum = (typeof PendingBonusStatusEnum)[number]
export const ZPendingBonusStatusEnum = z.enum(PendingBonusStatusEnum)

/**
 * 解冻方式
 */
export const PendingBonusUnlockTypeEnum = [
	/** 充值 */
	'RECHARGE'
] as const
export type TPendingBonusUnlockTypeEnum = (typeof PendingBonusUnlockTypeEnum)[number]
export const ZPendingBonusUnlockTypeEnum = z.enum(PendingBonusUnlockTypeEnum)

export const ChannelRetentionParentType = [
	/** 直推 */
	'direct',
	/** 裂变 */
	'split',
	/** 无 */
	'none',
] as const
export type TChannelRetentionParentType = (typeof ChannelRetentionParentType)[number]
export const ZChannelRetentionParentType = z.enum(ChannelRetentionParentType)
/**
 * 替换类型
 * 安装包
 * 安装引导
 */
export const CopyFrontConfigTypeEnum = [
	/** 安装包 */
	'install_package',
	/** 安装引导 */
	'install_guide',
] as const
export type TCopyFrontConfigTypeEnum = (typeof CopyFrontConfigTypeEnum)[number]
export const ZCopyFrontConfigTypeEnum = z.enum(CopyFrontConfigTypeEnum)

/**
 * 引导安装替换类型
 * 不变
 * 全部关闭
 * 全部开启
 */
export const GuideInstallTypeEnum = [
	/** 不变 */
	'no_change',
	/** 全部关闭 */
	'all_close',
	/** 全部开启 */
	'all_open',
] as const
export type TGuideInstallTypeEnum = (typeof GuideInstallTypeEnum)[number]
	/*
 * 游戏记录 状态
 */
export const GameRecordTipStatusList = [
	/** 正常 */
	'NORMAL',
	/** 撤销 */
	'CANCEL',
] as const
export type GameRecordTipStatus = (typeof GameRecordTipStatusList)[number]
export const ZGameRecordTipStatus = z.enum(['ALL', ...GameRecordTipStatusList])

/**
 * ios地址类型
 */
export const IosAddressTypeEnum = ['normal', 'onelink'] as const
export type TIosAddressTypeEnum = (typeof IosAddressTypeEnum)[number]
export const ZIosAddressTypeEnum = z.enum(IosAddressTypeEnum)

export const UserTagEnum = ['Pay', 'IPUserLimit', 'UserIPLimit', 'SameRequestLimit', 'RequestLimit', 'NoTag'] as const
export type TUserTagEnum = (typeof UserTagEnum)[number]
