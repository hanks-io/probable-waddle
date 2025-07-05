import { useTenantStore } from '@/store/tenant';

interface GameInfo {
  logoFlag: string;
}

export default (props?: { gameInfo: GameInfo }) => {
  const tenantStore = useTenantStore();

  const cardStyle = computed(() => tenantStore.tenantInfo?.gameLogoStyle || 'style1')
  const language = computed(() => tenantStore.tenantInfo?.gameLogoLanguage || 'en')

  const getImageSrc = (gameInfo: GameInfo) => {
    const { logoFlag } = gameInfo;
    return `${tenantStore.tenantInfo?.gameLogoUrl}/${cardStyle.value}/${language.value}/${logoFlag}.jpg`
  }

  const newImageSrc = computed(() => getImageSrc(props?.gameInfo))

  return {
    cardStyle,
    getImageSrc,
    newImageSrc,
  }
}
