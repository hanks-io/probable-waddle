import { useRouter } from "vue-router";
import { useElementStore } from '@/store/element';
import { useUserStore } from '@/store/user';

export default (props: any) => {
  const router = useRouter();

  const userStore = useUserStore();
  const elementStore = useElementStore();
  const { tabBarHeight } = toRefs(elementStore); // 底部导航栏高度

  const className = computed(() => {
    return `layout${props.type}`
  })


  const elStyle = computed(() => {
    return {
      bottom: `calc(${tabBarHeight.value}px + env(safe-area-inset-bottom) + 0.75rem)`
    }
  })

  const showUnRead = computed(() => {
    const { unreadMailCount = 0, getUnreadAnnouncementCount = 0 } = userStore;
    const count = unreadMailCount + getUnreadAnnouncementCount;
		return count > 0;
	});

  const goToNotification = () => {
    router.push('/notification')
  }

  return {
    elStyle,
    className,
    showUnRead,
    goToNotification,
  }
}