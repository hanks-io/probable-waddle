<!-- 顶部导航栏 -->
<template>
  <ion-header mode="md" class="navigation" :class="{ 'ion-no-border': props.headBorder ?? true }">
    <ion-toolbar mode="ios">
      <slot name="start">
        <ion-button mode="md" class="h-[3.125rem]" slot="start" fill="clear" @click="navigater">
          <ion-icon class="back" slot="icon-only" src="/svg/arrow_left.svg" />
        </ion-button>
      </slot>
      <ion-title class="title text-xl font-medium line-clamp-1 flex">{{ title }}</ion-title>
      <div slot="end">
        <slot name="end"></slot>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonIcon, IonButton, IonTitle } from '@ionic/vue';
import useNavigaterBack from '@/hooks/useNavigaterBack'
import { PageParam, setPageParam } from '@/store/pageParam';

interface Props {
  title?: string
  backRebate?: boolean
  bgColor?: string
  headBorder?: boolean
}

const props = defineProps<Props>()
const bindBgColor = computed(() => props.bgColor ? `var(${props.bgColor})` : `var(--ep-color-background-fill-top-nav-secondary, var(--color-bar-bg))`)
/**
 * @description 路由跳转
 */
const navigater = () => {
  if (props.backRebate) {
    setPageParam(PageParam.RECORD_BACK_REBATE, props.backRebate);
  }

  useNavigaterBack();
};
</script>

<style scoped lang="less">

ion-header.navigation {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  box-shadow: 0px 4px 28.4px 0px var(--color-bar-bg-shadow);
}

ion-header.navigation ion-toolbar {
  height: 3.125rem;
  --background: v-bind('bindBgColor');
  --padding-top: 0;
}

ion-button {
  --padding-start: 0.875rem;
  --padding-end: 0.875rem;
  margin-top: 0;
  margin-bottom: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  --color: var(--ep-color-text-default, var(--color-toolbar-text, var(--text-color-white-100)));
}

ion-title.title {
  font-size: var(--ep-font-size-xl);
  font-weight: var(--ep-font-weight-medium);
  color: var(--ep-color-text-default, var(--color-toolbar-text, var(--text-color-white-100)));
}

ion-icon.back {
  font-size: var(--ep-font-size-xl, var(--font-size-back-button));
  font-weight: var(--ep-font-weight-medium);
  color: var(--ep-color-icon-default, var(--color-text-title-basic));
}
</style>
