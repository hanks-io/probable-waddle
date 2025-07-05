<script setup lang="ts">
import {
  IonContent,
  IonSearchbar,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonIcon,
} from '@ionic/vue';
import type { SearchbarCustomEvent } from '@ionic/vue';
import { SelectInfo } from '../type'
import { getTheme } from '@/theme/hooks'
const { theme } = getTheme()
const modal = ref();
const isExpand = ref(false)
const emit = defineEmits<{
  (e: 'update:modelValue', code: string): void
}>()
const activeCode = defineModel<string>({ required: true })
const props = withDefaults(defineProps<{
  selectList: SelectInfo[]
  placeholder: string

}
>(), {

});
const filteredItems = ref([...props.selectList]);
const handleClick = (it: SelectInfo) => {
  modal.value?.$el.dismiss()
  if (it.code === activeCode.value) return
  emit('update:modelValue', it.code)
}
const activeSelect = computed(() => {
  return props.selectList.find(it => it.code === activeCode.value)
})
const onClick = () => {
  filteredItems.value = [...props.selectList];
}
const didDismiss = () => {
  isExpand.value = false
}
const didPresent = () => {
  isExpand.value = true
}
const initialBreakpoint = 0.5
const breakpoints = [0, 0.25, 0.5, 0.75]
const initialHeight = ref(initialBreakpoint * 100 + (breakpoints.indexOf(initialBreakpoint) + 1))
const searchbarInput = (ev: SearchbarCustomEvent) => {
  filterList(ev.target.value);
};
const ionBreakpointDidChange = (ev: CustomEvent) => {
  console.log(ev.detail.breakpoint, 'ev');
  const breakpoint = ev.detail.breakpoint
  initialHeight.value = breakpoint * 100 + breakpoints.indexOf(breakpoint) + 1
};
const filterList = (searchQuery: string | undefined | null) => {

  if (!searchQuery) {
    filteredItems.value = [...props.selectList];
    return
  }

  const normalizedQuery = searchQuery.toLowerCase();
  filteredItems.value = props.selectList.filter((item) => {
    return item.name.toLowerCase().includes(normalizedQuery);
  });

};
</script>
<template>
  <div class="select-border" id="select-blank-card" @click="onClick">
    <div class="placeholder" v-if="!activeCode">{{ placeholder }}</div>
    <div v-else class="flex-start">
      <div class="img-wrap">
        <img alt="" :src="activeSelect?.icon" />
      </div>
      <div class="name-wrap">
        <div class="name-inner">{{ activeSelect?.name }}</div>
      </div>


    </div>
    <ion-icon :class="['arrow', { 'rotate-90': !isExpand }]" src="/first/svg/assets/arrow.svg"></ion-icon>
  </div>

  <ion-modal @didDismiss="didDismiss" @didPresent="didPresent" @ionBreakpointDidChange="ionBreakpointDidChange"
    trigger="select-blank-card" ref="modal" :initial-breakpoint="initialBreakpoint" :breakpoints="breakpoints"
    :expand-to-scroll="false">
    <ion-content class="select-content">
      <div class='select-list' :style="{ maxHeight: `${initialHeight}%` }">
        <ion-searchbar placeholder="Search" :debounce="500" @ionInput="searchbarInput($event)"></ion-searchbar>
        <ion-radio-group :value="activeCode">
          <div v-for="it in filteredItems" :class="['select-item', { active: it.code === activeCode }, theme]"
            :key="it.code" @click="handleClick(it)">
            <div class="select-item-inner">
              <div class="img-wrap">
                <img alt="" :src="it.icon" />
              </div>
              <div class="name-wrap">
                <div class="name-inner">{{ it.name }}</div>
              </div>
            </div>
            <div class="radio-wrap">
              <ion-radio :value="it.code" mode="ios" class='select'></ion-radio>
            </div>
          </div>
        </ion-radio-group>
      </div>
    </ion-content>
  </ion-modal>
</template>

<style scoped lang="less">
.select-content {
  --padding-bottom: 1.625rem;
  --background: var(--color-bg-400);

}

.select-border {
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-line);
  box-sizing: border-box;
  padding: 0 0.75rem;
  color: var(--color-text-100);
  border-radius: var(--rounded-small);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .placeholder {
    color: var(--color-text-40);
    font-weight: var(--font-weight-regular);
  }

  .rotate-90 {
    transform: rotate(-90deg);
  }

  .arrow {
    font-size: .875rem;
    color: var(--color-text-40);
  }


}


.img-wrap {
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: .5rem;


  img {
    width: 100%;
    height: 100%;
  }
}

.name-wrap {
  line-height: inherit;

  .name-inner {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
  }


}

#withdraw-main-bindBankTab-index {

  .style(@radioCheckedBg: --theme-color-800,
    @radioCheckedBorderColor: --line-color, @radioBorderColor: --color-text-40) {
    .select-list {
      padding-bottom: 0.75rem;
      background: var(--color-bg-300);
      overflow: scroll;

      ion-searchbar {
        --background: var(--color-bg-200);
        --color: var(--color-text-100);
        --placeholder-color: var(--color-text-40);
        --icon-color: var(--color-text-40);
        --border-radius: .25rem;
      }

      .select-item {
        background: var(--color-bg-300);
        padding: 0 0.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--color-text-100);
        height: 3rem;
        border: 1px solid var(--color-line);
        border-radius: .25rem;
        width: 22.875rem;
        margin: 0 auto .5rem;

        .select-item-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }


      }

      .active {
        background: var(--color-bg-200);
      }

      .radio-wrap {

        ion-radio {
          --color-checked: var(@radioCheckedBorderColor);
        }

        ion-radio.select.ios::part(container) {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid var(@radioBorderColor);
        }

        .radio-checked.select.ios::part(container) {
          border-color: var(@radioCheckedBorderColor);
          background-color: var(@radioCheckedBg);
        }


      }
    }
  }
}


#withdraw-main-bindBankTab-index.style();

.purple-light {
  #withdraw-main-bindBankTab-index.style(@radioCheckedBg: --accent-color-orange, @radioCheckedBorderColor: --color-text-secondary-1);
}

.blue-default,
.green-default {
  #withdraw-main-bindBankTab-index.style(@radioCheckedBg: --accent-color-yellow);
}

.amber-purple {
  #withdraw-main-bindBankTab-index.style(@radioCheckedBg: --accent-color-yellow);
}






#withdraw-main-bindBankTab-new-index {
  .style() {
    .select-content {
      --padding-bottom: 1.625rem;
      --background: var(--ep-color-background-fill-surface-raised-L2);
    }

    .select-border {
      width: 100%;
      height: 100%;
      border: 1px solid var(--ep-color-border-selected);
      box-sizing: border-box;
      padding: 0 0.75rem;
      color: var(--ep-color-text-default);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: var(--ep-border-radius-m);

      .placeholder {
        color: var(--ep-color-text-weaker);
        font-weight: var(--ep-font-weight-regular);
      }

      .rotate-90 {
        transform: rotate(-90deg);
      }

      .arrow {
        font-size: var(--ep-font-size-m, .875rem);
        color: var(--ep-color-icon-weaker);
      }



    }


    .img-wrap {
      width: 1.625rem;
      height: 1.625rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: .3125rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .name-wrap {
      line-height: inherit;

      .name-inner {
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
      }


    }




    .select-list {
      background: var(--ep-color-background-fill-body-default);
      padding-bottom: 0.75rem;
      overflow: scroll;

      ion-searchbar {
        --background: var(--ep-color-background-fill-surface-lowered);
        --color: var(--ep-color-text-highlight);
        --placeholder-color: var(--ep-color-text-weaker);
        --icon-color: var(--ep-color-icon-weaker);
        --border-radius: var(--ep-border-radius-s);
      }

      .select-item {
        background: var(--ep-color-background-fill-surface-raised-L1);
        padding: 0 0.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ep-color-text-default);
        height: 3rem;
        border: 1px solid var(--ep-color-border-default);
        border-radius: var(--ep-border-radius-m);
        width: 22.875rem;
        margin: 0 auto .5rem;

        .select-item-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }


      }

      .active {
        background: var(--ep-color-background-fill-surface-raised-L2);
      }

      .radio-wrap {

        ion-radio {
          --color-checked: var(--ep-color-border-default);
        }

        ion-radio.select.ios::part(container) {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid var(--ep-color-border-default);
        }

        .radio-checked.select.ios::part(container) {
          border-color: var(--ep-color-border-default);
          background-color: var(--ep-color-icon-default);
        }

      }
    }

  }
}

.new-skin-symbol {
  #withdraw-main-bindBankTab-new-index.style();
}
</style>
