import { openUrl } from "@/utils"
export const useThreePartyPayment = (payUrl: string, redirectType?: string) => {

  const systemStore = useSystemStore();
  const isJSON = payUrl.startsWith('{')

  const handleRedirect = (url: string) => {
    systemStore.isIOS ? location.href = url : openUrl(url, 'OPEN_URL')
    return {
      url: '',
      isQRCode: false
    }
  }
  const validateUrlFormat = (url: string) => {

    const isValidUrl = url.startsWith('http')

    return {
      isQRCode: !isValidUrl,
      url: isValidUrl ? url : ''
    }
  }

  const payUrlMap = {
    json: () => {
      const data = JSON.parse(payUrl)
      const redirect = redirectType || data.redirectType
      return redirect === 'REDIRECT' ? handleRedirect(data.payUrl) : validateUrlFormat(data.payUrl)
    },
    plain: () => redirectType === 'REDIRECT' ? handleRedirect(payUrl) : validateUrlFormat(payUrl)
  }

  return payUrlMap[isJSON ? 'json' : 'plain']()
}
