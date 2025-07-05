import { getCustomerActivityId, delay, convertMoneyToShow,showToast,showLoading } from '@/utils'
import { modalController } from '@ionic/vue'
import { PopupType } from '@/components/Popup/data'
import { showPopup } from "@/hooks/ShowPopup"
import { useRouter } from 'vue-router'
import { ref, markRaw, defineAsyncComponent, ComponentPublicInstance } from 'vue'
import { GRID_CONFIG, GRID_PRIZES, INFO_CONFIG, labelActive, refreshAnimationWithImage } from './configs'
import { getTheme } from '@/theme/hooks'
import { getNewUserExclusiveApi,activityApplyApi } from '@/api/activity'
import { generateDefultRules, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { t } from '@/i18n'
import { throttleActivity, cloneDeep, delay } from '@/utils';
import { ActivityNames } from '@/router/modules/activity'


// 获取活动数据
const getActivityData = async (id: number) => {
  showLoading();
  const activityStore = useActivityStore();
  const language = await useAppStore().getLocale();
  const token = await useAppStore().getToken();
  const res = await getNewUserExclusiveApi(id)
  const activityName = await getCurrentActivityName(res?.multilingual, language, ZTActivityTypes.enum.NewUserExclusive)
  const ruleType = res?.multilingual?.ruleType
  const canRound = res?.canRound
  const awardAmount = res?.awardAmount
  const rewardList = res?.config?.rewardList
  const uuid = res?.levelId
  const mainMediaShare = res?.config?.mainMediaShare === 'OFF' ? false : true
  let defaultRule: string[] = []
  let customRule: string[] = []
  if (ZActivityRuleType.enum.DEFAULT === ruleType) {
    const ruleParam = JSON.parse(res?.multilingual?.rule)
    const ruleStr = generateDefultRules(language, ZTActivityTypes.enum.NewUserExclusive, ruleParam.variablesValue)
    defaultRule = ruleStr.split("\n")
      .map(item => item.replace(/^\d\./, ""))
      .filter(item => item !== '')
    defaultRule.shift()
  } else {
    customRule = res?.multilingual?.rule?.split("\n")
  }
  if(token && awardAmount>0){ // 有token且有奖励 
    nextTick(() => {
      activityStore.setNewUserExclusivePopup(1)
    })
  }

  return {
    canRound,
    rewardList,
    activityName,
    ruleType,
    defaultRule,
    customRule,
    awardAmount,
    uuid,
    mainMediaShare
  }
}

export const useLogic = (style?: string) => {
  const router = useRouter()
  const tenantStore = useTenantStore()
  const userStore = useUserStore()
  const { id } = getCustomerActivityId()
  const { theme } = getTheme()
  const activityStore = useActivityStore();
  const cy = tenantStore.tenantInfo?.merchantCy
  const list = ref([]);
  const mockreduceLabelActiver = ref(0)
  const amountIndex = ref(-1)
  const once = ref(true)
  const ruleType = ref('')
  const activityName = ref('')
  const defaultRule = ref<string[]>([])
  const customRule = ref('')
  const cloneList = ref([])
  const cancelAnimation = ref(false)
  const lastIndex = ref(-1)
  const mainMediaShare = ref(false)
  const blocks = GRID_CONFIG(theme).blocks
  const prizes = ref(GRID_PRIZES(theme, []))
  const activeStyle = GRID_CONFIG(theme).activeStyle

  const prizesRepint = (res:{text:string,uuid:string}, list:any[]) => {
    labelActive.value = res
    prizes.value = GRID_PRIZES(theme, list)
  }
  // 初始化活动数据
  getActivityData(id).then(data => {
    console.log('init data')
    activityName.value = data.activityName
    ruleType.value = data.ruleType
    defaultRule.value = data.defaultRule
    customRule.value = data.customRule
    once.value = !data.canRound
    mainMediaShare.value = data.mainMediaShare
    prizesRepint({
      text: convertMoneyToShow(data?.awardAmount, 0)?.toString(),
      uuid: data?.uuid
    }, data?.rewardList)
    list.value = data?.rewardList
    cloneList.value = cloneDeep(list.value)
  })

  // 开始抽奖
  const onStart = async () => {
    once.value = true
    refreshAnimationWithImage.includes(theme) && getReduceLabelActive() 
    const res = await receiveReward()
    if (res.awardData) {
      const { rewardAmount, uuid } = res.awardData
      const randomIndex = list.value?.findIndex(item => item.uuid === uuid);
      amountIndex.value = rewardAmount
      lastIndex.value = randomIndex
      console.warn('randomIndex',randomIndex)
      return randomIndex
    } else {
      cancelAnimation.value = true
      showToast(res)
      return null
    }
  }

  const getReduceLabelActive = () => {  // todo 一个动画抽奖的效果 抹去插件本身的动画效果
    const DURATION = 5000;
    const ACCELERATION_PHASE = 0.5;
    const TRANSITION_START = 0.85;
    const TRANSITION_END = 0.95;
    
    let startTime = Date.now();
    let lastUpdateTime = 0;
    let currentIndex = mockreduceLabelActiver.value;
    
    const getEasingInterval = (progress: number) => {
      const baseInterval = 50;
      let interval;
      
      if (progress <= ACCELERATION_PHASE) {
        const easeIn = Math.pow(progress / ACCELERATION_PHASE, 3);
        interval = baseInterval * (0.3 + (1 - easeIn) * 0.7);
      } else {
        const easeOut = 1 - Math.pow(1 - (progress - ACCELERATION_PHASE) / ACCELERATION_PHASE, 3);
        interval = baseInterval * (0.3 + easeOut * 0.7);
      }
      
      return interval * (0.9 + Math.random() * 0.2);
    };
    
    const updatePrize = (index: number) => {
      const item = cloneList.value[index];
      prizesRepint({
        text: convertMoneyToShow(item?.rewardAmount, 0)?.toString(),
        uuid: item?.uuid
      }, cloneList.value);
    };
    
    const getSafeIndex = (index: number) => {
      const length = cloneList.value.length;
      if (index < 0) return index + length;
      if (index >= length) return index % length;
      return index;
    };
    
    const animate = () => {
      if (cancelAnimation.value) {
        prizesRepint({ text: '', uuid: '' }, cloneList.value);
        return;
      }
      
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      
      if (currentTime - lastUpdateTime >= getEasingInterval(progress)) {
        if (progress < TRANSITION_START) {
          // 正常循环阶段
          const item = cloneList.value[mockreduceLabelActiver.value];
          mockreduceLabelActiver.value = (mockreduceLabelActiver.value + 1) % cloneList.value.length;
          currentIndex = mockreduceLabelActiver.value;
          updatePrize(currentIndex);
          lastUpdateTime = currentTime;
        } else if (progress < TRANSITION_END) {
          // 过渡阶段
          const targetIndex = lastIndex.value >= 0 ? lastIndex.value : 0;
          const transitionProgress = (progress - TRANSITION_START) / (TRANSITION_END - TRANSITION_START);
          const easeOut = 1 - Math.pow(1 - transitionProgress, 2);
          
          let distance = targetIndex - currentIndex;
          const length = cloneList.value.length;
          
          if (Math.abs(distance) > length / 2) {
            distance = distance > 0 ? distance - length : distance + length;
          }
          
          const newIndex = currentIndex + distance * easeOut * 0.2;
          updatePrize(getSafeIndex(Math.floor(newIndex)));
        } else {
          updatePrize(lastIndex.value);
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
    return mockreduceLabelActiver.value;
  };

  // 结束回调
  const endCallback = async (canRound: boolean,awardAmount:number = 0) => {
    await delay(600)
    if (!canRound) {
      once.value && onShowAmountPopup(awardAmount) 
    }
  }

  // 关闭弹窗
  const closePopup = async () => {
    const topModal = await modalController.getTop();
    if (topModal) {
      await modalController.dismiss();
    }
    userStore.isAlreadyDisplayRegisterReward = true;
    activityStore.showNewUserExclusivePopup = 2; // 通过返回键触发
  }

  // 充值处理
  const recharge = async () => {
    await closePopup()
    const bool = await useHandleRecharge()
    !bool && router.push('/main/entrar')
  }
  const amount = (value: number) => `<span style="color: #FFD700;"> ${cy}${convertMoneyToShow(value)} </span>`
  // 显示金额弹窗
  const onShowAmountPopup = (awardAmount:number = 0) => showPopup({
    type: PopupType.TIPS,
    showLeftBtn: true,
    showRightBtn: true,
    leftBtnText: t('viewsActivity.rechargePromotion16'),
    rightBtnText: t('main.cancel'),
    msg: t('activity.totalAmountView2',{amont: amount(awardAmount >0 ? awardAmount : amountIndex.value)}) ,
    leftBtnCallback: async () => {
      await closePopup()
      recharge()
    },
    rightBtnCallback: async () => {
      await closePopup()
    },
    reverseBtn: true
  })

  // 领取奖励
  const receiveReward = throttleActivity(async () => {
    let res = null
    try {
      res = await activityApplyApi({
        id: id,
        applyInfo: { type: ZTActivityTypes.enum.NewUserExclusive, info: { userId: userStore.user?.userId } }
      })
      console.log('receiveReward', res)
      once.value = true
    } catch (error) {
      //showToast(error)
      res = error.toString()
      once.value = false
    }
    return res
  })

  return {
    blocks,
    prizes,
    lucky_grid_button: { ...GRID_CONFIG(theme).button, click: onStart },
    closePopup,
    recharge,
    amountIndex,
    endCallback,
    once,
    activeStyle,
    theme,
    activityName,
    infoConfig: INFO_CONFIG(theme),
    defaultRule,
    customRule,
    ruleType,
    ZActivityRuleType,
    mainMediaShare
  }
}

export const useComponents = () => {
  const { activityConfig } = getTheme()
  const { defStyle } = getCustomerActivityId(activityConfig?.[ActivityNames.NewUserExclusive]?.template)
  const templList = {
    'style_0': () => import(`@/views/activity/newUserExclusive/style_0/index.vue`),
    'style_18': () => import(`@/views/activity/newUserExclusive/style_18/index.vue`),
  }
  return markRaw(defineAsyncComponent(templList[defStyle as keyof typeof templList])) as unknown as ComponentPublicInstance
}
