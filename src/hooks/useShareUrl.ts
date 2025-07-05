import { httpCompletion } from '@/utils';
import { checkDomainAvailability } from '@/hooks/ping';

export const useShareUrl = () => {
  const { token } = useAppStore();
  const loading = ref(false);
  const shareUrl = ref('');
  const backupUrl = location.host;

  const getShareUrl = (domain: string,id:string) => httpCompletion(token && id ? `${domain}/?pid=${id}` : domain);
  const checkAndSetShareUrl = async () => {
    const { userId } = await useUserStore().getUser() || {};
    try {
      loading.value = true;
      const domains = (await useAgentStore().getConfig())?.siteUrl?.split(',') || [];
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('超时')), 5000);
      });

      const checkDomainsPromise = (async () => {
        for (const domain of domains) {
          if (await checkDomainAvailability(domain)) {
            shareUrl.value = getShareUrl(domain,userId?.toString() || '');
            return;
          }
        }
        shareUrl.value = getShareUrl(backupUrl,userId?.toString() || '');
      })();

      await Promise.race([checkDomainsPromise, timeoutPromise]);
    } catch {
      shareUrl.value = getShareUrl(backupUrl,userId?.toString() || '');
    } finally {
      loading.value = false;
    }
  };

  checkAndSetShareUrl();
  return { shareUrl, loading };
};
