<!-- 我的 -->
<template>
  <ion-page>
    <ion-content class="text-xs">
      <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
        @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>
      <!-- 用户基本信息 -->
      <div ref="userBaseInfo" class="z-[101] user-base-info w-full flex fixed">
        <!-- 左侧头像 手机号 ID -->
        <div class="user-base-left mt-[2.03125rem] ml-[1.1475rem] flexBox flex-col">
          <ion-thumbnail class="avatar-info mb-[0.75rem]" @click="avatarModelVisible = true">
            <img :src="user?.avatar || defaultAvatar || platformDefaultAvatar" />
          </ion-thumbnail>
          <div class="user-phone middle-text-white font-weight-medium">{{ user?.phoneNumber }}</div>
          <div class="user-id small-text-white flexBox">
            ID: {{ user?.userId }}
            <ion-icon class="copy-icon ml-[0.359375rem] text-[0.875rem]" :src="getImageUrl('img/common/copy.svg')" @click="copy(user!.userId)" />
          </div>
        </div>
        <!-- 右侧余额 累计领取优惠 充值 提现 -->
        <div class="user-base-right ml-[1.25rem] mt-[1.3125rem]">
          <!-- 余额 累计领取优惠 -->
          <div class="py-[0.75rem] w-[15.375rem] flex justify-center items-stretch">
            <div class="base-balance flex-1 mr-[0.6875rem] pr-[0.25rem] flex flex-col justify-between">
              <div class="title-color">{{ $t('label.balance') }}</div>
              <Balance></Balance>
            </div>
            <div class="base-bonus flex-[40%]">
              <div class="title-color">{{ $t('viewsUser.bonus') }}</div>
              <div class="height-text-white money-color">{{ formatMoneyToShow(assetsChangeInfo.totalRewardAmountChange) }}</div>
            </div>
          </div>
          <!-- 充值 提现 -->
          <div class="flexBox mt-[0.3125rem] pr-[0.25rem]">
            <div class="entrar-btn middle-text-white flex-center mr-[0.5rem]" @click="rechargeHandle">
              <ion-icon class="w-[1.5rem] h-[1.5rem] mr-[0.125rem]" src="/second/svg/user/my-recharge.svg"></ion-icon>
              {{ $t('main.entrar') }}
            </div>
            <div class="withdraw-btn middle-text-white flex-center" @click="withdrawHandle">
              <ion-icon class="w-[1.5rem] h-[1.5rem] mr-[0.125rem]" src="/second/svg/user/my-withdraw.svg"></ion-icon>
              {{ $t('main.withdraw') }}
            </div>
          </div>
        </div>
      </div>
      <section ref="sectionRef" class="px-[0.75rem] pb-[1.875rem] user-tab-info" :class="!isShowVipInfo ? 'pt-[1rem]' : ''">
        <!-- VIP信息 -->
        <div v-if="isShowVipInfo" class="my-vip w-full mb-[1rem] relative">
          <!-- 右侧去VIP详情按钮 -->
          <div class="absolute right-[0.125rem] top-0 vip-detail flex-evenly" @click="vipHandle">
            {{ $t('viewsTabbar.goVipDetail') }}
            <ion-icon class="to-icon" :icon="chevronForward" />
            <HotPoint :isShow="ifHasUnclaimedRewards" classNames="absolute right-[1.625rem] top-[0.5625rem]"/>
          </div>
          <!-- VIP信息 -->
          <div class="vip-info">
            <div class="flexBox">
              <ion-img class="w-[2.375rem] h-[2.375rem] z-30" :src="vipIconPath" />
              <div class="current-vip-level flex-center relative">
                <ion-icon class="w-[4.5rem] h-[1.25rem]" :icon="vipTextBgColor" />
                <div class="absolute left-0 top-0 w-[4.5rem] h-[1.25rem] flex-center text-[--text-color-white-100]">
                  VIP<strong class="ml-[0.125rem]">{{ vipLevelInfo.curVipLevel }}</strong>
                </div>
              </div>
              <div class="ml-[0.75rem] small-text-white vip-text-40 font-weight-bold">{{ $t('viewsTabbar.currentLevel') }}</div>
            </div>
            <!-- 晋级进度条 -->
            <div class="mt-[1.375rem] flexBox">
              <div class="relative">
                <ion-progress-bar class="progress-bar" :value="vipLevelInfo.firstLevelProgress"></ion-progress-bar>
                <div :style="{ left: `${(vipLevelInfo.firstLevelProgress * 100)}%` }" class="level-point" v-if="![0,1,'0','1'].includes(vipLevelInfo.firstLevelProgress)">
                  <ion-icon class="w-[2.25rem] h-[2.25rem]" src="/first/svg/progress-point.svg"></ion-icon>
                </div>
              </div>
              <!-- 下一级 图标信息 -->
              <div class="flexBox ml-[0.375rem]">
                <template v-if="vipLevelInfo.nextVipLevel">
                  <ion-img class="w-[1.5rem] h-[1.5rem] z-30" :src="nextVipIconPath" />
                  <div class="next-current-vip-level flex-center relative">
                    <ion-icon class="w-[3.125rem] h-[1.105rem]" :icon="nextVipTextBgColor"></ion-icon>
                    <div class="absolute top-0 left-0 flex-center w-[3.125rem] h-[1.105rem]">
                      VIP<strong class="ml-[0.125rem]">{{ vipLevelInfo.curVipLevel + 1 }}</strong>
                    </div>
                  </div>
                </template>
                <div class="font-weight-bold max-level vip-info-max" v-else>{{ $t('viewsUser.maximumLevel') }}</div>
              </div>
            </div>
            <!-- 投注/充值信息 -->
            <div class="small-text-white mt-[0.375rem]" :class="{ 'condition-info': !vipLevelInfo.nextVipLevel }">
              <div class="font-weight-bold vip-text-40 mb-[0.25rem]">{{ $t('viewsTabbar.levelCondition') }}</div>
              <div class="need-recharge flexBox" v-if="vipLevelInfo.rechargeRequirements != 0 && ifShowRecharge">
                <p></p> {{ $t('viewsTabbar.needRecharge') }}：
                <strong class="current-recharge">{{ formatMoneyToShow(vipLevelInfo.curRechargeAmount) }}</strong>
                <span class="vip-info-max">{{ `(${ formatMoneyToShow(vipLevelInfo.curRechargeAmount) }/${ formatMoneyToShow(vipLevelInfo.rechargeRequirements) })` }}</span>
              </div>
              <div class="need-bets flexBox" v-if="vipLevelInfo.betRequirements != 0 && ifShowBet">
                <p></p> {{ $t('viewsTabbar.needBets') }}：
                <strong class="current-recharge">{{ formatMoneyToShow(vipLevelInfo.curBetAmount) }}</strong>
                <span class="vip-info-max">{{ `(${ formatMoneyToShow(vipLevelInfo.curBetAmount) }/${ formatMoneyToShow(vipLevelInfo.betRequirements) })` }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 客服导航 -->
        <div class="w-full pl-4 card-bg-gradient mb-[1rem]">
          <ion-item  v-show="suportNavLinks.isShow" class="relative" detail lines="none" @click="suportNavLinks.fun">
            <div slot="start" class="flex items-center">
              <ion-icon class="cust-icon text-[1.5rem] font-weight-bold mr-[0.375rem]" :src="`/first/svg/perfil/${`${suportNavLinks.icon}.svg`}`" />
              <span class="navigation-item">{{ suportNavLinks.name }}</span>
            </div>
            <p v-if="unReadNum > 0" class="flex-center red-points absolute right-[1.875rem] rounded-full">{{ unReadNum }}</p>
          </ion-item>
        </div>
        <!-- 功能导航 -->
        <div class="w-full pl-4 card-bg-gradient mb-[1rem]">
          <ion-item v-for="item in firstNavLinks" v-show="item.isShow" detail lines="none" :key="item.icon" @click="item.fun">
            <div slot="start" class="flex items-center">
              <ion-icon class="card-icon-color w-[1.5rem] h-[1.5rem] font-weight-bold mr-2.5" :src="`/first/svg/perfil/${`${item.icon}.svg`}`" />
              <span class="navigation-item">{{ item.name }}</span>
            </div>
            <div class="w-full flex justify-end" v-if="item.type == 'invite'">
              <ion-label class="flex-[2.5] text-right max-w-52 invite-item">
                {{ locale.includes('en') ? agencyConfig?.advertising_en : agencyConfig?.advertising_local }}
              </ion-label>
            </div>
            <div class="w-full flex items-center justify-end small-text-white current-language" v-if="item.type == 'language'">
              <flag :iso="getCurrency(currentLanguage)" class="rounded-xl text-[16px] mr-2" />
              {{ getLanguageName(currentLanguage,currentLanguage) }}
            </div>
            <HotPoint :isShow="item.type == 'invite' && isHasCommission" classNames="right-[1.625rem] top-0"/>
          </ion-item>
        </div>
      </section>
      <!-- 底部导航栏高度 -->
      <div :style="`height: calc(${tabHeight}px + 1.5rem)`" />
    </ion-content>
    <AvatarModal :visible="avatarModelVisible" @dismiss="avatarModelVisible = false" />
    <!-- 退出Alert弹窗 -->
    <IonAlert :alertOptions="alertOptions" @sureClick="sureLogout" v-if="isOpen" @cancelClick="isOpen = false" @maskClick="isOpen = false" />
  </ion-page>
</template>

<script setup lang="ts">
import i18n from '@/i18n';
import { copy } from '@/hooks/Copy';
import { getCurrency } from '@/i18n';
import { useRouter, useRoute } from 'vue-router';
import { getTheme } from '@/theme/hooks'
import { useVipStore } from '@/store/vip';
import { useAppStore } from "@/store/app";
import { getLanguageName } from '@/utils/custom'
import { computed, reactive, ref, onMounted } from "vue";
import { chevronForward, syncSharp } from 'ionicons/icons';
import { formatMoneyToShow } from '@/utils/custom';
import { usePerfilLogic } from '@/views/tabbar/tabs/perfil/hooks/perfilLogic'
import { IonPage, IonContent, IonItem, IonLabel, IonThumbnail, IonImg, IonRow, IonCol, IonProgressBar, IonIcon, IonRefresher, IonRefresherContent } from '@ionic/vue';
import AvatarModal from './components/AvatarModal.vue';
import IonAlert from '@/components/IonAlert/index.vue'
import HotPoint from '@/components/HotPoint/index.vue';
import Balance from './components/Balance.vue'
import { getImageUrl } from "@/utils";

const { t } = i18n.global
const router = useRouter();           // 路由实例
const route = useRoute();             // 当前路由
const appStore = useAppStore();       // app信息
const vipStore = useVipStore();       // vip store实例

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
  vipLevelInfo,
  assetsChangeInfo,
  onGetUserVip,
  onGetUserAssets,
  refreshBalance,
  sureLogout,
  handleRefresh,
  fixedNumber,
  rechargeHandle,
  withdrawHandle,
  vipHandle,
  // ------first 皮肤-------
  goRedeem,
  vipIconPath,
  ifShowRecharge,
  ifShowBet,
  tabHeight,
  ifHasUnclaimedRewards,
  agentConfig,
  platformDefaultAvatar
} = usePerfilLogic();

const userBaseInfo = ref()      // 顶部基本信息DOM
const sectionRef = ref()        // 内容区域DOM

// 当前语言
const currentLanguage = computed(() => i18n.global.locale.value);
// 客服
const suportNavLinks = computed(() => {
  return { type: 'suporte', isShow: true, name: `${t('main.suporte')}`, icon: 'customer', fun: () => { router.push({ path: '/notification' }) }};
})
// 报表，邀请，兑换码，安全中心，语言切换
const firstNavLinks = computed(() => {
  return [
    { type: 'report', isShow: true, name: `${t('label.report')}`, icon: 'detail', fun: () => { router.push({ path: '/user/report' }) } },
    { type: 'invite',  isShow: true, name: `${t('label.invite')}`, icon: 'convidar', fun: () => {   
         const path = agentConfig.value.agencyMode ==='unlimitedLevel' ? '/spread' : '/mlmAgent'
        router.push({ path }) 
   } },
    { type: 'resgate',  isShow: true, name: `${t('activity.redeem')}`, icon: 'resgate', fun: goRedeem },
    { type: 'securityCenter', isShow: true, name: `${t('label.securityCenter')}`, icon: 'security', fun: () => { router.push({ path: '/security' }) } },
    { type: 'language', isShow: showLangChange.value, name: `${t('label.language')}`, icon: 'language', fun: () => { appStore.setLanguageModalVisible(true) } },
    { type: 'logout', isShow: true, name: `${t('label.logout')}`, icon: 'logout', fun: () => { isOpen.value = true } }
  ]
})

// 我的 VIP背景图片/详情背景图路径/文本背景色
const myBgPath = computed(() => `url(${vipStore.getFirstVipBg(vipLevelInfo.curVipLevel,'myVipBg')})`);
const myDetailBgPath = computed(() => `url(${vipStore.getFirstVipBg(vipLevelInfo.curVipLevel,'myVipDetailBg')})`);
const vipTextBgColor = computed(() => vipStore.getFirstVipBg(vipLevelInfo.curVipLevel,'myVipTextBg'));
// VIP等级图标/文本背景色 下一级
const nextVipIconPath = computed(() => vipStore.getVipIconPath(vipLevelInfo.curVipLevel + 1));
const nextVipTextBgColor = computed(() => vipStore.getFirstVipBg(vipLevelInfo.curVipLevel + 1,'myVipTextBg'));

// 生命周期-页面加载后 动态计算marginTop值
onMounted(() => {
  setTimeout(() => {
    if (userBaseInfo.value && sectionRef.value) {
      const baseInfoHeight = userBaseInfo.value.offsetHeight;
      sectionRef.value.style.marginTop = `${baseInfoHeight}px`
    }
  },500)
})

</script>

<style scoped lang="less">
.user-base-info {
  min-height: 9.81rem;
  background-color: var(--color-bg-300);
  background-image: url('/second/user/second-my-bg.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  .avatar-info {
    --size: 3.25rem;
    --border-radius: 50%;
  }
  .user-phone {
    color: #BDB8E1;
  }
  .user-id {
    color: #686299;
    .copy-icon {
      color: #BDB8E1;
    }
  }
  .base-balance {
    border-right: 1px solid var(--line-color);
  }
  .title-color {
    color: #BDB8E1;
  }
  .money-color {
    color: var(--balance-money-text-color);
  }
  .withdraw-btn,
  .entrar-btn {
    flex: 1;
    border-radius: var(--rounded-large);
    position: relative;
    padding: .5313rem 0 .5938rem 0;
    background: linear-gradient(316.85deg, #7041F3 2.45%, #F5C84C 105.89%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: var(--rounded-large);
      padding: 1px; /* Adjust this value to control the border width */
      background: linear-gradient(316.85deg, #7041F3 2.45%, #F5C84C 105.89%);
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
    }
  }
}

ion-icon.cust-icon {
  color: #7041F3;
}

ion-content {
  --background: var(--color-bg-300);
}

.card-bg-gradient {
  border-radius: var(--rounded-middle);
  background: var(--my-card-bg-gradient);
}

.navigation-item {
  font-size: var(--font-size-14);
  color: #BDB8E1;
  line-height: 1.5rem;
}

.invite-item {
  font-size: 0.625rem;
  color: #686299;
}

.red-points {
  min-width: 2rem;
  font-size: .75rem;
  line-height: 1.125rem;
  color: var(--text-color-white-100);
  background: var(--color-danger);
}

.my-vip {
  height: 11.875rem;
  background: v-bind(myBgPath) no-repeat;
  background-position: bottom 0 left 0;
  background-size: 100% 11.25rem;
  padding: 1.6rem .8125rem .8125rem;
  .vip-detail {
    width: 7.0938rem;
    height: 2.875rem;
    padding: 0 .625rem;
    background: v-bind(myDetailBgPath) no-repeat;
    background-size: 100% 100%;
    .to-icon {
      font-size: 1.0938rem;
      color: var(--vip-info-text-color-40);
    }
  }
  .current-vip-level {
    font-size: var(--font-size-12);
    margin-left: -1.125rem;
  }
}

.level-point {
  position: absolute;
  transform: translate(-50%,-50%)
}

.need-recharge,
.need-bets {
  color: var(--vip-info-tips-text-color);
  p {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--vip-info-tips-text-color);
    margin-right: 0.625rem;
  }
}

.current-recharge {
  color: var(--color-currency);
  margin-right: .375rem;
}

.next-current-vip-level {
  font-size: var(--font-size-10);
  color: var(--text-color-white-100);
  margin-left: -0.6875rem;
}

.max-level {
  font-size: var(--font-size-12);
  line-height: 1.125rem;
}

.condition-info {
  margin-top: 0.9rem;
}

ion-progress-bar {
  --background: var(--progress-base-bg);
  --progress-background: var(--progress-bg);
}

.progress-bar {
  width: 17.1875rem;
  height: .25rem;
  border-radius: 1rem;
}

ion-item {
  --min-height: 0;
  --padding-end: 0;
  --padding-top: .75rem;
  --padding-bottom: .75rem;
  --padding-start: 0;
  --background: transparent;
}

ion-item::part(detail-icon) {
  font-size: 0.875rem;
  color: var(--my-card-detail-color);
}

.current-language {
  color: var(--text-color-white-100);
}

.vip-text-40 {
  color: var(--vip-info-text-color-40);
}

.vip-info-max {
  color: var(--vip-max-text-color);
  font-size: var(--ep-font-size-xs, .625rem);
}

.card-icon-color {
  color: #686299;
}
</style>
