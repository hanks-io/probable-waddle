import i18n from '@/i18n';
import { useSystemStore } from "@/store/system";
import { useAgentStore } from '@/store/agent'
import {  AgencyInfoModel } from '@/api/agent/model';
import { isProxyUrl, addZeroWidthSpace, openUrl, isInIframe,moneyConvertToClient } from '@/utils';

const { t } = i18n.global;


// 获取代理配置信息 金额信息转换为服务器金额
export function transformMoney(agencyInfo: any) {
  return {
    ...agencyInfo,
    unclaimedCommission: moneyConvertToClient(agencyInfo?.unclaimedCommission || 0),
    commission: moneyConvertToClient(agencyInfo?.commission || 0),
    claimedCommission: moneyConvertToClient(agencyInfo?.claimedCommission || 0),
    lastCommission: moneyConvertToClient(agencyInfo?.lastCommission || 0),
    teamAchievement: moneyConvertToClient(agencyInfo?.teamAchievement || 0),
    directAchievement: moneyConvertToClient(agencyInfo?.directAchievement || 0),
    dayCommission: moneyConvertToClient(agencyInfo?.dayCommission || 0),
    dayDirectCommission: moneyConvertToClient(agencyInfo?.dayDirectCommission || 0),
    dayTeamCommission: moneyConvertToClient(agencyInfo?.dayTeamCommission || 0),
    dayDirectAchievement: moneyConvertToClient(agencyInfo?.dayDirectAchievement || 0),
    dayTeamAchievement: moneyConvertToClient(agencyInfo?.dayTeamAchievement || 0),
  }
} 
// 未登录账号 我的推广配置信息
export function unTokenPeferralInfo()  {
  return {
    parentId: 0, 
    unclaimedCommission: 0, 
    commission: 0, 
    claimedCommission: 0, 
    lastCommission: 0, 
    teamAdd: 0, 
    directAdd: 0, 
    teamCount: 0, 
    directCount: 0, 
    directAchievement: 0, 
    teamAchievement: 0,
    dayCommission: 0,
    dayDirectCommission: 0,
    dayTeamCommission: 0,
    dayDirectAchievement: 0,
    dayTeamAchievement: 0,
  }
}

const getPlatformUrl = ({ iosUrl, androidUrl, defaultUrl }: { iosUrl: string, androidUrl: string, defaultUrl: string }) => {
  // @ts-ignore
  const systemStore = useSystemStore();
  if (systemStore.isIOS) {
      return iosUrl;
  }
  if (systemStore.os === 'Android' && !['Chrome','Chrome WebView'].includes(systemStore.browser)) {
      return androidUrl;
  }
  return defaultUrl;
};

const getJsBridgeUrl = (jsBridgeUrl: string, defaultUrl: string) => {
  // @ts-ignore
  return window.jsBridge ? jsBridgeUrl : defaultUrl;
};

const shareConfig = {
  TikTok: ({ baseUrl }: { baseUrl: string }) => 
    getPlatformUrl({
      iosUrl: `https://www.tiktok.com/?text=${baseUrl}`,
      androidUrl: `intent://www.tiktok.com/?text=${baseUrl}#Intent;package=com.zhiliaoapp.musically;scheme=https;end;`,
      defaultUrl: `https://www.tiktok.com/?text=${baseUrl}`
    }),
  WhatsApp: ({ baseUrl }: { baseUrl: string }) => 
    getJsBridgeUrl(
      `https://api.whatsapp.com/send?text=${baseUrl}`,
      `whatsapp://send?text=${baseUrl}`
    ),
  YouTube: ({ baseUrl }: { baseUrl: string }) => 
    getPlatformUrl({
      iosUrl: `youtube:/?text=${baseUrl}`,
      androidUrl: `intent://www.youtube.com/?text=${baseUrl}#Intent;package=com.google.android.youtube;scheme=https;end;`,
      defaultUrl: `https://www.youtube.com/?text=${baseUrl}`
    }),
  Kwai: ({ baseUrl }: { baseUrl: string }) => 
    getPlatformUrl({
      iosUrl: `ikwai://home?target_url=${baseUrl}`,
      androidUrl: `ikwai://home?target_url=${baseUrl}`,
      defaultUrl: `https://www.kwai.com/?content=${baseUrl}`
    }),
  Twitter: ({ content, shareUrl }: { content: string, shareUrl: string }) => 
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(shareUrl)}`,
  Instagram: ({ baseUrl }: { baseUrl: string }) => 
    getPlatformUrl({
      iosUrl: `instagram:/?quote=${baseUrl}`,
      androidUrl: `intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end`,
      defaultUrl: `https://www.instagram.com/?quote=${baseUrl}`
    }),
  Facebook: ({ content, shareUrl }: { content: string, shareUrl: string }) => 
    getPlatformUrl({
      iosUrl: `fb://share/?link=${shareUrl}`,
      androidUrl: `https://m.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(content)}`,
      defaultUrl: `https://m.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(content)}`
    }),
  Telegram: ({ baseUrl }: { baseUrl: string }) => 
    `https://t.me/share/url?url=${baseUrl}`,
  Email: ({ baseUrl, recipient, subject }: { baseUrl: string, recipient: string, subject: string }) => 
    `mailto:${recipient}?subject=${subject}&body=${baseUrl}`
};

export type ShareConfigType = 'TikTok' | 'WhatsApp' | 'YouTube' | 'Kwai' | 'Twitter' | 'Instagram' | 'Facebook' | 'Telegram' | 'Email';

export const shareAgentUrl = (type: ShareConfigType, shareUrl: string, name: string, agentShare = true) => {
  
  if (isProxyUrl(shareUrl)) {
    name = addZeroWidthSpace(name);
  }
  const shareTextIsCustom = useAgentStore().config?.shareTextType === "Custom" && agentShare;
  const shareText = addZeroWidthSpace(useAgentStore().config?.shareText ?? '');
  const content = shareTextIsCustom ? shareText : `${t('viewsSpread.agentShareUrl', { name })}`;
  const baseUrl = encodeURIComponent(`${content} ${shareUrl}`);
  const recipient = ''; // 邮件指定收件人/电话号码
  const subject = encodeURIComponent(''); // 邮件分享主题

  const url = shareConfig[type]?.({ baseUrl, content, shareUrl, recipient, subject });
  if (!url) return;
  openUrl(url, type);
};
