import { getTheme } from '@/theme/hooks'
import { moneyConvertToClient } from "@/utils/custom";

/**
 * @description 多级分销 代理级别图标
 */
export const mlmAgentLevelIcon = [
  'mlm-level0',
  'mlm-level1',
  'mlm-level2',
  'mlm-level3',
  'mlm-level4',
  'mlm-level5',
  'mlm-level6',
]

/**
 * @description 多级分销 代理等级名称
 */
export const mlmAgentLevelName = [
  'mlmAgent.agentLevelNmae0',
  'mlmAgent.agentLevelNmae1',
  'mlmAgent.agentLevelNmae2',
  'mlmAgent.agentLevelNmae3',
  'mlmAgent.agentLevelNmae4',
  'mlmAgent.agentLevelNmae5',
  'mlmAgent.agentLevelNmae6',
]

/**
 * @description 多级分销 排行榜前三骨架数据
 */
export const topThreeLoadList = [
  {
    topImg: '/first/agent/topBoardImg0.png',
    avatar: '/first/svg/load-avatar.svg',
    userId: '84**23',
    totalCommission: 0
  },
  {
    topImg: '/first/agent/topBoardImg1.png',
    avatar: '/first/svg/load-avatar.svg',
    userId: '85**23',
    totalCommission: 0
  },
  {
    topImg: '/first/agent/topBoardImg2.png',
    avatar: '/first/svg/load-avatar.svg',
    userId: '86**23',
    totalCommission: 0
  },
]

/**
 * @description 多级分销 其他排行榜信息架数据
 */
export const ohterBoardLoadList = [
  {
    avatar: '/first/svg/load-avatar.svg',
    userId: '91**22',
    totalCommission: 0
  },
  {
    avatar: '/first/svg/load-avatar.svg',
    userId: '92**24',
    totalCommission: 0
  },
  {
    avatar: '/first/svg/load-avatar.svg',
    userId: '93**25',
    totalCommission: 0
  },
  {
    avatar: '/first/svg/load-avatar.svg',
    userId: '94**26',
    totalCommission: 0
  },
  {
    avatar: '/first/svg/load-avatar.svg',
    userId: '95**27',
    totalCommission: 0
  },
  {
    avatar: '/first/svg/load-avatar.svg',
    userId: '96**28',
    totalCommission: 0
  },
]

// 处理多皮肤头像问题
export const handleCurrentSkinGender = (gender: string) => {
  if (!gender) return 'male_1.jpg'
  const avatarGender = gender.split('_');
  const lastStr = avatarGender[avatarGender.length -1];
  const currentGender = avatarGender.length == 3 ? avatarGender[1] : avatarGender[0];
  const isMale = ['male', 'first_male'].includes(currentGender);
  switch (getTheme().skin) {
    case 'default':
      return isMale ? `male_${lastStr}` : `female_${lastStr}`
    case 'first':
    case 'second':
      return isMale ? `first_male_${lastStr}` : `first_female_${lastStr}`
    default:
      return gender
  }
}

// 处理代理级别条件选择
export const handleAgentLevelItem = (name: string, value: number) => {
  let val = value
  if (name != 'count') {
    val = value >= 0 ? moneyConvertToClient(value) : value;
  }
  switch (name) {
    case 'count':                        // 成员数量
      return { name: 'membersCount', value: val };
    case 'totalLineRecharge':            // 代理线累计充值金额
      return { name: 'agentLevelCondition1', value: val };
    case 'dayLineRecharge':              // 当日代理线充值金额
      return { name: 'agentLevelCondition2', value: val };
    case 'dayDirectRecharge':            // 当日直属充值金额
      return { name: 'agentLevelCondition3', value: val };
    case 'dayTeamRecharge':              // 当日团队充值金额
      return { name: 'agentLevelCondition4', value: val };
    case 'totalDirectRecharge':          // 直属累计充值金额
      return { name: 'agentLevelCondition5', value: val };
    case 'totalTeamRecharge':            // 团队累计充值金额
      return { name: 'agentLevelCondition6', value: val };
    case 'dayLineValidBet':              // 当日有效投注
      return { name: 'agentLevelCondition7', value: val };
    case 'dayDirectValidBet':            // 当日直属有效投注
      return { name: 'agentLevelCondition8', value: val };
    case 'dayTeamValidBet':              // 当日团队有效投注
      return { name: 'agentLevelCondition9', value: val };
  }
}

