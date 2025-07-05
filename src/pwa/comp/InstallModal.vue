<script setup lang="ts">
import GuidePwa from './GuidePwa.vue';
import { IonModal, IonImg } from '@ionic/vue';
import { visibleGuideClose } from '@/pwa/hooks/usePwaLogic'
const appStore = useAppStore(); // 用户store
const { isShowInstallModalContent } = toRefs(appStore)

const emit = defineEmits<{
  (e: 'closeModal'): void;
}>()
const props = defineProps<{
  visible: boolean
  isShowGuidePwa: boolean
  type: string
}
>()
const closeModal = () => {
  emit('closeModal')
}
const closeBtnVisible = computed(() => {
  if (props.type === 'download-pwa') return false
  return visibleGuideClose.value
})
</script>
<template>
  <ion-modal mode="md" :is-open="visible" id="modal-install-download" :backdrop-dismiss="false">
    <GuidePwa v-if="isShowGuidePwa" @closeModal='closeModal' :visible="closeBtnVisible" />
    <div class="w-80 py-5 px-[.625rem] mx-auto rounded-2xl pop-content" :class="type"
      v-if="!isShowGuidePwa && isShowInstallModalContent">

      <div class="flex flex-col items-center">
        <div class="flex items-center">
          <ion-img class="w-7 mr-1.5" src="/icons/ic_raid_install.png" />
          <p class="text-[1.75rem]">{{ $t('viewsSystem.downloadIndex01') }}</p>
        </div>
        <p class="text-lg text-[#666] border border-[#747475] leading-tight px-3 rounded-[.1875rem] mt-2.5">{{
          $t('viewsSystem.downloadIndex02') }}</p>
        <div class="flex items-center bg-[#0287601A] border border-[#028760] rounded-full px-3 my-5">
          <ion-img class="w-4 mr-1.5" src="/icons/ic_actived.png" />
          <p class="safe-text text-xl  leading-tight">{{ $t('viewsSystem.downloadIndex03') }}</p>
        </div>
        <slot name="actionArea">


        </slot>
      </div>
    </div>
  </ion-modal>
</template>

<style scoped lang="less">
.pop-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

}

.home-pwa {
  background: #101629;
  color: #ffff
}

.download-pwa {
  background: #ffff;
  color: #000;

  .safe-text {
    color: #028760
  }
}
</style>
