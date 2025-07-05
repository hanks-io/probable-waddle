<script setup lang="ts">
import { IonButtons, IonIcon, IonImg } from '@ionic/vue';
import { useStatusStore } from '@/store/status';
import { storeToRefs } from 'pinia'
import { throttle } from '@/utils'
import { useHeaderToolbar } from '@/hooks/useLoadComponent';

// 状态信息 throttle
const { drawerLeftIsOpen } = storeToRefs(useStatusStore())
const emit = defineEmits(['menuHandle']);
const props = withDefaults(defineProps<{
	iconSrc: string
	btnDisabled?: boolean
	imgPosition?: string,
	textColor?: string,
}>(), {
	imgPosition: 'secondary'
});
//	加一个节流函数， 防止频繁点击
const menuHandle = throttle(() => {
	emit("menuHandle")
}, 200)

const {
	menuIcon,
} = useHeaderToolbar();

</script>

<template>
	<ion-buttons class="menu-btn" slot="start" @click="menuHandle">
		<ion-icon class="text-xl menu-bar" :src="menuIcon" :class="drawerLeftIsOpen ? 'menu-scaleX' : ''"
			:style="{ color: props.textColor }" />
	</ion-buttons>
	<ion-img class="h-[28px] max-w-[120px] pr-4" :slot="imgPosition" :src="iconSrc" />
</template>

<style lang="less" scoped>
.menu-btn {
	padding-inline: 0.75rem;
}

ion-buttons ion-icon {
	transition: all 0.3s;
}

.menu-scaleX {
	transform: rotate(180deg);
}

.menu-bar {
	color: #fff;
}

.green-default {
	.menu-bar {
		color: #7E9071;
	}

	.v02 {
		.menu-bar {
			color: #AFC69F;
		}
	}
}
</style>
