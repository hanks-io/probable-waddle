<!-- 幸运大转盘活动 -->
<template>
	<ion-page>
			<!-- 导航标签 -->
			<ion-header class="ion-no-border">
				<ion-toolbar mode="ios">
					<BackButton slot="start" :isUpdateRedPoint="true" />
					<ion-title>{{ activityName }}</ion-title>
					<div class="h-[1.875rem] pt-1.5 rounded-middle mr-4" slot="end" @click="toRecordHandle">
						<ion-icon class="h-5" src="/svg/activity/icon_record.svg" />
					</div>
				</ion-toolbar>
			</ion-header>
			<ion-content>
				<div class="wheel w-full flex flex-col justify-end h-[36.5625rem]">
					<div class="h-full flex flex-col justify-between relative">
						<!-- 活动倒计时 -->
						<div class="flex-1 flex items-center justify-center text-base">
							<div v-if="calcStatus">
								<span class="py-1 px-1.5 rounded-middle color-text-40 bg-200">
									<span>{{ showEndCountdown ? $t('activity.activity') : $t('activity.foreverActivity') }}</span>
									<span v-if="activityStatus">{{ showEndCountdown ? $t('activity.end') : $t('activity.foreverEnd') }}</span>
									<span v-else-if="overTime > 0">{{ $t('activity.start') }}</span>
									<span v-else>{{ $t('activity.over') }}</span>
									<span v-if="overTime > 0">
										<span>{{ showEndCountdown ? $t('activity.countdown') : $t('activity.foreverCountDown') }}：</span>
										<span v-if="showEndCountdown">{{ countdown }}</span>
										<span v-else>{{ $t('activity.forever') }}</span>
									</span>
								</span>
							</div>
						</div>
						<!-- 转盘台 -->
						<div
							class="wheel-table w-[22.6875rem] h-[28.65625rem] flex justify-center pt-[3.4rem] mx-auto relative">
							<!-- 光圈 -->
							<img class="aperture absolute top-[-.25rem]" src="/images/activity/wheel_aperture.webp" />
							<!-- 闪烁灯 -->
							<img class="light w-[20.375rem] absolute top-4" :style="`animation-duration: ${tempo}ms`"
								src="/images/activity/share_light.webp" />
							<!-- 转盘 -->
							<div class="relative h-[15.75rem]">
								<LuckyWheel ref="luckyRef" :blocks="blocks" width="15.75rem" height="15.75rem"
									:prizes="prizes" :buttons="buttons"
									:defaultConfig="{ gutter: 2, speed: 25, accelerationTime: 1500, decelerationTime: 3500 }"
									@start="startCallback" @end="endCallback" />
								<!-- 转盘开始按钮 -->

								<img class="wheel-start z-20" :class="{ on: startClick }"
									src="/svg/activity/wheel_start.svg" />
									<!-- 动画元素		 -->
								<img  v-show="isShowAnimationEl"  class="wheel-start" :class="{'zoom' : wheelInfo.lotteryTicketGetCount}"
									src="/svg/activity/wheel_start.svg" />

								<img v-show="isShowAnimationEl"  :class="['finger', {'fingerAnimation' : wheelInfo.lotteryTicketGetCount}]" src="/images/activity/finger.png"  />

							</div>
						</div>
						<!-- 奖券数量 -->
						<div class="absolute bottom-6 flex items-center w-full justify-center">
							<img class="h-5" src="/svg/activity/ticket.svg" />
							<span class="text-xl color-text-100 ml-1">{{ `x${wheelInfo.lotteryTicketGetCount}` }}</span>
						</div>
					</div>
				</div>
				<!-- 奖品类型与保有量 -->
				<div class="flex justify-around px-1">
					<div class="w-[4.375rem] h-[5.625rem] flex flex-col rounded-middle"
						:class="isRedeemable ? 'shiny' : ''" :style="setCardStyle(`prop_${item.name}`)"
						v-for="(item, index) in rewardCards" :key="index">

						<div class="flex-1 flex items-center justify-center">
							<span class="card-name text-4xl font-weight-bold" :style="setCardNameStyle(`prop_${item.name}`)">{{
								item.name.charAt(0) }}</span>
						</div>
						<div class="h-5 flex items-center justify-center">
							<span class="text-base font-weight-bold" :style="setAccountStroke(`prop_${item.name}`)">x{{
								item.amount }}</span>
						</div>
					</div>
				</div>
				<div class="flex flex-col items-center mt-4">
					<div class="button h-[2.1875rem] w-[10rem] flex items-center justify-center rounded-large"
						:class="isRedeemable ? 'shiny' : ''" @click="exchangeHandle">
						<ion-label class="text-sm">{{ $t('activity.redeem2') }}</ion-label>
					</div>
					<div class="text-xs color-text-80 text-center my-4">
						{{ $t('viewsActivity.collectTips', {
							type: '"H","A","P","P","Y"', merchantCy:
							merchantCy, money: formatMoneyToShow(moneyConvertToClient(wheelInfo.exchangeReward))
						}) }}
					</div>
					<div class="line h-[1px] w-[23.125rem]" />
					<div class="flex items-center mt-4">
						<img class="w-7" src="/svg/activity/adorn.svg" />
						<span class="font-weight-bold text-lg mx-2 color-text-100">{{ $t('viewsActivity.obtainRewardTickets') }}</span>
						<img class="w-7" src="/svg/activity/adorn.svg" style="transform:scaleX(-1)" />
					</div>
					<!-- 奖券领取信息 -->
					<div class="w-[21.875rem] rounded-large bg-200 px-2.5 py-2 mb-2.5" v-for="item in wheelInfo.lotteryTicketGet" :key="item.uuid">
						<div class="flex justify-between">
							<span class="text-base color-text-40">{{ $t(`activity.${item.type}`) }}{{ item.type == 'firstLogin' ? '' :
								`(${formatMoneyToShow(moneyConvertToClient(item.conditionAmount))})` }}</span>
							<span class="color-text-80">{{ item.receiveCount > item.triggerCount ? item.triggerCount : item.receiveCount }}/{{
								item.triggerCount }}</span>
						</div>
						<div class="flex justify-between mt-1.5 ">
							<div class="flex-1 flex items-center">
								<img class="w-8 mr-0.5" src="/svg/activity/ticket.svg" />
								<span class="color-text-100">x{{ item.amount }}</span>
							</div>
							<div class="finish h-[1.3125rem] flex items-center justify-center rounded-middle px-2"
								v-if="item.receiveCount >= item.triggerCount || item.type == 'firstLogin'"
								v-show="item.type != 'firstLogin' || item.receiveCount">
								<ion-label class="text-sm text-[#EEC7FF] leading-none">{{ $t('viewsActivity.completed')
									}}</ion-label>
							</div>
							<div class="button h-[1.3125rem] flex items-center justify-center rounded-middle px-2"
								v-else-if="['validBet', 'cumulativeValidBet'].includes(item.type)" @click="gameHandle">
								<ion-label class="text-sm leading-none">{{ $t('label.bettings') }}</ion-label>
							</div>
							<div class="button h-[1.3125rem] flex items-center justify-center rounded-middle px-2"
								v-else @click="router.push('/recharge/apply')">
								<ion-label class="text-sm leading-none">{{ $t('activity.Recharge') }}</ion-label>
							</div>
						</div>
					</div>
					<!-- 游戏规则 -->
					<div class="w-[21.875rem] text-start pl-[0.625rem] py-[0.625rem] bg-200 mb-[1.375rem] rounded-large">
						<p class="text-xs whitespace-pre-line rule-text keep-space">{{ rule }}</p>
					</div>
				</div>
			</ion-content>
			<!-- 奖品弹窗 -->
			<RewardModal :modalVisible="rewardModalVisible" :currentPrize="currentPrize"
				@visibleChange="rewardVisibleChange" />
			<!-- 兑换弹窗 -->
			<ExchangeModal :modalVisible="exchangeModalVisible" :rewardCards="rewardCards"
				@visibleChange="exchangeVisibleChange" @exchange="confirmExchangeHandle" />
	</ion-page>
</template>

<script setup lang="ts">
import { formatMoneyToShow, moneyConvertToClient } from '@/utils/custom'
import { setCardStyle, setCardNameStyle, setAccountStroke } from './hooks/setStyle'
import { IonPage, IonContent, IonIcon, IonToolbar, IonHeader, IonLabel, IonTitle } from '@ionic/vue'
import ExchangeModal from './modals/ExchangeModal.vue'
import BackButton from '@/components/BackButton.vue'
import RewardModal from './modals/RewardModal.vue'
import router from '@/router'
import useLogic from '../logic'

const {
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

</script>

<style scoped>
.wheel-table {
	background: url('/svg/activity/wheel_table.svg') no-repeat;
	background-size: 100%;
}

.finger {
	width: 6rem;
	height: 6rem;
	opacity: 0;
	z-index: 900;
	position: relative;
	transform: translate(7.5rem, -8.75rem);
}

.fingerAnimation {
	animation: fingerTranslate 6s ease-in-out infinite;
	animation-play-state: v-bind("animationPlayState");
}

.zoom {
	opacity: 0;
	animation: zoom 6s ease-in-out infinite;
	z-index: 100;
	animation-play-state: v-bind("animationPlayState");

}

@keyframes fingerTranslate {
	0% {
		opacity: 0;
		transform: translate(72.5rem, 60rem)
	}

	25% {
		opacity: 0.2;
		transform: translate(28.75rem, 13.125rem)
	}

	70% {
		opacity: 1;
		transform: translate(7.5rem, -8.75rem);
	}


	80% {
		opacity: 1;
		transform: translate(7.625rem, -8.625rem) scale(90%);
	}


	90% {
		opacity: 1;
		transform: translate(7.375rem, -8.875rem) scale(110%);
	}

	100% {
		opacity: 0.5;
		transform: translate(7.5rem, -8.75rem) scale(100%);

	}

}

.aperture {
	animation: apertureAnimation 3s linear infinite;
}

.light {
	animation-name: lightAnimation;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
}

.wheel-start {
	position: absolute;
	width: auto;
	height: 7.375rem;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	pointer-events: none;
}

.wheel-start.on {
	animation: buttonAnimation 250ms;
}

.card-name {
	text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
}

div.button {
	background: linear-gradient(31.96deg, #AD65ED 1.88%, #E693F9 100%);
	box-shadow: 0px 2px 2px 0px #FFFFFF66 inset, 0px -2px 2px 0px #FFFFFF66 inset;
}

div.finish {
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(31.96deg, #AD65ED 1.88%, #E693F9 100%);
}

.turntable-shiny {
	/* position: relative; */
	overflow: hidden;
}

.turntable-shiny::before {
	content: '';
	animation: turntableShiny 6s ease-in-out infinite;
	background: red;
	display: inline-block;
	height: 60%;
	left: 0;
	position: absolute;
	top: 20px;
	width: 55px;
	z-index: 100;
	left: 6px;
	border-radius: 50%;
	overflow: hidden;
}

.rule-text {
	color: var(--color-activity-rule);
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
	width: 20px
}

/* 分割线 */
.line { 
	background-color: var(--color-line);
}

@keyframes zoom {
	0% {
		opacity: 0;
		transform: scale(0);
	}

	70% {
		opacity: 0;
		transform: scale(0);
	}

	80% {
		opacity: 0.4;
		transform: scale(110%);
	}

	90% {
		opacity: 0.6;
		transform: scale(120%);
	}

	100% {
		opacity: 0;
		transform: scale(125%);
	}
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

@keyframes turntableShiny {
	0% {
		opacity: 0;

	}

	80% {
		opacity: 0.3;

	}

	81% {
		opacity: 0.9;

	}

	100% {
		opacity: 0;

	}
}

@keyframes apertureAnimation {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

@keyframes lightAnimation {
	0% {
		transform: rotate(0deg);
	}

	49.99% {
		transform: rotate(0deg);
	}

	50% {
		transform: rotate(22.5deg);
	}

	99.99% {
		transform: rotate(22.5deg);
	}

	100% {
		transform: rotate(0deg);
	}
}

@keyframes buttonAnimation {
	0% {
		transform: scale(1);
	}

	50% {
		transform: scale(.9);
	}

	100% {
		transform: scale(1);
	}
}
</style>
