<!-- 首页抽屉 -->
<template>
  <ion-menu
    menu-id="main-menu"
    content-id="main-content"
    :swipe-gesture="false"
    @ionWillClose="menuIonDidClose"
    @ionWillOpen="menuIonDidOpen"
  >
    <ion-header class="ion-no-border" v-bind="headerComponentList.options">
      <template v-for="item in headerComponentList.list" :key="item.key">
        <ion-menu-toggle v-if="item.options.needMenuToggle">
          <component :is="item.component" v-bind="item.options"/>
        </ion-menu-toggle>
        <component v-else :is="item.component" v-bind="item.options"/>
      </template>
    </ion-header>
    <!-- 抽屉内容 -->
    <ion-content class="relative" :style="{ '--padding-bottom': contentBottom }" v-bind="contentComponentList.options">
      <template v-for="item in contentComponentList.list" :key="item.key">
        <ion-menu-toggle v-if="item.options.needMenuToggle">
          <component :is="item.component" v-bind="item.options"/>
        </ion-menu-toggle>
        <component v-else :is="item.component" v-bind="item.options"/>
      </template>
    </ion-content>

    <footer v-if="footerComponentList.list.length > 0" ref="footerRef" v-bind="footerComponentList.options">
      <template v-for="item in footerComponentList.list" :key="item.key">
        <ion-menu-toggle v-if="item.options.needMenuToggle">
          <component :is="item.component" v-bind="item.options"/>
        </ion-menu-toggle>
        <component v-else :is="item.component" v-bind="item.options"/>
      </template>
    </footer>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonMenu, IonMenuToggle, IonHeader, IonContent } from '@ionic/vue';
import useLogic from './logic1';

const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  }
})
const headerComponentList = computed(() => {
  const headerObj = props.componentList.find(item => item.position === 'header')
  return headerObj || { list: [] }
})
const footerComponentList = computed(() => {
  const footerObj = props.componentList.find(item => item.position === 'footer')
  return footerObj || { list: [] }
})
const contentComponentList = computed(() => {
  const contentObj = props.componentList.find(item => item.position === 'content')
  return contentObj || { list: [] }
})

const {
  footerRef,
  contentBottom,
  menuIonDidOpen,
  menuIonDidClose,
} = useLogic();

</script>



<style scoped lang="less">
@import './index.less';
footer {
  position: fixed;
  bottom: 1rem;
  width: 100%;
  padding: 0 0.75rem;
}
</style>

