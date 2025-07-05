// 添加cf人机验证
import { onBeforeUnmount, Ref } from 'vue';
import { encryptFrontend } from '@/utils/crypto';
import { useSystemStore } from "@/store/system";

type VerifyType = 'login' | 'register' | 'agencyRegister';

// 添加cf人机验证
export function useCFTurntile(verifyType: VerifyType, hToken: Ref<string | undefined>, cfElementId: string) {

  onBeforeUnmount(() => {
    window?.turnstile?.remove(cfElementId);
  })

  // 初始化cf人机验证
  async function initCFTurntile(): Promise<void> {
    try {
      if (window?.turnstile) {
        const customData = {
          tenantId: useTenantStore().tenantId,
          registerDevice: useSystemStore().deviceId,
        }
        const cData = `${customData.tenantId}=${customData.registerDevice}`;
        window.turnstile.render(cfElementId, {
          sitekey: import.meta.env.VITE_TURNSTILE_PUBLIC_KEY,
          size: 'flexible',
          action: verifyType,
          cData,
          callback: (token: string) => {
            hToken.value = token;
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize Turnstile:', error);
    }
  }

  // 重置cf人机验证
  function resetCFTurntile(): void {
    try {
      if (window?.turnstile) {
        window?.turnstile?.reset(cfElementId);
      }
    } catch (error) {
      console.error('Failed to reset Turnstile:', error);
    }
  }

  return { initCFTurntile, resetCFTurntile };
}
