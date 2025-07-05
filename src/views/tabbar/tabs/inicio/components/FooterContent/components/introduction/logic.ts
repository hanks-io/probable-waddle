import { footerTextApi } from "@/api/normal";


export default () => {
  const dataList = ref<string[]>([])
  /**
 * @description 获取后台配置文案信息
 */
  const getFooterContent = async () => {
    try {
      const res = await footerTextApi()
      if (res.footerText) {
        dataList.value = res.footerText.split('\n')
      }
    } catch (error) {
      console.log(error);
    }
  }

  getFooterContent()
  
  return {
    dataList
  }
}