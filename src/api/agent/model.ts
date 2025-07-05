import { RouterInput, RouterOutput } from "@/trpc/app.trpc";

// 获取代理信息返回值
export type AgencyInfoModel = RouterOutput['agency']['info'];

// 获取代理业绩传参
export type AgencyAchievementParams = RouterInput['agency']['myAchievement'];
// 获取代理业绩返回值
export type AgencyAchievementModel = RouterOutput['agency']['myAchievement'];

// 获取代理佣金传参
export type AgencyCommissionParams = RouterInput['agency']['myCommission'];
// 获取代理佣金返回值
export type AgencyCommissionModel = RouterOutput['agency']['myCommission'];

// 获取代理佣金详情传参
export type AgencyCommissionDetailParams = RouterInput['agency']['myCommissionDetail'];
// 获取代理佣金详情返回值
export type AgencyCommissionDetailModel = RouterOutput['agency']['myCommissionDetail'];

// 获取业绩详情传参
export type AgencyAchievementDetailModel = RouterOutput['agency']['achievementDetail'];

// 获取代理佣金比例额返回值
export type AgencyRatListModel = RouterOutput['agency']['ratList'];

// 获取代理配置返回值
export type AgencyConfigModel = RouterOutput['agency']['config'];

// 注册子代理传参
export type AgencyRegisterParams = RouterInput['agency']['createUser'];

// 分享软件配置
export type AgencyShareConfigModel = RouterOutput['agency']['softwareList'];
export type AgencyShareConfigItem = {
    name: string;
    type: string;
    isOpen: boolean;
    sort: number;
    icon?: string;
}
