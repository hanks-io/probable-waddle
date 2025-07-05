

export default () => {
  const isMove = ref(false);
  const disabledClick = ref(false);
  const startX = ref(0);
  const startScrollLeft = ref(0);

  const mousedownEvent = (e: any) => {
    isMove.value = true;
    startX.value = e.pageX - e.currentTarget.offsetLeft;
    startScrollLeft.value = e.currentTarget.scrollLeft;
  }

  const mouseupEvent = (e: any) => {
    isMove.value = false;
    disabledClick.value = false;
  }

  const mousemoveEvent = (e: any) => {
    e.preventDefault();
    if (!isMove.value) return;
    disabledClick.value = true;
    const movingDistance = e.pageX - e.currentTarget.offsetLeft - startX.value;
    e.currentTarget.scrollLeft = startScrollLeft.value - movingDistance;
  }

  return {
    disabledClick,
    mousedownEvent,
    mouseupEvent,
    mousemoveEvent,
  }
}