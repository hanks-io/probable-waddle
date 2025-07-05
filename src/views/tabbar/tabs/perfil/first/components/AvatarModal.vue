<!-- 图像选择弹窗 -->
<template>
  <ion-modal id="avatar" :is-open="visible" @didDismiss="dismissModal">
    <div class="absolute bottom-0 max-h-full w-full flex flex-col avatar-main">
      <ion-toolbar mode="ios">
        <ion-title class="h-[3.125rem] avatar-title">{{ $t('viewsTabbar.changeAvatar') }}</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="dismissModal">
            <ion-icon class="text-base avatar-close-icon" slot="icon-only" :icon="close"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-row class="avatar-tab">
        <ion-col size="6" class="flex items-center justify-center border-b" :class="gender ? 'select-female-border' : ''" @click="gender = 1">
          <ion-icon class="user-avatar-gender-icon" src="/svg/male.svg"/>
          <span>{{ $t('option.male') }}</span>
        </ion-col>
        <ion-col size="6" class="flex items-center justify-center border-b" :class="!gender ? 'select-female-border' : ''" @click="gender = 0">
          <ion-icon class="user-avatar-gender-icon" src="/svg/female.svg"/>
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
      <ion-button class="submit mx-[0.375rem] min-h-[2.5rem]" expand="block" @click="confirmHandle">{{ $t('main.confirm') }}</ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons';
import { onBeforeRouteLeave } from 'vue-router';
import BackButton from '@/components/BackButton.vue';
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
  color: var(--text-color-white-100);
}

.avatar-main {
  background: var(--color-bg-300);
  .avatar-tab {
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: var(--color-bg-400);
    ion-col {
      height: 3rem;
      color: var(--my-card-detail-color);
      border-bottom: none;
      span {
        font-size: 0.75rem;
        line-height: 1.3125rem;
      }
    }
    ion-col.select-female-border {
      color: var(--color-primary-800);
      border-bottom: .125rem solid var(--color-primary-btn-active);
      span {
        font-weight: 700;
      }
    }
    ion-icon.user-avatar-gender-icon {
      font-size: 1.375rem;
    }
  }
}

ion-toolbar {
  --background: var(--avatar-toolbar-bg);
  height: 3.125rem;
  ion-title {
    font-weight: 500;
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

ion-button.submit {
  --background: var(--color-primary-btn-active);
  --border-radius: 0.25rem;
  --color: var(--text-color-white-100);
  font-weight: 700;
  margin: -0.75rem 0.375rem 1.25rem;
  text-transform: none;	/* 取消按钮文本自动大写 */
}

ion-button.submit::part(native) {
  font-size: 0.875rem;
  line-height: 1.3125rem;
}

.new-skin-symbol {
  @import "@/views/tabbar/tabs/perfil/first/styles/components/avatarModal/theme-style.less";
}
</style>
