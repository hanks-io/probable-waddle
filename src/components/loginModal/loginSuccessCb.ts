import useFacebooklogin from "@/hooks/useFacebooklogin";
import { switchTab } from "@/router/hooks";
import { BROWSER } from "@/enums/device";
import router from "@/router";
export default (token: string, userInfo: { acc: string, pass: string }) => {
  const appStore = useAppStore(); // 全局store
  const systemStore = useSystemStore(); // 系统store
  const activityStore = useActivityStore(); // 活动store
  const route = router.currentRoute;
  setTimeout(async () => {
    await appStore.setToken(token);
    await useActivityStore().clearActivityList();
    useActivityStore().requestActivityList(true);
    await activityStore.getUserHomeTop(token); // 获取新人专享活动状态
    const loginRedirectMap = {
      [BROWSER.MOBILE_SAFARI]: () => {
        router.replace("/launch").then(() => {
          location.reload();
        });
      },
      ['Facebook']: () => {
        useFacebooklogin(token, userInfo);
      },
      default: () => {
        if (route.value.path !== "/main/inicio") {
          switchTab();
        }
      }
    };

    const redirectFn = loginRedirectMap[systemStore.browser as keyof typeof loginRedirectMap] || loginRedirectMap.default;
    redirectFn();
  }, 500);
}
