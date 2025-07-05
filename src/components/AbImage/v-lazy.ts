// directives/v-lazy.ts
import type { Directive, DirectiveBinding } from 'vue'

// ('v-lazy 只能应用于 <img> 或带 background 的元素')
function setImage(el: HTMLElement, url: string, type: string | null) {
  if (type === 'background-image') {
    el.style.backgroundImage = `url("${url}")`
  } else if (el.tagName === 'IMG') {
    (el as HTMLImageElement).src = url
  }
}

const LazyDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const url = binding.value
    const type = binding.arg || null

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setImage(el, url, type)
          obs.unobserve(el)
        }
      })
    }, {
      rootMargin: '100px',
      threshold: 0.01
    })

    observer.observe(el)
    // @ts-ignore
    el._lazyObserver = observer
  },

  unmounted(el: HTMLElement) {
    // @ts-ignore
    el._lazyObserver?.disconnect()
  }
}

export default LazyDirective;
