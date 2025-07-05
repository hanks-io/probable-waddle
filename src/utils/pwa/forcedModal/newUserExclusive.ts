import { emitter } from '@/utils';
import router from '@/router';
import { useActivityStore } from '@/store/activity';
import { useTenantStore } from '@/store/tenant';

const HOME_PAGE_PATH = '/main/inicio';
const ANNOUNCEMENT_TYPE = 'announcement';
const NEW_USER_EXCLUSIVE_PATH = '/activity/newUserExclusive';
const NEW_USER_EXCLUSIVE_TYPE = 'newUserExclusive';

const showNewUserExclusivePopup = async () => {
  const token = await useAppStore().getToken();
  const isInGame = useGameStore().isInGame;
  if (!token) return;
  const activityStore = useActivityStore();
  const activityList = activityStore.userHomeTop;
  const activity = activityList?.find(item => item?.type === 'NewUserExclusive');
  const { id, homeTop } = activity || {};
  if (id && homeTop && !isInGame && router.currentRoute?.value?.path === HOME_PAGE_PATH) {
    router.push(`${NEW_USER_EXCLUSIVE_PATH}/${id}`);
  }
  if(!id){ // 如果新人专享活动id为空，则设置新人专享活动状态为3
    activityStore.setNewUserExclusivePopup(3);
  }
};

const handleForcedModalDismiss = async (
  { type }: { type: string | null | undefined },
  activityStore: ReturnType<typeof useActivityStore>,
  route: ReturnType<typeof useRouter>['currentRoute']
) => {
  if (await activityStore.getNewUserExclusivePopup()) return;
  
  if (route.value.path === HOME_PAGE_PATH && type === ANNOUNCEMENT_TYPE) {
    await showNewUserExclusivePopup();
  }
};

export const newUserExclusiveModal = async () => {
  const route = router.currentRoute;
  const tenantStore = useTenantStore();
  const activityStore = useActivityStore();
  
  const announcementList = await tenantStore.getAnnouncementList();
  
  if (announcementList?.length > 0) { // 如果公告列表不为空，则监听公告关闭事件
    emitter.on('forcedModal/dismiss', (data) => 
      handleForcedModalDismiss(data, activityStore, route)
    );
  } else if (!(await activityStore.getNewUserExclusivePopup())) { // 如果新人专享活动状态为0，则显示新人专享活动
    await showNewUserExclusivePopup();
  }
  
  return (await activityStore.getNewUserExclusivePopup()) === 0;
};

emitter.on('forcedModal/dismiss', async (data) => { // 当强制弹出可以手动关闭且没有公告时发出事件 触发这个事件
  if (data.type === NEW_USER_EXCLUSIVE_TYPE) {
    await newUserExclusiveModal()
  }
});
