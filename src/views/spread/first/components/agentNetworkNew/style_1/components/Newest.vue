<!-- 推广说明 -->
<template>
	<div class="px-2">
		<div
			class="m-2.5 pb-4 spread-agent-explanation-border spread-agent-explanation-info text-center"
		>
			<div class="flex py-3 px-2 items-center">
				<Avatar
					:color="avatarColor"
					agentlevel="A"
					:avatarStyle="avatarStyle"
				/>
				<ul class="text-left ml-4 leading-5 w-2/3">
					<li>
						<span class="inline-block spread-agent-explanation-text-100" :class="className">{{
							`${$t("spread.totalPerformance")}  28500`
						}}</span
						><span class="inline-block spread-agent-explanation-text-100" :class="className"
							>{{ $t("spread.totalCommission") }}
							<em class="spread-agent-explanation-text-amount"> 225</em></span
						>
					</li>
					<li>
						<span class="inline-block spread-agent-explanation-text-100" :class="className">{{
							`${$t("spread.directPerformance")}  5500`
						}}</span
						><span class="inline-block spread-agent-explanation-text-100" :class="className"
							>{{ $t("spread.directCommission") }}
							<em class="spread-agent-explanation-text-amount">165</em></span
						>
					</li>
					<li>
						<span class="inline-block spread-agent-explanation-text-100" :class="className">{{
							`${$t("spread.otherPerformance")}  3000`
						}}</span
						><span class="inline-block spread-agent-explanation-text-100" :class="className"
							>{{ $t("spread.otherCommission") }}
							<em class="spread-agent-explanation-text-amount"> 60</em></span
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
						<em class="spread-agent-explanation-text-amount"> 20</em>
						<br />
						{{ `${$t("spread.fromDifferentials")}2%` }}
					</span>
				</small-box>

				<small-box classNames="c3-right w-[6.3rem] absolute z-20">
					<span
						>{{ `C3${$t("spread.contributesTo")}A` }}

						<em class="spread-agent-explanation-text-amount"> 0</em>
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

						<em class="spread-agent-explanation-text-amount"> 40</em>
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
		<div class="tutorial-detail">
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
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
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

const avatarColor = computed(()  => {
  const data = getTheme();
  if (['green-dark','yellow-dark','purple-light',''].includes(data.theme)) {
    return '#ffaa09'
  } else {
    return 'var(--ep-color-border-warning)'
  }
})

</script>

<style scoped lang="less">
@import '@/views/spread/first/styles/AgentNetwork/Newest/base-index.less';

.new-skin-symbol {
	@import '@/views/spread/first/styles/AgentNetwork/Newest/theme-style.less';
}
</style>
