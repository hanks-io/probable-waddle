<!-- 多级分销 邀请链接 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('mlmAgent.inviteLink')" />
    <ion-content>
      <div class="link">
         <!-- 轮播图 -->
         <div class="swiperBg mt-[1rem]">
          <swiper @swiper="onSwiper">
            <swiper-slide v-for="item in linkMes" :key="item.id">
              <div class="item relative overflow-hidden">
                <img :src="item.src"/>
                <div class="qrCode px-[0.2462rem] py-[0.265rem]">
                  <QrCode :value="shareUrl" :size="remToPx(3.8438)" :margin="0" :color="`#000000`" :bgColor="`#FFFFFF`" />
                </div>
              </div>
            </swiper-slide>
          </swiper>
         </div>
        <div class="btn px-[0.75rem] w-full" >
         <div class="top">
           {{ $t('mlmAgent.invitationMsg') }}
         </div>
         <div v-if="!isSecondSkin" @click="copyBtnClick" class="invitation-copy-btn">
           <div v-if="shareUrlLoading" class="loader"></div>
           <span v-else>{{ `${$t('main.copy')} ${$t('mlmAgent.inviteLink')}` }}</span>
         </div>
         <div v-else class="invitation-else-btn">
          <Button @click="copyBtnClick">{{ $t('main.copy') }} {{ $t('mlmAgent.inviteLink') }}</Button>
         </div>
         <div @click="customerBtnClick" class="invitation-cust-btn"> 
           <ion-icon icon="/svg/spread/customerService.svg" />
           {{  $t('mlmAgent.invitationCusMsg') }}
         </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { remToPx } from '@/hooks/RemToPx';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useinvitationLinkSpread } from '@/views/mlmAgent/hooks/invitationLinkSpread'
import { IonPage, IonContent, IonIcon} from '@ionic/vue';
import Button from '@/components/second/Button/index.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import QrCode from 'qrcode.vue';

// 当前是second皮肤
const isSecondSkin = computed(() => getTheme().skin == 'second');

const {
  onSwiper,
  shareUrl,
  linkMes,
  copyBtnClick,
  customerBtnClick,
  shareUrlLoading
} = useinvitationLinkSpread();
</script>

<style scoped lang="less">
@import '@/views/mlmAgent/styles/InvitationLink/base-index.less';
@import '@/views/mlmAgent/styles/InvitationLink/theme-style.less';

#mlmAgent-components-invitationLink-index.style();

.yellow-dark,
.green-dark,
.purple-light,
.amber-purple,
.blue-default,
.forest-green,
.green-default,
.auroral-yellow {
  #mlmAgent-components-invitationLink-index.style(
    --mlm-toolbar-bg-color,
    --mlm-invitation-qr-code-bg,
    --mlm-invitation-footer-bg-color,
    --color-text-third,
    --color-bg-yellow-btn-emphasis,
    --color-text-yellowBtn-active,
    --color-bg-commission-first,
    --mlm-invitation-cust-btn-text-color,
    --mlm-invitation-csut-color,
  );
}

.auroral-yellow {
  #mlmAgent-components-invitationLink-index.style(
    @mlmAgent-components-invitationLink-index-04: --color-text-white-100;
    @mlmAgent-components-invitationLink-index-05: --theme-color-800;
    @mlmAgent-components-invitationLink-index-06: --color-text-black-100;
    @mlmAgent-components-invitationLink-index-07: --color-bg-100;
    @mlmAgent-components-invitationLink-index-08: --color-text-white-100;
    @mlmAgent-components-invitationLink-index-09: --color-text-white-100
  );
}

.new-skin-symbol {
  #mlmAgent-components-invitationLink-index.style(
    --ep-color-background-fill-top-nav-secondary,
    --ep-neutral-white-white-100,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-dynamic-primary,
    --ep-color-text-inverse,
    --ep-color-background-fill-surface-raised-L2,
    --ep-color-text-default,
    --ep-color-icon-default
  );
}

.loader {
  width: 0.325rem;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear alternate;
}
@keyframes l5 {
    0%  {box-shadow: 20px 0 #000, -20px 0 #0002;background: #000 }
    33% {box-shadow: 20px 0 #000, -20px 0 #0002;background: #0002}
    66% {box-shadow: 20px 0 #0002,-20px 0 #000; background: #0002}
    100%{box-shadow: 20px 0 #0002,-20px 0 #000; background: #000 }
}

.new-skin-symbol {
  @import '@/views/mlmAgent/styles/InvitationLink/index-phantom.less';
}



</style>
