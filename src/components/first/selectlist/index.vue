<script setup lang="ts">
import { IonIcon, IonPopover, IonContent } from '@ionic/vue'
import useAddThemeClassName from '@/hooks/useAddThemeClassName'
import { getTheme } from '@/theme/hooks'
const { theme, skin } = getTheme()
export interface TypeSelectIem {
  name: string,
  id: number,
}
const emit = defineEmits<{
  (e: 'handleChange', id: number): void
  (e: 'update:modelValue', id: number): void
}>()
let props = withDefaults(defineProps<{
  selectList: TypeSelectIem[]
  width?: string,
}
>(), {

});

const currentId = defineModel({ type: Number })


const popoverOpen = ref(false)

const currentName = computed(() => {
  return props.selectList.find(it => it.id === currentId.value)?.name
})


const selectWidth = computed(() => props?.width || '9.375rem')



const itemClick = (item: TypeSelectIem) => {
  popoverOpen.value = false
  if (currentId.value === item.id) return
  emit('update:modelValue', item.id)
  emit('handleChange', item.id)
}

const openPopover = () => {
  popoverOpen.value = true
}


</script>
<template>


  <div class="select-box flex-between" :class="theme" @click="openPopover" id="click-trigger">



    <div class="box">
      <p>{{ currentName }}</p>
    </div>
    <ion-icon :class="['arrow', { 'rotate-180': popoverOpen }]" src="/first/svg/assets/arrow.svg"
      v-if="selectList.length" />

  </div>
  <ion-popover v-if="selectList.length" mode="md" side="bottom" alignment="start" trigger="click-trigger"
    :is-open="popoverOpen" @didDismiss="popoverOpen = false">
    <ion-content>
      <ul :class="['select-list', theme]">
        <li v-for="(it) in selectList" :key="it.name" :class="{ active: it.id == currentId }"
          @click="() => itemClick(it)">
          <p> {{ it.name }}</p>

        </li>

      </ul>
    </ion-content>
  </ion-popover>



</template>

<style scoped lang="less">
#components-selectlist-index {

  .style(@itemBg: --color-bg-200,
    @itemColor: --color-text-40,
    @itemActiveBg: --color-bg-100,
    @itemActiveColor: --color-text-100,
    @arrowColor: --color-text-100,
    @borderColor: --color-line) {
    ion-popover {
      --width: v-bind(selectWidth);
      z-index: 100;
    }

    .inner {
      display: inline-block;
      vertical-align: middle;
      line-height: 1
    }


    .select-item {
      width: v-bind(selectWidth);
      line-height: 2.25rem;
      background: var(@itemBg);
      border-radius: var(--ep-border-radius-s, .25rem);
    }

    .select-box {
      padding: .4375rem;
      .select-item();
      height: 2.25rem;
      box-sizing: border-box;
      border: 1px solid var(@borderColor);

      ion-icon.arrow {
        font-size: var(--ep-font-size-l, 1rem);
        color: var(@arrowColor);
      }

      .box {
        height: 2.25rem;
        line-height: 2.25rem;
        color: var(@itemActiveColor);


        p {
          .inner()
        }
      }

    }


    .select-list {
      .select-item();

      li {
        height: 2.25rem;
        line-height: 2.25rem;
        box-sizing: border-box;
        text-align: center;
        font-size: var(--ep-font-size-s, .75rem);
        font-weight: var(--ep-font-weight-medium, 500);
        color: var(@itemColor);
        cursor: pointer;

        p {
          .inner()
        }

      }

      .active {
        color: var(@itemActiveColor);
        font-weight: var(--ep-font-weight-bold, 700);
        background-color: var(@itemActiveBg);
      }


    }




    .select-list> :not(:last-child) {
      border-bottom: 1px solid var(@borderColor);
    }


  }
}

.blue-default,
.auroral-yellow,
.green-default,
.amber-purple,
.yellow-dark,
.forest-green {
  #components-selectlist-index.style();
}

.green-dark {
  #components-selectlist-index.style(@itemActiveColor: --theme-color-800);
}

.forest-green {
  #components-selectlist-index.style();
}

.purple-light {
  #components-selectlist-index.style(@itemBg: --color-bg-400, @itemColor: --color-text-secondary-1, @itemActiveBg: --color-bg-400, @itemActiveColor: --theme-color-800);
}

.new-skin-symbol {
  #components-selectlist-index.style(@itemBg: --ep-color-background-fill-surface-raised-L1,
    @itemColor: --ep-color-icon-weaker,
    @itemActiveBg: --ep-color-background-fill-surface-raised-L2,
    @itemActiveColor: --ep-color-text-default,
    @arrowColor: --ep-color-icon-weaker,
    @borderColor: null);
   .select-box  {
    font-weight: var(--ep-font-weight-bold);
    height: 2rem;
    font-size: var(--ep-font-size-s);
   }
}
</style>
