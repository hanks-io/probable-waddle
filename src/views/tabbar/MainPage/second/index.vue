<template>
  <ion-page>
    <!-- 左侧抽屉 -->
    <DrawerLeft v-if="drawerLoad" />
    <ion-content id="main-content">
      <ion-tabs class="b-tabs">
        <ion-router-outlet :animated="!isIOS" />
        <div ref="tabBarRef" class="absolute -bottom-[1px] w-full">
          <ion-tab-bar>
            <div class="w-full h-full flex flex-col relative pt-[10px]">
              <div class="tab-bar flex h-[56px]">
                <div class="flex-1 flex flex-col items-center justify-center relative" v-for="item in tabList"
                  :key="item.route" :tab="item.tab" @click="navigator(item.route)">
                  <div :style="route.name == item.tab
                      ? {
                        background: `url('/second/svg/tabbar/tab-on-amber-purple.svg') 0 0 / 100% 100% no-repeat`,
                        padding: '6px 20px 16px',
                        marginTop: '-16px',
                      }
                      : { height: '26px' }
                    ">
                    <ion-icon class="tab-img text-[26px]" :class="route.name == item.tab ? 'on' : ''"
                      :src="route.name == item.tab ? `/second/svg/tabbar/${item.tab}_on.svg` : `/second/svg/tabbar/${item.tab}-${theme}.svg`" />
                  </div>
                  <ion-label class="text-[14px]"
                    :style="route.name == item.tab ? { color: 'var(--tab-image-active-color)', marginTop: '-10px' } : { color: 'var(--tab-image-color)' }">{{
                    $t(item.text) }}</ion-label>
                  <HotPoint :isShow="item.tab === TabbarEnum.PERFIL && isShowProfileRedPoint"
                    classNames="top-2 right-[1.2rem]" />
                  <HotPoint :isShow="item.tab === TabbarEnum.PROMO && isShowPromoRedPoint"
                    classNames="top-2 right-[1.2rem]" />
                  <HotPoint :isShow="item.tab === TabbarEnum.PERFIL && ifHasVipReward"
                    classNames="top-2 right-[1.2rem]" />
                </div>
              </div>
              <div class="flex-1" />
            </div>
          </ion-tab-bar>
        </div>
        <div class="fixed drawer-backdrop w-full h-full z-40" v-if="drawerLeftIsOpen" />
        <div class="game-used" v-if="gameSportCode === 'SABA'"></div>
      </ion-tabs>
    </ion-content>

    <!-- 语言选择弹窗 -->
    <LanguageModal />
    <!-- 安装弹窗 -->
    <InstallModal :visible="installModalVisible" />
    <!-- PWA底部弹窗 -->
    <PwaFooterModal v-if="pwaFooterVisible" />
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { IonContent, IonTabBar, IonTabs, IonLabel, IonPage, IonRouterOutlet, IonIcon } from "@ionic/vue";
import PwaFooterModal from "@/pwa/footerModal/Second.vue";
import DrawerLeft from "../../components/DrawerLeft/second/index.vue";
import LanguageModal from "../../components/LanguageModal.vue";
import InstallModal from "@/pwa/installModal/HomeModal.vue";
import HotPoint from "@/components/HotPoint/index.vue";
import useMainPageLogic from "../logic";
import useTabLogic from "@/views/tabbar/components/tabBar/logic";


const route = useRoute();
const { tabList, navigator } = useTabLogic();
const {
  theme,
  isIOS,
  drawerLoad,
  tabBarRef,
  TabbarEnum,
  isShowProfileRedPoint,
  isShowPromoRedPoint,
  installModalVisible,
  pwaFooterVisible,
  drawerLeftIsOpen,
  gameSportCode,
  ifHasVipReward,
  useReDomainModal
} = useMainPageLogic();
useReDomainModal(); 

onBeforeRouteLeave(() => {
  gameSportCode.value = "";
});
gameSportCode.value = route.params.gameCode as string;

// 监听路由变化
watch(
  () => route.path,
  (newRoute) => {
    gameSportCode.value = route.params.gameCode as string;
  },
  { immediate: true },
);
</script>

<style scoped>
.game-used {
  height: 4.5rem;
  width: 24.375rem;
  background: #ededed;
  position: relative;
  z-index: -1;
  opacity: 0.7;
}

ion-tab-bar {
  height: 66px;
  --background: linear-gradient(to bottom, transparent 10px, var(--color-bar-bg-100) 10px);
}

ion-tab-button {
  --background: transparent;
  --color-selected: #ffffff;
  --color: #566488 --ripple-color: transparent;
}

div.deposit {
  border-radius: 41px;
  border: 1px solid var(--color-primary-border-light);
  background: var(--color-primary-btn-main);
  box-shadow: var(--color-primary-btn-main-shadow);
  margin-bottom: env(safe-area-inset-bottom);
}

div.drawer-backdrop {
  backdrop-filter: blur(5px);
  background: rgba(0, 0, 0, 0.1);
}

.tab-img {
  color: var(--tab-image-color);
}

.tab-img.on {
  animation: buttonAnimation 500ms;
  color: var(--tab-image-active-color);
}

.tab-img.tab-main,
.tab-main-text {
  color: var(--color-text-tab-main);
}

.redPoint {
  animation: breathing 3s infinite;
}

@keyframes buttonAnimation {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes breathing {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }

  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}
</style>
