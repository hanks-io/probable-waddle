<!-- 推广说明 代理块 -->
<template>
	<li class="agent-item w-28 text-center h-[7.5rem]" >
		<slot></slot>
		<small-box classNames="leading-[1rem] agent-small-box relative">
			<span
				>{{ `${agentlevel}${$t("spread.contributeCommission")}` }}
				<em class="money-text"> {{ commission }}</em></span
			>
		</small-box>
		<div
			class="border border-[#2A324E] newest-border w-[6.8rem] h-16 rounded-md leading-[0.65rem] relative  pt-[1.8rem]  text-[.625rem]"
		>
			<span class="newest-white-color">
				{{ `${$t("spread.validBets")}  ${betAmount}` }}</span
			>
			<Avatar
				:color="color"
				:agentlevel="agentlevel"
				:avatarStyle="avatarStyle"
			/>
		</div>
	</li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Avatar from "./Avatar.vue";
import SmallBox from "./SmallBox.vue";
const props = defineProps<{
	color: string; //边框和bg颜色
	agentlevel: string; //代理等级
	betAmount: number; // 有效投注
	commission: number; // 贡献佣金
}>();
const avatarStyle = {
	position: "absolute",
	top: "-50%",
	left: "50%",
	transform: "translate(-50%, 15%)",
};

// translate(-50%, 18%)
const avatarClassName = computed(() => `pepole-${props.agentlevel}`);
</script>

<style scoped lang="less">
  @import "@/views/spread/default/styles/AgentNetwork/AgentItem/base.less";
  @import "@/views/spread/default/styles/AgentNetwork/AgentItem/theme-style.less";

	#spread-default-components-agentNetwork-components-agentItem.style();

	.blue-default {
		#spread-default-components-agentNetwork-components-agentItem.style(
			--color-border-600,
			--color-text-white-100,
			--color-text-white-100,
			--color-bg-200,
			--accent-color-orange-1
		);
	}

	.green-default,
	.forest-green {
		#spread-default-components-agentNetwork-components-agentItem.style(
			--color-line,
			--color-text-gray-100,
			--color-text-gray-100,
			--color-bg-200,
			--accent-color-yellow
		);
	}

	.amber-purple {
		#spread-default-components-agentNetwork-components-agentItem.style(
			--line-color,
			--text-color-light-purple-1-100,
			--text-color-light-purple-1-100,
			--color-bg-200,
			--accent-color-yellow
		);
	}
</style>
