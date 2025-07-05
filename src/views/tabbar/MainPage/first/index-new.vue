<template>
	<ion-page>
		<!-- 左侧抽屉 -->

		<!-- <PwaFooterModal  /> -->
		<ion-content id="main-content">
			<ion-tabs class="b-tabs">
				<ion-router-outlet :animated="!isIOS" />
				<component v-for="item in tabComponentOptions.list" :is="item.component" :key="item.key"
					v-bind="item.options" />
				<div class="fixed drawer-backdrop w-full h-full z-40" v-if="drawerLeftIsOpen" />
				<div class="game-used" v-if="gameSportCode === 'SABA'"></div>
			</ion-tabs>
		</ion-content>
		<template v-for="item in otherComponentOptions.list" :key="item.key">
			<component :is="item.component" v-bind="item.options" />
		</template>
		<!-- 语言选择弹窗 -->
		<LanguageModal />
		<!-- 安装弹窗 -->
		<InstallModal :visible="installModalVisible" />
	</ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonTabs, IonPage, IonRouterOutlet } from '@ionic/vue';
import LanguageModal from '../../components/LanguageModal.vue';
import InstallModal from '@/pwa/installModal/HomeModal.vue';
import useMainPageLogic from '../logic';
import useComponents from "../useComponents";

const {
	tabComponentOptions,
	otherComponentOptions,
} = useComponents();

const route = useRoute();

const {
	theme,
	isIOS,
	installModalVisible,
	pwaFooterVisible,
	drawerLeftIsOpen,
	gameSportCode,
	useReDomainModal
} = useMainPageLogic();
useReDomainModal();

onBeforeRouteLeave(() => {
	gameSportCode.value = ''
})
gameSportCode.value = route.params.gameCode as string

// 监听路由变化
watch(() => route.path, (newRoute) => {
	gameSportCode.value = route.params.gameCode as string
}, { immediate: true });

</script>




<style scoped>
#main-content {
	--background: var(--ep-color-background-fill-body-default);
}

.game-used {
	height: 4.5rem;
	width: 24.375rem;
	background: #ededed;
	position: relative;
	z-index: -1;
	opacity: .7;

}

div.drawer-backdrop {
	backdrop-filter: blur(5px);
	/* 模糊系数 */
	background: rgba(0, 0, 0, 0.1)
		/* 半透明背景(添加透明色以便使配radius) */
}
</style>
