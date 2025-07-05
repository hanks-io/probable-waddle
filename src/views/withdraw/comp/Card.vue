<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue'
import { CardInfo } from '../type'
import { getTheme } from '@/theme/hooks'
import { getImageUrl } from '@/utils/url';

type CardType = 'empty' | 'append' | 'info'

const router = useRouter()
const { theme, newSkin } = getTheme()
const emit = defineEmits<{
  (e: 'handleDelete', relatedCode: string): void
  (e: 'handleExpand'): void
  (e: 'addCallback'): void
}>()
const attr = useAttrs()
let props = withDefaults(defineProps<{
  type?: CardType
  cardInfo?: CardInfo
  isShowAction?: boolean
}
>(), {
  isShowAction: false,
  type: 'info',

});
const handleDelete = () => {
  emit('handleDelete', props?.cardInfo?.relatedCode!)
}
const handleExpand = () => {
  emit('handleExpand')
}
const slotDefault = !!useSlots().default
const gotoBind = () => {
  router.push("/withdrawalBindAccount")
  emit('addCallback')
}

const themeMap = {
  'green-dark': '',
  'yellow-dark': '',
  'auroral-yellow': '',
  'forest-green': '-green-default'
} as const

const getEmptyImgPath = computed(() => {
  if(newSkin){
    return getImageUrl('img/empty-account.png')
  }
  return  `/first/images/empty${themeMap[theme as keyof typeof themeMap] ?? `-${theme}`}.png`  
})
const classNames = computed(() => {
  switch (props.type) {
    case 'empty':
      return 'flex-center'
    case 'info':
      return 'card-info-wrap'
    case 'append':
      return 'card-app'
    default:
      return ''
  }
})
</script>
<template>
  <div class="card-wrap" :class="[classNames]">
    <div v-if="type === 'empty'" class="empty-area flex-between" @click="gotoBind">
      <ion-icon slot="icon-only" class="append" :src="getImageUrl('svg/append.svg')" />
      <span class="text">{{ $t('viewsAssets.addAccount') }}</span>
    </div>
    <div v-else-if="type === 'append'" class="append-area flex-between">
      <ion-img class="empty" :src="getEmptyImgPath" />
      <div class="right-text">
        <p>{{ $t('viewsAssets.appendTip') }}</p>
        <div class="append-text flex-center" @click="gotoBind"><ion-icon slot="icon-only"
            :class="['append']" src="/first/svg/assets/append.svg" />
          <span class="text">{{ $t('viewsAssets.addAccount') }}</span>
        </div>
      </div>
    </div>
    <div v-else class="info-area flex-between">
      <div class="info-left flex-start">
        <!-- <div class="img-area"> <ion-img class="img" :src="cardInfo?.icon" /></div> -->
        <div class="card-info">
          <p class="card-name">{{ cardInfo?.name }}</p>
          <div class="card-sub">
            <p v-if="cardInfo?.REALNAME" class="real-name">{{ cardInfo.REALNAME }}</p>
            <p>{{ cardInfo?.IFSC }}</p>
            <p class="bank-account">{{ cardInfo?.BANKACCOUNT }}</p>
          </div>

        </div>
      </div>
      <slot>
        <ion-icon slot="icon-only" class="arrow" src="/first/svg/assets/arrow.svg" @click="handleExpand" />
      </slot>
      <div class="action flex-end" v-if="isShowAction">
        <slot name="action"> </slot>
        <!-- <div class="delete-area flex-between" @click="handleDelete"> <ion-icon slot="icon-only" class="delete"
            src="/first/svg/assets/delete.svg" /> {{
              $t('viewsAssets.delete') }}</div> -->
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.real-name {
  width: 15rem;
  padding-right: .75rem;
  overflow-x: scroll;
  white-space: nowrap;
}

.real-name::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}

.card-info-wrap {
  padding: .75rem .75rem .75rem .9375rem;
  position: relative;
}

.card-app {
  background-color: transparent !important;
}

#withdraw-main-bindBankCard-index {
  .style(@emptyColor: --color-text-40, @appendColor: --color-text-80, @appendBtnColor: --color-success, @infoCardNameColor: --color-text-80, @iconArrowColor: --color-text-40, @actionColor: --color-text-80) {
    .card-wrap {
      width: 22.875rem;
      min-height: 7.25rem;
      margin: 0 auto;
      box-sizing: border-box;
      .bg-200();
      .rounded-middle();
      border: 1px solid var(--color-line);

      .empty-area {
        cursor: pointer;
        color: var(--emptyColor);

        .append {
          font-size: var(--font-size-14);
        }

        .text {
          .dynamic-font(@color: @emptyColor, @fontWeight: --font-weight-bold);
          margin-left: .1875rem;
        }
      }

      .append-area {
        cursor: pointer;

        .empty {
          width: 5.5rem;
          height: 4rem;
          margin-top: .875rem;
          margin-left: 1.3125rem;
        }

        .right-text {
          width: 13.75rem;
          margin-right: .5rem;

          p {
            .dynamic-font(@color: @appendColor, @fontSize: --font-size-14);
            line-height: 1.3125rem;
            margin-top: .375rem;
          }

          .append-text {
            float: right;
           
            height: 1.5625rem;
            line-height: 1.5625rem;
            box-sizing: border-box;
            margin-top: .1875rem;
            padding: .25rem .4375rem .25rem .5rem;
            .rounded-small();
            .bg-100();
            .dynamic-font(@color: @appendBtnColor, @fontWeight: --font-weight-bold);

            .append {
              margin-right: .375rem;
              font-size: var(--font-size-14);
              
            }

           
          }
        }
      }

      .info-area {
        .info-left {
          align-items: flex-start;

          .img-area {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            overflow: hidden;
          }

          .card-info {
            margin-left: 13px;
            height: 4.125rem;
            box-sizing: border-box;
            padding-top: .1875rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .card-name {
              .dynamic-font(@color: @infoCardNameColor, @fontSize: --font-size-14, @fontWeight: --font-weight-medium);
            }

            .card-sub {
              .dynamic-font(@color: --color-success);
            }

            .bank-account {
              width: 15rem;
            }
          }
        }

        ion-icon.arrow {
          cursor: pointer;
          .dynamic-font(@color: @iconArrowColor, @fontSize: --font-size-14);
          transform: rotate(-90deg);
        }

      }

      .action {
        position: absolute;
        width: 7.5rem;
        height: .875rem;
        right: 1rem;
        bottom: .75rem;
        .dynamic-font(@color: @actionColor);

        .delete-area {
          cursor: pointer;

          ion-icon.delete {
            .dynamic-font(@color: --color-text-40, @fontSize: --font-size-14);
          }
        }

      }
    }

  }



}

#withdraw-main-bindBankCard-index.style();


.green-default, .forest-green {
  #withdraw-main-bindBankCard-index.style(@appendColor: --color-text-gray-200, @appendBtnColor: --accent-color-yellow, @infoCardNameColor: --color-text-gray-100, @iconArrowColor: --color-text-40, @actionColor: --color-text-gray-100);
}
.auroral-yellow{
  #withdraw-main-bindBankCard-index.style(@infoCardNameColor: --color-text-gray-100);
}

.amber-purple {
  #withdraw-main-bindBankCard-index.style(@emptyColor: --text-color-light-purple-2-100, @appendColor: --color-text-100,  @appendBtnColor: --text-color-white-100, @infoCardNameColor: --text-color-light-purple-1-100, @iconArrowColor: --text-color-light-purple-1-100);
  
   .append-area {
    .right-text {
      .append-text {
        .text {
          background: var(--Gradients-orange-purple);
          background-clip: text;
          color: transparent;
        }
      }
    }
  }
}
#withdraw-main-bindBankCard-new-index {
  .style() {
    .card-wrap {
      width: 22.875rem;
      min-height: 7.25rem;
      margin: 0 auto;
      box-sizing: border-box;
      background: var(--ep-color-background-fill-surface-raised-L1);
      border-radius: var(--ep-border-radius-m, .375rem);
      border: 1px solid var(--ep-color-border-default);

      .empty-area {
        cursor: pointer;

        .append {
          font-size: var(--ep-font-size-m, .875rem);
          color: var(--ep-color-icon-default);
        }

        .text {
          margin-left: .1875rem;
          font-weight: var(--ep-font-weight-bold, 700);
          font-size: var(--ep-font-size-s, .75rem);
          color: var(--ep-color-text-default);
        }
      }

      .append-area {
        cursor: pointer;

        .empty {
          width: 5.5rem;
          height: 4rem;
          margin-top: .875rem;
          margin-left: 1.3125rem;
        }

        .right-text {
          width: 13.75rem;
          margin-right: .5rem;

          p {
            font-size: var(--ep-font-size-m, .875rem);
            color: var(--ep-color-text-default);
            line-height: 1.3125rem;
            margin-top: .375rem;
          }

          .append-text {
            float: right;
            height: 1.5625rem;
            line-height: 1.5625rem;
            box-sizing: border-box;
            margin-top: .1875rem;
            padding: .25rem .4375rem .25rem .5rem;
            border-radius: var(--ep-border-radius-s, .25rem);
            background: var(--ep-color-background-fill-surface-raised-L2);
            font-weight: var(--ep-font-weight-bold, 700);
            font-size: var(--ep-font-size-s, .75rem);
            color: var(--ep-color-text-success);

            .append {
              margin-right: .375rem;
              font-size: var(--ep-font-size-m, .875rem);
              color: var(--ep-color-icon-success);
              
            }

           
          }
        }
      }

      .info-area {
        .info-left {
          align-items: flex-start;

          .img-area {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            overflow: hidden;
          }

          .card-info {
            margin-left: 13px;
            height: 4.125rem;
            box-sizing: border-box;
            padding-top: .1875rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .card-name {
              color: var(--ep-color-text-default);
              font-size: .875rem;
              font-weight: 500;
            }

            .card-sub {
              color: var(--ep-color-text-success);
              font-size: 12px;
              font-weight: 400;
            }

            .bank-account {
              width: 15rem;
            }
          }
        }

        ion-icon.arrow {
          cursor: pointer;
       
          font-size: .875rem;
          color: var(--ep-color-icon-weaker);
          transform: rotate(-90deg);
        }

      }

      .action {
        position: absolute;
        width: 7.5rem;
        height: .875rem;
        right: 1rem;
        bottom: .75rem;
        color: var(--ep-color-icon-weaker);
      }
    }

  }



}
.new-skin-symbol {
  #withdraw-main-bindBankCard-new-index.style();
}


</style>
