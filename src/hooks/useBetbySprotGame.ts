

export default async (isUpdate: boolean = false) => {
  const userStore = useUserStore()
  const gameStore = useGameStore()
  await userStore.getUser()
  const userId = userStore.user?.userId!
  if (!userId) return



  const updateFn = isUpdate ? gameStore.setSportToken : gameStore.getSportToken

  try {
    const result = updateFn(userId)
    return result

  } catch (error) {
    new Error('Failed to load script: ' + error)
  }



}

export const loadScript = () => {
  const url = import.meta.env.VITE_BT_LIB_URL!
  return new Promise((resolve, reject) => {
    const btIDScript = document.querySelector('#btSportsJS')
    if (btIDScript) {
      resolve(url)

      return
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.id = 'btSportsJS'
    // 监听脚本加载完成事件
    script.onload = () => {
      resolve(url);
    };
    // 处理加载错误事件
    script.onerror = () => {
      reject(new Error('Failed to load script: ' + url));
    };

    document.head.appendChild(script);
  });
}
