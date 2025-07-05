// vip
import { defineStore } from 'pinia'
import { Storage } from '@ionic/storage'
import { showLoading } from '@/utils/loading'
import { getTheme } from '@/theme/hooks'
import { useAppStore } from '@/store/app';
import { showLogin } from '@/hooks/ShowLogin'
import { activityVipInfoApi } from "@/api/activity";
import { storeDefaultValue } from '@/hooks/StoreDefaultValue';
import { firstVipIcon, firstVipMyBg, firstVipTextBg, firstVipDetailBg, defaultVipIcon, defaultVipTextColor } from '@/views/activity/vip/data'
const storage = new Storage()
	; (async () => {
		await storage.create()
	})()

/**
 * @description 活动模块
 */
export const useVipStore = defineStore({
	id: 'vip',
    state: () => ({
            vipLevelCount: 0, // vip等级数量
            activityVipInfo: storeDefaultValue<Record<string, any>>(),  // vip活动信息
            activityVipType: false, // vip活动是否开启
            activityVipOpen: true,  // vip活动信息
            claimBtnIsEnable: false,  // vip领取按钮是否可点击
    }),

	actions: {
        // 获取vip活动是否开启
        async getActivityVipType() {
            let flag = false;
            if (this.activityVipInfo) {
                flag = true;
            }
            const appStore = useAppStore();
            if (appStore.token) {
                const res = await this.getActivityVipInfoApi()
                flag = !!res;
            } else {
                showLogin();
            }
            this.activityVipType = flag;
        },
        // 获取vip活动信息
        async getActivityVipInfoApi() {
            try {
                const res = await activityVipInfoApi();
                if (res.status == true) {
                    this.activityVipInfo = res.data
                    this.activityVipOpen = res.status
                    return true;
                }else{
                    this.activityVipOpen = false
                    return false
                }
            } catch (error) {
                return false
            }
        },
        /**
         * @description 获取vip图标路径
         * @param level vip等级
         * @returns icon路径
         */
        getVipIconPath(level: number): string {
            const skinDate = getTheme()
            const isFirst = skinDate?.skin != 'default';
            let index = 0
            const iconCount = isFirst ? firstVipIcon.length : defaultVipIcon.length
            if (iconCount >= this.vipLevelCount) {
                index = level
            }
            else {
                index = Math.floor(level /  Math.floor(this.vipLevelCount / iconCount))
                index = index >= iconCount ? iconCount - 1 : index
            }
            if (isFirst)
              return `/first/vip/${firstVipIcon[index]}.png` 
            else
              return `/icons/perfil/${defaultVipIcon[index]}.png`
        },

        /**
         * @description 获取vip文字颜色
         * @param level vip等级
         * @returns 颜色
         */
        getVipTextColor(level: number): string {
            let index = 0
            const colorCount = defaultVipTextColor.length
            if (colorCount >= this.vipLevelCount) {
                index = level
            }
            else {
                index =Math.floor(level /  Math.floor(this.vipLevelCount / colorCount))
                index = index >= colorCount ? colorCount - 1 : index
            }
            return defaultVipTextColor[index]
        },

        /**
         * @description first皮肤 获取背景图/详情图/text背景颜色
         * @param level vip等级
         * @returns VIP我的 背景图/详情图/text背景颜色
         */
        getFirstVipBg(level: number, type: string) {
            let index = 0;
            const iconCount = firstVipIcon.length;
            const vipBgCount = firstVipMyBg.length;
            const averageCount = firstVipIcon.length / firstVipMyBg.length;
            if (iconCount >= this.vipLevelCount) {
                index = Math.floor(level/averageCount);
            } else {
                index = Math.floor(Math.floor(level / Math.floor(this.vipLevelCount / iconCount))/averageCount);
                index = index >= vipBgCount ? vipBgCount - 1 : index;
            }
            
            switch(type) {
                case 'myVipBg':
                    return `/first/vip/${firstVipMyBg[index]}.png`
                case 'myVipDetailBg':
                    return `/first/vip/${firstVipDetailBg[index]}.png`
                case 'myVipTextBg':
                    return `/first/svg/vip/${firstVipTextBg[index]}.svg`
            }
        }
    }
})
