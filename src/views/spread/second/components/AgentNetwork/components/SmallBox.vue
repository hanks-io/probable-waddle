import { computed } from "vue";

<!-- 推广说明 图像小组建 -->
<template>
	<div
		class="border border-[--color-border] w-[5.5rem] rounded-md leading-[0.6rem] bg-[--color-bg-200] p-0.5 min-h-5 text-[.6rem] text-center "
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

<style scoped>
</style>
