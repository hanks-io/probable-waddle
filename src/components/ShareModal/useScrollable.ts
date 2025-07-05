// 对scrollElement设置横向滚动
const useScrollable = (scrollElement: Ref<HTMLElement>) => {
  const scrollable = ref(false)
  const parentElement = ref<HTMLElement>()
  const startX = ref(0)
  const translateX = ref(0)
  const parentWidth = ref(0)

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    scrollable.value = true
    startX.value = e.pageX - scrollElement.value.offsetLeft
    const currentTransform = scrollElement.value.style.transform
    const match = currentTransform.match(/translateX\(([^)]+)px\)/)
    translateX.value = match ? parseFloat(match[1]) : 0
  }

  const handleMouseUp = (e: MouseEvent) => {
    scrollable.value = false
  }

  const handleMouseLeave = (e: MouseEvent) => {
    scrollable.value = false
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!scrollable.value) return
    e.preventDefault()
    const x = e.pageX - scrollElement.value.offsetLeft
    let moveX = x - startX.value + translateX.value

    const maxTranslate = 0
    const minTranslate = parentWidth.value - scrollElement.value.scrollWidth

    if (moveX > maxTranslate) moveX = maxTranslate
    if (moveX < minTranslate) moveX = minTranslate
    scrollElement.value.style.transform = `translateX(${moveX}px)`
  }

  const initWidth = () => {
    translateX.value = 0
    scrollElement.value.style.left = '0px'
    parentElement.value = scrollElement.value.parentElement as HTMLElement    
    parentWidth.value = parentElement.value.offsetWidth
    scrollElement.value.style.width = 'auto'
    scrollElement.value.style.width = `${scrollElement.value.scrollWidth}px`  
    scrollElement.value.style.transform = `translateX(${0}px)`
  }

  const addEvent = () => {
    scrollElement.value.addEventListener('mousedown', handleMouseDown)
    scrollElement.value.addEventListener('mouseup', handleMouseUp)
    scrollElement.value.addEventListener('mouseleave', handleMouseLeave)
    scrollElement.value.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', () => {
      initWidth()
    })
  }

  const removeEvent = () => {
    scrollElement.value.removeEventListener('mousedown', handleMouseDown)
    scrollElement.value.removeEventListener('mouseup', handleMouseUp)
    scrollElement.value.removeEventListener('mouseleave', handleMouseLeave)
    scrollElement.value.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', () => {
      initWidth()
    })
  }


  watchEffect(() => {
    if (scrollElement.value) {
      const resizeObserver = new ResizeObserver(() => {
        initWidth()
      })
      
      resizeObserver.observe(scrollElement.value)
      addEvent()

      return () => {
        resizeObserver.disconnect()
        removeEvent()
      }
    }
  })


  return {
    scrollable,
  }
}

export default useScrollable
