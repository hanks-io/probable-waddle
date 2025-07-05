// 活动相关的路由
import type { RouteRecordRaw } from 'vue-router'

import ActivityRedPacketPage from '@/views/activity/mineral/index.vue'
import ActivityAssistancePage from '@/views/activity/piece/index.vue'
import LuckyBetPage from '@/views/activity/luckyBet/index.vue'
import ActivitySign from '@/views/activity/sign/index.vue'
import ActivityLevleSignIn from '@/views/activity/levelSignIn/index.vue'
import ActivityAppreciation from '@/views/activity/appreciation/index.vue'
import ActivityMysterious from '@/views/activity/mysterious/index.vue'
import ActivityAppreciationMultiDay from '@/views/activity/appreciationMultiDay/index.vue'
import ActivityInviteCpf from '@/views/activity/inviteCpf/index.vue'
import InviteCpfRecordPage from '@/views/activity/inviteCpf/components/record/index.vue'
import RechargePromotionPage from '@/views/activity/rechargePromotion/style_0/index.vue'
import ActivityRescuePage from '@/views/activity/rescue/index.vue'
import CommissionActivity from '@/views/activity/commission/index.vue'
import CommissionActivityDetails from '@/views/activity/commission/details.vue'
import MyExclusive from '@/views/activity/newUserExclusive/index.vue'
import ReferralRewardsNew from '@/views/activity/referralRewardsNew/index.vue'
import ReferralRewardsNewDetails from '@/views/activity/referralRewardsNew/detail.vue'
import ActivityWheelPage from '@/views/activity/wheel/index.vue'
import ActivityRechargePage from '@/views/activity/recharge/index.vue'

// 活动名称常量
export const ActivityNames = {
  'RedPacket': 'RedPacket',
  'AssistanceCash': 'AssistanceCash',
  'luckyBet': 'luckyBet',
  'SignIn': 'SignIn',
  'SignInVolume': 'SignInVolume',
  'memberReward': 'memberReward',
  'mysteryReward': 'mysteryReward',
  'CommissionReward': 'CommissionReward',
  'MemberRewardMultiDay': 'MemberRewardMultiDay',
  'Assistance': 'Assistance',
  'CPFActivity': 'CPFActivity',
  'WalletUserActivity': 'WalletUserActivity',
  'RechargePromotion': 'RechargePromotion',
  'NewUserExclusive': 'NewUserExclusive',
  'ReferralRewardsNew': 'ReferralRewardsNew',
  'LuckyWheel': 'LuckyWheel',
  'Recharge': 'Recharge',
} as const

const activityRoutes: Array<RouteRecordRaw> = [
  {
    // 红包雨活动
    path: `/activity/${ActivityNames.RedPacket}/:id`,
    component: ActivityRedPacketPage,
  },
  {
    // 助力金活动
    path: `/activity/${ActivityNames.AssistanceCash}/:id`,
    component: ActivityAssistancePage,
  },
  {
    // 幸运投注单
    path: `/activity/${ActivityNames.luckyBet}/:id`,
    component: LuckyBetPage,
  },
  {
    // 签到活动
    path: `/activity/${ActivityNames.SignIn}/:id`,
    component: ActivitySign,
  },
  {
    // 签到奖励
    path: `/activity/${ActivityNames.SignInVolume}/:id`,
    component: ActivityLevleSignIn,
  },
  {
    // 会员答谢
    path: `/activity/${ActivityNames.memberReward}/:id`,
    component: ActivityAppreciation,
  },
  {
    // 神秘彩金
    path: `/activity/${ActivityNames.mysteryReward}/:id`,
    component: ActivityMysterious,
  },
  {
    // 佣金活动
    path: `/activity/${ActivityNames.CommissionReward}/:id`,
    component: CommissionActivity,
  },
  {
    // 佣金活动详情
    path: `/activity/${ActivityNames.CommissionReward}/details/:id`,
    component: CommissionActivityDetails,
  },
  {
    // 会员答谢(多日)
    path: `/activity/${ActivityNames.MemberRewardMultiDay}/:id`,
    component: ActivityAppreciationMultiDay,
  },
  {
    // 救援金活动
    path: `/activity/${ActivityNames.Assistance}/:id`,
    component: ActivityRescuePage,
  },
  {
    // CPF 邀请活动
    path: `/activity/${ActivityNames.CPFActivity}/:id`,
    component: ActivityInviteCpf,
  },
  {
    // CPF 邀请记录
    path: `/activity/${ActivityNames.CPFActivity}/record/:id`,
    component: InviteCpfRecordPage
  },
  {
    // 钱包 邀请活动
    path: `/activity/${ActivityNames.WalletUserActivity}/:id`,
    component: ActivityInviteCpf,
  },
  {
    // 钱包 邀请记录
    path: `/activity/${ActivityNames.WalletUserActivity}/record/:id`,
    component: InviteCpfRecordPage
  },
  {
    // 充值酬宾活动
    path: `/activity/${ActivityNames.RechargePromotion}/:id`,
    component: RechargePromotionPage
  },
  {
    // 新人专属活动
    path: `/activity/${ActivityNames.NewUserExclusive}/:id`,
    component: MyExclusive,
  },
  {
    // 邀请好友活动2
    path: `/activity/${ActivityNames.ReferralRewardsNew}/:id`,
    component: ReferralRewardsNew,
  },
  {
    // 邀请好友活动2详情
    path: `/activity/${ActivityNames.ReferralRewardsNew}/details/:id`,
    component: ReferralRewardsNewDetails,
  },
  {
    // 幸运转盘
    path: `/activity/${ActivityNames.LuckyWheel}/:id`,
    component: ActivityWheelPage,
  },
  {
    // 充值活动
    path: `/activity/${ActivityNames.Recharge}/:id`,
    component: ActivityRechargePage,
  },
]

export default activityRoutes
