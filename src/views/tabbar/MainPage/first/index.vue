<template>
	<ion-page v-if="!isNewPage">
		<!-- 左侧抽屉 -->
		<DrawerLeft v-if="drawerLoad" />
		<ion-content id="main-content">
			<ion-tabs class="b-tabs">
				<ion-router-outlet :animated="!isIOS" />
				<div ref="tabBarRef" class="absolute -bottom-[1px] w-full">
					<ion-tab-bar>
						<div class="w-full h-full flex flex-col relative">
							<div class="tab-bar flex h-[56px]">
								<div class="flex-1 flex flex-col items-center justify-center relative" v-for="(item, index) in tabList"
									:key="item.route" :tab="item.tab" @click="navigator(item.route)">
									<ion-icon class="tab-img text-2xl" :class="route.name == item.tab ? 'on' : ''"
										:src="route.name == item.tab ? `/first/svg/tabbar/${item.tab}_on.svg` : `/first/svg/tabbar/${item.tab}-${theme}.svg`"
										v-if="index !== 2" />
									<ion-label class="text-[.625rem]"
										:style="route.name == item.tab ? 'color:var(--tab-image-active-color)' : 'color:var(--tab-image-color)'"
										v-if="index !== 2">{{ $t(item.text) }}</ion-label>
									<HotPoint :isShow="item.tab === TabbarEnum.PERFIL && isShowProfileRedPoint"
										classNames="top-2 right-[1.2rem]" />
									<HotPoint :isShow="item.tab === TabbarEnum.PROMO && isShowPromoRedPoint"
										classNames="top-2 right-[1.2rem]" />
									<HotPoint :isShow="item.tab === TabbarEnum.PERFIL && ifHasVipReward"
										classNames="top-2 right-[1.2rem]" />
								</div>
							</div>
							<div class="flex-1" />
						</div>
					</ion-tab-bar>
				</div>
				<div v-hate-keyboard
					class="deposit absolute flex flex-col items-center justify-center bottom-[21px] w-[4.25rem] h-[46px] z-10 ml-[10.15rem]"
					:class="depositActive ? 'on' : ''" @click="navigator('/main/entrar')">
					<ion-icon class="tab-img tab-main text-[22.5px]" :src="`/first/svg/tabbar/deposit_on.svg`" />
					<ion-label class="tab-main-text text-[10px]">{{ $t('main.entrar') }}</ion-label>
				</div>
				<div class="fixed drawer-backdrop w-full h-full z-40" v-if="drawerLeftIsOpen" />
				<div class="game-used" v-if="gameSportCode === 'SABA'"></div>
			</ion-tabs>
		</ion-content>

		<!-- 语言选择弹窗 -->
		<LanguageModal />
		<!-- 安装弹窗 -->
		<InstallModal :visible="installModalVisible" />
		<!-- PWA底部弹窗 -->
		<PwaFooterModal v-if="pwaFooterVisible" />

	</ion-page>
	<NewPage v-else />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonTabBar, IonTabs, IonLabel, IonPage, IonRouterOutlet, IonIcon } from '@ionic/vue';
import PwaFooterModal from "@/pwa/footerModal/First.vue";
import DrawerLeft from '../../components/DrawerLeft/first/index.vue';
import LanguageModal from '../../components/LanguageModal.vue';
import InstallModal from '@/pwa/installModal/HomeModal.vue';
import HotPoint from '@/components/HotPoint/index.vue';
import useMainPageLogic from '../logic';
import vHateKeyboard from '@/directives/hateKeyboard';
import useTabLogic from "@/views/tabbar/components/tabBar/logic";
import NewPage from './index-new.vue'

import { getTheme } from '@/theme/hooks'

const isNewPage = ref(false)
// index-new.vue 还有调用一次useInicioLogic，  加这个防止多次调用useInicioLogic， 里面的watch和onMounted会多次执行
const getLogicData = () => {
	const { newSkin } = getTheme()
	if (newSkin) {
		isNewPage.value = true
		return {}
	}
	isNewPage.value = false
	return useMainPageLogic()
}


const route = useRoute();

const depositActive = ref(false);

const { tabList, navigator } = useTabLogic();

const {
	theme,
	isIOS,
	tabBarRef,
	drawerLoad,
	TabbarEnum,
	isShowProfileRedPoint,
	isShowPromoRedPoint,
	installModalVisible,
	pwaFooterVisible,
	drawerLeftIsOpen,
	gameSportCode,
	ifHasVipReward,
	useReDomainModal
} = getLogicData();
useReDomainModal?.();


const tabBarImg = computed(() => `url('/first/svg/tabbar/bg-${theme}.svg') no-repeat center / 100% 100%`);

onBeforeRouteLeave(() => {
	if (gameSportCode) {
		gameSportCode.value = ''
	}

})
if (gameSportCode) {
	gameSportCode.value = route.params.gameCode as string
}


// 监听路由变化
watch(() => route.path, (newRoute) => {
	if (gameSportCode) {
		gameSportCode.value = route.params.gameCode as string
	}

}, { immediate: true });

</script>




<style scoped>
.game-used {
	height: 4.5rem;
	width: 24.375rem;
	background: #ededed;
	position: relative;
	z-index: -1;
	opacity: .7;

}

ion-tab-bar {
	--background: linear-gradient(to bottom, transparent 50px, var(--color-bar-bg-100) 50px);
}

ion-tab-bar div.tab-bar {
	background: v-bind(tabBarImg);
}

ion-tab-button {
	--background: transparent;
	--color-selected: #FFFFFF;
	/* 底部导航栏选中字体颜色 */
	--color: #566488;
	/* 底部导航栏默认字体颜色 */
	--ripple-color: transparent;
	/* 底部导航栏点击水波纹颜色 */
}

div.deposit {
	border-radius: 41px;
	border: 1px solid var(--color-primary-border-light);
	background: var(--color-primary-btn-main);
	box-shadow: var(--color-primary-btn-main-shadow);
	margin-bottom: env(safe-area-inset-bottom);
}

div.drawer-backdrop {
	backdrop-filter: blur(5px);
	/* 模糊系数 */
	background: rgba(0, 0, 0, 0.1)
		/* 半透明背景(添加透明色以便使配radius) */
}

.tab-img {
	color: var(--tab-image-color);
}

.tab-img.on {
	animation: buttonAnimation 500ms;
	color: var(--tab-image-active-color);
}

.tab-img.tab-main,
.tab-main-text {
	color: var(--color-text-tab-main);
}

.redPoint {
	animation: breathing 3s infinite;
}

@keyframes buttonAnimation {
	0% {
		transform: scale(0);
	}

	50% {
		transform: scale(1.2);
	}

	100% {
		transform: scale(1);
	}
}

@keyframes breathing {
	0% {
		opacity: 0.5;
		transform: scale(1);
	}

	50% {
		opacity: 1;
		transform: scale(1.2);
	}

	100% {
		opacity: 0.5;
		transform: scale(1);
	}
}
</style>
