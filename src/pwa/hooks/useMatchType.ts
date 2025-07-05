export const useMatchType = (type: 'google' | 'ios') => {

  const { isAndroid, isIOS, isPC } = toRefs(useSystemStore());
  const { downloadTemplate } = toRefs(useChannelStore());
  const tenantStore = useTenantStore();

  const checkDeviceMatch = (deviceType: boolean, appType: string) => {
    return tenantStore.domainInfo?.jumpDomainType === 'google'
      ? deviceType && downloadTemplate.value?.imitationAppType === appType
      : true;
  }
  const isNotOpenIos = () => {
    const { isOpen, list, isOpenDownloadPageJumpForIos } = tenantStore.domainInfo.apkDownloadUrlConfig;
    return !isOpen || !isOpenDownloadPageJumpForIos || !list.filter(item => item.imitationAppType === 'ios').length;
  }
  // 

  /* 
   如果开启了ios类型防封并且是防封类型的下载页面， 安卓手机打开ios类型的防封域名， 点击安装没有反应， ios系统手机打开 安卓类型的防封域名， 点击安装没有反应，
  如果没有开启ios类型防封 不是防封类型的下载页面， 不做限制
    */
  const matchMap = new Map([
    ['google', () => isNotOpenIos() || checkDeviceMatch(isAndroid.value || isPC.value, 'google')],
    ['ios', () => isNotOpenIos() || checkDeviceMatch(isIOS.value, 'ios')],
  ]);

  const matchFn = matchMap.get(type);
  return matchFn ? matchFn() : true;

};
