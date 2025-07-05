// 红包雨图标 逻辑层

import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { getCurrentLocalTime } from '@/utils/date'
import { redPacketDetailApi } from '@/api/activity'
import { RedPacketDetailModel } from '@/api/activity/model'
import { getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { IonImg } from '@ionic/vue';
import { ZTActivityTypes } from '@/enums/types/activity.type'
import { onMounted, computed, reactive, ref, watch, onUnmounted } from 'vue'
import { emitter } from "@/utils/event";
import { useRoute } from 'vue-router';
import { locale } from '@/i18n'

interface Params {
  props: any;
  emit: any;
}

export default function useRedPacketRainLogic({ props, emit }: Params) {
  const elementStore = useElementStore()  // 元素store
  const userStore = useUserStore()        // 用户store
  const activityStore = useActivityStore()// 活动store
  const appStore = useAppStore()          // app store
  const route = useRoute()                // 当前路由

  const timer = ref()               // 定时器
  const countdownTime = ref('')     // 初始值
  const showEnd = ref(false)        // 倒计时状态 true 活动结束倒计时 false 活动开始倒计时
  const received = ref(false)       // 领取成功
  const showRedPacket = ref(false)  // 显示内容区域
  const nameParams = ref(null)      // 活动名称参数
  const bgUrl = ref('')             // 背景图片
  const ifDefaultImg = ref(false)             // 是否显示默认背景图片
  const ifDefaultIndex = ref(-1)             // 显示默认的第几个背景图片
  const redPacketDetails = reactive<RedPacketDetailModel>({} as RedPacketDetailModel) // 红包雨详情信息  
  const activityName = computed(() => {
    let name = ''
    if (nameParams.value) {
      name = getCurrentActivityName(nameParams.value, locale.value, ZTActivityTypes.enum.RedPacket)
    }
    return name
  })// 活动名称
    
  const isToken = computed(() => appStore.token ? true : false)   // 是否未登录
  const tabBarHeight = computed(() => elementStore.tabBarHeight)  // 底部导航栏高度
  const showAnimation = computed(() => {
    return (received.value && showEnd.value && isToken.value) || (!isToken.value && showEnd.value)
  })

  // 监听是否其他页面切换到主页
  watch(() => route.path, (patch) => {
    if (patch === '/main/inicio') {
      // 只要发生变化-做局部更新
      updatePage()
    }
  })

  // created 生命周期
  updatePage(true)
  async function updatePage(isInit: boolean = false) {
    if (isToken.value) {
      await userStore.getUser() // 解决数据加载太快已登录未拿到用户信息情况
    }

    let res;
    if (isInit) {
      res = activityStore.redPacketDetail
    }
    else {
      try {
        res = await redPacketDetailApi(Number(props.activityId));
      } catch (error) {
        console.error('获取红包雨详情失败:', error);
        activityStore.requestActivityList(false);
      }
    }
    nameParams.value = res?.multilingual
    // activityName.value = getCurrentActivityName(res.multilingual, locale.value, ZTActivityTypes.enum.RedPacket)
    received.value = res.canReceive
    if(res?.appIconUrl) {
     if (res?.appIconUrl.includes('activityStar/redPacket/redPacket_')) {
      ifDefaultImg.value = true
      ifDefaultIndex.value = Number(res?.appIconUrl.split('activityStar/redPacket/redPacket_')[1].split('.')[0])
     }else{
      ifDefaultImg.value = false
     }
    }
    bgUrl.value = res?.appIconUrl || '/icons/minecart.png'
    Object.assign(redPacketDetails, res)
    const today = `${getCurrentLocalTime('HH-mm-ss')}`.split('-');  // 获取用户时区时间
    const todayHours = Number(today[0]);                            // 获取当前小时
    const todyMinutes = Number(today[1]);                           // 获取当前分钟
    const todySecond = Number(today[2]);                            // 获取当前秒
    const selectHour = todayHours == 24 ? 0 : todayHours;
    const dateInfo = res?.timeConfig.find((item: any) => item.hour == selectHour);  // 查找当前时间有无红包雨
    if (dateInfo?.hour || dateInfo?.hour == 0) {                                    // 当前时间一红包雨
      const durationInStamp = dateInfo.durationIn * 60 * 1000;                      // 活动配置分钟的时间戳
      const timestamp = (todyMinutes * 60 + todySecond) * 1000;                     // 当前时间分秒的时间戳
      const endStamp = durationInStamp - timestamp;
      if (endStamp > 0 && dateInfo.hour == todayHours) {                            // 活动已经开始：后台配置时间戳 大于当前分钟秒数时间戳  在结束时间范围内
        if (!received.value && isToken.value) {
          handleEnxtTime()                                                          // 已经领取 并且登录 向下找一个小时 找到显示开始倒计时 找不到关闭
        } else {
          showEnd.value = true                                                      // 状态-结束倒计时
          startCountdown(endStamp / 1000);                                          // 显示倒计时
          showRedPacket.value = true
        }
      } else {                                                                      // 后台配置时间戳 小于等于当前分钟秒数时间戳   红包雨活动已经结束
        handleEnxtTime()
      }
    } else {
      handleEnxtTime()
    }
  }

  // 处理为未找到时情况
  function handleEnxtTime() {
    const { timeConfig } = redPacketDetails
    const today = `${getCurrentLocalTime('HH-mm-ss')}`.split('-');    // 获取用户时区时间
    const todayHours = Number(today[0]);                              // 获取当前小时
    const todyMinutes = Number(today[1]);                             // 获取当前分钟
    const todySecond = Number(today[2]);                              // 获取当前秒
    const selectHour = todayHours + 1 == 24 ? 0 : todayHours + 1;
    const nextDate = timeConfig.find(item => item.hour == selectHour)
    if (nextDate?.hour || nextDate?.hour == 0) {                      // 向下找一小时 有活动未开始
      showEnd.value = false                                           // 状态-开始倒计时
      showRedPacket.value = true
      const findStamp = 60 * 60 * 1000;
      const timestamp = (todyMinutes * 60 + todySecond) * 1000;
      const endTimeStamp = findStamp - timestamp
      startCountdown(endTimeStamp / 1000)
    } else {
      emit('close')
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
        updatePage()
      } else {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        countdownTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  // 可领取 打开红包雨详情页面
  function clickPacket() {
    emit('openModel')
  }

  /**
   * @description 初始化页面
   */
  function initPageHandler() {
    updatePage()
  }


  onMounted(() => {
    emitter.on('activity/redPacket-receive', initPageHandler)
  })

  onUnmounted(() => {
    emit('close')
    clearInterval(timer.value)
    emitter.off('activity/redPacket-receive', initPageHandler)
  })

  return {
    activityName,
    showRedPacket,
    countdownTime,
    showAnimation,
    clickPacket,
    tabBarHeight,
    bgUrl,
    ifDefaultImg,
    ifDefaultIndex
  }
}
