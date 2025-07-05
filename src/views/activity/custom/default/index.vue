<!-- 自定义活动 -->
<template>
  <ion-page>
    <NavigationBar :title="activityName" />
    <ion-content class="space-y-3 ion-padding">
      <div v-html="content" class="text-[--color-text-second]">
      </div>
      <div v-if="showApplyBtn" class="flex items-center justify-center">
        <ion-button class="text-sm apply" @click="applyHandle">{{ $t('activity.custom1') }}</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import useLogic from '../logic'

const {
  activityName,
  content,
  applyHandle,
  showApplyBtn
} = useLogic()

</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/custom/default/style/base-index.less";
  @import "@/views/activity/custom/default/style/theme-style.less";

  #activity-custom-default-index.style();

	.blue-default {
    #activity-custom-default-index.style(
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --border-radius,
      --line-color,
      --color-text-gray-200
    );
	}

	.auroral-yellow {
    #activity-custom-default-index.style(
      --theme-color-800,
      --theme-color-800,
      --border-radius,
      --line-color,
      --color-text-black-100,
      --color-text-black-100
    );
	}

	.green-default {
    #activity-custom-default-index.style(
      --theme-color-gradient-100,
      --theme-color-gradient-100,
      --border-radius,
      --line-color,
      --color-text-gray-200
    );
	}

  .amber-purple {
    #activity-custom-default-index.style(
      --segment-gradients-purple,
      --segment-gradients-purple,
      --border-radius,
      --line-color,
      --text-color-light-purple-2-100
    );
  }
</style>
