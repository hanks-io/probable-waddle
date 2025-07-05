export default () => {
  const isDown = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);
  const disableTab = ref(false); // 定义导航标签禁用状态

  /**
   * @description 鼠标按下事件
   * @param e 事件
   */
  function handleMouseDown(e: any) {
    isDown.value = true;
    startX.value = e.pageX - e.currentTarget.offsetLeft;
    scrollLeft.value = e.currentTarget.scrollLeft;
  }
  function handleMouseUp(e: any) {
    isDown.value = false;
    disableTab.value = false;
  }
  function handleMouseLeave() {
    isDown.value = false;
    disableTab.value = false;
  }
  function handleMouseMove(e: any) {
    if (!isDown.value) return;
    e.preventDefault();
    disableTab.value = true;
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX.value);
    e.currentTarget.scrollLeft = scrollLeft.value - walk;
  }

  return {
    disableTab,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
  }
}