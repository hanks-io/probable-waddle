import { useUserStore } from '@/store/user';






export default () => {
  const website = location.hostname;

  const userStore = useUserStore();


  const {
    user,
  } = toRefs(userStore)


  return {
    user,
    website,
  }
}