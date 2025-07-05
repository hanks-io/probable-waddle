import useWatchRoute from '@/views/tabbar/MainPage/useWatchRoute'
import useBonusPool from '@/components/BonusPool/useBonusPool'



export default () => {

  const { watchRoute } = useWatchRoute()
	useBonusPool({ watchRoute })

  const showBackToTop = ref<boolean>(false); // 是否显示回到顶部按钮

  const setShowBackToTop = (value: boolean) => {
    showBackToTop.value = value
  }


  provide('floatBtnData', {
    showBackToTop,
    setShowBackToTop,
  })

  return {
    showBackToTop,
  }
}