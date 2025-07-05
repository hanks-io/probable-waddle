import { domainInfoApi } from '@/api/normal';
import { generateManifestProtocolHandler } from '@/utils/pwa/manifest';
import { getWebDomain } from '@/utils/app';
import { getUrlParams } from '@/hooks/HttpCompletion';
import type { Router } from 'vue-router';
import { isSamsungInternet, getMixinsInfo,buildUrlParam } from '@/utils';
const createLinkManifest = (manifest: Record<string, any>) => {
  // 将 manifest 对象转换为 JSON 字符串
  const manifestJson = JSON.stringify(manifest, null, 2);


  // 更新页面中的 manifest link
  let link = document.querySelector('link[rel="manifest"]');

  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.appendChild(link);
  }
  link.href = "data:text/json;charset=utf-8," + encodeURIComponent(manifestJson)
}

const getAccountInfo = () => {
  const token = window.sessionStorage.getItem('token') || ''
  const accountInfo = window.sessionStorage.getItem('accountInfo')
  let acc = ''	// 获取账号
  let pass = '' // 获取密码
  if (accountInfo) {
    let result = JSON.parse(accountInfo)
    acc = result.acc
    pass = result.pwd
  }


  return { token, acc, pass }
}

const getManifestInfo = async (isSamsungInternet: boolean) => {
  const appInfo = window.sessionStorage.getItem('appInfo')
  const domain = window.sessionStorage.getItem('domain')
  let host = getWebDomain()
  if (host.includes('localhost') || host.includes('5173')) {
    host = 'bc.qu6.xyz'
  }
  const accountInfo = getAccountInfo()
  if (!appInfo || !domain || domain !== host) {

    const { configList, info
    } = await domainInfoApi(host, true)
    const { appIcon, siteName } = configList
    const { tenantId, language, jumpDomainType } = info
    window.sessionStorage.setItem('domain', host)
    window.sessionStorage.setItem("appInfo", JSON.stringify({ tenantId, appIcon, siteName, language, jumpDomainType }))
    // 三星浏览用js更新manifest.json无效，所以刷新页面
    if (isSamsungInternet) {
      location.reload()
    }

    return { tenantId, appIcon, siteName, jumpDomainType, ...accountInfo }
  }
  let { tenantId, appIcon, siteName, jumpDomainType } = JSON.parse(appInfo)
  return { tenantId, appIcon, jumpDomainType, siteName, ...accountInfo }


}


const urlParamsIsEqual = (urlParams: Record<string, any>, params: Record<string, any>) => {

  return Object.keys(params).every(key => {
    return urlParams[key] === params[key]
  })


}

export const matchStandalone = () => {
  return ('standalone' in navigator && navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches
}

export const isRunGenManifestJson = () => {
  const isSamsung = isSamsungInternet()   // 是否是三星浏览器
  const isPwa = matchStandalone()
  return isSamsung && !isPwa
}

console.log(location.pathname, 'location.pathname', window.location.href)
export default async (router: Router) => {


  const isSamsung = isSamsungInternet()   // 是否是三星浏览器
  const { tenantId, appIcon, siteName, token, acc, pass, jumpDomainType } = await getManifestInfo(isSamsung)
  const { token: urlToken, acc: urlAcc, pass: urlPass, ...rest } = getMixinsInfo(window.location.search);
  const sd = rest?.sd || 2
  const params = buildUrlParam(<PwaParams>{
    // 构建url参数
    ...rest,
    token: token || urlToken,
    acc: acc || urlAcc,
    pass: pass || urlPass,
    sd,
    domainType: jumpDomainType
  });

  console.log('222params====', params)

  // 协议处理程序
  const start_url = `${location.origin}/${params}`; // PWA启动url
  const protocolName = siteName || tenantId;
  const protocol_handlers = [generateManifestProtocolHandler(protocolName, start_url)];
  console.log('333start_url====', start_url, 'location.origin====', location.origin);
  const manifest = {
    theme_color: "black",
    background_color: "black",
    display: "standalone",
    orientation: "portrait",
    prefer_related_applications: false,
    related_applications: [],
    id: `${location.origin}/${tenantId}`,
    name: `${siteName}`,
    scope: `${location.origin}/`,
    short_name: `${siteName}`,
    start_url,
    icons: [
      {
        src: `${appIcon}`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${appIcon}`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
    protocol_handlers,
  }

  window.webAppManifestSettings = manifest


  createLinkManifest(manifest)
  // 三星浏览pwa 带参数过去必须在url有参数
  const urlParamsIsEqualResult = urlParamsIsEqual(urlParams, { sd, token, acc, pass, domainType: jumpDomainType })
  if (isSamsung && !urlParamsIsEqualResult) {
    router.replace({ path: location.pathname, query: { ...urlParams, sd, domainType: jumpDomainType } })
    return

  }

}

