import router from '@/router';
import { useAppStore } from '@/store/app';
import { computed, onMounted, ref } from 'vue';
import { mailDetailsApi } from '@/api/personal';
import { MailDetailsModel } from '@/api/personal/model';

export function useNotificationDetail() {
  const appStore = useAppStore(); // 应用store
  const notificationInfo = ref<MailDetailsModel>(); // 通知详情

  const announcementNotice = computed(() => appStore.announcementNotice as MailDetailsModel); // 公告通知
  const notificationId = computed(() => Number(router.currentRoute.value.params.id));         // 通知id

  /**
   * 生命周期函数: 页面加载前
   */
  onMounted(() => {
    if (notificationId.value === 0)
      notificationInfo.value = announcementNotice.value;
    else
      getNotificationDetail();
  })

  /**
   * 接口调用: 获取通知详情
   */
  async function getNotificationDetail() {
    try {
      const info = await mailDetailsApi(notificationId.value);
      const reg = /^https?:\/\/[^\s$.?#].[^\s]*$/;
      // 管理系统给的富文本是一个链接地址，需要请求一次获取富文本内容
      if (info && info.content && reg.test(info.content)) {
        const res = await fetch(info.content)
        const data = await res.text()
        info.content = data;
      }
      notificationInfo.value = info;
    } catch (error) {
      console.error('getNotificationDetail is err', error);
    }
  }
  
  return {
    notificationInfo,
    announcementNotice,
    notificationId
  }
}
