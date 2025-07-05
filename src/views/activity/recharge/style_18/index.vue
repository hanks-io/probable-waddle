<!-- 充值活动 -->
<template>
	<ion-page class="recharge-container">
		<NavigationBar :title="activityInfo.name" />
		<ion-content class="recharge-content" :scrollY="true">
			<div v-if="isLoaded" class="recharge-top">
				<div v-if="activityInfo.mainMediaShare" class="share-wrapper">
					<SharePlatformBlock />
				</div>
				<AbRenderImg class="top-bg" :src="getImageUrl('img/activity/recharge/style_18/top-bg.png')">
					<span class="title">{{ $t("label.collectable") }}</span>
					<span class="myn">{{ formatMoneyToShow(activityInfo.awardCount) }}</span>
				</AbRenderImg>
				<div class="prize-list">
					<div class="prize-top">
						<div>{{ $t("activity.recharge8") }}</div>
						<div>{{ $t("activity.recharge9") }}</div>
					</div>
					<div class="prize-content" v-for="reward in rewardList" :key="reward.uuid">
						<div class="left">
							<AbRenderImg class="img" :src="getImageUrl('img/activity/recharge/style_18/pig.png')" />
							<span>{{ formatMoneyToShow(reward.conditionAmount) }}</span>
						</div>
						<div class="right">+{{ formatMoneyToShow(reward.rewardAmount) }}</div>
					</div>
				</div>
				<div class="recharge-info" :class="[showBtnClaim ? 'has-rec' : '' ] ">
					<div class="title">
						<AbRenderImg class="img" :src="getImageUrl('img/activity/recharge/style_18/tit-bg.png')" />
						<span>{{ $t("viewsActivity.lossFollow") }}</span>
						<AbRenderImg class="img right" :src="getImageUrl('img/activity/recharge/style_18/tit-bg.png')" />
					</div>
					<ul class="recharge-desc">
						<li v-for="(item, idx) in descriptionList.slice(1)" :key="idx">{{ item }}</li>
					</ul>
				</div>
				<div v-if="showBtnClaim" class="btn-wrapper">
					<Button :disabled="!activityInfo.awardCount" @click="claimHandle">
						{{ $t("activity.common001") }}
					</Button>
				</div>
			</div>

			<ion-skeleton-text v-if="!isLoaded" :animated="true" style="width: 100%; height: 100%;"></ion-skeleton-text>
		</ion-content>


	</ion-page>
</template>

<script setup lang="ts">
import {
	IonPage,
	IonContent,
	IonSkeletonText
} from "@ionic/vue";
import { formatMoneyToShow } from "@/utils/custom";
import useLogic from "../logic";
import NavigationBar from "@/components/NavigationBar/index.vue";
import AbRenderImg from "@/components/AbImage/AbRenderImg.vue";
import Button from "@/components/first/Button/index.vue";
import { getImageUrl } from "@/utils";
import SharePlatformBlock from "@/views/activity/comp/share/sharePlatformBlock.vue";

const {
	merchantCy,
	descriptionList,
	activityInfo,
	rewardList,
	showBtnClaim,
	isLoaded,
	claimHandle
} = useLogic();

</script>
<style scoped lang="less">
.recharge-content {

	.recharge-top {
		position: relative;

		.share-wrapper {
			width: 100%;
			padding: 0.75rem;
		}

		.prize-list {
			width: 22.875rem;
			margin: 0.625rem auto 1.25rem;
			padding: 0.75rem 1.25rem;
			font-size: 0.75rem;
			border-radius: 0.375rem;
			background-color: var(--ep-color-background-fill-surface-raised-L1);

			.prize-top {
				.flex-between();
				margin-bottom: 1.0625rem;
			}

			.prize-content {
				.flex-between();
				width: 20.5rem;
				height: 2.5rem;
				background: var(--ep-dynamic-primary);
				border-radius: 0.375rem;
				padding: 0.125rem;
				margin-bottom: 0.75rem;

				.left, .right {
					.flex-center();
					height: 100%;
					flex: 1;
					border-radius: 0.375rem 0 0 0.375rem;
					color: var(--ep-color-text-default);
					font-size: 1rem;
					font-weight: var(--ep-font-weight-medium);
				}

				.left {
					background: var(--ep-color-background-fill-body-default);
					position: relative;

					.img {
						width: 1.125rem;
						height: 1.125rem;
						margin-right: 0.375rem;

            &.ab-render-img {
              background-size: 100%;
            }
					}

					&::before {
						position: absolute;
						content: "";
						right: -0.0625rem;
						top: 0.875rem;
						width: 0.375rem;
						height: 0.625rem;
						background: var(--ep-dynamic-primary);
						clip-path: polygon(100% 0, 100% 100%, 0 50%);
					}
				}
			}
		}

		.recharge-info {
			padding-bottom: 1.25rem;
			&.has-rec {
				padding-bottom: calc(5.625rem + env(safe-area-inset-bottom));
			}

			.title {
				width: 100%;
				margin-bottom: 1.25rem;
				.flex-center();

				.img {
					width: 1.9125rem;
					height: 0.625rem;
          &.ab-render-img {
            background-size: 100%;
          }

					&.right {
						// 镜像左右调换
						transform: scaleX(-1);
					}
				}

				span {
					margin: 0 0.375rem;
					color: var(--color-text-default, #FFF);
					text-align: center;
					font-size: 1rem;
					font-weight: var(--ep-font-weight-medium);
				}
			}

			.recharge-desc {
				padding: 1.125rem 0.375rem 1.125rem 0.9375rem;
				margin: 0 0.9375rem;
				border-radius: 0.375rem;
				background: var(--ep-color-background-fill-surface-lowered, #101B3C);
				color: var(--ep-color-text-weak);

				li {
					margin-top: 0.9375rem;

					&:first-child, &:last-child {
						margin-top: 0;
					}
				}
			}
		}
	}


	.top-bg {
		position: relative;
		width: 24.375rem;
		height: 20.625rem;

    &.ab-render-img {
      background-size: 100%;
    }


		.title {
			position: absolute;
			font-weight: var(--ep-font-weight-medium);
			font-size: 0.875rem;
			color: var(--ep-color-text-highlight-white);
			text-align: center;
			bottom: 3.4375rem;
			width: 7.5rem;
			left: 10rem;
		}

		.myn {
			position: absolute;
			color: var(--ep-color-text-highlight);
			text-align: center;
			font-weight: 700;
			font-size: 0.875rem;
			bottom: 1.75rem;
			width: 7.5rem;
			left: 10rem;
		}
	}

	.btn-wrapper {
		position: fixed;
		bottom: env(safe-area-inset-bottom);
		padding: 1rem;
		width: 100%;
		background: var(--ep-color-background-fill-surface-raised-L1);
	}
}
</style>
