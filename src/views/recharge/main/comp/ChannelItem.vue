<script setup lang="ts">
import Image from '@/components/Image.vue'
import { IonSpinner } from '@ionic/vue'
import { getTheme } from '@/theme/hooks'
const { theme } = getTheme()
defineProps<{
  name?: string,
  logo?: string,
  loading?: boolean
}
>()
const attrs = useAttrs()


</script>
<template>
  <div :class="['item-wrap', 'flex-between', theme]" v-bind="attrs">
    <template v-if="!loading">
      <div class="name flex-between">
        <div v-if="logo" class="img-area">
          <Image :src="logo" />
        </div>
        <p>{{ name }}</p>
      </div>
      <slot name="suffix">

      </slot>


    </template>



    <div class="spinner-wrap">
      <ion-spinner class="spinner" name="bubbles" v-if="loading" />
    </div>
  </div>


</template>

<style scoped lang="less">
.item-wrap {
  width: 7.0625rem;
  height: 3.25rem;
  padding: 0 .1875rem;
  height: 3.25rem;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  border-radius: .375rem;

  .bg-400();


  .name {

    .img-area {
      width: 1.5625rem;
      height: 1.5625rem;
      height: 100%;
      .dynamic-font(@fontSize: --font-size-12, @fontWeight: --font-weight-medium);
    }

    p {
      width: 4.0625rem;
      margin-left: .1875rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .dynamic-font(@fontSize: --font-size-12);
    }


  }

  .spinner-wrap {
    text-align: center;

    .spinner {
      margin: 0.8rem 2.5rem;
      --color: var(--color-primary-800)
    }

  }

}

.item-wrap.purple-light {
  .name {

    .img-area {

      .dynamic-font(@fontSize: --font-size-12, @fontWeight: --font-weight-medium);
    }

    p {

      .dynamic-font(@fontSize: --font-size-12, @color: --color-text-100);
    }


  }


}

.item-wrap.amber-purple {

  .name p {

    color: var(--text-color-light-purple-1-100)
  }

}

#recharge-main-comp-channelItem-index {
  .style() {
    .item-wrap {
      width: 7.0625rem;
      height: 3.25rem;
      padding: 0 .1875rem;
      height: 3.25rem;
      box-sizing: border-box;
      border: 1px solid var(--ep-color-border-default);
      border-radius: .375rem;

      background: var(--ep-color-background-fill-surface-lowered);


      .name {

        .img-area {
          width: 1.5625rem;
          height: 1.5625rem;
          height: 100%;
          font-size: var(--ep-font-size-m, 0.875rem);
          font-weight: var(--ep-font-weight-medium, 500);
       
        }

        p {
          width: 4.0625rem;
          margin-left: .1875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: var(--ep-font-size-m, 0.875rem);
          font-weight: var(--ep-font-weight-medium, 500);
          color: var(--ep-color-text-highlight-white);
        }


      }

      .spinner-wrap {
        text-align: center;

        .spinner {
          margin: 0.8rem 2.5rem;
          --color: var(--ep-color-icon-brand-primary)
        }

      }

    }
  }
}

.new-skin-symbol {
  #recharge-main-comp-channelItem-index.style();
}
</style>
