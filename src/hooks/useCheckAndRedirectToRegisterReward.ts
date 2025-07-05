import router from '@/router'
export const checkAndRedirectToRegisterReward = async () => {
  const userStore = useUserStore();
  const isLogin = await useAppStore().checkUserHasLogin();
  const route = router.currentRoute
  if (!isLogin) return false;
  const user = await userStore.user || await userStore.getUser()
  if (user?.canApplyRegisterReward && !userStore.isAlreadyDisplayRegisterReward &&  route.value.path === '/main/inicio') {
    await router.push('/subscribeReward');
    userStore.isAlreadyDisplayRegisterReward = false;
    return true
  }
  return false
}
