


export default () => {
  const checkedLineLeft = ref('1.9375rem');    //定义下划线初始位置
  const checkedLineWidth = ref('24.375rem');    //定义下划线可活动区域总的长度

  /**
 * @description 导航下方线切换事件
 * @param event 事件对象
 */
  function checkedLineChange(event: any) {
    checkedLineLeft.value = `${event.target.offsetLeft + event.target.offsetWidth / 2 - 4}px`;
  }

  onMounted(() => {
    setTimeout(() => {
      let linkSegmentRef = document.querySelector('#linkSegmentRef')
      if (linkSegmentRef) {
        checkedLineLeft.value = `${linkSegmentRef!.children[0].clientWidth / 2 - 4}px`;
        checkedLineWidth.value = `${linkSegmentRef!.scrollWidth}px`;
        let leftNum = linkSegmentRef!.children[0].clientWidth;
        let timeNum = 0;
        let timer = setInterval(() => {
          let linkSegmentRef = document.querySelector('#linkSegmentRef')
          if (linkSegmentRef) {
            if (leftNum != linkSegmentRef!.children[0].clientWidth) {
              checkedLineLeft.value = `${linkSegmentRef!.children[0].clientWidth / 2 - 4}px`;
              checkedLineWidth.value = `${linkSegmentRef!.scrollWidth}px`;
              clearInterval(timer)
            }
          }
          timeNum++;
          if (timeNum >= 10) {
            clearInterval(timer)
          }
        }, 1000);
      }
    }, 1500)
  })

  return {
    checkedLineLeft,
    checkedLineWidth,
    checkedLineChange,
  }
}