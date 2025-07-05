import { useElementStore } from '@/store/element';
import useScroll from '@/views/tabbar/tabs/inicio/components/ToTopButton/useScroll';


export default (props: any) => {
  const elementStore = useElementStore();
  const { tabBarHeight } = toRefs(elementStore); // 底部导航栏高度

  const className = computed(() => {
    return `layout${props.type}`
  })

  const needIconWall = computed(() => {
    return [1, 2].includes(props.type)
  })

  const elStyle = computed(() => {
    return {
      bottom: `calc(${tabBarHeight.value}px + env(safe-area-inset-bottom) + 1rem)`
    }
  })

  const { showBackToTop } = inject('floatBtnData') as any;

  return {
    ...useScroll(),
    elStyle,
    className,
    needIconWall,
    showBackToTop,
  }
}