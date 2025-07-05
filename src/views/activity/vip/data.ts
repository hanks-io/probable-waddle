import { ActivityVIPInfoModel } from "@/api/activity/model";
import { moneyConvertToClient } from "@/utils/custom";
import { useVipStore } from "@/store/vip";

export interface VIPLevelInfo {
    curVipLevel: number, // 当前VIP等级
    nextVipLevel: number, // 下一级VIP等级
    rechargeNeed: number, // 晋级再充值
    betNeed: number, // 晋级再投注
    rechargeRequirements: number, // 下一级投注要求
    betRequirements: number, // 下一级投注要求
    curRechargeAmount: number, // 当前充值额
    curBetAmount: number, // 当前投注额
    rechargeProgress: number, // 充值进度
    betProgress: number, // 投注进度
    firstLevelProgress: number, // 投注/充值合并进度条
}

/**
 * @description 格式化VIP等级信息
 * @param sourceData 服务返回数据
 * @param vipLevelInfo 格式化后的数据
 */
export function formatVipLevelInfo(sourceData: ActivityVIPInfoModel, vipLevelInfo: VIPLevelInfo) {
    const { currentVipLevel, nextVipLevel, totalRechargeAmount, totalValidBetAmount, vipLevelCount } = sourceData;
    useVipStore().vipLevelCount = vipLevelCount;
    const betNeed = moneyConvertToClient(Number(nextVipLevel?.promotionBet) - Number(totalValidBetAmount));
    const rechargeNeed = moneyConvertToClient(Number(nextVipLevel?.promotionRecharge ?? 0) - Number(totalRechargeAmount));
    vipLevelInfo.curVipLevel = currentVipLevel.level;
    vipLevelInfo.nextVipLevel = nextVipLevel?.level;
    vipLevelInfo.rechargeNeed = rechargeNeed > 0 ? rechargeNeed : 0;
    vipLevelInfo.betNeed = betNeed > 0 ? betNeed : 0;
    vipLevelInfo.curRechargeAmount = moneyConvertToClient(totalRechargeAmount);
    vipLevelInfo.curBetAmount = moneyConvertToClient(totalValidBetAmount);

    if (nextVipLevel) {
      vipLevelInfo.rechargeRequirements = moneyConvertToClient(Number(nextVipLevel?.promotionRecharge ?? 0));
      vipLevelInfo.betRequirements = moneyConvertToClient(Number(nextVipLevel?.promotionBet ?? 0));
      vipLevelInfo.rechargeProgress = vipLevelInfo.curRechargeAmount / vipLevelInfo.rechargeRequirements;
      vipLevelInfo.betProgress = vipLevelInfo.curBetAmount / vipLevelInfo.betRequirements;
      // 新皮肤同时统计充值/投注为晋级条件两者各种百分之五十
      const rechargeProgressCount: any = vipLevelInfo.rechargeProgress >= 1 ? 1 : vipLevelInfo.rechargeProgress;
      const betProgressCount: any = vipLevelInfo.betProgress >= 1 ? 1 : vipLevelInfo.betProgress;
      vipLevelInfo.firstLevelProgress = (rechargeProgressCount + betProgressCount) / 2;
    }
    // 达到最大等级
    else {
      vipLevelInfo.rechargeRequirements = 999999;
      vipLevelInfo.betRequirements = 999999;
      vipLevelInfo.curRechargeAmount = 999999;
      vipLevelInfo.curBetAmount = 999999;
      vipLevelInfo.rechargeProgress = 1;
      vipLevelInfo.betProgress = 1;
      vipLevelInfo.firstLevelProgress = 1;
    }
}

/**
 * @description first 皮肤VIP图标名称
 */
export const firstVipIcon = [
  'vip1',
  'vip2',
  'vip3',
  'vip4',
  'vip5',
  'vip6',
  'vip7',
  'vip8',
  'vip9',
  'vip10',
  'vip11',
  'vip12',
  'vip13',
  'vip14',
  'vip15',
  'vip16',
  'vip17',
  'vip18',
  'vip19',
  'vip20',
  'vip21',
  'vip22',
  'vip23',
  'vip24',
  'vip25',
  'vip26',
  'vip27',
  'vip28',
  'vip29',
  'vip30',
]

/**
 * @description first 皮肤我的VIP背景
 */
export const firstVipMyBg = [
  'levelBg1',
  'levelBg2',
  'levelBg3',
  'levelBg4',
  'levelBg5',
  'levelBg6',
]

/**
 * @description first 皮肤我的VIP详情背景图
 */
export const firstVipDetailBg = [
  'vipDetail1',
  'vipDetail2',
  'vipDetail3',
  'vipDetail4',
  'vipDetail5',
  'vipDetail6',
]

/**
 * @description first 皮肤VIP等级text背景颜色
 */
export const firstVipTextBg = [
  'vipTextSvg1',
  'vipTextSvg2',
  'vipTextSvg3',
  'vipTextSvg4',
  'vipTextSvg5',
  'vipTextSvg6',
]

/**
 * @description default 皮肤VIP等级text颜色
 */
export const defaultVipIcon = [
  'vip0~10',
  'vip11~20',
  'vip21~30',
  'vip31~40',
  'vip41~50',
  'vip51~60',
  'vip61~70',
  'vip71~80',
  'vip81~90',
  'vip91~100',
]

/**
 * @description default 皮肤VIP等级text颜色
 */
export const defaultVipTextColor = [
  '#757575',
  '#CE7E36',
  '#6788A4',
  '#8B6CB5',
  '#FF8F01',
  '#006EF1',
  '#F41086',
  '#F53B14',
  '#F014F5',
  '#FF0501',
]
