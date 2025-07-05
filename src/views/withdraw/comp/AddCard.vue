<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue'
import { getImageUrl } from '@/utils/url';
import { getTheme } from '@/theme/hooks'
const { theme} = getTheme()
const router = useRouter()


const gotoBind = () => {
  router.push("/withdrawalBindAccount")
  
}

const getAddSVGPath = computed(() => {
   if(theme === 'amber-purple'){
     return getImageUrl('svg/amberPurpleAppend.svg')
   }
   return getImageUrl('svg/append.svg')
})




</script>
<template>
  <div class="card-wrap">

    <div class="append-area flex-between">
      <ion-img class="empty" :src="getImageUrl('img/empty-account.png')" />
      <div class="right-text">
        <p>{{ $t('viewsAssets.appendTip') }}</p>
        <div class="append-text flex-center" @click="gotoBind"><ion-icon slot="icon-only" :class="['append']"
            :src="getAddSVGPath" />
          <span class="text">{{ $t('viewsAssets.addAccount') }}</span>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped lang="less">
#withdraw-main-bindBankCard-new-index {

  .style(@bg: --ep-color-background-fill-surface-raised-L1,
    @cardBorder: --ep-color-border-default,
    @appendColor: --ep-color-text-default,
    @appendBtnColor: --ep-color-text-success,
    @appendBtnBg: --ep-color-background-fill-surface-raised-L2,
    @appendIconColor: --ep-color-icon-success) {
    .card-wrap {
      width: 22.875rem;
      min-height: 7.25rem;
      margin: 0 auto;
      box-sizing: border-box;
      background: var(@bg);
      border-radius: var(--ep-border-radius-m, .375rem);
      border: 1px solid var(@cardBorder);

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
            color: var(@appendColor);
            line-height: 1.3125rem;
            margin-top: .375rem;
          }

          .append-text {
            float: right;
            height: 1.625rem;
            line-height: 1.5625rem;
            box-sizing: border-box;
            margin-top: .1875rem;
            padding: .25rem .4375rem .25rem .5rem;
            border-radius: var(--ep-border-radius-s, .25rem);
            background: var(@appendBtnBg);
            font-weight: var(--ep-font-weight-bold, 700);
            font-size: var(--ep-font-size-s, .75rem);
            color: var(@appendBtnColor);

            .append {
              margin-right: .375rem;
              font-size: var(--ep-font-size-m, .875rem);
              color: var(@appendIconColor);

            }


          }
        }
      }


    }

  }



}

.new-skin-symbol {
  #withdraw-main-bindBankCard-new-index.style();
}

.amber-purple {
  #withdraw-main-bindBankCard-new-index.style(@cardBorder: --color-line, @appendColor: --color-text-100, @appendBtnColor: --text-color-white-100, @appendIconColor: --Gradients-orange-purple, @appendBtnBg: --color-bg-100);

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

.purple-light,
.green-dark,
.yellow-dark {
  #withdraw-main-bindBankCard-new-index.style(@bg: --color-bg-200,
    @cardBorder: --color-line,
    @appendColor: --color-text-100,
    @appendBtnColor: --color-success,
    @appendIconColor: --color-success,
    @appendBtnBg: --color-bg-100);
}

.auroral-yellow  {
  #withdraw-main-bindBankCard-new-index.style(@bg: --color-bg-200,
    @cardBorder: --color-line,
    @appendColor: --color-text-100,
    @appendBtnColor: --theme-color-800-2,
    @appendIconColor: --theme-color-800-2,
    @appendBtnBg: --color-bg-100);
}

 .green-default  {
  #withdraw-main-bindBankCard-new-index.style(@bg: --color-bg-200,
    @cardBorder: --color-line,
    @appendColor: --color-text-100,
    @appendBtnColor: --accent-color-yellow,
    @appendIconColor: --accent-color-yellow,
    @appendBtnBg: --color-bg-100);
}

.forest-green, .blue-default{
  #withdraw-main-bindBankCard-new-index.style(@bg: --color-bg-200,
    @cardBorder: --color-line,
    @appendColor: --color-text-100,
    @appendBtnColor: --color-success,
    @appendIconColor: --color-success,
    @appendBtnBg: --color-bg-100);
}
</style>
