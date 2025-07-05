import router from '@/router';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { computed, onBeforeMount } from 'vue';
import { formatToDateTime } from '@/utils/date';

export function useAnnouncement() {
  const appStore = useAppStore();   // 应用store
  const userStore = useUserStore(); // 用户store
  
  const readAnnouncementList = computed(() => userStore.readAnnouncements);   // 已读公告列表
  const announcementList = computed(() => {                                   // 公告通知列表(编辑后)
    userStore.announcementList && userStore.announcementList.forEach((list:any) => {
      if (Array.isArray(list)) {
        list.forEach((item:any) => {
          item['createTime'] = formatToDateTime(item.updateTime)
        })
      }
    })
    return userStore.announcementList;
  });
  const unreadAnnouncement = computed(() => userStore.getUnreadAnnouncementCount);  // 未读公告数量

  /**
   * @description: 替换img标签
   */
  function replaceImgTag(content: string) {
    const regex = /<img[^>]*>/g;        // 正则匹配img标签
    return content.replace(regex, '');  // 替换img标签
  }

  /**
   * @description: 跳转详情
   */
  function detailHandle(content: Record<string, any>) {
    appStore.setAnnouncementNotice(content); // 设置公告通知状态
    userStore.setReadAnnouncement(content.id); // 设置已读公告状态
    router.push(`/notification/detail/0`)
  }

  /**
   * 请求网络接口: 公告列表一键已读
   */
  function readAllClick() {
    const newArr:any = []
    announcementList.value.forEach(announcementItem => {
      if (typeof announcementItem != 'string') {
        announcementItem.forEach((item:any) => {
          if (!readAnnouncementList.value.includes(item.id)) {
            newArr.push(item.id)
            appStore.setAnnouncementNotice(item); // 设置公告通知状态
          }
        })
      }
    })
    userStore.setAllReadAnnouncement(newArr);
  }

  /**
   * 生命周期函数: 页面加载前
   */
  onBeforeMount(async () => {
    await userStore.getUser()               // 获取用户信息
    await userStore.getReadAnnouncement();  // 获取已读公告列表
    userStore.getAnnouncements();           // 获取公告通知列表(编辑后)
  });

  return {
    readAnnouncementList,
    announcementList,
    unreadAnnouncement,
    replaceImgTag,
    detailHandle,
    readAllClick
  }
}
