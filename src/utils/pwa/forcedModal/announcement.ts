import router from "@/router";
import { uesShowForceModal } from "./useShow"

export const announcementCheckMap = () => {
  const tenantStore = useTenantStore();
  const route = router.currentRoute;
  return new Map<string, () => boolean | Promise<boolean>>([
    ['isInHome', () => route.value.path === '/main/inicio'],
    ['hasAnnouncement', async () => {
      const announcementList = await tenantStore.getAnnouncementList();
      return announcementList.length > 0;
    }]
  ]);
}

export const announcementModal = async () => {
  const checkMap = announcementCheckMap();
  for (const check of checkMap.values()) {
    const result = await check();
    if (!result) return 0;
  }
  uesShowForceModal('announcement')
  return false; // next 表示是否继续执行下一个钩子
}
