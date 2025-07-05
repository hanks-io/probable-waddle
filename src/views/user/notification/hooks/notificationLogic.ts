import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { ref, computed, onBeforeMount } from 'vue';

export function useNotification() {
  const { t } = useI18n();
  const userStore = useUserStore(); // 用户状态管理
  const appStore = useAppStore(); // App状态管理

  const segmentValue = ref(0);       // 标签栏选中序号

  const unreadMailCount = computed(() => {                                            // 未读通知数量
    const num = userStore.unreadMailCount ? userStore.unreadMailCount : 0;
    return num >= 99 ? 99 : num;
  });
  const unreadAnnouncement = computed(() =>  {                                        // 未读公告数量
    const num = userStore.getUnreadAnnouncementCount ? userStore.getUnreadAnnouncementCount : 0;
    return num >= 99 ? 99 : num;
  });
  const segmentList = computed(() => {
    return [t('main.suporte'), t('viewsUser.notification'), t('viewsUser.announcement')]
  })
    
  /**
   * 生命周期函数: 页面加载前
   */
  onBeforeMount(async () => {
    const token = await appStore.getToken();
    if (token) {
      userStore.getUnreadMailCount(); // 获取未读通知数量
      userStore.getUser();            // 获取用户信息
    }
  });

  return {
    segmentValue,
    unreadMailCount,
    unreadAnnouncement,
    segmentList
  }
}
