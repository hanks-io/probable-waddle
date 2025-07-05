<script setup lang="ts">
import { IonImg, IonIcon} from '@ionic/vue';
const emit = defineEmits(["checkHandle"])
defineProps<{
  template: any;
  templateName: string;
}>();

const checkHandle = () => {
  emit("checkHandle")
}
</script>
<template>
  <div :class="templateName" class="content-top-wrap relative pb-[0.0625rem]">
    <div class="gradient-overlay" v-if="templateName === 'four'"></div>
    <div class="flex items-center iconHeader">
      <!-- 应用图标 -->
      <ion-img class="w-[4.5rem] h-[4.5rem] mr-6 rounded-[20%] overflow-hidden" slot="start"
        :src="template?.appIconUrl" />
      <div class="flex-1">
        <p class="main-text text-2xl leading-none  ellipsis w-[15.375rem]">{{ template?.appName }}</p>
        <p class="text-xl leading-none text-[#01875F]">{{ template?.appDomain }}</p>
        <p class="text-[.75rem]  sub-text">{{ $t('viewsSystem.downloadIndex0') }}</p>
      </div>
    </div>
    <div class="flex items-center text-sm my-6">
      <div class="flex-1 flex flex-col items-center">
        <p class="main-text font-semibold"> 4.9 ★</p>
        <p class="text-xs sub-text">{{ $t('viewsSystem.downloadIndex1') }}</p>
      </div>
      <i class="h-6 w-[1px] line-bg" />
      <div class="flex-1 flex flex-col items-center">
        <p class="main-text font-semibold">100M +</p>
        <p class="text-xs sub-text">{{ $t('viewsSystem.downloads') }}</p>
      </div>
      <i class="h-6 w-[1px] bg-[#E8EAED]" />
      <div class="flex-1 flex flex-col items-center">
        <p class="main-text font-semibold">18+</p>
        <p class="text-xs sub-text">{{ $t('viewsSystem.downloadIndex2') }}</p>
      </div>
    </div>
    <!-- 安装模块 -->


    <div class="btn  shiny flex flex-col items-center text-xs" @click="checkHandle">
      <div class="flex items-center">
        <ion-img class="w-3  mr-1" src="/icons/ic_sd.png" />
        <span class="text-sm text-[#ffe336]">{{ $t('viewsSystem.downloadIndex01') }}</span>
      </div>
      {{ $t('viewsSystem.downloadIndex05') }}
    </div>



    <div class="flex items-center justify-center my-6 text-sm text-[#01875f]">
      <ion-icon class="text-2xl mr-3" src="/svg/download-share.svg" />
      <p>{{ $t('viewsSystem.downloadIndex3') }}</p>
      <ion-icon class="text-2xl ml-6 mr-3" src="/svg/download-safe.svg" />
      <p>{{ $t('viewsSystem.downloadIndex4') }}</p>
    </div>
  </div>

</template>

<style scoped lang="less">
.shiny {
  position: relative;
  overflow: hidden;
}

.shiny::before {
  content: '';
  animation: shiny 6s ease-in-out infinite;
  background: white;
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px
}

@keyframes shiny {
  0% {
    opacity: 0;
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    transform: scale(0) rotate(45deg);
  }

  81% {
    opacity: 1;
    transform: scale(4) rotate(45deg);
  }

  100% {
    opacity: 0;
    transform: scale(50) rotate(45deg);
  }
}


#dw-content-top {
  .style(@color1: #000, @color2: #fff, @garyColor: #5F6368, @borderColor: #E8EAED, @bgColor: #F5F6F8) {

    .content-top-wrap{
       background-color: @bgColor;
    }
    .main-text {
      color: @color1;
    }

    .sub-text {
      color: @garyColor;
    }

    .line-bg {
      background-color: @borderColor;
    }

    .btn {
      width: 100%;
      padding: 10px 8px;
      border-radius: 8px;
      background: #01875f;
      color: @color2;
      cursor: pointer;
    }
  }

}

.first {
  #dw-content-top.style()
  
}

.four {
  #dw-content-top.style(#fff, #000, #9AA0A6, #3C4043);
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  margin-top: -1.875rem;
  z-index: 11;
  background: #1f2124;
  .iconHeader {
    margin-top: -0.9375rem;
  }
  .gradient-overlay {
  position: absolute;
  top: -1.1875rem;
  left: 0;
  width: 100%;
  height: 1.25rem; /* 渐变高度 */
  background: linear-gradient(to top, #1f2124, rgba(0, 0, 0, 0));
  z-index: -1;
}
}
.four.content-top-wrap {
  background-color: #1f2124 !important;
}
</style>
