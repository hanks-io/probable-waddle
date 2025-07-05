import type { ActivityRecordItem } from "@/api/activity/model";
import { ZVipReceiveType } from "@/enums/types";
import { ZLuckyWheelLotteryTicketGetType, ZNameType, ZRechargeConditionsType, ZTActivityTypes, ZActivityAwardType } from "@/enums/types/activity.type";
import { moneyConvertToClient, formatMoneyToShow } from "@/utils/custom";
import { useI18n } from '@/hooks/useI18n';
import { isJSONStr } from "@/utils/verify";
import { getActivityDefaultName } from "@/i18n/ruleHelper/activityRule";
import { useAppStore } from "@/store/app";

const { t } = useI18n();

// 获取奖金
export function getReward(source: ActivityRecordItem) {
    const { activityType, awardType, awardCount } = source;
    // 幸运转盘
    if (activityType === ZTActivityTypes.enum.LuckyWheel) {
        // 奖金
        if (awardType === ZActivityAwardType.enum.BALANCE) {
            return formatMoneyToShow(moneyConvertToClient(awardCount))
        }
        // 抽奖券
        else if (awardType === ZActivityAwardType.enum.LOTTERY_TICKET) {
            return `${t('activity.rewardTicket')}${awardCount}`
        }
        // 卡片
        else {
            return `${awardType.split('_')[2]}x${awardCount}`
        }
    }
    else if (activityType === ZTActivityTypes.enum.Agency) {
        if (source.minAwardCount || source.maxAwardCount) {
            const min = moneyConvertToClient(source.minAwardCount)
            const max = moneyConvertToClient(source.maxAwardCount)
            return `${formatMoneyToShow(min)}~${formatMoneyToShow(max)}`
        }
        return formatMoneyToShow(moneyConvertToClient(source.awardCount));
    }
    else {
      return formatMoneyToShow(moneyConvertToClient(source.awardCount));
    }
  }
  
const rewardTypeMap = {
    [ZTActivityTypes.enum.Assistance]: () => t('activity.assistance'),
    [ZTActivityTypes.enum.Agency]: () => t('activity.promotionBonus'),
    [ZTActivityTypes.enum.AssistanceCash]: () => t('viewsActivity.boostCash'),
    [ZTActivityTypes.enum.Rebate]: () => t('activity.Rebate'),
    [ZTActivityTypes.enum.SignIn]: () => t('activity.SignIn'),
    [ZTActivityTypes.enum.RedPacket]: () => t('viewsActivity.redEnvelope'),
    [ZTActivityTypes.enum.Custom]: () => t('activity.Custom'),
    [ZTActivityTypes.enum.MemberReward]: () => t('activity.appreciation'),
    [ZTActivityTypes.enum.MysteryReward]: () => t('option.activity:mysteryReward'),
    [ZTActivityTypes.enum.RedeemCode]: () => t('activity.redeem'),
    [ZTActivityTypes.enum.Other]: () => t('activity.other'),
    [ZTActivityTypes.enum.CommissionReward]: () => t('activity.commission01'),
    [ZTActivityTypes.enum.CPFActivity]: () => t('activity.cpfActivityName'),
    [ZTActivityTypes.enum.WalletUserActivity]: () => t('activity.cpfActivityName'),
    [ZTActivityTypes.enum.LuckyBet]: () => t('option.activity:luckyBet'),
    [ZTActivityTypes.enum.SignInVolume]: () => t('option.activity:signInVolumeReward'),
    [ZTActivityTypes.enum.MemberRewardMultiDay]: () => t('option.activity:memberRewardMultiDay'),
    [ZTActivityTypes.enum.NewUserExclusive]: () => t('option.activity:newUserExclusive'),
    [ZTActivityTypes.enum.ReferralRewardsNew]: () => t('option.activity:referralRewardsNew'),
};

const luckyWheelTicketTypeMap = {
    [ZLuckyWheelLotteryTicketGetType.enum.firstLogin]: () => t('activity.firstLogin'),
    [ZLuckyWheelLotteryTicketGetType.enum.firstRecharge]: () => t('activity.firstRecharge'),
    [ZLuckyWheelLotteryTicketGetType.enum.everyDayFirstRecharge]: () => t('activity.everyDayFirstRecharge'),
    [ZLuckyWheelLotteryTicketGetType.enum.recharge]: () => t('activity.singleRecharge'),
    [ZLuckyWheelLotteryTicketGetType.enum.cumulativeRecharge]: () => t('activity.cumulativeRecharge'),
    [ZLuckyWheelLotteryTicketGetType.enum.validBet]: () => t('activity.validBet'),
    [ZLuckyWheelLotteryTicketGetType.enum.cumulativeValidBet]: () => t('activity.cumulativeValidBet'),
};

const vipRewardTypeMap = {
    [ZVipReceiveType.enum.PROMOTION]: () => t('activity.promotion'),
    [ZVipReceiveType.enum.DAILY]: () => t('activity.dailyBonus'),
    [ZVipReceiveType.enum.WEEKLY]: () => t('activity.weeklyBonus'),
    [ZVipReceiveType.enum.MONTHLY]: () => t('activity.monthlyBonus'),
};

const rechargeRewardTypeMap = {
    [ZRechargeConditionsType.enum.FIRST]: () => t('activity.firstRecharge'),
    [ZRechargeConditionsType.enum.SUM]: () => t('activity.cumulativeRecharge'),
    [ZRechargeConditionsType.enum.SINGLE]: () => t('activity.singleRecharge'),
};

export function getRewardSource(source: ActivityRecordItem): string {
    const { activityType, remake, awardType } = source;

    // 幸运转盘特殊处理
    if (activityType === ZTActivityTypes.enum.LuckyWheel) {
        if (awardType === ZActivityAwardType.enum.LOTTERY_TICKET) {
            const type = remake?.level?.type as string;
            const amount = type === ZLuckyWheelLotteryTicketGetType.enum.firstLogin ? '' : formatMoneyToShow(moneyConvertToClient(remake?.triggerAmount));
            return `${luckyWheelTicketTypeMap[type]?.() ?? ''}${amount}`;
        }
        if (awardType === ZActivityAwardType.enum.BALANCE) {
            return remake?.type === 'exchange' ? t('activity.exchange') : t('activity.raffle');
        }
        return t('activity.raffle');
    }

    // VIP特殊处理
    if (activityType === ZTActivityTypes.enum.VIP) {
        const vipLevel = remake?.vipLevelInfo?.level ?? '';
        const type = remake?.arg?.type;
        return `vip${vipLevel}${vipRewardTypeMap[type]?.() ?? ''}`;
    }

    // 充值特殊处理
    if (activityType === ZTActivityTypes.enum.Recharge) {
        const type = remake?.type;
        const amount = formatMoneyToShow(moneyConvertToClient(remake?.amount));
        return `${rechargeRewardTypeMap[type]?.() ?? ''}${amount}`;
    }

    // 其它类型
    const handler = rewardTypeMap[activityType];
    return handler ? handler() : '';
}

// 获取活动名称
export function getActivityName(source: ActivityRecordItem, lang: string): string {
    if (source.activityType === ZTActivityTypes.enum.VIP) {
        return 'VIP'
    }
    else if (source.activityType === ZTActivityTypes.enum.Other) {
        return t('activity.other')
    }
    else if (source.activityType === ZTActivityTypes.enum.RedeemCode) {
        return t('activity.redeem')
    }
    if (source.activityNameType === ZNameType.enum.DEFAULT && isJSONStr(source.activityNameParams)) {
        const nameParams = JSON.parse(source.activityNameParams)
        source.activityName = getActivityDefaultName(lang, source.activityType, nameParams.variablesValue)
    }
    return source.activityName ?? 'Unknown';
}
