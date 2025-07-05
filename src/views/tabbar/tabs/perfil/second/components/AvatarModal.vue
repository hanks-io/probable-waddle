<!-- 图像选择弹窗 -->
<template>
  <ion-modal id="avatar" :is-open="visible" @didDismiss="dismissModal">
    <div class="absolute bottom-0 max-h-full w-full flex flex-col avatar-main">
      <ion-toolbar mode="ios">
        <ion-title class="h-[3.125rem]">{{ $t('viewsTabbar.changeAvatar') }}</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="dismissModal">
            <ion-icon class="text-base rounded-[.3125rem]" slot="icon-only" :icon="close"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-row class="text-sm avatar-tab">
        <ion-col size="6" class="flex items-center justify-center border-b" :class="gender ? 'select-female-border' : ''" @click="gender = 1">
          <ion-icon class="text-[1.375rem]" src="/svg/male.svg"/>
          <span>{{ $t('option.male') }}</span>
        </ion-col>
        <ion-col size="6" class="flex items-center justify-center border-b" :class="!gender ? 'select-female-border' : ''" @click="gender = 0">
          <ion-icon class="text-[1.375rem]" src="/svg/female.svg"/>
          <span>{{ $t('option.female') }}</span>
        </ion-col>
      </ion-row>
      <div class="flex-1 py-2.5 overflow-y-auto avatar-list">
        <ion-grid v-for="(item, index) in genderList" :key="item" v-show="gender === index">
          <ion-row>
            <ion-col size="3" class="flex-center mb-[0.75rem]" v-for="i in (avatarCount && Number(avatarCount[item]))" :key="i" @click="selectAvatarHandle(item, i)">
              <img class="rounded-[50%] w-[3.75rem] h-[3.75rem]" :class="calculateSelected(item, i) || calculateAvatar(item, i) ? ' border-[.125rem] border-[#38A8FA]' : ''" :src="`${avatarCount?.url}${item}_${i}.jpg`" />
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <div class="pb-[1rem] px-[0.625rem]">
		  	<Button @click="confirmHandle">{{ $t('main.confirm') }}</Button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons';
import { onBeforeRouteLeave } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
import Button from '@/components/second/Button/index.vue'
import { useAvatarLogic } from '@/views/tabbar/tabs/perfil/hooks/avatarLogic'
import { IonModal, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/vue';

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['dismiss'])  // 子传父退出

const {
  genderList,
  gender,
  selectAvatarIndex,
  selectAvatarGender,
  avatarCount,
  defaultAvatar,
  calculateAvatar,
  selectAvatarHandle,
  calculateSelected,
  dismissModal,
  confirmHandle,
  getAvatarCount
} = useAvatarLogic(emit);

/**
 * 生命周期: 离开路由前
 */
onBeforeRouteLeave(()=> {
  emit('dismiss');
})

</script>

<style scoped lang="less">

ion-modal#avatar {
  --height: 100%;
}

.text-base {
  color: var(--text-color-light-purple-1-100);
}

.avatar-main {
  background: var(--color-bg-300);
  .avatar-tab {
    background: #22203b;
    ion-col {
      height: 3rem;
      color: var(--text-color-light-purple-2-100);
      border-bottom: none;
      span {
        font-size: var(--font-size-12);
        line-height: 1.3125rem;
      }
    }
    ion-col.select-female-border {
      color: var(--text-color-light-purple-1-100);
      position: relative;
      span {
        font-weight: var(--font-weight-bold);
      }
    }
    ion-col.select-female-border::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: .125rem;
      background: var(--gradients-indicatorLine);
    }
  }
}

.avatar-main::after {
  content: "";
  position: absolute;
  border-radius: 263px;
  width: 16.4375rem;
  height: 3.125rem;
  opacity: 0.2;
  top: 0;
  left: -4.25rem;
  background: var(--theme-color-400);
  filter: blur(31.649999618530273px);
  z-index: 10;
  pointer-events: none;
}

.avatar-main::before {
  content: "";
  position: absolute;
  width: 7.0625rem;
  height: 3.125rem;
  opacity: 0.19;
  top: 0;
  right: -0.5rem;
  background: var(--gradients-green);
  filter: blur(31.649999618530273px);
  z-index: 10;
  pointer-events: none;
}

ion-toolbar {
  --background: transparent;
  height: 3.125rem;
  ion-title {
    font-weight: var(--font-weight-medium);
    --color: var(--text-color-light-purple-1-100);
  }
}

/* 隐藏滚动条 */
div.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

div.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
</style>
