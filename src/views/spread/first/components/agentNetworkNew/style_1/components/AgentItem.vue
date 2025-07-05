<!-- 推广说明 代理块 -->
<template>
	<li class="agent-item w-28 text-center h-[7.5rem]" >
		<slot></slot>
		<small-box classNames="leading-[1rem] relative">
			<span
				>{{ `${agentlevel}${$t("spread.contributeCommission")}` }}
				<em class="spread-agent-explanation-text-amount"> {{ commission }}</em></span
			>
		</small-box>
		<div
			class="spread-agent-info w-[6.8rem] h-16 leading-[0.65rem] relative  pt-[1.8rem]"
		>
			<span class="spread-agent-info-text">
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
.commission-area {
	margin: 2.5rem auto;
}

.agent-item{
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}

.spread-agent-explanation-text-amount {
	color: #ffaa09;
}

.spread-agent-info {
	border: 1px solid;
	border-color: #2A324E;
	border-radius: 0.375rem;
	font-size: 0.625rem;
	.spread-agent-info-text {
		color: var(--color-text-100);
	}
}

.new-skin-symbol {
	.spread-agent-explanation-text-amount {
		color: var(--ep-color-text-warning);
	}

	.spread-agent-info {
		border-color: var(--ep-color-border-default);
		border-radius: 0.375rem;
		font-size: 0.625rem;
		.spread-agent-info-text {
			color: var(--ep-color-text-default);
		}
	}
}
</style>
