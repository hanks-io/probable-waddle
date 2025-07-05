<template>
  <div class="game-classification">
    <div class="head">
      <ion-img class="logo" :src="logo"></ion-img>
      <ion-label class="title">{{ $t('subtitle.welcome', { name: hostName }) }}</ion-label>
    </div>
    <!-- 底部商户信息 -->
    <div class="intro" @mousedown="startPress"
      @mouseup="endPress" @mouseleave="endPress" @touchstart.passive="startPress" @touchend="endPress"
      @touchcancel="endPress" @touchmove.passive="endPress">
      <p>©2025 {{ merchanName }} {{ $t('subtitle.rightsReserved') }}
        <span class="text">{{ $t('viewsTabbar.footerBar1') }}</span>
      </p>
      <!-- 版本号 -->
      <div class="flex justify-around" v-if="showMark">
        <span class="version">{{ browser + getBuildVersion() }}</span>
        <span class="version">{{ origin }}</span>
        <span class="version">{{ webPushRegId }}</span>
      </div>

    </div>
    <section class="row">
      <div class="col">
        <ion-label class="col-title">{{ $t('sort.gameType') }}</ion-label>
        <ul class="list">
          <li v-for="item in sortGame" @click="tabClick(item)" :key="item.label" :class="[activeTab == item.label ? 'active' : '', 'list-item']">
            <ion-label class="label">{{ $t(`sort.${item.label}`) }}</ion-label>
          </li>
        </ul>
      </div>
      <div class="col">
        <ion-label class="col-title">{{ $t('sort.gameBrand') }}</ion-label>
        <ul class="list">
          <li v-for="(item, i) in viewGamePlatform" class="list-item" :key="item + i">
            <ion-label class="label">{{ item }}</ion-label>
          </li>
        </ul>
      </div>
    </section>
    <section class="row">
      <div class="col">
        <ion-label class="col-title">{{ $t('sort.SPORTS') }}</ion-label>
        <ul class="list">
          <li class="list-item">
            <ion-label class="label">M9 {{ $t('sort.SPORTS') }}</ion-label>
          </li>
          <li class="list-item">
            <ion-label class="label">SABA {{ $t('sort.SPORTS') }}</ion-label>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
  import { IonImg, IonLabel } from '@ionic/vue';
  import { useTenantStore } from '@/store/tenant';
  import { useGameStore } from '@/store/game';
  import { getBuildVersion } from '@/utils/app';
  import { copy } from '@/hooks/Copy';

  const appStore = useAppStore(); // app信息
  const gameStore = useGameStore(); // 导入游戏store
  const tenantStore = useTenantStore(); // 租户信息
  const systemStore = useSystemStore(); // 系统信息

  const origin = location.origin;
  const showMark = ref(false); // 是否显示标记
  const pressTimer = ref<NodeJS.Timeout>(); // 按压定时器
  const browser = computed(() => systemStore.browser); // 浏览器信息
  const merchanName = computed(() => tenantStore.tenantInfo?.name); // 商户名
  const webPushRegId = ref(''); // web推送注册id

  // 游戏平台列表
  const viewGamePlatform = ref<string[]>([]);
  // 选择中的游戏类型
  const activeTab = ref('');
  // 游戏分类
  const sortGame = computed(() => {
    // 从厂商列表中，获取游戏类型
    const games = gameStore.gamePlatformList.reduce((acc, cur) => {
      cur.gameTypes.forEach((item: { gameType: string }) => {
        if (acc[item.gameType]) {
          acc[item.gameType].push(cur.name)
        } else {
          acc[item.gameType] = [cur.name]
        }
      });
      return acc;
    }, {});
    // 将游戏类型转换为数组
    const sortList = Object.entries(games).map(([key, value]) => ({
      label: key,
      list: value as string[],
    }))
    if (sortList.length) {
      const { label, list } = sortList[0];
      activeTab.value = label;
      viewGamePlatform.value = list;
      const index = sortList.findIndex((item) => item.label === 'SPORTS')
      if (index !== -1) {
        sortList.splice(index, 1)
      }
    }
 
    return sortList;
  });
  // logo
  const logo = computed(() => tenantStore.tenantInfo?.logo);
  // 切换游戏类型
  const tabClick = ({ label, list }: { label: string; list: string[] }) => {
    activeTab.value = label;
    viewGamePlatform.value = list;
  }

  /**
   * @description 开始按压
   */
   function startPress() {
    pressTimer.value = setTimeout(() => {
      showMark.value = true;
      webPushRegId.value = appStore.getWebPushRegId();
      copy(webPushRegId.value);
      if (!useSystemStore()?.isIOS) {
        copy(webPushRegId.value);
      }
    }, 2000);

    if (useSystemStore()?.isIOS) {
      copy(webPushRegId.value);
    }
  }
  /**
   * @description 结束按压
   */
  function endPress() {
    if (pressTimer.value) {
      clearTimeout(pressTimer.value);
      pressTimer.value = undefined;
    }
    showMark.value = false;
  }

  const hostName = window.location.hostname;
</script>
<style lang="less" scoped>
  .game-classification {
    margin-block: 2.8125rem;
    margin-inline: .9375rem;
    .head {
      display: flex;
      flex-direction: column;
      align-items: center;
      .logo {
        width: 6.9375rem;
        height: 1.625rem;
      }
      .title {
        margin-top: 0.4375rem;
        font-size: 0.75rem;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.4);
      }
    }
    .intro {
      font-size: 0.6875rem;
      line-height: 1.5;
      margin-bottom: 2.8125rem;
      text-align: center;
      color: #616d93;
      .text {
        font-weight: 800;
        font-size: 0.875rem;
        color: #616d93;
      }

      .version {
        margin-left: 0.5rem;
        font-size: 0.625rem;
        text-align: center;
        color: #616d93;
      }
    }

    .row {
      display: flex;
      margin-top: 1.25rem;
      padding-inline-start: 3.125rem;
      padding-inline-end: 1.5625rem;
      .col {
        flex: 0 0 50%;
        .col-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
        }
        .list {
          background: transparent;
          margin-top: 1rem;
          .list-item,
          .label {
            --background: transparent;
          }
          .list-item {
            color: #899FBE;
            font-size: 0.875rem;
            font-weight: 400;
            line-height: 1.8;
          }
          .active {
            color: #fff;
          }
        }
      }
    }
  }

</style>
