import { apiHandle } from '../handle'
import { appTrpc } from '@/trpc/app.trpc'
import { AssetsChangeParams, FavoriteAddParams, FavoriteDelParams, FavoriteListParams, GameRecordParams, MailListParams, UserBindParams, UserProfitParams } from './model'

/**
 * @description 退出登录
 */
export const authLogoutApi = () => apiHandle(appTrpc.auth.logout.mutate)

/**
 * @description 用户基本信息
 */
export const userDetailsApi = () => apiHandle(appTrpc.user.details.query)

/**
 * @description 用户财务信息
 */
export const userAssetsApi = () => apiHandle(appTrpc.user.assets.query)

/**
 * @description 邦定手机号/邮箱
 */
export const userBindApi = (params: UserBindParams) =>apiHandle(appTrpc.user.bind.mutate, params)

/**
 * @description 获取邮件列表
 */
export const mailListApi = (params: MailListParams) => apiHandle(appTrpc.mail.list.query, params)

/**
 * @description 获取邮件详情
 */
export const mailDetailsApi = (mailId: number) => apiHandle(appTrpc.mail.read.query, { mailId })

/**
 * @description 查看未读邮件数量
 */
export const mailUnreadApi = () => apiHandle(appTrpc.mail.noRead.query)

/**
 * @description 查看未读邮件数量
 */
export const mailReadAllApi = () => apiHandle(appTrpc.mail.update.query)

/**
 * @description 获取用户收藏列表
 */
export const favoriteListApi = (params: FavoriteListParams) => apiHandle(appTrpc.favorite.list.query, params);

/**
 * @description 添加收藏
 */
export const favoriteAddApi = (params: FavoriteAddParams) => apiHandle(appTrpc.favorite.create.mutate, params);

/**
 * @description 删除收藏
 */
export const favoriteDelApi = (params: FavoriteDelParams) => apiHandle(appTrpc.favorite.del.mutate, params);

/**
 * @description 获取用户明细(账变记录)
 */
export const assetsChangeApi = (params: AssetsChangeParams) => apiHandle(appTrpc.record.assetsChange.query, params);

/**
 * @description 获取用户投注记录
 */
export const gameRecordApi = (params: GameRecordParams) => apiHandle(appTrpc.record.gameRecord.query, params);

/**
 * @description 获取用户个人输赢报表
 */
export const userProfitApi = (params: UserProfitParams) => apiHandle(appTrpc.record.userProfit.query, params);

/**
 * @description 获取公告弹窗列表(已登陆)
 */
export const announcementLoginInApi = () => apiHandle(appTrpc.announcement.loginIn.query);

/**
 * @description 更新头像
 */
export const updateAvatarApi = (avatarName: string) => apiHandle(appTrpc.user.updateAvatar.mutate, { avatarName });

/**
 * @description 更新极光webpush registrationId
 */
export const updateRegistrationIdApi = (params: { jGRegisterId: string }) => apiHandle(appTrpc.user.updateJGRegisterId.mutate, params, false);

/**
 * @description 获取用户首充上报状态
 */
export const firstRechargeStatusApi = () => apiHandle(appTrpc.user.getHasFirstRechargeAd.query);

/**
 * @description 更新用户首充上报状态
 */
export const updateFirstRechargeStatusApi = () => apiHandle(appTrpc.user.setHasFirstRechargeAd.mutate);
