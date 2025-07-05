import { useUserStore } from '@/store/user';






export default () => {
  const platformDefaultAvatar = 'svg/user-defluat-avatar.svg';

  const userStore = useUserStore();



  const {
    user,
    defaultAvatar,
  } = toRefs(userStore)


  const userPhoto = computed(() => user.value?.avatar || defaultAvatar.value || platformDefaultAvatar)

  return {
    user,
    userPhoto,
  }
}