import { useI18n } from 'vue-i18n'
import { camelCase } from '@/utils'
import { bannerListApi } from '@/api/normal/index'
import { SuggestionActivityListModel } from "@/api/activity/model";
import { handleSidebarJumpType, handleSideValueType, handleInlineNavigation } from '@/utils/inlineNavigation'
import { useTenantStore } from '@/store/tenant'
import { useActivityStore } from '@/store/activity'


export default (props?: any) => {
  const { t } = useI18n();

  const tenantStore = useTenantStore();
  const activityStore = useActivityStore();
  
  const {
    tenantInfo,
  } = toRefs(tenantStore);

  const activityData = ref<any>([])

  const itemList: Record<string, () => Promise<any>> = {
    'style1': () => import('@/views/tabbar/components/DrawerLeft/components/activityList/1/index.vue'),
    'style2': () => import('@/views/tabbar/components/DrawerLeft/components/activityList/2/index.vue'),
  }

  const itemComponent = computed(() => {
    const componentKey = props.childComponentKey || tenantInfo.value?.sidebarBannerStyle;
    const promiseComponent = itemList[componentKey];
    if (promiseComponent) {
      const asyncComponent = defineAsyncComponent(promiseComponent);
      return markRaw(asyncComponent) as unknown as ComponentPublicInstance | null;
    }
    return null;
  })

  const activityList = computed(() => {
    if (!activityData.value?.length) return [];
    return activityData.value.map((item: any) => {
      const { value, valueType, shortName, } = item;
      let newName = shortName;
      if (valueType == 'ACTIVITY') {
        const activity = activityStore.activityList?.find((item: any) => item.id == value)
        if (!activity) {
          return null
        }
      }
      if (['ACTIVITY', 'CODE'].includes(valueType)) {
        newName = shortName ? shortName : translateActivityName(valueType, value)
      }
      return {
        ...item,
        shortName: newName
      }
    }).filter(Boolean)
  })

  const translateActivityName = (type: string, val: string | number) => {
    if (type == 'ACTIVITY') {
      const { type: activeType, name } = activityStore.activityList.find((item: any) => item.id == val) || {};
      if (activeType === 'Custom') return name;
      return activeType ? t(`activity1.${activeType}`) : '';
    }
    if (type == 'CODE') {
      const code = camelCase(val) || 'mainInicio';
      return t(`activity1.${code}`) || '';
    }
  }

  
  const getActivityList = async () => {
    try {
      const res = await bannerListApi({ bannerType: 'lobby_sidebar_banner' });
      if (res?.length) {
        activityData.value = res.map((item: any) => {
          const { id, iconUrlType, defaultIconUrl, customIconUrl, imageUrl, name, targetType, targetValue: targetValueString, showName, shortName } = item;
          let value: number | string | undefined = '';
          let valueType: string = '';
          if (targetType == 'internal') {
            const targetValue = JSON.parse(targetValueString);
            value = handleInlineNavigation(targetValue)
            valueType = handleSideValueType(targetValue)
          } else {
            value = targetValueString
          }
          return {
            id,
            name,
            value,
            showName,
            shortName,
            valueType,
            image: imageUrl,
            logoSrc: iconUrlType === 'default' ? defaultIconUrl : customIconUrl,
            type: handleSidebarJumpType(targetType),
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
  /**
 * @description 活动导航标签点击事件
 */
  const menuActivityHandle = (item: SuggestionActivityListModel[0]) => {
    useLinkHandle(item.type, item.value, item.valueType)
  }


  onMounted(async () => {
    await Promise.allSettled([activityStore.requestActivityList(), getActivityList()])
  })


  return {
    activityList,
    itemComponent,
    menuActivityHandle
  }
}
