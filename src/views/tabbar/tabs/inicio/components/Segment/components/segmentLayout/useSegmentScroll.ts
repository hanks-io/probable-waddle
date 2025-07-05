


export default ({ tabValue, hotTab }: { tabValue: Ref<string>, hotTab: any }) => {
  const segmentRef = ref(null);

  const initScroll = async () => {
    segmentRef.value?.$el.scrollTo(0,0);
    setTimeout(() => {
      segmentRef.value?.$el.scrollTo(0,0);
    }, 1000)
  }

  const watchRoute = inject('watchRoute') as WatchRoute;
  watchRoute.use(async (path: string, oldPath: string, next: (path: string, oldPath: string) => {}) => {
    next(path, oldPath);
    if (path == '/main/inicio' && tabValue.value != hotTab.value.id) {
      tabValue.value = hotTab.value.id;
      initScroll();
    }
  })

  return {
    segmentRef,
  }
}