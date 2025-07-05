<template>
  <ion-modal id="demo-modal" :is-open="modelValue" :backdrop-dismiss="false" @didDismiss="onDismiss">
    <div class="modal-container">
      <div class="modal-content">
        <ion-icon :icon="close" class="modal-close-icon" @click="onDismiss" />
        <!-- Title -->
        <p class="modal-title">
          <span class="modal-title-index">1.</span>
          {{ firstTitle }}
        </p>
        <!-- 分享平台列表 -->
        <div class="platform">
          <div class="platform-list" ref="platformListRef">
            <ion-icon v-for="platform in sharePlatformList" :key="platform.name" :src="platform.icon"
              class="platform-icon" @click="launchHandle(platform.name)" />
          </div>
        </div>
        <!-- 分享链接 -->
        <div class="share-link">
          <p class="share-link-url">{{ shareUrl }}</p>
          <ion-icon src="/first/svg/copy.svg" class="share-link-copy" @click="copy(shareUrl)" />
        </div>

        <!-- 号码区域 -->
        <div class="phone-area" v-if="sharePhones.length">
          <p class="modal-title">
            <span class="modal-title-index">2.</span>
            {{ secondTitle }}
          </p>

          <div class="phone-container">
            <div class="phone-list">
              <div :class="[{ 'phone-used': item.isUsed }, 'phone-item']" v-for="(item, index) in sharePhones"
                :key="index">
                {{ item.phone }}
              </div>
            </div>
          </div>

          <!-- 发送按钮 -->
          <div class="send-container">
            <div class="send-button" @click="whatsappHandle">
              <div class="send-button-text">
                WhatsAPP
              </div>
              <div class="send-button-icon">
                <img :src="whatsappIcon" alt="WhatsAPP" />
              </div>
            </div>
            <div class="send-button" @click="sendSMSHandle">
              <div class="send-button-text">
                SMS
              </div>
              <div class="send-button-icon">
                <img :src="smsIcon" alt="SMS" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ion-modal>
</template>


<script setup lang="ts">
import { IonModal, IonIcon } from '@ionic/vue'
import { close } from 'ionicons/icons'
import { copy } from '@/hooks/Copy'
import { useShareModal } from './useShareModal'
import whatsappIcon from '@/assets/img/activity/call.svg'
import smsIcon from '@/assets/img/activity/sms.png'
import useScrollable from './useScrollable'

const platformListRef = useTemplateRef<HTMLElement>('platformListRef')

type PhoneType = {
  phone: string
  isUsed: boolean
  [key: string]: any
}

const props = withDefaults(defineProps<{
  modelValue: boolean // 是否显示弹窗
  firstTitle?: string // 分享平台列表标题
  secondTitle?: string // 分享号码列表标题
  shareUrl: string // 分享链接
  sharePhones: PhoneType[] // 分享号码列表
  launchHandle: (item: any) => void // 分享平台列表
  whatsappHandle: () => void // whatsapp分享
  sendSMSHandle: () => void // 发送短信
}>(), {
  modelValue: false,
  firstTitle: 'Title1',
  secondTitle: 'Title2',
  shareUrl: '',
  sharePhones: () => [],
  launchHandle: () => { },
  whatsappHandle: () => { },
  sendSMSHandle: () => { }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

/**
 * 关闭弹窗
 */
const onDismiss = () => {
  emit('update:modelValue', false)
}

const { sharePlatformList } = useShareModal()



useScrollable(platformListRef as Ref<HTMLElement>)

</script>

<style scoped lang="less">
.modal-wrapper,
.modal-shadow {
  --max-height: 100%;
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
    .modal-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;

      .modal-content {
        position: relative;
        padding: 1.5rem 1rem 1rem 1rem;
        border-radius: var(--ep-border-radius-surface-small, 0.75rem) var(--ep-border-radius-surface-small, 0.75rem) 0 0;
        background: var(@bg);
        backdrop-filter: blur(0.25rem);

        .modal-close-icon {
          position: absolute;
          top: 0.625rem;
          right: 1rem;
          font-size: 1.25rem;
          color: var(@closeColor);
        }

        .modal-title {
          display: flex;
          align-items: flex-start;
          color: var(@titleColor);
          font-size: var(--ep-font-size-l, 1rem);
          font-weight: var(--ep-font-weight-medium, 600);
          line-height: 1.5;

          .modal-title-index {
            display: inline-block;
            flex: 0 0 0.75rem;
            margin-right: 0.25rem;
          }
        }
      }

      .platform {
        margin: 1.25rem 0;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
          display: none;
        }

        .platform-list {
          white-space: nowrap;
          font-size: 0;

          .platform-icon {
            display: inline-block;
            width: 2.5rem;
            height: 2.5rem;

            &:not(:last-child) {
              margin-right: 1.25rem;
            }
          }
        }
      }

      .share-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: var(--ep-border-radius-m, 0.375rem);
        background: var(@shareBg);
        padding: 0.5rem 0.75rem;

        .share-link-url {
          flex: 1;
          color: var(@shareTextColor);
          font-size: var(--ep-font-size-s, 0.75rem);
          font-weight: var(--ep-font-weight-bold, 700);
          line-height: 1.5;
        }

        .share-link-copy {
          width: 1.5rem;
          height: 1.5rem;
          opacity: 0.6;
          color: var(--ep-color-text-weak, var(--color-primary-800));
        }
      }

      .phone-area {
        .modal-title {
          margin: 0.75rem 0;
        }

        .phone-container {
          border-radius: var(--ep-border-radius-m, 0.375rem);
          background: var(@shareBg);
          padding: 1.25rem;


          .phone-list {
            display: flex;
            flex-wrap: wrap;
            max-height: 8rem;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;

            &::-webkit-scrollbar {
              display: none;
            }
          }

          .phone-item {
            width: calc(100% / 3);
            font-size: var(--ep-font-size-s, 0.75rem);
            font-weight: var(--ep-font-weight-medium, 500);
            margin-bottom: 0.75rem;
            color: var(@availableColor);

            &.phone-used {
              color: var(@aggravateColor);
            }

            &:nth-child(3n - 1) {
              text-align: center;
            }

            &:nth-child(3n) {
              text-align: right;
            }
          }
        }

        .send-container {
          display: flex;
          margin-top: 0.75rem;
          margin-bottom: 1.25rem;
          gap: 1.25rem;

          .send-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
            border-radius: var(--ep-border-radius-m, 0.375rem);
            background: var(@shareBg);
            padding: 0.375rem 0.5rem;
            color: var(@availableColor);
            font-size: var(--ep-font-size-s, 0.75rem);
            font-weight: var(--ep-font-weight-medium, 600);
            gap: 0.5rem;

            .send-button-icon {
              width: 2.5rem;
              height: 2.5rem;
              font-size: 0;

              img {
                width: 100%;
                height: 100%;
              }
            }
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
