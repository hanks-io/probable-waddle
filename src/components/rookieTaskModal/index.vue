<!-- 新人任务弹窗 -->
<template>
  <div class="warpper task-modal-warpper">
    <div class="btn-close">
      <div @click="closeModal">
        <ion-icon icon="/first/svg/login/close.svg"></ion-icon>
      </div>
    </div>
    <div class="content">
      <div>
        <div class="text-warpper">
          <ion-img class="logo" :src="logo"></ion-img>
          <p class="text">{{ $t('task.000001') }}</p>
        </div>
        <div class="btn-download" @click="downloadApp">
          <div class="reward-label">{{ merchantCy }}{{ rewardAmount }}</div>
          <ion-icon class="btn-icon" :icon="deviceIconPath"></ion-icon>
          <span class="btn-text">{{ $t('task.000002') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { modalController, IonIcon } from '@ionic/vue';
import { taskDetailApi } from '@/api/task';
import openAPK from '@/utils/pwa/openAPK'
import { convertMoneyToShow } from '@/utils/custom'
import { iosInstallAction } from '@/pwa/hooks/useInstallPWAOrAPK'
import type { IosInstallExtraParams } from '@/pwa/hooks/useInstallPWAOrAPK'
const props = defineProps<{
  data: {
    taskId: number;
  }
}>();

const tenantStore = useTenantStore();
const systemStore = useSystemStore();   // 系统信息
let appUrl = ''
const logo = computed(() => tenantStore.tenantInfo?.icon);
const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);
const { isIOS } = toRefs(systemStore)
const rewardAmount = ref('');
const iosOnlineInfo: IosInstallExtraParams = {
  iosAddressType: '',
  iosPackageId: 0,
  installUrl: ''

}
const deviceIconPath = computed(() => isIOS.value ? '/svg/apple.svg' : '/svg/android.svg')

const closeModal = () => {
  modalController.dismiss();
};

const downloadApp = () => {

  const IOSSystemTodo = () => {
    iosInstallAction('APPSTORE', iosOnlineInfo)
  }
  const androidSystemTodo = () => {
    copyTextAppendEL.value = 'task-modal-warpper'
    openAPK(true, appUrl)
  }


  isIOS.value ? IOSSystemTodo() : androidSystemTodo()
};
const calcRewardAmount = (min: number, max: number) => {
  if (min === max) return convertMoneyToShow(max)
  return `${convertMoneyToShow(min)}-${convertMoneyToShow(max)}`
}
function getTaskDetail() {
  taskDetailApi({
    taskId: props.data.taskId,
  }).then((res) => {
    const { rewardMax, rewardMin } = res
    rewardAmount.value = calcRewardAmount(rewardMin, rewardMax)
    const { apkUrl, iosUrl, iosAddressType, iosPackageId } = res.otherConfig
    appUrl = isIOS.value ? iosUrl : apkUrl
    Object.assign(iosOnlineInfo, { iosAddressType, iosPackageId, installUrl: iosUrl })
  });
}

onMounted(() => {
  getTaskDetail();
});

</script>

<style scoped lang="less">
.warpper {
  width: 100%;
  height: 100%;
  flex-direction: column;
  .flex-center();
}

.btn-close {
  width: 21.375rem;
  padding-bottom: 0.5rem;
  .flex-end();

  div {
    .flex-center();
    width: 1.875rem;
    height: 1.875rem;
    background-color: rgba(255, 255, 255, 0.20);
    border-radius: 50%;
  }
}

.text-warpper {
  .flex-between();
  padding-bottom: 1.875rem;
}

.logo {
  flex: 0 0 auto;
  width: 4.1875rem;
  height: 4.1875rem;
}

.text {
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
  color: #FFF;
  padding-left: 0.875rem;
}

.content {
  width: 21.375rem;
  height: 11.875rem;
  background-image: url('/images/rookieTask/bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 1.25rem;
  .flex-center();
}

.btn-download {
  position: relative;
  width: 19.2188rem;
  height: 3.4688rem;
  background-image: url('/images/rookieTask/btn.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 1.75rem 0;
  .flex-around();
}

.reward-label {
  display: flex;
  position: absolute;
  top: -20%;
  right: 6%;
  height: 1.25rem;
  padding: 0 0.625rem;
  background-color: #E64021;
  border-radius: 0rem 0.3125rem 0rem 0.3125rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  font-weight: 700;
  color: #FBC63D;
  text-align: center;
}

.btn-icon {
  width: 1.875rem;
  height: 1.875rem;
}

.btn-text {
  font-size: 0.875rem;
  line-height: 1.5;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.80);
}
</style>
