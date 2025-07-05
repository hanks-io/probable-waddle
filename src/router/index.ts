import { Storage } from '@ionic/storage'
import { useAppStore } from '@/store/app'
import { showLogin } from '@/hooks/ShowLogin'
import { useStatusStore } from '@/store/status'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import routes from './modules/routes'
import activityRoutes from './modules/activity'
import { useUserStoreWithOut } from '@/store/user'

const storage = new Storage();

(async () => {
  await storage.create()
})()

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes, ...activityRoutes],
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  if (!navigator.onLine) {
    return next(false)
  }

  const appStore = useAppStore()
  const statusStore = useStatusStore()

  const token = await appStore.getToken()
  if (to.meta.auth && !token) { // 需要登录验证 且 未登录
    if (from.path === '/') {    // 来源页为初始页 则跳转到启动页
      return next({ path: '/launch', query: to.query })
    } else if (from.path === '/launch') { // 来源页为启动页 则跳转到首页
      statusStore.setRedirectRoute('login')
      return next({ path: '/main', query: to.query })
    }
  } else if (!to.meta.auth || token) { // 不需要登录验证 或 已经登录 则放行
    const fromQueryKeys = Object.keys(from.query)
    const toQueryKeys = Object.keys(to.query)
    const hasAllQuery = fromQueryKeys.every(key => toQueryKeys.includes(key))

    if (to.path === '/subscribeReward') {
      const userStore = useUserStoreWithOut()
      const user = await userStore.user || await userStore.getUser()
      if (token && !user?.canApplyRegisterReward) {
        return next({ path: '/main' })
      }
    }

    // 进入Betby游戏把from.path 存储在sessionStorage， 方便点击页面返回按钮， 返回来的路径
    if (to.path === '/main/Betby' && from.path !== '/main/Betby' && from.path !== '/launch') {
      window.sessionStorage.setItem("BetbyEntry", from.path)
    }
    // 从from.path === '/main/Betby' 到其他页面不带任何参数
    let list = ['.js', '.css']
    if (hasAllQuery || from.path === '/main/Betby' || list.some(name => from.redirectedFrom?.path?.includes(name)))
      return next()

    const modifiedTo = {
      ...to,
      query: { ...from.query, ...to.query },
    };

    return next(modifiedTo)
  }
  showLogin();  // 弹出登录框
  next(false);  // 中断当前导航
})

// 全局后置守卫
router.afterEach((to, from) => {
  const eventStore = useEventStore();

  if (to.meta.title) document.title = String(to.meta.title);  // 设置标题
  if (from.path !== '/') eventStore.setPreviousRoute(from.path);  // 设置上一个路由
  if (to.path.includes('/main/')) {
    sessionStorage.setItem('mainPath', to.path)
  }
})

export default router
