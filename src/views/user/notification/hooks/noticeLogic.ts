import dayjs from 'dayjs';
import router from '@/router';
import { delay } from '@/utils/delay';
import { useUserStore } from '@/store/user'
import { formatToDateTime } from '@/utils/date';
import { reactive, ref, onBeforeMount, computed } from 'vue';
import { MailListParams } from '@/api/personal/model';
import { mailListApi, mailReadAllApi } from '@/api/personal';

export function useNotice() {
  const userStore = useUserStore(); // 用户状态管理

  const infiniteRef = ref();        // 无限滚动组件
  const loadMore = ref('more');     // 加载更多状态
  const mailList = ref<any[]>([]);  // 通知列表
  const startTimestamp = ref(0);    // 上次请求时间戳

  const mailListParams = reactive<MailListParams>({
    page: 1,
    pageSize: 10,
  });

  const unreadMailCount = computed(() => userStore.unreadMailCount)  // 未读通知数量

  /**
   * 生命周期函数: 页面加载前
   */
  onBeforeMount(() => {
    getMailList();
  });

  /**
   * @description: 跳转详情
   */
  function detailHandle(item: any) {
    if (userStore.unreadMailCount && !item.isRead)
      userStore.unreadMailCount--;
    item.isRead = true;
    router.push(`/notification/detail/${item.id}`)
  }

  /**
   * @description 触底加载更多事件
   */
  async function ionInfinite() {
    if (loadMore.value == 'noMore') return;
    await delay(1000);
    mailListParams.page! ++;
    getMailList();
  }

  // 如果是富文本链接，获取链接内容
  async function getLinkContent(list: any[]) {
    const reg = /^https?:\/\/[^\s$.?#].[^\s]*$/;
    const fetchAndProcessContent = async (url: string) => {
      const response = await fetch(url);
      let data = await response.text();
      data = data.replace(/<table[\s\S]*?<\/table>/g, '')
        .replace(/<a[\s\S]*?<\/a>/g, '')
        .replace(/<img[\s\S]*?>/g, '')
        .replace(/&nbsp;/g, '')
        .match(/(?<=>)[^<>]+(?=<)/g)?.join(' ') || '';
      return data;
    };

    const promises = list.map(item => {
      if (item.content && reg.test(item.content)) {
        return fetchAndProcessContent(item.content).then(content => {
          item.content = content?.trim();
        }).catch(error => {
          console.error(`Failed to fetch content for URL: ${item.content}`, error);
        });
      } else {
        return Promise.resolve();
      }
    });

    await Promise.allSettled(promises);
  }
  /**
   * 请求网络接口: 获取通知列表
   */
  async function getMailList() {
    const res = await mailListApi(mailListParams);
    await getLinkContent(res.mailList);
    if (res.mailList.length < mailListParams.pageSize!) {
      loadMore.value = 'noMore';
    } else {
      loadMore.value = 'more';
    }
    if (!startTimestamp.value && res.mailList.length) {
      startTimestamp.value = dayjs(res.mailList[0].createTime).unix() + 601;
    }
    res.mailList.forEach(item => {
      const createTime = formatToDateTime(item.createTime)
      if (dayjs(item.createTime).unix() < startTimestamp.value - 600) {
        mailList.value.push(formatToDateTime(item.createTime));
        mailList.value.push([{ ...item, createTime }]);
      } else {
        mailList.value[mailList.value.length - 1].push({ ...item, createTime });
      }
      startTimestamp.value = dayjs(item.createTime).unix();
    });

    infiniteRef.value.$el.complete();
  }

  /**
   * 请求网络接口: 通知列表一键已读
   */
  async function readAllClick() {
    await mailReadAllApi()          // 调用一键已读接口
    mailList.value.forEach(mailItem => {
      if (typeof mailItem != 'string') {
        mailItem.forEach((item: any) => {
          if (!item.isRead) {
            item.isRead = true;
          }
        })
      }
    })
    userStore.setUnreadMailCount(); // 获取未读通知数量
  }

  return {
    infiniteRef,
    loadMore,
    mailList,
    startTimestamp,
    mailListParams,
    unreadMailCount,
    detailHandle,
    ionInfinite,
    getMailList,
    readAllClick
  }
}
