<script setup lang="ts">
import { IonImg, IonIcon, } from '@ionic/vue';
import { facebookTipModal } from '@/utils/pwa/openSafariBrowser'
import { getImageUrl } from '@/utils'
const tenantStore = useTenantStore(); // 租户store
const currentRegionCode = computed(() => tenantStore.tenantInfo?.code); // 租户信息
const closeModal = () => {
  facebookTipModal?.dismiss()
}
</script>
<template>
  <div class="facebook-tip-wrap">
    <ion-img class="arrow" src="/facebookTip/arrow.png" />
    <div class="content">
      <div class="guide-img-wrap">
        <ion-img class="guide-img" :src="`/facebookTip/guide-${currentRegionCode}.png`" />
      </div>
      <div class="step step-1">
        <ion-img class="step-img" src="/facebookTip/step1.png" />
        <div class="step-text-wrap step-1-text-wrap">
          <span class="step-text">{{ $t('viewsSystem.downloadIndex53') }} </span>
          <ion-img class="index-img" :src="getImageUrl('img/index1.png')" />
          <span class="step-text">{{ $t('viewsSystem.downloadIndex54') }} </span>
          <span class="step-text">{{ $t('viewsSystem.downloadIndex55') }} </span>
        </div>

      </div>

      <div class="step step-2">
        <ion-img class="step-img" src="/facebookTip/step2.png" />
        <div class="step-text-wrap">
          <span class="choose">{{ $t('viewsSystem.downloadIndex56') }} </span>
          <div class="index2-img-wrap">
            <ion-img class="index2-img" src="/facebookTip/index2.png" />
            <span class="step-text step-text-2">{{ $t('viewsSystem.downloadIndex57') }} </span>
          </div>


        </div>

      </div>
    </div>

    <div class="close-btn-wrap">
      <ion-icon class="close-btn" src="/facebookTip/close_button.svg" @click="closeModal" />
    </div>

  </div>

</template>

<style scoped lang="less">
.facebook-tip-wrap {
  position: relative;

  .arrow {
    width: 10rem;
    height: 5rem;
    position: absolute;
    right: 13px;
    top: 18px;
    transform: rotate(-5deg);
  }

  .content {
    width: 20.625rem;
    margin: 5.1875rem auto 0;


    .guide-img-wrap {
      width: 8.125rem;
      height: 4.875rem;
      margin-left: 90px;

      .ion-img {
        width: 100%;
        height: 100%;
      }
    }


    .step {
      width: 20.625rem;
      height: 5rem;
      box-sizing: border-box;
      padding: .75rem 1.6875rem;
      border-radius: 5rem;
      background: linear-gradient(90deg, #D97416 -0.68%, #D9AF16 99.32%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-style: 1rem;
      color: #fff;
      line-height: 32px;
      font-weight: 500;

      .step-img {
        width: 3.5rem;
        height: 3.5rem;
        margin-right: .75rem;

      }

      .step-text-wrap {

        .index-img {
          width: 2rem;
          height: 1.75rem;
          margin: 0 .5rem;
        }

        .choose {
          padding-left: .75rem;

        }

        .index2-img-wrap {
          width: 14.5625rem;
          height: 2.125rem;
          position: relative;
          text-align: left;

          .index2-img {
            width: 100%;
            height: 100%
          }

          .step-text {
            position: absolute;
            top: 0;
            left: 2.625rem;
            color: #000;
            font-size: .75rem;
            font-weight: 700;
            line-height: 2.125rem;
          }
          .step-text-2{
            font-size: .625rem;
           
          }
        }
      }

      .step-1-text-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }

    .step-1 {
      display: flex;
      justify-content: space-between;
    }

    .step-2 {
      margin-top: 2.8125rem
    }

  }

  .close-btn-wrap {
    width: 30px;
    height: 30px;
    margin: 2.875rem auto 0;

    .close-btn {
      font-size: 1.875rem;

    }
  }




}
</style>
