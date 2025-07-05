
import { delay } from '@/utils/delay';
import { showLoading } from '@/utils/loading';
import { moneyConvertToClient } from '@/utils/custom'
import { getLocalTime } from '@/utils/date';
import { payRecordListApi } from '@/api/assets';
import { PayRecordListParams } from '@/api/assets/model';
import { handleStatementSelectTime } from '@/utils/reportTime'

import dayjs from 'dayjs';
import type { RecordItem } from '../comp/RecordList.vue'
import useCalcAssetStatusInfo from '@/hooks/useCalcAssetStatusInfo'

export default () => {
  const tenantStore = useTenantStore();
  const rechargeStore = useRechargeStore()



  const infiniteRef = ref();                                      // 上拉加载更多组件DOM
  const loading = ref(false);                                     // 加载状态
  const totalAmount = ref('0');                                    // 累计充值金额
  const loadMore = ref('more');                                   // 加载更多状态
  const iframeLoaded = ref(false);                                // iframe加载状态
  const modalVisible = ref(false);                                // 充值详情弹窗是否显示

  const recordList = ref<RecordItem[]>([]); // 充值记录列表
  let originRecordList: any[] = []; // 充值记录列表
  const changeTime = ref('today');                                // 时间类型
  const success = ['SUCCESS', 'PAID', 'HAVE_ARRIVED'];                  // 成功状态
  const fail = ['MANUALLY-END', 'TIMEOUT', 'CANCEL', 'LIMIT_EXCEEED'];  // 失败状态
  const { isVirtualCurrency } = toRefs(tenantStore)
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy as string)  // 当前商户货币
  const { t } = useI18n() // 国际化
  const payRecordListParams: PayRecordListParams = { // 充值记录列表接口请求参数
    page: 1,
    pageSize: 10
  };

  // 当前商户报表查询时间列表

  // const rechargeInfo = computed(() => tenantStore.rechargeInfo);          // 充值信息
  const { QRCodeInfo, isQRCode, thirdUrl, isOpenOrderModal } = toRefs(rechargeStore)

  const timeChange = (name: string) => {
    const dateObj = handleStatementSelectTime(name);
    payRecordListParams.startTime = dateObj?.startTime
    payRecordListParams.endTime = dateObj?.endTime
    payRecordListParams.page = 1;
    loadMore.value = 'more';
    recordList.value = [];
    originRecordList = []
    showLoading();
    getPayRecordList();
  }
  const getTransferConfig =  () => {
    const transferConfig =  sessionStorage.getItem('transferConfig')
    if(!transferConfig) return 
    rechargeStore.transferConfig = {
      ...rechargeStore.transferConfig,
      ...JSON.parse(transferConfig)
    }
  }
  onMounted(() => {
    timeChange(changeTime.value)
    tenantStore.getTenantInfo();
    getTransferConfig()
  })



  // 生命周期: 离开页面前
  onBeforeRouteLeave(() => {
    iframeLoaded.value = false;

    rechargeStore.thirdUrl = ''
    rechargeStore.isQRCode = false
  })

  /**
   * @description 充值RUL加载完成事件
   */
  function iframeLoadHandle() {
    iframeLoaded.value = true
  }

  /**
   * @description: 下拉刷新事件
   */
  async function handleRefresh(event: CustomEvent) {
    payRecordListParams.page = 1;
    await getPayRecordList();
    event.detail.complete();
  }

  /**
   * @description 触底加载更多事件
   */
  async function ionInfinite() {
    if (loadMore.value == 'noMore') return;
    await delay(1000);
    payRecordListParams.page! ++;
    getPayRecordList();
  }

  /**
   * @description: 充值详情弹窗事件
   */
  function detailHandle(orderNo: string) {
    const item = originRecordList.find(it => it.orderNo == orderNo);
    const { transferRealName, transferCompany, transferAccount,
      qrCodeUrl, type, status,transferVoucher,payerRealName,
      payTypeName, amount, payAmount } = item
    rechargeStore.orderNo = orderNo
    const createTime = getLocalTime(item.createTime, 'YYYY-MM-DD HH:mm:ss') as string
    const expireTime = (getLocalTime(item.expireTime) as dayjs.Dayjs).unix() - dayjs().unix();
    rechargeStore.orderInfo = {
      ...rechargeStore.orderInfo,
      transferRealName,
      transferCompany,
      transferAccount,
      qrCodeUrl,
      amount: success.includes(status) ? `${payAmount}` : `${amount}`,
      createTime,
      payTypeName,
      orderNo,
      expireTime,
      transferVoucher,
      voucher: '',
      payerRealName,
      payerName: '',
      isTransfer: type == 'TRANSFER',
      status,

    }
    rechargeStore.isOpenOrderModal = true
  }

  const calcStatus = useCalcAssetStatusInfo(success, fail)

  const processRecordData = async (list: any[]) => {
    const currentRecordlist: RecordItem[] = []
    for (const it of list) {
      const { createTime: time, payTypeName: name, status, amount, payAmount, orderNo } = it;
      const currentAmount = success.includes(status) ? payAmount : amount
      const realCurrency = await useGetRealCurrency(currentAmount)
      currentRecordlist.push({
        time,
        name,
        orderNo,
        amount: currentAmount,
        statusColor: calcStatus(status),
        status: t(`status.${status}`),
        realCurrency
      })
    }
    return currentRecordlist
 
  }

  /**
   * @description 调用接口: 获取充值记录列表
   */
  async function getPayRecordList() {
    loading.value = true;
    const res = await payRecordListApi(payRecordListParams);
    loading.value = false;
    if (!res || !('recordList' in res)) return;
    if (res?.totalAmount) {
      totalAmount.value = `${moneyConvertToClient(Number(res?.totalAmount))}`;
    }

    if (res.recordList.length < payRecordListParams.pageSize!) {
      loadMore.value = 'noMore';
    } else {
      loadMore.value = 'more';
    }
    const newRecordList = await processRecordData(res.recordList)
    if (payRecordListParams.page == 1) {
      recordList.value = newRecordList;
      originRecordList = res.recordList;
    } else {
      recordList.value.push(...newRecordList);
      originRecordList.push(...res.recordList);
    }
    infiniteRef.value.$el.complete();

  }


  onBeforeRouteLeave(() => {

    rechargeStore.thirdUrl = ''
    rechargeStore.isQRCode = false

  })




  return {

    totalAmount,
    loading,
    recordList,
    loadMore,
    iframeLoaded,
    modalVisible,
    isVirtualCurrency,
    infiniteRef,
    changeTime,
    thirdUrl,
    isOpenOrderModal,
    isQRCode,
    merchantCy,
    QRCodeInfo,
    timeChange,
    handleRefresh,
    detailHandle,
    ionInfinite,
    iframeLoadHandle,
    getPayRecordList,
    t,
  }

}



