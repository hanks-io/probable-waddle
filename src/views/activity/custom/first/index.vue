<!-- 自定义活动 -->
<template>
  <ion-page>
    <NavigationBar :title="activityName" />
    <ion-content>
      <div v-html="content" class="content">
      </div>
      <div v-if="showApplyBtn" class="btn-warpper">
        <Button class="apply" :shiny="true" @click="applyHandle">{{ $t('activity.custom1') }}</Button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
import useLogic from '../logic'

const {
  activityName,
  content,
  applyHandle,
  showApplyBtn
} = useLogic()

</script>

<style scoped lang="less">

ion-content {
  --padding-top: 1rem;
  --padding-bottom: 1rem;
  --padding-start: 1rem;
  --padding-end: 1rem;
}

.content {
  color: var(--ep-color-text-default, var(--color-custom-text));
  margin-bottom: 0.75rem;
}

.btn-warpper {
  .flex-center();
}

.apply {
  width: 17.5rem;
  height: 2.5rem;
  font-size: var(--ep-font-size-m, 0.875rem);
  line-height: 1.25rem;
}

/* 解决v-html显示富文本表格边框不显示 */
:deep(table) {
  border-collapse: collapse;
  width: 100%;
}

:deep(table), :deep(th), :deep(td) {
  border: 1px solid var(--ep-color-border-default, var(--line-color));
}

:deep(th), :deep(td) {
  /* padding: 8px; */
  text-align: left;
}

</style>
