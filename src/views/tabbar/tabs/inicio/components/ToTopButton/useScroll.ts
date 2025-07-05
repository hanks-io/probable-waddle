
export default () => {
  const scrollToTop = () => {
    // ion-content滚动到指定位置
    const mainContent = document.querySelector('.main-content') as any;
    if (mainContent) {
      mainContent.scrollEl.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  return {
    scrollToTop
  }
}
