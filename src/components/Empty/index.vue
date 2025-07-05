<template>
  <div class="flex flex-col items-center justify-center" :class="`${setEmptyTheme}-empty`">
    <ion-icon class="text-[14.5rem]" :src="`/first/svg/empty/msg-${theme}.svg`" v-if="type === 'msg'"/>
    <div style="color:red" class="h-[12.5rem] w-[15.375rem] flex items-center justify-center relative" v-else-if="newSkin">
      <ion-icon class="empty-svg h-full w-[200px] mx-auto absolute top-0 left-[1.4375rem]" :src="'/first/svg/empty/empty-bg-new.svg'"/>
    </div>
    <div style="color:red" class="h-[12.5rem] w-[15.375rem] flex items-center justify-center relative" v-else>
      <ion-icon class="empty-svg h-full w-full absolute top-0 left-0" :src="'/first/svg/empty/search_bg.svg'"/>
      <ion-icon class="text-9xl" :src="`/first/svg/empty/search-${setEmptyTheme}.svg`"/>
    </div>
    <ion-label class="text-[--color-text-empty]" >{{ text || $t('label.noRecord') }}</ion-label>
  </div>
</template>

<script setup lang="ts">
import { getTheme } from '@/theme/hooks'
import { IonIcon, IonLabel } from '@ionic/vue';

const { theme,  newSkin} = getTheme();

interface Props {
  type?: string
  text?: string
  specifyTheme?: string
}

const props = defineProps<Props>()
const setEmptyTheme = computed(() => {
   if(props.specifyTheme) return props.specifyTheme
   if(theme == 'auroral-yellow') return 'yellow-dark'
   return theme
})
</script>

<style scoped lang="less">
div.empty-search {
  background: url('/first/svg/empty/search_bg.svg') no-repeat center;
}

.empty-svg {
  color: var(--empty-icon-color);
}

.empty-svg-style(@color) {
  .empty-svg {
    color: @color;
  }
  
}

.blue-default-empty{
  .empty-svg-style(#101629);
}
.green-default-empty{
  .empty-svg-style(#274116);
}
.green-dark-empty{
  .empty-svg-style(#262624);
}
.yellow-dark-empty{
  .empty-svg-style(#262624);
}

.purple-light-empty{
  .empty-svg-style(#ccb2ff);
}
.amber-purple-empty{
  .empty-svg-style(#7a3fe8);
}


.new-skin-symbol {
  .empty-svg {
    color: var(--ep-color-text-weakest);
    font-size: 3rem;
  }
  ion-label {
    color: var(--ep-color-text-weakest);
    font-size: var(--ep-font-size-l);
    font-weight: var(--ep-font-weight-regular);
    white-space: nowrap;
  }
}
</style>
