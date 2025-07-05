// 优惠活动 逻辑层
import { jumpActivityId } from '@/utils/url'
import { useActivityStore } from '@/store/activity';
import { useRoute } from 'vue-router';
import { computed, onBeforeMount, ref, watch, toRefs, nextTick } from 'vue';
import { PageParam, setPageParam, getPageParam } from '@/store/pageParam';
import { activityVipLevelListApi } from '@/api/activity';
import { useAppStore } from '@/store/app'
import { useVipStore } from '@/store/vip';
import { showLogin } from '@/hooks/ShowLogin'
import router from '@/router';
import i18n from '@/i18n';
import useTask from '@/views/activity/task/useTask'
import { openWindow } from '@/utils/app';
import { handleInlineNavigation, showToast } from '@/utils'

export default function useLogic() {
    enum PageType {
        ActivityList = 1,
        Rebate,
        Vip,
        Redeem,
        Claim,
        Unclaimed,
        TaskList = 7,
    }
    const { t } = i18n.global

    const route = useRoute();                 // 当前路由
    const activityStore = useActivityStore(); // 活动store
    const elementStore = useElementStore();
    const vipStore = useVipStore();
    const rebateId = ref(0);                      // 返水活动id
    const maxRebate = ref(0);                     // 最大返水比例
    const sideValue = ref('all');                 // 侧边导航标签动态值
    const tabValue = ref();  // 导航标签动态值
    const ifShowVipRedPoint = ref(false);         // vip是否有奖励可以领取


    const {
        rebateList,
        activityList,
        activityConfig: segmentList,
        redPointList,
        isHasUnclaimed,
        pageType
    } = toRefs(activityStore)

    // 是否显示侧边导航
    const isShowLeftSide = computed(() => {
        const showSidePageList: any[] = [];
        return showSidePageList.includes(tabValue.value);
    });

    const {
        tasksInProgress,
        completedTheTaskList,
    } = useTask();

    const isShowRebateRedPoint = computed(() => !!(redPointList.value?.find(it => it?.type === 'Rebate')?.redPoint));
    const tabList = computed(() => [
        { type: 'activityList', value: PageType.ActivityList, name: `${t('activity.events')}`, isShow: true, isShowRedPoint: false },
        { type: 'taskList', value: PageType.TaskList, name: `${t('task.000014')}`, isShow: !!tasksInProgress.value.length, isShowRedPoint: completedTheTaskList.value.length > 0 },
        { type: 'rebate', value: PageType.Rebate, name: `${t('activity.moreBonuses')}`, isShow: !!rebateId.value, isShowRedPoint: isShowRebateRedPoint.value },
        { type: 'vip', value: PageType.Vip, name: `${t('activity.vip41')}`, isShow: vipStore.activityVipOpen ?? true, isShowRedPoint: false },
        { type: 'redeem', value: PageType.Redeem, name: `${t('activity.redeem')}`, isShow: true, isShowRedPoint: false },
        { type: 'claim', value: PageType.Claim, name: `${t('activity.history')}`, isShow: true, isShowRedPoint: false },
        { type: 'unclaimed', value: PageType.Unclaimed, name: `${t('activity.unclaimed')}`, isShow: true, isShowRedPoint: isHasUnclaimed.value },
    ])
    const paddingBottom = computed(() => `calc(${elementStore.tabBarHeight}px + 1rem)`)                      // 底部导航栏高度

    // 监听当前路由变动
    watch(() => route.fullPath, () => {
        if (route.path == '/main/promo') {
            const activeIndex = pageType.value ? pageType.value : PageType.ActivityList;
            tabChange(activeIndex);
            // 返水记录-返回活动的实时返水页面
            nextTick(() => {
                const isBackRebate = getPageParam(PageParam.RECORD_BACK_REBATE)
                if (isBackRebate) {
                    tabValue.value = PageType.Rebate
                    setPageParam(PageParam.RECORD_BACK_REBATE, false)
                }
            })
            init();
        }
    }, { immediate: true })

    // 重置活动页
    function resetActivityPage() {
        let timeKey: any = null;
        timeKey = setTimeout(() => {
            // 判断当前标签页是否显示
            const item: { isShow?: boolean } = tabList.value.find(it => it.value == tabValue.value) || {};
            if (!item.isShow) {
                // 重置标签页
                tabValue.value = tabList.value.find(it => it.isShow)?.value || PageType.ActivityList;
                tabChange(tabValue.value);
            }
            clearTimeout(timeKey);
        }, 1000);
    }
    // 监听活动列表变动
    watch(activityList, () => {
        // 重置返水活动
        rebateId.value = 0;
        activityList.value.forEach(item => {
            if (item.type == 'Rebate') {
                if (rebateId.value != item.id) {
                    rebateId.value = item.id;
                    activityStore.getRebateDetail(rebateId.value);
                }
            }
        });
        resetActivityPage();
    }, { immediate: true });

    // 监听返水活动列表变动
    watch(() => rebateList.value.length, async () => {
        if (rebateList.value.length) {
            rebateList.value.forEach(item => {
                item.platformRebateList.forEach((ite: any) => {
                    ite.rebateRatioList.forEach((i: any) => {
                        if (i.rewardAmount > maxRebate.value) {
                            maxRebate.value = i.rewardAmount;
                        }
                    })
                })
            })
        }
    }, { immediate: true });

    // 当前打开标签页切换
    watch(() => activityStore.curPageType, (value) => {
        tabValue.value = value
    })

    // 监听vip活动是否有奖励可以领取
    watch(() => vipStore.claimBtnIsEnable, () => {
        ifShowVipRedPoint.value = vipStore.claimBtnIsEnable;
    });

    // 生命周期: 页面加载前
    onBeforeMount(async () => {
        activityStore.loadActivityList();   // 加载活动列表
        activityStore.loadActivityConfig(); // 加载活动配置
        if (useAppStore().token) {
            vipStore.getActivityVipInfoApi(); // 查看是否有vip活动
        }
        if (useAppStore().token) {
            const data = await activityVipLevelListApi() as any;  // 查看是否有vip奖励可以领取
            ifShowVipRedPoint.value = data.vipUserReceiveList.length ? true : false;
            vipStore.claimBtnIsEnable = data.vipUserReceiveList.length ? true : false;
        }
    });

    /**
     * @description 初始化
     */
    async function init() {
        await getActivityConfig();            // 获取活动配置
        activityStore.requestActivityList(true);  // 获取活动列表
    }

    function changeTabValue(value: PageType) {
        tabValue.value = value;
        activityStore.curPageType = value;
        activityStore.pageType = value;
    }

    /**
     * @description 导航标签切换事件
     * @param event 事件对象
     */
    async function tabChange(tabIndex: any) {
        if (tabIndex === PageType.Vip) {
            const appStore = useAppStore();
            const token = await appStore.getToken();
            token ? changeTabValue(tabIndex) : showLogin();
        }
        else {
            changeTabValue(tabIndex);
        }
    }

    /**
     * @description 侧边导航标签切换事件
     * @param event 事件对象
     */
    function sideChange(event: any) {
        sideValue.value = event.detail.value;
    }

    /**
     * @description 跳转到活动详情
     * @param item 活动项
     */
    function navigation(item: any) {
        if (item.type === 'Custom') {
            handleCustomActivityJump(item);
            return;
        }

        if (item.type === 'Rebate') {
            rebateId.value = item.id;
            return tabValue.value = PageType.Rebate;
        }
        else if (item.type === 'VIP') {
            router.push({
                path: '/activity/vip',
            })
            return;
        }
        jumpActivityDetails(item);
    };

    /**
     * @description 跳转到活动详情
     * @param item 活动项
     */
    function jumpActivityDetails(item: any) {
        const activityRouterId = jumpActivityId(item);
        router.push({
           path: `/activity/${item.type}/${activityRouterId}`,
        })
    }

    /**
     * @description 处理自定义活动跳转
     */
    async function handleCustomActivityJump(item: any) {
        const { jumpType, target } = JSON.parse(item.condition)
        // 跳转活动详情页
        if (jumpType === 'DETAIL' || jumpType === undefined) {
            jumpActivityDetails(item);
        }
        // 跳链接
        else if(jumpType === 'LINK') {
            const { type, targetValue } = target
            // 内跳
            if (type === 'internal') {
                const { type, info } = targetValue;
                // 跳指定活动
                if (type === 'activity') {
                    const activityList = await activityStore.getActivityList();
                    const activity: any = activityList.find(item => item?.id === Number(info.activityId));
                    if (!activity) {
                        showToast('activity.notMet')
                        return
                    }
                    const activityRouterId = jumpActivityId(activity);
                    if (activity?.type === 'Rebate') {
                        activityStore.pageType = PageType.Rebate;
                        activityStore.curPageType = PageType.Rebate;
                        router.push(`/main/promo`);
                    } else {
                        router.push(`/activity/${activity?.type}/${activityRouterId}`);
                    }
                }
                // 跳指定路由
                else {
                    jumpToRoute(type);
                }
            }
            // 外跳
            else if (type === 'external') {
                openWindow(httpCompletion(targetValue))
            }
        }
    }

    // 跳转到指定的路由页面
    async function jumpToRoute(type: string) {
        const routePath = handleInlineNavigation({ type })
        if (routePath === '/Redeem') {
            activityStore.pageType = PageType.Redeem;
            activityStore.curPageType = PageType.Redeem;
            router.push(`/main/promo`);
        } else if (routePath == '/') {
            router.replace('/launch').then(() => {
            location.reload();
            });
        } else {
            if (routePath == '/main/entrar' || routePath == '/recharge/apply') {
            const bool = await useHandleRecharge()
            if (bool) return
            } else if (routePath == '/main/withdraw' || routePath == '/withdraw/apply') {
            const bool = await useHandleWithdraw()
            if (bool) return
            }
            if (routePath == '/activity/vip') {
            // 如果是vip页面, 则检测是否有权限
            const vipStore = useVipStore()
            await vipStore.getActivityVipType()
            if (!vipStore.activityVipType) return;
            }
            router.push(routePath as string);
        }
    }

    /**
     * @description 跳转到领取记录
     */
    function toRecord() {
        tabValue.value = PageType.Claim;
    }

    /**
     * 接口调用: 获取活动配置
     */
    async function getActivityConfig() {
        const sortList = await activityStore.requestActivityConfig();
        if (!sortList.find((item: any) => item.title == sideValue.value)) {
            sideValue.value = sortList[0].title;
        }
    }

    return {
        rebateId,
        sideValue,
        tabValue,
        isShowLeftSide,
        tabList,
        segmentList,
        PageType,
        init,
        tabChange,
        sideChange,
        navigation,
        toRecord,
        paddingBottom,
        ifShowVipRedPoint
    }
}
