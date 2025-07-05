<script setup lang="ts">
import { rewardConfigsType, receiveType, limitLevelType } from '@/views/activity/luckyBet/type';
import Ball from '@/views/activity/luckyBet/comp/Ball.vue'
import { IonIcon } from '@ionic/vue'
import { getImageUrl } from '@/utils'
import CollectionLimit from '@/views/activity/luckyBet/comp/CollectionLimit.vue'
const props = defineProps<{
   receiveDataList: receiveType[],
   rewardConfigs: rewardConfigsType[],
   headerTextList: string[],
   merchantCy: string,
   activityRule: string,
   receiveCountType: string,
   limitLevelList: limitLevelType[]
}>()
const getClassNames = computed(() => {
   const classNameMap = {
      3: 'item-3',
      2: 'item-2',
   }
   return classNameMap[props.headerTextList.length as keyof typeof classNameMap] || ''
})
</script>
<template>
   <div class="rules-area">

      <ul class="table-header">
         <li v-for="item in headerTextList" :key="item" :class="[getClassNames]">
            <div class="inner">{{ item }}</div>
         </li>
      </ul>
      <ul class="rules-list">
         <li v-for="item in rewardConfigs" :key="item.uuid">
            <div :class="[getClassNames, 'order']">

               <div v-for="it in [...item.condition]" :key="it" class="mr-[0.15rem]">
                  <Ball :digit="it" />
               </div>
               <span class="mr-[0.2rem] count" v-if="item.isContains"><span class="mr-[0.1rem]">X</span>{{ item.count
                  }}</span>
            </div>
            <div :class="[getClassNames, !item.rewardTypeIsFixed ? 'multiple' : 'amount']">
               <span class="mr-[0.1563rem]" v-if="item.rewardTypeIsFixed">{{ merchantCy }}</span>{{
                  item.rewardAmount }}<span class="x" v-if="!item.rewardTypeIsFixed">X</span>
            </div>
            <div v-if="item.isShowRewardLimit" :class="[getClassNames, 'amount']"><span class="mr-[0.1563rem]">{{
               merchantCy }}</span>{{
                     item?.rewardLimit }}</div>
         </li>

      </ul>

      <ul class="times">
         <li v-for="(item, i) in receiveDataList" :key="item.id">
            <div class="times-num">
               <span class="merchant" v-if="i === receiveDataList.length - 1">{{ merchantCy }}</span>
               <ion-icon class="infinite" v-if="item.value === Number.POSITIVE_INFINITY"
                  :src="getImageUrl('svg/infinite.svg')" />
               <span v-else>{{ item.value }}</span>
            </div>
            <div class="first-word word">{{ item.firstWord }}</div>
            <div class="remaining-text word">{{ item.remainingText }}</div>
         </li>
      </ul>
      <CollectionLimit :receiveCountType="receiveCountType" :limitLevelList="limitLevelList" />
      <div class="rule-text keep-space">
         <div class="title mb-[1.25rem]">{{ $t('viewsActivity.lossFollow') }}</div>
         <div class="ruleItem  mb-[1rem]" v-for="(item, index) in activityRule.split('\n')" :key="index">
			  <p class="ruleDes">
					{{ item }}
			  </p>
			</div>
      </div>
   </div>



</template>

<style scoped lang="less">
.filter-blur(@color) {
   content: '';
   width: 5rem;
   height: .625rem;
   position: absolute;
   top: 3px;
   left: 50%;
   transform: translateX(-48%);
   opacity: 0.73;
   background: @color;
   filter: blur(25.20000076293945px);
}

.width-style {
   .item-2 {
      &:first-child {
         flex: 0.7;
      }



      &:last-child {
         flex: 0.3;
      }
   }

   .item-3 {
      &:first-child {
         width: 10.625rem;
      }

      &:nth-child(2) {
         width: 6rem;
      }

      &:last-child {
         width: 6.25rem;
      }
   }


}

#activity-luckyBet-rules-style_0 {

   .style(@timesItemBgColor: --color-bg-300,
      @timesItemColor: --color-text-100,
      @merchantCyColor: --color-text-40,
      @amountColor: --accent-color-orange,
      @wordColor: --color-text-40,
      @tableHeaderColor: --color-text-40,
      @bgColor: --color-bg-200,
      @multipleColor: --ep-color-text-warning,
      @countColor: --color-text-100,
      @timeBgColor: --color-bg-200,
      @timeInfiniteColor: null,
      @ruleTextColor: --color-text-40) {
      .rules-area {
         padding: 0 .75rem;
         margin-top: 1.875rem;


         .times {
            width: 100%;
            height: 6.6875rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(@timeBgColor);
            border-radius: var(--rounded-middle);
            padding: .6563rem .75rem;
            box-sizing: border-box;
            margin: 1.875rem 0 1rem;

            li {
               width: 6.5625rem;
               height: 5.375rem;
               background: var(@timesItemBgColor);
               border-radius: var(--rounded-small);
               text-align: center;
               position: relative;
               overflow: hidden;


               .times-num {
                  font-size: var(--font-size-20);
                  font-weight: var(--font-weight-bold);
                  color: var(@timesItemColor);
                  line-height: 1.875rem;
                  margin: .8rem 0 .3rem;
                  height: 1.875rem;

                  .merchant {
                     font-size: var(--font-size-10);
                     color: var(@merchantCyColor);
                     margin-right: .125rem;
                  }

                  .infinite {
                     font-size: 1.875rem;
                     color: var(@timeInfiniteColor);
                  }
               }

               .word {
                  font-size: var(--font-size-10);
                  color: var(@wordColor);
                  line-height: .9375rem;

               }


               &:first-child::after {
                  .filter-blur(#F643FF);
               }

               &:nth-child(2)::after {
                  .filter-blur(#98FF3F);
               }

               &:last-child::after {
                  .filter-blur(#46C7FE);
               }

            }

         }

         .table-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(@bgColor);
            border-radius: var(--rounded-middle) var(--rounded-middle) 0 0;
            box-sizing: border-box;

            li {
               color: var(@tableHeaderColor);
               font-size: var(--font-size-12);
               font-weight: var(--font-weight-bold);
               text-align: center;
               height: 2.25rem;
               line-height: 2.25rem;

               .inner {
                  display: inline-block;
                  vertical-align: middle;
                  line-height: 1.2;
               }


            }

            .width-style()
         }

         .rules-list {

            width: 100%;

            li {
               width: 100%;
               height: 2.625rem;
               display: flex;
               justify-content: space-between;
               align-items: center;
               text-align: center;
               font-size: var(--font-size-12);

               .order {
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  .count {
                     font-size: var(--font-size-14);
                     color: var(@countColor);
                     font-weight: var(--font-weight-medium);
                     margin-left: .5625rem;

                     span {
                        font-weight: var(--font-weight-regular);
                        color: var(--color-text-80);
                        font-size: var(--font-size-12);
                     }
                  }
               }

               .multiple {
                  font-weight: 700;
                  color: var(@multipleColor);
               }

               .x {
                  font-size: var(--font-size-10);
               }

               .amount {
                  font-weight: 700;
                  color: var(@amountColor);

                  .count {
                     font-size: var(--font-size-10);
                  }
               }

               &:nth-child(even) {
                  background: var(--color-bg-400);
               }

               .width-style();
            }


         }

         .rule-text {
            margin-top: .875rem;
            font-size: var(--font-size-12);
            color: var(@ruleTextColor);
            line-height: 1.125rem;
         }

      }

   }

}

.yellow-dark,
.green-dark {
   #activity-luckyBet-rules-style_0.style();
}

.purple-light {
   #activity-luckyBet-rules-style_0.style(@timesItemBgColor: --color-bg-400, @timesItemColor: --theme-color-800, @merchantCyColor: --text-color-white-40);
}

.amber-purple {
   #activity-luckyBet-rules-style_0.style(@timesItemColor: --text-color-white-100);
}

.blue-default {
   #activity-luckyBet-rules-style_0.style(@timesItemColor: --color-text-100);
}

.green-default {
   #activity-luckyBet-rules-style_0.style(@timesItemColor: --color-text-gray-100, @amountColor: --color-warning);
}

.forest-green {
   #activity-luckyBet-rules-style_0.style(@timesItemColor: --color-text-white-100,
      @wordColor: --color-text-white-40,
      @merchantCyColor: --text-color-white-40, @tableHeaderColor: --text-color-white-40, @amountColor: --color-warning);
}

.auroral-yellow {
   #activity-luckyBet-rules-style_0.style(@timesItemColor: --color-text-gray-100, @amountColor: --accent-color-yellow-1, @tableHeaderColor: --color-text-gray-200);
}

.new-skin-symbol {
   #activity-luckyBet-rules-style_0.style(@timesItemColor: --ep-color-text-default,
      @timesItemBgColor: --ep-color-background-fill-body-default,
      @tableHeaderColor: --ep-color-text-weaker,
      @bgColor: --ep-color-background-fill-surface-raised-L2,
      @amountColor: --ep-color-text-warning,
      @multipleColor: --ep-color-text-success,
      @countColor: --ep-color-text-default,
      @timeBgColor: --ep-color-background-fill-surface-raised-L1,
      @wordColor: --ep-color-text-weaker,
      @merchantCyColor: --ep-color-text-weaker,
      @timeInfiniteColor: --ep-color-icon-highlight,
      @ruleTextColor: --ep-color-text-weaker);

   .rules-area {

      .table-header {
         border-radius: var(--ep-border-radius-s) var(--ep-border-radius-s) 0 0;

         li {
            font-size: var(--ep-font-size-s);
            font-weight: var(--ep-font-weight-bold);
         }
      }

      .rules-list {
         li {
            font-size: var(--ep-font-size-s);

            .order {
               .count {
                  font-size: var(--ep-font-size-m);
                  font-weight: var(--ep-font-weight-bold);

                  span {
                     font-weight: var(--ep-font-weight-regular);
                  }
               }
            }

            .multiple {
               font-weight: var(--ep-font-weight-medium);
            }

            .x {
               font-size: var(--ep-font-size-xs);
            }

            .amount {
               font-weight: var(--ep-font-weight-bold);

               .count {
                  font-size: var(--ep-font-size-xs);
               }
            }

            &:nth-child(even) {
               background: var(--ep-color-background-fill-surface-lowered);
            }
         }
      }

      .rule-text {
         font-size: var(--ep-font-size-s);
         font-weight: var(--ep-font-weight-regular);
         .title {
            font-weight: var(--ep-font-weight-medium);
            color: var(--ep-color-text-default);
         }
         .ruleItem {
            .ruleDes {
               margin-left:0.25rem;
               padding-left: 0.9375rem;
               text-indent: -0.9375rem;
            }
         }
      }
   }
}
</style>
