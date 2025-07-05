<!-- VIP活动 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border" v-if="!(route.path === '/main/promo')">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{$t('activity.vip41')}}</ion-title>
        <ion-buttons slot="end" @click="claimRecordHandle">
          <ion-button>
            <ion-icon class="menu text-3xl" slot="icon-only" icon="/first/svg/assets/record.svg"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :scrollY="true">
      <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <!-- VIP等级信息 -->
      <div class="my-vip w-full my-[1rem] relative">
        <!-- 领取按钮 -->
        <div class="absolute right-[0.125rem] text-center top-0 vip-detail flex-evenly" :class="claimBtnIsEnable ? 'claimButtonEnabled': 'claimButtonDisabled'" @click="bathReceiveHandle">
          {{ $t('activity.vip45') }}
        </div>
        <!-- VIP信息 -->
        <div class="vip-info">
          <div class="flexBox">
            <ion-img class="w-[2.375rem] h-[2.375rem] z-30" :src="vipStore.getVipIconPath(vipLevelInfo.curVipLevel)" />
            <div class="current-vip-level flex-center relative">
              <ion-icon class="w-[4.5rem] h-[1.25rem]" :icon="vipTextBgColor" />
              <div class="topVipLevel absolute left-0 top-0 w-[4.5rem] h-[1.25rem] flex-center">
                VIP<strong class="ml-[0.125rem]">{{ vipLevelInfo.curVipLevel }}</strong>
              </div>
            </div>
            <div class="ml-[0.75rem] small-text-white vip-text-40 font-weight-bold vipCardText">{{ $t('viewsTabbar.currentLevel') }}</div>
          </div>
          <!-- 晋级进度条 -->
          <div class="mt-[1.375rem] flexBox">
            <div class="relative">
              <ion-progress-bar class="progress-bar" :value="vipLevelInfo.firstLevelProgress"></ion-progress-bar>
              <div :style="{ left: `${(vipLevelInfo.firstLevelProgress * 100)}%` }" class="level-point" v-if="![0,1,'0','1'].includes(vipLevelInfo.firstLevelProgress)">
                <ion-icon class="w-[2.25rem] h-[2.25rem]" src="/first/svg/progress-point.svg"></ion-icon>
              </div>
            </div>
            <!-- 下一级 图标信息 -->
            <div class="flexBox ml-[0.375rem]">
              <template v-if="vipLevelInfo.nextVipLevel">
                <ion-img class="w-[1.5rem] h-[1.5rem] z-30" :src="vipStore.getVipIconPath(vipLevelInfo.curVipLevel + 1)" />
                <div class="next-current-vip-level flex-center relative">
                  <ion-icon class="w-[3.125rem] h-[1.105rem]" :icon="nextVipTextBgColor"></ion-icon>
                  <div class=" absolute top-0 left-0 flex-center w-[3.125rem] h-[1.105rem]">
                    VIP<strong class="ml-[0.125rem]">{{ vipLevelInfo.curVipLevel + 1 }}</strong>
                  </div>
                </div>
              </template>
              <div class="font-weight-bold max-level vip-info-max" v-else>{{ $t('viewsUser.maximumLevel') }}</div>
            </div>
          </div>
          <!-- 投注/充值信息 -->
          <div class="small-text-white mt-[0.375rem]" :class="{ 'condition-info': !vipLevelInfo.nextVipLevel }">
            <div class="font-weight-bold vip-text-40 mb-[0.25rem] vipCardText">{{ $t('viewsTabbar.levelCondition') }}</div>
            <div class="need-recharge flexBox" v-if="vipLevelInfo.rechargeRequirements != 0" >
              <div class="vipCardTextBottom"><span class="ml-[0.125rem] mr-[0.25rem]">•</span>{{ $t('viewsTabbar.needRecharge') }}：</div>  
              <strong class="current-recharge">{{ formatMoneyToShow(vipLevelInfo.curRechargeAmount) }}</strong>
              <span  class="vip-info-max">{{ `(${ formatMoneyToShow(vipLevelInfo.curRechargeAmount) }/${ formatMoneyToShow(vipLevelInfo.rechargeRequirements) })` }}</span>
            </div>
            <div class="need-bets flexBox" v-if="vipLevelInfo.betRequirements != 0" >
              <div class="vipCardTextBottom"><span class="ml-[0.125rem] mr-[0.25rem]">•</span>{{ $t('viewsTabbar.needBets') }}：</div> 
              <strong class="current-recharge">{{ formatMoneyToShow(vipLevelInfo.curBetAmount) }}</strong>
              <span class="vip-info-max">{{ `(${ formatMoneyToShow(vipLevelInfo.curBetAmount) }/${ formatMoneyToShow(vipLevelInfo.betRequirements) })` }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- VIP等级对照表 -->
      <div class="text-base w-full pb-[1rem] color-text-100 font-weight-medium vipLevelTitle">
        {{ $t('activity.vip4') }}
      </div>
      <div class="vipLevelListHead sticky top-0 z-50  w-full bg-300 pt-[0.625rem]">
        <!-- 切页按钮 -->
        <ion-segment v-model="curShowPage" :scrollable="true" mode="md">
          <template v-for="item in pageList" :key="item.value">
            <ion-segment-button v-if="item.isEnable" :value="item.value">
              <div>{{ $t(item.title) }}</div>
              <HotPoint :isShow="vipReceiveList.includes(item.value)"
              classNames="top-[0.9375rem] right-[-0.125rem] -translate-y-1/4 translate-x-1/4"  />
            </ion-segment-button>
          </template>
        </ion-segment>
         <!-- 列表标题 -->
        <div v-if="curShowPage !== PageType.LEVEL" class="bg-200 h-[3.75rem] mt-5 rounded-small flex items-center text-xs normal-text font-weight-bold listTitle">
          <span  class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[0]) }}</span>
          <span v-if="ifShowDeposit" class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[1]) }}</span>
          <span v-if="ifShowBet" class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[2]) }}</span>
          <span  class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[3]) }}</span>
        </div>
      </div>
      <div class="min-h-0">
        <ion-list class="pt-0 pb-0">
          <div v-if="curShowPage !== PageType.LEVEL" v-for="(pageData, index) in curPageData" class="flex items-center w-full h-[3.75rem] text-[0.625rem] text-center" :class="index%2 === 0 ? 'listItemDeep ': 'listItemShallow'">
            <div class="flexBox">
              <ion-img class="w-[2.375rem] h-[2.375rem] z-30" :src="vipStore.getVipIconPath(pageData.level)" />
              <div class="current-vip-level flex-center relative">
                <ion-icon class="w-[4.5rem] h-[1.25rem]" :icon="getVipLevelBg(pageData.level)" />
                <div 
                  class="absolute left-0 top-0 w-[4.5rem] h-[1.25rem] flex-center"
                  :class="{ 'skin-purple': getVipLevelBg(pageData.level).includes('vipTextSvg1') }"
                >
                  VIP<strong class="ml-[0.125rem]">{{ pageData.level }}</strong>
                </div>
              </div>
            </div>
            <div class="flex-1" v-if="pageData.ifShowDeposit">
              <div class="px-1">
                <div class="normal-text">{{ formatMoneyToShow(pageData.showRechargeProgress ? pageData.realRechargeRequirement : pageData.rechargeRequirement) }}</div>
                <div v-show="pageData.showRechargeProgress">
                  <ion-progress-bar class="my-0.5 progressBottom" mode="ios" :value="pageData.rechargeProgress"></ion-progress-bar>
                  <div class="color-text-80 progressTextBottom">{{ formatMoneyToShow(pageData.recharge) }}/{{ formatMoneyToShow(pageData.realRechargeRequirement) }}</div>
                </div>
              </div>
            </div>
            <div class="flex-1" v-if="pageData.ifShowBet">
              <div class="px-1">
                <div class="normal-text">{{ formatMoneyToShow(pageData.showBetProgress ? pageData.realBetRequirement : pageData.betRequirement) }}</div>
                <div v-show="pageData.showBetProgress">
                  <ion-progress-bar class="my-0.5 progressBottom" mode="ios" :value="pageData.betProgress"></ion-progress-bar>
                  <div class="color-text-80 progressTextBottom">{{ formatMoneyToShow(pageData.bet) }}/{{ formatMoneyToShow(pageData.realBetRequirement) }}</div>
                </div>
              </div>
            </div>
            <div class="flex-1 color-text-currency font-weight-bold progressTextRight">{{ formatMoneyToShow(pageData?.reward ? pageData?.reward : 0) }}</div>
          </div>
          <!-- 保级说明 -->
          <div v-if="curShowPage === PageType.LEVEL" class="bg-300 pt-[0.625rem] text-xs leading-5 safeLevelContent">
            <!-- 保级说明-保级说明 -->
            <div class="rule-content space-y-2 ruleContent">
              <div class="ruleTitleTableTop text-base color-text-80 font-weight-medium">
                {{ $t('activity.vip18')  }}
              </div>
              <p>{{ $t('activity.vip25') }}</p>
              <p>{{ $t('activity.vip26') }}</p>
              <p>{{ $t('activity.vip27') }}</p>
            </div>
            <!-- 保级说明-保级对照表 -->
            <div>
              <div class="text-base color-text-80 font-weight-medium mt-4 mb-2 levelTableTitle">
                {{ $t('activity.vip19') }}
              </div>
              <div class="rounded-middle color-border overflow-hidden levelTable">
                <table class="table w-full text-xs" :class="{ 'unZhTable': currentLanguage }">
                  <thead>
                    <tr>
                      <th>{{ $t('activity.vip21') }}</th>
                      <th>{{ $t('activity.vip23') }}</th>
                      <th>{{ $t('activity.vip24') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="levelInfo in retentionLevel" :key="levelInfo.level">
                      <td>{{ levelInfo.level }}</td>
                      <td>{{ formatMoneyToShow(levelInfo.retentionRecharge)}}</td>
                      <td>{{ formatMoneyToShow(levelInfo.retentionBet)}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </ion-list>
      </div>
      <!-- 活动介绍 -->
      <div class="rule-content mt-[0.625rem] pb-[8.5rem] space-y-3 text-xs" >
        <div class="ruleTitle text-base color-text-80 font-weight-medium">{{ $t('activity.vip20') }}</div>
        <p>{{ $t('activity.vip28') }}</p>
        <p v-if="pageStatus[PageType.DAILY]">{{ $t('activity.vip29')}}</p>
        <p v-if="pageStatus[PageType.WEEKLY]">{{ $t('activity.vip30') }}</p>
        <p v-if="pageStatus[PageType.MONTHLY]">{{ $t('activity.vip31') }}</p>
        <p>{{ $t('activity.vip32', { receiveRule: $t(receiveRuleContent) }) }}</p>
        <p>{{ $t('activity.vip33', { multiple: auditMultiple, batContent: receiveBatContent }) }}</p>
        <p>{{ $t('activity.vip34') }}</p>
        <p>{{ $t('activity.vip35') }}</p>
      </div>
    </ion-content>
    <!-- 领取按钮 -->
    <Footer v-show="showReceiveBtn"  :class="route.path === '/main/promo' ? 'translate-y-[-0.625rem] footerSafe !pt-0 !h-[6.875rem]' :''">
      <Button :disabled="!receiveBtnIsEnable" :shiny="receiveBtnIsEnable"  @click="receiveHandle">
        {{ $t(`activity.${curShowPage}`) }}
      </Button>
    </Footer>
  </ion-page>
</template>
  
<script setup lang="ts">
  import { computed } from 'vue'
  import useLogic from '../logic'
  import { useVipStore } from '@/store/vip';
  import BackButton from '@/components/BackButton.vue';
  import { formatMoneyToShow } from '@/utils/custom';
  import { IonPage, IonHeader, IonToolbar, IonProgressBar, IonContent, IonSegment, IonSegmentButton, IonIcon, IonButtons, IonButton, IonTitle, IonImg, IonList, IonRefresher, IonRefresherContent } from '@ionic/vue';
  import Footer from '@/views/activity/comp/first/Footer/index.vue';
  import Button from '@/components/first/Button/index.vue'
  import HotPoint from '@/components/HotPoint/index.vue'
  const vipStore = useVipStore();

  // 我的 VIP背景图片/详情背景图路径/文本背景色
  const myBgPath = computed(() => `url(${vipStore.getFirstVipBg(vipLevelInfo.curVipLevel,'myVipBg')})`);
  const vipTextBgColor = computed(() => vipStore.getFirstVipBg(vipLevelInfo.curVipLevel,'myVipTextBg'));
  const nextVipTextBgColor = computed(() => vipStore.getFirstVipBg(vipLevelInfo.curVipLevel + 1,'myVipTextBg'));

  const {
    curShowPage,
    claimBtnIsEnable,
    auditMultiple,
    vipLevelInfo,
    pageStatus,
    PageType,
    curPageTitles,
    showReceiveBtn,
    receiveRuleContent,
    currentLanguage,
    receiveBtnIsEnable,
    receiveBatContent,
    pageList,
    curPageData,
    retentionLevel,
    bathReceiveHandle,
    receiveHandle,
    claimRecordHandle,
    handleRefresh,
    getVipLevelBg,
    route,
    ifShowDeposit,
    ifShowBet,
    vipReceiveList
  } = useLogic()
</script>
  
<style scoped lang="less">

ion-content {
  --padding-start: .75rem;
  --padding-end: .75rem;
}

.claimButtonEnabled {
  background: var(--color-vip-active-bg);
  color: var(--color-primary-btn-text-active);
}
.claimButtonDisabled {
  background: var(--color-vip-disable-bg);
  color: var(--color-primary-btn-text-disable);
}

.my-vip {
  height: 11.875rem;
  background: v-bind(myBgPath) no-repeat;
  background-position: bottom 0 left 0;
  background-size: 100% 11.25rem;
  padding: 1.6rem .8125rem .8125rem;
  .vip-detail {
    width: 7.0938rem;
    height: 2.875rem;
    padding: 0 .625rem;
    border-radius: 2.5625rem;
    font-size: var(--font-size-12);
    font-weight: var(--font-weight-bold);
  }    
}

.current-vip-level {
  font-size: var(--font-size-12);
  margin-left: -1.125rem;
}

.level-point {
  position: absolute;
  transform: translate(-50%,-46%)
}

.need-recharge,
.need-bets {
  color: var(--vip-info-tips-text-color);
  font-size: 0.625rem;
}

.current-recharge {
  color: var(--color-currency);
  margin-right: .375rem;
}

.next-current-vip-level {
  font-size: var(--font-size-10);
  margin-left: -0.6875rem;
}

.max-level {
  font-size: var(--font-size-12);
  line-height: 1.125rem;
  color: var(--color-text-80);
}

.condition-info {
  margin-top: 0.9rem;
}

.vipLevelList {
  height: calc(100% - 5rem);
}

table {
  border-collapse: collapse;
  background-color: transparent;
}

table th,
table td {
  border: 1px solid var(--color-border);
  font-weight: var(--font-weight-bold);
  color: var(--color-currency);
  width: 33.33%;
  text-align: center;
  border-right: none;
}

table thead th {
  color: var(--color-text-40);
  height: 2.5rem;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-12);
  background-color: var(--color-bg-200);
}

table tbody td:first-child {
  color: var(--color-text-80);
}

table tbody td:last-child {
  color: var(--color-currency);
}

table.table th, table.table td {
  line-height: 1.5625rem;
  width: 12.5%;
}

.unZhTable thead tr th {
  height: 2.6rem;
  line-height: 0.9rem;
}

table th:first-child, table td:first-child {
  border-left: none;
}

table th:last-child, table td:last-child {
  border-right: none;
}

table thead tr:first-child th, table thead tr:first-child td {
  border-top: none;
}

table tr:last-child th, table tr:last-child td {
  border-bottom: none;
}

ion-toolbar {
  --min-height: 3.125rem;
}

ion-progress-bar {
  --background: var(--progress-base-bg);
  border-radius: 1rem;
}

.progress-bar {
  width: 17.1875rem;
  height: .25rem;
  --progress-background: var(--progress-bg);
}

ion-segment-button {
  --background-checked: var(--color-bg-200);
  --color: var(--color-vip-text);
  --color-checked: var(--color-primary-800);
  --indicator-color: var(--color-primary-800);
  border-radius: var(--rounded-small) var(--rounded-small);
  text-transform: none;
}

ion-segment {
  border-bottom: 1px solid var(--color-line);
}

.content-base {
  padding: 2px;
  line-height: 13px;
}

.share-vip {
  padding: 0 2rem;
}


.vip-text-40 {
  color: var(--vip-info-text-color-40);
}

.vip-info-max {
  color: var(--vip-max-text-color);
  font-size: var(--ep-font-size-xs, .625rem);
}

.rule-content {
  color: var(--color-activity-rule);
  margin-bottom: env(safe-area-inset-bottom);
}

.normal-text {
  color: var(--color-vip-text);
}

.skin-purple {
  color: var(--vip1-detail-text-color);
}

.shiny {
  position: relative;
  overflow: hidden;
}

.shiny::before {
  content: '';
  animation: shiny 6s ease-in-out infinite;
  background: white;
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px
}

.footerSafe {
  margin-bottom: env(safe-area-inset-bottom);
}
.menu {
  color: var(--color-text-100);
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }
  80% {
    opacity: 0.5;
    transform: scale(0) rotate(45deg);
  }
  81% {
    opacity: 1;
    transform: scale(4) rotate(45deg);
  }
  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}

.listItemShallow {
    background-color: var(--color-bg-400);
}
.listItemDeep {
    background-color: var(--color-bg-300);
}


.new-skin-symbol {
  ion-content {
  --background: var(--ep-color-background-fill-body-default);
  }
  ion-toolbar {
    --background: var(--ep-color-background-fill-top-nav-secondary);
    color: var(--ep-color-text-default);
  }
  ion-progress-bar.progress-bar {
  --background: var(--ep-color-text-weakest);
  margin: 0;
  } 
  .progress-bar {
  --progress-background: var(--ep-color-background-fill-gradients-tertiary-b);
  }
  ion-segment {
    background: var(--ep-color-background-fill-surface-lowered);
    border-bottom: 0.0625rem solid var(--ep-color-border-default);
    margin-left: -0.625rem;
    margin-right: -0.625rem;
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    padding-top: 0.375rem;
  }
  ion-segment-button {
  --background-checked: var(--ep-color-background-fill-surface-raised-L1);
  --color: var(--ep-color-text-weaker);
  --color-checked: var(--ep-color-border-selected);
  --indicator-color: var(--ep-color-border-selected);
  }
  .listTitle {
   color: var(--ep-color-text-weaker);
   background: var(--ep-color-background-fill-surface-raised-L1);
  }
  .list-md  {
    background: var(--ep-color-background-fill-body-default);
  }
  .skin-purple {
    color: var(--ep-color-text-default);
  }
  .listItemShallow {
    background: var(--ep-color-background-fill-surface-lowered);
  }
  .listItemDeep {
    background: var(--ep-color-background-fill-body-default);
  } 
  .progressBottom {
    --background: var(--ep-color-background-fill-surface-raised-L1);
    --progress-background: var(--ep-color-icon-brand-primary);
  }
  .progressTextBottom {
    color: var(--ep-color-text-default);

  }
  .progressTextRight {
    color: var(--ep-color-text-warning);
    max-width: 7rem;
  }
  .rule-content {
    div {
      color: var(--ep-color-text-default);
    }
    p {
      color: var(--ep-color-text-weaker);
    }
  }
  .levelTableTitle {
    color: var(--ep-color-text-default);
  }
  .table {
     color: var(--ep-color-text-default); 
  }
  .table th{
    background: var(--ep-color-background-fill-surface-raised-L1);
  }
  .table td {
    color: var(--ep-color-text-warning);
  }
  table tbody td:first-child {
    color: var(--ep-color-text-default); 
  }
  table th, table td {
    border: 0.0625rem solid var(--ep-color-border-default);
  }
  .levelTable {
    border: 0.0625rem solid var(--ep-color-border-default);
  }
  .vip-detail {
   border: 0.0625rem solid var(--ep-color-border-default);
   color: var(--ep-color-text-highlight);
   }
  .claimButtonEnabled {
    background: var(--ep-color-background-fill-surface-lowered);
    color: var(--ep-color-text-highlight);
  }
  .claimButtonDisabled {
    opacity: 0.4;
    background: var(--ep-color-background-fill-surface-lowered);
    color: var(--ep-color-text-highlight);
  }
  .footer {   
    background-color: var(--ep-color-background-fill-surface-raised-L1);
    box-shadow: 0px 0.5px 0px 0px var(--ep-color-border-default) inset;
  }
  
  ion-toolbar {
    ion-title {
      font-size: var(--ep-font-size-xl);
      font-weight: var(--ep-font-weight-medium);
    }
    ion-icon.menu {
      font-size: var(--ep-font-size-xxl);
      color: var(--ep-color-icon-default);
    }
  }

  .my-vip {
    .vip-detail {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);
      border-radius: var(--ep-border-radius-infinity);
    }
  }
  .vip-info {
    .current-vip-level {
       font-size: var(--ep-font-size-s);
       font-weight: var(--ep-font-weight-regular);
       .topVipLevel {
        font-size: var(--ep-font-size-xs);
        font-weight: var(--ep-font-weight-regular);
       }
    }
    .vipCardText {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-bold);
      color: var(--ep-color-text-highlight-white);
      opacity: 0.4;
    }
    .next-current-vip-level {
      font-size: var(--ep-font-size-xs);
      font-weight: var(--ep-font-weight-regular);
    }
    .vipCardTextBottom {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);
      color: var(--ep-color-text-weakest);
      white-space: nowrap;
    }
    .current-recharge {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-bold);
      color: var(--ep-color-icon-warning);
    }
    .vip-info-max {
      font-size: var(--ep-font-size-s, .625rem);
      font-weight: var(--ep-font-weight-regular);
      color: var(--ep-color-text-highlight-white);
    }
  }
  .vipLevelTitle {
    font-size: var(--ep-font-size-l);
    font-weight: var(--ep-font-weight-medium);
    color: var(--ep-color-text-default);
  }
  .vipLevelListHead {
     background: var(--ep-color-background-fill-body-default);
    ion-segment-button {
      font-size: var(--ep-font-size-m);
      font-weight: var(--ep-font-weight-regular);
    }
    ion-segment-button.segment-button-checked  {
      font-size: var(--ep-font-size-m);
      font-weight: var(--ep-font-weight-medium);
    }
    .listTitle {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-bold);
    }
  }
  ion-list {
    .current-vip-level {
       font-weight: var(--ep-font-weight-bold);  
    }
  }

  .normal-text {
    font-size: var(--ep-font-size-xs);
    font-weight: var(--ep-font-weight-regular);
    color: var(--ep-color-text-weaker);
  }
  .progressTextBottom {
    font-size: var(--ep-font-size-xs);
    font-weight: var(--ep-font-weight-regular);
  }
  .progressTextRight {
    font-size: var(--ep-font-size-xs);
    font-weight: var(--ep-font-weight-bold);
  }
  .rule-content {
    .ruleTitle {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-medium);
    }
    .ruleTitleTableTop {
      font-size: var(--ep-font-size-l);
      font-weight: var(--ep-font-weight-medium);
    }
    p {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);
    }
  }
 .levelTableTitle {
  font-size: var(--ep-font-size-l);
  font-weight: var(--ep-font-weight-medium);
 }
  .max-level {
    font-size: var(--ep-font-size-s);
  }
  table th,
  table td {
    font-weight: var(--ep-font-weight-bold);
    font-size: var(--ep-font-size-s);
  }
  table thead th {
    font-weight: var(--ep-font-weight-bold);
    font-size: var(--ep-font-size-s);
  }
  ion-progress-bar {
    border-radius: var(--ep-border-radius-surface-default);
    height: 0.3125rem;
    margin-top: 0.25rem;
    margin-bottom: 0.3125rem;
  }
  .safeLevelContent {
    background: var(--ep-color-background-fill-body-default, #131F42);
  }
  ion-segment-button {
    border-radius: var(--ep-border-radius-s) var(--ep-border-radius-s);
  }
}

</style>
