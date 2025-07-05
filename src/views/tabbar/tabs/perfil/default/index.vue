<!-- 我的 -->
<template>
  <ion-page>
    <ion-content class="myMainRef">
      <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
        @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>
      <!-- 用户基本信息 -->
      <div class="card-bg-gradient user">
        <div class="top">
          <ion-thumbnail class="avatar" @click="avatarModelVisible = true">
            <img
              :src="user?.avatar || defaultAvatar || platformDefaultAvatar" />
          </ion-thumbnail>
          <div class="messsage">
            <div class="Id user-base-color">
              <span><span class="user-id">ID: </span> {{ user?.userId }}</span>
              <ion-icon src="/svg/my-copy.svg" @click="copy(user!.userId)"></ion-icon>
              <div class="level">
            <ion-img :src="vipIconPath" />
            <div>
              <span :style="{ color: vipTextColor }">{{ `V${vipLevelInfo.curVipLevel}` }}</span>
            </div>
          </div>
            </div>
            <div class="user-base-color"><span class="user-account">{{ $t('label.account') }}:</span> {{ user?.userName }}</div>
            <Balance></Balance>
          </div>
          <div class="email" @click="router.push('/notification')">
            <ion-icon class="email-icon" src="/svg/email.svg" />
            <p v-if="unReadNum > 0">{{ unReadNum }}</p>
          </div>
        </div>
        <ion-row class="bottom">
          <!-- 提现按钮 -->
          <ion-col size="6">
            <div class="left" @click="withdrawHandle">
              <ion-icon src="/svg/withdraw.svg" />
              <span class="enter-withdraw-text">{{ $t('main.withdraw') }}</span>
            </div>
          </ion-col>
          <!-- 充值按钮 -->
          <ion-col size="6">
            <div class="right" @click="rechargeHandle">
              <ion-icon src="/svg/recharge.svg" />
              <span class="enter-withdraw-text">{{ $t('main.entrar') }}</span>
            </div>
          </ion-col>
        </ion-row>
      </div>
      <!-- VIP信息 -->
      <div v-if="isShowVipInfo" class="vip card-bg-gradient relative"
        @click="vipHandle">
        <div class="top">
          <HotPoint :isShow="ifHasUnclaimedRewards" classNames="absolute right-[1rem] top-[1.375rem]"/>
          <div class="left">
            <ion-img :src="vipIconPath" />
            <div>
              <span :style="{ color: vipTextColor }">{{ `V${vipLevelInfo.curVipLevel}` }}</span>
            </div>
          </div>
          <div class="right">
            <div class="level">
              <p v-if="vipLevelInfo.nextVipLevel" class="user-base-color">
                <span>{{ $t('activity.vip42') }}</span>
                <span class="important-text">{{ `VIP${vipLevelInfo.nextVipLevel}` }}</span>
                <span v-if="vipLevelInfo.rechargeNeed != 0">{{ $t('activity.vip43', { recharge: formatMoneyToShow(vipLevelInfo.rechargeNeed) })}}</span>
                <span v-if="vipLevelInfo.betNeed != 0">{{ $t('activity.vip44', { bet: formatMoneyToShow(vipLevelInfo.betNeed) }) }}</span>
              </p>
              <p v-if="!vipLevelInfo.nextVipLevel">{{ $t('activity.vip22') }}</p>
              <ion-icon class="chevron-forward" :icon="chevronForward" />
            </div>
          </div>
        </div>
        <div class="bottom">
          <!-- VIP等级-晋级再充值 -->
          <div class="line" v-if="vipLevelInfo.rechargeRequirements != 0 && ifShowRecharge">
            <span class="left user-base-color">{{ $t('activity.vip6') }}</span>
            <span class="right">
              <div class="progress">
                <ion-progress-bar :value="vipLevelInfo.rechargeProgress"></ion-progress-bar>
                <div>
                  {{ `${formatMoneyToShow(vipLevelInfo.curRechargeAmount)}/${formatMoneyToShow(vipLevelInfo.rechargeRequirements)}` }}
                </div>
              </div>
            </span>
          </div>
          <!-- VIP等级-晋级再投注 -->
          <div class="line" v-if="vipLevelInfo.betRequirements != 0 && ifShowBet">
            <span class="left user-base-color">{{ $t('activity.vip7') }}</span>
            <span class="right">
              <div class="progress">
                <ion-progress-bar :value="vipLevelInfo.betProgress"></ion-progress-bar>
                <div>
                  {{ `${formatMoneyToShow(vipLevelInfo.curBetAmount)}/${formatMoneyToShow(vipLevelInfo.betRequirements)}`}}
                </div>
              </div>
            </span>
          </div>
        </div>
      </div>
      <!-- 功能导航 -->
      <div class="option card-bg-gradient">
        <ion-item v-for="item in navLinks" v-show="item.isShow" detail lines="none" :key="item.icon" @click="item.fun">
          <div slot="start" class="left">
            <ion-img :src="`/icons/perfil/${item.icon.endsWith('svg') ? `${item.icon}` : `${item.icon}.png`}`" />
            <span class="user-base-color">{{ item.name }}</span>
          </div>
          <div class="middle">
            <ion-label class="invite-text" v-if="item.type == 'invite'">
              {{ locale.includes('en') ? agencyConfig?.advertising_en : agencyConfig?.advertising_local }}
            </ion-label>
          </div>
          <HotPoint :isShow="item.type == 'invite' && isHasCommission" classNames="right-[1.625rem] top-0"/>
          <p v-if="item.type == 'suporte' && unReadNum > 0" class="unRead">{{ unReadNum }}</p>
        </ion-item>
      </div>
      <!-- 底部导航栏高度 -->
      <div :style="`height: calc(${tabHeight}px + 1.5rem)`" />
    </ion-content>
    <AvatarModal :visible="avatarModelVisible" @dismiss="avatarModelVisible = false" />
    <!-- 退出Alert弹窗 -->
    <IonAlert :alertOptions="alertOptions" @sureClick="sureLogout" v-if="isOpen" @cancelClick="isOpen = false"
    @maskClick="isOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { copy } from '@/hooks/Copy';
import { useRouter } from 'vue-router';
import { getTheme } from '@/theme/hooks'
import { usePerfilLogic } from '@/views/tabbar/tabs/perfil/hooks/perfilLogic'
import { chevronForward, syncSharp } from 'ionicons/icons';
import { formatMoneyToShow } from '@/utils/custom';
import { IonPage, IonContent, IonItem, IonLabel, IonThumbnail, IonImg, IonRow, IonCol, IonProgressBar, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/vue';
import AvatarModal from './components/AvatarModal.vue';
import IonAlert from '@/components/IonAlert/index.vue'
import HotPoint from '@/components/HotPoint/index.vue';
import Balance from './components/Balance.vue'

const router = useRouter();           // 路由实例

// 当前皮肤是 defaut 绿色皮肤
const isGreenDefaut = computed(() => getTheme().theme == 'green-default');

const {
  myMainRef,
  user,
  balance,
  loaded,
  completed,
  isShowVipInfo,
  avatarModelVisible,
  merchantCy,
  locale,
  agencyConfig,
  defaultAvatar,
  showLangChange,
  unReadNum,
  isHasCommission,
  isOpen,
  alertOptions,
  navLinks,
  vipLevelInfo,
  onGetUserVip,
  onGetUserAssets,
  refreshBalance,
  sureLogout,
  handleRefresh,
  fixedNumber,
  rechargeHandle,
  withdrawHandle,
  vipHandle,
  vipIconPath,
  vipTextColor,
  ifShowRecharge,
  ifShowBet,
  tabHeight,
  ifHasUnclaimedRewards,
  platformDefaultAvatar
} = usePerfilLogic();

</script>

<style scoped lang="less">
@import '@/views/tabbar/tabs/perfil/default/styles/base-index.less' ;
@import "@/views/tabbar/tabs/perfil/default/styles/theme-style.less";
#tabbar-tabs-perfil-default-index.style();

.blue-default {
  #tabbar-tabs-perfil-default-index.style(
    @perfil15: #fff;
  );
}
.green-default {
  #tabbar-tabs-perfil-default-index.style(
    --theme-color-gradient-100,
    --theme-color-gradient-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-bg-100,
    --color-text-gray-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-white-100,
    --accent-color-yellow,
    --color-text-white-100
  );
}
.amber-purple {
  #tabbar-tabs-perfil-default-index.style(
    --theme-color-gradient-300,
    --theme-color-gradient-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-bg-100,
    --color-text-gray-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-white-100,
    --accent-color-yellow,
    --color-text-white-100
  );
}

.forest-green {
  #tabbar-tabs-perfil-default-index.style(
    --theme-color-gradient-100,
    --theme-color-gradient-200,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-bg-100,
    --color-text-gray-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-white-100,
    --accent-color-yellow,
    --color-text-white-100,
    @perfil15: var(--color-text-gray-200),
  )
}

.auroral-yellow {
  #tabbar-tabs-perfil-default-index.style(
    --color-bg-100,
    --text-color1,
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-text-gray-200,
    --color-bg-100,
    --color-text-gray-100,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-white-100,
    --accent-color-yellow-1,
    --color-text-white-100,
    var(--color-text-gray-200),
    --color-text-black-100
  )
}
</style>
