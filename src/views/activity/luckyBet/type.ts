export interface rewardConfigsType {
  condition: string
  count: number
  rewardAmount: string
  rewardLimit?: string
  uuid: string
  isShowRewardLimit: boolean
  rewardTypeIsFixed: boolean
  isContains: boolean
  
}


export interface receiveType {
  firstWord: string
  remainingText: string
  value: number | string
  id: string
}


export interface limitLevelType {
  conditionAmount: string
  rewardAmount: number
  uuid: string
}



export const statusList = ['RECEIVED', 'DISTRIBUTED', 'EXPIRED'] as const
export type StatusType = (typeof statusList)[number]
export interface RecordType {
  awardCount: string
  orderNoHead: string
  orderNoTail: string
  status: string
  id: string | number
  statusValue: StatusType
}

export const  rewardTypeList = ['BET_MULTIPLE', 'FIXED'] as const
export type RewardType = (typeof rewardTypeList)[number]

export const winTypeList = ['TAIL_NUMBER', 'CONSECUTIVE_NUMBER', 'CONTAINS_ANY_POSITION'] as const
export type TWinType = (typeof winTypeList)[number]


export const receiveCountTypeList = ['RECHARGE', 'BET',  'FIXED_COUNT'] as const
export type ReceiveCountType = (typeof receiveCountTypeList)[number]
