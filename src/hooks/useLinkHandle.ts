import { openUrl } from "@/utils/app";
import { httpCompletion } from "@/utils";
import { useActivityStore } from "@/store/activity";
import { useVipStore } from '@/store/vip';
import { jumpActivityId } from '@/utils/url'
import { redirectUrl } from '@/utils/app';
import { SuggestionActivityListModel } from "@/api/activity/model";
import { showToast,checkNumByStr} from '@/utils'
import router from '@/router'

/**
 * @description 活动store
 * @param type 
 * @param value 
 * @param valueTpe 
 * @returns isMet 是否满足条件
 */
const useLinkHandle = async (type: string | null | undefined = undefined, value: string, valueTpe?: SuggestionActivityListModel[0]['valueType']): boolean => {
	const activityStore = useActivityStore(); 
	//  type 类型两个值 InternalLink 或 Custom
	if (type === 'Custom') {
		openUrl(httpCompletion(value));
		return true;
	}
	
	if (valueTpe === 'ACTIVITY') {
		const activityList = (await activityStore.getActivityList()) as any[];
		const activity = activityList.find(item => item?.id === Number(value));
		if (!activity){
			showToast('activity.notMet')
			return false
		}
		if (activity?.type === 'Rebate') {
				activityStore.pageType = 2;
				activityStore.curPageType = 2;
				//  加一个微任务延后操作
				queueMicrotask(()=>{
					router.push(`/main/promo`);
				})
		} else {
				const activityRouterId = jumpActivityId(activity);
				router.push(`/activity/${activity?.type}/${activityRouterId}`);
		}

	} else if (valueTpe === 'CODE') {
		if (value === '/') {
			router.replace('/launch').then(() => {
				location.reload();
			});
		} else if (value === '/Redeem') {
			activityStore.pageType = 4;
			activityStore.curPageType = 4;
			//  加一个微任务延后操作
			queueMicrotask(()=>{
				router.push(`/main/promo`);
			})
		} else if (value === '/main/promo') {
			activityStore.pageType = 1;
			activityStore.curPageType = 1;
			router.push(value)
		} else {
			if (value == '/main/entrar' || value == '/recharge/apply') {
				const bool = await useHandleRecharge()
				if (bool) return true
			} else if (value == '/main/withdraw' || value == '/withdraw/apply') {
				const bool = await useHandleWithdraw()
				if (bool) return true
			}
			if (value == '/activity/vip') {
				// 如果是vip页面, 则检测是否有权限
				const vipStore = useVipStore()
				await vipStore.getActivityVipType()
				if (!vipStore.activityVipType) return false;
			}
			router.push(value)
			return true;
		}
	}
}
export default useLinkHandle


export const useOpenSwiperLink = async (linkType: string, linkValue: string) => {
	const activityStore = useActivityStore();
	// 外部链接跳转
	if (linkType === 'url') {
		redirectUrl(httpCompletion(linkValue))
		return;
	}
	// 项目路由跳转
	if (linkType === 'activity') {
		// linkValue是数字, 则跳转到活动详情页
		if (checkNumByStr(linkValue)) {
			const activityList = await activityStore.getActivityList();
			// 根据id查找linkValue对应活动
			const activity: any = activityList.find(it => it?.id === Number(linkValue));
			if (!activity) {
				showToast('activity.notMet')
				return
			}
			if (activity?.type === 'Rebate') {
				activityStore.pageType = 2;
				router.push(`/main/promo`);
			} else {
				const activityPath = jumpActivityId(activity);
				router.push(`/activity/${activity?.type}/${activityPath}`);
			}
			return;
		}
		if (linkValue === '/Redeem') {
			activityStore.pageType = 4;
			router.push(`/main/promo`);
		} else if (linkValue == '/') {
			router.replace('/launch').then(() => {
				location.reload();
			});
		} else {
			if (linkValue == '/main/entrar' || linkValue == '/recharge/apply') {
				const bool = await useHandleRecharge()
				if (bool) return
			} else if (linkValue == '/main/withdraw' || linkValue == '/withdraw/apply') {
				const bool = await useHandleWithdraw()
				if (bool) return
			}
			if (linkValue == '/activity/vip') {
				// 如果是vip页面, 则检测是否有权限
				const vipStore = useVipStore()
				await vipStore.getActivityVipType()
				if (!vipStore.activityVipType) return;
			}
			router.push(linkValue);
		}
		return;
	}
}
