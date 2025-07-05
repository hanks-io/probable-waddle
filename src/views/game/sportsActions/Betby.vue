<script setup lang="ts">
import { IonPage, IonHeader, IonContent, IonIcon } from '@ionic/vue';
import useBetbySprotGame, { loadScript } from "@/hooks/useBetbySprotGame";
import SportsHeader from './comp/SportsHeader.vue'
// import useAddThemeClassName from '@/hooks/useAddThemeClassName'
import { emitter } from "@/utils/event";
import { useElementBounding } from '@vueuse/core'
import { formatMoneyToShow } from '@/utils/custom'
import { isEmpty } from '@/utils'
const {
  completed,
  balance,
  onGetUserAssets,
  refreshBalance
} = useRefreshBalance()
const route = useRoute();
const router = useRouter()
const gameStore = useGameStore()
const tenantStore = useTenantStore();	// 租户信息
const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
const btEl = ref(null)
const headerEl = ref(null)
const { height }
  = useElementBounding(headerEl)
const elementStore = useElementStore()
const tabBarHeight = computed(() => elementStore.tabBarHeight)
let betBy = null
const goBack = () => {
  let path = window.sessionStorage.getItem('BetbyEntry')
  if (path) {
    router.push(path)
  } else {
    router.push('/main/inicio')
  }
}
const onTokenExpired = () => {
  return new Promise(async (resolve) => {
    let { token } = await useBetbySprotGame(true)
    resolve(token)
    return token
  })

}

const BeyBtUpdateBalance = (params: any) => {
  refreshBalance(true, params)
}
// 生命周期-页面加载后
onMounted(() => {
  emitter.on('betBy/refresh', BeyBtUpdateBalance); // 监听游戏下注事件
})

onUnmounted(() => {
  emitter.off('betBy/refresh', BeyBtUpdateBalance);

});


const btSportInit = async (isUpdate: boolean = false) => {
  if (!isEmpty(betBy)) { betBy = null }
  await loadScript()
  let { brandId, lang, token, currency } = await useBetbySprotGame(isUpdate)

  if (typeof window.BTRenderer === 'function') {
    betBy = new BTRenderer().initialize({
      brand_id: brandId,
      token,
      onTokenExpired,
      themeName: "default",
      lang,
      target: btEl.value,
      betslipZIndex: 999,
      betSlipOffsetBottom: tabBarHeight.value + 15,
      betSlipOffsetTop: height.value + 63 - tabBarHeight.value,
      betSlipOffsetRight: 0,
      stickyTop: 0,
      onRouteChange: function (route: any) { console.log("Route changed to:", route); },
      onLogin: function () { console.log("Login successful"); },
      onRegister: function () { console.log("Registration successful"); },
      onSessionRefresh: (session: any) => { },
      onRecharge: async () => {
        const bool = await useHandleRecharge()
        if (bool) return
        router.push('/main/entrar')
      }
    });

  } else {
    queueMicrotask(() => {
      btSportInit(true)
    })

  }


}



// 监听路由变化
watch([() => route.path, height], (data) => {
  let [pathName, hei] = data

  if (!hei) return
  if (pathName === '/main/Betby') {
    onGetUserAssets();              // 获取用户财务信息
    nextTick(() => {
      btSportInit()

    })

  }
}, { immediate: true });




onBeforeRouteLeave(() => {
  balance.value = 0;
  // kill betBy游戏
  if (!isEmpty(betBy)) {
    gameStore.btSportsInfo = {}
    betBy?.kill()
    btEl.value = null
    // setTimeout(() => {
    //   window.sessionStorage.removeItem("BetbyGame")
    // }, 120);

  }

})




</script>



<template>
  <IonPage>
    <IonHeader mode="ios">
      <SportsHeader ref="headerEl" @goBack="goBack">

        <div class="balance flex-between">
          <span class="merchantCy">{{ merchantCy }}</span>{{ formatMoneyToShow(balance ?? 0) }}
          <ion-icon class="refresh rotate-[30deg]" :class="{ 'animate-refresh': completed }"
            src="/first/svg/perfil/refresh.svg" @click="refreshBalance()" />
        </div>


      </SportsHeader>
    </IonHeader>
    <IonContent class="first-content">

      <div id="betby" ref="btEl"></div>





    </IonContent>
  </IonPage>

</template>

<style lang="less">
.balance {

  height: 1.875rem;
  padding: 0 .5rem;
  margin-right: 0.75rem;
  .rounded-middle();
  background-color: var(--color-bg-400);
  .dynamic-font(@fontSize: --font-size-12, @color: --color-text-100, @fontWeight: --font-weight-medium);

  .merchantCy {
    color: var(--color-currency);
    margin-right: .1875rem;

  }

  ion-icon.refresh {
    font-size: var(--font-size-20);
    color: var(--color-currency);
    margin-left: .1875rem;
    cursor: pointer;
  }
}

.balance.scheme-light {
  background-color: var(--color-bg-100);

}
</style>
