import { RouterInput, RouterOutput } from "@/trpc/app.trpc";

// 用户基本信息
export type UserDetailsModel = RouterOutput['user']['details'];

// 用户财务信息
export type UserAssetsModel = RouterOutput['user']['assets'];

// 用户邦定手机号/邮箱传参
export type UserBindParams = RouterInput['user']['bind'];
export type UserBindIdentifier = UserBindParams['identifierType'];

// 获取邮件列表传参
export type MailListParams = RouterInput['mail']['list'];

// 获取邮件详情返回值
export type MailDetailsModel = RouterOutput['mail']['read'];

// 获取用户收藏列表返传参
export type FavoriteListParams = RouterInput['favorite']['list'];
// 获取用户收藏列表返回值
export type FavoriteListModel = RouterOutput['favorite']['list'];

// 添加收藏传参
export type FavoriteAddParams = RouterInput['favorite']['create'];

// 删除收藏传参
export type FavoriteDelParams = RouterInput['favorite']['del'];

// 获取用户明细(账变记录)传参
export type AssetsChangeParams = RouterInput['record']['assetsChange'];

// 获取用户明细(账变记录)返回值
export type AssetsChangeModel = RouterOutput['record']['assetsChange'];

// 获取用户投注记录传参
export type GameRecordParams = RouterInput['record']['gameRecord'];
// 获取用户投注记录返回值
export type GameRecordModel = RouterOutput['record']['gameRecord'];

// 获取用户个人输赢报表传参
export type UserProfitParams = RouterInput['record']['userProfit'];
// 获取用户个人输赢报表返回值
export type UserProfitModel = RouterOutput['record']['userProfit'];

// 获取公告列表返回值(已登录)
export type AnnouncementLoginInModel = RouterOutput['announcement']['loginIn'];

// 获取头像列表信息返回值
export type AvatarCountModel = RouterOutput['avatarCount']['avatarCount'];

// 获取公告通知列表返回值
export type AnnouncementMessageModel = RouterOutput['announcementMessage']['announcementMessage'];
