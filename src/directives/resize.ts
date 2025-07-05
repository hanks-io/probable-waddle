import { ObjectDirective, DirectiveBinding } from "vue";

const resizeDirective: ObjectDirective = {
  // 在mounted钩子中创建一个ResizeObserver实例来监听元素的大小变化
  mounted: (el, binding: DirectiveBinding<any>) => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        // 每当被观察的元素大小变化时，都会执行这里的代码
        binding.value(entry);
      }
    });
    // 将观察者与目标元素关联
    observer.observe(el);

    // 将observer实例存储在元素上，以便以后可以访问它
    el.__resizeObserver__ = observer;
  },
  beforeUnmount: (el) => {
    // 当不再需要观察时，可以停止观察
    if (el.__resizeObserver__) {
      el.__resizeObserver__.unobserve(el);
      delete el.__resizeObserver__;
    }
  },
};

export default resizeDirective;