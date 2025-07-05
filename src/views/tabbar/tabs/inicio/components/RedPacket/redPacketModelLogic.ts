// 红包雨 弹窗逻辑层
import i18n from '@/i18n';
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { useActivityStore } from '@/store/activity';
import { showLoading } from '@/utils/loading'
import { hideLoading } from '@/utils/loading'
import { showPopup } from '@/hooks/ShowPopup'
import { useTenantStore } from '@/store/tenant'
import { activityApplyApi } from '@/api/activity'
import { getCurrentLocalTime } from '@/utils/date'
import { redPacketDetailApi } from '@/api/activity'
import { PopupType } from '@/components/Popup/data';
import { RedPacketDetailModel } from '@/api/activity/model'
import { ZTActivityTypes, ZValidCondition } from '@/enums/types/activity.type'
import { moneyConvertToClient, formatMoneyToShow } from '@/utils/custom'
import { Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { nextTick, computed, reactive, ref, watch } from 'vue'
import { emitter } from "@/utils/event";
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { throttleActivity } from '@/utils';

interface Params {
  props: any;
  emit: any;
}

export default function useRedPacketRainModelLogic({ props, emit }: Params) {
  const userStore = useUserStore() // 用户store
  const tenantStore = useTenantStore() // 租户store
  const appStore = useAppStore();
  const activityStore = useActivityStore() // 活动store

  const { t } = i18n.global;

  const visible = ref(false)                // 开启关闭弹窗
  const scrollEl = ref(null)
  const timer = ref(null);                   // 定时器
  const firstActiveIndex = ref(0)            // 可领取时间 索引位置
  const countdownTime = ref('');             // 初始值
  const showEnd = ref(false)                 // 倒计时状态 true 活动结束倒计时 false 活动开始倒计时
  const received = ref(true)                 // 领取成功
  const activityName = ref('')               // 活动名称
  const mineTime = ref([])                   // 活动时间数据
  const maxAmount = ref<number>(0)           // 最大红包值
  const roundMaxAmount = ref<number>(0);     // 每波最大奖励
  const maxJoinTimes = ref<number>(0);       // 最大参与次数
  const joinedTimes = ref<number>(0);        // 已参与次数
  const screenHeight = ref(window.innerHeight);  // 屏幕高度
  const activityTimes = ref<number>(0);      // 红包雨活动一天有几次活动
  const joinType = ref<string>('');           // 参与类型

  const currentObj = reactive<{              // 当前商户时间(时分秒)
      todayHours: any,
      todyMinutes: any,
      todySecond: any
  }>({
      todayHours: '',
      todyMinutes: '',
      todySecond: '',
  })
  const redPacketDetails = reactive<RedPacketDetailModel>({})     // 红包雨详情信息

  const activityRule = computed(() => {// 活动规则
    const list: [{ text: string }] = [
        { text: `${t('viewsTabbar.mineText2', { num: roundMaxAmount.value })}` },
        { text: joinType.value === ZValidCondition.enum.RECHARGE ? `${t('viewsTabbar.mineText31')}` : `${t('viewsTabbar.mineText3')}` },
        { text: `${t('viewsTabbar.mineText4')}` }
    ]
    return list;
  })

  const joinBtnText = computed(() => {
    return received.value ? t('activity.redPacket3') : t('viewsActivity.mined')
  })

  const showReceiveBtn = computed(() => {
    if (ZValidCondition.enum.RECHARGE === joinType.value) {
        return maxJoinTimes.value ? joinedTimes.value < maxJoinTimes.value : true;
    }
    return true;
  })

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy)                     // 当前商户货币
  const isIpad = computed(() => screenHeight.value <= 600)                                  // 机型高度小于600

  // 监听是否打开红包雨详情
  watch(() => props.openRedModel,(val) => {
      visible.value = val
      if (val) {
          initPage()
      }
  },{ deep: true, immediate: true })

  async function initPage() {
      if (!visible.value) return
      // 获取详情 赋值操作
      await showLoading()
      const res  = await redPacketDetailApi(Number(props.activityId));
      activityStore.redPacketDetail = res;
      if (res?.multilingual) {
        const language = (await appStore.getLocale()) as Language
        const multilingual = res.multilingual as Record<string, string>;
        activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.RedPacket);
      }
      received.value = res?.canReceive;
      maxAmount.value = moneyConvertToClient(res?.maxAmount);
      roundMaxAmount.value = formatMoneyToShow(moneyConvertToClient(res?.roundMaxAmount));
      maxJoinTimes.value = res?.dailyMaxCount;
      joinedTimes.value = res?.receiveCount;
      activityTimes.value = res?.timeConfig?.length;
      joinType.value = res?.JoinTypes;
      Object.assign(redPacketDetails,res);
      // 计算显示倒计时内容
      const today = getCurrentLocalTime('HH-mm-ss').split('-');         // 获取用户时区时间
      const todayHours = Number(today[0]);                              // 获取当前小时
      const todyMinutes = Number(today[1]);                             // 获取当前分钟
      const todySecond = Number(today[2]);                              // 获取当前秒
      Object.assign(currentObj,{ todayHours,todyMinutes,todySecond });
      const selectHour = todayHours == 24 ? 0 : todayHours;
      const dateInfo = res?.timeConfig.find(item => item.hour == selectHour); // 查找当前时间有无红包雨
      if (dateInfo?.hour || dateInfo?.hour == 0) {                            // 当前时间一红包雨
          const durationInStamp =  dateInfo.durationIn * 60 * 1000;           // 活动配置分钟的时间戳
          const timestamp = (todyMinutes * 60 + todySecond) * 1000;           // 当前时间分秒的时间戳
          const endStamp = durationInStamp - timestamp;
          if (endStamp > 0 && dateInfo.hour == todayHours) {                  // 活动已经开始：后台配置时间戳 大于当前分钟秒数时间戳  在结束时间范围内
              showEnd.value = true                                            // 状态-结束倒计时
              startCountdown(endStamp/1000);                                  // 显示倒计时
          } else {                                                            // 后台配置时间戳 小于等于当前分钟秒数时间戳   红包雨活动已经结束
              handleEnxTime()
          }
      } else {
          handleEnxTime()
      }
    handleMineTime()
  }

  // 处理需求显示可领取时间段
  function handleMineTime() {
      const newArr = []
      const { timeConfig } = redPacketDetails
      if (timeConfig.length) {
          timeConfig.forEach(item => {
              let newObj: any = {text: '', isDis: false }
              const oldHour = item.hour < 10 ? '0' + item.hour : item.hour
              const oldDuration = item.durationIn < 10 ? '0' + item.durationIn : item.durationIn
              item.hour = item.hour < 10 ? '0' + item.hour : item.hour
              item.durationIn = item.durationIn < 10 ? '0' + item.durationIn : item.durationIn
              if (item.durationIn == 60) {
                  item.durationIn = '00'
                  item.hour =  Number(item.hour) + 1
              }
              item.hour =  Number(item.hour) < 10 ? '0' + Number(item.hour) : item.hour
              newObj.text = oldHour + ':' + '00' + '-' + item.hour + ":" + item.durationIn
              newObj.isDis = oldHour < currentObj.todayHours || (oldHour == currentObj.todayHours && oldDuration < currentObj.todyMinutes)
              newArr.push(newObj)
          })
      }
      mineTime.value = newArr.sort((a,b) => Number(a.text.slice(0,2)) - Number(b.text.slice(0,2)))
      // 计算显示红包雨时间滚动高度
      firstActiveIndex.value = mineTime.value.findIndex(item => !item.isDis)
      nextTick(() => {
          setTimeout(()  => {
              const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
              const remValue = Math.floor((firstActiveIndex.value / 3)) * 1.0625;
              const pixelValue = rootFontSize * remValue;
              scrollEl.value.scrollTop = pixelValue;
          },500)
      })
  }

  // 处理为未找到时情况
  function handleEnxTime() {
      const { timeConfig } = redPacketDetails
      const today = getCurrentLocalTime('HH-mm-ss').split('-');         // 获取用户时区时间
      const todayHours = Number(today[0]);                              // 获取当前小时
      const todyMinutes = Number(today[1]);                             // 获取当前分钟
      const todySecond = Number(today[2]);                              // 获取当前秒
      Object.assign(currentObj,{ todayHours,todyMinutes,todySecond });
      const selectHour = todayHours + 1 == 24 ? 0 : todayHours + 1;
      const nextDate = timeConfig.find(item => item.hour == selectHour)
      if (nextDate?.hour || nextDate?.hour == 0) {                      // 向下找一小时 有活动未开始
          showEnd.value = false                                         // 状态-开始倒计时
          const findStamp = 60 *  60 * 1000;
          const timestamp = (todyMinutes * 60 + todySecond) * 1000; 
          const endTimeStamp = findStamp - timestamp 
          startCountdown(endTimeStamp/1000)
      }
  }

  // 处理倒计时时间
  function startCountdown(second: any) {
      const endTime = Date.now() + second * 1000;
      clearInterval(timer.value)
      timer.value = setInterval(() => {
          const secondsLeft = Math.round((endTime - Date.now()) / 1000);
          if (secondsLeft <= 0) {
              clearInterval(timer.value);
              countdownTime.value = '';
              initPage()
          } else {
              const hours = Math.floor(secondsLeft / 3600);
              const minutes = Math.floor((secondsLeft % 3600) / 60);
              const seconds = secondsLeft % 60;
              countdownTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          }
      }, 1000);
  }

  // 开采按钮 click 事件
  const rewardModalHandle = throttleActivity(async () => {
      if (!showEnd.value || !received.value) return
      await showLoading()
      try {
          const res = await activityApplyApi( {id: props.activityId,applyInfo: {type: ZTActivityTypes.enum.RedPacket,info:{ userId: userStore.user?.userId  }  } } )
          if (res?.result && !res?.allMark) {
            return validationActivityClaimLimits(res, PopupType.BONUS, activityName.value);
          }
          if (res.awardType && res.awardType == 'BALANCE') {   // 领取成功
              const msg = res.redPacketamount ? t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(res.redPacketamount) }) : t('activity.redPacket12')
              received.value = false;
              showPopup({ type: PopupType.BONUS, msg })
              setTimeout(() => {
                  userStore.setAssets()
              },1000)
          }
          emitter.emit('activity/redPacket-receive');
          await initPage();
      } catch (error) {
          console.log(error,'首页开采');
      } finally {
          hideLoading()
      }
  })


  // 关闭model窗
  function closeModelClick() {
      emit('closeModel')
  }

  return {
    visible,
    scrollEl,
    countdownTime,
    showEnd,
    received,
    activityName,
    mineTime,
    maxAmount,
    activityRule,
    isIpad,
    activityTimes,
    closeModelClick,
    rewardModalHandle,
    joinBtnText,
    showReceiveBtn,
  }

}
