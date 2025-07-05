<!-- 分享助力奖励活动 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border" @click="navigateHandle">
      <ion-toolbar mode="md">
        <ion-icon class="text-white text-2xl ml-2.5 mr-1.5" slot="start" :icon="chevronBack" />
        <ion-title class="ps-0">
          <ion-row class="items-center">
            <ion-label>{{ $t('activity.earn') }} {{ merchantCy }} {{ convertMoneyToShow(roundAmount) }} {{
              $t('activity.freeMoney') }}</ion-label>
            <ion-icon class="text-2xl" src="/svg/activity/help.svg" />
          </ion-row>
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- 助力进度信息 -->
      <div class="px-10 pt-6">
        <ion-row class="items-center justify-between text-3xl font-black text-[#6ddf38]">
          <ion-img class="w-[3.25rem]" src="/images/activity/cash_dollar.png" />
          <p>{{ merchantCy }} {{ convertMoneyToShow(rangeAmount) }}</p>
          <ion-row class="bg-gradient-to-r from-[#49a319] to-[#2b8b2f] rounded-[.625rem] px-2 py-1"
            @click="navigateHandle">
            <ion-img class="w-3.5" src="/images/activity/coin.webp" />
            <p class="text-xs ml-1">{{ $t('main.withdraw') }}</p>
          </ion-row>
        </ion-row>
        <!-- 进度文本 -->
        <p class="text-sm font-black text-end">{{ formatRatioToShow((rangeAmount * 100 / roundAmount) || 0) }}%</p>
        <!-- 进度条 -->
        <div class="flex w-full justify-end h-[.625rem] rounded-[.3125rem] bg-[#6ddf39]">
          <span class="h-full w-[.625rem] bg-white rounded-full"
            :style="`margin-right:${(roundAmount - rangeAmount) / roundAmount * 18.75}rem`" />
        </div>
        <p class="text-sm text-center py-2 line-clamp-1">{{ $t('activity.youStillNeed') }} <span
            class="text-[#6ddf39]">{{ convertMoneyToShow(roundAmount - rangeAmount) }}</span> {{ $t('activity.toWithdraw')
          }}</p>
      </div>
      <!-- 转盘 -->
      <div class="wheel-box h-[23.875rem] w-[24.375rem] relative">
        <!-- 光圈 -->
        <div class="absolute top-[-4rem] -z-10">
          <ion-img class="aperture" src="/images/activity/share_aperture.webp" />
        </div>
        <!-- 闪烁灯 -->
        <ion-img class="wheel-light w-[14.875rem] absolute left-[4.625rem] top-[6.875rem] z-10"
          :style="`animation-duration: ${tempo}ms`" src="/images/activity/share_light.webp" />
        <!-- 指针 -->
        <div class="h-[7.75rem] flex flex-col justify-end"><ion-img class="mr-0.5 mb-[-1.275rem] h-11 z-20"
            src="/images/activity/pointer.webp" /></div>
        <!-- 转盘 -->
        <div class="relative flex justify-center mr-1">
          <LuckyWheel ref="luckyRef" width="13rem" height="13rem" :blocks="blocks" :prizes="prizes" :buttons="buttons"
            :defaultConfig="{ offsetDegree: -22, speed: 25, accelerationTime: 1500, decelerationTime: 3500 }" />
          <!-- 转盘开始按钮 -->
          <div
            class="wheel-start flex items-center justify-center absolute m-auto top-0 bottom-0 left-0 right-0 h-48 w-48 rounded-full z-10">
            <div class="button w-16 h-[5.31rem] flex items-center justify-center" :class="{ on: startClick }"
              @click="navigateHandle">
              <p class="font-black text-3xl pt-1">{{ roundCount }}</p>
            </div>
          </div>
        </div>
        <!-- 活动倒计时 -->
        <p class="w-full absolute bottom-2 text-center text-xs" v-if="expireTime"><span class="text-[#8795b1]">过期时间
          </span><span>{{ expireCountdown }}</span></p>
      </div>
      <!-- 分享模块 -->
      <div class="px-5">
        <ion-row class="text-sm justify-between bg-[#202124] py-2 px-3 rounded-[.25rem]">
          <p class="flex-1 text-center">{{ $t('activity.inviteFriendsWithdrawal') }}</p>
          <ion-icon class="text-lg" :icon="shareSocial" @click="navigateHandle" />
        </ion-row>
      </div>
      <div class="px-5 my-5">
        <ion-row class="text-sm justify-around bg-[#202124] rounded-[.25rem]">
          <p class="py-2" :class="recordTabs == 0 ? '' : 'text-[#9c9c9c]'">{{ $t('main.report') }}</p>
        </ion-row>
      </div>
      <div class="h-40 overflow-hidden mb-5">
        <div class="scroll-box text-xs text-[#8795b1] leading-loose px-5"
          :style="{ animationDuration: `${scrollDuration}s` }">
          <ion-row v-for="item in assistanceCashAwards.concat(assistanceCashAwards)" :key="item.userId">
            <p>{{ encryptionText(item.userId) }}</p>
            <p class="flex-1 text-center">{{ $t('activity.justGotIt') }}</p>
            <ion-row class="text-[#6ddf39] items-center">
              + {{ convertMoneyToShow(item.amount) }} <p
                class="ml-2 h-4 w-4 text-center bg-[#6ddf39] leading-[1.125rem] text-[.625rem] text-white rounded-full font-black">
                {{ merchantCy }}</p>
            </ion-row>
          </ion-row>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { showLogin } from '@/hooks/ShowLogin'
import { encryptionText } from '@/utils';
import { useTenantStore } from '@/store/tenant';
import { PageParam, setPageParam, getPageParam } from '@/store/pageParam';
import { computed, ref, onBeforeMount, onMounted } from 'vue';
import { useActivityStore } from '@/store/activity';
import { convertMoneyToShow, formatRatioToShow } from '@/utils/custom'
import { shareSocial, chevronBack } from 'ionicons/icons';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonLabel, IonIcon, IonImg } from '@ionic/vue';

const router = useRouter();             // 跳转路由
const route = useRoute()                // 当前路由
const tenantStore = useTenantStore();     // 租户store
const activityStore = useActivityStore(); // 活动store

const luckyRef = ref();	                  // 抽奖组件实例
const tempo = ref(1000);                  // 抽奖灯闪烁节奏
const recordTabs = ref(0);                // 记录tab
const expireTime = ref(0);                // 活动过期时间
const roundCount = ref(1);                // 可开启转盘次数
const mainDomain = ref('');               // 主域名
const roundAmount = ref(10000);           // 助力总金额
const startClick = ref(false);            // 开始抽奖按钮点击状态
const expireCountdown = ref('00:00:00');  // 活动过期倒计时

const blocks = [{ imgs: [{ src: '/images/activity/share_spin.webp', width: '100%', top: '0%', rotate: true }] }]
const buttons = [{
  radius: '50%',
}]

const assistanceCashAwards = [  // 全平台助力领取记录
  { userId: 684761531, amount: 10000 },
  { userId: 433516896, amount: 10000 },
  { userId: 518136168, amount: 10000 },
  { userId: 391817618, amount: 10000 },
  { userId: 587468133, amount: 10000 },
  { userId: 763381787, amount: 10000 },
  { userId: 789548541, amount: 10000 }
]

const prizes = computed(() => activityStore.piecePrizes);               // 转盘奖品列表
const rangeAmount = computed(() => roundAmount.value * 0.9885);         // 已助力金额
const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);  // 当前商户货币
const scrollDuration = computed(() => {                                 // 滚动动画时长
  return assistanceCashAwards.length * 0.5;
})

// 生命周期函数: 页面加载前
onBeforeMount(async () => {
  activityStore.setPiecePrizes(); // 设置转盘奖品列表
  onGetChannelInfo();
})

// 数据 页面加载完成
onMounted(() => {
  const path: any = route?.path
  if (path && path.includes('share') && route?.query?.pid) {
    showLogin('register')
  }
})

/**
 * @description: 路由主域名
 */
function navigateHandle() {
  router.replace({ path: '/main', query: router.currentRoute.value.query });
}

/**
 * 接口调用: 获取通道信息
 */
async function onGetChannelInfo() {
  const info = await tenantStore.getDomainInfo();
  if (info?.condition) {
    const awardList = JSON.parse(info.condition).awardList;     // 奖励列表
    const rangeItem = JSON.parse(JSON.stringify(awardList[0]));
    const nothingItem = JSON.parse(JSON.stringify(awardList[0]));
    rangeItem.uuid = 'fa90f039396a4ad6a4iba7ezf3a5f211'
    nothingItem.uuid = 'fa90f039396b4ad6a4ibb7ezf225f211'
    nothingItem.type = 'nothing'
    awardList.splice(4, 0, rangeItem, nothingItem);
    awardList.value = awardList;
    const prizes = awardList.map((item: any, index: number) => {
      switch (item.type) {
        case 'rangeAmount':
          return {
            imgs: [{ src: '/images/activity/piece_rangeAmount.png', width: '50%', top: '0%' }],
          }
        case 'fixedAmount':
          return {
            fonts: [{ text: item.amount / 100, top: '20%', fontSize: '1.5rem', fontWeight: 900, fontColor: index % 2 ? '#FCD760' : '#B90615' }],
          }
        case 'bonus':
          return {
            imgs: [{ src: '/images/activity/piece_bonus.png', width: '50%', top: '0%' }],
          }
        default:
          return {
            fonts: [{ text: '🙁', width: '50%', top: '40%', fontSize: '1.5rem', fontWeight: 900, fontColor: '#FCD760' }],
          }
      }
    });
    activityStore.setPiecePrizes(prizes);
    roundAmount.value = JSON.parse(info.condition).condition[0].amount;
    if (info?.mainDomain)
      mainDomain.value = info.mainDomain;
  }
}

</script>

<style scoped>
.wheel-box {
  background: url('/images/activity/share_bg.webp') no-repeat;
  background-size: 100%;
  background-position: 0 .75rem;
}

.aperture {
  animation: apertureAnimation 20s linear infinite;
}

.wheel-light {
  animation-name: lightAnimation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  pointer-events: none;
}

.wheel-start .button {
  background: url('/images/activity/share_start.webp');
  background-size: 100%;
}

ion-segment-button.ios {
  --border-radius: .375rem;
  --background: transparent;
  --color: #FFF;
  --indicator-color: transparent;
  --indicator-box-shadow: none;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  text-transform: capitalize;
  min-width: 3.25rem;
  min-height: 5.5rem;
  max-height: 5.5rem;
  margin: 0 .375rem;
  margin-top: 0;
}

ion-item.submit {
  --padding-start: 0;
  --min-height: 40px;
  --background: #66D73E;
  --border-radius: 10px;
  --inner-padding-end: .25rem;
}

ion-modal#modal-help,
ion-modal#modal-piece,
ion-modal#modal-prize {
  --width: 22.25rem;
  --height: fit-content;
  /* 高度由内容撑开 */
  --border-radius: 1.25rem;
}

ion-modal#modal-share {
  --background: transparent;
}

div.scroll-box {
  animation: scrollAnimation linear infinite;
}

ion-checkbox {
  --size: 0.9375rem;
  --checkbox-background-checked: #66D73E;
  --checkbox-background: #EAEDF6;
  --border-color: #EAEDF6;
  --checkmark-color: #fff;
  --checkmark-width: 4px;
  --border-radius: 4px;
  margin-inline-end: 0;
}

ion-checkbox::part(container) {
  padding: 0.25rem;
  border-radius: 50%;
  border: none;
}

ion-item ion-button {
  --ripple-color: transparent;
  /* 取消按钮点击动效 */
}

@keyframes apertureAnimation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes lightAnimation {
  0% {
    transform: rotate(0deg);
  }

  49.99% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(22.5deg);
  }

  99.99% {
    transform: rotate(22.5deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes scrollAnimation {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(0, -50%, 0);
  }
}
</style>
