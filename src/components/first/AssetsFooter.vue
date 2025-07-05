<script setup lang="ts">
import Button from './Button/index.vue'
import { getTheme } from '@/theme/hooks'
import VButton from '@/components/second/Button/index.vue';
const { skin } = getTheme()

const emit = defineEmits<{

  (e: 'submitForm', event: CustomEvent): void
}>()
let props = withDefaults(defineProps<{
  amount?: string | number,
  merchantCy?: string
  disabled?: boolean
  suffixLoading?: boolean
  btnText: string
  isHasBottomTab?: boolean
  textContent?: string
  isFixedBottom?: boolean

}>(), {
  disabled: false,
  isHasBottomTab: true,
  isFixedBottom: true
});
const handleBtnClick = (event: CustomEvent) => {
  emit("submitForm", event)
}
const elementStore = useElementStore()
const tabBarHeight = computed(() => elementStore.tabBarHeight || 85)
const BTN_MARGIN_BOTTOM = 24
const bottomValue = computed(() => BTN_MARGIN_BOTTOM + tabBarHeight.value + 'px')
const BTN_HEIGHT = '2.875rem'
const calcHei = computed(() => `calc(env(safe-area-inset-bottom) + ${tabBarHeight.value + BTN_MARGIN_BOTTOM}px + ${BTN_HEIGHT})`)

</script>
<template>



  <div :class="[isFixedBottom ? 'fixedBottom-footer' : 'footer-assets']">
    <div class="btn-warp">
      <VButton mode="md" class="flex-1 text-white" shape="round" :disabled="disabled" v-if="skin === 'second'"
        @click="handleBtnClick">
        <button class="w-full h-full">{{ btnText }}</button>
      </VButton>


      <Button :height="BTN_HEIGHT" @click="handleBtnClick" :disabled="disabled" v-else>{{ btnText }}</Button>
    </div>

  </div>
</template>

<style scoped lang="less">
.fixedBottom-footer {
  width: 24.25rem;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: v-bind('calcHei');
  background: linear-gradient(180deg, rgba(26, 29, 34, 0.00) 0%, var(--color-bg-300) 74.74%);

  .btn-warp {
    width: 22.875rem;
    position: absolute;
    bottom: v-bind('bottomValue');
    left: 50%;
    transform: translateX(-50%);
    opacity: 1;
  }
}

.footer-assets {
  //  height: 50px;
  margin: 0 auto;
  width: 22.8125rem;
  height: 3.125rem;
  line-height: 3.125rem;

  .btn-warp {
    width: 100%;
    height: 100%;
    line-height: inherit;
  }
}



.purple-light {
  .fixedBottom-footer {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 32.52%, var(--color-bg-500) 100%);
  }

}

.amber-purple {
  .fixedBottom-footer {
    background: linear-gradient(207deg, rgba(38, 35, 70, 0.59) 26.98%, rgba(22, 19, 40, 0.59) 82.97%);

    .btn-warp {
      background-color: var(--color-bg-500);
      border-radius: var(--layout-radius-basic);
    }
  }

}

#withdraw-main-assetsFooter-new-index {
  .style() {
    .fixedBottom-footer {
      width: 24.25rem;
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      height: v-bind('calcHei');
      background: linear-gradient(180deg, rgba(26, 29, 34, 0.00) 0%, var(--ep-color-background-fill-body-default) 74.74%);

      .btn-warp {
        width: 22.875rem;
        position: absolute;
        bottom: v-bind('bottomValue');
        left: 50%;
        transform: translateX(-50%);
        opacity: 1;
      }
    }

    .footer-assets {
      //  height: 50px;
      margin: 0 auto;
      width: 22.8125rem;
      height: 3.125rem;
      line-height: 3.125rem;

      .btn-warp {
        width: 100%;
        height: 100%;
        line-height: inherit;
      }
    }

  }
}

.new-skin-symbol {
  #withdraw-main-assetsFooter-new-index.style();
}
</style>
