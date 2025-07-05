import { SD_MODEL } from "@/enums/device";
import { useAppStore } from "@/store/app";
import { useSystemStore } from "@/store/system";
import { buildUrlParam } from "@/utils";
import router from "@/router";
import { getMixinsInfo } from "@/utils";
export async function launchCheck() {
  console.info('Launch Touch')
  const appStore = useAppStore();        // app信息
  const systemStore = useSystemStore();  // 系统信息
  const  { isPC, isAndroidH5} = toRefs(systemStore)
  const baseUrl = location.origin;
  const downloadTemplate = () => useChannelStore().downloadTemplate;
  const isDownloadFFPWA = router.currentRoute.value.path.includes('download'); // 是否是下载防封PWA
  const query = buildUrlParam(<PwaParams>{
    ...router.currentRoute.value.query,
    token: appStore.token,
    sd: 2,
    ...getMixinsInfo(window.location.search),
    domainType: isDownloadFFPWA ? downloadTemplate()?.jumpDomainType : 'main', // 下载防封PWA使用下载模板，其他使用主域名
    wakeup: 'true', // 唤醒PWA
  })	// 构建url参数

  console.info('query', query)

  if (isPC.value || isAndroidH5.value) {
    window.open(`${baseUrl}${query}`, '_blank');
  } else {
 
    var e = "web+star";
    var i = `${baseUrl}${query}`
    document.querySelectorAll("#protocol-detector").forEach(function (e) {
      e.remove()
    });
    var r = document.createElement("iframe");
    r.setAttribute("id", "protocol-detector");
    r.setAttribute("src", "");
    r.setAttribute("style", "display:none !important;height:1px;width:1px;border:none;z-index:-1 !important;opacity:0 !important;visibility:hidden !important;");
    document.body.appendChild(r);
    r.contentWindow.location = e + "://" + i
  }
}
