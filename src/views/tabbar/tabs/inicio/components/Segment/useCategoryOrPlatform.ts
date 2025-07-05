import { useTenantStore } from '@/store/tenant'


export default (props: { componentList: any[], negateCategoryType?: boolean }) => {
  const SEGMENT_COMPONENT_NAME = 'tabbar_inicio_Segment_segmentLayout';
  const CATEGORY_COMPONENT_KEYS = [
    'tabbar_inicio_Segment_segmentLayout3',
    'tabbar_inicio_Segment_segmentLayout4',
    'tabbar_inicio_Segment_segmentLayout6'
  ]
  const tenantStore = useTenantStore();
  const { homeNavType: categoryType } = toRefs(tenantStore.tenantInfo ?? {});

  const isCategoryType = computed(() => {
    const { negateCategoryType } = props;
    if (!categoryType?.value) {
      return true;
    }
    return negateCategoryType
      ? categoryType.value !== 'GameType'
      : categoryType.value === 'GameType'
  })
  
  const filterComponentList = computed(() => {
    const { componentList = [] } = props;
    const list = componentList.filter(item => {
      const { componentName, key } = item;
      if (componentName !== SEGMENT_COMPONENT_NAME) {
        return true;
      }
      const isKeyIncluded = CATEGORY_COMPONENT_KEYS.includes(key);
      return isCategoryType.value ? isKeyIncluded : !isKeyIncluded;
    })
    return list.length > 0 ? list : componentList;
  })
  return {
    filterComponentList
  }
}