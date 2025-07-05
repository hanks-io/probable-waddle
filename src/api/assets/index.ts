import { appTrpc } from "@/trpc/app.trpc";
import { apiHandle } from "../handle";
import type { 
  PayCreateParams, 
  PayRecordListParams, 
  WithdrawPasswordParams, 
  PayChannelListParams, 
  PayCancelParams,
  WithdrawEditAccountParams,
  WithdrawCreateParams,
  WithdrawRecordParams,
  AuditRecordParams,
  AuditRecordDetailParams,
  editAccountApiParams,
  WithdrawAccountParams,
  UpdateVoucherParams,
} from "./model";
import type {bindCPFInfoType } from '@/views/recharge/hooks/usePayCreate'
/**
 * @description 设置提现密码
 */
export const withdrawPasswordApi = (params: WithdrawPasswordParams) => apiHandle(appTrpc.withdraw.editAssetPassword.mutate, params);

/**
 * @description 查询玩家打码量
 */
export const withdrawGetUserFlowApi = () => apiHandle(appTrpc.withdraw.getUserFlow.query);

/**
 * @description 查询提现类型列表
 */
export const withdrawTypeApi = () => apiHandle(appTrpc.withdraw.type.query);

/**
 * @description 查询提现方式列表
 */
export const withdrawTypeSubApi = (params: { tenantWithdrawTypeId: number }) => apiHandle(appTrpc.withdraw.typeSub.query, params);

/**
 * @description 查询提现账号列表
 */
export const withdrawAccountApi = (params: WithdrawAccountParams) => apiHandle(appTrpc.withdraw.getWithdrawAccount.query, params);

/**
 * @description 获取最后使用的提现账号
 */
export const getLastWithdrawAccountApi = () => apiHandle(appTrpc.withdraw.getLastWithdrawAccount.mutate);

/**
 * @description 添加/编辑提现账号
 */
export const withdrawEditAccountApi = (params: WithdrawEditAccountParams) => apiHandle(appTrpc.withdraw.editAccount.mutate, params);

/**
 * @description 创建提现订单
 */
export const withdrawCreateApi = (params: WithdrawCreateParams) => apiHandle(appTrpc.withdraw.createOrder.mutate, params);

/**
 * @description 查询提现记录列表
 */
export const withdrawRecordApi = (params: WithdrawRecordParams) => apiHandle(appTrpc.withdraw.record.query, params);

/**
 * @description 查询商户充值列表
 */
export const payListApi = () => apiHandle(appTrpc.pay.list.query);

/**
 * @description 充值记录
 */
export const payRecordListApi = (params: PayRecordListParams) => apiHandle(appTrpc.pay.recordList.query, params);

/**
 * @description 创建充值订单
 */
export const payCreateApi = (params: PayCreateParams) => apiHandle(appTrpc.pay.create.mutate, params);
 
/**
 * @description 查询支付渠道列表
 */
export const payChannelListApi = (params: PayChannelListParams) => apiHandle(appTrpc.pay.channelList.query, params);

/**
 * @description 继续支付
 */
export const payAgainApi = (params: { orderNo: string }) => apiHandle(appTrpc.pay.payAgain.mutate, params);

/**
 * @description 取消支付订单
 */
export const payCancelApi = (params: PayCancelParams) => apiHandle(appTrpc.pay.cancelOrder.mutate, params);

/**
 * @description 确认支付订单
 */
export const payConfirmApi = (params: { orderNo: string }) => apiHandle(appTrpc.pay.payConfirm.mutate, params);

/**
 * @description 查询是否免手续费
 */
export const isFreeWaivedApi = () => apiHandle(appTrpc.withdraw.isFeeWaived.query);

/**
 * @description 稽核记录
 */
export const auditRecordApi = (params: AuditRecordParams) => apiHandle(appTrpc.flow.list.query, params);

/**
 * @description 稽核记录详情
 */
export const auditRecordDetailApi = (params: AuditRecordDetailParams) => apiHandle(appTrpc.flow.details.query, params);


/**
 * @description 保存提款账号
 */
export const editAccountApi = (params: editAccountApiParams) => apiHandle(appTrpc.withdraw.editAccount.mutate, params);


/**
 * @description 删除提款账号
 */
export const deleteWithdrawAccountApi = (ids: number[]) => apiHandle(appTrpc.withdraw.deleteWithdrawAccount.mutate, {ids});




/**
 * @description 获取款的大类和小类
 */
export const getWithdrawTypeAndSubApi = () => apiHandle(appTrpc.withdraw.withdrawTypeAndSub.query);


/**
 * @description 获取款的大类和小类
 */
export const getUserWithdrawInfoApi = () => apiHandle(appTrpc.withdraw.getUserWithdrawInfo.query);




/**
 * @description 充值绑定cpf
 */
export const payBindCPFApi = (params: Record<bindCPFInfoType, string>) => apiHandle(appTrpc.pay.bindCPF.mutate, params);



export const updateVoucherApi = (params: UpdateVoucherParams) => apiHandle(appTrpc.pay.updateVoucher.mutate, params);



/**
 * @description 查询Wallet钱包余额
 */
export const queryWalletBalanceApi = (walletCode: string) => apiHandle(appTrpc.wallet.balance.query, {walletCode});






/**
 * @description 获取Wallet钱包大厅
 */
export const getWalletHallApi = (walletCode: string) => apiHandle(appTrpc.wallet.hall.query, {walletCode});




/**
 * @description 获取银行信息
 */
export const getBankListApi = (params) => apiHandle(appTrpc.bank.list.query, { page: 1, pageSize: 1000, ...params});

