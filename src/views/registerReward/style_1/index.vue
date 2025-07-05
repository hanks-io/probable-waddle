<script setup lang="ts">
import {
	IonPage,
	IonContent,
	IonIcon,
	IonButton
} from "@ionic/vue";

import useLogic from "../logic";
import NavigationBar from "@/components/NavigationBar/index.vue";

const {
	navigate,
	isSpinning,
	isStart,
	blocks,
	prizes,
	buttons,
	startCallback,
	endCallback,
	currentRegionCode,
	deviceTypes,
	multiple,
	getRegisterRewardInfo,
	isNotWinner,
  luckyRef,
} = useLogic();

const route = useRoute();
const userStore = useUserStore();

watch(() => route.path, (newPath) => {
	if (newPath == "/subscribeReward") {
		getRegisterRewardInfo();
	}
}, { immediate: true });


onMounted(async () => {
	await userStore.setUser();
	isNotWinner.value = !userStore.user?.canApplyRegisterReward;
});

</script>

<template>
	<ion-page>
		<!-- 顶部导航栏 -->
		<NavigationBar :title="$t('registerReward.000001')">
			<template #start>
				<ion-button mode="md" class="nav-btn" fill="clear" @click="navigate">
					<ion-icon class="back" src="/svg/arrow_left.svg" />
				</ion-button>
			</template>
		</NavigationBar>

		<ion-content class="registration-bonus">
			<div :class="['registerReward-content', { 'spinning': isSpinning }]">

			</div>
			<div class="lucky-Whee-area">
				<div :class="['lighter', { 'lighter-animation': isStart }]"></div>
				<div :class="['lighter-2', { 'lighter-2-animation': isStart }]"></div>
				<div class="pointer-area">
					<img src="@/assets/img/registerReward/style_1/pointer.png" alt="">
				</div>


				<div class="lucky-Whee-content">
					<LuckyWheel ref="luckyRef" width="18.25rem" height="18.25rem" :blocks="blocks" :prizes="prizes"
											:buttons="buttons"
											:defaultConfig="{ offsetDegree: -22, speed: 10, accelerationTime: 1800, decelerationTime: 3000 }"
											@start="startCallback" @end="endCallback" />
				</div>
			</div>

			<div class="registerReward-img-area">
				<div class="registerReward-img1">
					<img src="@/assets/img/registerReward/style_1/img1.png" alt="">
				</div>
				<div class="registerReward-img2">
					<img src="@/assets/img/registerReward/style_1/img2.png" alt="">
				</div>
				<div class="registerReward-img3">
					<img src="@/assets/img/registerReward/style_1/img3.png" alt="">
				</div>
			</div>

			<div class="text-desc-area">
				<div class="content-wrapper">
					<div class="title-text">
						{{ $t("registerReward.000004") }}
					</div>
					<ul>
						<li>1: {{ currentRegionCode === "BR" ? $t("registerReward.000005") : $t("registerReward.000021") }}</li>
						<li>2: {{ $t("registerReward.000006", { deviceType: deviceTypes }) }}</li>
						<li>3: {{ $t("registerReward.000007", { multiple: multiple }) }}</li>
						<li>4: {{ $t("registerReward.000008") }}</li>
					</ul>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<style scoped lang="less">
ion-button {
	--padding-start: 0.875rem;
	--padding-end: 0.875rem;
	margin-top: 0;
	margin-bottom: 0;
	margin-inline-start: 0;
	margin-inline-end: 0;
	--color: var(--ep-color-text-default, var(--color-toolbar-text, var(--text-color-white-100)));
}

.nav-btn {
	height: 3.125rem;
}

ion-header ion-toolbar {
	--background: #262624;
	box-shadow: 0px 4px 28.4px 0px #0000001A;
}

.arrow-left {
	font-size: 20px;
	cursor: pointer;
	margin-top: 10px;
}

.registerReward-title {
	color: #ffff;
}

.registration-bonus {
	--background: url('@/assets/img/registerReward/style_1/content-bg.png') no-repeat center center / cover;
}

.registerReward-content {
	width: 24.375rem;
	height: 24.375rem;
	background: url('@/assets/img/registerReward/style_1/di1.png') no-repeat center center / 100% 100%;
	position: absolute;

}

.spinning {
	animation: spin 8s linear infinite;
	/* 动画 */
	animation-fill-mode: forwards
}

.lucky-Whee-area {
	width: 20rem;
	height: 20rem;
	margin: 2rem auto 0;
	position: relative;
	background: url('@/assets/img/registerReward/style_1/border.png') no-repeat center center / 100% 100%;

	.lucky-Whee-content {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 18.25rem;
		height: 18.25rem;
		transform: translate(-50%, -50%);
		z-index: 1;
	}

	.pointer-area {
		width: 2.3125rem;
		height: 1rem;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 20;
	}

	.lighter {
		position: absolute;
		width: 18.25rem;
		height: 18.25rem;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		border-radius: 50%;
		background: url('@/assets/img/registerReward/style_1/guangxiao1.png') no-repeat center center / 100% 100%;
		opacity: 0;
		z-index: -10;
	}

	.lighter-animation {
		z-index: 10;
		animation: lighter .5s;
	}

	.lighter-2 {

		position: absolute;
		width: 18.25rem;
		height: 18.25rem;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		border-radius: 50%;
		background: url('@/assets/img/registerReward/style_1/guangquan1.png') no-repeat center center / 100% 100%;
		z-index: -10;
	}
}

.lighter-2-animation {
	animation: lighter .5s;
	animation-delay: 0.1s;
}

.registerReward-img-area {
	width: 20rem;
	height: 4.8125rem;
	position: relative;
	margin: -2rem auto -3px;

	.registerReward-img1 {
		position: absolute;
		width: 8.125rem;
		height: 4.8125rem;
		top: 0;
		left: 0;
	}

	.registerReward-img2 {
		position: absolute;
		width: 4.125rem;
		height: 2.6875rem;
		bottom: 0.1875rem;
		right: 4.25rem;
		z-index: 10;
	}

	.registerReward-img3 {
		position: absolute;
		width: 5.25rem;
		height: 4.875rem;
		bottom: 0.1875rem;
		right: 0;
	}
}

.text-desc-area {
	width: 21.25rem;
	min-height: 14.5625rem;
	margin: 0 auto;
	position: relative;
	border-radius: 1.25rem;
	padding: 0.25rem;
	background: conic-gradient(from 180deg at 50% 50%,
	#F8F9FD 0deg,
	#86B4D5 78.24deg,
	#D0E2E8 152.94deg,
	#A9CEE9 198.28deg,
	#D0E2E8 242.43deg,
	#86B4D5 311.4deg,
	#F8F9FD 360deg);

	&::before {
		content: '';
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		right: 0.25rem;
		bottom: 0.25rem;
		border-radius: 1rem;
		background: linear-gradient(180deg,
		#1B519D 0%,
		#49A7DA 50.5%,
		#1B519D 100%);
		box-shadow: inset 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
	}

	&::after {
		content: '';
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		right: 0.25rem;
		height: 50%;
		border-radius: 1rem 1rem 0 0;
		background: linear-gradient(180deg,
		rgba(255, 255, 255, 0.1) 0%,
		rgba(255, 255, 255, 0) 100%);
		pointer-events: none;
	}

	.content-wrapper {
		position: relative;
		z-index: 1;
		height: 100%;
		padding: 1.6875rem 1.1875rem 1.4375rem;
		color: #fff;

		div:first-child {
			text-align: center;
			font-size: 1.125rem;
			font-weight: 700;
			font-family: Inter;
			margin-bottom: 1rem;
			text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8),
				-4px -4px 8px rgba(255, 255, 255, 0.15);
		}

		ul {
			li {
				font-size: 12px;
				text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.5),
					1px -1px 0 rgba(0, 0, 0, 0.5),
				-1px 1px 0 rgba(0, 0, 0, 0.5),
				1px 1px 0 rgba(0, 0, 0, 0.5);
			}
		}
	}
}

.light-img {
	width: 19.5625rem;
	height: 19.5625rem;
	position: absolute;
	bottom: 0;
	left: 0;
	top: 0;
	right: 0;
	margin: auto;
	z-index: 10;
	transform-origin: center;
}

.wheel-light {
	animation-name: lightAnimation;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	pointer-events: none;
}

.wheel-banner {
	pointer-events: none;
}

.footer {
	width: 24.375rem;
	height: 5rem;
	background: #262624;
	border-top: 1px solid #292D36;
	box-shadow: none;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
		/* 起始位置 */
	}

	to {
		transform: rotate(360deg);
		/* 结束位置 */
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

@keyframes lighter {
	0% {
		transform: scale(0.3);
		opacity: 1;
	}

	50% {
		opacity: 1;
	}

	100% {
		transform: scale(1.8);
		opacity: 0;
	}
}

@keyframes lighter-2 {
	0% {
		transform: scale(.8);
	}

	100% {
		opacity: 0;
		transform: scale(1.8);
	}
}

.title-text {
	text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.5),
		1px -1px 0 rgba(0, 0, 0, 0.5),
	-1px 1px 0 rgba(0, 0, 0, 0.5),
	1px 1px 0 rgba(0, 0, 0, 0.5);
}
</style>
