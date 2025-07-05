import { jumpGoogleListApi } from "@/api/normal";
import { openUrl } from '@/utils/app';
import { SOCIAL } from "@/enums/device";
import router from "@/router";
import { checkDomainAvailability } from '@/hooks/ping';
import { shuffle, buildUrlParam } from '@/utils';
export const addUrlParam = async (url: string) => {
  const appStore = useAppStore();
  const loginType = appStore.loginType || '';
  const acc = await appStore.getAccount();
  const pass = await appStore.getPassword();
  const { sd, ...restQuery } = router.currentRoute.value.query;
  const query = buildUrlParam({ ...restQuery, token: appStore.token, acc, pass, loginType });

  return `${url}${query}`

}
export const getJumpUrl = async (imitationAppType: 'google' | 'ios') => {
  const tenantStore = useTenantStore();
  const getJumpGoogleInfo = async (imitationAppType: 'google' | 'ios'): Promise<[boolean, string | null]> => {
    const response = await jumpGoogleListApi();
    const { isOpen, list, isOpenDownloadPageJumpForIos } = response as { isOpen: boolean; list: { domain: string; imitationAppType: string }[] };
    const currentListDomain = list.filter(item => item.imitationAppType === imitationAppType)
    const notOpenMap = new Map([
      ["google", !isOpen ],
      ["ios", !isOpen || !isOpenDownloadPageJumpForIos]
    ])

    const isNotOpen = notOpenMap.get(imitationAppType) || !currentListDomain.length;
    if (isNotOpen) return [true, null];
    const shuffledList = shuffle(currentListDomain);
    for (const item of shuffledList) {
      const isAvailable = await checkDomainAvailability(item.domain);
      if (isAvailable) {
        return [false, item.domain];
      }
    }
    return [true, null];

  }
  // ios系统 和已经在google页面 不跳转防封  jumpDomainType === 'google' 就是防封谷歌页面
  const actionMap = {

    isGooglePage: () => tenantStore.domainInfo?.jumpDomainType === 'google',
    isDwPage: () => router.currentRoute.value.path === '/download',
  }
  if (Object.values(actionMap).some(fn => fn())) return null

  const [isNotOpen, url] = await getJumpGoogleInfo(imitationAppType);
  if (isNotOpen || !url) return null
  return await addUrlParam(`https://${url}/download`)
}


export const openGoogleUrl = async () => {
  const jumpGoogleUrl = await getJumpUrl("google");
  if (!jumpGoogleUrl) return false;
  openUrl(jumpGoogleUrl, SOCIAL.OPEN_URL)
  return true
}

export const openIosUrl = async () => {
  const jumpGoogleUrl = await getJumpUrl("ios");
  if (!jumpGoogleUrl) return false;
  location.href = jumpGoogleUrl
  return true
}
