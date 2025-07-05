import router from '@/router';

export function goBack () {
  const { position } = router.options.history.state;  // 获取路由栈的位置
  if (Number(position) > 1) {                         // 如果路由栈的位置大于1, 返回上一页
    return router.back();
  }
  router.replace('/');                                // 否则跳转到首页
}

export function goMain (path: string = '/main/inicio') {
  const mainPath = sessionStorage.getItem('mainPath') || '/main/inicio'
  router.push(mainPath).then(() => {
    if (mainPath !== path)
      router.replace(path)
  });
}
