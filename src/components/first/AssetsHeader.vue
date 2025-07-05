<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import useNavigaterBack from '@/hooks/useNavigaterBack'



const router = useRouter()

const emit = defineEmits<{

  (e: 'tabChange', i: number): void,
  (e: 'recordHandle'): void,
}>()
withDefaults(defineProps<{
  contentText: string
  isShowCloseicon?: boolean
  isAlone?: boolean
}
>(), {
  isShowCloseicon: false,
  isAlone: false
});
const gotoClient = () => {
  ///notification
  router.push('/notification')
}

const closePage = () => {
  useNavigaterBack()
}
const recordHandle = () => {
  emit("recordHandle")
}


</script>
<template>

  <div :class="['header-wrap', { alone: isAlone }]">
    <div class="top flex-start"> <span>{{ contentText }}</span>
      <div class="icon-area flex-center"><ion-icon slot="icon-only" class="record" @click="recordHandle"
          src="/first/svg/assets/record.svg" /></div>
    </div> <ion-icon slot="icon-only" class="close" src="/first/svg/login/close.svg" v-if="isShowCloseicon"
      @click="closePage" />
    <p class="text">{{ $t('viewsAssets.contactUs') }} <span class="client" @click="gotoClient">
        <ion-icon slot="icon-only" src="/first/svg/perfil/customer.svg" />
        {{ $t('viewsAssets.suporteOnline') }}</span>
    </p>


  </div>

</template>

<style scoped lang="less">
#assets-header-component {
  .style(@bg: --ep-color-background-fill-surface-raised-L1,
    @recordIconBg: --ep-color-text-brand-primary,
    @titleColor: --ep-color-text-default,
    @recordIconColor: --ep-color-icon-inverse,
    @closeIconColor: --ep-color-icon-default,
    @textColor: --ep-color-text-default,
    @clientTextColor: --ep-color-text-highlight,
    @clientIconColor: --ep-color-icon-highlight,


  ) {
    .header-wrap {
      width: 24.375rem;
      background: var(@bg);
      padding: .625rem .75rem 0;
      box-sizing: border-box;
      position: relative;

      .top {
        line-height: 1.875rem;

        span {
          font-size: var(--ep-font-size-xl, 1.25rem);
          font-weight: var(--ep-font-weight-medium, 500);
          color: var(@titleColor);
        }

        .icon-area {
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          background: var(@recordIconBg);
          margin-left: .625rem;

          ion-icon.record {
            font-size: var(--ep-font-size-l, 1);
            color: var(@recordIconColor);

          }
        }

      }

      ion-icon.close {
        font-size: var(--ep-font-size-xl, 1.25rem);
        color: var(@closeIconColor);
        position: absolute;
        top: 1rem;
        right: 1rem;
      }

      .text {
        width: 18.75rem;
        font-size: var(--ep-font-size-s, 0.75rem);
        font-weight: var(--ep-font-weight-regular, 400);
        color: var(@textColor);
        padding: 1.25rem 0;
        line-height: 1.125rem;

        .client {
          font-size: var(--ep-font-size-s, 0.75rem);
          font-weight: var(--ep-font-weight-bold, 700);
          color: var(@clientTextColor);
          white-space: nowrap;
          cursor: pointer;

          ion-icon {
            font-size: var(--ep-font-size-xl, 1.25rem);
            vertical-align: top;
            color: var(@clientIconColor);
          }
        }
      }

    }

    .header-wrap.alone {
      border-radius: 0px 0px var(--ep-border-radius-surface-small, .75rem) var(--ep-border-radius-surface-small, .75rem);
      box-shadow: 0px 4px 28.4px 0px rgba(0, 0, 0, 0.10);
    }
  }
}



.yellow-dark,
.green-dark {
  #assets-header-component.style(@bg: --color-bg-200,
    @recordIconBg: --theme-color-800,
    @titleColor: --color-text-100,
    @recordIconColor: --text-color-black-100,
    @closeIconColor: --color-text-100,
    @textColor: --color-text-40,
    @clientTextColor: --accent-color-orange,
    @clientIconColor: --accent-color-orange,
  )
}

.purple-light {
  #assets-header-component.style(@bg: --color-bg-500,
    @recordIconBg: --theme-color-800,
    @titleColor: --text-color-black-100,
    @recordIconColor: --text-color-white-100,
    @closeIconColor: --color-text-100,
    @textColor: --text-color-black-80,
    @clientTextColor: --accent-color-orange,
    @clientIconColor: --accent-color-orange,
  )
}

.amber-purple {
  #assets-header-component.style(@bg: --color-bg-100,
    @recordIconBg: --theme-color-800,
    @titleColor: --text-color-light-purple-1-100,
    @recordIconColor: --text-color-white-100,
    @closeIconColor: --text-color-white-100,
    @textColor: --text-color-light-purple-2-100,
    @clientTextColor: --color-currency,
    @clientIconColor: --color-currency,
  )
}

.new-skin-symbol {
  #assets-header-component.style();
}
</style>
