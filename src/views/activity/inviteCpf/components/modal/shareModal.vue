<template>
  <ion-modal id="shareModal" ref="modal" :initial-breakpoint="1" :is-open="visible" :backdrop-dismiss="false">
    <div class="show-modal-area">

      <!-- 关闭按钮 -->
      <ion-icon class="icon-close" :icon="close" @click="closeShareModal" />
      <p class="title-text title1">1. {{ shareTitle1 || $t('activity.inviteFriendsWithdrawal') }}</p>
      <ion-segment ref="segment" mode="ios" scrollable @mousedown="handleMouseDown" @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
        <ion-segment-button v-for="(item, index) in segmentList" :value="index" :key="item.name" :disabled="disableTab"
          @click="launchHandle(item.name)">
          <ion-icon :src="item.icon" :class="{
            'invite-cpf-share-icon': ['Twitter'].includes(item.type),
            'you-tu-be-icon': item.type == 'YouTube'
          }" class="w-[2.1875rem] h-[2.1875rem]" />
        </ion-segment-button>
      </ion-segment>
      <!-- 分享链接 -->
      <div class="share-url-area">
        <p class="share-url-text">{{ shareUrlUsed }}</p>
        <ion-icon class="copy-icon" :src="getImageUrl('img/common/copy.svg')" @click="copy(shareUrlUsed)" />

      </div>
      <!-- 分享号码列表 -->
      <template v-if="sharePhones.length">
        <p class="title-text title2">
          2. {{ shareTitle2 || $t('activity.sendRandomPlayer') }}
        </p>
        <div class="share-phone-area">
          <ion-row class="share-phone-list">
            <ion-col size="4" :class="[{ used: item?.isUsed }, 'share-phone-item']" v-for="(item, index) in sharePhones"
              :key="item.phone">
              {{ item?.phone }}
            </ion-col>
          </ion-row>
        </div>
        <div class="whatsapp-sms-area">
          <div class="item" @click="whatsappHandle">
            <p class="item-text">{{ $t('activity.sendMessageOn') }}<span class="aggravate"> WhatsAPP</span></p>
            <img class="item-icon" src="/images/activity/call.svg" />
          </div>
          <div class="item" @click="sendSMSHandle">

            <p class="item-text">{{ $t('activity.sendMessageOn') }}<span class="aggravate"> SMS</span></p>
            <img class="item-icon" src="/images/activity/sms.png" />
          </div>
        </div>
      </template>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons'
import { IonModal, IonIcon, IonSegment, IonSegmentButton, IonRow, IonCol } from '@ionic/vue'
import { copy } from '@/hooks/Copy'
import { useShareModalLogic } from '@/views/activity/inviteCpf/hooks/shareModalLogic'
import { getImageUrl } from "@/utils";

const emit = defineEmits(["closeShare"]);
const props = defineProps<{
  shareUrl?: string
  shareTitle1?: string
  shareTitle2?: string
}
>();

const {
  visible,
  segmentList,
  disableTab,
  sharePhones,
  shareUrl,
  closeShareModal,
  launchHandle,
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove,
  whatsappHandle,
  sendSMSHandle
} = useShareModalLogic({ emit });
const shareUrlUsed = computed(() => {
  if (props.shareUrl) {
    return props.shareUrl
  } else {
    return shareUrl
  }
})


</script>

<style scoped lang="less">
:global(ion-modal#shareModal::part(content)) {
  --height: 100%;
  --max-width: 24.375rem;
}

#share-modal-index {

  .style(@bg: --ep-color-background-fill-surface-raised-L2,
    @titleColor: --ep-color-text-weak,
    @closeColor: --ep-color-icon-default,
    @shareBg: --ep-color-background-fill-body-default,
    @shareTextColor: --ep-color-text-weakest,
    @copyIconColor: --ep-color-icon-weaker,
    @availableColor: --ep-color-text-default,
    @aggravateColor: --ep-color-text-default,
  ) {
    .show-modal-area {
      background: var(@bg);
      border-radius: var(--ep-border-radius-surface-small, 0.375rem) var(--ep-border-radius-surface-small, 0.375rem) 0 0;
      width: 100%;
      padding: 1.25rem .9375rem .9375rem .9375rem;
      position: absolute;
      bottom: 0;

      .icon-close {
        position: absolute;
        top: 1.25rem;
        right: .9375rem;
        font-size: var(--ep-font-size-l, 1rem);
        color: var(@closeColor);
      }

      .title-text {
        color: var(@titleColor);
        font-size: var(--ep-font-size-l, 1rem);
        font-weight: var(--ep-font-weight-medium, 600);
        line-height: 24px;
        text-align: left;

      }

      .title1 {
        margin-bottom: 1.25rem;
      }

      ion-segment {
        --background: var(@bg);
        margin-bottom: 1.25rem;
      }

      .share-url-area {
        background: var(@shareBg);
        height: 2.5rem;
        line-height: 2.5rem;
        padding: .5rem .75rem;
        border-radius: var(--ep-border-radius-m, .375rem);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .share-url-text {
          color: var(@shareTextColor);
          font-size: var(--ep-font-size-s, .75rem);
          font-weight: var(--ep-font-weight-bold, 700);
        }

        .copy-icon {
          font-size: var(--ep-font-size-xxl, 1.5rem);
          color: var(@copyIconColor);
        }

      }

      .title2 {
        margin: .75rem auto;
      }

      .share-phone-area {
        background: var(@shareBg);
        padding: 1.25rem;
        border-radius: var(--ep-border-radius-m, .375rem);
        margin-bottom: .75rem;

        .share-phone-item {
          color: var(@availableColor);
          font-size: var(--ep-font-size-s, .75rem);
          font-weight: var(--ep-font-weight-medium, 600);
          text-align: center;
          line-height: 1.25rem;
          padding: .5rem 0;
        }

        .used {
          color: var(@shareTextColor);
        }


      }

      .whatsapp-sms-area {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          width: 10.625rem;
          height: 3.125rem;
          background: var(@shareBg);
          border-radius: var(--ep-border-radius-m, .375rem);
          padding: .5rem .75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: .875rem;
          font-size: var(--ep-font-size-s, .75rem);

          .item-text {
            color: var(@shareTextColor);


            .aggravate {
              color: var(@aggravateColor);
              font-weight: var(--ep-font-weight-bold, 700);
              line-height: 1.25rem;
            }
          }

          .item-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
          }
        }
      }
    }

  }
}

.new-skin-symbol {
  #share-modal-index.style()
}

.green-dark,
.yellow-dark,
.amber-purple {
  #share-modal-index.style(@bg: --color-bg-300,
    @titleColor: --color-text-50,
    @closeColor: --color-text-100,
    @shareBg: --color-bg-200,
    @shareTextColor: --color-text-20,
    @copyIconColor: --color-text-40,
    @availableColor: --color-text-100,
    @aggravateColor: --color-text-100, )
}

.purple-light {
  #share-modal-index.style(@bg: --color-bg-300,
    @titleColor: --color-text-50,
    @closeColor: --color-text-100,
    @shareBg: --color-bg-200,
    @shareTextColor: --color-text-40,
    @copyIconColor: --color-text-40,
    @availableColor: --color-text-100,
    @aggravateColor: --color-text-100, )
}

.green-default,
.blue-default,
.forest-green,
.auroral-yellow {
  #share-modal-index.style(@bg: --color-bg-300,
    @titleColor: --color-text-80,
    @closeColor: --color-text-100,
    @shareBg: --color-bg-200,
    @shareTextColor: --color-text-40,
    @copyIconColor: --color-text-40,
    @availableColor: --color-text-100,
    @aggravateColor: --color-text-100, )
}
</style>
