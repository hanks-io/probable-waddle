<!-- 任务列表 -->
<template>
  <div class="warpper">
    <div class="progress-board">
    </div>
    <div class="content">
      <div class="sidebar">
        <ion-segment ref="segment" mode="ios" v-model="sideValue" @ionChange="sideChange">
          <ion-segment-button v-for="item in segmentList" :key="item.type" :value="item.type">
            <ion-icon v-if="item.gradientIcon" :src="sideValue === item.type ? item.gradientIcon : item.icon" />
            <ion-icon v-else :class="{ check: sideValue === item.type }" :src="item.icon" />
            <ion-label :class="{ check: sideValue === item.type }" >{{ $t(`${item.name}`)}}</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-img class="separator" src="/images/task/bg-line.png" />
        <!-- 领取按钮 -->
        <ion-button class="outline-btn receive" @click="batchReceiveReward">
          {{ $t('task.000009') }}
        </ion-button>
        <!-- 记录按钮 -->
        <ion-button class="outline-btn record" @click="handleRecordClick">
          {{ $t('task.000010') }}
        </ion-button>
      </div>
      <div class="task-list" :style="props.style">
        <div v-for="taskInfo in taskList" :class="[taskInfo.rewardStatus === 'DISTRIBUTED' ? taskInfo.awardInfo?.isClaimable ? 'finish' : 'await' : 'unfinished', 'task-item']">
          <p class="title">{{ $t(`task.${taskInfo.taskTypeSub}`) }}</p>
          <div class="task-info">
            <div class="reward">
              <div class="bonus">
                <p class="label">{{ $t('task.000011') }}</p>
                <div class="box">
                  <span class="currency-icon">$</span>
                  <span class="number">{{ taskInfo.rewardText }}</span>
                </div>
              </div>
              <div v-if="false" class="liveness">
                <p class="label">{{ $t('task.000012') }}</p>
                <div class="box">
                  <ion-icon :src="'/images/task/icon-liveness.svg'"></ion-icon>
                  <span class="number">{{ taskInfo.rewardActiveScore }}</span>
                </div>
              </div>
            </div>
            <ion-button v-if="!taskInfo.rewardStatus" class="unset-btn outline-btn unfinished" @click="handleGotoClick(taskInfo)">
              {{ $t('task.000013') }}
              <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
            </ion-button>
            <template v-if="taskInfo.rewardStatus === 'DISTRIBUTED'">
              <ion-button v-if="!taskInfo.awardInfo?.isClaimable" :disabled="true" class="unset-btn outline-btn await">
                {{ $t('task.000015') }}
              </ion-button>
              <ion-button v-else class="unset-btn outline-btn finish" @click="receiveReward(taskInfo)">
                {{ $t('task.000004') }}
              </ion-button>
            </template>
          </div>
        </div>

        <section class="instructions" v-if="explanationList.length">
          <p class="label">{{ explanationList[0] }}</p>
          <aside class="content">
            <p class="item" v-for="(item, i) in explanationList.slice(1)">
              {{ item }}
            </p>
          </aside>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { arrowForwardOutline } from 'ionicons/icons';
import { IonIcon, IonSegment, IonSegmentButton, IonLabel, IonImg, IonButton } from '@ionic/vue';
import RookieTaskModal from "@/components/rookieTaskModal/index.vue"
import { PopupType } from '@/components/Popup/data';
import { ZTaskTypeEnumType, TaskTypeEnumSubMap } from '@/enums/types'
import { taskReceiveApi, taskBatchReceiveApi } from "@/api/task";
import { useTaskStore, TaskInfo } from '@/store/task'
import { useActivityStore } from '@/store/activity'
import { useTenantStore } from '@/store/tenant'
import { useSystemStore } from '@/store/system'
import { showLoading, hideLoading } from '@/utils'
import { generateDefultRules, Language } from '@/i18n/ruleHelper/activityRule'
import router from '@/router';
import { handleInstallAction,  iosInstallAction } from '@/pwa/hooks/useInstallPWAOrAPK';
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { throttleActivity } from '@/utils';

const props = defineProps({
  style: {
    type: Object,
    default: () => ({})
  }
})

const taskStore = useTaskStore()
const activityStore = useActivityStore();
const systemStore = useSystemStore();
const tenantStore = useTenantStore();
const route = useRoute();
const { t, locale } = useI18n();
const { isIOS } = toRefs(systemStore)

// 新手任务处理函数
const NewbieTaskHandleMap: Map<TaskTypeEnumSubMap, (taskInfo: TaskInfo) => void> = new Map([
  ["NewbieTask:InstallAPK", (taskInfo: TaskInfo)=> { showInstallAPK(taskInfo.id) }], // 安装APK
  ["NewbieTask:RegisterAccount", () => {}], // 注册账号
  ["NewbieTask:BindCPF", ()=> router.push('/cpf')], // 绑定CPF
  ["NewbieTask:InstallPWA", ()=> {
    isIOS.value ?iosInstallAction("DESK") : handleInstallAction(undefined, true)
  
  }], // 安装PWA
  ["NewbieTask:BindPhone", ()=> router.push('/security/verify/phone')], // 绑定手机
  ["NewbieTask:BindEmail", ()=> router.push('/security/verify/email')],  // 绑定邮箱
  ["NewbieTask:FirstWithdrawal", async ()=> {
    const bool = await useHandleWithdraw()
    if (!bool) router.push('/main/withdraw')
  }], // 首次提现
  ["NewbieTask:FirstRecharge", async ()=> {
    const bool = await useHandleRecharge()
    if (!bool) router.push('/main/entrar')
  }], // 首次充值
  ["NewbieTask:SetAssetsPassword", ()=> router.push('/withdrawPW')], // 设置资产密码
])

const sideValue = ref(ZTaskTypeEnumType.Enum.NewbieTask)


const segmentList = computed(() => {
  const { themeConfig } = tenantStore;
  const linearGradientIconList =  ['amber-purple'];
  const isGradient = linearGradientIconList.includes(themeConfig?.theme)
  return [
    { type: ZTaskTypeEnumType.Enum.NewbieTask, name: 'task.000006', icon: '/images/task/icon-novice.svg', gradientIcon: isGradient ? `/images/task/icon-novice-${themeConfig?.theme}.svg` : '' },
    // { type: ZTaskTypeEnumType.Enum.DailyTask, name: 'task.000007', icon: '/images/task/icon-daily.svg', gradientIcon: isGradient ? `/images/task/icon-daily-${themeConfig?.theme}.svg` : '' },
    // { type: 'weektask', name: 'task.000008', icon: '/images/task/icon-weekly.svg', gradientIcon: isGradient ? `/images/task/icon-weekly-${themeConfig?.theme}.svg` : '' },
  ]
})

const taskList = computed(() => {
  const list = taskStore.taskMap.get(sideValue.value)
  if (list?.length) {
 
   return list.filter((item: TaskInfo) => {
      if (item.rewardStatus === 'RECEIVED') {
        return false;
      }
      if (item.taskTypeSub === 'NewbieTask:InstallAPK') {
        const platformMap = {
          ios: systemStore.isIOS && item.isIos,
          android: systemStore.isAndroid && item.isApk
        };
        return platformMap[systemStore.os.toLowerCase() as keyof typeof platformMap];
      }
      return true;
    });
  }
  return []
})

const explanationList = computed(() => {
  const { rule, otherParam, content } = taskStore.rulesExplanationMap[sideValue.value] || { content: '' }
  if (rule === 'Default' && !!otherParam) {
    const explanation = generateDefultRules(locale.value as Language, 'NewbieTask', otherParam)
    return explanation.split(/[\r\n]+/g)
  } 
  return content.split(/[\r\n]+/g)
})

const sideChange = (e: any) => {
  sideValue.value = e.detail.value
}

// 记录按钮点击事件
const handleRecordClick = () => {
  activityStore.pageType = 5;
  if (route.path === '/main/promo') {
    activityStore.curPageType = 5;
  } else{
    router.push({path: '/main/promo'})
  }
}

// 前往按钮点击事件
const handleGotoClick = (taskInfo: TaskInfo) => {
  const handler = NewbieTaskHandleMap.get(taskInfo.taskTypeSub)
  handler && handler(taskInfo);
}

const receiveReward = throttleActivity(async (taskInfo: TaskInfo) => {
  showLoading();
  await requestReceiveReward(taskInfo);
  taskStore.updateTaskList(sideValue.value);
})

const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy)
const requestReceiveReward = async (taskInfo: TaskInfo) => {
  console.error('requestReceiveReward', taskInfo);
  try {
    const { app } = systemStore;
    const { id: rewardId, rewardAmount } = taskInfo.awardInfo || { rewardAmount: 0 };
    const res = await taskReceiveApi({rewardId, appType: app?.build });
    if (res?.result && !res?.allMark) {
      return validationActivityClaimLimits(res, PopupType.BONUS, t(`task.${taskInfo.taskTypeSub}`));
    }
    else {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(rewardAmount) }),
      })
    }
    console.error('requestReceiveReward', res);
    
  } catch (error) {
    console.log('requestReceiveReward error', error);
  }
}

const batchReceiveReward = throttleActivity(async () => {
  try {
    const promiseList = taskList.value.filter((item: TaskInfo) => item.rewardStatus === 'DISTRIBUTED' && item.awardInfo?.isClaimable);
    if (promiseList.length) {
      showLoading();
      const { app } = systemStore;
      const res = await taskBatchReceiveApi({ appType: app?.build });
      const resAmount = res.amount || 0;
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(resAmount) }),
      })
      taskStore.updateTaskList(sideValue.value);
    }
  } catch (error) {
    console.error('BatchReceiveReward', error);
  } finally {
    hideLoading();
  }
})

// 显示安装APK弹窗
function showInstallAPK(id: number) {
  showPopup({
    id: 'rookie-task',
    component: RookieTaskModal,
    data: {
      taskId: id,
    }
  })
}

watch(() => route.path, (value) => {
  if (value === '/main/promo' && activityStore.pageType) {
    taskStore.updateTaskList(sideValue.value)
  }
})

</script>

<style scoped lang="less">
@import "./index.less";

html {
  #tabbar-tabs-promo-first-task-index.layout();
}

.green-v01, green-v02, .green-default {
  #tabbar-tabs-promo-first-task-index.style(
    @bg1: #274116;
    @bg2: #2B4F14;
    @icon-color1: rgba(255, 255, 255, 0.2);
    @icon-color2: #17B663;
    @text-color1: rgba(255, 255, 255, 0.4);
    @text-color2: #afc69f;
    @text-color5: #afc69f;
    @line-color: #47612E;
  );
}

.yellow-dark, .auroral-yellow {
  #tabbar-tabs-promo-first-task-index.style(
    @bg1: #262624;
    @bg2: #2F2E2D;
    @icon-color2: #FEB805;
    @line-color: #424242;
  );
}

.forest-green {
  #tabbar-tabs-promo-first-task-index.style(
    @bg1: var(--color-bg-200);
    @bg2: var(--color-bg-100);
    @icon-color1: rgba(255, 255, 255, 0.2);
    @icon-color2: var(--theme-color-800);
    @text-color1: rgba(255, 255, 255, 0.4);
    @text-color6: #50B388;
    @line-color: #006B4F;
  );
}

.green-dark {
  #tabbar-tabs-promo-first-task-index.style(
    @bg1: #22262E;
    @bg2: #3B414D;
    @icon-color2: #3E9B2F;
    @line-color: #424242;
  );
}

.purple-light {
  #tabbar-tabs-promo-first-task-index.style(
    @bg1: #EEE5FF;
    @bg2: #F4EEFF;
    @icon-color1: rgba(55, 66, 87, 0.2);
    @icon-color2: #6526DB;
    @text-color1: rgba(45, 45, 45, 0.6);
    @text-color2: #403D4F;
    @text-color5: #403D4F;
    @text-color6: rgba(64, 61, 79, 0.8);
    @line-color: #F4EEFF;
  );
}

.amber-purple {
  #tabbar-tabs-promo-first-task-index.style(
    @bg1: #2c294d;
    @bg2: #3b3466;
    @icon-color1: rgba(255, 255, 255, 0.2);
    @icon-color2: #7041f3;
    @text-color1: #686299;
    @text-color2: #BDB8E1;
    @text-color5: #BDB8E1;
    @text-color6: #686299;
    @line-color: #4B4778;
  );
}
</style>
