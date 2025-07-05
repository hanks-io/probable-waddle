<script setup lang="ts">
import { AssetsTabInfo } from '@/views/withdraw/type'
import { number } from 'zod';
const emit = defineEmits<{
  (e: 'tabChange', tabId: number): void
  (e: 'update:tabId', tabId: number): void
}>()
defineProps<{
  tabList: AssetsTabInfo[]
  className?: string
}
>()
const tabId = defineModel<number | undefined>('tabId', { required: true })
const tabChange = (activeId: number) => {
  if (activeId === tabId.value) return
  emit('tabChange', activeId)
  emit('update:tabId', activeId)
}
</script>
<template>
  <ul class="tab-list flex-between" :class="className">
    <li class="item" v-for="it in tabList" :key="it.id" :class="{ active: tabId === it.id }"
      @click="() => tabChange(it.id)">
      <div class="tag" v-if="it.tagValue">
        <i>{{ it.tagValue
          }}</i>
      </div>
      {{ it.name }}
    </li>
    <li></li>
  </ul>

</template>

<style scoped lang="less">
#recharge-main-default-subTabDefault-index {

  .style(@color: --color-text-gray-200, @activeBg: --theme-color-gradient-100, @activeColor: --color-text-white-100) {

    .tab-list {
      width: 22.5rem;
      flex-wrap: wrap;

      li {
        width: 6.875rem;
      }

      .item {
        height: 2.5rem;
        background: var(--color-bg-200);
        text-align: center;
        line-height: 2.5rem;
        color: var(@color);
        margin-top: .9375rem;
        border-radius: var(--rounded-middle);
        position: relative;

        .tag {
          position: absolute;
          font-size: var(--font-size-8);
          top: -0.375rem;
          right: 0;
          color: var(--text-color-white-100);
          background: var(--color-danger);
          padding: 0 3px;
          border-radius: var(--rounded-small);
          height: .9375rem;
          line-height: .9375rem;
        }
      }

      .active {
        background: var(@activeBg);
        color: var(@activeColor);
      }
    }

  }

  .style-channel() {
    .channel-list {
      .active {
        background: var(--color-bg-200);
        border: 1px solid var(--theme-color-900);
        color: var(--color-text-white-100);
      }
    }
  }

  .border() {
    .tab-list {
      .item {
        border: 1px solid var(--line-color);
      }
    }
  }
}


#recharge-main-default-subTabDefault-index.style();

.blue-default {
  #recharge-main-default-subTabDefault-index.style-channel()
}

.amber-purple {
  #recharge-main-default-subTabDefault-index.style(@color: --color-text-100, @activeBg: --theme-color-700);
  #recharge-main-default-subTabDefault-index.border();
}

.auroral-yellow {
  #recharge-main-default-subTabDefault-index.style(@color: --color-text-gray-200, @activeBg: --theme-color-800, @activeColor: --color-text-black-100);

}

</style>
