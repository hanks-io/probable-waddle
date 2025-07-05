<template>
  <ion-modal id="modal-prize" :is-open="modelValue" :backdrop-dismiss="false" class="">
    <!-- 使用17号修改后的样式 -->
    <div class="prize-content">
        <p class="prize-content-p">{{ $t("viewsActivity.congratulationsAcquisition") }}</p>
        <!-- 奖品 -->
        <div class="prize-content-bg">
          <img class="img-cls" src="@/assets/img/activity/modal_piece.png">
          <p class="p-cls">{{ $t("viewsActivity.congratulationsAcquisition") }} {{
            merchantCy }}{{ convertMoneyToShow(awardCount) }}
          </p>
        </div>
        <Button class="btn-cls" @click="closeHandle">{{ $t("main.confirm") }}</Button>
      </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal } from '@ionic/vue';
import Button from '@/components/first/Button/index.vue'
import { convertMoneyToShow } from '@/utils/custom'

const { modelValue, closeHandle, merchantCy, awardCount } = defineProps<{
  modelValue: boolean
  closeHandle: () => void
  merchantCy: string
  awardCount: number
}>()

</script>

<style lang="less" scoped>

/* 奖励弹窗 */
.prize-content {
  border-radius: var(--ep-border-radius-surface-small);
  background: var(--ep-color-background-fill-surface-raised-L2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-left: 1.25rem;
  padding-right: 1.25rem;

  .prize-content-p {
    font-size: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
    color: var(--ep-color-text-default, var(--color-primary-700));
    font-weight: var(--ep-font-weight-bold);
  }

  .prize-content-bg {
    width: 100%;
    background: var(--ep-color-background-fill-body-default);
    text-align: center;
    height: 12.25rem;
    border-radius: var(--ep-border-radius-surface-small);
    padding: 1.25rem 0;

    .img-cls {
      width: 6.75rem;
      margin-left: auto;
      margin-right: auto;
    }

    .p-cls {
      font-weight: var(--ep-font-weight-medium);
      font-size: 0.875rem;
      margin-top: 1.25rem;
      color: var(--color-currency);
    }
  }

  .btn-cls {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
  }
}

ion-modal#modal-prize {
  --width: 22.25rem;
  --height: fit-content;
  /* 高度由内容撑开 */
  --border-radius: var(--rounded-large);
}
</style>
