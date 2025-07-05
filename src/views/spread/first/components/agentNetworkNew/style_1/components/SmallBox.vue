import { computed } from "vue";

<!-- 推广说明 图像小组建 -->
<template>
	<div
		class="spread-agent-explanation-conten w-[5.5rem] leading-[0.6rem] p-0.5 min-h-5 text-[.6rem] text-center"
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
	.spread-agent-explanation-conten {
		border: 1px solid;
		border-color: #293548;
		border-radius: 0.375rem;
		font-size: 0.6rem;
		background: #101629;
	}

	.new-skin-symbol {
		.spread-agent-explanation-conten {
			border-color: var(--ep-color-border-default);
			border-radius: 0.375rem;
			background: var(--ep-color-background-fill-surface-raised-L2);
		}
	}
</style>
