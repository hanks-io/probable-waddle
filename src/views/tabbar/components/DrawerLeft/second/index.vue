<!-- 首页抽屉 -->
<template>
  <ion-menu type="push" menu-id="main-menu" content-id="main-content" :swipe-gesture="false"
    @ionWillClose="menuIonDidClose" @ionWillOpen="menuIonDidOpen">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="flex items-center">
          <ion-menu-toggle>
            <ion-icon class="close px-3.5 text-xs" src="/first/svg/close.svg" />
          </ion-menu-toggle>
          <img class="h-[28px]" slot="secondary" :src="appLogo" />
        </div>
      </ion-toolbar>
    </ion-header>
    <!-- 抽屉内容 -->
    <ion-content class="relative">
      <!-- 分类导航 -->
      <div class="card">
        <ion-menu-toggle class="flex items-center py-2.5 px-3.5" mode="md" v-for="item in sortAll" :key="item"
          :class="tabValue == item ? 'on' : ''" @click="menuTabChange(item)">
          <ion-icon class="sort-icon" :src="`/first/svg/sort/${item}.svg`" />
          <ion-label class="card-title ml-2">{{ $t(`sort.${item}`) }}</ion-label>
        </ion-menu-toggle>
      </div>
      <!-- 联系客服 -->
      <ion-menu-toggle @click="goToCustomer"
        class="support-card rounded-md py-2 pl-2 pr-[0.625rem] my-4 flex items-center relative">
        <div class="support flex items-center justify-center h-[2rem] w-[2rem]">
          <ion-icon class="support-icon h-6 w-6" src="/svg/serivce.svg" />
        </div>
        <div class="support-text flex-1 ml-4">{{ $t('main.suporte') }}</div>
        <HotPoint :isShow="showUnRead" size="0.375rem" classNames="right-[0.625rem]" />
      </ion-menu-toggle>
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
          <ion-menu-toggle class="assets flex flex-col items-center justify-center w-[7.125rem]"
            @click="depositHandle">
            <ion-icon class="text-[1.5rem]" :src="`/svg/pig-1.svg`" />
            <ion-label>{{ $t('main.entrar') }}</ion-label>
          </ion-menu-toggle>
          <ion-menu-toggle class="assets flex flex-col items-center justify-center w-[7.125rem]"
            @click="withdrawHandle">
            <ion-icon class="text-[1.875rem]" :src="`/svg/wallet.svg`" />
            <ion-label>{{ $t('main.withdraw') }}</ion-label>
          </ion-menu-toggle>
        </div>

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

<style scoped lang="less">
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
  display: flex;
  flex-flow: wrap;
  gap: .5rem;

  ion-menu-toggle {
    flex: 0.5;
    font-size: 0.75rem;
    line-height: 1.5;
    font-weight: 600;
    border-radius: 0.625rem;
    background: var(--menu-card-bg);
    box-shadow: var(--color-bar-bg-shadow);

    &:last-child:nth-child(2n-1) {
      flex: 0 0 48.7%;
    }
  }

  .sort-icon {
    font-size: 1.5rem;
    color: var(--menu-card-label-icon);
  }

  .card-title {
    color: var(--menu-card-label-title);
  }
}

ion-menu-toggle.card {
  box-shadow: var(--color-bar-bg-shadow);
}

ion-menu-toggle.support-card {
  background: var(--menu-support-card-bg);
  .support {
    border-radius: 0.5rem;
    background: var(--color-button-bg-support-bg);
    box-shadow: 0px 4px 6.8px 0px rgba(0, 0, 0, 0.25), 0px -2px 4px 0px rgba(0, 0, 0, 0.11) inset;
  }
  .support-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--support-text-color);
  }
}

ion-menu-toggle.assets {
  overflow: hidden;
  position: relative;
  border-radius: 0.625rem;
  background: var(--color-btn-bg-toggle);
  border: 1px solid var(--line-color);
  padding: 0.4375rem 0.9375rem 0.5rem 0.875rem;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40%;
    background-image: linear-gradient(to bottom, rgba(213, 192, 253, 0), rgba(213, 192, 253, 0.1));
  }
  ion-icon {
    color: var(--color-svg-icon-primary);
  }
  ion-label {
    color: var(--color-svg-icon-primary);
    font-size: 0.875rem;
    line-height: 1.5;
    font-weight: 600;
  }
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
