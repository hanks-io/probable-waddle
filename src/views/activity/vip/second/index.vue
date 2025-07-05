<!-- VIP活动 -->
<template>
    <ion-page>
        <ion-header class="ion-no-border" v-if="!(route.path === '/main/promo')">
            <!-- 顶部导航栏 -->
            <ion-toolbar mode="ios">
                <BackButton size="1.25rem" />
                <ion-title>{{ $t('activity.vip41') }}</ion-title>
                <ion-buttons slot="end" @click="claimRecordHandle">
                    <ion-button>
                        <ion-icon class="menu text-3xl" slot="icon-only" icon="/first/svg/assets/record.svg"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :scrollY="true">
            <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
                @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <!-- VIP等级信息 -->
            <div class="my-vip w-full  mt-[1.0313rem] mb-[1.1563rem] relative">
                <!-- 领取按钮 -->
                <div class="absolute right-[0.1956rem] top-0 vip-detail flex-evenly"
                    :class="claimBtnIsEnable ? 'enabled' : 'disabled'" @click="bathReceiveHandle">
                    <div class="w-[6.875rem] h-[2.75rem] absolute top-[0.0625rem] left-[0.0625rem] bg-[--color-bg-first] rounded-[2.75rem]">
                        <div class=" btn w-full h-full leading-[2.75rem] rounded-[2.75rem] text-center" :class="claimBtnIsEnable ? 'enabled' : 'disabled'">
                            {{ $t('activity.vip45') }}
                        </div>
                    </div>
                </div>
                <!-- VIP信息 -->
                <div class="vip-info">
                    <div class="flexBox">
                        <ion-img class="w-[2.375rem] h-[2.375rem] z-30"
                            :src="vipStore.getVipIconPath(vipLevelInfo.curVipLevel)" />
                        <div class="current-vip-level flex-center relative">
                            <ion-icon class="w-[4.5rem] h-[1.25rem]" :icon="vipTextBgColor" />
                            <div class="absolute left-0 top-0 w-[4.5rem] h-[1.25rem] flex-center text-[--text-color-white-100]">
                                VIP<strong class="ml-[0.125rem]">{{ vipLevelInfo.curVipLevel }}</strong>
                            </div>
                        </div>
                        <div
                            class="ml-[0.125rem] translate-y-[0.1875rem] small-text-white vip-text-40 font-weight-bold">
                            {{
                                $t('viewsTabbar.currentLevel') }}</div>
                    </div>
                    <!-- 晋级进度条 -->
                    <div class="mt-[0.9331rem] flexBox mb-[1.0313rem]">
                        <div class="relative">
                            <ion-progress-bar class="progress-bar"
                                :value="vipLevelInfo.firstLevelProgress"></ion-progress-bar>
                            <div :style="{ left: `${(vipLevelInfo.firstLevelProgress * 100)}%` }" class="level-point"
                                v-if="![0, 1, '0', '1'].includes(vipLevelInfo.firstLevelProgress)">
                                <ion-icon class="w-[2.75rem] h-[2.75rem]"
                                    src="/first/svg/progress-point.svg"></ion-icon>
                            </div>
                        </div>
                        <!-- 下一级 图标信息 -->
                        <div class="flexBox ml-[0.3125rem]">
                            <template v-if="vipLevelInfo.nextVipLevel">
                                <ion-img class="w-[1.5rem] h-[1.5rem] z-30"
                                    :src="vipStore.getVipIconPath(vipLevelInfo.curVipLevel + 1)" />
                                <div class="next-current-vip-level flex-center relative">
                                    <ion-icon class="w-[3.125rem] h-[1.105rem]" :icon="nextVipTextBgColor"></ion-icon>
                                    <div class="absolute top-0 left-0 flex-center w-[3.125rem] h-[1.105rem] text-[--text-color-white-100]">
                                        VIP<strong class="ml-[0.125rem]">{{ vipLevelInfo.curVipLevel + 1 }}</strong>
                                    </div>
                                </div>
                            </template>
                            <div class="font-weight-bold max-level vip-info-max" v-else>{{ $t('viewsUser.maximumLevel')
                                }}</div>
                        </div>
                    </div>
                    <!-- 投注/充值信息 -->
                    <div class="small-text-white " :class="{ 'condition-info': !vipLevelInfo.nextVipLevel }">
                        <div class="font-weight-bold vip-text-40 mb-[0.1875rem]">{{ $t('viewsTabbar.levelCondition') }}
                        </div>
                        <div class="need-recharge flexBox" v-if="vipLevelInfo.rechargeRequirements != 0">
                            <p></p> {{ $t('viewsTabbar.needRecharge') }}：
                            <strong class="current-recharge">{{ formatMoneyToShow(vipLevelInfo.curRechargeAmount) }}</strong>
                            <span class="vip-info-max">{{
                                `(${formatMoneyToShow(vipLevelInfo.curRechargeAmount)}/${formatMoneyToShow(vipLevelInfo.rechargeRequirements)
                                })` }}</span>
                        </div>
                        <div class="need-bets flexBox" v-if="vipLevelInfo.betRequirements != 0">
                            <p></p> {{ $t('viewsTabbar.needBets') }}：
                            <strong class="current-recharge">{{ formatMoneyToShow(vipLevelInfo.curBetAmount) }}</strong>
                            <span class="vip-info-max">{{
                                `(${formatMoneyToShow(vipLevelInfo.curBetAmount)}/${formatMoneyToShow(vipLevelInfo.betRequirements)
                                })`
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- VIP等级对照表 -->
            <div class="text-base w-full pb-[0.6875rem] color-text-100 font-semibold">
                {{ $t('activity.vip4') }}
            </div>
            <div class="sticky top-0 z-50  w-full bg-300 pt-[0.625rem]">
                <!-- 切页按钮 -->
                <ion-segment v-model="curShowPage" :scrollable="true" mode="md">
                    <template v-for="item in pageList" :key="item.value">
                        <ion-segment-button v-if="item.isEnable" :value="item.value">
                            <ion-label :class="curShowPage == item.value ? 'active' : 'inactive'">
                                {{ $t(item.title) }}
                            </ion-label>
                            <HotPoint :isShow="vipReceiveList.includes(item.value)"
                            classNames="top-[0.9375rem] right-[-0.125rem] -translate-y-1/4 translate-x-1/4"  />
                        </ion-segment-button>
                    </template>
                </ion-segment>
                <!-- 列表标题 -->
                <div v-if="curShowPage !== PageType.LEVEL"
                    class="bg-[--color-bg-third] h-[3.75rem] mt-[1.1875rem]  rounded-[0.625rem_0.625rem_0rem_0rem] flex items-center text-xs normal-text font-weight-bold">
                    <span  class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[0]) }}</span>
                    <span v-if="ifShowDeposit" class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[1]) }}</span>
                    <span v-if="ifShowBet" class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[2]) }}</span>
                    <span  class="flex-1 text-center whitespace-normal" >{{ $t(curPageTitles[3]) }}</span>
                </div>
            </div>
            <div class="min-h-0">
                <ion-list class="pt-0 pb-0">
                    <div v-if="curShowPage !== PageType.LEVEL" v-for="(pageData, index) in curPageData"
                        class="flex items-center w-full h-[3.75rem] text-[0.625rem] text-center bg-[--color-bg-fifth]">
                        <div class="flexBox  pl-[0.625rem]">
                            <ion-img class="w-[1.6387rem] h-[1.6387rem] z-30"
                                :src="vipStore.getVipIconPath(pageData.level)" />
                            <div class=" text-[--font-size-10] ml-[-1.375rem] flex-center relative">
                                <ion-icon class="w-[4.5rem] h-[0.9688rem]" :icon="getVipLevelBg(pageData.level)" />
                                <div class="absolute left-0 top-0 w-[4.5rem] h-[0.9688rem] flex-center">
                                    VIP<strong class="ml-[0.125rem]">{{ pageData.level }}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1" v-if="pageData.ifShowDeposit">
                            <div class="px-1">
                                <div class=" text-[--color-text-second]">{{
                                    formatMoneyToShow(pageData.showRechargeProgress ?
                                        pageData.realRechargeRequirement : pageData.rechargeRequirement) }}</div>
                                <div v-show="pageData.showRechargeProgress">
                                    <ion-progress-bar class="mt-1 mb-[0.3125rem]" mode="ios"
                                        :value="pageData.rechargeProgress"></ion-progress-bar>
                                    <div class="text-[--color-text-first]">{{
                                        formatMoneyToShow(pageData.recharge)
                                        }}/{{
                                            formatMoneyToShow(pageData.realRechargeRequirement) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1" v-if="pageData.ifShowBet">
                            <div class="px-1">
                                <div class="text-[--color-text-second]">{{
                                    formatMoneyToShow(pageData.showBetProgress ?
                                        pageData.realBetRequirement
                                    : pageData.betRequirement) }}</div>
                                <div v-show="pageData.showBetProgress">
                                    <ion-progress-bar class="mt-1 mb-[0.3125rem]" mode="ios"
                                        :value="pageData.betProgress"></ion-progress-bar>
                                    <div class="text-[--color-text-first]">{{
                                        formatMoneyToShow(pageData.bet) }}/{{
                                            formatMoneyToShow(pageData.realBetRequirement) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 text-[--color-text-yellow-emphasis]  font-bold">{{
                            formatMoneyToShow(pageData?.reward ?
                            pageData?.reward : 0) }}</div>
                    </div>
                    <!-- 保级说明 -->
                    <div v-if="curShowPage === PageType.LEVEL" class="bg-300 pt-[0.625rem] text-xs leading-5">
                        <!-- 保级说明-保级说明 -->
                        <div class="rule-content space-y-2">
                            <div class="text-base color-text-80 font-weight-medium">
                                {{ $t('activity.vip18') }}
                            </div>
                            <p>{{ $t('activity.vip25') }}</p>
                            <p>{{ $t('activity.vip26') }}</p>
                            <p>{{ $t('activity.vip27') }}</p>
                        </div>
                        <!-- 保级说明-保级对照表 -->
                        <div>
                            <div class="text-base color-text-80 font-weight-medium mt-4 mb-2">
                                {{ $t('activity.vip19') }}
                            </div>
                            <div class="rounded-middle color-border overflow-hidden">
                                <table class="table w-full text-xs" :class="{ 'unZhTable': currentLanguage }">
                                    <thead>
                                        <tr>
                                            <th>{{ $t('activity.vip21') }}</th>
                                            <th>{{ $t('activity.vip23') }}</th>
                                            <th>{{ $t('activity.vip24') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="levelInfo in retentionLevel" :key="levelInfo.level">
                                            <td>{{ levelInfo.level }}</td>
                                            <td>{{ formatMoneyToShow(levelInfo.retentionRecharge) }}</td>
                                            <td>{{ formatMoneyToShow(levelInfo.retentionBet) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </ion-list>
            </div>
            <!-- 活动介绍 -->
            <div class="rule-content mt-[0.6875rem] pb-[9rem] space-y-3 text-xs pl-1" :style="{ marginBottom: route.path === '/main/promo' ? `calc(${tabBarHeight}px)` : ''}">
                <div class="text-base text-[--color-text-first] font-semibold">{{ $t('activity.vip20') }}
                </div>
                <p>{{ $t('activity.vip28') }}</p>
                <p v-if="pageStatus[PageType.DAILY]">{{ $t('activity.vip29') }}</p>
                <p v-if="pageStatus[PageType.WEEKLY]">{{ $t('activity.vip30') }}</p>
                <p v-if="pageStatus[PageType.MONTHLY]">{{ $t('activity.vip31') }}</p>
                <p>{{ $t('activity.vip32', { receiveRule: $t(receiveRuleContent) }) }}</p>
                <p>{{ $t('activity.vip33', { multiple: auditMultiple, batContent: receiveBatContent }) }}</p>
                <p>{{ $t('activity.vip34') }}</p>
                <p>{{ $t('activity.vip35') }}</p>
            </div>
        </ion-content>
        <!-- 领取按钮 -->
        <Footer v-show="showReceiveBtn" :style="{ marginBottom: route.path === '/main/promo' ? `calc(${tabBarHeight}px)` : ''}" 
        :class="route.path === '/main/promo' ? 'translate-y-[0.8125rem]' :''">
            <div class="flex flex-col justify-end h-[3rem] mt-[-0.25rem]" @contextmenu="forbidContextmenu" :class=" !!receiveBtnIsEnable ? '' :'disabledBtn'" >
                <div class="bottomBtn rounded-[0.875rem] overflow-hidden h-[3rem]">
                    <Button @click="receiveHandle" background="transpant" :shiny="receiveBtnIsEnable">
                        {{ $t(`activity.${curShowPage}`) }}
                    </Button>
                </div>
            </div>
        </Footer>
    </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useLogic from '../logic'
import { useVipStore } from '@/store/vip';
import BackButton from '@/components/BackButton.vue';
import { formatMoneyToShow } from '@/utils/custom';
import { IonPage, IonHeader, IonLabel, IonToolbar, IonProgressBar, IonContent, IonSegment, IonSegmentButton, IonIcon, IonButtons, IonButton, IonTitle, IonImg, IonList, IonRefresher, IonRefresherContent } from '@ionic/vue';
import Footer from '@/views/activity/comp/second/Footer/index.vue';
import Button from '@/components/second/Button/index.vue'
import HotPoint from '@/components/HotPoint/index.vue'
const vipStore = useVipStore();

// 我的 VIP背景图片/详情背景图路径/文本背景色
const myBgPath = computed(() => `url(${vipStore.getFirstVipBg(vipLevelInfo.curVipLevel, 'myVipBg')})`);
const vipTextBgColor = computed(() => vipStore.getFirstVipBg(vipLevelInfo.curVipLevel, 'myVipTextBg'));
const nextVipTextBgColor = computed(() => vipStore.getFirstVipBg(vipLevelInfo.curVipLevel + 1, 'myVipTextBg'));

const {
    curShowPage,
    claimBtnIsEnable,
    auditMultiple,
    vipLevelInfo,
    pageStatus,
    PageType,
    curPageTitles,
    showReceiveBtn,
    receiveRuleContent,
    currentLanguage,
    receiveBtnIsEnable,
    receiveBatContent,
    pageList,
    curPageData,
    retentionLevel,
    bathReceiveHandle,
    receiveHandle,
    claimRecordHandle,
    handleRefresh,
    getVipLevelBg,
    forbidContextmenu,
    route,
    tabBarHeight,
    ifShowDeposit,
    ifShowBet,
    vipReceiveList
} = useLogic()

</script>

<style scoped lang="less">
ion-content {
    --padding-start: .75rem;
    --padding-end: .75rem;
}

.menu {
  color: var(--color-text-100);
}

.claimButtonEnabled {
    background: var(--color-vip-active-bg);
    color: var(--color-primary-btn-text-active);
}

.claimButtonDisabled {
    background: var(--color-vip-disable-bg);
    color: var(--color-primary-btn-text-disable);
}

.my-vip {
    height: 11.8125rem;
    background: v-bind(myBgPath) no-repeat;
    background-position: bottom 0 left 0;
    background-size: 100% 11.25rem;
    padding: 1.6rem .8125rem 0.7731rem;
    font-family: 'Saira';

    .vip-detail {
        width: 7rem;
        height: 2.875rem;
        padding: 0 .625rem;
        border-radius: 2.5625rem;
        font-size: var(--font-size-12);
        font-weight: var(--font-weight-bold);
        border-radius: 1.4375rem;
    }
    .vip-detail.enabled {
        background: var(--gradients-orange-purple);
        .btn {
            background: var(--gradients-orange-purple);
            background-clip: text;
            color: var(--color-vip-enable-text);
        }
    }
    .vip-detail.disabled {
        background: var(--color-vip-disable-bg);
        .btn {
            background: var(--color-vip-disable-bg);
            color: var(--color-vip-disable-text);
        }
    }
}

.current-vip-level {
    font-size: var(--font-size-12);
    margin-left: -1.125rem;
    text-shadow: 0rem 0.0938rem 0.1875rem rgba(0, 0, 0, 0.25);
}

.level-point {
    position: absolute;
    transform: translate(-50%, -47.5%);
}

.need-recharge,
.need-bets {
    color: var(--text-color-white-40);

    p {
        width: 0.1875rem;
        height: 0.1875rem;
        border-radius: 50%;
        background: var(--text-color-white-40);
        margin-right: 0.625rem;
    }

    span {
        color: var(--text-color-white-80);
    }
}

.current-recharge {
    color: var(--color-currency);
    margin-right: .375rem;
}

.next-current-vip-level {
    font-size: var(--font-size-10);
    margin-left: -0.6875rem;
    text-shadow: 0rem 0.0592rem 0.1184rem rgba(0, 0, 0, 0.25);
}

.max-level {
    font-size: var(--font-size-12);
    line-height: 1.125rem;
    color: var(--color-text-80);
}

.condition-info {
    margin-top: 0.9rem;
}

.vipLevelList {
    height: calc(100% - 5rem);
}

table {
    border-collapse: collapse;
    background-color: transparent;
}

table th,
table td {
    border: 1px solid var(--color-border);
    font-weight: var(--font-weight-bold);
    color: var(--color-currency);
    width: 33.33%;
    text-align: center;
    border-right: none;
}

table thead th {
    color: var(--color-text-40);
    height: 2.5rem;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-12);
    background-color: var(--color-bg-second);
}

table tbody td:first-child {
    color: var(--color-text-80);
}

table tbody td:last-child {
    color: var(--color-currency);
}

table.table th,
table.table td {
    line-height: 1.5625rem;
    width: 12.5%;
}

.unZhTable thead tr th {
    height: 2.6rem;
    line-height: 0.9rem;
}

table th:first-child,
table td:first-child {
    border-left: none;
}

table th:last-child,
table td:last-child {
    border-right: none;
}

table thead tr:first-child th,
table thead tr:first-child td {
    border-top: none;
}

table tr:last-child th,
table tr:last-child td {
    border-bottom: none;
}

ion-toolbar {
    --min-height: 3.125rem;
}

ion-progress-bar {
    --background: var(--progress-base-bg);
    border-radius: 1rem;
}

ion-list ion-progress-bar {
    --progress-background: var(--color-bg-progress);
    height: 0.2604rem;
}

ion-list {
  padding-top: 0;
}

.progress-bar {
    width: 17.1875rem;
    height: 0.25rem;
    --progress-background: var(--progress-bg);
}

ion-segment-button {
    --background-checked: var(--color-bg-third);
    --color: var(--color-text-second);
    --color-checked: var(--color-text-first);
    --indicator-color: var(--color-primary-800);
    border-top-left-radius: var(--rounded-middle);
    border-top-right-radius: var(--rounded-middle);
    border-bottom: 0.0625rem solid var(--color-text-second);
    text-transform: none;
}

ion-segment-button::part(indicator-background) {
    background: var(--gradients-indicatorLine);
    z-index: 11;
}

ion-label.active {
    font-weight: var(--font-weight-bold);
}

.content-base {
    padding: 2px;
    line-height: 13px;
}

.share-vip {
    padding: 0 2rem;
}

.current-level {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0.6rem;
    font-weight: bold;
}

.vip-text-40 {
    color: var(--vip-info-text-color-40);
}

.vip-info-max {
    color: var(--vip-max-text-color);
    font-size: var(--ep-font-size-xs, .625rem);
}

.rule-content {
    color: var(--color-text-second);
}

.normal-text {
    color: var(--color-text-first);
}

.shiny {
    position: relative;
    overflow: hidden;
}

.shiny::before {
    content: '';
    animation: shiny 6s ease-in-out infinite;
    background: white;
    display: inline-block;
    height: 100%;
    left: 0;
    position: absolute;
    top: -180px;
    width: 30px
}

.bottomBtn {
    background: var(--color-gradients-btn);
    box-shadow: var(--color-shadow-bottom-btn);
}

.bottomBtn:active {
    background: var(--color-gradients-btn);
    box-shadow: none;
    height: 2.8rem;
}

.disabledBtn {
    opacity: 0.4;
    pointer-events: none;
}

@keyframes shiny {
    0% {
        opacity: 0;
        transform: scale(0) rotate(45deg);
    }

    80% {
        opacity: 0.5;
        transform: scale(0) rotate(45deg);
    }

    81% {
        opacity: 1;
        transform: scale(4) rotate(45deg);
    }

    100% {
        opacity: 0;
        transform: scale(50) rotate(45deg);
    }
}
</style>
