import { useVipStore } from '@/store/vip';
import { SuggestionActivityListModel } from "@/api/activity/model";
import { menuController } from "@ionic/vue";
import router from "@/router";
import { bannerListApi } from '@/api/normal/index'
import { handleSidebarJumpType, handleSideValueType, handleInlineNavigation } from '@/utils/inlineNavigation'
import { getLanguageName } from '@/utils/custom'
import { t } from '@/i18n/index';


export default function useDrawerLeftLogic() {
  const appStore = useAppStore();           // 应用store
  const gameStore = useGameStore();			    // 游戏信息
  const userStore = useUserStore();         // 用户信息
  const tenantStore = useTenantStore();     // 租户信息
  const statusStore = useStatusStore();     // 状态store
  const activityStore = useActivityStore(); // 活动store
  const systemStore = useSystemStore();     // 系统store
  const channelStore = useChannelStore();   // 渠道store
  const tabValue = ref('')                                  // 当前选中的分类
  const sortName = ref(['']) 							                  // 游戏分类名称列表
  const gameList = ref<any[]>([]) 				                  // 游戏列表
  const sortAll = ref<string[]>([]) 			                  // 游戏分类列表
  const showAllSort = ref<boolean[]>([])	                  // 分类是否显示全部
  const activityList = ref<SuggestionActivityListModel>([]) // 活动列表
  const btnDisabled = ref(false)
  const isApp = computed(() => systemStore.isApp); // 是否是APP
  const locale = computed(() => appStore.locale);               // 当前语言
  const { tenantInfo } = toRefs(tenantStore);
  const appLogo = computed(() => tenantStore.tenantInfo?.logo)                        // 应用logo
  const showLangChange = computed(() => !!tenantStore.getTenantLanguageList().length) // 是否显示语言切换
  const showUnRead = computed(() =>  {
    const emailTrue =  userStore.unreadMailCount && userStore.unreadMailCount > 0;                              // 未读邮件数量
    const announcementTrue = userStore.getUnreadAnnouncementCount && userStore.getUnreadAnnouncementCount > 0;  // 未读公告数量
    return emailTrue || announcementTrue;
  })
  // 最流行分类
  const initTabs = [
		{
			"id": 'null',
			"name": t('sort.POPULAR'),
			"code": "ONE_API_HOT",
			"status": null,
			"openType": null,
			"sort": null,
		},
	] 
  const tabs = computed(() => initTabs.concat(gameStore.homePlatformList));  // 游戏平台列表
  const pwaBarVisible = computed(() => appStore.isShowPwaBar);   // 是否显示PWA顶部安装栏
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);                        // 当前商户货币符号
  /**
   * @description 游戏卡片背景样式
   */
  const gameCardBgStyle = (imgurl: string) => {
    return `background:url("${imgurl}"); background-size:cover; background-position:center;`
  }

  const hidePwaBar = ref(true);
  /**
   * @description 菜单关闭事件
   */
  const menuIonDidClose = () => {
    hidePwaBar.value = true;
    btnDisabled.value = true
    statusStore.setDrawerLeftIsOpen(false)
  }
const menuIonClose = () => {
  btnDisabled.value = false
}
  /**
   * @description 菜单开启事件
   */
  const menuIonDidOpen = () => {
    statusStore.setDrawerLeftIsOpen(true)
  }
  const menuIonOpen = () => {
    hidePwaBar.value = false;
    btnDisabled.value = false
    
  }

  /**
   * @description 菜单按钮事件
   */
  const menuHandle = async () => {
    await menuController.close('main-menu')
  }

  // 监听路由变化
  watch(() => router.currentRoute.value.path, (patch) => {
    if (patch === '/main/inicio') {
      if (appStore.token) {
        onGetUserVip();                   // 获取用户VIP等级信息
        activityStore.getActivityList();  // 获取活动列表
      }
    }
  })

  // 生命周期: 组件挂载前
  onBeforeMount(async () => {
    onGetList();                        // 获取首页游戏列表
    activityStore.getActivityList();    // 获取活动列表
    appStore.getLocale();               // 获取当前语言
    if (appStore.token) {
      onGetUserVip();                   // 获取用户VIP等级信息
    }
    handleActivityList();               // 处理侧边栏bannerlist数据
  });

  /**
   * @description 菜单标签切换事件
   */
  function menuTabChange(item: string) {
    tabValue.value = item;
    setTimeout(() => {
      tabValue.value = '';
    }, 200);
    if (tabValue.value === 'POPULAR') {
      router.push('/game/search/POPULAR');
    } else if(tabValue.value === 'SPORTS') {
      router.push(`/game/category/sport`);
    } else {
      router.push(`/game/category/${tabValue.value}/0`);
    }
  }

  /**
   * @description 菜单标签切换事件,蓝色v01切换
   */
  function menuTabChangeTwo(item: string ,index : string, tabChange: string = 'tabChange2') {
    tabValue.value = item;
    setTimeout(() => {
      tabValue.value = '';
      gameStore.currentSegment =  {
        segment: item,
        index: Number(index),
        event: tabChange,
      }
    }, 200);
  }
  
  const gameTypeList = ['ELECTRONIC', 'CHESS', 'FISHING', 'LOTTERY', 'VIDEO', 'SPORTS']
  const sortHomeGamesList = computed(() => {
    if (gameStore.homeGames.length) {
      return gameStore.homeGames.sort(<T extends { gameType: string }>(a: T, b: T) => {
        const indexA = gameTypeList.indexOf(a.gameType ?? '');
        const indexB = gameTypeList.indexOf(b.gameType ?? '');
        return indexA - indexB;
      });
    }
    return [];
  });

  const jumpPlatformCategoryPage = (platformId: string) => {
    if (platformId == 'null') {
      router.push(`/game/category/ELECTRONIC/0`);
      return;
    }
    for (let i = 0; i < sortHomeGamesList.value.length; i++) {
      const { gameType, platformList } = sortHomeGamesList.value[i] as { gameType: "SPORTS" | "ELECTRONIC" | "CHESS" | "FISHING" | "VIDEO" | "LOTTERY", platformList: any[] };
      for (let j = 0; j < platformList.length; j++) {
        const { id } = platformList[j];
        if (id === platformId) {
          if(gameType === 'SPORTS') {
            router.push('/game/category/sport');
            return;
          }
          router.push(`/game/category/${gameType}/${platformId}`);
          return;
        }
      }
    }
  }

  /**
   * @description 活动导航标签点击事件
   */
  async function menuActivityHandle(item: SuggestionActivityListModel[0]) {
    await menuHandle();
    useLinkHandle(item.type, item.value, item.valueType)
  }

  /**
   * @description 语言切换
   */
  function languageHandle() {
    appStore.setLanguageModalVisible(true);
  }

  /**
   * @description 跳转充值
   */
  async function depositHandle() {
    const bool = await useHandleRecharge()
    if (!bool)
      router.push('/main/entrar')
  }

  /**
   * @description 跳转提现
   */
  async function withdrawHandle() {
    const bool = await useHandleWithdraw()
    if (!bool)
      router.push('/main/withdraw')
  }

  /**
   * 接口调用-获取用户VIP等级信息
   */
  async function onGetUserVip() {
    await useVipStore().getActivityVipInfoApi()
  }

  /**
   * 调用网络接口: 获取首页游戏列表
   */
  async function onGetList() {
    gameList.value = await gameStore.getHomeGames() || [];
    sortName.value = []
    showAllSort.value = []
    gameList.value.forEach((item: any) => {
      sortName.value.push(item.gameType)
      showAllSort.value.push(false)
    })
    sortAll.value = ['POPULAR']
    sortAll.value.push(...sortName.value)
  }

  // 跳转到客服
  function goToCustomer() {
    router.push('/notification')
  }

  // 处理侧边栏bannerlist数据
  async function handleActivityList( ){ 
    const activityInfo:any = await bannerListApi({ bannerType: 'lobby_sidebar_banner' });
    let newArr = [];
    if (activityInfo?.length) {
      newArr = activityInfo.map((item:any) => {
        let value:number|string|undefined = '';
        let valueType:string = '';
        if (item.targetType == 'internal') {
          const targetValue = JSON.parse(item.targetValue);
          value = handleInlineNavigation(targetValue)
          valueType = handleSideValueType(targetValue)
        } else {
          value = item.targetValue
        }
        return {
          id: item.id,
          image: item.imageUrl,
          name: item.name,
          type: handleSidebarJumpType(item.targetType),
          value,
          showName: item.showName,
          valueType
        }
      })
    }
    activityList.value = newArr
  }

  return {
    tabs,
    isApp,
    locale,
    appLogo,
    sortAll,
    tabValue,
    gameList,
    showUnRead,
    merchantCy,
    tenantInfo,
    hidePwaBar,
    menuHandle,
    showAllSort,
    activityList,
    btnDisabled,
    menuIonOpen,
    goToCustomer,
    menuIonClose,
    menuTabChange,
    languageHandle,
    depositHandle,
    pwaBarVisible,
    withdrawHandle,
    menuIonDidOpen,
    showLangChange,
    getLanguageName,
    gameCardBgStyle,
    menuIonDidClose,
    menuTabChangeTwo,
    menuActivityHandle,
    jumpPlatformCategoryPage,
  }
}
