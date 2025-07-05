import { maxWidth } from '@/data'
import { defineStore } from 'pinia'

/**
 * @description Element信息
 */
export const useElementStore = defineStore({
  id: 'element',
  state: () => ({
    tabBarHeight: 0, // 底部导航栏高度
    screenWidth: maxWidth, // 屏幕宽度
  }),

  actions: {
    // 设置底部导航栏高度
    setTabBarHeight(height: number) {
      this.tabBarHeight = height
    },
    // 设置屏幕宽度
    setScreenWidth(width: number) {
      this.screenWidth = width
    },
  },
})
