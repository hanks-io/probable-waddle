import * as z from 'zod'
import {
	AgencyMode,
	CommissionType,
	JumpType,
	RegisterRequireSchema,
	RegisterType,
	type TAllGameTypes,
	PointTypeEnum,
	FrontConfigSchema,
	PaymentPartnerTypeEnum,
	ExportExpireTypeEnum,
	ExportIdentityTypeEnum,
	AchievementType,
	InstallSendMoneyTypeEnum,
	DynamicPrizePoolConfigSchema,
	ZRegionRechargeCycleModeEnum,
	GameLogoStyleList,
	HomeTypes,
	UserRankConfigSchema,
} from '../types'
import { AmountTypes, SwitchTypes } from './activity.type'
import { RegisterRewardAwardTypes } from './activity.type'

/**
 * 配置类型
 */
export const ConfigType = ['Default', 'Custom'] as const
export const ZConfigType = z.enum(ConfigType)

/**
 * 商户配置分类
 */
export const TenantConfigCategoryList = [
	/** 充值配置 */
	'PAYMENT',
	/** 系统配置 */
	'SYSTEM',
	/** 提现配置 */
	'WITHDRAW',
	/** 登陆注册 */
	'LOGIN',
	/** 代理 */
	'AGENCY',
	/** 活动 */
	'ACTIVITY',
	/** 渠道 */
	'CHANNEL',
	/**兑换码 */
	'REDEEMCODE',
	/** 测试商户 */
	'TEST',
	/** 导出设置 */
	'EXPORT',
	/** 代理设置 */
	'AGENCY_SETTINGS',
	/** 代理排行榜设置 */
	'AGENCY_RANK',
	/** 查询条件 */
	'QUERY_CONDITION',
	/** 地区配置 */
	'REGION',
	/**任务配置 */
	'NewbieTask',
	/** 注册奖励配置 */
	'REGISTER_REWARD',
	/** 域名配置 */
	'DOMAIN',
	/** 公告配置 */
	'ANNOUNCEMENT',
	/** 安全配置 */
	'SECURITY',
	/** 公司配置 */
	'COMPANY',
] as const

export type TenantConfigCategory = (typeof TenantConfigCategoryList)[number]
export const ZTenantConfigCategory = z.enum([...TenantConfigCategoryList])

/**
 * pwa安装类型
 */
export const PwaInstallType = ['own', 'thirdParty'] as const
export type PwaInstallType = (typeof PwaInstallType)[number]
export const ZPwaInstallType = z.enum(PwaInstallType)

type OmitCategory<T> = {
	[K in keyof T as Exclude<K, 'category'>]: T[K]
}

const NewRegisterType = ['Account', 'Phone', 'Google'] as const
/**
 * 货币符号类型
 * 法币 游戏币
 */
const CurrencySymbolType = ['fiat', 'game'] as const

/**
 * 地区配置
 */
export const ZTenantRegionConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.REGION),
	/** 是否开启手机短信 */
	smsSwitch: z.boolean().default(false).describe('是否开启手机短信'),
	/** 注册方式, 多选, 账号, 手机, 谷歌  */
	registerType: z
		.array(z.enum(NewRegisterType))
		.default(['Phone', 'Google'])
		.describe('注册方式, 多选, 账号, 手机, 谷歌'),
	/**cpf校验AccessToken*/
	cpfAccessToken: z
		.string()
		.default(
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVFlTLlBVQkxJQEdNQUlMLkNPTSIsImp0aSI6ImJkMTg3NzcwLTJjOTktNGZiZi1iYTEwLTM3NjA4MjdlMTFjMCIsIm5hbWVVc2VyIjoiSm9zZSBSZWdpbmFsZG8gRG9zIFNhbnRvcyBTaWx2YSBKdW5pb3IiLCJ1bmlxdWVfbmFtZSI6IlRZUy5QVUJMSUBHTUFJTC5DT00iLCJkb21haW4iOiJUWVMgQUdFTkNJQSBERSBQVUJMSUNJREFERSIsInByb2R1Y3RzIjpbIkJJR0JPT1NUIiwiQklHSUQiXSwibmJmIjoxNzM3Mzg0OTg0LCJleHAiOjE3Njg5MjA5ODQsImlhdCI6MTczNzM4NDk4NCwiaXNzIjoiQmlnIERhdGEgQ29ycC4ifQ.zE-dVziT2QE2AAlrDfajfQWdRDUidWb5dwA6_9_kUjk',
		)
		.describe('cpf校验AccessToken'),
	/**cpf校验TokenId */
	cpfTokenId: z.string().default('678e6418271448f8adac919b').describe('cpf校验TokenId'),
	/**cpf校验单次收费 */
	cpfSingleFee: z.number().default(0).describe('cpf校验单次收费'),
	/** 充值模式 */
	rechargeMode: ZRegionRechargeCycleModeEnum.default('ConfigCycle').describe('充值模式'),
	/** 货币符号 */
	currencySymbol: z.enum(CurrencySymbolType).default('fiat').describe('货币符号'),
})

type ZTenantRegionConfigType = z.infer<typeof ZTenantRegionConfig>
export type TenantRegionConfigKeys = keyof OmitCategory<ZTenantRegionConfigType>

export const ZTenantRegionConfigKeys = Object.keys(ZTenantRegionConfig.shape).filter((key) => key !== 'category')

export const ZTenantRegionConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.REGION),
	key: z.enum(ZTenantRegionConfigKeys as [TenantRegionConfigKeys, ...TenantRegionConfigKeys[]]).optional(),
})

/**
 * 商户系统配置
 */

export const ZTenantSystemConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.SYSTEM),
	/** 网站名称 */
	siteName: z.string().default('apple').describe('网站名称'),
	/** 网站Logo */
	siteLogo: z
		.string()
		.url()
		.default('https://uploads4sys.po7.xyz/websiteConfig/default_logo.png')
		.describe('网站Logo'),
	/** 商户登录白名单 */
	tenantLoginWhiteList: z.string().default('').describe('商户登录白名单'),
	appIcon: z
		.string()
		.url()
		.default('https://uploads4sys.po7.xyz/websiteConfig/default_app_icon.png')
		.describe('APP图标'),
	//
	trialPlay: z.boolean().default(false).describe('试玩开关'),
	trialPlayAmount: z.number().default(0).describe('试玩金额'),
	trialPlayLimit: z.string().default('{}').describe('试玩限制'),
	trialPlayDesktopAmount: z.number().default(0).describe('试玩用户保存桌面新增试玩金额 0表示不新增'),
	trialPlayWithdrawHint: z.enum(['1', '2']).default('1').describe('试玩提现提示'),
	//
	onlineService: z.boolean().default(false).describe('在线客服开关'),
	paymentPartnerType: z.enum(PaymentPartnerTypeEnum).default('Default').describe('充值合作伙伴类型'),
	paymentPartnerPic: z.string().default('').describe('充值合作伙伴图片'),

	/** 是否开启SEO */
	isSeo: z.boolean().default(true).describe('是否开启SEO'),
	/** SEO网站名称 */
	seoSiteName: z.string().default('').describe('SEO网站名称'),
	/** SEO网站简介 */
	seoSiteDesc: z.string().default('').describe('SEO网站简介'),
	/** SEO网站logo */
	seoLogo: z.string().default('').describe('SEO网站logo'),
	/**商户底部文本 */
	footerText: z.string().default('').describe('商户底部文本'),

	/**是否需要指纹验证 */
	fpSwitch: z.boolean().default(false).describe('是否开启指纹验证'),

	/** app语言配置 */
	appLanguage: z.array(z.string()).default(['en-US']).describe('app语言配置'),
	/** aap端默认语言配置 */
	appDefaultLanguage: z.string().default('en-US').describe('aap端默认语言配置'),
	/** jpush 类型 */
	jpushType: z
		.string()
		.default(JSON.stringify(['web']))
		.describe('jpush 类型'),
	/**jpush appKey */
	jpushAppKey: z.string().default('').describe('jpush appKey'),
	/**jpush masterSecret */
	jpushMasterSecret: z.string().default('8438557192b2f541757a2c4a').describe('jpush masterSecret'),
	/**jpush appappKey */
	jpushAppAppKey: z.string().default('bd6cf3a525a61e19bc6f2b92').describe('jpush appappKey'),
	/**jpush appSecret */
	jpushAppMasterSecret: z.string().default('8438557192b2f541757a2c4a').describe('jpush appSecret'),
	/**jpush apkName*/
	jpushApkName: z.string().default('').describe('安卓应用包名'),
	/**jpush openNoticeTextType*/
	openNoticeTextType: z.enum(ConfigType).default(ZConfigType.enum.Default).describe('web推送引导授权文案类型'),
	/**jpush openNoticeText*/
	openNoticeText: z.string().default('').describe('web推送引导授权文案'),
	/**google服务配置文件*/
	googleServiceConfig: z.string().default('').describe('google服务配置文件'),

	/** 游戏排序规则 投注量 投注人数 默认 */
	gameSortRule: z.enum(['bet', 'betUser', 'default']).default('default').describe('游戏排序规则'),
	/** 热门游戏排序规则 投注量 投注人数 默认 */
	hotGameSortRule: z.enum(['bet', 'betUser', 'default']).default('default').describe('热门游戏排序规则'),
	/** pwa安装类型 */
	pwaInstallType: z.enum(PwaInstallType).default(ZPwaInstallType.enum.own).describe('pwa安装类型'),
	/** 报表时间查询范围 */
	reportTimeRange: z.number().default(1).describe('报表时间查询范围'),
	/** 游戏合作伙伴图片类型 */
	gamePartnerPicType: z.enum(['Default', 'Custom']).default('Default').describe('游戏合作伙伴图片类型'),
	/** 游戏合作伙伴图片 */
	gamePartnerPic: z.string().default('').describe('游戏合作伙伴图片'),
	/** 动态奖池配置 */
	dynamicPrizePool: z
		.string()
		.default(JSON.stringify(DynamicPrizePoolConfigSchema.parse({})))
		.describe('动态奖池配置'),
	/** pgVerify 认证 */
	pgVerify: z.enum(['on', 'off']).default('off').describe('pgVerify 认证'),
	/** 纸飞机通知群ID */
	telegramChatId: z.string().default('').describe('纸飞机通知群ID'),
	/** 商户风控提示音开关 */
	riskControlSoundSwitch: z.enum(['OFF', 'ON']).default('OFF').describe('商户风控提示音开关'),
	/** 是否开启下载页跳转防封谷歌页 */
	isOpenDownloadPageJump: z.boolean().default(false).describe('是否开启下载页跳转防封谷歌页'),
	/** 是否开启下载页跳转防封苹果页 */
	isOpenDownloadPageJumpForIos: z.boolean().default(false).describe('是否开启下载页跳转防封苹果页'),
	/** 侧边栏banner样式 */
	sidebarBannerStyle: z.enum(['style1', 'style2']).default('style2').describe('侧边栏banner样式'),
	/** 游戏logo样式 */
	gameLogoStyle: z.enum(GameLogoStyleList).default('style1').describe('游戏logo样式'),
	/** 首页视频开关 */
	homeVideoSwitch: z.enum(['OFF', 'ON']).default('OFF').describe('首页视频开关'),
	/** 首页视频地址 */
	homeVideoUrl: z.string().default('').describe('首页视频地址'),
	/** 首页导航栏类型 */
	homeNavType: z.enum(HomeTypes).default('GameType').describe('首页导航栏类型'),
	/** 用户排行榜 */
	userRankConfig: z
		.string()
		.default(JSON.stringify(UserRankConfigSchema.parse({})))
		.describe('用户排行榜配置'),
})

type ZTenantSystemConfigType = z.infer<typeof ZTenantSystemConfig>
export type TenantSystemConfigKeys = keyof OmitCategory<ZTenantSystemConfigType>

export const ZTenantSystemConfigKeys = Object.keys(ZTenantSystemConfig.shape).filter((key) => key !== 'category')

export const ZTenantSystemConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.SYSTEM),
	key: z.enum(ZTenantSystemConfigKeys as [TenantSystemConfigKeys, ...TenantSystemConfigKeys[]]).optional(),
})

/**
 * 商户充值配置
 */
export const ZTenantPaymentConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.PAYMENT),
	paymentSwitch: z.boolean().default(true).describe('充值开关'),
	callbackFloatAmount: z.number().default(100).describe('浮动金额,单位:分'),
	threeMaxUnpaidOrder: z.number().default(1000).describe('三方充值最多允许同时存在未支付的订单数'),
	transferMaxUnpaidOrder: z.number().default(1000).describe('线下转账最多允许同时存在未支付的订单数'),
	transferOrderExpireTime: z
		.number()
		.default(60 * 60)
		.describe('转账订单过期时间，(单位：秒)'),
	channelSwitchInterval: z.number().default(1).describe('支付通道切换间隔'),
	channelSortTime: z
		.number()
		.default(60 * 60)
		.describe('支付通道定时排序时间，(单位：秒)'),
	newChannelSwitchInterval: z.number().default(5).describe('新支付通道切换间隔'),
	testAccountId: z.string().default('').describe('测试账号ID，使用json数组，比如：[2121,3434]'),
	// 是否显示转账凭证
	showTransferVoucher: z.enum(['OFF', 'ON']).default('OFF').describe('是否显示转账凭证'),
	// 是否显示付款人姓名
	showTransferName: z.enum(['OFF', 'ON']).default('OFF').describe('是否显示付款人姓名'),
	// 付款人姓名是否必填
	transferNameRequired: z.enum(['OFF', 'ON']).default('OFF').describe('付款人姓名是否必填'),
	// 是否开启渠道优惠
	channelDiscountSwitch: z.enum(['OFF', 'ON']).default('OFF').describe('是否开启渠道优惠'),
})

type ZTenantPaymentConfigType = z.infer<typeof ZTenantPaymentConfig>
export type TenantPaymentConfigKeys = keyof OmitCategory<ZTenantPaymentConfigType>

export const ZTenantPaymentConfigKeys = Object.keys(ZTenantPaymentConfig.shape).filter((key) => key !== 'category')

export const ZTenantPaymentConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.PAYMENT),
	key: z.enum(ZTenantPaymentConfigKeys as [TenantPaymentConfigKeys, ...TenantPaymentConfigKeys[]]).optional(),
})

/**
 * 商户提现配置
 */

export const ZTenantWithdrawConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.WITHDRAW),
	withdrawSwitch: z.boolean().default(false).describe('提现开关'),
	rechargeMultiple: z.number().default(2).describe('充值重现所需打码倍数'),
	rewardMultiple: z.number().default(2).describe('奖金所需打码倍数'),
	autoWithdrawalSwitch: z.boolean().default(false).describe('自动提现开关'),
	autoWithdrawalAmountMix: z.number().default(0).describe('自动提现金额最小值'),
	autoWithdrawalAmountMax: z.number().default(0).describe('自动提现金额最大值'),
	autoWithdrawalChannel: z.string().default('[]').describe('自动代付渠道，渠道id用,数组格式'),
	//稽核自动解除值
	auditAutoRelieve: z.number().default(500).describe('稽核自动解除值'),
	//稽核游戏限制
	auditGameLimit: z.string().default('{}').describe('稽核游戏限制'),
	//代付失败自动拒绝开关
	autoRefuseSwitch: z.enum(['OFF', 'ON']).default('ON').describe('代付失败自动拒绝开关'),

	/**首次提款限制开关 */
	autoWithdrawalLimitSwitch: z.enum(['OFF', 'ON']).default('ON').describe('首次提款限制开关'),
	/**首次提款限制类型 */
	autoWithdrawalLimitType: z.enum(['validBet', 'firstWithdraw']).default('validBet').describe('首次提款限制类型'),
	/**首次提款限制金额 */
	autoWithdrawalLimitAmount: z.number().default(0).describe('首次提款限制金额'),
	/**免审会员层级 */
	autoWithdrawalLimitLevel: z.string().default('[]').describe('免审会员层级'),
	/**免审会员注册时长 */
	autoWithdrawLimitRegTime: z
		.enum(['noLimit', '1Day', '3Days', '7Days', '30Days'])
		.default('noLimit')
		.describe('免审会员注册时长'),
	/**其他免审条件 */
	autoWithdrawLimitOther: z.string().default('[]').describe('其他免审条件'),
	/**自动轮询开关 */
	autoWithdrawalPollingSwitch: z.enum(['OFF', 'ON']).default('ON').describe('自动轮询开关'),

	/**成功率选项 */
	successRateType: z.enum(['Number', 'History']).default('Number').describe('成功率选项'),
	/**接单量 */
	orderVolume: z.number().default(0).describe('接单量'),
	/**成功率低于这个值下架 。 */
	minSuccessRate: z.number().default(80).describe('成功率低于这个值下架'),
	/**稽核自动解除方式 充值后解除，立即解除 */
	auditAutoRelieveType: z.enum(['recharge', 'immediately']).default('recharge').describe('稽核自动解除方式'),
})

export type ZTenantWithdrawConfigType = z.infer<typeof ZTenantWithdrawConfig>
export type TenantWithdrawConfigKeys = keyof OmitCategory<ZTenantWithdrawConfigType>

export const ZTenantWithdrawConfigKeys = Object.keys(ZTenantWithdrawConfig.shape).filter((key) => key !== 'category')

export const ZTenantWithdrawConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.WITHDRAW),
	key: z.enum(ZTenantWithdrawConfigKeys as [TenantWithdrawConfigKeys, ...TenantWithdrawConfigKeys[]]).optional(),
})
export interface WithdrawalConfigListResponse {
	withdrawSwitch: boolean
	rechargeMultiple: number
	rewardMultiple: number
	autoWithdrawalSwitch: boolean
	autoWithdrawalAmountMix: number
	autoWithdrawalAmountMax: number
	autoWithdrawalChannel: string
}

/**
 * 商户登陆配置
 */
export const ZTenantLoginConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.LOGIN),
	/** 注册方式 */
	registerTypes: z.array(RegisterType).default(['Phone']).describe('注册方式: Account:账号注册,Phone:手机注册'),
	/** 登录方式 */
	loginTypes: z.array(RegisterType).default(['Phone']).describe('登录方式'),
	/** 注册方式 */
	registerType: RegisterType.default('Phone').describe('注册方式: Account:账号注册,Phone:手机注册'),
	/** 注册所需要素 */
	registerRequire: RegisterRequireSchema.default('Null').describe('注册所需要素'),
	/** 三方注册所需要素 */
	thirdPartyRegisterRequire: RegisterRequireSchema.default('Null').describe('三方注册所需要素'),
	/** 三方登录方式 */
	thirdPartyLogin: z.string().trim().default('').describe('第三方登陆方式'),

	/** 是否开启账号注册*/
	accountRegisterSwitch: z.boolean().default(false).describe('是否开启账号注册'),
	/** 账号注册-前端是否显示手机号 */
	accountRegisterShowPhone: z.boolean().default(false).describe('账号注册-前端是否显示手机号'),
	/** 账号注册-手机号是否必填 */
	accountRegisterPhoneRequired: z.boolean().default(false).describe('账号注册-手机号是否必填'),
	/** 账号注册-手机号是否验证 */
	accountRegisterPhoneValidate: z.boolean().default(false).describe('账号注册-手机号是否验证'),

	/** 是否开启手机号注册 */
	phoneRegisterSwitch: z.boolean().default(true).describe('是否开启手机号注册'),
	/** 手机号注册-手机号是否验证 */
	phoneRegisterPhoneValidate: z.boolean().default(false).describe('手机号注册-手机号是否验证'),

	/** 是否开启谷歌注册 */
	googleRegisterSwitch: z.boolean().default(false).describe('是否开启谷歌注册'),

	/** 登录方式选择, 多选, 账号, 手机号, 谷歌 */
	loginType: z.array(z.enum(NewRegisterType)).default(['Phone']).describe('登录方式选择, 多选, 账号, 手机号, 谷歌'),

	/** google登录ID */
	googleOauthID: z.string().trim().default('').describe('google登录ID'),
	/** google登录秘钥 */
	googleOauthSecret: z.string().trim().default('').describe('google登录秘钥'),
	/** facebook登录ID */
	facebookOauthID: z.string().trim().default('').describe('facebook登录ID'),
	/** facebook登录秘钥 */
	facebookOauthSecret: z.string().trim().default('').describe('facebook登录秘钥'),
	/** twitter登录ID */
	twitterOauthID: z.string().trim().default('').describe('twitter登录ID'),
	/** twitter登录秘钥 */
	twitterOauthSecret: z.string().trim().default('').describe('twitter登录秘钥'),
	/** github登录ID */
	githubOauthID: z.string().trim().default('').describe('github登录ID'),
	/** github登录秘钥 */
	githubOauthSecret: z.string().trim().default('').describe('github登录秘钥'),
	/** 同IP单日注册上限 */
	registerIpLimit: z.number().positive().default(100).describe('同IP单日注册上限'),
	/** 同IP单小时注册上限 */
	registerIpLimitHour: z.number().positive().default(100).describe('同IP单小时注册上限'),
	/** 同IP单周注册上限 */
	registerIpLimitWeek: z.number().positive().default(100).describe('同IP单周注册上限'),
	/** 连续密码错误次数冻结账号 */
	passwordErrorFreeze: z.number().positive().default(3).describe('连续密码错误次数冻结账号'),
	/** 允许使用邮箱手机号登录 */
	allowEmailPhoneLogin: z.boolean().default(true).describe('允许使用邮箱手机号登录'),
	/** 是否允许用户自己修改密码 */
	allowUserChangePassword: z.boolean().default(true).describe('是否允许用户自己修改密码'),
	/** 是否允许修改资金密码 */
	allowChangeAssetPassword: z.boolean().default(true).describe('是否允许修改资金密码'),
	/** 是否允许修改手机 */
	allowChangePhone: z.boolean().default(true).describe('是否允许修改手机'),
	/** 是否允许修改邮箱 */
	allowChangeEmail: z.boolean().default(true).describe('是否允许修改邮箱'),
	/** 注册ip白名单 */
	registerWhiteList: z.string().default('').describe('注册ip白名单'),
	/**注册账号就送彩金开关 */
	registerRewardSwitch: z.enum(['OFF', 'ON']).default('OFF').describe('注册账号就送彩金开关'),
	/**赠送金额 */
	registerRewardAmount: z.number().default(0).describe('赠送金额'),
	/**稽核倍数 */
	rewardAuditMultiple: z.number().default(1).describe('稽核倍数'),
	/**人机验证开关 */
	captchaSwitch: z.enum(['OFF', 'ON']).default('OFF').describe('人机验证开关'),
	/**图形验证码开关 */
	imageCaptchaSwitch: z.enum(['OFF', 'ON']).default('OFF').describe('图形验证码开关'),
	/** 同账号代理开户单日注册上限 */
	agencyRegisterLimit: z.number().default(-1).describe('同账号代理开户单日注册上限'),
	/** 同账号代理开户单小时注册上限 */
	agencyRegisterLimitHour: z.number().default(-1).describe('同账号代理开户单小时注册上限'),
	/** 同账号代理开户单周注册上限 */
	agencyRegisterLimitWeek: z.number().default(-1).describe('同账号代理开户单周注册上限'),
	/** 同账号代理开户单月注册上限 */
	agencyRegisterLimitMonth: z.number().default(-1).describe('同账号代理开户单月注册上限'),
	/** 是否需要填写CPF */
	needCpf: z.boolean().default(false).describe('是否需要填写CPF'),
	/** 是否开启代理开户功能 */
	agencyRegisterSwitch: z.boolean().default(false).describe('是否开启代理开户功能'),
	/** 注册是否需要绑定Gcash和Maya */
	registerBindGcashMaya: z.boolean().default(false).describe('注册是否需要绑定Gcash和Maya'),
	/** 登录验证码类型 */
	loginCaptcha: z.enum(['OFF', 'CF', 'IMAGE']).default('OFF').describe('登录验证码类型'),
	/**是否验证姓名 */
	needRealName: z.boolean().default(false).describe('是否验证姓名'),
	/**是否验证生日 */
	needBirthday: z.boolean().default(false).describe('是否验证生日'),
	/**是否需要填写真实姓名 */
	needRealNameInput: z.boolean().default(false).describe('是否需要填写真实姓名'),
})

type ZTenantLoginConfigType = z.infer<typeof ZTenantLoginConfig>
export type TenantLoginConfigKeys = keyof OmitCategory<ZTenantLoginConfigType>

export const ZTenantLoginConfigKeys = Object.keys(ZTenantLoginConfig.shape).filter((key) => key !== 'category')
export const ZTenantLoginConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.LOGIN),
	key: z.enum(ZTenantLoginConfigKeys as [TenantLoginConfigKeys, ...TenantLoginConfigKeys[]]).optional(),
})

/**
 * 商户代理配置
 */
export const ZTenantAgencyConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.AGENCY),
	/** 代理模式 */
	agencyMode: z.enum(AgencyMode).default('unlimitedLevel').describe('代理模式'),
	/** 商户代理返佣类型 */
	commissionType: z.enum(CommissionType).default('gameType').describe('商户代理返佣类型'),
	/** 商户代理业绩统计类型 */
	achievementType: z.enum(AchievementType).default('validBet').describe('商户代理业绩统计类型'),
	/** 英语广告语 */
	advertising_en: z.string().default('').describe('英文广告语'),
	/** 本土语言广告语 */
	advertising_local: z.string().default('').describe('本土语言广告语'),
	/** 前端展示页签排序 */
	tabSort: z
		.array(z.string())
		.default([
			/** 我的代理 */
			'{"title":"MyAgency","isOpen":true,"sort":6}',
			/** 推广教程 */
			'{"title":"PromotionTutorial","isOpen":true,"sort":5}',
			/** 我的业绩 */
			'{"title":"MyPerformance","isOpen":true,"sort":4}',
			/** 我的佣金 */
			'{"title":"MyCommission","isOpen":true,"sort":3}',
			/** 返佣比例 */
			'{"title":"CommissionRatio","isOpen":true,"sort":2}',
			/** 直属开户 */
			'{"title":"DirectAccount","isOpen":true,"sort":1}',
		])
		.describe('前端展示页签排序'),
	/** 站点名称 */
	siteName: z.string().default('').describe('站点名称'),
	/** 站点地址 */
	siteUrl: z.string().default('').describe('站点地址'),
	/** 宣传图logo */
	logo: z.string().default('').describe('宣传图logo'),
	/** 宣传图图标 */
	icon: z.string().default('').describe('宣传图图标'),
	/** 宣传图背景 */
	background: z.string().default('').describe('宣传图背景'),
	/** 宣传图导语 */
	intro: z.string().default('').describe('宣传图导语'),
	/** 是否启用自定义教程 */
	customTutorial: z.boolean().default(false).describe('是否启用自定义教程'),
	/** 英语教程链接 */
	tutorial_en: z.string().default('').describe('英语教程链接'),
	/** 本土语言教程链接 */
	tutorial_local: z.string().default('').describe('本土语言教程链接'),
	/** 推广链接跳转地址 */
	jumpType: z.enum(JumpType).default('home').describe('推广链接跳转地址'),
	/** 推广软件 */
	software: z
		.array(z.string())
		.default([
			'{"name":"Facebook","type":"Facebook","isOpen":true,"sort":1}',
			'{"name":"Telegram","type":"Telegram","isOpen":true,"sort":2}',
			'{"name":"Instagram","type":"Instagram","isOpen":true,"sort":3}',
			'{"name":"TikTok","type":"TikTok","isOpen":true,"sort":4}',
			'{"name":"WhatsApp","type":"WhatsApp","isOpen":true,"sort":5}',
			'{"name":"Twitter","type":"Twitter","isOpen":true,"sort":6}',
			'{"name":"Kwai","type":"Kwai","isOpen":true,"sort":7}',
			'{"name":"YouTube","type":"YouTube","isOpen":true,"sort":8}',
			'{"name":"Email","type":"Email","isOpen":true,"sort":9}',
		])
		.describe('推广软件'),
	/** 佣金发放时间 */
	commissionDistributeTime: z.string().default('08:00:00').describe('佣金发放时间'),
	/** 分享语类型 */
	shareTextType: z.enum(['Custom', 'Default']).default('Default').describe('分享语类型'),
	/** 分享语 */
	shareText: z.string().default('').describe('分享语'),
})

type ZTenantAgencyConfigType = z.infer<typeof ZTenantAgencyConfig>
export type TenantAgencyConfigKeys = keyof OmitCategory<ZTenantAgencyConfigType>

export const ZTenantAgencyConfigKeys = Object.keys(ZTenantAgencyConfig.shape).filter((key) => key !== 'category')

export const ZTenantAgencyConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.AGENCY),
	key: z.enum(ZTenantAgencyConfigKeys as [TenantAgencyConfigKeys, ...TenantAgencyConfigKeys[]]).optional(),
})

const TabSort: { title: TAllGameTypes; sort: number; isOpen: boolean }[] = [
	{ title: 'all', sort: 1, isOpen: true },
	{ title: 'ELECTRONIC', sort: 2, isOpen: true },
	{ title: 'CHESS', sort: 3, isOpen: true },
	{ title: 'FISHING', sort: 4, isOpen: true },
	{ title: 'VIDEO', sort: 5, isOpen: true },
	{ title: 'SPORTS', sort: 6, isOpen: true },
	{ title: 'LOTTERY', sort: 7, isOpen: true },
]
const TabSortStringArray = TabSort.map((item) => JSON.stringify(item))

export const CPFActivityAdminConfig = z.object({
	/**
	 * 状态
	 */
	status: z.enum(SwitchTypes),
	/**
	 * 金额类型
	 */
	amountType: z.enum(AmountTypes),
	/**
	 * 总商户奖励类型
	 */
	rewardType: z.enum(['TOTAL_RECHARGE', 'WITHDRAWAL_RECHARGE_DIFFERENCE', 'TOTAL_WITHDRAWAL']),
	/**
	 * 配置
	 */
	config: z.array(
		z.object({
			/**
			 * 目标金额
			 */
			target: z.number(),
			/**
			 * 最小金额
			 */
			minAmount: z.number(),
			/**
			 * 最大金额
			 */
			maxAmount: z.number(),
			/**
			 * 期望金额
			 */
			expectAmount: z.number(),
		}),
	),
})
export type TCPFActivityAdminConfig = z.infer<typeof CPFActivityAdminConfig>

export const WalletUserActivityAdminConfig = z.object({
	/**
	 * 状态
	 */
	status: z.enum(SwitchTypes),
	/**
	 * 金额类型
	 */
	amountType: z.enum(AmountTypes),
	/**
	 * 总商户奖励类型
	 */
	rewardType: z.enum(['TOTAL_RECHARGE', 'WITHDRAWAL_RECHARGE_DIFFERENCE', 'TOTAL_WITHDRAWAL']),
	/**
	 * 配置
	 */
	config: z.array(
		z.object({
			/**
			 * 目标金额
			 */
			target: z.number(),
			/**
			 * 最小金额
			 */
			minAmount: z.number(),
			/**
			 * 最大金额
			 */
			maxAmount: z.number(),
			/**
			 * 期望金额
			 */
			expectAmount: z.number(),
		}),
	),
})
export type TWalletUserActivityAdminConfig = z.infer<typeof WalletUserActivityAdminConfig>

/**
 * 商户活动配置
 */
export const ZTenantActivityConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.ACTIVITY),
	/** 前端展示页签排序 */
	tabSort: z.array(z.string()).default(TabSortStringArray).describe('前端展示页签排序'),
	/**
	 * CPF邀请活动总商户配置 (管理员奖励配置)
	 */
	cpfActivityAdminConfig: CPFActivityAdminConfig.optional(),

	/**
	 * 钱包用户邀请活动 总商户配置
	 */
	walletUserActivityAdminConfig: WalletUserActivityAdminConfig.optional(),
})
type ZTenantActivityConfigType = z.infer<typeof ZTenantActivityConfig>
export type TenantActivityConfigKeys = keyof OmitCategory<ZTenantActivityConfigType>

export const ZTenantActivityConfigKeys = Object.keys(ZTenantActivityConfig.shape).filter((key) => key !== 'category')

export const ZTenantActivityConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.ACTIVITY),
	key: z.enum(ZTenantActivityConfigKeys as [TenantActivityConfigKeys, ...TenantActivityConfigKeys[]]).optional(),
})

/**
 * 商户渠道配置列表
 */
export const ZTenantChannelConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.CHANNEL),
	/** 埋点类型 */
	pointType: z.enum(PointTypeEnum).default('Facebook').describe('埋点类型'),
	/** 埋点参数 */
	pointParams: z.string().default('').describe('埋点参数'),
	/** 域名ID */
	domainId: z.number().default(0).describe('域名ID'),
	/** 渠道前端配置 */
	frontConfig: z
		.string()
		.default(JSON.stringify(FrontConfigSchema.parse({})))
		.describe('渠道前端配置'),
	/** 安装后送金开关 */
	isInstallSendMoney: z.boolean().default(false).describe('安装后送金开关'),

	/** 安装后送金类型 */
	installSendMoneyType: z.enum(InstallSendMoneyTypeEnum).default('OFF').describe('安装后送金类型'),

	/** 安装后送金金额 */
	installSendMoney: z.number().default(0).describe('安装后送金金额'),
	/** 稽核倍数 */
	auditMultiple: z.number().default(0).describe('稽核倍数'),
})
type ZTenantChannelConfigType = z.infer<typeof ZTenantChannelConfig>
export type TenantChannelConfigKeys = keyof OmitCategory<ZTenantChannelConfigType>

export const ZTenantChannelConfigKeys = Object.keys(ZTenantChannelConfig.shape).filter((key) => key !== 'category')

export const ZTenantChannelConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.CHANNEL),
	key: z.enum(ZTenantChannelConfigKeys as [TenantChannelConfigKeys, ...TenantChannelConfigKeys[]]).optional(),
})

/**
 * 商户兑换码配置
 */
export const ZRedeemCodeConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.REDEEMCODE),
	/** 图片 */
	image: z.string().default('').describe('图片'),
	/** 介绍文本 */
	introText: z.string().default('').describe('介绍文本'),

	/**链接类型 */
	LinkType: z.enum(['InternalLink', 'Custom', 'None']).default('None').describe('链接类型'),

	/**
	 * 值的类型 CODE or ACTIVITY ，当为ACTIVITY 的时候下面值为活动ID ，当为URL的时候下面值为URL
	 */
	valueType: z
		.enum(['CODE', 'ACTIVITY', 'URL'])
		.default('URL')
		.describe('值的类型 CODE or ACTIVITY ，当为ACTIVITY 的时候下面值为活动ID ，当为URL的时候下面值为URL'),
	/**
	 * 跳转链接值
	 */
	value: z.string().default('').describe('跳转链接值'),

	/**活动名字 */
	activityName: z.string().default('').describe('活动名字'),
})
type ZRedeemCodeConfigType = z.infer<typeof ZRedeemCodeConfig>
export type RedeemCodeConfigKeys = keyof OmitCategory<ZRedeemCodeConfigType>

export const ZRedeemCodeConfigKeys = Object.keys(ZRedeemCodeConfig.shape).filter((key) => key !== 'category')

export const ZRedeemCodeConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.REDEEMCODE),
	key: z.enum(ZRedeemCodeConfigKeys as [RedeemCodeConfigKeys, ...RedeemCodeConfigKeys[]]).optional(),
})

/**
 * 测试商户配置
 */
export const ZTestTenantConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.TEST),
	/** app白名单ip */
	appWhiteIp: z.string().default('').describe('app白名单ip'),
	/** 三方游戏单笔投注限额 */
	thirdPartyGameBetLimit: z.number().default(0).describe('三方游戏单笔投注限额'),
})
type ZTestTenantConfigType = z.infer<typeof ZTestTenantConfig>
export type TestTenantConfigKeys = keyof OmitCategory<ZTestTenantConfigType>

export const ZTestTenantConfigKeys = Object.keys(ZTestTenantConfig.shape).filter((key) => key !== 'category')

export const ZTestTenantConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.TEST),
	key: z.enum(ZTestTenantConfigKeys as [TestTenantConfigKeys, ...TestTenantConfigKeys[]]).optional(),
})

/**
 * 商户导出配置
 */
export const ZExportTenantConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.EXPORT),
	/** 过期类型 */
	expireType: z.enum(ExportExpireTypeEnum).default('Forever').describe('过期类型'),
	/** 过期时间 */
	expireTime: z.number().default(0).describe('过期时间'),
	/** 过期次数 */
	expireCount: z.number().default(0).describe('过期次数'),
	/** 导出身份类型 */
	exportIdentityType: z.enum(ExportIdentityTypeEnum).default('ExportSelf').describe('导出身份类型'),
})
type ZExportTenantConfigType = z.infer<typeof ZExportTenantConfig>
export type ExportTenantConfigKeys = keyof OmitCategory<ZExportTenantConfigType>

export const ZExportTenantConfigKeys = Object.keys(ZExportTenantConfig.shape).filter((key) => key !== 'category')

export const ZExportTenantConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.EXPORT),
	key: z.enum(ZExportTenantConfigKeys as [ExportTenantConfigKeys, ...ExportTenantConfigKeys[]]).optional(),
})

/**
 * 商户代理设置
 */
export const ZTenantAgencySetting = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.AGENCY_SETTINGS),
	/** 佣金领取方式 */
	receiveType: z.enum(['Normal', 'Auto']).default('Normal').describe('佣金领取方式'),
	/** 广告语(英语) */
	advertise_en: z.string().default('').describe('广告语(英语)'),
	/** 广告语(本地语言) */
	advertise: z.string().default('').describe('广告语(本地语言)'),
	/** 站点地址 */
	siteUrl: z.string().default('').describe('站点地址'),
	/** 宣传图 */
	banner: z.string().default('').describe('宣传图'),
	/** 邀请规则类型 */
	inviteRuleType: z.enum(['Normal', 'Custom']).default('Normal').describe('邀请规则类型'),
	/** 邀请规则 */
	inviteRule: z.string().default('').describe('邀请规则'),
})

export type TTenantAgencySetting = z.infer<typeof ZTenantAgencySetting>
export type TTenantAgencySettingKeys = keyof TTenantAgencySetting

export const ZTenantAgencySettingKeys = Object.keys(ZTenantAgencySetting.shape).filter((key) => key !== 'category')

export const ZTenantAgencySettingSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.AGENCY_SETTINGS),
	key: z.enum(ZTenantAgencySettingKeys as [TTenantAgencySettingKeys, ...TTenantAgencySettingKeys[]]).optional(),
})

/**
 * 商户佣金排行榜设置
 */
export const ZTenantCommissionRankConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.AGENCY_RANK),
	/** 开关 */
	isOpen: z.boolean().default(false).describe('开关'),
	/** 排行榜生效时间 */
	rankEffectTime: z.string().default('').describe('排行榜生效时间'),
	/** 奖励名次 */
	rewardRank: z.number().default(0).describe('奖励名次'),
	/** 奖励金额配置 */
	rewardAmountConfig: z
		.array(
			z.object({
				level: z.number().default(0).describe('等级'),
				day: z.number().default(0).describe('日榜'),
				week: z.number().default(0).describe('周榜'),
				month: z.number().default(0).describe('月榜'),
			}),
		)
		.default([])
		.describe('奖励金额配置'),
	/** 稽核平台配置 */
	auditPlatformConfig: z.string().default('{}').describe('稽核平台配置'),
	/** 稽核倍数 */
	auditMultiple: z.number().default(0).describe('稽核倍数'),
})

export type TTenantCommissionRankConfig = z.infer<typeof ZTenantCommissionRankConfig>
export type TTenantCommissionRankConfigKeys = keyof TTenantCommissionRankConfig

export const ZTenantCommissionRankConfigKeys = Object.keys(ZTenantCommissionRankConfig.shape).filter(
	(key) => key !== 'category',
)

export const ZTenantCommissionRankConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.AGENCY_RANK),
	key: z
		.enum(
			ZTenantCommissionRankConfigKeys as [TTenantCommissionRankConfigKeys, ...TTenantCommissionRankConfigKeys[]],
		)
		.optional(),
})

/**
 * 商户查询条件设置
 */
export const ZTenantQueryConditionConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.QUERY_CONDITION),
	/** 渠道报表 */
	channelReport: z.string().default('{}').describe('渠道报表'),
})

export type TTenantQueryConditionConfig = z.infer<typeof ZTenantQueryConditionConfig>
export type TTenantQueryConditionConfigKeys = keyof TTenantQueryConditionConfig

export const ZTenantQueryConditionConfigKeys = Object.keys(ZTenantQueryConditionConfig.shape).filter(
	(key) => key !== 'category',
)

export const ZTenantQueryConditionConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.QUERY_CONDITION),
	key: z
		.enum(
			ZTenantQueryConditionConfigKeys as [TTenantQueryConditionConfigKeys, ...TTenantQueryConditionConfigKeys[]],
		)
		.optional(),
})

/**
 * 商户新人福利设置
 */

export const ZTenantTaskConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.NewbieTask),
	/** 参与层级 */
	joinLevel: z.string().default('[]').describe('参与层级'),
	/**任务时长 */
	taskDayType: z.enum(['Permanent', 'Days']).default('Permanent').describe('任务时长'),
	/**任务时长 */
	taskDay: z.number().int().min(1).default(1).describe('任务时长'),
	/**领取方式 */
	receiveType: z.enum(['Manual', 'Auto']).default('Manual').describe('领取方式'),
	/**申领终端 */
	applyAppType: z.string().default('["APK"]').describe('申领终端'),
	/**领取时间 */
	receiveTime: z.enum(['NextDay', 'Today']).default('Today').describe('领取时间'),
	/**登录前弹窗方式 */
	loginPopupType: z.enum(['EveryDay', 'Hall', 'NotPop']).default('NotPop').describe('登录前弹窗方式'),
	/**登录后弹窗方式 */
	loginAfterPopupType: z
		.enum(['EveryDay', 'Hall', 'NotPop', 'Login', 'One'])
		.default('NotPop')
		.describe('登录后弹窗方式'),
	/**稽核倍数 */
	auditMultiple: z.number().default(1).describe('稽核倍数'),
	//稽核游戏限制
	auditGameLimit: z.string().default('{}').describe('稽核游戏限制'),
	/**规则说明 */
	rule: z.enum(['Default', 'Customize']).default('Default').describe('规则说明'),
	/**说过内容 */
	content: z.string().default('').describe('说过内容'),
	/**其他 */
	otherParam: z.string().default('').describe('其他'),
	/**申领限制 */
	applyLimit: z.string().default('').describe('申领限制'),
	/**同登录IP参与上限 */
	loginIpLimit: z.number().default(0).describe('同登录IP参与上限'),
	/**同登录设备参与上限 */
	loginDeviceLimit: z.number().default(0).describe('同登录设备参与上限'),
})
type TenantTaskConfigType = z.infer<typeof ZTenantTaskConfig>
export type TenantTaskConfigKeys = keyof OmitCategory<TenantTaskConfigType>

export const ZTenantTaskConfigKeys = Object.keys(ZTenantTaskConfig.shape).filter((key) => key !== 'category')

export const ZTenantTaskConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.NewbieTask),
	key: z.enum(ZTenantTaskConfigKeys as [TenantTaskConfigKeys, ...TenantTaskConfigKeys[]]).optional(),
})

/**
 * 商户注册奖励配置
 */
export const ZTenantRegisterRewardConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.REGISTER_REWARD),
	/** 奖励开关 */
	rewardSwitch: z.boolean().default(false).describe('奖励开关'),
	/** 开启时间 */
	openTime: z.string().default(new Date().toString()).describe('开启时间'),
	/** 奖励类型 */
	awardType: z.enum(RegisterRewardAwardTypes).default('FIXED').describe('奖励类型'),
	/** 奖励金额最小值 */
	rewardAmountMin: z.number().default(0).describe('奖励金额最小值'),
	/** 奖励金额最大值 */
	rewardAmountMax: z.number().default(0).describe('奖励金额最大值'),
	/** 期望奖金 */
	expectRewardAmount: z.number().default(0).describe('期望奖金'),
	/** 申领终端 */
	applyAppType: z.string().default('').describe('申领终端'),
	/** 稽核倍数 */
	auditMultiple: z.number().default(1).describe('稽核倍数'),
	/** 稽核限制MD5 */
	auditLimitMd5: z.string().default('').describe('稽核限制MD5'),
	/** 转盘奖励 */
	wheelReward: z
		.array(
			z.object({
				rewardType: z.enum(RegisterRewardAwardTypes).default('FIXED').describe('奖励类型'),
				rewardValue: z.number().default(0).describe('奖励值'),
			}),
		)
		.default([])
		.describe('转盘奖励'),
	/** 渠道前端配置 */
	frontConfig: z.string().default('{}').describe('渠道前端配置'),
	/** 按钮显示赠送金额 */
	buttonShowAmount: z.string().default('').describe('按钮显示赠送金额'),
	/**虚拟奖金比例 */
	virtualRewardRate: z.number().default(0).describe('虚拟奖金比例'),
})
export type TenantRegisterRewardConfigType = z.infer<typeof ZTenantRegisterRewardConfig>
export type TenantRegisterRewardConfigKeys = keyof OmitCategory<TenantRegisterRewardConfigType>

export const ZTenantRegisterRewardConfigKeys = Object.keys(ZTenantRegisterRewardConfig.shape).filter(
	(key) => key !== 'category',
)

export const ZTenantRegisterRewardConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.REGISTER_REWARD),
	key: z
		.enum(ZTenantRegisterRewardConfigKeys as [TenantRegisterRewardConfigKeys, ...TenantRegisterRewardConfigKeys[]])
		.optional(),
})

/**
 * 商户域名配置
 */
export const ZTenantDomainConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.DOMAIN),
	/** 主域名防封是否开启 */
	antiSealingMainDomainIsOpen: z.boolean().default(false).describe('主域名防封是否开启'),
	/** 防封页域名ID列表 */
	antiSealingDomainIdList: z.array(z.number()).default([]).describe('防封页域名ID列表'),
	/** 防封对象域名ID列表 */
	mainDomainIdList: z.array(z.number()).default([]).describe('防封对象域名ID列表'),
})
export type TenantDomainConfigType = z.infer<typeof ZTenantDomainConfig>
export type TenantDomainConfigKeys = keyof OmitCategory<TenantDomainConfigType>

export const ZTenantDomainConfigKeys = Object.keys(ZTenantDomainConfig.shape).filter((key) => key !== 'category')

export const ZTenantDomainConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.DOMAIN),
	key: z.enum(ZTenantDomainConfigKeys as [TenantDomainConfigKeys, ...TenantDomainConfigKeys[]]).optional(),
})

/**
 * 商户公告配置
 */
export const ZTenantAnnouncementConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.ANNOUNCEMENT),
	/** 公告弹出方式 */
	announcementPopupWay: z.enum(['one', 'merge']).default('one').describe('公告弹出方式 one:逐个 合并:merge'),
	/** 公告标签样式 */
	announcementLabelStyle: z.enum(['head', 'bottom']).default('bottom').describe('公告标签样式 head:头部 bottom:底部'),
})
export type TenantAnnouncementConfigType = z.infer<typeof ZTenantAnnouncementConfig>
export type TenantAnnouncementConfigKeys = keyof OmitCategory<TenantAnnouncementConfigType>

export const ZTenantAnnouncementConfigKeys = Object.keys(ZTenantAnnouncementConfig.shape).filter(
	(key) => key !== 'category',
)

export const ZTenantAnnouncementConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.ANNOUNCEMENT),
	key: z
		.enum(ZTenantAnnouncementConfigKeys as [TenantAnnouncementConfigKeys, ...TenantAnnouncementConfigKeys[]])
		.optional(),
})

/**
 * 商户安全配置
 */
export const ZTenantSecurityConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.SECURITY),
	/** 人工存入单笔金额 */
	manualDepositSingleAmount: z.number().default(0).describe('人工存入单笔金额'),
	/** 人工优惠单笔金额 */
	manualDiscountSingleAmount: z.number().default(0).describe('人工优惠单笔金额'),
	/** 批量人工优惠开关 */
	batchManualDiscountSwitch: z.boolean().default(false).describe('批量人工优惠开关'),
	/** 新增子账号开关 */
	addSubAccountSwitch: z.boolean().default(false).describe('新增子账号开关'),
	/** 导出报表开关 */
	exportReportSwitch: z.boolean().default(false).describe('导出报表开关'),
	/** 新增虚拟币账号 */
	addVirtualCurrencyAccountSwitch: z.boolean().default(false).describe('新增虚拟币账号'),
	/** 编辑虚拟币账号 */
	editVirtualCurrencyAccountSwitch: z.boolean().default(false).describe('编辑虚拟币账号'),
	/** 删除虚拟币账号 */
	deleteVirtualCurrencyAccountSwitch: z.boolean().default(false).describe('删除虚拟币账号'),
	/** 月结账单支付审核 */
	monthEndBillPaymentAuditSwitch: z.boolean().default(false).describe('月结账单支付审核'),
})

export type TenantSecurityConfigType = z.infer<typeof ZTenantSecurityConfig>
export type TenantSecurityConfigKeys = keyof OmitCategory<TenantSecurityConfigType>

export const ZTenantSecurityConfigKeys = Object.keys(ZTenantSecurityConfig.shape).filter((key) => key !== 'category')

export const ZTenantSecurityConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.SECURITY),
	key: z.enum(ZTenantSecurityConfigKeys as [TenantSecurityConfigKeys, ...TenantSecurityConfigKeys[]]).optional(),
})

/** 公司配置 */
export const ZTenantCompanyConfig = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.COMPANY),
	/** 是否开启指纹验证 */
	fpSwitch: z.boolean().default(false).describe('是否开启指纹验证'),
})

export type TenantCompanyConfigType = z.infer<typeof ZTenantCompanyConfig>
export type TenantCompanyConfigKeys = keyof OmitCategory<TenantCompanyConfigType>
export const ZTenantCompanyConfigKeys = Object.keys(ZTenantCompanyConfig.shape).filter((key) => key !== 'category')
export const ZTenantCompanyConfigSelect = z.object({
	category: z.literal(ZTenantConfigCategory.Enum.COMPANY),
	key: z.enum(ZTenantCompanyConfigKeys as [TenantCompanyConfigKeys, ...TenantCompanyConfigKeys[]]).optional(),
})

/**
 * 总配置列表
 */
export const TotalConfigList = [
	...ZTenantSystemConfigKeys,
	...ZTenantPaymentConfigKeys,
	...ZTenantWithdrawConfigKeys,
	...ZTenantLoginConfigKeys,
	...ZTenantAgencyConfigKeys,
	...ZTenantActivityConfigKeys,
	...ZTenantChannelConfigKeys,
	...ZRedeemCodeConfigKeys,
	...ZTestTenantConfigKeys,
	...ZExportTenantConfigKeys,
	...ZTenantAgencySettingKeys,
	...ZTenantCommissionRankConfigKeys,
	...ZTenantQueryConditionConfigKeys,
	...ZTenantRegionConfigKeys,
	...ZTenantTaskConfigKeys,
	...ZTenantRegisterRewardConfigKeys,
	...ZTenantDomainConfigKeys,
	...ZTenantAnnouncementConfigKeys,
	...ZTenantSecurityConfigKeys,
	...ZTenantCompanyConfigKeys,
] as [string, ...string[]]

export const TenantConfigSchema = z.discriminatedUnion('category', [
	ZTenantSystemConfig,
	ZTenantPaymentConfig,
	ZTenantWithdrawConfig,
	ZTenantLoginConfig,
	ZTenantAgencyConfig,
	ZTenantActivityConfig,
	ZTenantChannelConfig,
	ZRedeemCodeConfig,
	ZTestTenantConfig,
	ZExportTenantConfig,
	ZTenantAgencySetting,
	ZTenantCommissionRankConfig,
	ZTenantQueryConditionConfig,
	ZTenantRegionConfig,
	ZTenantTaskConfig,
	ZTenantRegisterRewardConfig,
	ZTenantDomainConfig,
	ZTenantAnnouncementConfig,
	ZTenantSecurityConfig,
	ZTenantCompanyConfig,
])

export type TTenantConfigSchema = z.infer<typeof TenantConfigSchema>

export const TenantConfigSelectSchema = z.discriminatedUnion('category', [
	ZTenantSystemConfigSelect,
	ZTenantPaymentConfigSelect,
	ZTenantWithdrawConfigSelect,
	ZTenantLoginConfigSelect,
	ZTenantAgencyConfigSelect,
	ZTenantActivityConfigSelect,
	ZTenantChannelConfigSelect,
	ZRedeemCodeConfigSelect,
	ZTestTenantConfigSelect,
	ZExportTenantConfigSelect,
	ZTenantAgencySettingSelect,
	ZTenantCommissionRankConfigSelect,
	ZTenantQueryConditionConfigSelect,
	ZTenantRegionConfigSelect,
	ZTenantTaskConfigSelect,
	ZTenantRegisterRewardConfigSelect,
	ZTenantDomainConfigSelect,
	ZTenantAnnouncementConfigSelect,
	ZTenantSecurityConfigSelect,
	ZTenantCompanyConfigSelect,
])

export const TenantUpdateConfigSchema = z.discriminatedUnion('category', [
	ZTenantSystemConfig.partial().required({
		category: true,
	}),
	ZTenantPaymentConfig.partial().required({
		category: true,
	}),
	ZTenantWithdrawConfig.partial().required({
		category: true,
	}),
	ZTenantLoginConfig.partial().required({
		category: true,
	}),
	ZTenantAgencyConfig.partial().required({
		category: true,
	}),
	ZTenantActivityConfig.partial().required({
		category: true,
	}),
	ZTenantChannelConfig.partial().required({
		category: true,
	}),
	ZRedeemCodeConfig.partial().required({
		category: true,
	}),
	ZTestTenantConfig.partial().required({
		category: true,
	}),
	ZExportTenantConfig.partial().required({
		category: true,
	}),
	ZTenantAgencySetting.partial().required({
		category: true,
	}),
	ZTenantCommissionRankConfig.partial().required({
		category: true,
	}),
	ZTenantQueryConditionConfig.partial().required({
		category: true,
	}),
	ZTenantRegionConfig.partial().required({
		category: true,
	}),
	ZTenantTaskConfig.partial().required({
		category: true,
	}),
	ZTenantRegisterRewardConfig.partial().required({
		category: true,
	}),
	ZTenantDomainConfig.partial().required({
		category: true,
	}),
	ZTenantAnnouncementConfig.partial().required({
		category: true,
	}),
	ZTenantSecurityConfig.partial().required({
		category: true,
	}),
	ZTenantCompanyConfig.partial().required({
		category: true,
	}),
])

export const TenantConfigSchemas = z.array(TenantUpdateConfigSchema)

export type TTenantUpdateConfigs = z.infer<typeof TenantConfigSchemas>
