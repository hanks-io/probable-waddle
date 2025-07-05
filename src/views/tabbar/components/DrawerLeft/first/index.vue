<!-- 首页抽屉 -->
<template>
  <ion-menu type="push" menu-id="main-menu" content-id="main-content" :swipe-gesture="false" @ionWillClose="menuIonDidClose" @ionWillOpen="menuIonDidOpen">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="flex items-center">
          <ion-menu-toggle><ion-icon class="close px-3.5 text-xs" src="/first/svg/close.svg"/></ion-menu-toggle>
          <img class="h-[28px]" slot="secondary" :src="appLogo" />
        </div>
      </ion-toolbar>
    </ion-header>
    <!-- 抽屉内容 -->
    <ion-content class="relative">
      <!-- 分类导航 -->
      <div class="card rounded-md">
        <ion-menu-toggle class="flex items-center py-2.5 px-3.5" mode="md" v-for="item in sortAll" :key="item"
          :class="tabValue == item ? 'on' : ''" @click="menuTabChange(item)">
          <ion-icon class="sort-icon text-2xl" :src="`/first/svg/sort/${item}.svg`" />
          <ion-label class="card-title text-sm ml-2.5">{{ $t(`sort.${item}`) }}</ion-label>
        </ion-menu-toggle>
      </div>
      <!-- 活动导航 -->
      <div class="mb-44">
        <ion-menu-toggle v-for="item in activityList" :key="item.id" @click="menuActivityHandle(item)">
          <div class="flex flex-col mt-3 items-center h-[4.875rem] rounded-[.625rem] bg-no-repeat text-center"
            :style="gameCardBgStyle(item.image)">
          </div>
        </ion-menu-toggle>
      </div>
      <ion-footer class="fixed bottom-0 left-0 px-3">
        <!-- 充值提现 -->
        <div class="flex justify-between mt-3 mb-[2.125rem]">
          <ion-menu-toggle class="assets flex flex-col items-center justify-center h-[4.125rem] w-[7.125rem] rounded-md" @click="depositHandle">
            <ion-icon class="text-[1.375rem]" :src="`/first/svg/tabbar/deposit_on.svg`"/>
            <ion-label class="text-sm font-medium">{{ $t('main.entrar') }}</ion-label>
          </ion-menu-toggle>
          <ion-menu-toggle class="assets flex flex-col items-center justify-center h-[4.125rem] w-[7.125rem] rounded-md" @click="withdrawHandle">
            <ion-icon class="text-[1.375rem]" :src="`/first/svg/tabbar/withdraw_on.svg`"/>
            <ion-label class="text-sm font-medium">{{ $t('main.withdraw') }}</ion-label>
          </ion-menu-toggle>
        </div>
        <!-- 联系客服 -->
        <ion-menu-toggle @click="goToCustomer" class="support-card rounded-md h-[3.125rem] px-4 mb-4 flex items-center relative">
          <div class="support -mt-5 flex items-center justify-center rounded-full h-[2.375rem] w-[2.375rem]"><ion-icon class="support-icon h-7 w-7" src="/first/svg/support.svg"/></div>
          <div class="support-text flex-1 text-[.75rem] ml-2.5">{{ $t('main.suporte') }}</div>
          <HotPoint :isShow="showUnRead" size="0.375rem" classNames="right-[0.625rem]"/>
        </ion-menu-toggle>
      </ion-footer>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonMenu, IonMenuToggle, IonIcon, IonHeader, IonContent, IonLabel, IonToolbar, IonFooter } from '@ionic/vue';
import HotPoint from '@/components/HotPoint/index.vue';
import useDrawerLeftLogic from '../logic';

const {
  appLogo,
  tabValue,
  showUnRead,
  sortAll,
  activityList,
  goToCustomer,
  gameCardBgStyle,
  menuIonDidClose,
  menuIonDidOpen,
  menuTabChange,
  menuActivityHandle,
  depositHandle,
  withdrawHandle,
 } = useDrawerLeftLogic();
</script>

<style scoped>
ion-menu {
  /* 抽屉菜单样式 */
  --max-width: 16.5rem;
  --width: 16.5rem;
  background: transparent;
}
ion-icon.close {
  color: var(--menu-close-color);
}
ion-menu ion-content {
  --padding-top: .75rem;
  --padding-start: .75rem;
  --padding-end: .75rem;
}

ion-menu-button {
  /* 菜单按钮样式 */
  --padding-start: 5px;
  --padding-end: 5px;
  width: auto;
}

ion-menu-button::part(native) {
  /* 菜单按钮图标样式 */
  font-size: 24px;
}

ion-menu-toggle.on {
  animation: fadeToTransparent 200ms linear forwards;
}

ion-menu-toggle.records {
  background: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
}

ion-menu ion-header ion-toolbar {
  --background: var(--menu-bar-bg);
}

div.card {
  background: var(--menu-card-bg);
}

ion-menu-toggle.card {
  box-shadow: var(--color-bar-bg-shadow);
}
ion-menu-toggle.support-card {
  background: var(--menu-support-card-bg);
}
ion-menu-toggle div.support  {
  background: var(--color-button-bg-support-bg);
}

ion-menu-toggle div.support-text {
  color: var(--support-text-color);
}
ion-icon.sort-icon {
  color: var(--menu-card-label-icon);
}

ion-menu-toggle.assets {
  background: var(--color-btn-bg-toggle);
  box-shadow: 0px 4px 8px 0px var(--color-bar-bg-shadow);
}

ion-menu-toggle.assets ion-icon {
  color: var(--color-svg-icon-primary);
}
.card-title {
  color: var(--menu-card-label-title);
}

ion-footer {
  background: var(--menu-footer-bg);
  box-shadow: none;
}

@keyframes fadeToTransparent {
  from {
    background: #343947;
  }

  to {
    background: rgba(255, 0, 0, 0);
  }
}
</style>
