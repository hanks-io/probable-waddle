import useScroll from '@/views/tabbar/tabs/inicio/components/ToTopButton/useScroll';

export default (props: any) => {
  const { showBackToTop } = inject('floatBtnData') as any;

  return {
    ...useScroll(),
    showBackToTop,
  }
}
