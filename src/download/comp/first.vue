<script setup lang="ts">
import { ref } from 'vue';
import { playOutline } from 'ionicons/icons'
import { tabs } from '@/download/data';
import ContentTop from './ContentTop.vue';
import { IonContent, IonFooter, IonToolbar, IonImg, IonIcon, IonHeader } from '@ionic/vue';
import useTemplateLogic from '@/download/useTemplateLogic';
const {
  template,
  showGoogleInfo,
  introductlist,
  currentScore,
  currentCommentList,
  styleName,
  videoUrl,
  appScore
} = useTemplateLogic();
const emit = defineEmits(["checkHandle"])
const checkHandle = () => {
  emit("checkHandle")
}


// 全屏视频节点
const videoRef = ref<HTMLVideoElement | null>(null);
const enterFullScreen = () => {
  const videoElement = videoRef.value;
  videoElement.muted = false; // 取消静音
  if (videoElement) {
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.mozRequestFullScreen) { // Firefox
      videoElement.mozRequestFullScreen();
    } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { // IE/Edge
      videoElement.msRequestFullscreen();
    } else if (videoElement.webkitEnterFullscreen) { // iOS Safari
      videoElement.webkitEnterFullscreen();
    }
  }
}
//检测视频退出全屏时
const handleFullscreenChange = () => {
  const videoElement = videoRef.value;
  if (videoElement && !document.fullscreenElement) {
    videoElement.muted = true; // 静音
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});
</script>


<template>
  <ion-header mode="ios" collapse="fade" v-if="showGoogleInfo" id="first">
    <ion-toolbar>
      <ion-img class="w-40" slot="start" src="/images/download/GooglePlay-left.png" />
      <ion-img class="w-28" slot="end" src="/images/download/GooglePlay-right.png" />
    </ion-toolbar>
  </ion-header>
  <ion-content class="text-sm" id="first">
    <div class="relative" v-if="styleName === 'style_4' && videoUrl">
      <video ref="videoRef" autoplay loop class="w-full h-[13.6875rem] object-fill" muted >
        <source :src="videoUrl" type="video/mp4">
      </video>
      <button @click="enterFullScreen" class="absolute top-[5rem] left-[50%] translate-x-[-50%] w-[7rem] h-[2.5rem] bg-[rgba(0,0,0,0.54)] rounded-[1.25rem] text-[0.875rem] flex items-center justify-center font-medium text-white"><ion-icon :icon="playOutline" class=" text-[20px]"></ion-icon>{{ $t('viewsSystem.downloadIndex58') }}</button>
    </div>
    <div v-if="styleName === 'style_4' && !videoUrl" class="h-[3.125rem] bg-[#1f2124]">
    </div>
    <slot name="contentTopFour" v-if="styleName === 'style_4'">
      <ContentTop :template="template" @checkHandle="checkHandle" templateName="first" />
    </slot>
    <div class="paddingDiv">
    <slot name="contentTop" v-if="styleName !== 'style_4'">
      <ContentTop :template="template" @checkHandle="checkHandle" templateName="first"/>
    </slot>

    <!-- 宣传海报 -->
    <div class="flex overflow-x-auto">
      <div class='publicUrl' v-for="item of (template?.appPublicUrl?.filter((it: any) => it.includes('http')))"
        :key="item">
        <img :src="item">

        <!-- <ion-img class="min-w-[7.875rem] inline-block  w-[9.5rem] h-[7.5rem] mr-2.5 rounded-lg overflow-hidden" :src="item" /> -->
      </div>

    </div>
    <div class="mt-6">
      <div class="text-[#202124] text-lg font-bold flex justify-between mb-3">
        {{ $t('viewsSystem.downloadIndex5') }}
        <ion-img class="w-[.9375rem]"
          src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-right-arrow.png" />
      </div>
      <p v-for="it in introductlist" :key="it">{{ it }}</p>
    </div>
    <div class="mt-6">
      <div class="text-[#202124] font-bold mb-2">{{ $t('viewsSystem.downloadIndex9') }}</div>
      <div class="description__content" id="update-time">{{ $t('viewsSystem.downloadIndex10') }}</div>
      <div class="flex flex-wrap" v-if="showGoogleInfo">
        <div class="border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">{{ $t('viewsSystem.downloadIndex11') }}
        </div>
        <div class="border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">{{ $t('viewsSystem.downloadIndex12') }}
        </div>
        <div class="border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">{{ $t('viewsSystem.downloadIndex13') }}
        </div>
        <div class="border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">{{ $t('viewsSystem.downloadIndex14') }}
        </div>
        <div class="border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">{{ $t('viewsSystem.downloadIndex15') }}
        </div>
        <div class="border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">{{ $t('viewsSystem.downloadIndex16') }}
        </div>
      </div>
    </div>
    <div class="mt-6">
      <div class="text-[#202124] font-bold text-lg flex justify-between mb-3">
        {{ $t('viewsSystem.downloadIndex17') }}
        <ion-img class="w-[.9375rem]"
          src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-right-arrow.png" />
      </div>
      <div class="description__content" data-t="data_safety.content">
        {{ $t('viewsSystem.downloadIndex18') }}
      </div>
      <div class="mt-6 border p-6 rounded-lg">
        <div class="flex items-start">
          <div>
            <ion-img class="w-4 mr-4"
              src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/ic_share.png" />
          </div>
          <div>
            <p>{{ $t('viewsSystem.downloadIndex19') }}</p>
            <p>{{ $t('viewsSystem.downloadIndex20') }}</p>
          </div>
        </div>
        <div class="flex items-start mt-4">
          <div>
            <ion-img class="w-4 mr-4"
              src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/ic_cloud_upload.png" />
          </div>
          <div>
            <p>{{ $t('viewsSystem.downloadIndex21') }}</p>
          </div>
        </div>
        <div class="flex items-start mt-4">
          <ion-img class="w-4 mr-4"
            src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/ic_lock.png" />
          <div>
            <p>{{ $t('viewsSystem.downloadIndex22') }}</p>
          </div>
        </div>
        <div class="flex items-start mt-4">
          <ion-img class="w-4 mr-4"
            src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/ic_delete.png" />
          <div>
            <p>{{ $t('viewsSystem.downloadIndex23') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <div class="text-[1.1875rem] font-bold mb-3 text-[#202124] ">{{ $t('viewsSystem.downloadIndex24') }}</div>
      <div class="comments__tips">
        {{ $t('viewsSystem.downloadIndex25') }}
        {{ $t('viewsSystem.downloadIndex25') }}
      </div>
      <div class="mt-6 flex flex-wrap">
        <div class="flex border border-[#dadce0] bg-[#e6f3ef] px-3 rounded-[.9375rem] mt-2.5 mr-4 text-[#028760]">
          <ion-img class="w-[.8125rem] mr-1"
            src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-phone.png" />
          {{ $t('viewsSystem.downloadIndex26') }}
        </div>
        <div class="flex border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">
          <ion-img class="w-[.8125rem] mr-1"
            src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-tablet.png" />
          {{ $t('viewsSystem.downloadIndex27') }}
        </div>
        <div class="flex border border-[#dadce0] px-3 rounded-[.9375rem] mt-2.5 mr-4">
          <ion-img class="w-[.8125rem] mr-1"
            src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-crbook.png" />
          {{ $t('viewsSystem.downloadIndex28') }}
        </div>
      </div>
      <div class="mt-6 flex items-center justify-between">
        <div>
          <div class="text-[#202124] text-[1.625rem] leading-tight">{{ appScore ? appScore : currentScore }}</div>
          <div class="flex">
            <img class="w-3.5" src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/fullStar.png"
              style="width: 14px; height: 14px; margin-right: 2px">
            <img class="w-3.5" src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/fullStar.png"
              style="width: 14px; height: 14px; margin-right: 2px">
            <img class="w-3.5" src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/fullStar.png"
              style="width: 14px; height: 14px; margin-right: 2px">
            <img class="w-3.5" src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/fullStar.png"
              style="width: 14px; height: 14px; margin-right: 2px">
            <img class="w-3.5" src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/halfStar.png"
              style="width: 14px; height: 14px; margin-right: 2px">
          </div>
          <div class="leading-loose my-1.5 text-xs">50000</div>
        </div>
        <div>
          <div class="text-[.6875rem] flex items-center justify-between">
            5
            <div class="ml-3.5 w-40 h-[.5625rem] bg-[#e3e3e3] rounded-md">
              <p class="h-full bg-[rgb(2,135,96)] rounded-md"></p>
            </div>
          </div>
          <div class="text-[.6875rem] flex items-center justify-between">
            4
            <div class="ml-3.5 w-40 h-[.5625rem] bg-[#e3e3e3] rounded-md">
              <p class="h-full w-4 bg-[rgb(2,135,96)] rounded-md"></p>
            </div>
          </div>
          <div class="text-[.6875rem] flex items-center justify-between">
            3
            <div class="ml-3.5 w-40 h-[.5625rem] bg-[#e3e3e3] rounded-md">
              <p class="h-full w-4 bg-[rgb(2,135,96)] rounded-md"></p>
            </div>
          </div>
          <div class="text-[.6875rem] flex items-center justify-between">
            2
            <div class="ml-3.5 w-40 h-[.5625rem] bg-[#e3e3e3] rounded-md"></div>
          </div>
          <div class="text-[.6875rem] flex items-center justify-between">
            1
            <div class="ml-3.5 w-40 h-[.5625rem] bg-[#e3e3e3] rounded-md"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="mt-6" v-for="item in currentCommentList" :key="item.userName">
          <div class="flex justify-between">
            <div class="flex items-center">
              <ion-img class="w-8 h-8 rounded-full object-fill overflow-hidden" :src="item.userImg" />
              <div class="ml-3">{{ $t(`${item.userName}`) }}</div>
            </div>
            <ion-img class="w-1"
              src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-more.png" />
          </div>
          <div class="flex items-center mt-4">
            <img class="star" v-for="it in item.score"
              src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/fullStar.png"
              style="width: 11px; height: 11px; margin-right: 2px">
            <span class="text-xs ml-2">{{ $t(`${item.date}`) }}</span>
          </div>
          <div class="mt-3">{{ $t(`${item.comment}`) }}</div>
        </div>

      </div>
      <div class="h-[1px] bg-[#dadce0] mt-10" />
    </div>
    <div class="mt-6">
      <div>
        <div class="font-medium" v-if="showGoogleInfo">Google Play</div>
        <div class="mt-3.5" data-t="play_pass">{{ $t('viewsSystem.downloadIndex35') }}</div>
        <div class="mt-3.5" data-t="play_points">{{ $t('viewsSystem.downloadIndex36') }}</div>
        <div class="mt-3.5" data-t="gift_cards">{{ $t('viewsSystem.downloadIndex37') }}</div>
        <div class="mt-3.5" data-t="Resgatar">{{ $t('viewsSystem.downloadIndex38') }}</div>
        <div class="mt-3.5" data-t="refund_policy">{{ $t('viewsSystem.downloadIndex39') }}</div>
      </div>
      <div class="flex items-center mt-6">
        <div class="mr-5" data-t="service_terms">{{ $t('viewsSystem.downloadIndex43') }}</div>
        <div class="mr-5" data-t="privacy">{{ $t('viewsSystem.downloadIndex44') }}</div>
        <div class="mr-5" data-t="about_google_play">{{ $t('viewsSystem.downloadIndex45', {
          name: showGoogleInfo ?
            'Google Play' : ''
        }) }}</div>
      </div>
      <div class="flex items-center mt-6">
        <div class="mr-5" data-t="developers">{{ $t('viewsSystem.downloadIndex46') }}</div>
        <div class="mr-5" data-t="google_store" v-if="showGoogleInfo">Google Store</div>
        <div class="mr-5" data-t="language">{{ $t('viewsSystem.downloadIndex47') }}</div>
      </div>
    </div>
  </div>
  </ion-content>
  <ion-footer mode="md">
    <ul class="footer-tabs">
      <li v-for="item in tabs" :key="item.tab">
        <div>
          <ion-icon class="tab-img text-2xl" :src="`/svg/download/${item.tab}.svg`" />
        </div>
        <div class="text-sm text-[#5f6368]" :style="item.tab == 'app' ? 'color: #01875f' : '#FFF'">
          {{ item.text }}
        </div>
       
      </li>
    </ul>
  </ion-footer>
</template>



<style scoped>
ion-header#first {
  background-color: #F5F6F8;
}

ion-content#first {
  background-color: #F5F6F8;
}


ion-toolbar {
  --background: #F5F6F8;
  --border-color: #DDD;
  --padding-top: .75rem;
  --padding-bottom: .75rem;
  --padding-start: 1.25rem;
  --padding-end: 1.25rem;
}

.ion-page>ion-content {
  --background: transparent;
  --color: #5F6368;
}
.paddingDiv {
  padding: 1.5rem;
}


.publicUrl {
  width: 7.875rem;
  height: 14rem;
  background-size: 100% 100%;
  flex-shrink: 0;
  margin-right: 0.5rem;
  background-size: 100% 100%;
}

.publicUrl img {
  vertical-align: top;
  width: 100%;
  height: 100%;
}



ion-footer {
  --ion-background-color: transparent;
}

ion-footer ion-toolbar {
  --ion-toolbar-background: transparent;
}

ion-footer ion-toolbar ion-tab-bar {
  --ion-tab-bar-background: transparent;
}
.footer-tabs{
   display: flex;
   justify-content: space-around;
   align-items: center;
   padding: 1rem;
   background-color: #F5F6F8;
   height: 5rem;
   padding: 12px 20px;
   box-sizing: border-box;
   text-align: center;
}
</style>
