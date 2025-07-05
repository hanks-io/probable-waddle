<!-- 自定义活动 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName" />
    <ion-content class="space-y-3 ion-padding">
      <div v-html="content" class="content">
      </div>
      <div v-if="showApplyBtn" class="flex items-center justify-center">
        <Button class="text-sm apply" :shiny="true" @click="applyHandle">{{ $t('activity.custom1') }}</Button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/second/Button/index.vue'
import useLogic from '../logic'

const {
  activityName,
  content,
  applyHandle,
  showApplyBtn
} = useLogic()

</script>

<style scoped>
.content {
  color: var(--color-custom-text);
}

.apply {
  width: 17.5rem;
  height: 2.5rem;
}

/* 解决v-html显示富文本表格边框不显示 */
:deep(table) {
  border-collapse: collapse;
  width: 100%;
}

:deep(table), :deep(th), :deep(td) {
    border: 1px solid var(--line-color);
}

:deep(th), :deep(td) {
    /* padding: 8px; */
    text-align: left;
}
</style>
