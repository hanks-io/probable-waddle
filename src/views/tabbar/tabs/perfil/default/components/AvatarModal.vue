<!-- 图像选择弹窗 -->
<template>
  <ion-modal id="avatar" :is-open="visible" @didDismiss="dismissModal">
    <div class="content">
      <ion-toolbar mode="ios">
        <ion-title >{{ $t("viewsTabbar.changeAvatar") }}</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="dismissModal"
            ><ion-icon class="close" slot="icon-only" :icon="close"
          /></ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-row class="sex">
        <ion-col
          size="6"
          :class="gender ? 'selected' : 'gender-default'"
          @click="gender = 1"
        >
          <ion-icon src="/svg/male.svg" />
          <span>{{ $t("option.male") }}</span>
        </ion-col>
        <ion-col
          size="6"
          :class="gender ? 'gender-default' : 'selected'"
          @click="gender = 0"
        >
          <ion-icon  src="/svg/female.svg" />
          <span>{{ $t("option.female") }}</span>
        </ion-col>
      </ion-row>
      <div class="img">
        <ion-grid v-for="(item, index) in genderList" :key="item" v-show="gender === index">
          <ion-row>
            <ion-col size="3" v-for="i in avatarCount && Number(avatarCount[item])" :key="i" @click="selectAvatarHandle(item, i)">
              <img
                :class="calculateSelected(item, i) || calculateAvatar(item, i) ? 'selected' : ''"
                :src="`${avatarCount?.url}${item}_${i}.jpg`"
              />
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <ion-button class="submit" expand="block" @click="confirmHandle">{{ $t("main.confirm") }}</ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { close } from "ionicons/icons";
import { onBeforeRouteLeave } from "vue-router";
import { useAvatarLogic } from "@/views/tabbar/tabs/perfil/hooks/avatarLogic";
import { IonModal, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol } from "@ionic/vue";

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(["dismiss"]); // 子传父退出

const {
  genderList,
  gender,
  avatarCount,
  calculateAvatar,
  selectAvatarHandle,
  calculateSelected,
  dismissModal,
  confirmHandle,
} = useAvatarLogic(emit);

/**
 * 生命周期: 离开路由前
 */
onBeforeRouteLeave(() => {
  emit("dismiss");
});
</script>

<style scoped lang="less">
@import '@/views/tabbar/tabs/perfil/default/styles/AvatarModal/base-index.less' ;
@import '@/views/tabbar/tabs/perfil/default/styles/AvatarModal/theme-style.less' ;
#tabbar-tabs-perfil-default-AvatarModal.style();
.blue-default {
  #tabbar-tabs-perfil-default-AvatarModal.style();
}
.green-default {
  #tabbar-tabs-perfil-default-AvatarModal.style(
    --color-bg-400,
    --theme-color-500,
    --color-text-gray-100,
    --color-line,
    --color-text-gray-200,
    --theme-color-500,
    --color-bg-400,
    --theme-color-gradient-100,
    --color-text-white-100,
    --theme-color-600,
    --theme-color-600,
    --theme-color-600,
    --color-bg-50
  );
}
.amber-purple {
  #tabbar-tabs-perfil-default-AvatarModal.style(
    --color-bg-400,
    --theme-color-400,
    --color-text-gray-100,
    --color-color,
    --color-text-gray-200,
    --theme-color-400,
    --color-bg-400,
    --theme-color-gradient-100,
    --color-text-white-100,
    --theme-color-100,
    --theme-color-100,
    --theme-color-100,
    --color-bg-50
  );
}

.forest-green {
  #tabbar-tabs-perfil-default-AvatarModal.style(
    --color-bg-200,
    --color-line,
    --color-text-gray-100,
    --color-bg-100,
    --color-text-gray-200,
    --theme-color-500,
    --color-bg-200,
    --theme-color-gradient-100,
    --color-text-white-100,
    #5eb76c,
    #6bbb79,
    #6bbb79,
    --color-bg-200
  )
}
.auroral-yellow {
  #tabbar-tabs-perfil-default-AvatarModal.style(
    @AvatarModal08:--theme-color-800,
    @AvatarModal09:--color-text-black-100,
  );
}
</style>
