import { RouterInput, RouterOutput } from "@/trpc/app.trpc";

type ArrayElement<T> = T extends Array<infer U> ? U : never;


// 根据id获取通道信息传参
export type ChannelInfoByIdParams = RouterInput['channel']['infoById'];

// 注册传参
export type RegisterParams = RouterInput['auth']['registe'];
export type RegisterType = RouterInput['auth']['registe']['registerType'];
export type AppType = RouterInput['auth']['registe']['appType'];
// 注册返回值
export type RegisterModel = RouterOutput['auth']['registe'];

// 登录传参
export type LoginParams = RouterInput['auth']['login'];

// 忘记密码传参
export type ForgetParams = RouterInput['auth']['forgetPassword'];

// 获取热门游戏传参
export type HotParams = RouterInput['home']['hot'];
// 获取热门游戏返回值
export type HotModel = RouterOutput['home']['hot'];

// 获取首页游戏列表返回值
export type HomeListModel = RouterOutput['home']['list'];

// 获取指定类型游戏列表传参
export type GameListParams = ArrayElement<RouterInput['game']['list']>;
// 获取指定类型游戏列表返回值
export type GameListModel = RouterOutput['game']['list'];

// 获取商户列表返回值
export type TenantListModel = RouterOutput['auth']['tenants'];

// 获取商户信息返回值
export type TenantInfoModel = RouterOutput['tenant']['info'];

// 获取认证信息返回值
export type AuthInfoModel = RouterOutput['auth']['info'];

// 获取验证码传参
export type OptGenParams = RouterInput['otp']['gen'];

// 获取验证码返回值
export type OptGenModel = RouterOutput['otp']['gen'];

// 获取验证码传参
export type OptVerifyParams = RouterInput['otp']['verify'];
export type IdentifierType = OptVerifyParams['identifierType'];

// 获取验证码返回值
export type OptVerifyModel = RouterOutput['otp']['verify'];

// 获取商户通道信息返回值
export type ChannelInfoModel = RouterOutput['channel']['info'];

// 修改密码传参
export type ChangePwdParams = RouterInput['auth']['chagePassword'];

// 验证登录密码
export type ValidatePasswordParams = RouterInput['user']['validate'];
export type ValidatePasswordModel = RouterOutput['user']['validate'];

// 获取轮播数据返回值
export type CarouselConfigModel = RouterOutput['carouselConfig']['list'];

// 获取公告列表返回值(未登录)
export type AnnouncementLoginOutModel = RouterOutput['announcement']['loginOut'];

// 获取客服配置
export type CustomerServiceModel = RouterOutput['service']['list'];
export type CustomerServiceType = RouterOutput['service']['list']['types'][number];
export type CustomerServiceItem = RouterOutput['service']['list']['services'][number];
export type CustomerServiceOnlineItem = RouterOutput['service']['list']['onlineServices'][number];
export type PublicCustomServiceModel = RouterOutput['service']['listPublic'];

// 获取主媒体配置返回值
export type MainMediaModel = RouterOutput['mainMedia']['list'];

// 获取首页轮播图/侧边栏跳转/首页营销图片
export type BannerListParams = {
  bannerType: string
}
export type RegisterRewardApplyParams = RouterOutput['registerReward']['apply'];
