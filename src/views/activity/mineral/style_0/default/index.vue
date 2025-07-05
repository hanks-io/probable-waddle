<!-- 红包雨活动 -->
<template>
	<ion-page>
		<!-- 导航标签 -->
		<ion-header class="ion-no-border">
			<ion-toolbar mode="ios">
				<BackButton slot="start" />
				<ion-title>{{ activityName }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<!-- 活动倒计时 -->
			<div v-show="showTimeOut" class="text-center text-base mt-2">
				<span class="py-1 px-1.5 rounded-[.3125rem] bg-[--color-bg-second] text-[---color-text-basic]">
					<span>{{ showEndCountdown ? $t('activity.activity') : $t('activity.foreverActivity') }}</span>
					<span v-if="activityStatus">{{ showEndCountdown ? $t('activity.end') : $t('activity.foreverEnd') }}</span>
					<span v-else-if="overTime > 0">{{ $t('activity.start') }}</span>
					<span v-else>{{ $t('activity.over') }}</span>
					<span v-if="overTime > 0">
						<span>{{ showEndCountdown ? $t('activity.countdown') : $t('activity.foreverCountDown') }}：</span>
						<span v-if="showEndCountdown">{{ overCountdown }}</span>
						<span v-else>{{ $t('activity.forever') }}</span>
					</span>
				</span>
			</div>
			<!-- 宝藏图 -->
			<div class="mx-4 my-3 flex items-center justify-center">
				<ion-img src="/images/activity/redPacketBg.png">
				</ion-img>
			</div>
			<div class="w-full flex flex-col items-center justify-end">
				<!-- 开采按钮 
				<div class="h-10 w-[17.5rem] flex items-center justify-center rounded-[.625rem] mt-[.625rem]"
					:class="canReceive && activityStatus ? 'button-enable' : 'button-disable'" v-if="endTime"
					@click="rewardModalHandle">
					<ion-spinner class="z-10 w-5 h-5" slot="start" name="bubbles" color="warning" v-if="btnLoading" />
					<ion-label class="text-sm">{{ canReceive ? $t('activity.redPacket3') :
						$t('viewsActivity.mined') }}</ion-label>
				</div>
				 封闭状态按钮
				<div class="button-disable h-10 w-[17.5rem] flex items-center justify-center rounded-[.625rem] mt-[.625rem]"
					v-else-if="startTime">
					<ion-label class="text-sm">{{ $t('activity.redPacket4', { time: startCountdown }) }}</ion-label>
				</div> -->
			</div>
			<!-- 活动信息 -->
			<div>
				<!-- 开启时间 -->
				<div class="explain-content relative flex items-center justify-center h-[9.6rem] mt-5">
					<p class="absolute top-0 left-6 text-[.9375rem] text-[---color-text-basic]">{{ $t('activity.redPacket5') }}</p>
					<div class="time-list w-5/6 max-h-[5rem] mt-[5px] overflow-y-auto" ref="scrollEl">
						<p v-for="(item, index) in timeConfig" :key="index" class="text-sm leading-6 text-center w-1/3"
							:data-active="isAfterNow(item)"
							:class="isAfterNow(item) ? 'text-[--color-text-emphasis] active' : 'text-[--color-text-second]'">{{
								calcTime(item.hour) }} -
							{{ calcTime(item.hour, item.durationIn) }}</p>

					</div>
				</div>
				<!-- 今日收益 -->
				<div class="explain-content relative flex items-center justify-center h-[9.6rem]">
					<p class="absolute top-0 left-6 text-[.9375rem] text-[---color-text-basic]">{{ $t('activity.redPacket6') }}</p>
					<div class="text-center earnings">
						<span>{{ merchantCy }}{{ formatMoneyToShow(rewardCount) }}</span>
					</div>
				</div>
				<!-- 开采说明 -->
				<div class="illustrate">
					<p class="text-xs keep-space">{{ rule }}</p>
				</div>
			</div>
		</ion-content>

		<Footer v-show="showReceiveBtn" bgColor="var(--color-btn-gradient-mineral)" >
			<!-- 开采按钮 -->
			<div class="btn"
				:class="canReceive && activityStatus ? 'enable shiny' : 'unable'" v-if="endTime"
				@click="rewardModalHandle">
				<ion-spinner class="z-10 w-5 h-5" slot="start" name="bubbles" color="warning" v-if="btnLoading" />
				<ion-label class="text-sm">{{ joinBtnText }}</ion-label>
			</div>
			<!-- 封闭状态按钮 -->
			<div class="unable btn"
				v-else-if="startTime">
				<ion-label class="text-sm">{{ $t('activity.redPacket4', { time: startCountdown }) }}</ion-label>
			</div>
		</Footer>
		<!-- 红包雨详情弹窗 -->
		<component :is="currentModel" :activityId="activityId" :openRedModel="openRedModel"  @closeModel="closeModel" />
	</ion-page>
	
</template>

<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonContent, IonToolbar, IonHeader, IonLabel, IonSpinner, IonImg, IonTitle } from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import Footer from '@/views/activity/comp/default/Footer/index.vue'
import useLogic from '@/views/activity/mineral/logic'
import { useModelComponents } from '@/views/tabbar/tabs/inicio/components/RedPacket/useModelComponents'

const currentModel = useModelComponents();
const {
	rule,
	endTime,
	overTime,
	startTime,
	rewardCount,
	overCountdown,
	btnLoading,
	startCountdown,
	activityName,
	activityStatus,
	showEndCountdown,
	canReceive,
	timeConfig,
	showTimeOut,
	rewardModalHandle,
	scrollEl,
	isAfterNow,
	calcTime,
	merchantCy,
	activityId,
	openRedModel,
	closeModel,
	joinBtnText,
	showReceiveBtn,
} = useLogic()


</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/mineral/style_0/default/style/base-index.less";
  @import "@/views/activity/mineral/style_0/default/style/theme-style.less";

	#activity-mineral-default-index.style();

	.blue-default {
		#activity-mineral-default-index.style(
			--color-bg-200,
			--color-text-gray-200,
			--accent-color-yellow,
			--theme-color-gradient-400,
			--color-bg-200,
			--color-text-white-100,
			--color-text-white-100,
			--accent-color-yellow,
			--color-text-gray-200
		);
	}

	.green-default {
		#activity-mineral-default-index.style(
			--color-bg-200,
			--color-text-gray-200,
			--accent-color-yellow,
			--theme-color-gradient-200,
			--color-bg-200,
			--color-text-gray-100,
			--color-text-gray-100,
			--accent-color-yellow,
			--color-text-gray-200
		);
	}

	.amber-purple {
		#activity-mineral-default-index.style(
			--color-bg-200,
			--text-color-light-purple-2-100,
			--accent-color-yellow,
			--theme-color-gradient-200,
			--color-bg-200,
			--text-color-light-purple-1-100,
			--text-color-light-purple-1-100,
			--accent-color-yellow,
			--text-color-light-purple-2-100
		);
	}
</style>
