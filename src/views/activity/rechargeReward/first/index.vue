<!-- 充值赠送 -->
<template>
  <ion-page>
    <!-- 顶部导航栏 -->
    <NavigationBar :title="activityName" />
    <ion-content class="ion-padding space-y-3">
      <div class="content-text" v-html="content">
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import useLogic from '../logic'

const {
  activityName,
  content,
} = useLogic()

</script>

<style scoped>
.content-text {
  color: var(--color-recharge-reward-text)
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

.new-skin-symbol .content-text {
  color: var(--ep-color-text-default);
}

:deep(.new-skin-symbol),  :deep(table), :deep(th), :deep(td) {
  border: 1px solid var(--ep-color-border-default);
}
</style>
