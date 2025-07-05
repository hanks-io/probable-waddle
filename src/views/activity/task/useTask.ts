import { useTaskStore } from '@/store/task'
import { ZTaskTypeEnumType } from '@/enums/types'

export default () => {
  const taskStore = useTaskStore();

  taskStore.completedTheTaskList.length
  const {
    tasksInProgress,
    completedTheTaskList
  } = toRefs(taskStore);

  onMounted(() => {
    taskStore.updateTaskList(ZTaskTypeEnumType.Enum.NewbieTask)
  })

  return {
    tasksInProgress,
    completedTheTaskList,
  }
}