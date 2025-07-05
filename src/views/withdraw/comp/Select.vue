<script setup lang="ts">
import { SelectInfo } from '../type'
import { IonContent, IonIcon, IonImg, IonItem, IonPopover, IonList, IonAvatar } from '@ionic/vue';
import { getTheme } from '@/theme/hooks'
const { theme } = getTheme()

const emit = defineEmits<{
  (e: 'update:modelValue', code: string): void
}>()
const activeCode = defineModel<string>({ required: true })
let props = withDefaults(defineProps<{
  selectList: SelectInfo[]
  placeholder: string
}
>(), {

});
const handleClick = (it: SelectInfo) => {

  if (it.code === activeCode.value) return
  emit('update:modelValue', it.code)
}
const activeSelect = computed(() => {
  return props.selectList.find(it => it.code === activeCode.value)
})
</script>
<template>
  <div class="select-border" id="popover-button">
    <div class="placeholder" v-if="!activeCode">{{ placeholder }}</div>
    <div v-else class="flex-start">
      <div class="img-wrap">
        <img alt="" :src="activeSelect?.icon" />
      </div>
      <div class="name-wrap">
        <div class="name-inner">{{ activeSelect?.name }}</div>
      </div>


    </div>
  </div>

  <ion-popover trigger="popover-button" :dismiss-on-select="true" :showBackdrop="false" mode="md" size="cover">
    <ion-content class="select-content">
      <ion-list lines="full" mode="md" class='select-list'>

        <ion-item mode="md" lines="full" :button="true" v-for="it in selectList"
          :class="['select-item', { active: it.code === activeCode }, theme]" :key="it.code" @click="handleClick(it)">
          <div class="img-wrap">
            <img alt="" :src="it.icon" />
          </div>
          <div class="name-wrap">
        <div class="name-inner">{{ it.name }}</div>
      </div>
        

        </ion-item>



      </ion-list>
    </ion-content>
  </ion-popover>

</template>

<style scoped lang="less">
.select-content {
  --padding-bottom: 1.625rem
}

.select-border {
  width: 100%;
  height: 100%;
  border: 1px solid var(--color-line);
  box-sizing: border-box;
  padding: 0 0.75rem;
  color: var(--color-text-100);
  border-radius: var(--rounded-small);

  .placeholder {
    color: var(--color-text-40);
    font-weight: var(--font-weight-regular);
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


.select-list.list-md {
  background: var(--color-bg-400);
  padding: 0;
}

ion-item.select-item {
  --background: var(--color-bg-400);

  --background-hover: var(--color-bg-200);
  --background-hover-opacity: 1;
  color: var(--color-text-40);
}

ion-item.active {
  --background: var(--theme-color-800);
  color: var(--color-text-100);
}

ion-item.active.purple-light {
  --background: var(--theme-color-800);
  color: var(--color-text-secondary-1);
}

ion-item.select-item.blue-default {
  --background: #070B18;


}
</style>
