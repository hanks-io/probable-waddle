import router from "@/router";
export default (token: string, userInfo: { acc: string, pass: string }) => {
  const route = router.currentRoute
  const path = '/main/inicio'
  const query = {
    ...route.value.query,
    token,
    acc: userInfo.acc,
    pass: userInfo.pass
  }
  router.replace({ path, query })

}
