import type { RouteRecordRaw } from 'vue-router'
import TransitionPage from '@/views/system/transition/index.vue'

const launchPage = () => import('@/views/system/launch/index.vue')
const downloadPage = () => import('@/download/index.vue')
const RestrictedPage = () => import('@/views/system/restricted/index.vue')
const unAvailablePage = () => import('@/views/system/unAvailablePage/index.vue')
const Page405 = () => import('@/views/system/405/index.vue')

/**
 * @description 路由列表
 * @property meta[auth] 是否需要登陆验证
 */
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/launch',
	},
	{
		// 根路由(启动页)
		path: '/launch',
		component: launchPage,
	},
	{
		// 限制页
		path: '/restricted',
		component: RestrictedPage,
	},
	{
		// 路由不存在时自动重定向
		path: '/:pathMatch(.*)*',
		redirect: '/launch',
	},
	{
		// 过渡页
		path: '/transition',
		component: TransitionPage,
	},
	{
		// 下载页
		path: '/download',
		component: downloadPage,
	},
	{
		// 登录页
		path: '/login',
		component: TransitionPage,
	},
	{
		// 注册页
		path: '/register',
		component: TransitionPage,
	},
	{
		// 兑换码页
		path: '/Redeem',
		component: TransitionPage,
		meta: { auth: true },
	},
	{
		// 不可用页
		path: '/unAvailable',
		component: unAvailablePage,
	},
  {
    // 405页
		path: '/405',
		component: Page405,
  }
]

export default routes
