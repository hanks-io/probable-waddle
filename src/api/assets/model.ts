import type { RouterInput, RouterOutput } from '@/trpc/app.trpc'

// 设置提现密码传参
export type WithdrawPasswordParams = RouterInput['withdraw']['editAssetPassword']

// 查询提现类型(大类)列表返回值
export type WithdrawTypeModel = RouterOutput['withdraw']['type']

// 查询提现方式(小类)列表返回值
export type WithdrawTypeSubModel = RouterOutput['withdraw']['typeSub']

// 查询玩家打码量返回值
export type WithdrawFlowModel = RouterOutput['withdraw']['getUserFlow']

// 查询提现账号列表返回值
export type WithdrawAccountModel = RouterOutput['withdraw']['getWithdrawAccount']

// 添加提现账号传参
export type WithdrawEditAccountParams = RouterInput['withdraw']['editAccount']
// 添加提现账号返回值
export type WithdrawEditAccountModel = RouterOutput['withdraw']['editAccount']

// 创建提现订单传参
export type WithdrawCreateParams = RouterInput['withdraw']['createOrder']

// 查询提现记录列表传参
export type WithdrawRecordParams = RouterInput['withdraw']['record']
// 查询玩家提现记录列表返回值
export type WithdrawRecordModel = RouterOutput['withdraw']['record']

// 查询商户充值方式列表返回值
export type PayListModel = RouterOutput['pay']['list']
export type PayTypeListItem = PayListModel['tenantPayTypeList'][number]
export type RewardRateListItem = {
    amount: number;
    rate: number;
    betMultiple: number;
}
export type LimitGameDataItem = {
    gameId: number;
}
export type LimitGamePlatformItem = {
    platformId: number;
    gameData: LimitGameDataItem[];
}
export type LimitGameItem = {
    gameType: string;
    platformData: LimitGamePlatformItem[];
}

// 查询商户充值记录列表传参
export type PayRecordListParams = RouterInput['pay']['recordList']
// 查询商户充值记录列表返回值
export type PayRecordListModel = RouterOutput['pay']['recordList']

// 创建充值订单传参
export type PayCreateParams = RouterInput['pay']['create']
// 创建充值订单返回值
export type PayCreateModel = RouterOutput['pay']['create']

// 查询支付渠道列表h传参
export type PayChannelListParams = RouterInput['pay']['channelList']
// 查询支付渠道列表返回值
export type PayChannelListModel = RouterOutput['pay']['channelList']

// 重新支付返回值
export type PayAgainModel = RouterOutput['pay']['payAgain']

// 取消支付订单传参
export type PayCancelParams = RouterInput['pay']['cancelOrder']
// 取消支付订单返回值
export type PayCancelModel = RouterOutput['pay']['cancelOrder']

// 稽核记录
export type AuditRecordParams = RouterInput['flow']['list']
export type AuditRecordModel = RouterOutput['flow']['list']
export type AuditRecordItem = AuditRecordModel['queryWhiteList'][number]

// 稽核记录详情
export type AuditRecordDetailParams = RouterInput['flow']['details']


//  获取取款账号列表
export type WithdrawAccountParams = RouterInput['withdraw']['getWithdrawAccount']


//  保存提款账号
export type editAccountApiParams = RouterInput['withdraw']['editAccount']


//  更新转账凭证
export type UpdateVoucherParams = RouterInput['pay']['updateVoucher']



