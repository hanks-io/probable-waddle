import { ActivityNames } from '@/router/modules/activity'
import { getTheme } from '@/theme/hooks'

export const useModelComponents = () => {

  const { activityConfig } = getTheme();
  const template = activityConfig?.[ActivityNames.RedPacket]?.template as keyof typeof templateList

  const templateList = {
    'oldModel': () => import(`@/views/tabbar/tabs/inicio/components/RedPacket/first/RedPacketModel.vue`),
    'newModel': () => import(`@/views/tabbar/tabs/inicio/components/RedPacket/first/RedPacketModelnew.vue`),
 
  }
  const key = template ? "newModel" : "oldModel"

  return markRaw(defineAsyncComponent(templateList[key])) as unknown as ComponentPublicInstance;
}
