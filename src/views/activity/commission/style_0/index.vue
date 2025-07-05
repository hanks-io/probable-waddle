<!-- 救援金活动 -->
<script setup lang="ts">
import {
  IonPage,
  IonContent,
} from '@ionic/vue'
import ComissionAmount from '@/views/activity/commission/comp/ComissionAmount.vue'
import useHeaderBgColor from '@/views/withdraw/hooks/useHeaderBgColor'
import Footer from '@/views/activity/comp/first/Footer/index.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useCommissionLogic, useBtnComponents } from '@/views/activity/commission/logic';

const {
  isShowDetail,
  commissionList,
  merchantCy,
  rewardAmountTitle,
  commissionReceivedTitle,
  tableTitle,
  currentRewardAmount,
  commissionReceived,
  btnDisabled,
  currentLastRewardAmount,
  activityRule,
  activityName,
  pathToDetail,
  receiveCommission
} = useCommissionLogic();
const templateBtn = useBtnComponents();
</script>
<template>
  <ion-page>
    <NavigationBar :title="activityName" :bgColor="useHeaderBgColor()" />
    <ion-content class="commission-content">
      <!-- 头部 -->
      <div class="flex flex-col items-center">
        <div class="topcontent">
          <div class="topcontent-text">
            <div class="topcontent-text-title">{{ $t('activity.commission14') }}</div>
            <div class="topcontent-text-content font-weight-bold">{{ merchantCy }} {{ currentLastRewardAmount }}</div>
          </div>
          <div class="text-title">
            <div class="inner"></div>
          </div>
        </div>
        <div class="text font-weight-bold flex items-center"><ion-icon class="mr-[0.25rem]" :src="`/images/activity/commission/textFixLeft.svg`"></ion-icon>{{ activityName }}<ion-icon class="ml-[0.25rem]" :src="`/images/activity/commission/textFixRight.svg`"></ion-icon></div>
        <ComissionAmount v-bind="{
          receivedTitle: commissionReceivedTitle,
          receivedAmount: currentRewardAmount,
          isShowDetail: isShowDetail,
          rewardAmountTitle: rewardAmountTitle,
          rewardAmount: commissionReceived,
          merchantCy: merchantCy,
        }" @pathToDetail="pathToDetail" />
      </div>
      <!-- 列表 -->
      <div class="mx-3 list">
        <div
          class="table-header w-full flex-around h-9 bg-slate-50-a rounded-middle-t color-text-40 text-xs font-weight-bold">
          <span class='w-1/2 text-center'>{{ $t(tableTitle) }}</span>
          <span class='w-1/2 text-center'>{{ $t('activity.commission05') }}</span>
        </div>
        <div v-for="(item, index) in commissionList" class="table-item w-full h-[2.625rem] flex-around text-xs">
          <span class="w-1/2  left-item">
            {{ item?.conditionAmount }}
          </span>
          <span class="right-item w-1/2  ">
            <span class="mr-[0.1563rem]" v-if="item?.isShowMerchantCy">{{ merchantCy }}</span> {{ item?.rewardAmount }}
          </span>
        </div>
      </div>
      <div class="rule-content mx-3 keep-space">
        <div class="title">{{ $t('viewsActivity.lossFollow') }}</div>
        <div class="mb-[1rem]">
          <p> {{ activityRule }}</p>
        </div>
      </div>
    </ion-content>
    <Footer class="footer">
      <component :is="templateBtn"  :disabled="btnDisabled" :shiny="true" @click="receiveCommission">{{ $t('activity.mysterious05') }}</component>
    </Footer>
  </ion-page>
</template>
<style scoped lang="less">
@import url('@/views/activity/commission/style_0/commom.less');
#activity-commission-style_0.style();

.purple-light {
  #activity-commission-style_0.style(@topContentTextBg: linear-gradient(90deg, rgba(190, 156, 255, 0) 0%, #BE9CFF 35%, rgba(190, 156, 255, 0.9) 64.95%, rgba(190, 156, 255, 0) 100%),
    @topContentTextTitleColor: #39F61E, @topContentTextAmountColor: #FF3F0F, @textColor: #F28832,
    @tableLeftItemColor: #403D4F, @tableRightItemColor: #DF8644, @tableHeaderBg: #E0D0FF, @tableHeaderColor: #9086A7,
    @tableItemEvenBg: #E0D0FF, @footerBorderColor: #DBC9FF,  @ruleColor:#403D4F
  );
}

.blue-default {
  #activity-commission-style_0.style(@footerBorderColor: #101629;
  )
}

.green-default {
  #activity-commission-style_0.style(@footerBorderColor: #34571D;
  )
}

.yellow-dark, .auroral-yellow {
  #activity-commission-style_0.style(@footerBorderColor: #292D36)
}


.amber-purple{
  #activity-commission-style_0.style(@footerBorderColor: #5F588C)
}
.commission-content{
  --padding-bottom: 7.5rem;
}

.topcontent {



  .text-title {
    position: absolute;
    width: 100%;
    height: 2.3rem;
    bottom: -0.3125rem;
    left: 0.1rem;
    display: flex;
    justify-content: center;

    .inner {
      height: 2rem;
      width: 80%;
      border-radius: 95%;
    }
  }
}




@keyframes shine {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.6);
  }

  100% {
    transform: scale(1.16);
  }
}

.new-skin-symbol {
  #activity-commission-style_0.style(
   @topContentTextBg:none,
   @topContentTextBorder:none,
   @topContentTextTitleColor: #29861C,
   @topContentTextAmountColor: var(--ep-color-text-danger),
   @textColor: var(--ep-color-text-highlight),
   @ruleColor: var(--ep-color-text-weaker),
   @footerBorderColor: var(--ep-color-border-default)
  );
  .list{
    .table-header {
      background: var(--ep-color-background-fill-surface-raised-L2);
     span {
      color: var(--ep-color-text-weaker);
     }
    }
    .table-item span {
      color: var(--ep-color-text-warning);
    }
    .table-item:nth-child(odd) {
      background: var(--ep-color-background-fill-surface-lowered);
    }
  }
  .rule-content {
    .title {
      color: var(--ep-color-text-default);
    }
  }
  .topcontent {
      &-text {
        &-title {
          font-size: var(--ep-font-size-xs);
          font-weight: var(--ep-font-weight-bold);
        }
        &-content {
          font-size: var(--ep-border-radius-surface-large);
          font-weight: var(--ep-font-weight-bold);
        }
      }
    }
    .text {
      font-size: var(--ep-font-size-xl);
      font-weight: var(--ep-font-weight-bold);
    }
    .table-header {
      border-radius: var(--ep-border-radius-s) var(--ep-border-radius-s) 0 0;
    }
    .table-header  span {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-bold);
    }
    .table-item {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-bold);
    }
    .rule-content{
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);
      .title {
        font-weight: var(--ep-font-weight-medium);
      }
   }
}
</style>
