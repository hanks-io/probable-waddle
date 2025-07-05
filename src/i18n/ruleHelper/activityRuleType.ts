
export type Language = "zh-CN" | "en-US" | "pt-BR";
export type RechargeType = "FIRST" | "SINGLE" | "SUM";
export type ResetType = "NONE" | "DAILY" | "WEEKLY";
export type RewardType = "FIXED" | "RANGE";
export type IncludeOrExclude = "EXCLUDE_GIFT" | "NORMAL";
export type AwardType = "ACTIVITY" | "BALANCE";         //手动领取(ACTIVITY)、自动领取(BALANCE)
export type ExpiredAwardType = "ABANDONED" | "AUTO";    // 过期作废(ABANDONED)、过期自动派发(AUTO)
export type AgencyTypes = "ALL" | "NEW_REGISTER";
export type RebateType = 'RECHARGE' | 'NORECHARGE';

export interface RechargeVariables {
    rechargeType: RechargeType; // 首充、单笔、累计
    resetType: ResetType;       // 重置类型
    highestReward: number;      // 最高奖励金额
    multiplier: number;         // 稽核倍数
    utcValue: string;           // 时区
    timeValue: string;          // 时间
}
export interface AssistanceVariables {
    lowestLoss: number;                  // 最低亏损金额
    highestReward: number;               // 最高奖励金额
    rewardType: RewardType;              // 固定、比例
    includeOrExclude: IncludeOrExclude;  // 包含优惠、不包含优惠
    awardType: AwardType;                // 手动领取、自动领取
    expiredAwardType: ExpiredAwardType;  // 过期作废、过期自动派发
    multiplier: number;                  // 稽核倍数
    utcValue: string;                    // 时区
    timeValue: string;                   // 时间
}
export interface RedPacketVariables {
    times: number;             // 每日循环次数
    duration: number;          // 每次开启持续时间
    rewardCount: number;       // 蕴藏水晶数量
    multiplier: number;        // 稽核倍数
    bettingOnly: string;       // 投注限制平台
    utcValue: string;          // 时区
    timeValue: string;         // 时间
}

export interface AgencyVariables {
    highestReward: number;     // 最高奖励金额
    multiplier: number;        // 稽核倍数
    utcValue: string;          // 时区
    timeValue: string;         // 时间
    agencyType: AgencyTypes;   // 直属限制
}
export interface RebateVariables {
    lowestRebateBet: number;       // 最低有效投注
    rechargeLimit: number;         // 最低充值
    highestReward: string;         // 最高奖励金额
    multiplier: number;            // 稽核倍数
    rebateType: RebateType;        // 充值限制
    utcValue: string;              // 时区
    timeValue: string;             // 时间
}

export interface AssistanceCashVariables {
    totalAmount: number;          // 抽奖累计总金额
    highestReward: string;        // 最高奖励金额
    multiplier: number;           // 稽核倍数
    utcValue: string;             // 时区
    timeValue: string;            // 时间
}

export interface LuckyWheelVariables {
    exchangeReward: number;       // 兑换奖励
    resetType: ResetType;         // 重置类型
    multiplier: number;           // 稽核倍数
    utcValue: string;             // 时区
    timeValue: string;            // 时间
}

export interface SignInVariables {
    highestReward: number;        // 最高奖励金额
    multiplier: number;           // 稽核倍数
    utcValue: string;             // 时区
    timeValue: string;            // 时间
}
