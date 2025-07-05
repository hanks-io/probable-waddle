<template>
	<ion-buttons class="px-[17px]" slot="start" @click="menuHandle">
		<ion-icon class="text-[16px]" src="/first/svg/menu2.svg" v-if="drawerLeftIsOpen" />
		<ion-icon class="text-[16px]" src="/first/svg/menu1.svg" v-else />
	</ion-buttons>
	<ion-img class="h-[28px] max-w-[120px] ml-2 pr-4" slot="secondary" :src="iconSrc" />
</template>

<script setup lang="ts">
import { IonButtons, IonIcon, IonImg } from '@ionic/vue';
import { useStatusStore } from '@/store/status';
import { storeToRefs } from 'pinia'
import { throttle } from '@/utils'
// 状态信息 throttle
const { drawerLeftIsOpen } = storeToRefs(useStatusStore())
const emit = defineEmits(['menuHandle']);
const props = defineProps<{
	iconSrc: string
}>();
//	加一个节流函数， 防止频繁点击
const menuHandle = throttle(() => {
	emit("menuHandle")
}, 200)
</script>

<style scoped>
ion-buttons {
	background: var(--color-menu-btn-bg);
	min-height: 50px;
}
</style>
