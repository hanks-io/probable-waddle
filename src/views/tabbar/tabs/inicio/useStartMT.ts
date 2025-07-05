
import { MTpushInterfaceHandler } from "@/logic";
import router from "@/router";
import { checkIsSwModal } from '@/utils';
 export  const useStartMT = () => {
  const systemStore = useSystemStore();
  const appStore = useAppStore()
    const startMTMap = new Map([
      ["isPwa", () => systemStore.isPwa],
      ["isNotPermission", () => sessionStorage?.isInitPush !== 'true'],
      ["isTopWindow", () => !router.currentRoute.value.query?.unTopWindow ],
      ['isInSw', () => !checkIsSwModal()]
    ]);
    const isStart = [...startMTMap.values()].every(fn => fn())
    if(!isStart)  return
    
    appStore.MTTimeId = window.setInterval(async() => {
     const [permissionModalEl,pwaCompulsoryModalEl] = ['#permission-modal','#pwa-compulsory-modal'].map(el => document.querySelector(el))
     console.log(`pwaCompulsoryModalEl ===${pwaCompulsoryModalEl}`)
     console.log(`permissionModalEl ===${permissionModalEl}`)
      if(permissionModalEl) return  clearInterval(appStore.MTTimeId as number)

       if(pwaCompulsoryModalEl) return 
        MTpushInterfaceHandler()
    
        clearInterval(appStore.MTTimeId as number)

    },2000)

 }
