import router from '@/router'
import { hideLoading, showLoading } from '@/utils/loading';
import { auditRecordApi } from '@/api/assets';
import { formatToDateTime } from '@/utils/date';
import { moneyConvertToClient } from '@/utils/custom'
import type { AuditRecordParams, AuditRecordItem } from '@/api/assets/model';
import { PageParam, setPageParam } from '@/store/pageParam';
import {  ZFlowType} from '@/enums/types';


// 稽核状态
export enum AuditStatus {
  NOT_START = 'notStarted',
  IN_PROGRESS = 'ongoing',
  COMPLETED = 'completed',
}
export default () => {
  const route = router.currentRoute
  const tenantStore = useTenantStore(); // 租户store
  const flowTypeIndex = ref(0);                                            // 日期索引
  const recordList = ref<AuditRecordItem[]>([]);                          // 稽核记录列表
  const sumValues = ref(0);                                               // 累计稽核
  const loading = ref(false);                                             // 加载状态
  const withdrawRecordParams = reactive<AuditRecordParams>({              // 稽核记录列表参数
    page: 1,
    pageSize: 100,
    flowType: undefined,
  });
  const { t } = useI18n() // 国际化
    /**
   * @description: 获取稽核记录列表
   */
    const getWithdrawRecord = async ()=> {
      await showLoading();
      loading.value = true;
      const res = await auditRecordApi(withdrawRecordParams);
      await hideLoading();
      loading.value = false;
      if (res && 'queryWhiteList' in res) {
        sumValues.value = moneyConvertToClient(res.sumFlow.sumNeedFlow - res.sumFlow.sumCurrentFlow);
        recordList.value = res.queryWhiteList.map((item: any) => {
          item.unfinished = moneyConvertToClient(item.needFlow - item.currentFlow);
          item.amount = moneyConvertToClient(item.amount);
          item.needFlow = moneyConvertToClient(item.needFlow);
          item.currentFlow = moneyConvertToClient(item.currentFlow);
          item.createTime = formatToDateTime(item.createTime);
          item.updateTime = formatToDateTime(item.updateTime);
          return item
        });
      }
    }


  const flowTypeIndexMap = {
    0: undefined,
    1: ZFlowType.enum.RECHARGE,
    2: ZFlowType.enum.ACTIVITY,
    3: ZFlowType.enum.SYSTEM,
  }

  const handleChange = (id: number)=>{
    if(!id) {
      withdrawRecordParams.flowType = undefined;
    } else {
      withdrawRecordParams.flowType = flowTypeIndexMap[id as keyof typeof flowTypeIndexMap];
    }
    getWithdrawRecord();

  }


  /**
   * @description: 下拉刷新事件
   */
 const handleRefresh = (event: CustomEvent)=> {
    event.detail.complete();
    getWithdrawRecord();
  }

  /**
   * @description: 充值详情弹窗事件
   */
  const detailHandle =(item: AuditRecordItem) =>{
    setPageParam(PageParam.AUDIT_DETAIL, item.flowListId)
    router.push({
      path: '/withdrawAuditDetails',
    });
  }



  watch(() => route.value.path, async (newPath) => {
    
    if (newPath == '/withdrawSubView') {
      getWithdrawRecord();
      await tenantStore.getTenantInfo()
    }


  }, { immediate: true })

  const selectList = [`${t('main.all')}`, `${t('option.recharge')}`, `${t('option.activity')}`, `${t('viewsAssets.systemAudit')}`].map((name, id) => ({ id, name }))

  return {
    sumValues,
    flowTypeIndex,
    loading,
    recordList,
    selectList,
    handleChange,
    getWithdrawRecord,
    handleRefresh,
    detailHandle
  }

}



