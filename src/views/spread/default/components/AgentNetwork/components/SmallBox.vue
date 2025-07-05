import { computed } from "vue";

<!-- 推广说明 图像小组建 -->
<template>
	<div
		class="w-[5.5rem] rounded-md leading-[0.6rem] newest-border agent-small-box bg-[#101629] p-0.5 min-h-5 text-[.6rem] text-center "
		:class="classNames"
	>
		<slot
			><span>
				{{ context }}
			</span></slot
		>
	</div>
</template>

<script setup lang="ts">

defineProps<{
	context?: string; //文本内容
	classNames?: string;
}>();

</script>

<style scoped lang="less">
  @import "@/views/spread/default/styles/AgentNetwork/SmallBox/base.less";
  @import "@/views/spread/default/styles/AgentNetwork/SmallBox/theme-style.less";

	#spread-default-components-agentNetwork-components-smallBox.style();

	.blue-default {
		#spread-default-components-agentNetwork-components-smallBox.style(
			--color-border-600,
			--color-text-white-100,
			--color-bg-200
		);
	}

	.green-default,
	.forest-green {
		#spread-default-components-agentNetwork-components-smallBox.style(
			--color-line,
			--color-text-gray-100,
			--color-bg-200
		);
	}

	.amber-purple {
		#spread-default-components-agentNetwork-components-smallBox.style(
			--line-color,
			--text-color-light-purple-1-100,
			--color-bg-200
		);
	}
</style>
