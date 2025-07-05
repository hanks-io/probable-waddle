import { postParent, getUrlParam, getUrlParams, isGoogleType, httpCompletion } from '@/utils';
import { appendTrackerParams } from '@/utils/ad/useGetTracker';
import { isEmpty } from '@/utils';
const apiUrl = 'api/public/health';
const TIME_INTERVAL = 5000;
type checkDomainStatus = 'checking' | 'available' | 'unavailable';
export type TDomainInfo = {
  jumpDomain: string;
  jumpDomainId: number;
  rescueDomain?: string;
}
export const checkDomainAvailability = async (domain: string) => {
  try {
    const res = await (await fetch(`${httpCompletion(domain)}/${apiUrl}`)).json();
    return (res?.status === 'ok' || res?.ok) ? domain : false;
  } catch (error) {
    return false;
  }
}

export const useAppLogo = () => {
  const tenantStore = useTenantStore();
  const appLogo = ref("");
  watchEffect(() => {
    if (tenantStore.isLoadedDomainInfo) {
      appLogo.value = tenantStore.domainInfo?.jumpDomainType === 'google' ? '' : tenantStore.tenantInfo?.logo;
    }
  });
  return {
    appLogo
  }
}

