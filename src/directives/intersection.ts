import { ObjectDirective, DirectiveBinding } from "vue";

const intersectionDirective: ObjectDirective = {
  // 监听元素与视口的交叉状态变化
  mounted: (el, binding: DirectiveBinding<any>) => {
    let lastY = 0; // 初始化上一次的位置
    const { cb, observerOptions, ...rest } = binding.value;
    const options = observerOptions || {
      root: null, // 观察视窗为根元素
      rootMargin: '0px', // 根元素的外边距
      threshold: 0.1 // 目标元素与视窗交叉的比例阈值
    };
    const observer = new IntersectionObserver(entries => {
      for (let entry of entries) {
        // 判断滚动方向
        const currentY = entry.boundingClientRect.top;
        const direction = currentY > lastY ? 'down' : 'up';
        lastY = currentY;
        entry.isIntersecting && cb({ entry, direction, ...rest });
      }
    }, options);
    observer.observe(el);
    // 将observer实例存储在元素上，以便以后可以访问它
    el.__intersectionObserver__ = observer;
  },
  beforeUnmount: (el) => {
    // 当不再需要观察时，可以停止观察
    if (el.__intersectionObserver__) {
      el.__intersectionObserver__.unobserve(el);
      delete el.__intersectionObserver__;
    }
  },
};

export default intersectionDirective;
