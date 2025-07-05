// 公告弹窗逻辑层
import useLinkHandle from "@/hooks/useLinkHandle";
import { showLogin } from '@/hooks/ShowLogin'
import { closeForceModal } from '@/utils/pwa/forcedModal/useClose'
import { debounce } from '@/utils'
import { TabInfo } from './type'
import { modalController } from "@ionic/vue"
import { delay } from '@/utils'
export default function useLogic() {

  const appStore = useAppStore();         // 用户store
  const tenantStore = useTenantStore();   // 租户store
  const statusStore = useStatusStore();   // 状态store
  const channelStore = useChannelStore(); // 渠道store
  const announcementCache = ref({});


  let announcementLink = '';                                               // 链接
  const announcementDetail = ref('');                                             // 公告详情
  const announcementType = ref('text');                                           // 类型
  const announceBgImg = ref('');                                                  // 标题
  const title = ref('');                                                  // 公告背景图片
  let announcementLinkType = '';        // 链接跳转类型
  let announcementValueType = '';  // 链接格式类型
  const { announcementList, tenantInfo } = toRefs(tenantStore)
  // const announcementList = computed(() => tenantStore.announcementList);        // 公告列表
  const todayInvisible = computed(() => statusStore.announcementInvisible);     // 今日不再显示
  const tabList = computed(() => announcementList.value.map((item: TabInfo) => ({
    id: item.id,
    title: item.title
  })));
  const isRegister = computed(() => announcementLink === '/register')

  const labelStyle = computed(() => tenantInfo.value?.announcementLabelStyle)
  const popupWay = computed(() => tenantInfo.value?.announcementPopupWay)
  const isShowTab = computed(() => popupWay.value === 'merge')

  const tabId = ref(0);

  const tabPositionClassName = computed(() => {
    if (!isShowTab.value) return 'empty-tab'
    const positionMap = {
      'head': 'top',
      'bottom': 'bottom',

    }
    return positionMap[labelStyle.value as keyof typeof positionMap] || ''
  })

  onMounted(() => {
    tabId.value = announcementList.value[0].id;

  })

  const dismissPopup = async (announcement: Record<string, any>) => {

    const popupMethodMap = {
      day: () => tenantStore.setAnnouncementHide(announcement.id),
      one: () => tenantStore.setAnnouncementHide(announcement.id),
      login: () => tenantStore.setAnnouncementInvisible(announcement.id)
    };
    console.log(todayInvisible.value, 'todayInvisible.value')
    if (todayInvisible.value) {
      await tenantStore.setAnnouncementHide(announcement.id);
    } else {
      await popupMethodMap[announcement?.popupMethod as keyof typeof popupMethodMap]?.();
    }


  }

  /**
   * @description 关闭弹窗
   */
  const dismiss = debounce(async (options: { type: 'close' | 'dismiss' } = { type: 'dismiss' }) => { // close 表示手动关闭，dismiss 表示自动关闭

    const dismissPopupOneType = async () => {
      const announcement = announcementList.value[0];
      dismissPopup(announcement)
      if (announcementList.value.length === 1) {
        const type = options?.type === 'close' ? 2 : isRegister.value ? 1 : 2; 
        await closeForceModal(false, { type });
      }
      if (announcementList.value.length) {
        tenantStore.shiftAnnouncementList();
        announcementList.value.length && getAnnouncementDetail()
      }
    }
    const dismissPopupMergeType = async () => {

      for (const item of announcementList.value) {
        await dismissPopup(item)
      }
      await closeForceModal(false)
      tenantStore.clearAnnouncementList()
    }
    const dismissPopupMap = new Map([
      ['one', dismissPopupOneType],
      ['merge', dismissPopupMergeType],
    ])

    dismissPopupMap.get(popupWay.value)?.()


  }, 200)


  /**
   * @description 获取公告详情
   */
  async function getAnnouncementDetail(currentAnnouncement?: Record<string, any>) {
    const announcement = currentAnnouncement || announcementList.value[0];
    if (!announcement) return
    title.value = announcement.title;
    announcementType.value = announcement.announcementType;
    announcementLink = announcement.value;
    announcementLinkType = announcement.type;
    announcementValueType = announcement.valueType;
    announcementDetail.value = '';
    announceBgImg.value = '';
    if (announcementType.value === 'text') {
      const cacheKey = `announcement_${announcement.id}`;
      const cachedContent = announcementCache.value[cacheKey];
      
      if (cachedContent) {
        announcementDetail.value = cachedContent;
      } else {
        const response = await fetch(announcement.content);
        const content = await response.text();
        announcementCache.value[cacheKey] = content;
        announcementDetail.value = content;
      }
      
      if(announcement.imgType === "custom"){
        announceBgImg.value = announcement.imgUrl;
      }
    } else {
      announcementDetail.value = announcement.imgUrl;
      announceBgImg.value = announcement.imgUrl;
    }

  }

  /**
   * @description 公告链接跳转
   */
  async function onLinkHandle() {
    if(announcementLinkType === 'None') return
    if (announcementLink && announcementLink == '/register') {
      if (!appStore.token) {
        dismiss()
        closeForceModal(false, { type: 1 }) // 1表示通过弹出关闭
        delay(300).then(() => {
          showLogin('register')
        })
      }
    } else {
      const isMet = await useLinkHandle(announcementLinkType, announcementLink, announcementValueType)
      if (isMet) {
        closeForceModal(false)
      } else {
        dismiss()
      }
    }
  }

  /**
   * @description 今日不再提醒文本点击事件
   */
  function checkHandle() {
    statusStore.setAnnouncementInvisible(!todayInvisible.value)
  }
  onMounted(() => {
    getAnnouncementDetail()
  })
  const tabChange = (activeId: number) => {
    tabId.value = activeId
    const announcement = announcementList.value.find((item: TabInfo) => item.id === activeId)
    console.log(announcement, tabId.value, 'announcement')
    if (announcement) {
      getAnnouncementDetail(announcement)
    }
  }
  return {
    announcementDetail,
    announcementType,
    todayInvisible,
    announceBgImg,
    title,
    dismiss,
    tabList,
    tabId,
    isShowTab,
    tabChange,
    tabPositionClassName,
    onLinkHandle,
    checkHandle,

  }
}
