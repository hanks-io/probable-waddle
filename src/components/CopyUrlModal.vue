<template>
 <!-- 拷贝URL弹窗 -->
  <ion-modal id="modal-copy-url" :is-open="visible" :backdrop-dismiss="false">
    <div class="h-full w-full flex flex-col items-center justify-center">
      <div class="content w-[24.375rem] pb-5 flex flex-col items-center rounded-3xl relative" @click.stop>
        <div class="header w-full h-[8.4375rem]" />
        <img class="absolute w-full -top-[2.0625rem] left-0" src="/images/copy-url-float.png">
        <p class="font-semibold mb-2">Lembrete Acolhedor</p>
        <p class="text-[#595959] text-sm">{{`Please use ${isIos ? 'Safari' : 'Chrome'} to open the URL`}}</p>
        <p class="bg-[#F5F5F5] line-clamp-1 w-80 leading-10 rounded-md px-2.5 mt-2.5 mb-4">{{ url }}</p>
        <div class="flex justify-center w-72">
          <ion-button class="confirm mr-8" @click="copy(url)">Copiar URL</ion-button>
          <ion-button class="cancel" fill="outline" @click="modalDismiss">Cancelar</ion-button>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { copy } from '@/hooks/Copy';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store/app';
import { useSystemStore } from '@/store/system';
import { IonModal, IonButton } from '@ionic/vue';
import { buildUrlParam } from '@/utils';

const emit = defineEmits(['modalDismiss']);

const route = useRoute();             // 当前路由
const appStore = useAppStore();       // 应用Store
const systemStore = useSystemStore(); // 系统Store

interface Props {
  visible: boolean;  // 是否显示弹窗
}

defineProps<Props>()

const isIos = computed(() => systemStore.app?.build === 'iOSH5'); // 是否是iOS
// 构建url参数)
const url = computed(() => {
  const baseUrl = location.href.split('?')[0];
  const query = buildUrlParam({ ...route.query, token: appStore.token });
  return `${baseUrl}${query}`;
})

/**
 * @description 模态框关闭事件
 */
function modalDismiss() {
  emit('modalDismiss');
}
</script>

<style scoped>
div.content {
  color: var(--ion-background-color);
  background-color: var(--ion-text-color);
}


div.header {
  background: url('/svg/copy-url-bg.svg') no-repeat;
  background-size: 100%;
}

ion-button {
  min-height: 2.1875rem;
  font-size: 0.75rem;
  --border-radius: .3125rem;
}

ion-button.confirm {
  --background: #FBA531;
  --color: #fff;
  
} 

ion-button.cancel {
  --border-color: #FBA531;
  --color: #FBA531
;
}
</style>
