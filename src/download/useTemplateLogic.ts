import { delay } from '@/utils';
import { useDwData } from '@/download/data';
import type { CommentType } from '@/download/data';
import { Autoplay, Pagination } from 'swiper/modules';
const { BRCommentList, PHCommentList, monthMap } = useDwData();
export default () => {
  const codeList = ["BR", "PH"] as const;
  type CodeType = typeof codeList[number];
  const channelStore = useChannelStore(); // 渠道信息
  const tenantStore = useTenantStore(); // 租户store
  const template = computed(() => channelStore.downloadTemplate);
  const styleName = computed(() => channelStore.downloadTemplate.style);
  const videoUrl = computed(() => channelStore.downloadTemplate.videoUrl);
  const appScore = computed(() => channelStore.downloadTemplate.appScore);
  const showGoogleInfo = computed(() => template.value?.authentication !== 'custom');

  const currentRegionCode = computed(() => tenantStore.tenantInfo?.code); // 租户信息

  const commentList = computed(() => template.value?.commentList || []); // 租户信息

  const modules = ref([Autoplay, Pagination]);  // 轮播图模块

  const codeScoreMap: Record<CodeType, string> = {
    "BR": "4.80",
    "PH": "4.90"
  }
  const codeCommentMap: Record<CodeType, CommentType[]> = {
    "BR": BRCommentList,
    "PH": PHCommentList
  }
  const currentScore = computed(() => {
    if (!currentRegionCode.value) return '4.80';
    return codeScoreMap[currentRegionCode.value as CodeType] || '4.80';
  });

  const currentCommentList = computed(() => {
    const isEmptyCommentList = commentList.value.length === 0;
    return isEmptyCommentList
      ? (codeCommentMap[currentRegionCode.value as CodeType] || BRCommentList)
      : commentList.value.map((item: CommentType) => {
        const [year, month, day] = item.date.split('-');
        const date = `${monthMap.get(Number(month))} ${day}, ${year}`
        return {
          ...item,
          score: 5,
          date

        }
      });
  });
  const introductlist = computed(() => {
    const introduct = template.value?.appIntroduct
    if (introduct?.includes("\\n")) {
      return introduct?.split('\\n')
    }
    return introduct?.split(/\r?\n/)
  })
  /**
 * @description swiper初始化完成
 * @param swiper
 */
  const onSwiper = async (swiper: any) => {
    await delay(3000);
    swiper.slideTo(1); // 滑动到第一个slide
  };

  return {
    template,
    introductlist,
    showGoogleInfo,
    currentCommentList,
    currentScore,
    modules,
    onSwiper,
    styleName,
    videoUrl,
    appScore
  }
}
