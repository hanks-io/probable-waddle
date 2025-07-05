<script setup lang="ts">
import { IonPage, IonContent, IonImg, IonIcon, } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import useHeaderBgColor from '@/views/withdraw/hooks/useHeaderBgColor'
import { useLogic } from '@/views/activity/referralRewardsNew/logic';
import { useBtnComponents } from '@/views/activity/commission/logic';
import Footer from '@/views/activity/comp/first/Footer/index.vue'
import { getImageUrl } from '@/utils/url'
import { copy } from '@/hooks/Copy';
import shareModal from "@/views/activity/inviteCpf/components/modal/shareModal.vue"
const {
  activityName,
  activityRule,
  currentCanReceiveAmount,
  currentPoolAmount,
  merchantCy,
  btnDisabled,
  receiveBonus,
  pathToDetail,
  openShareModalFun,
  statusInfo,
  statusText,
  openShareModal,
  shareUrl,
  closeShareModalFun,
  t,
} = useLogic();
const templateBtn = useBtnComponents();

</script>
<template>
  <ion-page>
    <NavigationBar :title="activityName" :bgColor="useHeaderBgColor()" />
    <ion-content class="referral-rewards-new">
      <div class="banner-area">
        <div class="inner">
          <div class="title-area">
            <div class="title">{{ $t("referralRewardsNew.000001") }}</div>
            <ion-icon class="symbol" :src="getImageUrl('img/activity/referralRewardsNew/symbol.svg')"
              @click="pathToDetail"></ion-icon>

          </div>

          <div class="pool-amount"><span>{{ merchantCy }}</span>{{ currentPoolAmount }}</div>
        </div>

      </div>
      <div class="status-area">
        <div class="left">
          <div class="sub-text">{{ $t("referralRewardsNew.000002") }}</div>
          <div class="main-text">{{ statusText }}</div>
        </div>

        <img :class="[`img-${statusInfo}`]" :src="getImageUrl(`img/activity/referralRewardsNew/${statusInfo}.png`)" />
      </div>
      <div class="share-area">
        <div class="bonus-area"><img class="bonus-img"
            :src="getImageUrl('img/activity/referralRewardsNew/bonus.png')" />{{ $t("referralRewardsNew.000006") }}
        </div>
        <div class="bonus-amount">
          <div class="bg-area"></div>

          <span>{{ merchantCy }}</span>{{ currentCanReceiveAmount }}


        </div>
        <div class="line"></div>

        <div class="share-action-area">
          <div class="share-text-area">
            <div class="share-text">{{ $t("referralRewardsNew.000007") }}</div>
            <div class="link-text">
              <div class="link-text-url">{{ shareUrl }}</div>
              <ion-icon class="copy-icon" :src="getImageUrl('img/common/copy.svg')" @click="copy(shareUrl)" />
            </div>
          </div>

          <div class="invite-btn" @click="openShareModalFun">
            <ion-icon class="share-icon" :src="getImageUrl('svg/share.svg')" />
          </div>
        </div>


      </div>
      <div class="rule-content  keep-space">
        <div class="title">{{ $t('viewsActivity.lossFollow') }}</div>
        {{ activityRule }}
      </div>
      <shareModal v-if="openShareModal" @closeShare="closeShareModalFun" :shareUrl="shareUrl"
        :shareTitle1="t('referralRewardsNew.000027')" :shareTitle2="t('referralRewardsNew.000028')" />
    </ion-content>
    <!-- 分享弹窗 -->

    <Footer class="footer">
      <component :is="templateBtn" :disabled="btnDisabled" :shiny="true" @click="receiveBonus">{{
        $t('activity.mysterious05') }}</component>
    </Footer>

  </ion-page>



</template>

<style scoped lang="less">
#activity-referral-rewards-new-style_0 {

  .style(@titleColor: --ep-color-text-highlight-white,
    @poolAmountColor: --ep-color-text-success,
    @statusBgColor1: --ep-color-background-fill-glow-secondary-opacity-40,
    @statusBgColor2: --ep-color-background-fill-surface-raised-L2,
    @subTextColor: --ep-color-text-weaker,
    @mainTextColor: --ep-color-text-default,
    @shareAreaBgColor: --ep-color-background-fill-surface-raised-L1,
    @bonusAmountColor: --ep-color-icon-highlight,
    @linkTextColor: --ep-color-icon-info,
    @copyIconColor: --ep-color-icon-highlight,
    @inviteBtnBgColor: --ep-color-background-fill-active-primary,
    @shareIconColor: --ep-color-icon-inverse,
    @lineColor: --ep-color-border-default,
    @mixBlendModeColor: #fff,
    @bonusBgColor: rgba(255, 255, 255, 0.10)) {
    .referral-rewards-new {
      .text(@color: var(@mainTextColor)) {
        color: @color;

        line-height: 1.3125rem;
        font-size: var(--ep-font-size-s, 0.875rem);
      }



      .banner-area {
        width: 100%;
        height: 21.25rem;
        background-image: url('@/assets/img/activity/referralRewardsNew/banner.png');
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;

        .inner {
          position: absolute;
          bottom: 2.125rem;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;


          .title-area {
            height: 1.3125rem;
            display: flex;
            align-items: center;
            justify-content: center;

            .title {
              font-size: var(--ep-font-size-m, 14px);
              color: var(@titleColor);
              margin-right: 9px;
            }

            .symbol {
              width: 1.1875rem;
              height: 1.1875rem;
            }
          }

          .pool-amount {
            font-size: var(--ep-font-size-l, 1.25rem);
            color: var(@poolAmountColor);
            line-height: 1.875rem;
            font-weight: var(--ep-font-weight-medium, 600);

            span {
              margin-right: .1875rem;
            }
          }
        }


      }

      .status-area {
        width: 22.5rem;
        height: 5rem;
        margin: .625rem auto 0;
        border-radius: var(--ep-border-radius-m, .375rem);
        padding: .625rem 1.25rem;
        box-sizing: border-box;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, var(@statusBgColor1, rgba(207, 63, 91, 0.08)) 100%), var(@statusBgColor2, #1A1F30);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          .sub-text {
            color: var(@subTextColor);
            font-size: var(--ep-font-size-s, 0.875rem);
            line-height: 1.25rem;
          }

          .main-text {
            color: var(@mainTextColor);
            font-size: var(--ep-font-size-xxl, 1.5rem);
            line-height: 2.25rem;
          }

        }

        .img-treasureChest {
          width: 3.125rem;
          height: 3.0625rem;
        }

        .img-hourglass {
          width: 2.625rem;
          height: 3.125rem;
        }
      }
      .share-text-area{
        width: 16.875rem
      }

      .share-area {
        width: 22.5rem;
        // height: 15rem;
        background: var(@shareAreaBgColor) url('@/assets/img/activity/referralRewardsNew/share-area-bg.png') no-repeat center / cover;
        border-radius: var(--ep-border-radius-m, .375rem);
        padding: 1.25rem;
        box-sizing: border-box;
        margin: 1rem auto;
        overflow: hidden;

        .bonus-area {
          width: 11.5625rem;
          height: 1.875rem;
          font-size: var(--ep-font-size-s, 0.875rem);
          line-height: 1.875rem;
          border-radius: var(--ep-border-radius-infinity, 999px);
          color: var(@subTextColor);
          background: @bonusBgColor;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: .4375rem auto 20px;

          .bonus-img {
            width: 2rem;
            height: 2rem;
            display: block;
            margin-right: .625rem;
          }
        }

        .bonus-amount {
          width: 13.75rem;
          height: 3.125rem;
          margin: 0 auto;
          font-size: var(--ep-font-size-xxl, 1.5rem);
          line-height: 3.125rem;
          font-weight: var(--ep-font-weight-medium, 600);
          color: var(@bonusAmountColor);
          position: relative;
          text-align: center;

          .bg-area {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, @mixBlendModeColor 50%, rgba(255, 255, 255, 0.00) 100%);
            mix-blend-mode: overlay;
            z-index: 1;
          }

          span {
            margin-right: .1875rem;
          }


        }

        .line {
          width: 100%;
          height: 1px;
          background: var(@lineColor);
          margin: 1.875rem auto 0;
        }

        .share-action-area {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;


          .share-text {
            .text(@color: var(@mainTextColor));
            margin-top: 1.25rem;
          }

          .link-text {
            .text(@color: var(@linkTextColor));
            display: flex;
            align-items: center;
            justify-content: space-between;

            .link-text-url {
              white-space: nowrap;
              width: 90%;
              overflow: hidden;
              text-overflow: ellipsis;

            }

            .copy-icon {
              font-size: var(--ep-font-size-m, .875rem);
              color: var(@copyIconColor);
            }
          }

          .invite-btn {
            width: 2.5rem;
            height: 2.5rem;
            background: var(@inviteBtnBgColor);
            border-radius: var(--ep-border-radius-xl, .625rem);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

            .share-icon {
              font-size: 1.25rem;
              color: var(@shareIconColor);
            }
          }
        }






      }

      .rule-content {
        width: 22.5rem;
        margin: 1rem auto 6.25rem;
        color: var(@subTextColor);
        font-size: var(--ep-font-size-s, .875rem);
        line-height: 18px;

        .title {
          text-align: center;
          color: var(@mainTextColor);
          font-size: var(--ep-font-size-m, .875rem);
          line-height: 1.25rem;
          font-weight: var(--ep-font-weight-bold, 700);
          margin-bottom: .625rem;
        }
      }
    }
  }
}

.new-skin-symbol {
  #activity-referral-rewards-new-style_0.style()
}



.blue-default,
.green-default,
.yellow-dark,
.green-dark,
.forest-green,
.amber-purple {
  #activity-referral-rewards-new-style_0.style(@titleColor: --color-text-100,
    @poolAmountColor: --color-success,
    @statusBgColor1: --color-bg-200,
    @statusBgColor2: --color-bg-200,
    @subTextColor: --color-text-40,
    @mainTextColor: --color-text-100,
    @shareAreaBgColor: --color-bg-200,
    @bonusAmountColor: --color-currency,
    @linkTextColor: --accent-color-blue,
    @copyIconColor: --accent-color-orange,
    @inviteBtnBgColor: --theme-color-800,
    @shareIconColor: --color-text-100,
    @lineColor: --line-color,
  
  )
}


.auroral-yellow {
  #activity-referral-rewards-new-style_0.style(@titleColor: --color-text-100,
    @poolAmountColor: --color-success,
    @statusBgColor1: --color-bg-200,
    @statusBgColor2: --color-bg-200,
    @subTextColor: --color-text-40,
    @mainTextColor: --color-text-100,
    @shareAreaBgColor: --color-bg-200,
    @bonusAmountColor: --color-currency,
    @linkTextColor: --accent-color-blue,
    @copyIconColor: --accent-color-orange,
    @inviteBtnBgColor: --theme-color-800,
    @shareIconColor: --color-text-black-100,
    @lineColor: --line-color,
  
  )
}

.purple-light {
  #activity-referral-rewards-new-style_0.style(@titleColor: --text-color-white-100,
    @poolAmountColor: --color-success,
    @statusBgColor1: --color-bg-200,
    @statusBgColor2: --color-bg-200,
    @subTextColor: --color-text-40,
    @mainTextColor: --color-text-100,
    @shareAreaBgColor: --color-bg-500,
    @bonusAmountColor: --theme-color-800,
    @linkTextColor: --accent-color-blue,
    @copyIconColor: --accent-color-orange,
    @inviteBtnBgColor: --theme-color-800,
    @shareIconColor: --text-color-white-100,

    @mixBlendModeColor: #000,
    @bonusBgColor: #E7DBFF,
  )
}
</style>
