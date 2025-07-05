
import { appTrpc } from "@/trpc/app.trpc";
import { apiHandle } from "../handle";
import {
  RegisterParams,
  LoginParams,
  HotParams,
  GameListParams,
  OptGenParams,
  OptVerifyParams,
  ChangePwdParams,
  ForgetParams,
  ChannelInfoByIdParams,
  BannerListParams,
  ValidatePasswordParams,
  RegisterRewardApplyParams
} from "./model";

/**
 * @description 获取商户列表
 */
export const authTenantsApi = () => appTrpc.auth.tenants.query();

/**
 * @description 通过host获取商户信息
 */
export const domainInfoApi = (domain: string, cache: boolean = true) => {
  const result = window.__APP_CONFIG__?.domainInfo?.result?.data?.json;
  if (!cache) {
    return appTrpc.tenant.domainInfo.query({ domain })
  }
  if (result) {
    return Promise.resolve(result);
  }
  return appTrpc.tenant.domainInfo.query({ domain })
};

/**
 * @description 通过id获取通道信息
 */
export const channelInfoApi = (params?: ChannelInfoByIdParams) => {
  const result = window.__APP_CONFIG__?.channelInfo?.result?.data?.json;
  if (result) {
    return Promise.resolve(result);
  }
  return params ? appTrpc.channel.info.query(params) : {}
};

/**
 * @description 注册
 */
export const authRegisterApi = (params: RegisterParams) => apiHandle(appTrpc.auth.registe.mutate, params, false);

/**
 * @description 登录
 */
export const authLoginApi = (params: LoginParams) => apiHandle(appTrpc.auth.login.mutate, params, false);

/**
 * @description 是否能找回密码
 */
export const authCanFindPasswordApi = () => appTrpc.auth.canForgetPassword.query();

/**
 * @description 忘记密码
 */
export const authForgetApi = (params: ForgetParams) => apiHandle(appTrpc.auth.forgetPassword.mutate, params, false);

/**
 * @description 获取商户信息
 */
export const tenantInfoApi = () => {
  const result = window.__APP_CONFIG__?.tenantInfo?.result?.data?.json;
  if (result) {
    return Promise.resolve(result);
  }
  return apiHandle(appTrpc.tenant.info.query, undefined, false)
};

/**
 * @description 获取底部文案信息
 */
export const footerTextApi = () => apiHandle(appTrpc.tenant.footerText.query, undefined, false);

/**
 * @description 首页热门列表
 */
export const homeHotApi = (params: HotParams) => apiHandle(appTrpc.home.hot.query, params, false);

/**
 * @description 游戏品牌商列表
 */
export const homePlatformListApi = () => apiHandle(appTrpc.home.platformList.query, undefined, false);
/**
 * @description 首页游戏列表
 */
export const homeListApi = () => apiHandle(appTrpc.home.list.query, undefined, false);

/**
 * @description 搜索游戏
 */
export const gameListApi = (params: GameListParams) => apiHandle(appTrpc.game.list.query, params, false);

/**
 * @description 获取认证信息
 */
export const authInfoApi = () => apiHandle(appTrpc.auth.info.query, undefined, false);

/**
 * @description 验证登录密码
 */
export const validatePasswordApi = (params: ValidatePasswordParams) => apiHandle(appTrpc.user.validate.mutate, params, false);

/**
 * @description 获取验证码
 */
export const optGenApi = (params: OptGenParams) => apiHandle(appTrpc.otp.gen.mutate, params, false);

/**
 * @description 验证验证码/密码
 */
export const optVerifyApi = (params: OptVerifyParams) => apiHandle(appTrpc.otp.verify.mutate, params, false);

/**
 * @description 验证用户是否存在
 */
export const authValidateUserApi = (params: { identifier: string }) => apiHandle(appTrpc.auth.validateUser.query, params, false);

/**
 * @description 修改密码
 */
export const authChangePasswordApi = (params: ChangePwdParams) => apiHandle(appTrpc.auth.chagePassword.mutate, params, false);

/**
 * @description 获取轮播数据
 */
export const carouselConfigApi = (params: { type: 'image' | 'text' }) => apiHandle(appTrpc.carouselConfig.list.query, params, false);

/**
 * @description 获取公告弹窗列表(未登录)
 */
export const announcementLoginOutApi = () => apiHandle(appTrpc.announcement.loginOut.query, undefined, false);

/**
 * @description 公告消息
 */
export const announcementMessageApi = () => apiHandle(appTrpc.announcementMessage.announcementMessage.query, undefined, false);

/**
 * @description 获取客服配置
 */
export const customerServiceApi = () => apiHandle(appTrpc.service.list.query);

/**
 * @description 获取公共客服配置
 */
export const publicCustomerServiceApi = () => apiHandle(appTrpc.service.listPublic.query, undefined, false);

/**
 * @description 获取主媒体配置
*/
export const mainMediaListApi = () => apiHandle(appTrpc.mainMedia.list.query, undefined, false);

/**
 * @description 获取首页轮播图/侧边栏跳转/首页营销图片
 */
export const bannerListApi = (params: BannerListParams) => apiHandle(appTrpc.banner.list.query, params, false);
/**
 * 
 * @param params 
 * @description 获取奖池数据
 */
export const prizePoolInfoApi = () => apiHandle(appTrpc.prizePool.info.query, undefined, false);



/**
 * @description 获取商户跳转防封谷歌页域名列表
 */
export const jumpGoogleListApi = () => apiHandle(appTrpc.tenant.jumpGoogleList.query, undefined, false);



/**
 * @description 注册奖励信息
 */
export const registerRewardInfoApi = () => apiHandle(appTrpc.registerReward.info.query, undefined,);


/**
 * @description 注册奖励申请
 */
export const registerRewardApplyApi = (params: RegisterRewardApplyParams) => apiHandle(appTrpc.registerReward.apply.mutate, params);

/**
 * @description 获取商户跳转防封谷歌页域名配置
 */
export const getRescueDomainApi = (params: { domain: string }) => apiHandle(appTrpc.tenant.rescueDomain.query, params, false);

/**
 * @description 获取oneLinkUrl
 */
export const getOneLinkUrlApi = (params: { channelId?: number | string , tenantId: number | string, params: string }) => apiHandle(appTrpc.channel.oneLinkUrl.query, params, false);



/**
 * @description 获取首页排行榜的数据
 */
export const getUserTopListApi = ( ) => apiHandle(appTrpc.rank.userRank.query,  undefined, false);
