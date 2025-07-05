import router from '@/router'
import { moneyConvertToClient } from '@/utils/custom';
import { hideLoading, showLoading } from '@/utils/loading';
import { useAppStore } from '@/store/app'
import { formatToDateTime } from '@/utils/date';
import { getAuditTypeName, getAuditStatusColor, getAuditStatusColorFirst, getAuditStatusName, AuditStatus} from '@/hooks/useAuditStatusName'
import { auditRecordDetailApi } from '@/api/assets';
import { isJSON } from '@/utils/verify';
import { PageParam, setPageParam, getPageParam } from '@/store/pageParam';
import { Language, getActivityDefaultName } from '@/i18n/ruleHelper/activityRule';
import { ZNameType } from '@/enums/types/activity.type';
import { isJSONStr } from '@/utils/verify';

export default  () => {
  const auditState = ref(AuditStatus.COMPLETED);
  const auditStateColor = computed(() => getAuditStatusColor(auditState.value));
  const auditStateColorFirst = computed(() => getAuditStatusColorFirst(auditState.value));
  const showLimitGame = ref(false);
  let limitGameInfo: any = null;
  const route = router.currentRoute
  // 详情信息
  const auditDetails = reactive({
    tradeType: '',
    activityName: '',
    auditStatus: '',
    tradeAmount: 0,
    auditMultiple: 0,
    auditAmount: 0,
    unAuditAmount: 0,
    auditedAmount: 0,
    gameRestriction: '',
    createTime: '',
    finishTime: '',
  });
  
  
  


  watch(() => route.value.path, async (newPath) => {
    
    if (newPath == '/withdrawAuditDetails') {
      showAuditDetails();
      
    }


  }, { immediate: true })


  
  // 显示稽核详情
  async function showAuditDetails() {
    await showLoading();
    const id = await getPageParam(PageParam.AUDIT_DETAIL);
    const data = await auditRecordDetailApi({ id });
    await hideLoading();
    auditDetails.tradeType = getAuditTypeName(data.flowType);
    auditDetails.activityName = data.activityName === '' ? '-' : data.activityName as string;
    if (data.activityNameType === ZNameType.enum.DEFAULT && isJSONStr(data.activityNameParams)) {
      const language = await useAppStore().getLocale() as Language
      const nameParams = JSON.parse(data.activityNameParams)
      auditDetails.activityName = getActivityDefaultName(language, data.activityType, nameParams.variablesValue)
    }
    auditDetails.auditStatus = getAuditStatusName(data.status);
    auditDetails.tradeAmount = moneyConvertToClient(data.amount);
    auditDetails.auditMultiple = data.flowMultiple;
    auditDetails.auditAmount = moneyConvertToClient(data.needFlow);
    auditDetails.unAuditAmount = moneyConvertToClient(data.needFlow - data.currentFlow);
    auditDetails.auditedAmount = moneyConvertToClient(data.currentFlow);
    auditDetails.createTime = formatToDateTime(data.createTime);
    auditDetails.finishTime = data.status !== AuditStatus.COMPLETED ? "-" : formatToDateTime(data.updateTime);
  
    auditState.value = data.status;
    if (isJSON(data.gameLimit)) {
      limitGameInfo = JSON.parse(data.gameLimit);
      showLimitGame.value = !!limitGameInfo.limitData.length;
    }
  }
  
  // 立即前往
  function goGame() {
    setPageParam(PageParam.LIMIT_GAME, limitGameInfo)
    router.push({
      path: 'withdrawLimitGame',
    });
  }


  return {
    auditState,
    auditStateColor,
    showLimitGame,
    limitGameInfo,
    auditDetails,
    auditStateColorFirst,
    goGame
  }
}



