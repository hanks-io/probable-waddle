<script setup lang="ts">
import InstallModal from '../comp/InstallModal.vue';
import InstallProgress from '../comp/InstallProgress.vue';
import { IonButton, IonSpinner } from '@ionic/vue';
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
const props = defineProps<{
  visible: boolean

  checking?: boolean;
}
>()
const appStore = useAppStore(); // 用户store
const { unStandalone,  isShowGuidePwa} = toRefs(appStore)
const {
  handleDownloadInstallAction,
  installStatus,
  btnText,
  installProgress,
} = usePwaLogic();



const checked = ref(false);     // 是否检测完成
const progress = ref(0);        // 安装进度
// const installType = channelStore.promotionInfo?.installType;
// 监听检测状态
watch(() => props.checking, (val) => {
  if (val) {
    const checkTimer = setInterval(() => {
      if (progress.value < 100) {

        if (unStandalone.value) {               // 判断是否可以安装PWA或按钮文本内容是否为'打开应用'
          progress.value += 2;
        } else {
          progress.value += 1;
        }
      } else {
        progress.value = 100;
        checked.value = true;
        clearInterval(checkTimer);
      }
    }, 60);
  }
})



const closeModal = () => {
  appStore.isShowGuidePwa = false;
}



</script>
<template>

  <InstallModal :visible="visible" type="download-pwa" :isShowGuidePwa="isShowGuidePwa" @closeModal='closeModal'>
    <template #actionArea>
      <!-- 安装按钮 -->
      <div class="w-full px-10 mx-auto" v-if="checked" >
        <InstallProgress v-if="installStatus === 'Installing'" :value="installProgress" color="success" />
        <div class="w-full" v-else>
          <button class="install"  @click="handleDownloadInstallAction">{{ btnText }}</button>
        </div>
      </div>
      <!-- 检测环境进度条 -->
      <div class="flex justify-center relative w-11 h-11" v-else>
        <ion-spinner name="crescent" class="absolute w-full h-full" />
        <div class="absolute w-full h-full flex justify-center items-center text-xs">{{ progress }}%</div>
      </div>
    </template>



  </InstallModal>
</template>

<style scoped lang="less">
ion-button {
  --background: linear-gradient(180deg, #72CB45 0%, #337611 100%);
  min-height: 2.8125rem;
}

button.install {
  background: #01875f;
  color: white;
  border-radius: .5rem;
  width: 100%;
  height: 2.8125rem;
}
</style>
