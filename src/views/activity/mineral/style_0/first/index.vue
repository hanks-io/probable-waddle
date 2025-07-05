<!-- 红包雨活动 -->
<template>
	<ion-page>
		<!-- 导航标签 -->
    <NavigationBar :title="activityName"/>
		<ion-content>
			<!-- 活动倒计时 -->
			<div v-show="showTimeOut" class="text-center text-base mt-2">
				<span class="py-1 px-1.5 rounded-middle bg-200 color-text-100">
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
			<!-- 活动信息 -->
			<div>
				<!-- 开启时间 -->
				<div class="explain-content relative flex items-center justify-center h-[9.6rem] mt-5">
					<p class="absolute top-0 left-6 text-[.9375rem] color-text-100">{{ $t('activity.redPacket5') }}</p>
					<div class="time-list w-5/6 max-h-[5rem] mt-[5px] overflow-y-auto" ref="scrollEl">
						<p v-for="(item, index) in timeConfig" :key="index" class="text-sm leading-6 text-center w-1/3"
							:data-active="isAfterNow(item)"
							:class="isAfterNow(item) ? 'color-warning active' : 'color-text-40'">{{
								calcTime(item.hour) }} -
							{{ calcTime(item.hour, item.durationIn) }}</p>

					</div>
				</div>
				<!-- 今日收益 -->
				<div class="explain-content relative flex items-center justify-center h-[9.6rem]">
					<p class="absolute top-0 left-6 text-[.9375rem] color-text-100">{{ $t('activity.redPacket6') }}</p>
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
		<Footer v-show="showReceiveBtn">
			<!-- 开采按钮 -->
			<Button class="btn" v-if="endTime" :shiny="canReceive && activityStatus" :disabled="!(canReceive && activityStatus)" @click="rewardModalHandle">
				{{ joinBtnText }}
			</Button>
			<!-- 封闭状态按钮 -->
			<Button class="btn" v-else-if="startTime" :disabled="true">
				{{ $t('activity.redPacket4', { time: startCountdown }) }}
			</Button>
		</Footer>
		<!-- 红包雨详情弹窗 -->
		<component :is="currentModel" :activityId="activityId" :openRedModel="openRedModel"  @closeModel="closeModel" />
	</ion-page>
	
</template>

<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { IonPage, IonContent, IonToolbar, IonHeader, IonImg, IonTitle } from '@ionic/vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
import Button from '@/components/first/Button/index.vue'
import Footer from '@/views/activity/comp/first/Footer/index.vue';
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

<style scoped>
 .illustrate{
	width: 22.5rem;
	margin: 0.875rem auto 7rem;
	border-radius: var(--rounded-middle);
	background: var(--color-bg-200);
	color: var(--color-activity-rule);
	padding: .625rem ;
	line-height: 1.25rem;
	box-sizing: border-box;
	font-size: .75rem;
 }

.earnings {
	font-size: 1.25rem;
	font-weight: 400;
	color: var(--color-currency);
}

.time-list {
	display: flex;
	flex-wrap: wrap;
}

.explain-content {
	background: url('/svg/activity/mineral_explain_bg.svg') no-repeat;
	background-size: 100%;
	background-position: center;
}
.new-skin-symbol .color-text-40{
	color: var(--ep-color-text-weaker);
}


</style>
