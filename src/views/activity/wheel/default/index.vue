<!-- 幸运大转盘活动 -->
<template>
	<ion-page>
		<!-- 导航标签 -->
		<ion-header class="ion-no-border">
			<ion-toolbar mode="ios">
				<BackButton slot="start" :isUpdateRedPoint="true" />
				<ion-title>{{ activityName }}</ion-title>
				<div class="h-[1.875rem] pt-1.5 rounded-[.3125rem] mr-4" slot="end" @click="toRecordHandle">
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
							<span class="py-1 px-1.5 rounded-[.3125rem] text-[--color-text-second] bg-[--color-bg-second]">
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
						<span class="text-xl text-white ml-1">{{ `x${wheelInfo.lotteryTicketGetCount}` }}</span>
					</div>
				</div>
			</div>
			<!-- 奖品类型与保有量 -->
			<div class="flex justify-around px-1">
				<div class="w-[4.375rem] h-[5.625rem] flex flex-col rounded-[.3125rem]"
					:class="isRedeemable ? 'shiny' : ''" :style="setCardStyle(`prop_${item.name}`)"
					v-for="(item, index) in rewardCards" :key="index">

					<div class="flex-1 flex items-center justify-center">
						<span class="card-name text-4xl font-black" :style="setCardNameStyle(`prop_${item.name}`)">{{
							item.name.charAt(0) }}</span>
					</div>
					<div class="h-5 flex items-center justify-center">
						<span class="text-base font-black" :style="setAccountStroke(`prop_${item.name}`)">x{{
							item.amount }}</span>
					</div>
				</div>
			</div>
			<div class="flex flex-col items-center mt-4">
				<div class="button h-[2.1875rem] w-[10rem] flex items-center justify-center rounded-[.625rem]"
					:class="isRedeemable ? 'shiny' : ''" @click="exchangeHandle">
					<ion-label class="text-sm text-[--color-text-unThemeWhite]">{{ $t('activity.redeem2') }}</ion-label>
				</div>
				<div class="text-xs text-[--color-text-second] text-center my-4">
					{{ $t('viewsActivity.collectTips', {
						type: '"H","A","P","P","Y"', merchantCy:
						merchantCy, money: formatMoneyToShow(moneyConvertToClient(wheelInfo.exchangeReward))
					}) }}
				</div>
				<div class="h-[1px] w-[23.125rem] bg-[--color-bg-second]" />
				<div class="flex items-center mt-4">
					<img class="w-7" src="/svg/activity/adorn.svg" />
					<span class="font-black text-lg mx-2 text-[--color-text-basic]">{{ $t('viewsActivity.obtainRewardTickets') }}</span>
					<img class="w-7" src="/svg/activity/adorn.svg" style="transform:scaleX(-1)" />
				</div>
				<!-- 奖券领取信息 -->
				<div class="w-[21.875rem] rounded-[.625rem] bg-[--color-bg-second] px-2.5 py-2 mb-2.5" v-for="item in wheelInfo.lotteryTicketGet" :key="item.uuid">
					<div class="flex justify-between">
						<span class="text-base text-[--color-text-second]">{{ $t(`activity.${item.type}`) }}{{ item.type == 'firstLogin' ? '' :
							`(${formatMoneyToShow(moneyConvertToClient(item.conditionAmount))})` }}</span>
						<span class="text-[--color-text-second]">{{ item.receiveCount > item.triggerCount ? item.triggerCount : item.receiveCount }}/{{
							item.triggerCount }}</span>
					</div>
					<div class="flex justify-between mt-1.5 ">
						<div class="flex-1 flex items-center">
							<img class="w-8 mr-0.5" src="/svg/activity/ticket.svg" /><span class="text-[--color-text-basic]">x{{ item.amount }}</span>
						</div>
						<div class="finish h-[1.3125rem] flex items-center justify-center rounded-[.3125rem] px-2"
							v-if="item.receiveCount >= item.triggerCount || item.type == 'firstLogin'"
							v-show="item.type != 'firstLogin' || item.receiveCount">
							<ion-label class="text-sm text-[#EEC7FF] leading-none">{{ $t('viewsActivity.completed')
								}}</ion-label>
						</div>
						<div class="button h-[1.3125rem] flex items-center justify-center rounded-[.3125rem] px-2"
							v-else-if="['validBet', 'cumulativeValidBet'].includes(item.type)" @click="gameHandle">
							<ion-label class="text-sm leading-none text-[--color-text-unThemeWhite]">{{ $t('label.bettings') }}</ion-label>
						</div>
						<div class="button h-[1.3125rem] flex items-center justify-center rounded-[.3125rem] px-2"
							v-else @click="router.push('/recharge/apply')">
							<ion-label class="text-sm leading-none text-[--color-text-unThemeWhite]">{{ $t('activity.Recharge') }}</ion-label>
						</div>
					</div>
				</div>
				<!-- 活动规则规则 -->
				<div class="w-[21.875rem] text-start pl-[0.625rem] py-[0.625rem] bg-[--color-bg-second] mb-[1.375rem] rounded-[0.625rem]">
					<!-- <p class="text-sm pb-[0.625rem] text-[#616D93] font-bold">{{ $t('viewsActivity.gameRules') }}</p> -->
					<p class="text-xs text-[--color-text-second] whitespace-pre-line keep-space">{{ rule }}</p>
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

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/wheel/default/style/base-index.less";
  @import "@/views/activity/wheel/default/style/theme-style.less";

	#activity-wheel-default-index.style();

  .blue-default {
		#activity-wheel-default-index.style(
			--color-bg-200,
			--color-text-gray-200,
			--color-text-gray-200,
			--color-text-white-100,
			--color-text-white-100,
			--color-bg-200,
			--color-text-white-100,
			--color-text-white-100,
			--color-bg-200,
			--color-text-gray-200
		);
  }

  .green-default {
		#activity-wheel-default-index.style(
			--color-bg-200,
			--color-text-gray-200,
			--color-text-gray-200,
			--color-text-white-100,
			--color-text-gray-100,
			--color-bg-200,
			--color-text-gray-100,
			--color-text-white-100,
			--color-bg-200,
			--color-text-gray-200
		);
  }

	.amber-purple { 
		#activity-wheel-default-index.style(
			--color-bg-300,
			--text-color-light-purple-2-100,
			--text-color-light-purple-2-100,
			--text-color-white-100,
			--text-color-light-purple-1-100,
			--color-bg-200,
			--text-color-light-purple-1-100,
			--text-color-white-100,
			--color-bg-200,
			--text-color-light-purple-2-100
		);
	}
</style>
