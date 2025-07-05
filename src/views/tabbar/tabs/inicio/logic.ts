import { isEmpty, throttle } from "@/utils";
import { computed, ref } from "vue";
import { gameEndApi } from "@/api/game";
import { useAppStore } from "@/store/app";
import { useGameStore } from "@/store/game";
import { useUserStore } from "@/store/user";
import { useSystemStore } from "@/store/system";
import { useTenantStore } from "@/store/tenant";
import { useStatusStore } from "@/store/status";
import { MTpushInterfaceHandler } from "@/logic";
import { useChannelStore } from "@/store/channel";
import { checkPawLaunchButton } from "@/utils/interval";
import { checkTaskReward } from '@/hooks/useTask'
import { useReportOpenPWA } from "@/pwa/hooks/useReportOpenPWA";
import { CarouselConfigModel } from "@/api/normal/model";
import { checkAndRedirectToRegisterReward } from '@/hooks/useCheckAndRedirectToRegisterReward'
import router from "@/router";
import { BROWSER } from "@/enums/device";
import { emitter } from "@/utils/event";
import {
	useForcedModal,
} from '@/utils/pwa/forcedModal'
import { checkThirdPartyAuth } from "@/hooks/useOAuth";
import useGameList from './useGameList';
import { useBonusPoolPosition } from '@/hooks/useLoadComponent';
import { useStartMT } from "@/views/tabbar/tabs/inicio/useStartMT";
import { checkIsSwModal } from '@/utils';

const swiperKey = ref(0); // 轮播图key
const contentRef = ref(); // 内容DOM
const tabValue = ref(""); // 导航标签动态值
const sticky = ref(false); // 是否固定标签
const sortName = ref([""]); // 游戏分类名称列表
const segmentHeight = ref(68); // 标签高度
const gameList = ref<any[]>([]); // 游戏列表
const segmentHandle = ref(false); // 是否开启导航标签切换事件
const sortAll = ref<string[]>([]); // 游戏分类列表
const showAllSort = ref<boolean[]>([]); // 分类是否显示全部
const carouselList = ref<CarouselConfigModel>([]); // 轮播图列表
const marqueeContent = ref<CarouselConfigModel>([]); // 跑马灯内容

export default function useInicioLogic() {
	const appStore = useAppStore();
	const userStore = useUserStore();
	const gameStore = useGameStore();
	const systemStore = useSystemStore();
	const tenantStore = useTenantStore();
	const statusStore = useStatusStore();
	const channelStore = useChannelStore();
	const elementStore = useElementStore();
	const activityStore = useActivityStore();
	const isApp = computed(() => systemStore.isApp); // 是否是APP
	const tabBarHeight = computed(() => elementStore.tabBarHeight); // 底部导航栏高度
	const popularPlatform = computed(() => gameStore.popularPlatform); // 热门游戏平台列表
	const paymentPartnerPic = computed(() => tenantStore.tenantInfo?.paymentPartnerPic); // 支付合作伙伴图片
	const route = router.currentRoute
	const pwaBarVisible = computed(
		() => appStore.isShowPwaBar
	);
	const isShowSportsGames = computed(() => {
		let target = gameStore.homeGames.find((it: any) => it.gameType === "SPORTS");
		if (!target || isEmpty(target?.platformList)) return false;
		return (target?.platformList as any).filter((item: any) => item.target === "hall" && item.hot)?.length > 0;
	});
	const showUnRead = computed(() => {
		const emailTrue = !!userStore.unreadMailCount; // 未读邮件数量
		const announcementTrue = !!userStore.getUnreadAnnouncementCount; // 未读公告数量
		return emailTrue || announcementTrue;
	});

	const {
		watchBuoy,
		tabChange1,
		segmentRef,
		mainPageRef,
		showGameList,
		handleHeader,
		showBackToTop,
		getGameCardBottom,
		forTabValueOptions,
		stickySegmentBottom,
	} = useGameList();

	const {
		showBonusPool,
	} = useBonusPoolPosition();

	// 监听商户ID变化
	watch(
		() => tenantStore.tenantId,
		async () => {
			if (tenantStore.tenantId) {
				const tenantInfo = await tenantStore.resetTenantInfo(); // 重置商户信息
				appStore.setLocale(tenantInfo?.language); // 设置语言
				automatic(); // 重新批量获取数据
			}
		},
	);


	// 监听token变化
	watch(
		() => appStore.token,
		(token) => {
			if (token) {
				automatic(); // 重新批量获取数据
			}
		},
	);

	watch(
		() => userStore.user?.id,
		(userId) => {
			if (!userId) return;
			useGetFavoriteGame(); // 获取收藏列表的游戏
		},
	);

	watch(() => route.value.path, async (newPath, oldPath) => {
		if (newPath == '/main/inicio' && !checkIsSwModal()) {
			useTaskStore().updateTaskList('NewbieTask').then(() => {
				checkTaskReward(); // 检查当前是否有可领取任务奖励
			});
			userStore.setAssets()
			const isJumpRegisterReward = await checkAndRedirectToRegisterReward()
			if (await activityStore.getNewUserExclusivePopup(true) === 0 && !oldPath?.includes('newUserExclusive')) { // 查询是否参与过新人活动
				activityStore.showNewUserExclusivePopup = 0;
			}

			if (!isJumpRegisterReward) {
				await userStore.setUser()
				await useForcedModal();
				//  已经显示pwa强制弹框没有必要显示pwa底部弹框
				if (!channelStore.isShowForceModal && !appStore.alreadyPwaFooter) {
					showPwaFooter()
				}
			}

		}
	}, { immediate: true })

	// 检测是否需要显示登录注册弹窗
	function checkShowLogin() {
		nextTick(async () => {
			if (statusStore.redirectRoute === "register") await showLogin("register");
			else if (statusStore.redirectRoute === "login") await showLogin("login");

			statusStore.setRedirectRoute('')
		});
	}
	const showPwaFooter = () => {
		appStore.setPwaFooterVisible(true); // 设置PWA底部栏显
		appStore.isShowPwaFooter = true;; // 设置PWA底部栏显
		appStore.alreadyPwaFooter = true;
	}

	// 生命周期-挂载前
	onBeforeMount(() => {
		automatic(); // 重新批量获取数据
	});




	const checkRegisterModalClose = async () => {

		const handleRegisterPage = async () => {
			if (!statusStore.isRegisterPage) return;

			await useForcedModal();
			statusStore.isRegisterPage = false;

			if (!channelStore.isShowForceModal) {
				showPwaFooter();
			}
		}

		const showRegisterReward = async () => {
			try {
				const isJumpRegisterReward = await checkAndRedirectToRegisterReward()

				if (!isJumpRegisterReward) {
					await useForcedModal();
				}
			} catch (error) {
				console.error('Show register reward error:', error);
				await useForcedModal();
			}
		}

		await handleRegisterPage();
		setTimeout(showRegisterReward, 1000);

	}
	const checkShowForceModal = async () => {
		await userStore.setUser()
		useForcedModal()
	}


	const checkLogoutForcedModal = async () => {
		userStore.isAlreadyDisplayRegisterReward = false
		channelStore.isShowForceModal = false
		channelStore.forceModalKey = null
	}

	// 生命周期-挂载后
	onMounted(async () => {
		useStartMT()
		appStore.setPwaBarVisible(true); // 获取PWA栏是否显示
		checkShowLogin();
		checkThirdPartyAuth();
		useReportOpenPWA();
		emitter.on("user/registerModalClose", checkRegisterModalClose);
		emitter.on("user/logout", checkLogoutForcedModal);
		emitter.on("user/permissionMT", checkShowForceModal);
		setTimeout(() => {
			appStore.isShowPwaBar = true; // 获取PWA栏是否显示
		}, 2000);
	});

	onBeforeUnmount(() => {
		emitter.off("user/registerModalClose", checkRegisterModalClose);
		emitter.off("user/logout", checkLogoutForcedModal);
		emitter.off("user/permissionMT", checkShowForceModal);
	})

	onBeforeRouteLeave(() => {
		userStore.isAlreadyDisplayRegisterReward = false
	})

	/**
	 * @description 页面滚动监听
	 */
	function handleContentScroll(ev: any) {
		const scrollTop = ev.detail.scrollTop;
		handleHeader(scrollTop);
		// 判断分类导航栏元素是否在视口顶部
		const stickyElement = document.getElementById("stickyElement");
		const rect = stickyElement?.getBoundingClientRect();
		getGameCardBottom();
		if (rect) {
			if (pwaBarVisible.value && rect.top <= 99) {
				sticky.value = true;
			} else if (!pwaBarVisible.value && rect.top <= 49) {
				sticky.value = true;
			} else {
				sticky.value = false;
			}
		}
	}

	/**
	 * @description 导航标签切换事件
	 * @param event 事件对象
	 */
	function tabChange(event: any) {
		segmentHandle.value = true; // 开启导航标签切换事件
		const childSpan = contentRef.value.$el.querySelector(`.${event.detail.value}`); // 获取目标元素DOM
		setTimeout(() => {
			tabValue.value = "";
		}, 300);
	}


	/**
	 * @description 滚动到顶部事件
	 */
	function topHandle() {
		contentRef.value.$el.scrollToTop(500);
	}

	/**
	 * @description 去客服中心
	 */
	function goToCustomer() {
		router.push("/notification");
	}

	/**
	 * @description 触摸开始事件
	 */
	function touchStartHandle() {
		segmentHandle.value = false; // 关闭导航标签切换事件
	}

	/**
	 * @description 跳转游戏搜索页
	 */
	async function navigateToSearch() {
		router.push({ path: '/game/search/POPULAR' });
	}

	/**
	 * @description 自动运行方法
	 */
	const automatic = throttle(
		async () => {


			await Promise.all([
				onCarouselConfig(), // 获取首页轮播数据
				onGetGameList(), // 获取首页游戏列表
			]);

			if (userStore.user?.userId && localStorage.getItem("enteredGame") === "true") {
				gameEndApi(userStore.user.userId).then(() => {
					localStorage.removeItem("enteredGame");
				});
			}

			// 不顶层窗口不初始化推送
			if (!checkIsSwModal()) {	
				MTpushInterfaceHandler(); // 初始化推送(极光推送)
			}
			appStore.setDrawerLoad(true); // 设置加载抽屉菜单
			await checkPawLaunchButton(); // 检查PWA启动按钮




		},
		500,
		{ leading: true, trailing: false },
	);


	return {
		watchBuoy,
		tabChange1,
		segmentRef,
		mainPageRef,
		showGameList,
		showBackToTop,
		forTabValueOptions,
		stickySegmentBottom,
		showBonusPool,
		gameStore,
		swiperKey,
		isApp,
		sticky,
		tabValue,
		pwaBarVisible,
		segmentHeight,
		popularPlatform,
		showUnRead,
		contentRef,
		tabBarHeight,
		paymentPartnerPic,
		automatic,
		isShowSportsGames,
		handleContentScroll,
		tabChange,
		touchStartHandle,
		topHandle,
		goToCustomer,
		navigateToSearch,
	};
}


/**
 * 调用网络接口: 获取首页游戏列表
 */
async function onGetGameList() {
	const gameStore = useGameStore();

	gameList.value = (await gameStore.requestHomeGames()) || [];
	sortName.value = [];
	showAllSort.value = [];
	gameList.value.forEach((item: any) => {
		setFavorite(item.platformList, item.gameType);
		sortName.value.push(item.gameType);
		showAllSort.value.push(false);
	});
	sortAll.value = ["POPULAR"];
	sortAll.value.push(...sortName.value, "FAVORITE");
}

/**
 * 调用网络接口: 获取首页轮播数据(轮播图+跑马灯)
 */
async function onCarouselConfig() {
	const tenantStore = useTenantStore();
	carouselList.value = await tenantStore.requestCarouselList();
	marqueeContent.value = await tenantStore.requestMarqueeList("text");
}
