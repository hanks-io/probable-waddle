import { t } from '@/i18n'
import { emitter } from '@/utils/event'
import { PopupType } from '@/components/Popup/data'
import useHandleWithdraw from '@/hooks/useHandleWithdraw'
import router from '@/router'
import { registerTaskEvents, unregisterTaskEvents } from '@/hooks/useTask'
import { activityVipLevelListApi } from '@/api/activity'
import { useVipStore } from '@/store/vip'
import { useBatchReward } from '@/views/tabbar/MainPage/useBatchReward'
import { firstRechargeAndFirstWithdrawRebate } from '@/views/tabbar/MainPage/firstRechargeAndFirstWithdrawRebate'
import { TabbarEnum } from '@/enums/common'
import useReDomainModal from '@/pwa/hooks/useReDomainModal'
import useHomeState from '@/views/tabbar/MainPage/useHomeState'


export default function useMainPageLogic() {
	const route = router.currentRoute
	const appStore = useAppStore() // 应用信息
	const gameStore = useGameStore() // 游戏信息
	const userStore = useUserStore() // 用户信息
	const tenantStore = useTenantStore() // 租户信息
	const statusStore = useStatusStore() // 状态信息
	const systemStore = useSystemStore() // 系统信息
	const activityStore = useActivityStore() // 活动store
	const vipStore = useVipStore()

  const tabBarRef = ref() // 底部导航栏ref
	const gameSportCode = ref('') // 体育游戏code
	const isIOS = computed(() => systemStore.isIOS) // 是否是IOS
	const drawerLoad = computed(() => appStore.drawerLoad) // 是否加载左侧抽屉
	const merchantName = computed(() => tenantStore.tenantInfo?.name) // 当前商户名称
	const unreadMailCount = computed(() => userStore.unreadMailCount) // 未读邮件数量
	const drawerLeftIsOpen = computed(() => statusStore.drawerLeftIsOpen) // 左侧菜单是否打开
	const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
	const installModalVisible = computed(() => statusStore.homeInstallModalVisible) // 是否显示安装弹窗
	const unreadAnnouncement = computed(() => userStore.getUnreadAnnouncementCount) // 未读公告数量
	const showRedPoint = computed(() => unreadMailCount.value + unreadAnnouncement.value > 0) // 是否显示红点
	const pwaFooterVisible = computed(() => appStore.isShowPwaFooter) // 是否显示PWA底部栏
	const ifHasVipReward = ref(false) // 是否有vip奖励
	const { isShowPromoRedPoint, isShowProfileRedPoint } = toRefs(activityStore)


	useBatchReward() // 批量优惠相关逻辑
	useHomeState() // 首页相关逻辑

	/**
	 * @description 验证是否显示红点
	 */
	const verifyRedPoint = async () => {
		if (!route.value.path.startsWith('/main')) return true
		const isLogin = await appStore.checkUserHasLogin()
		return !isLogin
	}

	// 监听体验金
	watch(
		() => userStore.experienceGold,
		(experienceGold) => {
			if (experienceGold) {
				const key = userStore.getExperienceGoldType() === '' ? 'popup.tips01' : 'popup.tips02'
				showPopup({
					type: PopupType.TRIAL,
					msg: t(key, {
						name: merchantName.value,
						amount: merchantCy.value + convertMoneyToShow(experienceGold),
					}),
				})
				userStore.setExperienceGold(0)
			}
		},
		{ immediate: true },
	)

	// 监听 我的tab的红点
	watch(
		[() => showRedPoint.value, () => route.value.path, () => appStore.token, () => userStore.assets],
		async () => {
			const bool = await verifyRedPoint()
			if (bool || showRedPoint.value) return (activityStore.isShowProfileRedPoint = showRedPoint.value)
			// await userStore.getAssets();     // 获取代理信息
			if (!userStore.assets?.commission) return
			activityStore.isShowProfileRedPoint = userStore.assets.commission > 0
		},
		{ immediate: true },
	)

	// 监听 优惠活动tab的红点
	watch(
		[() => route.value.path, () => appStore.token],
		async () => {
			const bool = await verifyRedPoint()
			if (bool) return
			//   获取红点
			await activityStore.setRedPointList()
			// !activityStore.isShowPromoRedPoint 因为活动底部红点 除了红点接口以为 还有加上未领取的，如果红点接口已经显示红点，就没有必要走未领取的接口
			// route.path === '/main/promo' 活动页面 要显示未领取 必须走未领取的接口
			if (!activityStore.isShowPromoRedPoint || route.value.path === '/main/promo') {
				await activityStore.setIsHasUnclaimed()
				if (activityStore.isHasUnclaimed) {
					activityStore.isShowPromoRedPoint = activityStore.isHasUnclaimed
				}
			}
			if(route.value.path == '/main/inicio'){
				firstRechargeAndFirstWithdrawRebate() // 首充首提活动奖励弹窗相关逻辑
			}
		},
		{ immediate: true },
	)

	watch(
		() => route.value.path,
		(newPath, oldPath) => {
			if (oldPath && newPath !== oldPath) {
				if (oldPath === '/transition') {
					// @ts-ignore
					if (window.isFresh) {
						// @ts-ignore
						window.isFresh = false
						alert('The page has been updated, please refresh the page!')
						window.location.reload()
					}
				}
			}
		},
		{ immediate: true },
	)

	watch(
		() => appStore.token,
		async (token) => {
			if (!token) return
			if (route.value.path !== '/main/perfil') {
				// 防止与个人中心页面的请求重复
				await Promise.all([
					userStore.setUser(), // 获取用户信息   下面的消息计算需要userId
					userStore.setAssets(), // 获取用户资产
					userStore.setUnreadMailCount(), // 获取未读邮件数量
				])
			}
			userStore.getReadAnnouncement(), // 获取已读公告消息列表
				userStore.getAnnouncements() // 获取公告消息列表
		},
		{ immediate: true },
	)

	// 监听vip活动是否有奖励可以领取
	watch(
		() => vipStore.claimBtnIsEnable,
		() => {
			ifHasVipReward.value = vipStore.claimBtnIsEnable
		},
	)

	// 处理充值活动奖励到账
	function handleRechargeReward(data) {
		if (!gameStore.isInGame) {
			showPopup({
				type: PopupType.BONUS,
				msg: t('popup.tips12'),
				showRightBtn: true,
				leftBtnText: t('popup.tips13'),
				rightBtnText: t('popup.tips14'),
				leftBtnCallback: () => {
					router.push(`/activity/recharge/${data.activityId}`)
				},
				countdownEnable: 3,
				reverseBtn: true,
			})
		}
	}
	  /**
   * @description 监听元素高度变化
   */
	const resizeObserver = new ResizeObserver((entries) => {
		const elementStore = useElementStore() // 元素信息

		for (const entry of entries) {
			const { height } = entry.contentRect
			elementStore.setTabBarHeight(height)
		}
	})

	gameStore.requestPopularGames()
	// 生命周期: 组件挂载完成
	onMounted(async () => {
		await nextTick()
		if (tabBarRef.value) {
			resizeObserver.observe(tabBarRef.value)
		}
		emitter.removeAllListeners('activity/recharge-activity')
		emitter.on('activity/recharge-activity', handleRechargeReward)
		if (useAppStore().token) {
			const vipListData = (await activityVipLevelListApi()) as any
			ifHasVipReward.value = vipListData.vipUserReceiveList.length ? true : false
			vipStore.claimBtnIsEnable = vipListData.vipUserReceiveList.length ? true : false
		}
	})

	// 生命周期: 组件卸载完成
	onUnmounted(() => {
		emitter.removeAllListeners('activity/recharge-activity')
		if (tabBarRef.value) {
			resizeObserver.unobserve(tabBarRef.value)
		}
	})


	return {
		isIOS,
		tabBarRef,
		TabbarEnum,
		drawerLoad,
		gameSportCode,
		ifHasVipReward,
		useReDomainModal,
		pwaFooterVisible,
		drawerLeftIsOpen,
		isShowPromoRedPoint,
		installModalVisible,
		isShowProfileRedPoint,
		theme: tenantStore.themeConfig?.theme,
	}
}
