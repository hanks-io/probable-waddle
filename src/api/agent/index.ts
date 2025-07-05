import { apiHandle } from "../handle";
import { appTrpc } from "@/trpc/app.trpc";
import { AgencyAchievementParams, AgencyCommissionDetailParams, AgencyCommissionParams, AgencyRegisterParams } from "./model";

/**
 * @description 玩家代理信息
 */
export const agencyInfoApi = () => apiHandle(appTrpc.agency.info.query);

/**
 * @description 代理业绩
 */
export const agencyAchievementApi = (params: AgencyAchievementParams) => apiHandle(appTrpc.agency.myAchievement.query, params);

/**
 * @description 代理佣金列表
 */
export const agencyCommissionApi = (params: AgencyCommissionParams) => apiHandle(appTrpc.agency.myCommission.query, params);

/**
 * @description 代理佣金详情
 */
export const agencyCommissionDetailApi = (params: AgencyCommissionDetailParams) => apiHandle(appTrpc.agency.myCommissionDetail.query, params);

/**
 * @description 返佣比例
 */
export const agencyRatListApi = () => apiHandle(appTrpc.agency.ratList.query, undefined, false);

/**
 * @description 业绩详情
 */
export const agencyAchievementDetailApi = (params: { userId: number }) => apiHandle(appTrpc.agency.achievementDetail.query, params);

/**
 * @description 领取佣金
 */
export const agencyRewardApi = () => apiHandle(appTrpc.agency.reward.mutate);

/**
 * @description 代理配置
 */
export const agencyConfigApi = () => {
  const result = window.__APP_CONFIG__?.agencyConfig?.result?.data?.json;
  if (result) {
    return Promise.resolve(result);
  } 
  return apiHandle(appTrpc.agency.config.query, undefined, false)
};

/**
 * @description 多级分销-当前代理信息
 */
export const agencyMlmInfoApi = () => apiHandle(appTrpc.agency.myInfo.query, undefined);

/**
 * @description 多级分销-下级数据信息
 */
export const agencyMlmSubDataApi = (params: any) => apiHandle(appTrpc.agency.subData.query, params)

/**
 * @description 多级分销-排行榜信息
 */
export const agencyMlmRankListDataApi = (params: any) => apiHandle(appTrpc.agency.rankList.query, params, false)

/**
 * @description 多级分销-佣金详情
 */
export const agencyCommDetailApi = (params: any) => apiHandle(appTrpc.agency.commissionDetail.query, params)

/**
 * @description 注册子代理
 */
export const agencyRegisterApi = (params: AgencyRegisterParams) => apiHandle(appTrpc.agency.createUser.mutate, params);

/**
 * @description 分享软件配置
 */
export const agencyShareConfigApi = () => apiHandle(appTrpc.agency.softwareList.query, undefined, false);

