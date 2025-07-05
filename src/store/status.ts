import { defineStore } from 'pinia'
import { Storage } from '@ionic/storage'

const storage = new Storage();
(async () => {
  await storage.create()
})()

export const useStatusStore = defineStore({
  id: 'status',
  state: () => ({
    homeInstallModalVisible: false, // 首页安装弹窗显示状态
    announcementInvisible: false,   // 公告是否不再显示
    drawerLeftIsOpen: false,        // 首页的抽屉页面是否打开， 默认关闭
    assetsOrderModalVisible: false, // 资产订单弹窗显示状态
    viewReload: false,              // 视图是否重新加载
    redirectRoute: '',              // 重定向路由
    isRegisterPage: false,          // 重定向路由
    adReported: false,              // 广告是否上报
    isMainTreeLoading: false,       // 主树是否加载中 目前是依赖于delay 1s 后设置为true
  }),
  actions: {
    /**
     * @description 设置首页安装弹窗显示状态
     * @param visible 显示状态
     */
    setHomeInstallModalVisible(visible: boolean) {
      this.homeInstallModalVisible = visible;
    },

     /**
      * 设置首页首页左抽屉显示状态
      * @param visible 显示状态
      */
     setDrawerLeftIsOpen(visible: boolean) {
      this.drawerLeftIsOpen = visible;
    },

    /**
     * @description 设置公告是否不再显示状态
     * @param invisible 不显示状态
     */
    setAnnouncementInvisible(invisible: boolean) {
      this.announcementInvisible = invisible;
    },

    /**
     * @description 设置视图是否重新加载
     * @param value 是否重新加载
     */
    setViewReload(value: boolean = true) {
      this.viewReload = value;
    },

    /**
     * @description 设置重定向路由
     * @param route 重定向路由
     */
    setRedirectRoute(route: string) {
      this.redirectRoute = route;
    },

    /**
     * @description 广告是否上报
     */
    async getAdReported(): Promise<boolean> {
      this.adReported = await storage.get('adReported');
      return this.adReported;
    },

    /**
     * @description 设置广告是否上报
     * @param reported 是否上报
     */
    async setAdReported(reported: boolean) {
      this.adReported = reported;
      await storage.set('adReported', reported);
    },
  }
})
