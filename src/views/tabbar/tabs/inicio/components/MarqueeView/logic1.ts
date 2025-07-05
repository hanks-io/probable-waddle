import { useRouter } from 'vue-router';



export default () => {
  const router = useRouter();

    /**
 * @description 跳转游戏搜索页
 */
  const navigateToSearch = () => {
    router.push({ path: '/game/search/POPULAR' })
  }

  provide('marqueeEvents', navigateToSearch)

}