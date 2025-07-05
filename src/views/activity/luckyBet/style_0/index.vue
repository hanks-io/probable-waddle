<script setup lang="ts">
import { IonPage, IonContent, IonImg } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import useHeaderBgColor from '@/views/withdraw/hooks/useHeaderBgColor'
import { useLogic, useLuckyBetSlipComp } from '@/views/activity/luckyBet/logic';
import { useBtnComponents } from '@/views/activity/commission/logic';
import Footer from '@/views/activity/comp/first/Footer/index.vue'
import { getRandomValue } from '@/utils/custom'
const {
  tabId,
  tabs,
  btnDisabled,
  componentProps,
  activityName,
  isShowAwardBtn,
  paddingBottom,
  isScrollY,
  receiveLuckyBet
} = useLogic();
const templateBtn = useBtnComponents();

const luckyBetComp = computed(() => useLuckyBetSlipComp(tabId.value))

</script>
<template>
  <ion-page>
    <NavigationBar :title="activityName" :bgColor="useHeaderBgColor()" />
    <ion-content class="lucky-bet-slip" :scrollY="isScrollY">
      <div class="banner-area">
        <IonImg src="/luckyBet/banner.png" />
        <div class="gold-area">
          <IonImg v-for="item in 7" :key="item" :src="`/luckyBet/gold${item}.png`"
            :class="['gold-img', `gold-${item}`, `moveUpDown${getRandomValue(1, 3)}`]" />

        </div>
      </div>
      <div class="content-area">
        <ul class="tab">
          <li v-for="item in tabs" :class="{ 'active': tabId === item.id }" :key="item.id" @click="tabId = item.id">
            <span>{{
              item.name }}</span></li>
        </ul>


      </div>

      <component :is="luckyBetComp" v-bind="componentProps" v-if="luckyBetComp" />


    </ion-content>
    <Footer class="footer" v-if="isShowAwardBtn">
      <component :is="templateBtn" :disabled="btnDisabled" :shiny="true" @click="receiveLuckyBet">{{
        $t('activity.mysterious05') }}</component>
    </Footer>

  </ion-page>



</template>

<style scoped lang="less">
.lucky-bet-slip {
  --padding-bottom: v-bind('paddingBottom');
}

.banner-area {
  width: 24.375rem;
  height: 16.875rem;
  position: relative;

  ion-img {
    width: 100%;
    height: 100%;
  }

  .gold-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .gold-img {
    position: absolute;
    transform: scale(1.15);

  }

  .moveUpDown1 {
    animation: moveUpDown1 16s ease-in-out infinite;
    /* 动画持续2秒，无限循环 */
  }

  .moveUpDown2 {
    animation: moveUpDown2 7s ease-in-out infinite;
    /* 动画持续2秒，无限循环 */
  }

  .moveUpDown3 {
    animation: moveUpDown3 10s ease-in-out infinite;
    /* 动画持续2秒，无限循环 */
  }

  .gold-1 {
    width: 86.67px;
    height: 61.18px;
    top: 9px;
    left: 0;
  }

  .gold-2 {
    width: 109.82px;
    height: 77.52px;
    top: 4px;
    left: 97px;
  }

  .gold-3 {
    width: 146.99px;
    height: 103.76px;
    top: 7px;
    right: -11px;
  }

  .gold-4 {
    width: 138.07px;
    height: 97.46px;
    bottom: 12px;
    left: -12px;
  }

  .gold-5 {
    width: 53.63px;
    height: 37.85px;
    bottom: 61px;
    left: 92px;
    transform: scale(1.4);
  }

  .gold-6 {
    width: 53.63px;
    height: 37.85px;
    bottom: 65px;
    right: 57px;
    transform: scale(1.4);
  }

  .gold-7 {
    width: 83.06px;
    height: 58.63px;
    bottom: 19px;
    right: -4px;
  }
}

@keyframes moveUpDown1 {

  0%,
  50%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(12px);
  }

  75% {
    transform: translateY(-5px);
  }
}

@keyframes moveUpDown2 {

  0%,
  50%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(-6px);
  }

  75% {
    transform: translateY(8px);
  }
}


@keyframes moveUpDown3 {

  0%,
  50%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(-10px);
  }

  75% {
    transform: translateY(-13px);
  }
}


#activity-luckyBet-index-style_0 {

  .style(@activeBgColor: --color-bg-200,
    @activeTextColor: --theme-color-800,
    @textColor: --color-text-80,
    @bgColor: --color-bg-300,
    @lineColor: --line-color) {
    .content-area {
      padding: 1.8125rem .75rem 0;

      .tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 22.875rem;
        height: 2.75rem;
        border-radius: var(--rounded-middle);
        background: var(@bgColor);
        border: 0.0625rem solid var(@lineColor);
        padding: .1875rem;

        li {
          flex: 1;
          text-align: center;
          line-height: 2.375rem;
          font-size: var(--font-size-14);
          color: var(@textColor);
          font-weight: var(--font-weight-regular);
          cursor: pointer;
        }

        .active {
          background: var(@activeBgColor);
          color: var(@activeTextColor);
          font-weight: var(--font-weight-bold);
          border-radius: var(--rounded-small);
        }
      }
    }


  }

  ;
}

.yellow-dark,
.green-dark {
  #activity-luckyBet-index-style_0.style();
}

.purple-light {
  #activity-luckyBet-index-style_0.style(@activeBgColor: --theme-color-800, @activeTextColor: --text-color-white-100);
}

.amber-purple {
  #activity-luckyBet-index-style_0.style(@activeBgColor: --color-bg-100, @activeTextColor: --theme-color-800, @textColor: --text-color-light-purple-2-100);

  .content-area .tab .active span {
    background: linear-gradient(316.85deg, #7041F3 2.45%, #F5C84C 105.89%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.blue-default {
  #activity-luckyBet-index-style_0.style(@activeBgColor: --color-bg-100, @activeTextColor: --theme-color-500, @textColor: --text-color-white-80);
}

.green-default {
  #activity-luckyBet-index-style_0.style(@activeBgColor: --color-bg-100, @activeTextColor: --color-text-gray-100, @textColor: --color-text-gray-200);
}

.forest-green {
  #activity-luckyBet-index-style_0.style(@activeBgColor: --color-bg-100, @activeTextColor: --text-color-white-100, @textColor: --color-text-gray-500);
}

.auroral-yellow {
  #activity-luckyBet-index-style_0.style(@activeBgColor: --color-bg-100, @activeTextColor: --theme-color-800, @textColor: --color-text-gray-200);
}

.new-skin-symbol {
  #activity-luckyBet-index-style_0.style(@activeBgColor: --ep-color-background-fill-surface-raised-L2,
    @activeTextColor: --ep-color-text-selected,
    @textColor: --ep-color-text-default,
    @bgColor: --ep-color-background-fill-surface-raised-L1,
    @lineColor: --ep-color-border-default);

  .content-area {
    padding: 1.8125rem .75rem 0;

    .tab {
      border-radius: var(--ep-border-radius-l);
      font-size: var(--ep-font-size-m);
      font-weight: var(--ep-font-weight-bold);

      li {
        font-weight: var(--ep-font-weight-regular);
      }

      .active {
        font-weight: var(--ep-font-weight-bold);
        border-radius: var(--ep-border-radius-m);
      }
    }
  }
}
</style>
