export default () => {
  let isDown: boolean;
  let startX: number;
  let scrollLeft: number;

  /**
    * @description 鼠标按下事件
    * @param e 事件
    */
  function handleMouseDown(e: any) {
    isDown = true;
    startX = e.pageX - e.currentTarget.offsetLeft;
    scrollLeft = e.currentTarget.scrollLeft;
  }
  function handleMouseUp(e: any) {
    isDown = false;

  }
  function handleMouseLeave() {
    isDown = false;

  }
  function handleMouseMove(e: any) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX);
    e.currentTarget.scrollLeft = scrollLeft - walk;
  }
  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove
  }
}
