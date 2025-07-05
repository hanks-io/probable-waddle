<!-- 多级分销 佣金排行榜 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('mlmAgent.leaderBordName')" />
    <ion-content :scrollY="showBoardEmpty">
      <!-- 日榜/周榜/月榜  排行榜前三 -->
      <div class="leader-board-top relative">
        <!-- 日榜/周榜/月榜tab  -->
        <div class="leader-board-tab z-10" >
          <div 
            class="tab-item" 
            v-for="(item,index) in boardTabList" 
            :key="item.value"
            :class="{ 'selected-board': rewardType == item.value }"
            @click="selectBoardClick(item.value)"
          > 
            {{ item.name }}
          </div>
        </div>
        <!-- 排行榜 前三 -->
        <div class="top-three-box z-10" v-if="showBoardEmpty">
          <!-- 排行榜骨架 -->
          <template v-if="showLoadPage">
            <div 
              v-for="(item,index) in topThreeLoadList" 
              :key="index" 
              class="top-board-item"
              :class="{ 'top-one': index == 0, 'top-two': index == 1, 'top-three': index == 2 }"
            >
              <img class="mlm-user-bg" :src="item.topImg" alt="">
              <img class="mlm-user-avatar" :src="item.avatar" alt="">
              <div class="user-phone">{{ item.userId }}</div>
              <div class="middle-text-white ">
                <ion-icon :src="`/first/svg/agent/agent-currency.svg`" />
                {{ formatMoneyToShow(item.totalCommission) }}
              </div>
            </div>
          </template>
          <!-- 真实排行榜信息 -->
          <template v-else>
            <div 
              v-for="(item,index) in threeTopBoardList" 
              :key="index" 
              class="top-board-item"
              :class="{ 'top-one': index == 0, 'top-two': index == 1, 'top-three': index == 2 }"
            >
              <img class="mlm-user-bg" :src="item.topImg" alt="">
              <img class="mlm-user-avatar" :src="item.avatar" alt="">
              <div class="user-phone">{{ item.userId }}</div>
              <div class="middle-text-white">
                <ion-icon :src="`/first/svg/agent/agent-currency.svg`" />
                {{ formatMoneyToShow(item.totalCommission) }}
              </div>
            </div>
          </template>
        </div>
        <!-- 渐变背景 -->
        <div class="leader-board-top-bg absolute top-0 left-0 w-full h-full"></div>
      </div>
      <!-- 排行榜 其他 -->
      <div class="other px-[0.75rem]" v-if="showBoardEmpty">
        <!-- 标题 title -->
        <div class="board-title board-table-title">
          <div class="rank-board">{{ $t('mlmAgent.ranking') }}</div>
          <div class="userInfo-board">{{ $t('mlmAgent.userInfo') }}</div>
          <div class="comission-board">{{ $t('toggle.commissions') }}</div>
        </div>
        <!-- 排行榜名单 -->
        <template v-if="showLoadPage">
          <div class="board-title board-item" v-for="(item,index) in ohterBoardLoadList" :key="index">
            <div class="rank-board">{{ handleOtherBoardNum(index) }}</div>
            <div class="userInfo-board">
              <div class="user">
                <img :src="item.avatar" alt="">
              </div>
              {{ item.userId }}
            </div>
            <div class="comission-board middle-text-white">
              <ion-icon :src="`/first/svg/agent/agent-currency.svg`" />
              {{ formatMoneyToShow(item.totalCommission) }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="board-title board-item" v-for="(item,index) in otherBoardList" :key="index">
            <div class="rank-board">{{ handleOtherBoardNum(index) }}</div>
            <div class="userInfo-board">
              <div class="user">
                <img :src="item.avatar" alt="">
              </div>
              {{ item.userId }}
            </div>
            <div class="comission-board middle-text-white">
              <ion-icon  :src="`/first/svg/agent/agent-currency.svg`" />
              {{ formatMoneyToShow(item.totalCommission) }}
            </div>
          </div>
        </template>
        <!-- 暂无数据 -->
        <div class="empty" v-if="!showLoadPage && !otherBoardList.length">
          <Empty :text="$t('mlmAgent.noMoreDeta')" />
        </div>
      </div>
      <!-- 整体排行 empty -->
      <div class="empty" v-if="!showBoardEmpty">
        <Empty :text="$t('mlmAgent.noMoreDeta')" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { topThreeLoadList, ohterBoardLoadList } from '../data'
import { formatMoneyToShow } from '@/utils/custom'
import { useLeaderBordInfoLogic } from '../hooks/leaderBordInfoLogic.ts' 
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import Empty from '@/components/Empty/index.vue'

const {
  rewardType,
  boardTabList,
  threeTopBoardList,
  otherBoardList,
  showLoadPage,
  showBoardEmpty,
  selectBoardClick,
  handleOtherBoardNum
} = useLeaderBordInfoLogic();
</script>

<style scoped lang="less">
@import '@/views/mlmAgent/styles/LeaderBordInfo/base-index.less';
@import '@/views/mlmAgent/styles/LeaderBordInfo/theme-style.less';

#mlmAgent-components-leaderBordInfo-index.style();

.yellow-dark,
.green-dark,
.purple-light,
.amber-purple,
.blue-default,
.forest-green,
.green-default,
.auroral-yellow {
  #mlmAgent-components-leaderBordInfo-index.style(
    --mlm-toolbar-bg-color,
    --mlm-leader-bord-top-bgc,
    --mlm-board-tab-border-color,
    --mlm-bord-tab-item-select-tc,
    --mlm-bord-tab-item-select-bgc,
    --mlm-bord-tab-item-selected-bgc,
    --mlm-bord-tab-item-selected-tc,
    --mlm-leader-bord-money-text-color,
    --mlm-bord-userid-text-color,
    --mlm-leader-bord-money-text-color,
    --mlm-bord-item-bgc,
    --mlm-subdetail-item-name-color,
    --mlm-bord-userid-text-color,
    --color-bg-100,
    --mlm-bord-userid-text-color,
    --mlm-leader-bord-money-text-color,
    --mlm-subdetail-item-name-color,
  );
}

.new-skin-symbol {
  #mlmAgent-components-leaderBordInfo-index.style(
    --ep-color-background-fill-top-nav-secondary,
    --ep-color-background-fill-glow-primary-opacity-40,
    --ep-color-border-default,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-background-fill-glow-primary-opacity-40,
    --ep-color-text-selected,
    --ep-color-icon-warning,
    --ep-color-text-default,
    --ep-color-text-warning,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weaker,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-color-icon-warning,
    --ep-color-text-weaker,
    --ep-color-border-selected
  );
}

.new-skin-symbol {
  @import '@/views/mlmAgent/styles/CommissionDetail/index-phantom.less';
  .leader-board-top .leader-board-tab {
    .tab-item {
      background: transparent;
    }
    .selected-board {
      background: transparent;
    }
  }

  .leader-board-top .leader-board-top-bg {
    opacity: 0.3;
    pointer-events: none;
  }
}
</style>
