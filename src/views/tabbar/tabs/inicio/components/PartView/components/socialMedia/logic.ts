import { mainMediaListApi } from '@/api/normal';
import { redirectUrl } from '@/utils/app';
import { urlCheck } from '@/hooks/UrlCheck';
import { capitalize } from '@/utils';

import { MainMediaModel } from "@/api/normal/model";
const mediaList = ref<MainMediaModel[]>([]); // 主媒体列表
let isRequesting = false; // 添加请求状态标记

export default () => {
  const getMainMedia = async () => {
    try {
      if(mediaList.value.length || isRequesting) return
      isRequesting = true;
      const res = await mainMediaListApi();
      mediaList.value = res || [];
    } catch (error) {
      console.error('failed to get main media', error);
    } finally {
      isRequesting = false;
    }
  }

  /**
   * @description 点击链接
   */
  const linkHandle = (url: string, social?: string) => {
    redirectUrl(urlCheck(url), capitalize(social || ''))
  }

  getMainMedia();

  onBeforeUnmount(() => {
    mediaList.value = [];
    isRequesting = false;
  })

  return {
    mediaList,
    linkHandle
  }
}
