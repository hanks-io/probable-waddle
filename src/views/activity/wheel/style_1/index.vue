<!-- 幸运大转盘活动 -->
<template>
	<ion-page class="wheel-container">
		<!-- 导航标签 -->
		<NavigationBar :title="activityName">
			<template #end>
				<div class="h-[1.875rem] pt-1.5 rounded-middle mr-4" @click="toRecordHandle">
					<ion-icon class="record-icon h-5" src="/svg/activity/icon_record.svg" />
				</div>
			</template>
		</NavigationBar>
		<ion-content class="wheel-container-content" :scrollY="true">
			<section class="countdown-container">
				<div class="time-group">
					<div class="time-box" v-for="item in displayCountdownTime" :key="item.label">
						<ion-label class="time-num">{{ item.value }}</ion-label>
						<ion-label class="time-label">{{ item.label }}</ion-label>
					</div>
				</div>
				<div class="spins-box">
					<img src="/images/small-wheel.png" alt="wheel" class="spins-icon">
					<ion-label class="spins-text">Spins</ion-label>
					<span class="spins-count">{{ wheelInfo.lotteryTicketGetCount }}</span>
				</div>
			</section>
			<div :class="['time-status', timeStatus]">
				<i class="time-status-icon" />
				<ion-label class="time-status-label">{{ timeStatusText }}</ion-label>
			</div>
			<!-- 转盘台 -->
			<Wheel1 class="wheel-box" :activePrizeStyle="activePrizeStyle" :prizes="wheelPrizes1" :showMask="showMask"
				:defaultStyle="allPrizesDefaultStyle" :numberOfDraws="wheelInfo.lotteryTicketGetCount" @start="startBefore"
				@end="endAfter" :bgSrc="bgSrc" />

			<section class="collect-box">
				<div class="collect-box-img-wall">
					<ion-img class="collect-box-img-wall-img" :src="getImageUrl('img/virtualCurrency.png')" alt="" />
				</div>
				<ion-label class="collect-box-money">
					<span v-if="merchantCy" class="title">{{ merchantCy }}</span>
					<span class="txt">{{ formatMoneyToShow(moneyConvertToClient(wheelInfo.exchangeReward)) }}</span>
				</ion-label>
				<ion-label class="collect-box-text">{{ $t('viewsActivity.collectTips', {
					type: '"H","A","P","P","Y"', merchantCy:
						merchantCy, money: formatMoneyToShow(moneyConvertToClient(wheelInfo.exchangeReward))
				}) }}
				</ion-label>
				<ul class="collect-box-list">
					<li class="collect-box-list-item" v-for="item in rewardCards" :key="item.name">
						<ion-label class="collect-box-list-item-label" :data-text="item.name.charAt(0)">{{ item.name.charAt(0)
						}}</ion-label>
						<ion-label class="collect-box-list-item-amount">x{{ item.amount }}</ion-label>
					</li>
				</ul>
				<ion-button class="unset-btn redemption-popup-btn" @click="exchangeHandle">
					{{ $t('activity.redeem2') }}
				</ion-button>
			</section>

			<section class="obtain-vouchers">
				<div class="obtain-vouchers-title">
					<ion-img class="before-icon" src="/svg/activity/adorn.svg" />
					<ion-label class="obtain-vouchers-title-text" :data-text="$t('viewsActivity.obtainRewardTickets')">{{
						$t('viewsActivity.obtainRewardTickets') }}</ion-label>
					<ion-img class="after-icon" src="/svg/activity/adorn.svg" />
				</div>

				<ul class="obtain-vouchers-list">
					<li class="obtain-vouchers-list-item" v-for="item in wheelInfo.lotteryTicketGet" :key="item.uuid">
						<div class="obtain-vouchers-list-item-top">
							<ion-label class="obtain-vouchers-list-item-top-label">{{ $t(`activity.${item.type}`) }}{{ item.type ==
								'firstLogin' ? '' :
								`(${formatMoneyToShow(moneyConvertToClient(item.conditionAmount))})` }}
							</ion-label>
							<ion-label class="obtain-vouchers-list-item-top-amount">{{ item.receiveCount > item.triggerCount ?
								item.triggerCount : item.receiveCount }}/{{
									item.triggerCount }}
							</ion-label>
						</div>
						<div class="obtain-vouchers-list-item-bottom">
							<div class="obtain-vouchers-list-item-bottom-left">
								<ion-img class="obtain-vouchers-list-item-bottom-left-icon" src="/images/small-wheel.png" />
								<ion-label class="obtain-vouchers-list-item-bottom-left-amount">x{{ item.amount }}</ion-label>
							</div>
							<ion-button class="unset-btn jump-btn"
								v-if="item.receiveCount >= item.triggerCount || item.type == 'firstLogin'"
								:disabled="item.type != 'firstLogin' || item.receiveCount" @click="gameHandle">{{
									$t('viewsActivity.completed') }}
							</ion-button>
							<ion-button class="unset-btn jump-btn" v-else-if="['validBet', 'cumulativeValidBet'].includes(item.type)"
								@click="gameHandle">{{ $t('label.bettings') }}
							</ion-button>
							<ion-button v-else class="unset-btn jump-btn" @click="router.push('/recharge/apply')">{{
								$t('activity.Recharge') }}
							</ion-button>
						</div>
					</li>
				</ul>
			</section>
			<!-- 游戏规则 -->
			<section class="description" v-if="descriptionList.length">
				<div class="description-title">
					<ion-img class="before-icon" src="/svg/activity/adorn.svg" />
					<ion-label>{{ descriptionList[0].replace(/:|：/, '') }}</ion-label>
					<ion-img class="after-icon" src="/svg/activity/adorn.svg" />
				</div>
				<ul class="description-list">
					<li class="description-list-item" v-for="item in descriptionList.slice(1)" :key="item">{{ item }}</li>
				</ul>
			</section>
		</ion-content>
		<!-- 奖品弹窗 -->
		<RewardModal :modalVisible="rewardModalVisible" :currentPrize="currentPrize" @visibleChange="rewardVisibleChange" />
		<!-- 兑换弹窗 -->
		<ExchangeModal class="wheel-exchange-modal" :modalVisible="exchangeModalVisible" :rewardCards="rewardCards"
			@visibleChange="exchangeVisibleChange" @exchange="confirmExchangeHandle" />
	</ion-page>
</template>


<script setup lang="ts">
import { IonButton, IonImg, IonPage, IonContent, IonIcon, IonLabel } from '@ionic/vue'
import Wheel1 from '@/views/activity/wheel/components/wheel/wheel1/index.vue'
import { formatMoneyToShow, moneyConvertToClient } from '@/utils/custom'
import ExchangeModal from '@/views/activity/wheel/default/modals/ExchangeModal.vue'
import RewardModal from '@/views/activity/wheel/default/modals/RewardModal.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import router from '@/router'
import useLogic from '../logic'
import { useI18n } from 'vue-i18n'
import { getTheme } from '@/theme/hooks'
import { getImageUrl } from "@/utils";

const { t } = useI18n()
const {
	endAfter,
	initPrizes,
	startBefore,
	showMask,
	wheelPrizes1,
	prizesDataList,
	countdownTime,
	activePrizeStyle,
	allPrizesDefaultStyle,
	displayCountdownTime,
	blocks,
	buttons,
	rule,
	prizes,
	luckyRef,
	countdown,
	tempo,
	calcStatus,
	startClick,
	activityStatus,
	showEndCountdown,
	rewardModalVisible,
	rewardCards,
	exchangeModalVisible,
	activityName,
	isRedeemable,
	wheelInfo,
	isShowAnimationEl,
	animationPlayState,
	currentPrize,
	merchantCy,
	overTime,
	rewardVisibleChange,
	exchangeVisibleChange,
	toRecordHandle,
	startCallback,
	exchangeHandle,
	confirmExchangeHandle,
	endCallback,
	gameHandle,
} = useLogic()

const wheelBgMap: Record<string, string> = {
	'phantom-blue': '/images/wheel-2.png',
	'neo-blue': '/images/wheel-2.png',
	'mystlight-blue': '/images/wheel-2.png',
	'midnight-purple': '/images/wheel-3.png',
	'goldshine-green': '/images/wheel-2.png',
}

const { theme } = getTheme()
const bgSrc = computed(() => wheelBgMap[theme] || '/images/wheel-1.png')

const timeStatus = computed(() => {
	let status = '';
	if (!showEndCountdown.value) {
		status = 'progress'
	}
	if (activityStatus.value) {
		status = 'progress'
	}
	if (!activityStatus.value && overTime.value <= 0) {
		status = 'end'
	}
	return status
})
const timeStatusText = computed(() =>
	t('activity.activity')
	+ (activityStatus.value
		? (showEndCountdown.value ? t('activity.end') : t('activity.foreverEnd'))
		: (overTime.value > 0
			? t('activity.start')
			: t('activity.over'))
	)
)

const descriptionList = computed(() => {
	if (rule.value) {
		return rule.value.split('\n')
	}
	return []
})

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
</style>
<style scoped lang="less">
@import './index.less';

.collect-box-money {
	.txt {
		margin-left: 0.375rem;
	}
}
</style>
