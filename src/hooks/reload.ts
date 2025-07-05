import { ref, nextTick } from 'vue'

export const useStatePreservingRefresh = () => {
  const router = useRouter()
  const route = useRoute()
  const isRefreshing = ref(false)

  const refresh = async () => {
    isRefreshing.value = true

    // 保存当前状态
    const state = { ...route.query }

    // 仅更新state不会触发路由刷新,需要配合query参数变化
    await router.replace({
      path: route.path,
      query: {
        ...state,
        _t_: Date.now() // 在query中添加时间戳触发刷新
      }
    })

    await nextTick()
    isRefreshing.value = false
  }

  return {
    refresh,
    isRefreshing
  }
}

export const useRouteRefresh = (path?: string) => {
  const router = useRouter()
  const route = useRoute()

  const refresh = async () => {
    // 保存当前路由信息
    const { query } = route

    // 先跳转到一个临时路由
    await router.replace({
      path: '/refresh'
    })
    // 等待下一个 tick
    await nextTick()

    // 再跳回原路由
    await router.replace({
      path: path || route.path,
      query
    })
  }

  return {
    refresh
  }
}
