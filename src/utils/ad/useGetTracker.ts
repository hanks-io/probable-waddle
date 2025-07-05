// 获取用于广告统计的tracker参数
import { useCookies } from "@vueuse/integrations/useCookies";

interface TrackerCookies {
  fbc?: string | null;
  fbp?: string | null;
  ttp?: string | null;
  ttclid?: string | null;
}

function getTrackerCookies(): TrackerCookies {
  const cookie = useCookies();
  const urlSearchParams = new URLSearchParams(window.location.href);

  return {
    fbc: cookie.get("_fbc") || urlSearchParams.get("fbc"),
    fbp: cookie.get("_fbp") || urlSearchParams.get("fbp"),
    ttp: cookie.get("_ttp") || urlSearchParams.get("ttp"),
    ttclid: cookie.get("ttclid") || urlSearchParams.get("ttclid"),
  };
}

export function appendTrackerParams(url: string): string {
  try {
    const trackerParams = getTrackerCookies();
    const urlObj = new URL(url);

    // 只添加存在的参数
    Object.entries(trackerParams).forEach(([key, value]) => {
      if (value) {
        const paramKey = key;
        urlObj.searchParams.set(paramKey, value);
      }
    });

    return urlObj.toString();
  } catch (error) {
    // URL 解析失败时返回原始 URL
    return url;
  }
}

export default function useGetTracker(): any {
  let tracker: null | {} = null;
  const { fbc, fbp, ttp, ttclid } = getTrackerCookies();

  //@ts-ignore
  if (window.fbPixelId && fbc && fbp) {
    tracker = {
      type: "fb",
      fbc,
      fbp,
      //@ts-ignore
      pixel_id: window.fbPixelId,
    };
  }

  //@ts-ignore
  if (window.ttPixelId && ttp) {
    tracker = {
      type: "tiktok",
      ttp,
      ttclid: ttclid || (window as any).ttclid,
      //@ts-ignore
      pixel_id: window.ttPixelId,
    };
  }

  //@ts-ignore
  if (window.kwaiId) {
    const urlSearchParams = new URLSearchParams(window.location.href);
    const kwaiClickId = urlSearchParams.get("kwai_click_id") || (window as any).kwai_click_id
    const clickId = urlSearchParams.get("click_id") || (window as any).click_id
    tracker = {
      type: "kwai",
      kwai_click_id: kwaiClickId || clickId || 'sFO1WRDaSjIH4w56M3PfqA'
    };
  }
  //@ts-ignore
  if (window.afId) {
    tracker = {
      type: "af",
      //@ts-ignore
      appsflyer_id: window.afId
    };
  }

  //@ts-ignore
  if (window.device_id) {
    //@ts-ignore
    if (!window.adid && window?.jsBridge?.getadid) {
      try {
        //@ts-ignore
        window.adid = window.jsBridge.getadid();
      } catch (error) {
        console.error('get adid error', error);
      }
    }
    tracker = {
      type: "ad",
      //@ts-ignore
      device_id: window.device_id,
      //@ts-ignore
      adid: window.adid,
    };
    console.warn('tracker', tracker);
  }
  return tracker;
}
