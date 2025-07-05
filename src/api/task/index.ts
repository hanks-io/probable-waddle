// 任务相关
import { appTrpc } from '@/trpc/app.trpc'
import { apiHandle } from '@/api/handle'
import type { TaskListParams, TaskListModel, TaskDetailParams, TaskDetailModel, TaskRewardParams, TaskReceiveParams } from './model'

// 获取任务列表
export const taskListApi = (params: TaskListParams) => apiHandle(appTrpc.task.list.query, params)

// 获取任务详情
export const taskDetailApi = (params: TaskDetailParams) => apiHandle(appTrpc.task.details.query, params)

// 查询任务奖励
export const taskRewardApi = (params: TaskRewardParams) => apiHandle(appTrpc.task.award.query, params)

// 领取任务奖励
export const taskReceiveApi = (params: TaskReceiveParams) => apiHandle(appTrpc.task.receive.mutate, params)

// 批量领取任务奖励
export const taskBatchReceiveApi = (params: TaskReceiveParams) => apiHandle(appTrpc.task.batchReceive.mutate, params)