import { useLoadComponent, useConfiguration } from '@/hooks/useLoadComponent';
import type { ComponentList } from '@/hooks/useLoadComponent';


export default () => {
  const {
    loadComponent,
  } = useLoadComponent();
  
  const {
    createComponent
  } = useConfiguration();

  const tenantStore = useTenantStore();

  const mainConfiguration = toRef(tenantStore.themeConfig?.configuration?.main)

  const pageComponentOptions = computed(() => {
    if (!mainConfiguration.value) return { list: [], options: {} };
    const { children, ...options } = mainConfiguration.value;
    return {
      options,
      list: createComponent(children),
    };
  });
  const tabComponentOptions = computed(() => {
    const contentObj = pageComponentOptions.value.list.find(item => item.position === 'tabs')
    return contentObj || { list: [] }
  })

  const otherComponentOptions = computed(() => {
    const contentObj = pageComponentOptions.value.list.find(item => item.position === 'other')
    return contentObj || { list: [] }
  })
  
  // 
  const tabsList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/components/tabBar/1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/components/tabBar/4/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/components/tabBar/5/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/components/tabBar/6/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/components/tabBar/6/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/components/tabBar/6/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/components/tabBar/6/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/components/tabBar/6/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/components/tabBar/6/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/components/tabBar/6/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/components/tabBar/7/index.vue'),
  };
  const drawerLeftList: ComponentList = {
    'blue-default-GameType': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft1/index.vue'),
    'blue-default-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft2/index.vue'),
    'blue-default-v01-GameType': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft5/index.vue'),
    'green-default-v01-GameType': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft1/index.vue'),
    'green-default-v01-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft3/index.vue'),
    'green-default-v02-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft4/index.vue'),
    'forest-green-v01-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft3/index.vue'),
    'forest-green-v02-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft4/index.vue'),
    'amber-purple-v01-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft3/index.vue'),
    'blue-default-v02-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft3/index.vue'),
    'auroral-yellow-Platform': () => import('@/views/tabbar/components/DrawerLeft/default/DrawerLeft6/index.vue'),
  };

 
  const tabsComponent = loadComponent(tabsList);
  const drawerLeftComponent = loadComponent(drawerLeftList);


  return {
    tabsComponent,
    drawerLeftComponent,
    tabComponentOptions,
    otherComponentOptions,
  }
}
