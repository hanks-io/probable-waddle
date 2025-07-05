import { defineStore } from 'pinia';
import { isJSON } from '@/utils/verify';

// 页面参数枚举
export enum PageParam {
  AUDIT_DETAIL = 'auditDetail', // 审核详情
  LIMIT_GAME = 'limitGame', // 限制游戏
  WITHDRAW_MAIN = 'withdrawMain', // 提现主页
  AGENT_ROUTER_TYPE ='agentRouterType', // 推广中心tab切换
  REPORT_TYPE = 'reportType', // 报表tab切换
  VERIFY_TYPE = 'verifyType', // 校验类型
  REBATE_RECORD = 'rebateRecord', // 返水记录
  IS_TAB_WITHDRAW = 'isTabWithdraw',  // true tab主页 false 我主页提现按钮 
  LOGOUT_HEIGHT = 'logoutHeight',      // 退出按钮上一次高度
  LOGOUT_WIDTH = 'logoutWidth',      // 退出按钮上一次高度
  RED_PACKET_MODEL = 'redPacketModel', // 红包雨详情弹窗
  RECORD_BACK_REBATE = 'recordBackRebate' // 活动实时返水记录返回到实时返水
}

export const usePageParamStore = defineStore({
  id: 'pageParam',
  state: () => ({}),
  actions: {},
});

// 设置页面参数
export function setPageParam(key: PageParam, params: any) {
  const parmaStr = JSON.stringify({
    value: params,
  });
  sessionStorage.setItem(key, parmaStr)
}

// 获取页面参数
export function getPageParam(key: PageParam) {
  let parmas = null;
  const parmaStr = sessionStorage.getItem(key);
  if (parmaStr && isJSON(parmaStr)) {
    parmas = JSON.parse(parmaStr);
  } 
  return parmas?.value || null;
}

// 清除页面参数
export function clearPageParam(key: PageParam) {
  sessionStorage.removeItem(key);
}

// 清除所有页面参数
export function clearAllPageParam() {
  sessionStorage.clear();
}
