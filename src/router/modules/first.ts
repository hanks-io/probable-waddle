import type { RouteRecordRaw } from 'vue-router'
import SharePage from '@/views/user/share/index.vue'
import GameActionPage from '@/views/game/action/index.vue'
import GameSearchPage from '@/views/game/search/index.vue'
import SecurityPage from '@/views/security/first/index.vue'
import MainPage from '@/views/tabbar/MainPage/first/index.vue'
import GameCategoryPage from '@/views/game/category/index.vue'
import RechargePage from '@/views/recharge/main/first/index.vue'
import BindCPFPage from '@/views/recharge/bindCPF/first/index.vue'
import CPFPage from '@/views/recharge/bindCPF/cpf/index.vue'
import UserReportPage from '@/views/user/report/first/index.vue'
import SportGamePage from '@/views/game/category/sport/index.vue'
import PromoPage from '@/views/tabbar/tabs/promo/first/index.vue'
import ActivityVipPage from '@/views/activity/vip/first/index.vue'
import InicioPage from '@/views/tabbar/tabs/inicio/first/index.vue'
import PerfilPage from '@/views/tabbar/tabs/perfil/first/index.vue'
import SecurityBindPage from '@/views/security/first/bind/index.vue'
import WithdrawMainPage from '@/views/withdraw/main/first/index.vue'
import WithdrawSubPage from '@/views/withdraw/subView/first/index.vue'
import RebateRecordPage from '@/views/activity/rebate/first/record.vue'
import NotificationPage from '@/views/user/notification/first/index.vue'
import SecurityVerifyPage from '@/views/security/first/verify/index.vue'
import AuditDetails from '@/views/withdraw/auditDetails/first/index.vue'
import LimitGameList from '@/views/withdraw/limitGame/first/index.vue'
import RechargeRecordPage from '@/views/recharge/record/first/index.vue'
import ActivityCustomPage from '@/views/activity/custom/first/index.vue'
import ActivityAgencyPage from '@/views/activity/agency/first/index.vue'
import SecurityConfirmPage from '@/views/security/first/confirm/index.vue'

import WithdrawPasswordPage from '@/views/withdraw/password/first/index.vue'
import ActivityAgencyDetailsPage from '@/views/activity/agency/first/details.vue'
import NotificationDetailPage from '@/views/user/notification/first/detail/index.vue'
import WithdrawPWCompletion from '@/views/withdraw/passwordCompletion/first/index.vue'
import WithdrawalAccount from '@/views/withdraw/account/first/index.vue'
import WithdrawalBindAccount from '@/views/withdraw/bindAccount/first/index.vue'
import ActivityRechargeRewardPage from '@/views/activity/rechargeReward/first/index.vue'
import GameSportsPage from '@/views/game/sportsActions/index.vue'
import GameBetbyPage from '@/views/game/sportsActions/Betby.vue'
import InvitationLink from '@/views/mlmAgent/components/invitationLink.vue'
import SubordinateInfo from '@/views/mlmAgent/components/subordinateInfo.vue'
import CommissionDetail from '@/views/mlmAgent/components/commissionDetail.vue'
import InvitationRules from '@/views/mlmAgent/components/invitationRules.vue'
import AgentLevelInfo from '@/views/mlmAgent/components/agentLevelInfo.vue'
import CommissionRate from '@/views/mlmAgent/components/commissionRate.vue'
import LeaderBordInfo from '@/views/mlmAgent/components/leaderBordInfo.vue'
import RegisterReward from '@/views/registerReward/index.vue'
import SpreadPage from '@/views/spread/first/index.vue'
import MlmAgentPage from '@/views/mlmAgent/index.vue'
import MyExclusive from '@/views/activity/newUserExclusive/index.vue'

/**
 * @description 路由列表
 * @property meta[auth] 是否需要登陆验证
 */
const routes: Array<RouteRecordRaw> = [
	{
		// 主页
		path: '/main',
		component: MainPage,
		redirect: '/main/inicio',
		children: [
			{
				// 首页
				path: 'inicio',
				name: 'inicio',
				component: InicioPage,
			},
			{
				// 优惠活动
				path: 'promo',
				name: 'promo',
				component: PromoPage,
			},
			{
				// 充值
				path: 'entrar',
				name: 'entrar',
				component: RechargePage,
				meta: { auth: true, hasBottomTab: true },
			},
			{
				// 提现主页
				path: 'withdraw',
				name: 'withdraw',
				component: WithdrawMainPage,
				meta: { auth: true, hasBottomTab: true },
			},
			{
				// 个人中心
				path: 'perfil',
				name: 'perfil',
				component: PerfilPage,
				meta: { auth: true },
			},
			{
				// 体育游戏
				path: 'gameSports/:gameType/:platformId',
				name: 'gameSports',
				component: GameSportsPage,
				meta: { auth: true },
			},
			{
				// Betby体育游戏
				path: 'Betby',
				name: 'Betby',
				component: GameBetbyPage,
				meta: { auth: true },
			},
		],
	},
	{
		// 游戏分类
		path: '/game/category/:gameType/:platformId',
		name: 'GameCategory',
		component: GameCategoryPage,
	},
	{
		// 体育游戏
		path: '/game/category/sport',
		name: 'SportGame',
		component: SportGamePage,
	},
	{
		// 游戏搜索
		path: '/game/search/:tab',
		name: 'GameSearch',
		component: GameSearchPage,
	},
	{
		// 游戏大厅
		path: '/game/action/:id',
		name: 'GameAction',
		component: GameActionPage,
		meta: { auth: true },
	},
	{
		// 充值操作
		path: '/recharge/apply',
		component: RechargePage,
		meta: { auth: true, hasBottomTab: false },
	},
	{
		// 充值记录
		path: '/rechargeRecord',
		component: RechargeRecordPage,
		meta: { auth: true },
	},
	{
		// 绑定cpf
		path: '/bindCPF/:processMode',
		component: BindCPFPage,
		meta: { auth: true },
	},
	{
		// 绑定cpf
		path: '/cpf',
		component: CPFPage,
		meta: { auth: true },
	},

	{
		// 提现操作
		path: '/withdraw/apply',
		component: WithdrawMainPage,
		meta: { auth: true, hasBottomTab: false },
	},
	{
		// 提现密码
		path: '/withdrawPW',
		component: WithdrawPasswordPage,
		meta: { auth: true },
	},
	{
		// 提现密码设置完成
		path: '/withdrawPWCompletion',
		component: WithdrawPWCompletion,
		meta: { auth: true },
	},
	{
		// 提现子页
		path: '/withdrawSubView',
		component: WithdrawSubPage,
		meta: { auth: true },
	},
	{
		// 稽核详情
		path: '/withdrawAuditDetails',
		component: AuditDetails,
		meta: { auth: true },
	},
	{
		// 稽核详情-指定游戏
		path: '/withdrawLimitGame',
		component: LimitGameList,
		meta: { auth: true },
	},
	{
		// 提现账号
		path: '/withdrawalAccount',
		component: WithdrawalAccount,
		meta: { auth: true },
	},
	{
		// 绑定提现账号
		path: '/withdrawalBindAccount',
		component: WithdrawalBindAccount,
		meta: { auth: true },
	},

	{
		// 推广中心
		path: '/spread',
		component: SpreadPage,
	},
	{
		// 多级分销
		path: '/mlmAgent',
		component: MlmAgentPage,
	},
	{
		// 安全中心
		path: '/security',
		component: SecurityPage,
		meta: { auth: true },
	},
	{
		// 安全验证
		path: '/security/verify/:type',
		component: SecurityVerifyPage,
		meta: { auth: true },
	},
	{
		// 确认安全信息
		path: '/security/confirm/:type',
		component: SecurityConfirmPage,
		meta: { auth: true },
	},
	{
		// 绑定安全信息
		path: '/security/bind/:type',
		component: SecurityBindPage,
		meta: { auth: true },
	},
	{
		// 通知中心
		path: '/notification',
		component: NotificationPage,
	},
	{
		// 通知详情
		path: '/notification/detail/:id',
		component: NotificationDetailPage,
		meta: { auth: true },
	},
	{
		// VIP活动
		path: '/activity/vip',
		component: ActivityVipPage,
		meta: { auth: true },
	},
	{
		// 代理活动
		path: '/activity/agency/:id',
		component: ActivityAgencyPage,
	},
	{
		// 代理活动-下级详情
		path: '/activity/agency/details/:id',
		component: ActivityAgencyDetailsPage,
		meta: { auth: true },
	},
	{
		// 自定义活动
		path: '/activity/custom/:id',
		component: ActivityCustomPage,
	},
	{
		// 充值赠送活动
		path: '/activity/RechargeReward/:id',
		component: ActivityRechargeRewardPage,
	},
	{
		// 返水(详情记录)
		path: '/activity/rebate/record',
		component: RebateRecordPage,
	},
	{
		// 新人专属活动
		path: '/activity/newUserExclusive/:id',
		component: MyExclusive,
	},

	{
		// 分享页面
		path: '/share',
		component: SharePage,
	},
	{
		// 用户报表
		path: '/user/report',
		component: UserReportPage,
	},
	{
		// 多级分销 邀请链接
		path: '/mlmAgent/invitation',
		component: InvitationLink,
	},
	{
		// 多级分销 下级数据
		path: '/mlmAgent/subordinate',
		component: SubordinateInfo,
	},
	{
		// 多级分销 佣金明细
		path: '/mlmAgent/commissionDetail',
		component: CommissionDetail,
	},
	{
		// 多级分销 邀请规则
		path: '/mlmAgent/invitationRules',
		component: InvitationRules,
	},
	{
		// 多级分销 代理级别
		path: '/mlmAgent/agentLevel',
		component: AgentLevelInfo,
	},
	{
		// 多级分销 佣金比例表
		path: '/mlmAgent/commissionRate',
		component: CommissionRate,
	},
	{
		// 多级分销 佣金排行榜
		path: '/mlmAgent/leaderBord',
		component: LeaderBordInfo,
	},

	{
		// 注册赠送
		path: '/subscribeReward',
		component: RegisterReward,
		meta: { auth: true },
	},
]

export default routes
