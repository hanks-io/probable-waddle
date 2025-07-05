<!-- 推广说明 -->
<template>
	<div class="px-2">
		<div
			class="m-2.5 border pb-4 border-[--color-border] text-[.625rem] text-center rounded-[.625rem]"
		>
			<div class="flex border-[--color-border] py-3 px-2 items-center">
				<Avatar
					color="#ffaa09"
					agentlevel="A"
					:avatarStyle="avatarStyle"
				/>
				<ul class="text-left ml-4 leading-5 w-2/3">
					<li>
						<span class="inline-block color-text-100" :class="className">{{
							`${$t("spread.totalPerformance")}  28500`
						}}</span
						><span class="inline-block color-text-100" :class="className"
							>{{ $t("spread.totalCommission") }}
							<em class="text-[#ffaa09]"> 225</em></span
						>
					</li>
					<li>
						<span class="inline-block color-text-100" :class="className">{{
							`${$t("spread.directPerformance")}  5500`
						}}</span
						><span class="inline-block color-text-100" :class="className"
							>{{ $t("spread.directCommission") }}
							<em class="text-[#ffaa09]">165</em></span
						>
					</li>
					<li>
						<span class="inline-block color-text-100" :class="className">{{
							`${$t("spread.otherPerformance")}  3000`
						}}</span
						><span class="inline-block color-text-100" :class="className"
							>{{ $t("spread.otherCommission") }}
							<em class="text-[#ffaa09]"> 60</em></span
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
					<span>{{ `C1${$t("spread.contributesTo")}A` }}
						<em class="text-[#ffaa09]"> 20</em>
						<br />
						{{ `${$t("spread.fromDifferentials")}2%` }}
					</span>
				</small-box>

				<small-box classNames="c3-right w-[6.3rem] absolute z-20">
					<span>{{ `C3${$t("spread.contributesTo")}A` }}
						<em class="text-[#ffaa09]"> 0</em>
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

						<em class="text-[#ffaa09]"> 40</em>
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
		<div class="tutorial-detail border border-[--color-border] text-[--text-color-light-purple-2-100]">
			<h1 class="text-[--text-color-light-purple-1-100]"><strong>{{$t("spread.example")}}</strong></h1>
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
.c1-left{
	top: 1rem;
}
.c3-right{
	top: 1rem;
	right: 0;
}
.top-box-area{
	top: -.2rem;
}

.C2-toA {
	right: 3.6rem;
	position: absolute;
	top: -2.9rem;
}
.b1-arrow {
	left: 2.2rem;
	transform: rotate(30deg);
	bottom: 5.1rem;
}
.b2-arrow {
	left: 36%;
	bottom: 5rem;
}
.b3-arrow {
	right: 2rem;
	transform: rotate(-30deg);

	bottom: 5.1rem;
}
.c1-arrow-toB1 {
	bottom: 3.8rem;
	left: 0.5rem;
}
.c2-arrow-toB1 {
	bottom: 4.2rem;
	left: 23%;
	transform: rotate(-28deg);
}
.c3-arrow-toB3 {
	right: 0.7rem;
	bottom: 3.8rem;
}
.c2-arrow-toA {
	bottom: 5.2rem;
	left: 24%;
}
.c1-arrow-toA {
	bottom: 5.2rem;
	left: -6.6rem;
}
.c3-arrow-toA {
	bottom: 5.2rem;
	right: -6.6rem;
	transform: scaleX(-1);
}
.tutorial-detail {
	border-radius: 0.28rem;
	font-size: 0.6rem;
	padding: 0.4rem;
}
.tutorial-detail h1 {
	font-size: 0.7rem;
	margin: 0;
}
.tutorial-detail p {
	text-indent: 0.9rem;
}
</style>
