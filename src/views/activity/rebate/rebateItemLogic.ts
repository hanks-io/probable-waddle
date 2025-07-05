// 返水活动item 逻辑层
import { computed } from 'vue';
import { moneyConvertToClient } from '@/utils/custom'
import { useActivityStore } from '@/store/activity';

export default function useRebateItemLogic({ props }: { props: any}) {
  const activityStore = useActivityStore(); // 活动store
  const upgrade = computed(() => calcUpgrade());                    // 升级所需有效投注
  const validBet = computed(() => calcValidBet());                  // 有效投注
  const rebateRate = computed(() => calcRebateRate());              // 当前返水比例
  const availableRebate = computed(() => calcAvailable());          // 可领取返水
  const maxRebateRate = computed(() => calcMaxRebateRate());        // 最高返水比例
  const nextRebateRate = computed(() => calcNextRebateRate());      // 下一级返水比例
  const validBetList = computed(() => activityStore.validBetList);  // 有效投注列表

  /**
   * @description 计算有效投注
   */
  function calcValidBet(gameType: string = props.gameType, platformId: number = props.item.platformId) {
    for (let key in validBetList.value) {
      if (key == gameType + '||' + platformId) {
        return validBetList.value[key] / 100;
      }
    }
    return 0;
  }

  /**
   * @description 计算当前返水比例
   */
  function calcRebateRate(item: any = props.item) {
    let rebateRate = 0;
    item.rebateRatioList.map(v=>v).sort((a: any, b: any) => a.conditionAmount - b.conditionAmount).forEach((item: any) => {
      if (item.conditionAmount <= validBet.value * 100) {
        rebateRate = item.rewardAmount / 100;
      }
    })
    return rebateRate;
  }

  /**
   * @description 计算下一级返水比例
   */
  function calcNextRebateRate(item: any = props.item) {
    let rebateRate = 0;
      item.rebateRatioList.sort((a: any, b: any) => b.conditionAmount - a.conditionAmount).forEach((item: any) => {
        if (item.conditionAmount > validBet.value * 100) {
          rebateRate = item.rewardAmount / 100;
        }
      })
    return rebateRate;
  }

  /**
   * @description 计算可领取返水
   */
  function calcAvailable() {
    return moneyConvertToClient(rebateRate.value * validBet.value);
  }

  /**
   * @description 计算升级所需有效投注
   */
  function calcUpgrade(item: any = props.item) {
    let upgrade = 0;
    item.rebateRatioList.sort((a: any, b: any) => b.conditionAmount - a.conditionAmount).forEach((item: any) => {
      if (item.conditionAmount/100 > validBet.value) {
        upgrade = item.conditionAmount/100;
      }
    })
    return upgrade;
  }

  /**
   * @description 计算最大返水比例
   */
  function calcMaxRebateRate(item: any = props.item) {
    let rebateRate = 0;
    item.rebateRatioList.forEach((item: any) => {
      if (item.rewardAmount > rebateRate) {
        rebateRate = item.rewardAmount / 100;
      }
    })
    return rebateRate;
  }
  return {
    upgrade,
    validBet,
    rebateRate,
    availableRebate,
    maxRebateRate,
    nextRebateRate,
    validBetList,
  }
}
