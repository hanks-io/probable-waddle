// 返水规则 逻辑层
import { watch, ref } from 'vue';
import { useActivityStore } from '@/store/activity';
import { useAppStore } from '@/store/app';
import { isJSONStr } from '@/utils/verify';
import { generateDefultRules } from '@/i18n/ruleHelper/activityRule';
import { ZTActivityTypes } from '@/enums/types/activity.type';

export default function useRuleModalLogic({ emit }: { emit: any }) {
  const activityStore = useActivityStore(); // 活动store
  const appStore = useAppStore();           // App状态管理
  const ruleStr = ref(''); // 规则字符串

  watch(() => activityStore.rebateRule, async (val) => {
    if (isJSONStr(activityStore.rebateRule)) {
      const language = await appStore.getLocale();
      const ruleParams = JSON.parse(activityStore.rebateRule);
      ruleStr.value = generateDefultRules(language, ZTActivityTypes.enum.Rebate, ruleParams.variablesValue);
    }
    else {
      ruleStr.value = activityStore.rebateRule;
    }
  }, { immediate: true })
  
  /**
   * @description 关闭弹窗
   */
  function modalDismiss() {
    emit('visibleChange', false);
  }

  return {
    ruleStr,
    modalDismiss
  }
}
