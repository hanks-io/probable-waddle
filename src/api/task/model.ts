// 任务相关
import type { RouterInput, RouterOutput } from '@/trpc/app.trpc'

// 任务列表
export type TaskListParams = RouterInput['task']['list']
export type TaskListModel = RouterOutput['task']['list']
export type TaskListItem = TaskListModel['taskList'][number]
export type TaskType = TaskListItem['taskType']

// 任务详情
export type TaskDetailParams = RouterInput['task']['details']
export type TaskDetailModel = RouterOutput['task']['details']

// 查询任务奖励
export type TaskRewardParams = RouterInput['task']['award']
export type TaskRewardModel = RouterOutput['task']['award']
export type TaskRewardItem = TaskRewardModel[number]

// 任务领取奖励
export type TaskReceiveParams = RouterInput['task']['receive']
export type TaskReceiveModel = RouterOutput['task']['receive']
