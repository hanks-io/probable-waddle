<!-- 推广说明 -->
<template>
	<div class="px-2">
		<div
			class="m-2.5 border pb-4 border-[#2A324E] newest-border text-[.625rem] text-center rounded-[.625rem]"
		>
			<div class="flex border-[#2A324E] py-3 px-2 items-center">
				<Avatar
					color="#ffaa09"
					agentlevel="A"
					:avatarStyle="avatarStyle"
				/>
				<ul class="text-left ml-4 leading-5 w-2/3">
					<li>
						<span class="inline-block newest-white-color" :class="className">{{
							`${$t("spread.totalPerformance")}  28500`
						}}</span
						><span class="inline-block newest-white-color" :class="className"
							>{{ $t("spread.totalCommission") }}
							<em class="money-text"> 225</em></span
						>
					</li>
					<li>
						<span class="inline-block newest-white-color" :class="className">{{
							`${$t("spread.directPerformance")}  5500`
						}}</span
						><span class="inline-block newest-white-color" :class="className"
							>{{ $t("spread.directCommission") }}
							<em class="money-text">165</em></span
						>
					</li>
					<li>
						<span class="inline-block newest-white-color" :class="className">{{
							`${$t("spread.otherPerformance")}  3000`
						}}</span
						><span class="inline-block newest-white-color" :class="className"
							>{{ $t("spread.otherCommission") }}
							<em class="money-text"> 60</em></span
						>
					</li>
				</ul>
			</div>
		</div>
		<div class="relative p-2 mt-2">
			<div class="c2-arrow-toA absolute">
				<ion-icon
					class="text-[17rem]"
					src="/svg/spread/link_green_2.svg"
				/>
			</div>
			<div class="c1-arrow-toA absolute">
				<ion-icon
					class="text-[17rem]"
					src="/svg/spread/link_green_1.svg"
				/>
			</div>
			<div class="c3-arrow-toA absolute">
				<ion-icon
					class="text-[17rem]"
					src="/svg/spread/link_green_1.svg"
				/>
			</div>
            <div class="pt-14">
				  	<small-box classNames="c1-left w-[6.3rem] absolute z-20">
					<span
						>{{ `C1${$t("spread.contributesTo")}A` }}
						<em class="money-text"> 20</em>
						<br />
						{{ `${$t("spread.fromDifferentials")}2%` }}
					</span>
				</small-box>

				<small-box classNames="c3-right w-[6.3rem] absolute z-20">
					<span
						>{{ `C3${$t("spread.contributesTo")}A` }}

						<em class="money-text"> 0</em>
						<br />
						{{ $t("spread.infiniteDifference") }}
					</span>
				</small-box>
                <ul class="flex items-center justify-between relative mb-1 z-10">
				<agent-item v-bind="agentB1">
					<div class="b1-arrow absolute">
						<ion-icon
							class="text-[6rem]"
							src="/svg/spread/link_blue_4.svg"
						/>
					</div>
				</agent-item>
				<agent-item v-bind="agentB2">
					<div class="b2-arrow absolute">
						<ion-icon
							class="text-[6rem]"
							src="/svg/spread/link_blue_4.svg"
						/>
					</div>
				</agent-item>
				<agent-item v-bind="agentB3">
					<div class="b3-arrow absolute">
						<ion-icon
							class="text-[6rem]"
							src="/svg/spread/link_blue_4.svg"
						/>
					</div>
				</agent-item>
			</ul>

			</div>
			

			<div class="relative z-10 mt-[3.1rem]">
				<small-box classNames="C2-toA w-[6rem]">
					<span
						>{{ `C2${$t("spread.contributesTo")}A` }}

						<em class="money-text"> 40</em>
						<br />
						{{ `${$t("spread.fromDifferentials")}2%` }}
					</span>
				</small-box>
				<ul class="flex items-center justify-between relative">
					<agent-item v-bind="agentC1">
						<div class="c1-arrow-toB1 absolute">
							<ion-icon
								class="text-[6rem]"
								src="/svg/spread/link_green_4.svg"
							/>
						</div>
					</agent-item>
					<agent-item v-bind="agentC2">
						<div class="c2-arrow-toB1 absolute">
							<ion-icon
								class="text-[6rem]"
								src="/svg/spread/link_green_4.svg"
							/>
						</div>
					</agent-item>
					<agent-item v-bind="agentC3">
						<div class="c3-arrow-toB3 absolute">
							<ion-icon
								class="text-[6rem]"
								src="/svg/spread/link_green_4.svg"
							/>
						</div>
					</agent-item>
				</ul>
			</div>
		</div>
		<div class="tutorial-detail border border-[#293548] newest-border newest-minor-color text-[#6D788E]">
			<h1><strong>{{$t("spread.example")}}</strong></h1>
			<p>
				{{$t('spread.textSnippet')}}
			</p>

			<div>{{$t('spread.context')}}</div>
			<ul v-html="$t('spread.htmlText')" ></ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import Avatar from "./Avatar.vue";
import { IonIcon } from "@ionic/vue";
import SmallBox from "./SmallBox.vue";
import AgentItem from "./AgentItem.vue";
import { useAgentNewestLogic } from '@/views/spread/hooks/agentNewestLogic'

const {
  className,
  avatarStyle,
  agentB1,
  agentB2,
  agentB3,
  agentC1,
  agentC2,
  agentC3,
} = useAgentNewestLogic();

</script>

<style scoped lang="less">
  @import "@/views/spread/default/styles/AgentNetwork/Newest/base.less";
  @import "@/views/spread/default/styles/AgentNetwork/Newest/theme-style.less";

	#spread-default-components-agentNetwork-components-newest.style();

	.blue-default {
		#spread-default-components-agentNetwork-components-newest.style(
			--color-border-600,
			--color-text-white-100,
			--color-text-gray-200,
			--accent-color-orange-1
		);
	}

	.green-default,
	.forest-green {
		#spread-default-components-agentNetwork-components-newest.style(
			--color-line,
			--color-text-gray-100,
			--color-text-gray-200,
			--accent-color-yellow
		);
	}

	.amber-purple {
		#spread-default-components-agentNetwork-components-newest.style(
			--line-color,
			--text-color-light-purple-1-100,
			--text-color-light-purple-2-100,
			--accent-color-yellow
		);
	}
</style>
