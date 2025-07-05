import { decryptData } from './sm-Crypto';

export async function fetchRemoteConfig() {

  const handleEncryptedResponse = (response: Window['__APP_CONFIG__']) => {
    if (!response) return;
    const { domainInfo, channelInfo, tenantInfo, agencyConfig, apiUrl, version, VITE_CAPTCHA_SCENE_ID, VITE_CAPTCHA_PREFIX } = response;
    return {
      domainInfo: decryptData(domainInfo),
      channelInfo: decryptData(channelInfo),
      tenantInfo: decryptData(tenantInfo),
      agencyConfig: decryptData(agencyConfig),
      apiUrl,
      version,
      VITE_CAPTCHA_SCENE_ID,
      VITE_CAPTCHA_PREFIX
    };
  };

  if (window.__APP_CONFIG__) return handleEncryptedResponse(window.__APP_CONFIG__);
  return null;
}

type CfgKeys = keyof typeof window.__APP_CONFIG__;
export const getCfgVal = (tgt: typeof window.__APP_CONFIG__, typ: CfgKeys = 'domainInfo' as CfgKeys) => tgt?.[typ]?.result?.data?.json?.info
