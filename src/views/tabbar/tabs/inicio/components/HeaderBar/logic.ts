import { ZUserType } from '@/enums/types';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { menuController } from '@ionic/vue';
import { useTenantStore } from '@/store/tenant';
import { useStatusStore } from '@/store/status';
import router from '@/router';
import { useHeaderToolbar } from '@/hooks/useLoadComponent';


export default function HeaderBarLogic() {
  const appStore = useAppStore();       // app信息
  const userStore = useUserStore();     // 用户信息
  const tenantStore = useTenantStore(); // 租户信息
  const statusStore = useStatusStore(); // 状态信息
  
  const locale = computed(() => appStore.locale);                                               // 当前语言
  const userId = computed(() => userStore.user?.userId);                                        // 用户信息
  const drawerLoad = computed(() => appStore.drawerLoad);                                       // 左侧抽屉是否加载
  const appLogo = computed(() => tenantStore.tenantInfo?.logo);                                 // 渠道配置LOGO
  const currency = computed(() => tenantStore.tenantInfo?.currency);                            // 货币类型
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);                        // 当前商户货币符号
  const supportLanguages = computed<string[]>(() => tenantStore.tenantInfo?.appLanguage || []); // 支持的语言
  const drawerLeftIsOpen = computed(() => statusStore.drawerLeftIsOpen) // 左侧菜单是否打开
  const balance = computed(() => {                                                              // 用户余额
    let balance = 0;
    const user = userStore.user;
    if (user && (user.type === ZUserType.enum.demo)) {
      balance = user.trialPlayBalance
    }
    else {
      balance = userStore.assets?.balance || 0;
    }
    return balance;
  });

  const { 
    hideButton,
    assetsImgUrl,
    showAssetsIcon,
  } = useHeaderToolbar(supportLanguages);

  const { 
    themeConfig,
  } = toRefs(tenantStore);


  /**
   * @description 充值按钮点击事件
   */
  async function rechargeHandle() {
    const bool = await useHandleRecharge()
    if (!bool) router.push('/main/entrar');
  }

  /**
   * @description 语言切换
   */
  function languageHandle() {
    appStore.setLanguageModalVisible(true);
  }

  /**
   * @description 菜单按钮事件
   */
  function menuHandle() {
    if (!drawerLoad.value) return
    statusStore.setDrawerLeftIsOpen(true)
    menuController.open('main-menu')
  }

  /**
   * @description 充值按钮点击事件
   */
  async function depositHandle() {
    const bool = await useHandleRecharge()
    if (bool) return
    router.push('/recharge/apply');
  }

  /**
   * @description 跳转游戏搜索页
   */
  async function navigateToSearch() {
    router.push({ path: '/game/search/POPULAR' })
  }

  /**
   * @description 切换语言
   */
  function changeLanguage(language: string) {
    appStore.setLocale(language);
  }

  return {
    assetsImgUrl,
    hideButton,
    locale,
    userId,
    appLogo,
    currency,
    balance,
    merchantCy,
    themeConfig,
    menuHandle,
    depositHandle,
    showAssetsIcon,
    supportLanguages,
    navigateToSearch,
    languageHandle,
    rechargeHandle,
    changeLanguage,
    drawerLeftIsOpen,
  }
}