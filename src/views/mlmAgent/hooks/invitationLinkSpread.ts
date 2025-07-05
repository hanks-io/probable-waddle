import i18n from '@/i18n';
import { computed, ref } from 'vue';
import { copy } from '@/hooks/Copy';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { useAgentStore } from '@/store/agent';

export function useinvitationLinkSpread() {
  const appStore = useAppStore();       // 系统信息
  const userStore = useUserStore();     // 用户信息
  const agentStore = useAgentStore();   // 代理store
  const router = useRouter();           // 路由实例

  const linkMes = ref([
    {
      id: 238237,
      src: '/images/spread/link.png',
      url: 'www.bilibili.com',
    }
  ])

  const currentLanguage = computed(() => i18n.global.locale.value); // 当前语言
  const userId = computed(() => userStore.user?.id);                // 用户id
  const isToken = computed(() => appStore.token ? true : false)     // 是否未登录
  const { shareUrl, loading: shareUrlLoading } = useShareUrl();

  initVuePageInfo() // created初始化页面数据

  /**
   * @description 生命周期: 页面挂载前
   */
  async function initVuePageInfo() {
    await agentStore.getConfig();               // 获取代理配置信息
    handleInvitationLink();                     // 处理代理配置信息
    if (!isToken.value) return                  // 未登录不获取信息
    await userStore.getUser();                  // 获取用户信息
  }

  // 复制链接地址
  function copyBtnClick() {
    const advertise = agentStore.config?.advertise;
    if (advertise) {
      const url = shareUrl.value + `&text=${advertise}`
      copy(url)
    } else {
      copy(shareUrl.value)
    }
  }

  // 客服按钮
  function customerBtnClick() {
    router.push({ path: '/notification' })
  }

  /**
  * @description 触发轮播图
  */
  const onSwiper = () => { }

  // 处理配置信息
  function handleInvitationLink() {
    const config = agentStore.config;
    if (config?.banner) {
      linkMes.value = [{
        id: 238237,
        src: config.banner,
        url: 'www.bilibili.com',
      }]
    }
  }

  return {
    onSwiper,
    shareUrl,
    linkMes,
    copyBtnClick,
    customerBtnClick,
    shareUrlLoading
  }
}
