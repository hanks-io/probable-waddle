import { useRouter } from 'vue-router';

export default function useMarqueeViewLogic() {
  const router = useRouter();
  const userStore = useUserStore();     // 用户状态管理
  const tenantStore = useTenantStore(); // 租户状态管理

  const marqueeContent = computed(() => tenantStore.marqueeContent);                // 轮播图数据
  const unreadMailCount = computed(() => userStore.unreadMailCount);                // 未读邮件数量
  const unreadAnnouncement = computed(() => userStore.getUnreadAnnouncementCount); // 未读公告数量

  /**
 * @description 跳转游戏搜索页
 */
  async function navigateToSearch() {
    router.push({ path: '/game/search/POPULAR' })
  }

  provide('marqueeEvents', navigateToSearch)

  return {
    navigateToSearch,
    marqueeContent,
    unreadMailCount,
    unreadAnnouncement,
  }
}