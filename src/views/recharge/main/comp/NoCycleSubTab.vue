<script setup lang="ts">
import { AssetsTabInfo } from '@/views/withdraw/type'
const subTabList = ["sub-tab", "channel"] as const
type SubTabType = typeof subTabList[number]


const emit = defineEmits<{
  (e: 'tabChange', tabId: number): void
  (e: 'update:tabId', tabId: number): void
}>()
withDefaults(defineProps<{
  tabList: AssetsTabInfo[]
  title: string
  type?: SubTabType

}
>(), {
  type: 'sub-tab'
})
const tabEl = ref<HTMLElement | null>(null)
const tabId = defineModel<number>('tabId', { required: true })

const tabChange = (activeId: number) => {
  if (activeId === tabId.value) return
  emit('tabChange', activeId)
  emit('update:tabId', activeId)

}




</script>
<template>
  <div class="sub-tab-wrap" ref="tabEl">
    <p class="title">{{ title }}</p>

    <ul class="sub-tab-list">
      <li v-for="it in tabList" :key="it.id" :class="[{ active: tabId === it.id }, type]"
        @click="() => tabChange(it.id)">

        <div class="tag" v-if="it.tagValue">
          {{ it.tagValue }}
        </div>

        <div class="icon" v-if="type === 'sub-tab'">
          <img :src="it.icon" alt="" v-if="it.icon">
        </div>
        <div class="name">
          <div class="inner">{{ it.name }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
#recharge-main-cycle-subTab-index {

  .style(@titleColor: --ep-color-text-default,
    @itemBgColor: --ep-color-background-fill-surface-raised-L1,
    @activeMainBg: --ep-dynamic-secondary,
    @itemcolor: --ep-color-text-weaker,
    @activeColor: --ep-color-text-default,
    @tagColor: --ep-color-text-highlight-white,
    @tagBgColor: --ep-color-icon-tips,
    @activeBorderColor: --ep-color-border-selected) {
    .sub-tab-wrap {
      box-sizing: border-box;
      font-size: var(--ep-font-size-s, .75rem);
      width: 100%;
      margin: .75rem auto 1.375rem;

      .title {
        font-weight: var(--ep-font-weight-bold, 700);
        margin-bottom: .625rem;
        color: var(@titleColor);
        line-height: 1.125rem;
      }

      .sub-tab-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: .875rem;

        li {
          flex: 0 0 calc(50% - (2/3 * .875rem));
          height: 3.375rem;
          flex-shrink: 0;
          padding: 0 .5rem;
          color: var(@itemcolor);
          border-radius: var(--ep-border-radius-m, .375rem);
          position: relative;
          overflow-x: visible;
          cursor: pointer;
          background: var(@itemBgColor);
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          align-items: center;
          font-size: var(--ep-font-size-s, .75rem);

          .name {
            width: 6.6875rem;


            .inner {
              display: inline-block;
              vertical-align: middle;
              line-height: 1.2;
              width: 100%;
            }

          }

          .tag {
            position: absolute;
            height: .875rem;
            right: 0;
            top: 0;
            line-height: .875rem;
            color: var(@tagColor);
            z-index: 10;
            font-weight: var(--ep-font-weight-medium, 600);
            font-size: .5rem;
            background: var(@tagBgColor);
            padding: 0 .375rem;
            border-radius: 0 var(--ep-border-radius-m, .375rem) 0 var(--ep-border-radius-m, .375rem);


          }
        }

        .sub-tab {
          .icon {
            width: 2rem;
            height: 2rem;
            border-radius: var(--ep-border-radius-m, .375rem);
            margin-right: .5rem;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

        }

        .channel {
          height: 2.5rem;

          .name {
            width: 90%;
          }
        }

        .active {
          color: var(@activeColor);
          font-weight: var(--ep-font-weight-bold, 700);
          border: 1px solid var(@activeBorderColor);
          background: var(@activeMainBg);
          .tag{
            right: -1px;
          }

        }

      }

      .tag-list {
        height: 2.5rem;
      }



    }

 
  }

}










.green-dark,
.yellow-dark {
  #recharge-main-cycle-subTab-index.style(@titleColor: --color-text-100,
    @itemBgColor: --color-bg-200,
    @activeMainBg: --color-btn-bg-active-r,
    @itemcolor: --color-text-40,
    @activeColor: --color-text-100,
    @tagColor: --text-color-white-100,
    @tagBgColor: --accent-color-red,
    @activeBorderColor: --theme-color-800)
}

.blue-default {
  #recharge-main-cycle-subTab-index.style(@titleColor: --color-text-100,
    @itemBgColor: --color-bg-200,
    @activeMainBg: --color-btn-bg-active-r,
    @itemcolor: --color-text-40,
    @activeColor: --color-text-100,
    @tagColor: --text-color-white-100,
    @tagBgColor: --accent-color-red,
    @activeBorderColor: --theme-color-900)
}

.purple-light {
  #recharge-main-cycle-subTab-index.style(@titleColor: --color-text-100,
    @itemBgColor: --color-bg-400,
    @activeMainBg: --color-btn-bg-active-r,
    @itemcolor: --color-text-40,
    @activeColor: --color-text-100,
    @tagColor: --text-color-white-100,
    @tagBgColor: --accent-color-red,
    @activeBorderColor: --theme-color-800)
}




.auroral-yellow,
.forest-green,
.green-default {
  #recharge-main-cycle-subTab-index.style(@titleColor: --color-text-100,
    @itemBgColor: --color-bg-100,
    @activeMainBg: --color-btn-bg-active-r,
    @itemcolor: --color-text-100,
    @activeColor: --color-text-100,
    @tagColor: --text-color-white-100,
    @tagBgColor: --accent-color-red,
    @activeBorderColor: --theme-color-800)
}

.amber-purple {
  #recharge-main-cycle-subTab-index.style(@titleColor: --color-text-100,
    @itemBgColor: --color-bg-100,
    @activeMainBg: --color-btn-bg-active-r,
    @itemcolor: --color-text-100,
    @activeColor: --color-text-100,
    @tagColor: --text-color-white-100,
    @tagBgColor: --accent-color-red,
    @activeBorderColor: --color-line)
}

.new-skin-symbol{
  #recharge-main-cycle-subTab-index.style()
}
</style>

