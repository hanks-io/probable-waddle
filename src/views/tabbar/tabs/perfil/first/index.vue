<!-- 我的 -->
<template>
  <ion-page>
  <ion-content class="text-xs">
    <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
      @ionRefresh="handleRefresh($event)">
      <ion-refresher-content />
    </ion-refresher>
      <!-- 用户基本信息 -->
      <div ref="userBaseInfo" class="z-[101] user-base-info w-full px-[0.75rem] pt-[0.6875rem] pb-[1rem] fixed">
        <!-- 头像 ID 手机号 VIP等级 -->
        <div class="user-info flexBox">
          <ion-thumbnail class="avatar-info" @click="avatarModelVisible = true">
            <img :src="user?.avatar || defaultAvatar || platformDefaultAvatar" />
          </ion-thumbnail>
          <div class="ml-[1rem]">
            <div class="middle-text-white font-weight-medium flexBox">
              {{ user?.phoneNumber }}
              <div class="ml-[0.4375rem] flexBox">
                <ion-img class="w-[1.5rem] h-[1.5rem] z-30" :src="vipIconPath" />
                <div class="relative next-current-vip-level flex-center">
                  <ion-icon class="w-[3.125rem] h-[1.105rem]" :icon="vipTextBgColor"></ion-icon>
                  <div 
                    class="absolute top-0 left-0 flex-center w-[3.125rem] h-[1.105rem]"
                    :class="{ 'skin-purple': vipTextBgColor?.includes('vipTextSvg1') }"
                  > 
                    VIP<strong class="ml-[0.125rem]">{{ vipLevelInfo.curVipLevel }}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div class="flexBox small-text-white user-id">
              ID: {{ user?.userId }}
              <ion-icon class="copy-icon" :src="getImageUrl('img/common/copy.svg')" @click="copy(user!.userId)" />
            </div>
          </div>
        </div>
        <!-- 余额信息 累计领取优惠 -->
        <div class="balance-info mb-[1.09375rem]">
          <div class="balances h-full flex-center mr-[0.75rem]">
            <div class="title-color">{{ $t('label.balance') }}</div>
            <Balance></Balance>
          </div>
          <div class="h-full discount flex-center">
            <div class="title-color">{{ $t('viewsUser.bonus') }}</div>
            <div class="height-text-white money-color">{{ formatMoneyToShow(assetsChangeInfo.totalRewardAmountChange) }}</div>
          </div>
        </div>
        <!-- 充值 提现 -->
        <div class="h-[2.5rem] flexBox recharge-withdraw">
          <div class="h-full mr-[0.75rem] flex-center middle-text-white font-weight-medium recharge-info" @click="rechargeHandle">
            <ion-icon class="w-[1.875rem] h-[1.875rem] mr-[0.375rem]" src="/first/svg/perfil/my-recharge.svg"></ion-icon>
            {{ $t('main.entrar') }}
          </div>
          <div class="h-full flex-center middle-text-white font-weight-medium withdraw-info" @click="withdrawHandle">
            <ion-icon class="w-[1.875rem] h-[1.875rem] mr-[0.375rem]" src="/first/svg/perfil/my-withdraw.svg"></ion-icon>
            {{ $t('main.withdraw') }}
          </div>
        </div>
        <!-- 背景图 -->
        <div class="absolute top-0 left-0 w-full h-full bg-img"></div>
      </div>
      <section ref="sectionRef" class="px-[0.75rem] pt-[1rem] pb-[1.875rem] user-tab-info">
        <!-- VIP信息 -->
        <div v-if="isShowVipInfo" class="my-vip w-full mb-[1rem] relative">
          <!-- 右侧去VIP详情按钮 -->
          <div class="absolute right-[0.125rem] top-0 vip-detail flex-evenly" @click="vipHandle">
            {{ $t('viewsTabbar.goVipDetail') }}
            <ion-icon class="to-icon w-[1.0938rem] h-[1.0938rem]" :icon="chevronForward" />
            <HotPoint :isShow="ifHasUnclaimedRewards" classNames="absolute right-[1.625rem] top-[0.5625rem]"/>
          </div>
          <!-- VIP信息 -->
          <div class="vip-info">
            <div class="flexBox">
              <ion-img class="w-[2.375rem] h-[2.375rem] z-30" :src="vipIconPath" />
              <div class="relative current-vip-level flex-center">
                <ion-icon class="w-[4.5rem] h-[1.25rem]" :icon="vipTextBgColor" />
                <div class="absolute left-0 top-0 w-[4.5rem] h-[1.25rem] flex-center">
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
                  <div class="relative next-current-vip-level flex-center">
                    <ion-icon class="w-[3.125rem] h-[1.105rem]" :icon="nextVipTextBgColor"></ion-icon>
                    <div class=" absolute top-0 left-0 flex-center w-[3.125rem] h-[1.105rem]">
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
              <ion-icon class="customer-icon w-[1.5rem] h-[1.5rem] font-weight-bold mr-2.5" :src="`/first/svg/perfil/${`${suportNavLinks.icon}.svg`}`" />
              <span class="navigation-item">{{ suportNavLinks.name }}</span>
            </div>
            <p v-if="unReadNum > 0" class="flex-center red-points absolute right-[2.5rem] rounded-full">{{ unReadNum }}</p>
          </ion-item>
        </div>
        <!-- 功能导航 -->
        <div class="w-full pl-4 card-bg-gradient mb-[1rem]">
          <ion-item v-for="item in firstNavLinks" v-show="item.isShow" detail lines="none" :key="item.icon" @click="item.fun">
            <div slot="start" class="flex items-center">
              <ion-icon class="card-icon-color w-[1.5rem] h-[1.5rem] font-weight-bold mr-2.5" :src="`/first/svg/perfil/${`${item.icon}.svg`}`" />
              <span class="navigation-item">{{ item.name }}</span>
            </div>
            <div class="flex justify-end w-full" v-if="item.type == 'invite'">
              <ion-label class="flex-[2.5] text-right max-w-52 invite-item">
                {{ locale.includes('en') ? agencyConfig?.advertising_en : agencyConfig?.advertising_local }}
              </ion-label>
            </div>
            <div class="flex items-center justify-end w-full navigation-item current-language" v-if="item.type == 'language'">
              <flag :iso="getCurrency(currentLanguage)" class="flag-rounded mr-2" />
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
    <IonAlert :alertOptions="alertOptions" @sureClick="sureLogout" v-if="isOpen" @cancelClick="isOpen = false"
      @maskClick="isOpen = false" />
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

// 多颜色顶部背景图片
const currentTopBg = computed(() => {
  const data = getTheme();
  const themeMap: {[key:string]: string} = {
    'phantom-blue': 'yellow-dark',
    'neo-blue': 'yellow-dark',
    'mystlight-blue': 'yellow-dark',
    'midnight-purple': 'yellow-dark',
    'goldshine-green': 'yellow-dark',
  }
  const theme = themeMap[data.theme] || data.theme;
  return `url(/${data.skin}/user/${theme}-perfil-top-bg.png)`;
})
// 多皮肤余额/奖金背景色
const currentBalaceBg = computed(() => {
  const data = getTheme();
  if (data.theme == 'phantom-blue') return '';
  return `url('/${data.skin}/user/${data.theme}-perfil-balace-bg.png')`;
})
// 多皮肤 提现图标
const currenWithdraw = computed(() => {
  const data = getTheme();
  const themeMap: {[key:string]: string} = {
    'neo-blue': 'phantom-blue',
    'mystlight-blue': 'phantom-blue',
  }
  const theme = themeMap[data.theme] || data.theme;
  return `/${data.skin}/svg/perfil/${theme}-my-withdraw.svg`;
})
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
  background-color: var(--my-base-info-bg);
  .bg-img {
    background: v-bind(currentTopBg) no-repeat;
    background-size: 100% 6.1875rem;
    pointer-events: none;
  }
  .user-info {
    height: 5.5rem;
    .copy-icon {
      width: .875rem;
      height: .875rem;
      margin-left: .75rem;
      color: var(--color-primary-800);
    }
  }
  .balance-info {
    height: 2.9rem;
    display: flex;
    border-bottom: 1px solid var(--my-color-line);
    .balances,
    .discount {
      flex: 1;
      flex-direction: column;
      background: v-bind(currentBalaceBg) no-repeat;
      background-size: 100% 100%;
      padding-bottom: .625rem;
      font-size: .625rem;
      line-height: .9375rem;
      .title-color {
        color: var(--balance-title-text-color-40);
      }
      .money-color {
        color: var(--balance-money-text-color);
      }
    }
  }
  .recharge-withdraw {
    .recharge-info, 
    .withdraw-info {
      flex: 1;
      background: var(--bg-color-recharge-withdraw);
      border-radius: 0.375rem;
      color: var(--text-color-white-100);
      ion-icon {
        color: var(--recharge-withdraw-icon-color);
      }
    }
  }
}

.skin-purple {
  color: var(--vip1-detail-text-color);
}

ion-content {
  --background: var(--color-bg-400);
}

.user-tab-info {
  background: var(--color-bg-300);
}

.card-bg-gradient {
  border-radius: 0.5rem;
  background: var(--my-card-bg-gradient);
  .customer-icon {
    color: var(--color-primary-800);
  }
}

.navigation-item {
  font-size: 0.75rem;
  color: var(--color-text-100);
  line-height: 1.125rem;
  font-weight: 500;
}

.invite-item {
  font-size: 0.625rem;
  color: var(--color-text-40);
}

.red-points {
  width: 2rem;
  height: 1.125rem;
  font-size: .75rem;
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
      color: var(--vip-info-text-color-40);
    }
  }
  .current-vip-level {
    font-size: 0.75rem;
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
  font-size: 0.625rem;
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
  font-size: .625rem;
  color: var(--text-color-white-100);
  margin-left: -0.6875rem;
}

.max-level {
  font-size: 0.75rem;
  line-height: 1.125rem;
}

.condition-info {
  margin-top: 0.9rem;
}

.avatar-info {
  --size: 3.25rem;
  --border-radius: 50%;
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
  font-weight: 400;
  color: var(--current-language-text-color);
  .flag-rounded {
    font-size: 1rem;
    border-radius: 0.75rem;
  }
}


.user-id {
  color: var(--id-text-color-40)
}

.vip-text-40 {
  color: var(--vip-info-text-color-40);
}

.vip-info-max {
  color: var(--vip-max-text-color);
  font-size: var(--ep-font-size-xs, .625rem);
}

.card-icon-color {
  color: var(--color-text-40);
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

.left.rounded-md.flex.items-center.justify-center {
  background: #2C344C;
}

.right.rounded-md.flex.items-center.justify-center {
  background: linear-gradient(180deg, #13C96A 0%, #1D9554 100%);
}

ion-modal#profile-modal-language {
  --width: fit-content;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

.new-skin-symbol {
  @import "@/views/tabbar/tabs/perfil/first/styles/theme-style.less";
}
</style>

