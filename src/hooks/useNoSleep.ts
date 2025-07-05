import NoSleep from 'nosleep.js';
import { useRoute } from 'vue-router';

export default (routerName: string) => {
  const route = useRoute();
  const noSleep = new NoSleep();

  watch(() => route.name, (name) => {
    if (name === routerName) {
      noSleep.enable();
    } else {
      noSleep.disable();
    }
  })

  onMounted(() => {
    noSleep.enable();
  })
  onBeforeUnmount(() => {
    noSleep.disable();
  })
}