<!-- 推广说明 代理块 -->
<template>
	<li class="agent-item w-28 text-center h-[7.5rem]" >
		<slot></slot>
		<small-box classNames="leading-[1rem] relative">
			<span
				>{{ `${agentlevel}${$t("spread.contributeCommission")}` }}
				<em class="text-[#ffaa09]"> {{ commission }}</em></span
			>
		</small-box>
		<div
			class="border border-[--color-border] w-[6.8rem] h-16 rounded-md leading-[0.65rem] relative  pt-[1.8rem]  text-[.625rem]"
		>
			<span class="color-text-100">
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
</style>
