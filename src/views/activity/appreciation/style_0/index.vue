<!-- 会员答谢 -->
<template>
	<ion-page>
	  <ion-content>
		<!-- 导航标签 -->
		<ion-header class="ion-no-border">
		  <ion-toolbar mode="ios">
			<BackButton slot="start"  />
			<ion-title>{{ activityInfo.name }}</ion-title>
		  </ion-toolbar>
		</ion-header>
		<!-- 活动时间 -->
		<div class="banner">
		  <div class="boardBox">
			<div class="timeBoard  leading-[0.9375rem]">
			  <p class="textBasic font-[400] text-[0.625rem]">{{ $t('activity.appreciation01') }}</p>
			  <p class="textEmphasis font-[700] text-[0.625rem]">{{ activityInfo.endTime }}</p>
			  <p></p>
			</div>
		  </div>
		</div>
		<div class="mx-auto w-[21.25rem]">
		  <div class="des">
			<!-- 循环周期 -->
			<div>
			  <div class="flex items-center mt-[3.25rem] mb-[0.5625rem]">
				<ion-icon class=" text-2xl" icon="/first/svg/mysterious-icon1.svg"></ion-icon>
				<span class="ml-1 font-medium text-sm leading-7  title-text">{{ $t('activity.appreciation02')
				  }}</span>
			  </div>
			  <div class="item w-full h-[3rem] rounded-[0.5rem]  flex items-center justify-center">
				<span class="textTime text-xl font-bold">
				  {{ activityInfo.cycle }}
				</span>
			  </div>
			</div>
			<!-- 奖励金额 -->
			<div>
			  <div class="flex items-center mt-[1.5rem] mb-[0.5625rem]">
				<ion-icon class="text-[1.6875rem]" icon="/first/svg/mysterious-icon2.svg"></ion-icon>
				<span class="ml-1 font-medium text-sm leading-7  title-text">{{ $t('activity.appreciation12')
				  }}</span>
			  </div>
			  <div class="item w-full h-[3rem] rounded-[0.5rem]  flex items-center justify-center">
				<span>
				  <span class="textCoin">{{ merchantCy+' ' }}</span>
				  <span class="textReward">{{ activityInfo.maxReward }}</span>
				</span>
			  </div>
			</div>
		  </div>
		  <!-- 活动规则 -->
		  <div class="mt-[1.5rem] pb-28">
			<p class="ruleHeader mb-[0.75rem]">{{ $t('activity.appreciation13') }}</p>
			<div class="ruleItem text-[1rem] font-normal textRule  text-[#7F8EB3]  mb-3" >
			  <p class="ruleDes keep-space">
					{{ activityInfo.description }}
			  </p>
			</div>
		  </div>
		</div>
	  </ion-content>
	  <Footer v-if="skin == 'default'">
		<!-- 领取按钮 -->
		<div class="btn" :class="activityInfo.canReceive ? 'shiny active' : 'unable'" @click="onActivityApply">{{
		  $t('toggle.claim') }}</div>
	  </Footer>
	  <FooterFirst v-if="skin == 'first'">
			<ButtonFirst :disabled="!activityInfo.canReceive" :shiny="activityInfo.canReceive" @click="onActivityApply">
			{{$t('toggle.claim') }}
			</ButtonFirst>
		</FooterFirst>
		<FooterSecond v-if="skin == 'second'">
			<ButtonSecond :disabled="!activityInfo.canReceive" :shiny="activityInfo.canReceive" @click="onActivityApply">
			{{$t('toggle.claim') }}
			</ButtonSecond>
		</FooterSecond>
	</ion-page>
  </template>

<script setup lang="ts">
import { IonPage, IonContent, IonToolbar, IonHeader, IonIcon, IonTitle } from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import Footer from '@/views/activity/comp/default/Footer/index.vue';
import FooterFirst from '@/views/activity/comp/first/Footer/index.vue';
import ButtonFirst from '@/components/first/Button/index.vue'
import FooterSecond from '@/views/activity/comp/second/Footer/index.vue';
import ButtonSecond from '@/components/second/Button/index.vue'
import useLogic from '../logic';
import { getTheme } from '@/theme/hooks';
const { skin } = getTheme();
const { activityInfo, merchantCy, onActivityApply,forbidContextmenu } = useLogic();

</script>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/activity/appreciation/style_0/style/base-index.less";
  @import "@/views/activity/appreciation/style_0//style/theme-style.less";

	#activity-appreciation-default-index.style();

	.blue-default {
		#activity-appreciation-default-index.style();
	}

	.green-default {
		#activity-appreciation-default-index.style();
	}

	.amber-purple .default {
		#activity-appreciation-default-index.style(
			@appreciation-default-index-04: --color-bg-200,
			@appreciation-default-index-09: --color-bg-100
		);
	}

	.yellow-dark,
	.green-dark {
		#activity-appreciation-default-index.style(
			--color-activity-time,
			--color-warning,
			--color-appreciation-currency,
			--color-appreciation-board,
			--accent-color-blue,
			--color-appreciation-title,
			--color-warning,
			--color-appreciation-currency,
			--color-bg-200,
		);
	}

	.purple-light {
		#activity-appreciation-default-index.style(
			--color-activity-time,
			--color-warning,
			--color-appreciation-currency,
			--color-appreciation-board,
			--accent-color-blue,
			--color-appreciation-title,
			--color-warning,
			--color-appreciation-title,
			--color-bg-100,
		);
	}

	.amber-purple .second {
		#activity-appreciation-default-index.style(
			--color-activity-time,
			--color-text-orange-emphasis,
			--color-text-first,
			--color-bg-fifth,
			--accent-color-blue,
			--color-text-first,
			--color-text-yellow-emphasis,
			--color-text-second,
			--color-bg-100,
		);
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
	}
	.green-dark {
    .footer .btn{
      width: 22.875rem;
      height: 2.875rem;
      border-radius: 0.375rem;
      background: var(--theme-color-800);  
      &.unable{
        opacity: 0.5;
      }
    }
  }
	.new-skin-symbol {
		ion-toolbar {
         --background: var(--ep-color-background-fill-top-nav-secondary);
        }
		ion-title {
			color: var(--ep-color-text-default);
            font-size: var(--ep-font-size-xl);
            font-weight: var(--ep-font-weight-medium)
		}
		.timeBoard {
			.textBasic {
				color: var(--ep-color-text-highlight-white);
				font-size: var(--ep-font-size-xs);
				font-weight: var(--ep-font-weight-regular)
			}
			.textEmphasis {
				color: var(--ep-color-text-warning);
				font-size: var(--ep-font-size-xs);
				font-weight: var(--ep-font-weight-bold)
			}
		}
		.title-text {
			color: var(--ep-color-text-default);
			font-size: var(--ep-font-size-m);
			font-weight: var(--ep-font-weight-medium)
		}
		.item {
			background: var(--ep-color-background-fill-surface-raised-L1);
			border-radius: var(--ep-border-radius-m);
			.textTime {
				color: var(--ep-color-text-info);
			    font-size: var(--ep-font-size-xl);
			    font-weight: var(--ep-font-weight-bold)
			}
			.textCoin {
				color: var(--ep-color-text-default);
			    font-size: var(--ep-border-radius-surface-large);
			    font-weight: var(--ep-font-weight-bold)
			}
			.textReward {
				color: var(--ep-color-text-warning);
			    font-size: var(--ep-border-radius-surface-large);
			    font-weight: var(--ep-font-weight-bold)
			}
		}
		.ruleHeader {
			color: var(--ep-color-text-default);
			font-size: var(--ep-font-size-s);
			font-weight: var(--ep-font-weight-medium);
		}
		.ruleItem {
			margin-bottom: 0;
			.ruleDes {
				color: var(--ep-color-text-weaker);
				font-size: var(--ep-font-size-s);
				font-weight: var(--ep-font-weight-regular);
			}
		}
		.btn {
      box-shadow: none;
			border-radius: var(--ep-border-radius-m);
			font-size: var(--ep-font-size-m);
			font-weight: var(--ep-font-weight-bold);
		}
        .btn.unable {
			background: var(--ep-color-background-fill-active-disabled);
			color: var(--ep-color-text-inverse-disabled);
		}
		.btn.active {
			background: var(--ep-dynamic-primary);
			color: var(--ep-color-text-default);
		}
		
	}
	
</style>

