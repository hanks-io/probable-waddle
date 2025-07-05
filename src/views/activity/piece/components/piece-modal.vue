<template>
  <ion-modal id="modal-piece" :is-open="modelValue" :backdrop-dismiss="false">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <span>{{ $t('viewsActivity.willSoonBeAbleGet') }}</span>
          <ion-icon :icon="close" class="modal-close-icon" @click="closeHandle" />
        </div>
        <div class="modal-body">
          <div class="modal-body-prize">
            <p class="modal-body-prize-text">{{ rangeAmountPrize }}</p>
            <p class="modal-body-prize-desc">{{ $t('viewsActivity.amountAlreadyOwned') }}</p>
          </div>
          <!-- 步骤 -->
          <div class="modal-body-step">
            <div class="modal-body-step-text">
              <p>{{ $t('viewsActivity.numberOfInitiations') }}</p>
              <p>{{ $t('viewsActivity.paymentMethod') }}</p>
            </div>
            <div class="modal-body-step-container">
              <div class="modal-body-step-content">
                <div class="content-item">
                  <img :src="stepIcon" alt="stepIcon" class="content-item-icon">
                  <p class="content-item-text">{{ $t('viewsActivity.paymentRequestSubmitted') }}</p>
                </div>
                <div class="content-item">
                  <img :src="stepIcon" alt="stepIcon" class="content-item-icon">
                  <p class="content-item-text">
                    {{ $t('viewsActivity.stillNeed') }}{{ formatMoneyToShow(roundAmount - rangeAmount) }}{{
                      $t('viewsActivity.applyForWithdrawal') }}</p>
                </div>
                <div class="content-item">
                  <span class="content-item-icon content-item-unfinish" v-if="!isComplete"></span>
                  <img :src="stepIcon" alt="stepIcon" class="content-item-icon" v-else>
                  <p class="content-item-text">{{ formatMoneyToShow(roundAmount) }}{{ tenantInfo?.merchantCy }} {{
                    $t('viewsActivity.willBeDepositedIntoAccount') }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="modal-btn">
          <Button v-if="isComplete" :suffixLoading="btnLoading" @click="awardReceiveHandle">
            {{ $t('viewsActivity.claimNow') }}</Button>
          <Button v-else @click="inviteFriendsHandle">{{ $t('viewsActivity.inviteFriendsHelp') }}</Button>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import Button from '@/components/first/Button/index.vue';
import { formatMoneyToShow } from '@/utils/custom';
import { IonIcon, IonModal } from '@ionic/vue';
import { close } from 'ionicons/icons';
import stepIcon from '@/assets/svg/ic-success.svg';

const props = defineProps<{
  modelValue: boolean
  closeHandle: () => void
  rangeAmount: number
  roundAmount: number
  tenantInfo: any
  btnLoading: boolean
  awardReceiveHandle: () => void
  inviteFriendsHandle: () => void
}>()

/**
 * 奖励金额
 */
const rangeAmountPrize = computed(() => props.tenantInfo?.currency + ' ' + formatMoneyToShow(props.rangeAmount))

/**
 * 是否完成
 */
const isComplete = computed(() => props.roundAmount === props.rangeAmount)

</script>

<style lang="less" scoped>
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .modal-content {
    width: calc(100% - 3rem);
    margin: 0 1.5rem;
    padding: 1.5rem 1.25rem;
    background: var(--ep-color-background-fill-surface-raised-L2);
    border-radius: var(--ep-border-radius-surface-small);

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--ep-color-text-default);
      font-size: var(--ep-font-size-l);
      font-weight: var(--ep-font-weight-bold);

      .modal-close-icon {
        width: 1.875rem;
        height: 1.875rem;
        color: var(--ep-color-text-weak);
      }
    }

    .modal-body {
      margin: 1.25rem 0;
      padding: 1.25rem;
      border-radius: var(--ep-border-radius-surface-small);
      background: var(--ep-color-background-fill-body-default);

      .modal-body-prize {
        text-align: center;

        .modal-body-prize-text {
          color: var(--ep-color-text-highlight);
          font-size: var(--ep-font-size-l);
          font-weight: var(--ep-font-weight-bold);
          margin-bottom: 0.5rem;
        }

        .modal-body-prize-desc {
          font-size: var(--ep-font-size-s);
          font-weight: var(--ep-font-weight-regular);
          color: var(--ep-color-text-weaker);
        }
      }
    }

    .modal-body-step {
      margin-top: 1.25rem;

      .modal-body-step-text {
        color: var(--ep-color-text-default);
        font-size: var(--ep-font-size-s);
        font-weight: var(--ep-font-weight-medium);

        p:first-child {
          margin-bottom: 0.375rem;
        }
      }

      .modal-body-step-container {
        margin-top: 0.75rem;
        padding: 0.75rem 1.25rem;
        border-radius: var(--ep-border-radius-m);
        background: var(--ep-color-background-fill-surface-raised-L2);

        .modal-body-step-content {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0.375rem;
            width: 0;
            height: calc(100% - 0.75rem);
            border-left: 1px dashed var(--ep-color-text-weakest);
            z-index: 1;
          }

          .content-item {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 2;

            &:first-child {
              align-items: flex-start;
            }

            &:last-child {
              align-items: flex-end;
            }

            &:not(:last-child) {
              margin-bottom: 0.75rem;
            }

            .content-item-icon {
              flex: 0 0 0.75rem;
              width: 0.75rem;
              height: 0.75rem;
              margin-right: 0.5rem;

              &.content-item-unfinish {
                background: var(--ep-color-icon-weaker);
                border-radius: 50%;
              }
            }

            .content-item-text {
              color: var(--ep-color-text-weak);
              font-size: var(--ep-font-size-s);
              font-weight: var(--ep-font-weight-medium);
            }
          }
        }
      }
    }

    .modal-btn {
      margin-top: 1.25rem;
    }
  }
}
</style>
