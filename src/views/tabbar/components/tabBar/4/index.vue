<template>
  <div v-show="currentRouteShowTab" ref="tabBarRef" class="outer-wrap">
    <ion-tab-bar class="tab-bar" v-resize-directive="tabIndexChange">
      <div class="inner-wrap">
        <div class="tab-bg">
          <div class="tab-btn" v-for="(item, index) in tabList" :key="item.route" :tab="item.tab"
            @click="navigator(item.route)">
              <i :class="[route.name == item.tab ? 'on' : '', 'tab-img']" :style="`background-image: url(/icons/tabbar/${item.tab}-fx.png)`"
              v-if="index !== 2" />
            <ion-label
              :class="[index == 2 ? 'flexible-text' : '', route.name == item.tab ? 'active' : '', 'label']">{{ $t(item.text) }}</ion-label>
            <HotPoint :isShow="item.point" :class="`point-${index}`" classNames="a"/>
          </div>
          <div class="underline"></div>
        </div>
      </div>
    </ion-tab-bar>
  </div>
  <div v-show="currentRouteShowTab" v-hate-keyboard class="deposit" :class="depositActive ? 'on' : ''"
    @click="navigator('/main/entrar')">
    <i :class="[route.name == 'entrar' ? 'on' : '', 'tab-img']"
      :style="`background-image: url(/first/svg/tabbar/deposit-blue-dark-on.png)`" />
  </div>
</template>

<script setup lang="ts">
  import { IonTabBar, IonLabel } from "@ionic/vue";
  import useTabLogic from "@/views/tabbar/components/tabBar/logic";
  import vHateKeyboard from '@/directives/hateKeyboard';
  import HotPoint from "@/components/HotPoint/index.vue";
  import vResizeDirective from '@/directives/resize';

  const route = useRoute();

  const { tabList, navigator, tabBarRef, currentRouteShowTab } = useTabLogic();

  // tab下标动画
  async function tabIndexChange(elRef?: { target: HTMLElement }) {
    const elTarget = elRef?.target || tabBarRef.value;
    const underline = document.querySelector('.underline') as HTMLElement;
    if (route.name == 'entrar') {
      underline.style.visibility = 'hidden';
      return;
    }
    const index = tabList.value.findIndex((item) => item.tab == route.name)
    if (index === -1) return;
    underline.style.visibility = 'visible';
    const el = elTarget.querySelectorAll('.tab-btn')[index];
    const tabBarLeft = elTarget.getBoundingClientRect().left;
    const rect = el.getBoundingClientRect();
    if (underline) {
      underline.style.left = `${rect.left - tabBarLeft + rect.width / 2}px`;
    }
  }
  const watchRoute = inject('watchRoute') as WatchRoute;
  watchRoute.use(async (path: string, oldPath: string, next: (path: string, oldPath: string) => {}) => {
    next(path, oldPath);
    await nextTick();
    tabIndexChange()
  })

  const depositActive = ref(false);

  const tabBarImg = computed(() => `url('/first/svg/tabbar/bg-blue-dark.svg') no-repeat center / cover`);
</script>

<style lang="less" scoped>
@import './index.less';  

.blue-default {
  
  #tabbar-MainPage-components-Tabs-Tabs4-index.style(
    @bg2: v-bind(tabBarImg);
  );
}
</style>
