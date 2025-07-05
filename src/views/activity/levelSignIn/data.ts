// 签到奖励

export type UserLevelInfo = {
  level: string;
  levelName: string;
}

export type LevelConfig = UserLevelInfo & {
  betAmount: number;
  isDone: boolean;
}

export type RewardStatus = 'canDo' | 'done' | 'expired' | 'unexpired'

export type RewardConfig = {
  day: number;
  reward: number;
  status: RewardStatus;
}
