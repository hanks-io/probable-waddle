<!-- 推广说明 图像小组建 -->
<template>
	<div
		class="people w-12 h-12 rounded-full border"
		:class="avatarClassName"
        :style="{'border-color': color,  ...(avatarStyle || {})}"
	>
		<div
			class="agent-level w-4 h-4 rounded-full relative left-8 top-8 leading-4 text-center text-[.625rem]"
            :style="{'background-color': color}"
		>
			<span class="">{{ agentlevel }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props =defineProps<{
	color: string;          //边框和bg颜色
	agentlevel: string;     //代理等级
    avatarStyle?: Record<string, string>
	}>();

const avatarClassName = computed(() => `pepole-${props.agentlevel}`);
</script>

<style scoped>
.people {
	background-size: 100% 100% !important;
}

.pepole-A{
	background: url("/icons/spread/manA.png"), #fff;
}
.pepole-B1, .pepole-B3{
	background: url("/icons/spread/manB1.png"), #fff;
}
.pepole-B2{
	background: url("/icons/spread/manB2.png"), #fff;
}
.pepole-C1, .pepole-C3{
	background: url("/icons/spread/womanC1.png"), #fff;
}
.pepole-C2{
	background: url("/icons/spread/womanC2.png"), #fff;
}

</style>
