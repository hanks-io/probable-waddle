<!-- VIP活动 -->
<template>
  <ion-page :class="$attrs.class" :style="$attrs.style">
    <ion-header class="ion-no-border" v-if="!(route.path === '/main/promo')">
      <!-- 顶部导航栏 -->
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{$t('activity.vip41')}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :scrollY="true">
      <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <!-- VIP等级信息 -->
      <div class="w-full px-[1rem] pt-[0.625rem]">
        <div class="card-bg-gradient w-full h-[5rem] px-2.5 rounded-lg my-1">
         <div class="h-full flex justify-between">
           <div class="flex items-center text-[0.75rem]">
             <div class="relative share-vip h-full text-[10px]">
               <!-- 显示当前等级 -->
               <div class="absolute top-1/2 left-0 w-[54px] -translate-y-1/2">
                 <div class="relative">
                   <ion-img class="" :src="vipStore.getVipIconPath(vipLevelInfo.curVipLevel)"/>
                    <div class="absolute top-[24.5px] left-[28px] w-[30px] flex items-center justify-center">
                      <span class="text-center font-bold" :style="{color: vipStore.getVipTextColor(vipLevelInfo.curVipLevel)}">{{ `V${vipLevelInfo.curVipLevel}` }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="vipLevelInfo.nextVipLevel" class="flex items-center justify-between text-left text-[#9BA7BE] text-xs">
                <div class="space-y-2">
                  <p class="text-[--color-text-second]">{{ $t('activity.vip42') }}
                    <span class="text-[--color-text-emphasis] font-bold">{{ `VIP${vipLevelInfo.nextVipLevel}` }}</span>
                  </p>
                  <p style="margin-top:0;padding-right:.625rem">
                    <span class="text-[--color-text-second]" v-if="vipLevelInfo.rechargeNeed != 0">{{ $t('activity.vip43') }}
                      <span class="text-[--color-text-basic]">{{ `${formatMoneyToShow(vipLevelInfo.rechargeNeed)}` }}</span>
                    </span>
                    <span class="text-[--color-text-second]" v-if="vipLevelInfo.betNeed != 0">{{ $t('activity.vip44') }}
                      <span class="text-[--color-text-basic]">{{ formatMoneyToShow(vipLevelInfo.betNeed) }}</span>
                    </span>
                  </p>
                </div>
              </div>
              <p v-if="!vipLevelInfo.nextVipLevel" class="text-[--color-text-basic]">{{ $t('activity.vip22') }}</p>
            </div>
            <div class="h-full flex justify-between items-center text-xs">
              <div class="space-y-2">
                <div class="content-base w-20 h-[1.875rem] flex items-center justify-center rounded-md " :class="claimBtnIsEnable ? 'claimButtonEnabled': 'claimButtonDisabled'" @click="bathReceiveHandle">
                 {{ $t('activity.vip45') }}
                </div>
                <div class="historyButton w-20 h-[1.875rem] flex items-center justify-center rounded-md text-[#fff]" @click="claimRecordHandle">
                  <span>{{ $t('activity.vip3') }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 浮动 -->
          <div class="current-level absolute top-1 left-1 w-auto h-auto text-[#fff] text-center bg-[#FE5353] rounded-[.1875rem] px-0.5 pb-0.5">
              {{$t('activity.vip1')}}
          </div>
        </div>
      </div>
      <div class="text-base w-full px-[1rem] pt-[0.625rem] text-[--color-text-basic]">{{ $t('activity.vip4') }}</div>
      <!-- VIP等级对照表 -->
      <div class="sticky top-0 z-50  w-full px-[1rem]">
        <!-- 切页按钮 -->
        <ion-segment class="scrollable-container pb-[0.3125rem]" v-model="curShowPage" :scrollable="true" mode="md">
          <template v-for="item in pageList" :key="item.value">
            <ion-segment-button v-if="item.isEnable" :value="item.value">
              <div>{{ $t(item.title) }}</div>
              <HotPoint :isShow="vipReceiveList.includes(item.value)"
                classNames="top-[1rem] right-[-0.0625rem] -translate-y-1/4 translate-x-1/4"  />
            </ion-segment-button>
          </template>
        </ion-segment>
         <!-- 列表标题 -->
        <div v-if="curShowPage !== PageType.LEVEL" class="h-14 flex py-3 items-center text-xs font-normal vip-list-title">
          <span  class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[0]) }}</span>
          <span v-if="ifShowDeposit" class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[1]) }}</span>
          <span v-if="ifShowBet" class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[2]) }}</span>
          <span  class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[3]) }}</span>
        </div>
      </div>
        <div class="px-[1rem]  min-h-0">
          <ion-list class="bg-[--color-bg-second] py-0">
            <div v-if="curShowPage !== PageType.LEVEL" v-for="(pageData, index) in curPageData" class="flex items-center w-full h-[3.75rem] text-[0.625rem] text-center" :class="index%2 === 0 ? 'bg-[--color-bg-400]': 'bg-[--color-bg-first]'">
              <div class="flex-1">
                <div class="relative inline-block mx-auto">
                  <ion-img class="w-[54px] z-10" :src="vipStore.getVipIconPath(pageData.level)" />
                  <div class="absolute top-[25px] left-[28px] z-20 w-[30px] flex items-center justify-center">
                    <span class="text-center text-[10px] font-bold" :style="{ color: vipStore.getVipTextColor(pageData.level)}">{{ `V${pageData.level}` }}</span>
                  </div>
                </div>
              </div>
              <div class="flex-1" v-if="pageData.ifShowDeposit">
                <div class="px-1">
                  <div class="text-[--color-text-second]">{{ formatMoneyToShow(pageData.showRechargeProgress ? pageData.realRechargeRequirement : pageData.rechargeRequirement) }}</div>
                  <div v-show="pageData.showRechargeProgress">
                    <ion-progress-bar class="my-0.5" mode="ios" :value="pageData.rechargeProgress"></ion-progress-bar>
                    <div class="text-[--color-text-basic]">{{ formatMoneyToShow(pageData.recharge) }}/{{ formatMoneyToShow(pageData.realRechargeRequirement) }}</div>
                  </div>
                </div>
              </div>
              <div class="flex-1" v-if="pageData.ifShowBet">
                <div class="px-1">
                  <div class="text-[--color-text-second]">{{ formatMoneyToShow(pageData.showBetProgress ? pageData.realBetRequirement : pageData.betRequirement) }}</div>
                  <div v-show="pageData.showBetProgress">
                    <ion-progress-bar class="my-0.5" mode="ios" :value="pageData.betProgress"></ion-progress-bar>
                    <div class="text-[--color-text-basic]">{{ formatMoneyToShow(pageData.bet) }}/{{ formatMoneyToShow(pageData.realBetRequirement) }}</div>
                  </div>
                </div>
              </div>
              <div class="flex-1 text-[--color-text-emphasis]">{{ formatMoneyToShow(pageData?.reward ? pageData?.reward : 0) }}</div>
            </div>
            <!-- 保级说明 -->
            <div v-if="curShowPage === PageType.LEVEL" class="text-xs leading-5 font-normal text-[--color-text-second] bg-[--color-bg-second]">
              <!-- 保级说明-保级说明 -->
              <div class=" space-y-2">
                <div class="text-sm">
                  {{ $t('activity.vip18')  }}
                </div>
                <p>{{ $t('activity.vip25') }}</p>
                <p>{{ $t('activity.vip26') }}</p>
                <p>{{ $t('activity.vip27') }}</p>
              </div>
              <!-- 保级说明-保级对照表 -->
              <div>
                <div class="text-sm mt-4 mb-2">
                  {{ $t('activity.vip19') }}
                </div>
                <div class="rounded-[.625rem] border-[--color-border-btn-basic] border overflow-hidden">
                  <table class="table w-full text-xs bg-white" :class="{ 'unZhTable': currentLanguage }">
                    <thead class=" bg-[--color-bg-third]">
                      <tr>
                        <th>{{ $t('activity.vip21') }}</th>
                        <th>{{ $t('activity.vip23') }}</th>
                        <th>{{ $t('activity.vip24') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="levelInfo in retentionLevel" :key="levelInfo.level">
                        <th>{{ levelInfo.level }}</th>
                        <th>{{ formatMoneyToShow(levelInfo.retentionRecharge)}}</th>
                        <th>{{ formatMoneyToShow(levelInfo.retentionBet)}}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </ion-list>
        </div>
      <!-- 活动介绍 -->
      <div class="px-[1rem] mt-[0.625rem] pb-[5.5rem] space-y-3 text-xs vipRule" >
        <div class="text-sm">{{ $t('activity.vip20') }}</div>
        <p>{{ $t('activity.vip28') }}</p>
        <p v-if="pageStatus[PageType.DAILY]">{{ $t('activity.vip29')}}</p>
        <p v-if="pageStatus[PageType.WEEKLY]">{{ $t('activity.vip30') }}</p>
        <p v-if="pageStatus[PageType.MONTHLY]">{{ $t('activity.vip31') }}</p>
        <p>{{ $t('activity.vip32',{ receiveRule: $t(receiveRuleContent) }) }}</p>
        <p>{{ $t('activity.vip33', { multiple: auditMultiple, batContent: receiveBatContent }) }}</p>
        <p>{{ $t('activity.vip34') }}</p>
        <p>{{ $t('activity.vip35') }}</p>
      </div>
    </ion-content>
    <!-- 领取按钮 -->
    <div 
      v-show="showReceiveBtn" 
      :class="route.path === '/main/promo' ? 'promoBtn':'vipBtn'"
      class="claim-button flex justify-center items-center fixed left-0 px[1rem] w-full h-[5rem] bg-[--color-bg-100]" 
      :style="route.path === '/main/promo' ? `bottom:${tabBarHeight}px` : 'bottom:0'"
    >
      <div 
        class="w-[17.5rem] h-[2.5rem] text-[0.875rem] flex items-center justify-center rounded-md "  
        :class="{ 'claimRecordButton': receiveBtnIsEnable, 'claimRecordButtonDisabled': !receiveBtnIsEnable, 'shiny': receiveBtnIsEnable  }" 
        @click="receiveHandle"
      >
        <span >{{ $t(`activity.${curShowPage}`) }}</span>
      </div>
    </div>
  </ion-page>
</template>
  
<script setup lang="ts">
  import useLogic from '../logic'
  import { useVipStore } from '@/store/vip';
  import BackButton from '@/components/BackButton.vue';
  import { formatMoneyToShow } from '@/utils/custom';
  import { IonPage, IonHeader, IonToolbar, IonProgressBar, IonContent, IonSegment, IonSegmentButton, IonTitle, IonImg, IonList, IonRefresher, IonRefresherContent, IonButton } from '@ionic/vue';
  import HotPoint from '@/components/HotPoint/index.vue'
  const vipStore = useVipStore();

  const {
    tabBarHeight,
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
    route,
    ifShowDeposit,
    ifShowBet,
    vipReceiveList
  } = useLogic()
</script>
  
<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/vip/default/style/base-index.less";
  @import "@/views/activity/vip/default/style/theme-style.less";

  #activity-vip-default-index.style();

  .blue-default {
    #activity-vip-default-index.style(
      --color-bg-100,
      --theme-color-gradient-200,
      --color-text-white-100,
      --color-btn-gradient-claimUnable,
      --color-text-white-100,
      --theme-color-gradient-200,
      --color-text-white-100,
      --color-btn-gradient-claimUnable,
      --color-text-white-100,
      --theme-color-gradient-400,
      --color-border,
      --color-text-white-100,
      --accent-color-yellow,
      --color-bg-200,
      --theme-color-gradient-400,
      --color-text-gray-200,
      --color-text-white-100,
      --theme-color-gradient-100,
      --color-border,
      --color-border,
      --color-bg-200,
      --color-text-gray-300,
      --color-text-gray-200,
      --accent-color-yellow,
      --color-text-gray-200,
      --color-text-white-100,
      --color-text-gray-200,
      --color-text-white-100,
      --color-text-white-100,
      --color-text-white-100,
      --color-text-white-100,
      --color-bg-200,
      --color-text-gray-200,
      --color-bg-200,
      --color-bg-300,
      --color-bg-400,
      --color-text-gray-200,
      --color-text-white-100,
      --accent-color-yellow,
      --color-text-gray-200,
      --color-bg-200,
      --color-border,
      --color-bg-100,
      --color-text-gray-200,
      --color-bg-100,
      @vip-default-index-47: --color-bg-50
    );
  }

  .green-default {
    #activity-vip-default-index.style(
      --color-bg-100,
      --theme-color-gradient-200,
      --color-text-white-100,
      --theme-color-gradient-400,
      --color-text-white-40,
      --theme-color-gradient-200,
      --color-text-white-100,
      --theme-color-gradient-400,
      --color-text-white-40,
      --theme-color-gradient-100,
      --color-line,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-bg-200,
      --theme-color-gradient-200,
      --color-text-gray-200,
      --color-text-gray-100,
      --theme-color-gradient-100,
      --color-line,
      --color-line,
      --color-bg-200,
      --color-text-gray-300,
      --color-text-gray-200,
      --accent-color-yellow,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-100,
      --color-text-white-100,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-200,
      --color-bg-200,
      --color-bg-300,
      --color-bg-400,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-text-gray-200,
      --color-bg-200,
      --color-line,
      --color-bg-100,
      --color-text-gray-200,
      --color-bg-100,
      @vip-default-index-47: --color-bg-100
    );
  }
  .forest-green {
    #activity-vip-default-index.style(
      @vip-default-index-05: --color-text-white-40,
      @vip-default-index-09: --color-text-white-40,
      @vip-default-index-10: --theme-color-gradient-100,
      @vip-default-index-15: --theme-color-gradient-200,
      @vip-default-index-17: --color-text-gray-100,
      @vip-default-index-19: --color-link,
      @vip-default-index-32: --color-bg-300,
      @vip-default-index-33: --color-text-gray-200,
      @vip-default-index-46: --color-text-white-100,
      @vip-default-index-47: --color-bg-100
    );
  }
    
  .amber-purple {
    #activity-vip-default-index.style(
      --color-bg-100,
      --segment-gradients-purple,
      --text-color-white-100,
      --gradients-disabled-btn-bg,
      --text-color-white-40,
      --segment-gradients-purple,
      --text-color-white-100,
      --gradients-disabled-btn-bg,
      --text-color-white-40,
      --theme-color-800,
      --line-color,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --color-bg-200,
      --background-progress-gradient,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --segment-gradients-purple,
      --line-color,
      --line-color,
      --color-bg-200,
      --text-color-light-purple-2-100,
      --text-color-light-purple-2-100,
      --accent-color-yellow,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --text-color-light-purple-1-100,
      --text-color-white-100,
      --text-color-light-purple-1-100,
      --color-bg-200,
      --text-color-light-purple-2-100,
      --color-bg-200,
      --color-bg-300,
      --color-bg-400,
      --text-color-light-purple-2-100,
      --text-color-light-purple-1-100,
      --accent-color-yellow,
      --text-color-light-purple-2-100,
      --color-bg-200,
      --line-color,
      --color-bg-100,
      --text-color-light-purple-2-100,
      --color-bg-100,
      @vip-default-index-47: --color-bg-100
    );
  }

  .auroral-yellow {
    #activity-vip-default-index.style(
      --color-bg-100,
      --theme-color-800,
      --color-text-black-100,
      --theme-color-800,
      --color-text-black-100,
      --theme-color-800,
      --color-text-black-100,
      --theme-color-800,
      --color-text-black-100,
      --accent-color-green,
      --color-line,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-bg-200,
      --theme-color-gradient-500,
      --color-text-gray-200,
      --color-text-gray-100,
      --theme-color-800,
      --color-line,
      --color-line,
      --color-bg-200,
      --color-text-gray-300,
      --color-text-gray-200,
      --accent-color-yellow,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-200,
      --color-text-gray-100,
      --color-text-gray-100,
      --color-text-white-100,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-200,
      --color-bg-200,
      --color-bg-300,
      --color-bg-400,
      --color-text-gray-200,
      --color-text-gray-100,
      --accent-color-yellow,
      --color-text-gray-200,
      --color-bg-200,
      --color-line,
      --color-bg-100,
      --color-text-gray-200,
      --color-bg-100,
      @vip-default-index-47: --color-bg-100,
      @vip-default-index-48: --color-text-gray-200
    );
    .claimRecordButtonDisabled {
      opacity: 0.4;
    }
    .claimButtonDisabled {
      opacity: 0.4;
    }
    .promoBtn {
      border-width: 0;
      background: #161616;
    }
  }
</style>
