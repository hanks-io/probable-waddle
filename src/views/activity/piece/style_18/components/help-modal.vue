<template>
  <ion-modal id="modal-help" :is-open="modelValue" :backdrop-dismiss="false">
    <!-- 使用17号代码 -->
    <div class="help-bg">
      <!-- 关闭按钮 -->
      <ion-icon class="icon-cls" :icon="close" @click="closeHandle" />
      <p class="help-p">{{ $t("main.rules") }}</p>
      <!-- 申请说明 -->
      <div class="help-content-bg">
        <p class="p-cls" v-html="formatbr(rule)"></p>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { formatbr } from "@/utils";
import { IonIcon, IonModal } from '@ionic/vue';
import { close } from 'ionicons/icons';

const props = defineProps<{
  modelValue: boolean
  closeHandle: () => void
  rule: string
}>()

</script>

<style scoped lang="less">
/* 帮助弹窗 */
.help-bg {
  padding-bottom: 1.5rem;
  border-radius: var(--ep-border-radius-surface-small);
  background: var(--ep-color-background-fill-surface-raised-L2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: -2;
  padding-left: 1.25rem;
  padding-right: 1.25rem;

  ion-icon {
    color: var(--ep-color-icon-weaker);
  }

  .icon-cls {
    position: absolute;
    font-size: 1.875rem;
    line-height: 2.25rem;
    top: 0.75rem;
    right: 0.75rem;
  }

  .help-p {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
    color: var(--ep-color-text-default, var(--color-primary-700));
    font-weight: var(--ep-font-weight-bold);
  }

  .help-content-bg {
    width: 100%;
    font-size: 0.875rem;
    background: var(--ep-color-background-fill-body-default);
    border-radius: var(--ep-border-radius-l);
    line-height: 1.25;
    padding: 1.25rem;

    .p-cls {
      color: var(--ep-color-text-weaker);
      font-weight: var(--ep-font-weight-medium);
    }
  }
}

ion-modal#modal-help {
  --width: 22.25rem;
  --height: fit-content;
  /* 高度由内容撑开 */
  --border-radius: var(--rounded-large);
}
</style>
