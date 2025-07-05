<script setup lang="ts">
import { onMounted } from 'vue';
let props = defineProps({
    bgColor:{
        default:'var(--color-btn-gradient-footer)'
    }
})

</script>
<template>
    <div class="footer ">
        <slot></slot>

    </div>

</template>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/comp/default/style/footer/base-index.less";
  @import "@/views/activity/comp/default/style/footer/theme-style.less";

  #activity-comp-default-footer-index.style();

  .blue-default {
    #activity-comp-default-footer-index.style(
      --color-bg-100,
      --color-border,
      --color-btn-gradient-footerUnable,
      --color-text-white-100
    );
  }

  .auroral-yellow {
    #activity-comp-default-footer-index.style(
      @comp-default-footer-index-04: --color-text-black-100,
      @comp-default-footer-index-05: --color-text-black-100
    );
  }

  .forest-green {
    #activity-comp-default-footer-index.style(
      @comp-default-footer-index-04: --color-text-white-40
    );
  }

  .green-default {
    #activity-comp-default-footer-index.style(
      --color-bg-100,
      --color-line,
      --theme-color-gradient-400,
      --color-text-white-40
    );
  }

  .amber-purple {
    #activity-comp-default-footer-index.style(
      --color-bg-100,
      --line-color,
      --gradients-disabled-btn-bg,
      --text-color-white-40
    );
  }

  .footer {
    :slotted(.enable) {
    }
  }

  .new-skin-symbol {
    .footer {
      background-color: var(--ep-color-background-fill-surface-raised-L1);
      box-shadow: 0px 0.5px 0px 0px var(--ep-color-border-default) inset;
    }
  }
</style>
