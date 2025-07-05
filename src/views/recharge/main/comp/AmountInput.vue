<script setup lang="ts">

import { getTheme } from '@/theme/hooks'
const { theme } = getTheme()
</script>
<template>

  <div class="amount-input-wrap flex-between" :class="theme">
  
    <div class="text-area input-area">
      <div class="flex-between label-area">
        <p class="title">{{ $t('viewsAssets.amount') }}</p>
      </div>
      <div class="input-comp">
        <slot name="amount"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.amount-input-wrap {
  width: 100%;
  padding: 0 .75rem;
  box-sizing: border-box;
  margin: .5rem 0 .75rem;
  align-items: flex-end;

  .input-area {
    width: 100%;
    .input-comp{
       background: var(--color-bg-400);
    }
  

  }

  .text-area {
    margin-bottom: 6px;

    .title {
      .dynamic-font(@fontWeight: --font-weight-bold);
      line-height: 1.125rem;
      margin-right: .1875rem;
      margin: .375rem 0;
    }

    // .description {
    //   line-height: 1.125rem;
    //   .dynamic-font(@color: --color-text-80, @fontSize: --font-size-10);
    // }

  }

}

.amount-input-wrap.amber-purple {


  .text-area .title {
    color: var(--text-color-light-purple-1-100)
  }

  .left-area .title {
    max-width: 7.0625rem;
    white-space: nowrap;
    /* 防止换行 */
  }

}


#amount-input-comp-new-index {
  .style() {

    .amount-input-wrap {
      width: 100%;
      padding: 0 .75rem;
      box-sizing: border-box;
      margin: .5rem 0 .75rem;
      align-items: flex-end;
      .input-area {
        .right-area {
          width: 15rem;
          background: var(--ep-color-background-fill-surface-lowered);
        }
        .input-comp{
          background: var(--ep-color-background-fill-surface-lowered);
        }
      }

      .text-area {
        margin-bottom: 6px;
        .title {
          font-size: var(--ep-font-size-s, 0.75rem);
          font-weight: var(--ep-font-weight-bold, 700);
          color:var(--ep-color-text-default);
          line-height: 1.125rem;
          margin-right: .1875rem;
          margin: .375rem 0;
        }
   
      }

    }

  }
}

.new-skin-symbol {
  #amount-input-comp-new-index.style();
}
</style>
