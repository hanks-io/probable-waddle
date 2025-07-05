<script setup lang="ts">
import {
  IonPage,

  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,

} from '@ionic/vue'
import { getTheme } from '@/theme/hooks'
import Empty from '@/components/Empty/index.vue'
import { useCommissionDetailLogic } from '@/views/activity/commission/useDetailLogic';
import { getCustomerActivityId } from '@/utils';
import NavigationBar from '@/components/NavigationBar/index.vue'
import useHeaderBgColor from '@/views/withdraw/hooks/useHeaderBgColor'
const defStyle = ref(getCustomerActivityId()?.defStyle || 'style_0')
const { theme } = getTheme()
const {
  merchantCy,
  directRechargeList,
  loadMore,
  loading,
  infiniteRef,
  ionInfinite,
  handleRefresh
} = useCommissionDetailLogic()
</script>
<template>
  <ion-page :class="[defStyle, theme]">
    <slot name="header">
      <NavigationBar :title="`${$t('viewsAssets.RechargeDetails')}`" :bgColor="useHeaderBgColor()" />
    </slot>
    <ion-content :scrollY="false">


      <!-- 头部 -->

      <div class="flex flex-col items-center p-5">
        <slot name="contentTitle">
          <div class="text font-weight-bold flex items-center"><ion-icon class="mr-[0.25rem]" :src="`/images/activity/commission/textFixLeft.svg`"></ion-icon>{{ $t("viewsAssets.RechargeDetails") }}<ion-icon class="ml-[0.25rem]" :src="`/images/activity/commission/textFixRight.svg`"></ion-icon></div>
        </slot>

      </div>
      <div class="mx-3 list" >
        <div
          class="table-header w-full flex-around h-9  rounded-middle-t  text-xs font-weight-bold">
          <span class='w-1/2 text-center'>{{ $t('activity.commission09') }}</span>
          <span class='w-1/2 text-center'>{{ $t('activity.commission10') }}</span>

        </div>


      </div>
      <!-- 列表 -->
      <ion-content class="commission-detail-content" role="feed">
        <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
          @ionRefresh="handleRefresh($event)">
          <ion-refresher-content />
        </ion-refresher>
        <!-- 暂无数据 -->
        <div class="flex flex-col items-center justify-center" v-if="!loading && !directRechargeList.length">
          <div class="w-[7.5rem] h-[7.5rem] mt-36 ">
            <Empty :specifyTheme="defStyle == 'style_1' ? 'green-default' : ''" />
          </div>
        </div>
        <div class="mx-3">



          <div v-for="(item, index) in directRechargeList" class="table-item w-full h-[2.625rem] flex-around text-xs"
           >
            <span class="left-item w-1/2 text-center ">
              {{ item?.userId }}
            </span>
            <span class=" right-item w-1/2 text-center color-text-currency font-weight-bold ">
              <span class="mr-[0.1563rem]">{{ merchantCy }}</span> {{ item?.totalRecharge }}
            </span>

          </div>
        </div>


        <ion-infinite-scroll ref="infiniteRef" threshold="10px" @ionInfinite="ionInfinite">
          <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? '' : ''"
            :loading-spinner="loadMore == 'more' ? 'bubbles' : null" color="primary" />
        </ion-infinite-scroll>
      </ion-content>
    </ion-content>
  </ion-page>
</template>


<style scoped lang="less">
ion-content.commission-detail-content {
  --padding-bottom: 120px;

}
.table-header{
   color: rgba(255, 255, 255, 0.40);
   background: rgba(255, 255, 255, 0.10);
}
.text{
   color: #E2C87B;
 

}
.table-item{
  .left-item{
   color: rgba(255, 255, 255, 0.80)
  }
  .right-item{
    color: var(--accent-color-orange);
    
  }
  &:nth-child(even){
    background: rgba(0, 0, 0, 0.1);


  }
}

.new-skin-symbol {
.style_0 {
  .text {
    color: var(--ep-color-text-highlight);
  }
    .list{
    .table-header {
      background: var(--ep-color-background-fill-surface-raised-L2);
      border-radius: var(--ep-border-radius-s) var(--ep-border-radius-s) 0 0;
     span {
      color: var(--ep-color-text-weaker);
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-bold);
     }
    }
  }
  .table-item {
      font-size: var(--ep-font-size-s);
    }
  .table-item .left-item {
    color: var(--ep-color-text-default);
    font-weight: var(--ep-font-weight-regular);
  } 
  .table-item .right-item {
    color: var(--ep-color-text-warning);
    font-weight: var(--ep-font-weight-bold);
  }
  .table-item:nth-child(odd) {
    background: var(--ep-color-background-fill-surface-lowered);
  }
  .text {
      font-size: var(--ep-font-size-xl);
      font-weight: var(--ep-font-weight-bold);
  }
 }
}
</style>
