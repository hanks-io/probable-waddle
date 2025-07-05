import { showToast } from '@/utils'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { useSystemStore } from "@/store/system";
import { useAgentStore } from '@/store/agent'
import { computed, ref, reactive } from 'vue';
import { useTenantStore } from '@/store/tenant'
import { httpCompletion } from '@/utils'
import { shareAgentUrl,ShareConfigType } from '@/utils/agentShare'
import { sharePhoneApi } from '@/api/activity'
import { showLoading } from '@/utils/loading';
import { isProxyUrl, addZeroWidthSpace,openUrl} from '@/utils/app';

interface Params {
  emit: any;
}

let isDown: boolean;
let startX: number;
let scrollLeft: number;

export function useShareModalLogic({ emit }: Params) {
  const agentStore = useAgentStore();    // 代理store
  const tenantStore = useTenantStore();  // 租户Store
  const appStore = useAppStore();        // App状态管理
  const userStore = useUserStore();      // 用户Store
  const systemStore = useSystemStore()

  const visible = ref<boolean>(true);       // 弹窗开关状态
  const sharePhones = ref<string[]>([]);    // 分享号码
  const disableTab = ref<boolean>(false);   // 定义导航标签禁用状态
  const usePhones = ref<string[]>([]);      // 已使用的分享号码

  const sharePhoneParams = reactive({
    // 分享号码参数
    phones: [] as string[],
  })
  
  const segmentList = computed(() => agentStore.shareConfig?.filter(v => v.isOpen) ?? []); // 分享平台按钮列表
  const shareTitle = computed(() => tenantStore.tenantInfo?.name) // 商户名称                          // 是否未登录
  const { shareUrl } = useShareUrl();

  // create init初始化
  initVue();
  async function initVue() {
    agentStore.getShareConfig();   // 获取分享配置
    onSharePhone();                // 获取/设置分享号码
    if (await useAppStore().checkUserHasLogin()) {
      await tenantStore.getTenantInfo(); // 获取租户信息
      await agentStore.getConfig();      // 获取代理配置
      await userStore.getUser();         // 获取用户信息
    }
  }

  /**
   * 接口调用: 获取/设置分享号码
   */
  async function onSharePhone() {
    if (!(await useAppStore().checkUserHasLogin())) return
    const { usePhones, allPhones } = await sharePhoneApi(sharePhoneParams);
    handleDate(usePhones,allPhones)
    // 把已经乱码的手机号标记为已使用
    handlePattenDate(allPhones)
  }

  // 乱码验证方法
  function isGarbledCharacter(char: string) {
    const patten = /[^\x20-\x7E\x0A\x0D\x09]/;
    return patten.test(char)
  }

  // 处理获取数据显示
  function handleDate(usePhones: string[] ,allPhones: string[]) {
    usePhones.value = []
    sharePhones.value = []
    if (usePhones && usePhones.length > 0) {
      usePhones.value  = usePhones.filter(item => !isGarbledCharacter(item))
    }
    if (allPhones && allPhones.length > 0) {
      const newArr = [];
      allPhones.filter(item => !isGarbledCharacter(item)).forEach(phoneItem => {
          let newObj: any = { phone: phoneItem, isUsed : false  }   
          if (usePhones?.value?.includes(phoneItem)) {
            newObj.isUsed = true
          }
          newArr.push(newObj)
      })
      sharePhones.value = newArr;
    }
  }

  // 处理乱码后的手机号
  async function handlePattenDate(allPhones: string[]){
    const phones = allPhones.filter((item: any) => isGarbledCharacter(item))
    if (phones.length) {
      const { usePhones,allPhones } = await sharePhoneApi({ phones: phones as string[], })
      handleDate(usePhones,allPhones)
    }
  }

  /**
   * @description whatsapp分享
   */
  function whatsappHandle() {
    const data:any = sharePhones.value.find((item:any) => !item.isUsed);
    const url = httpCompletion(shareUrl.value)
    const name = isProxyUrl(url) ? addZeroWidthSpace(shareTitle.value) : shareTitle.value
    if (data && data.phone) {
      sharePhoneParams.phones = [data.phone]
      onSharePhone()
      const message = `${t('viewsSpread.agentShareUrl',{ name })}${url}`
      // @ts-ignore
      const sharedUrl = window.jsBridge ? `https://api.whatsapp.com/send?phone=${data.phone}&text=${encodeURIComponent(message)}` : `whatsapp://send?phone=${data.phone}&text=${encodeURIComponent(message)}`;
      openUrl(sharedUrl,'WhatsApp')
    } else {
      return showToast('hint.invalidPhone')
    }
  }

  /**
   * @description 发送短信
   */
  function sendSMSHandle() {
    const list:any = [];
    const url = httpCompletion(shareUrl.value);
    const name = isProxyUrl(url) ? addZeroWidthSpace(shareTitle.value) : shareTitle.value;
    const message = `${t('viewsSpread.agentShareUrl',{ name })}${url}`;
    sharePhones.value.filter((item:any) => !item.isUsed).forEach((item:any) => {
      list.push(item.phone);
    })
    sharePhoneParams.phones = list;
    onSharePhone();
    if (systemStore.isIOS ) {
      if (systemStore.browser == 'Chrome') {
        openUrl(`sms:/open?addresses=${list.join(',%20')}&body=${encodeURIComponent(message)}`);
      } else {
        openUrl(`sms:/open?addresses=${list.join(',%20')}&body=${encodeURIComponent(message)}`, 'OPEN_URL');
      }
    } else {
      openUrl(`sms:${list.join(',')}?body=${encodeURIComponent(message)}`);
    }
  }

  // 关闭分享弹窗
  function closeShareModal() {
    emit('closeShare');
  }

  /**
   * @description 分享按钮点击事件
   */
  function launchHandle(item: ShareConfigType) {
    const url = httpCompletion(shareUrl.value);
    shareAgentUrl(item, url, shareTitle.value);
  }

  /**
   * @description 鼠标按下事件
   * @param e 事件
   */
  function handleMouseDown(e: any) {
    isDown = true;
    startX = e.pageX - e.currentTarget.offsetLeft;
    scrollLeft = e.currentTarget.scrollLeft;
  }
  function handleMouseUp(e: any) {
    isDown = false;
    disableTab.value = false;
  }
  function handleMouseLeave() {
    isDown = false;
    disableTab.value = false;
  }
  function handleMouseMove(e: any) {
    if (!isDown) return;
    e.preventDefault();
    disableTab.value = true;
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX);
    e.currentTarget.scrollLeft = scrollLeft - walk;
  }

  return {
    visible,
    segmentList,
    disableTab,
    sharePhones,
    shareUrl,
    closeShareModal,
    launchHandle,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
    whatsappHandle,
    sendSMSHandle
  }
}
