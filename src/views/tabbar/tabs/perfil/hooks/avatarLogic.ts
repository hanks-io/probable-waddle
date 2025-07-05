import { random } from '@/utils';
import { useRoute } from 'vue-router';
import { getTheme } from '@/theme/hooks'
import { useUserStore } from '@/store/user';
import { useTenantStore } from '@/store/tenant';
import { AvatarCountModel } from '@/api/personal/model';
import { ref, computed, onBeforeMount, watch } from 'vue';
import { updateAvatarApi } from '@/api/personal';

export function useAvatarLogic(emit: any) {
  const userStore = useUserStore();      // 用户store
  const route = useRoute();              // 当前路由

  const gender = ref(1);                        // 选择的性别
  const selectAvatarIndex = ref(0);             // 选择的头像索引
  const selectAvatarGender = ref('');           // 选择的头像性别
  const avatarCount = ref<any>();  // 头像列表信息
  const defaultAvatar = computed(() => userStore.defaultAvatar);  // 默认头像
  const currentSkin = computed(() => getTheme()?.skin);           // 当前皮肤
  const genderList = computed(() => {                             // 根据皮肤动态匹配性别字段
    switch (currentSkin.value) {
      case 'default':
        return ['female', 'male'];
      case 'first':
      case 'second':
        return ['first_female', 'first_male']
      default:
        return ['female', 'male'];
    }
  })

  /**
   * @description 计算头像地址
   */
  function calculateAvatar(gender: 'male' | 'female' | 'first_female' | 'first_male', index: number) {
    if (selectAvatarIndex.value) return false; // 如果已经选择头像则返回false(不显示选中状态)
    return userStore.user?.avatar === `${avatarCount.value?.url}${gender}_${index}.jpg`
  }

  /**
   * @description 计算是否选中头像
   */
  function calculateSelected(gender: 'male' | 'female' | 'first_female' | 'first_male', index: number) {
    return selectAvatarGender.value === gender && selectAvatarIndex.value === index;
  }

  /**
   * @description 选择头像
   */
  function selectAvatarHandle(gender: 'male' | 'female' | 'first_female' | 'first_male', index: number) {
    selectAvatarIndex.value = index;
    selectAvatarGender.value = gender;
  }

  /**
   * @description 关闭弹窗
   */
  function dismissModal() {
    emit('dismiss');
  }

  /**
   * @description 确认选择
   */
  function confirmHandle() {
    if (!selectAvatarGender.value || genderList.value[gender.value] != selectAvatarGender.value) return emit('dismiss');
    const avatar = `${selectAvatarGender.value}_${selectAvatarIndex.value}.jpg`;
    onUpdateAvatar(avatar);
    emit('dismiss');
  }

  /**
   * 接口调用-获取头像列表信息
   */
  async function getAvatarCount() {
    avatarCount.value = handleSkinGenderList()     // 处理多皮肤性别数据
    const user = await userStore.setUser();                   // 全新获取用户信息
    if (avatarCount.value && user && !user.avatar) {
      let avatar = '';
      if (defaultAvatar.value) {
        avatar = defaultAvatar.value;
      } else {
        const randomNum = Math.round(Math.random())             // 0 1 随机产生一个
        const isDefaultSkin = currentSkin.value == 'default'    // 旧皮肤
        const gender = isDefaultSkin ? randomNum ? 'male' : 'female' : randomNum ? 'first_male' : 'first_female';
        const avatarIndex = random(1, Number(avatarCount.value[gender]));
        avatar = `${avatarCount.value.url}${gender}_${avatarIndex}.jpg`;
        userStore.setDefaultAvatar(avatar);
      }
      const newUser = { ...user, avatar };
      userStore.setUser(newUser);
    }
  }

  watch(() => userStore.user?.avatar, (value) => {
    if (value?.includes('female') || value?.includes('first_female'))
      gender.value = 0;
    else
      gender.value = 1;
  }, { immediate: true })

  watch(() => route.fullPath, () => {
    if (route.path === '/main/perfil') {
      getAvatarCount();
    }
  })

  onBeforeMount(() => {
    userStore.getDefaultAvatar(); // 获取默认用户头像
    getAvatarCount();             // 获取头像列表信息
  })

  return {
    genderList,
    gender,
    selectAvatarIndex,
    selectAvatarGender,
    avatarCount,
    defaultAvatar,
    calculateAvatar,
    selectAvatarHandle,
    calculateSelected,
    dismissModal,
    confirmHandle,
    getAvatarCount
  }

  /**
   * 接口调用-更新头像
   */
  async function onUpdateAvatar(avatar: string) {
    await updateAvatarApi(avatar);
    userStore.setDefaultAvatar('');
    userStore.setUser();
  }

  /**
   * 处理多皮肤动态匹配性别字段
   */
  function handleSkinGenderList() {
    const data: AvatarCountModel = useTenantStore().tenantInfo?.avatarBucket;
    switch (currentSkin.value) {
      case 'default':
        return data;
      case 'first':
      case 'second':
        return { url: data?.url, first_female: data?.female, first_male: data?.male }
      default:
        return data;
    }
  }
}


