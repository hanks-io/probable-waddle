<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import useDraggable from '@/hooks/useCustomDraggable'
import { AssetsTabInfo, TabTagInfo } from '../type'
import { getTheme } from '@/theme/hooks'
import { isEmpty } from '@/utils'
const tabTypeList = ['main-tab', 'sub-tab'] as const
type tabType = typeof tabTypeList[number]
const { theme, skin } = getTheme()
const {
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove
} = useDraggable()
const attrs = useAttrs()
const emit = defineEmits<{
  (e: 'tabChange', tabId: number): void
  (e: 'update:tabId', tabId: number): void
}>()
const props = defineProps<{
  tabList: AssetsTabInfo[]
  title?: string
  type: tabType
  tagInfo?: TabTagInfo,
  isNew?: boolean
}
>()
const tabEl = ref<HTMLElement | null>(null)
const tabId = defineModel<number>('tabId', { required: true })

const tabChange = (activeId: number) => {
  if (activeId === tabId.value) return
  emit('tabChange', activeId)
  emit('update:tabId', activeId)

}
const preventScroll = (e: Event) => {
  e.preventDefault();
};
onMounted(() => {
  tabEl.value?.addEventListener('wheel', preventScroll, { passive: false });
});
onUnmounted(() => {
  tabEl.value?.removeEventListener('wheel', preventScroll);
})

const hasTag = computed(() => props.tabList.some(it => it.tagValue) || !isEmpty(props.tagInfo))

</script>
<template>
  <div :class="['channel-wrap', type]" v-bind="attrs" ref="tabEl">
    <p class="title" v-if="title">{{ title }}</p>

    <ul :class="['channel-list', 'flex-start', { 'tag-list': hasTag }, { 'new-tab': isNew }]"
      @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
      <li v-for="it in tabList" :key="it.id" :class="{ active: tabId === it.id }" @click="() => tabChange(it.id)">

        <div class="tag" v-if="it.tagValue || (tagInfo?.name == it.name)">
          <ion-icon slot="icon-only" class="rectangle" :src="`/${skin}/svg/rectangle1.svg`" />
          <i>{{ it.tagValue ??
            tagInfo?.value }}</i>
        </div>
        {{ it.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.px-12 {
  padding: 0 .75rem;
}

/* 所有皮肤的公共样式 */

.channel-wrap {
  ::-webkit-scrollbar {
    display: none !important;
    width: 0px;
    height: 0px;
  }

  .channel-list {
    text-align: center;
    overflow-x: auto;
    align-content: flex-end;
    align-items: flex-end;
    touch-action: pan-x;
  }
}




.item-style {

  .style(@item-border: --color-line,
  ) {
    flex-shrink: 0;
    padding: 0 .75rem;
    min-width: 4.3125rem;
    box-sizing: border-box;
    border-radius: var(--rounded-middle);
    margin-right: .75rem;
    border: 0.0625rem solid var(@item-border);
    overflow-x: visible;
    cursor: pointer;
    font-size: var(--font-size-14);
  }

}


#withdraw-main-assetsTab-index {
  .mainTabStyle(@bg: --color-bg-200, @Color: --color-text-white-100, @activeBg: --theme-color-gradient-100, @activeColor: --color-text-white-100, @activeFontWeight: --font-weight-bold) {
    .channel-wrap.main-tab {
      .channel-list {
        li {
          width: 7rem;
          height: 2.625rem;
          line-height: 2.625rem;
          flex-shrink: 0;
          padding: 0 .75rem;
          min-width: 4.3125rem;
          background: var(@bg);
          color: var(@Color);
          .item-style.style();
        }

        .active {
          background: var(@activeBg);
          color: var(@activeColor);
          font-weight: var(@activeFontWeight);

        }


      }

    }

  }


  .subTabStyle(@titleColor: --color-text-white-100,
    @bg: --color-bg-50,
    @Color: --color-text-gray-200,
    @activeColor: --color-text-gray-200,
    @activeBg: --theme-color-gradient-300,
    @activeColor: --color-text-white-100,
    @activeColorNew: --accent-color-orange,
    @activeBorderColorNew: --line-color,
    @activeBgNew: --color-bg-100,
    @activeBorderColor: --theme-color-500,
    @activeFontWeight: --font-weight-bold,
    @item-border: --color-line) {
    .channel-wrap.sub-tab {
      .title {
        line-height: 1.375rem;
        margin: .75rem 0;
        color: var(@titleColor);
      }

      .channel-list {

        li {
          width: 5rem;
          height: 2.125rem;
          line-height: 2.125rem;
          background: var(@bg);
          color: var(@Color);
          .item-style.style(@item-border);
        }

        .active {
          background: var(@activeBg);
          border-color: var(@activeBorderColor);
          color: var(@activeColor);
          font-weight: var(@activeFontWeight);
        }



      }

      .new-tab {
        .active {
          color: var(@activeColorNew);
          border-color: var(@activeBorderColorNew);
          background: var(@activeBgNew);
        }
      }
    }



  }

  .style(@activeMainBg: --color-bg-100, @color: --color-text-40, @activeColor: --color-text-100, @activeSubBg: --color-bg-200, @tagColor: var(--color-primary-800)) {
    .channel-wrap {
      box-sizing: border-box;
      font-size: var(--font-size-12);

      .title {
        font-weight: var(--font-weight-bold);
        margin-bottom: .4375rem;
        color: var(--color-text-100);
      }

      .channel-list {
        height: 1.875rem;
        position: sticky;
        top: 0;

        li {
          height: 1.875rem;
          flex-shrink: 0;
          padding: 0 .75rem;
          min-width: 4.3125rem;
          line-height: 1.875rem;
          color: var(@color);
          border-radius: var(--rounded-small);
          margin-right: .875rem;
          border: 1px solid var(--color-border);
          position: relative;
          overflow-x: visible;
          cursor: pointer;
          background: var(--color-bg-400);


          .tag {
            position: absolute;
            width: 2.75rem;
            height: 1.125rem;
            right: .3125rem;
            top: -0.5625rem;
            line-height: 1.125rem;
            color: var(--accent-color-red);
            z-index: 10;


            .rectangle {
              width: 100%;
              height: 100%;

            }

            i {
              font-size: var(--font-size-8);
              color: var(--text-color-white-100);
              font-weight: var(--font-weight-bold);
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }


          }
        }

        .active {

          color: var(@activeColor);
          font-weight: var(--font-weight-bold);

        }

      }

      .tag-list {
        height: 2.5rem;
      }



    }

    .main-tab .channel-list .active {

      background: var(@activeMainBg);
    }

    .sub-tab .channel-list .active {

      background: var(@activeSubBg);
    }
  }

}

.blue-default {
  #withdraw-main-assetsTab-index.mainTabStyle(@activeFontWeight: --font-weight-regular);
  #withdraw-main-assetsTab-index.subTabStyle();
}


.green-default {
  #withdraw-main-assetsTab-index.mainTabStyle(@Color: --color-text-gray-100);
  #withdraw-main-assetsTab-index.subTabStyle(@titleColor: --color-text-gray-100, @bg: --color-bg-200, @activeBg: --color-bg-400, @activeColor: --color-text-gray-100, );
}

.forest-green {
  #withdraw-main-assetsTab-index.mainTabStyle(@Color: --color-text-gray-100);
  #withdraw-main-assetsTab-index.subTabStyle(@titleColor: --color-text-gray-100, @bg: --color-bg-200, @activeBg: --color-bg-400, @activeBorderColor: --theme-color-800, @item-border: --color-bg-100, @activeColor: --color-text-gray-100, @activeBorderColorNew:  --color-text-gray-200);
}



.amber-purple {
  .default {
    #withdraw-main-assetsTab-index.mainTabStyle(@Color: --text-color-light-purple-1-100, @activeBg: --theme-color-800, @activeColor: --color-text-secondary-1);
    #withdraw-main-assetsTab-index.subTabStyle(@titleColor: --text-color-light-purple-1-100, @bg: --color-bg-400, @Color: --text-color-light-purple-1-100, @activeBg: --color-bg-400, @activeColor: --color-text-gray-100, @activeBorderColor: --theme-color-800, )
  }


  .second {
    #withdraw-main-assetsTab-index.style(@activeMainBg: --theme-color-800, @activeSubBg: --theme-color-800, @activeColor: --color-text-secondary-1, @tagColor: linear-gradient(317deg, #7041F3 45%, #F5C84C 89%), @color: --text-color-light-purple-1-100)
  }
}

.green-dark,
.yellow-dark {
  #withdraw-main-assetsTab-index.style()
}

.auroral-yellow {
  #withdraw-main-assetsTab-index.mainTabStyle(@activeBg: --theme-color-800, @activeColor: --color-text-black-100);
  #withdraw-main-assetsTab-index.subTabStyle(@bg: --color-bg-200, @activeBg: --color-bg-100);
}


.purple-light {
  #withdraw-main-assetsTab-index.style(@activeMainBg: --theme-color-800, @activeSubBg: --theme-color-800, @activeColor: --color-text-secondary-1, @tagColor: var(--accent-color-red), @color: --color-text-80)
}


#withdraw-main-assetsTab-new-index {

  .style() {
    .channel-wrap {
      box-sizing: border-box;
      font-size: var(--ep-font-size-s, .75rem);

      .title {
        font-weight: var(--ep-font-weight-bold, 700);
        margin-bottom: .4375rem;
        color: var(--ep-color-text-default);
      }

      .channel-list {
        height: 1.875rem;
        position: sticky;
        top: 0;

        li {
          height: 1.875rem;
          flex-shrink: 0;
          padding: 0 .75rem;
          min-width: 4.3125rem;
          line-height: 1.875rem;
          color: var(--ep-color-text-weaker);
          border-radius: var(--ep-border-radius-m, .375rem);
          margin-right: .875rem;
          border: 1px solid var(--ep-color-border-default);
          position: relative;
          overflow-x: visible;
          cursor: pointer;
          background: var(--ep-color-background-fill-body-default);


          .tag {
            position: absolute;
            width: 2.75rem;
            height: 1.125rem;
            right: .3125rem;
            top: -0.5625rem;
            line-height: 1.125rem;
            color: var(--ep-color-icon-tips);
            z-index: 10;


            .rectangle {
              width: 100%;
              height: 100%;

            }

            i {
              font-size: var(--ep-font-size-xs, .625rem);
              color: var(--ep-color-icon-highlight-white);
              font-weight: var(--ep-font-weight-bold, 700);
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }


          }
        }

        .active {

          color: var(--ep-color-text-selected);
          font-weight: var(--ep-font-weight-bold, 700);

        }

      }

      .tag-list {
        height: 2.5rem;
      }



    }

    .main-tab .channel-list .active {
      color: var(--ep-color-text-inverse);
      background: var(--ep-color-background-fill-active-primary);
    }

    .sub-tab .channel-list .active {

      background: var(--ep-color-background-fill-surface-raised-L1);
    }
  }

}


.new-skin-symbol {
  #withdraw-main-assetsTab-new-index.style();
}
</style>
