<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue';
import { getImageUrl } from '@/utils/url';
import { copyTextToClipboard } from '@/hooks/useCopyAccountInfo'
import { showToast } from '@/utils'
// import { safariGuideModal } from '@/utils/pwa/showSafariGuide';
const appStore = useAppStore(); // 应用状态
defineProps<{
  url: string
}
>()
const copyUrl = (url: string) => {
  copyTextAppendEL.value = 'guide-safari-wrap'
  try {
    copyTextToClipboard(url)
    showToast('toast.copySuccess')
  } catch (error) {
    console.log(error)
    showToast('toast.copyFail')
  }
}
// const closeForceModal = () => {
//   appStore.modalVisible = false;
//   safariGuideModal?.dismiss()
// }

</script>
<template>
  <div class="guide-safari-wrap">
    <!-- <ion-icon class="close-icon" src="/svg/close_button.svg" @click="closeForceModal" />
    <div class="safari-icon-wrap">
      <ion-img class="safari-icon" :src="getImageUrl('img/safari.png')" />
      <div class="text">{{ $t('ForceBindings.000008') }}</div>
    </div> -->

    <div class="text">{{ $t('ForceBindings.000008') }}</div>
    <div class="rectangle">
      <ion-img class="safari-icon" :src="getImageUrl('img/safari.png')" />
      <div class="copy-text truncate">{{ url }}</div>


    </div>
  </div>
</template>

<style scoped lang="less">
#pwa-safari-guide-modal-index {
  .style(@color: --color-text-40, @bg: --color-bg-100, @rectangleColor: --color-text-40, @borderColor: --color-bg-100) {
    .guide-safari-wrap {
      width: 17.5rem;
      margin: 1rem auto;

      .text {
        font-size: 14px;
        color: var(@color);
        text-align: left;
        line-height: 1.5rem;
        margin-bottom: 1rem;
      }

      .rectangle {
        width: 100%;
        height: 2.5rem;
        background: var(@bg);
        border-radius: 6px;
        color: #110000;
        padding: .4375rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(@borderColor);
        .copy-text {
          width: 14.25rem;
          font-size: .875rem;
          line-height: 1.625rem;
          color: var(@rectangleColor);
        
        }

        .safari-icon {
          font-size: 30px;
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }

  }
}
html {
  #pwa-safari-guide-modal-index.style();
}

.new-skin-symbol {
  #pwa-safari-guide-modal-index.style(
    @rectangleColor: --ep-color-text-weak;
  );
}

.purple-light {
  #pwa-safari-guide-modal-index.style( @bg: --color-bg-300);
}
.green-default {
  #pwa-safari-guide-modal-index.style( @bg: --text-color-white-100, @color: --color-text-gray-300, @rectangleColor: --color-text-gray-300, @borderColor: --theme-color-800);
}
.blue-default {
  #pwa-safari-guide-modal-index.style( @bg: --text-color-white-100, @color: --color-text-gray-800, @rectangleColor: --color-text-gray-800, @borderColor: --accent-color-yellow);
}
.forest-green {
  #pwa-safari-guide-modal-index.style( @bg: --text-color-white-100, @color: --color-text-gray-300, @rectangleColor: --color-text-gray-300, @borderColor: --theme-color-800);
}
.auroral-yellow {
  #pwa-safari-guide-modal-index.style( @bg: --text-color-white-100, @color: --color-text-black-100, @rectangleColor: --color-text-black-100, @borderColor: --accent-color-yellow);
}
.amber-purple .default{
  #pwa-safari-guide-modal-index.style( @bg: --text-color-white-100, @color: --text-color-black-100, @rectangleColor: --text-color-black-100, @borderColor: --theme-color-800);
}
</style>
