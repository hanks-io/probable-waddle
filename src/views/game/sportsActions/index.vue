<script setup lang="ts">
import { IonPage, IonHeader, IonContent } from '@ionic/vue';
import SportsHeader from './comp/SportsHeader.vue'
const route = useRoute();
const gameStore = useGameStore()
const loaded = ref(0);        // iframe加载完成状态
const error = ref(false);     // 加载失败状态
const iframe = ref(null)
const url = computed(() => gameStore.gameSportsUrl);        // 游戏链接
const router = useRouter()

/**
 * @description iframe卸载事件
 */
function handleUnload() {
  console.log('iframe卸载事件');

}


/**
 * @description iframe加载完成事件
 */
function handleLoad() {
  console.log('iframe加载完成事件');
  loaded.value++;
  localStorage.setItem('enteredGame', 'true');

}

/**
 * @description iframe加载失败事件
 */
function handleError() {
  console.log('iframe加载失败事件');
  error.value = true;
}

// 监听路由变化
watch(() => route.path, async (pathName) => {


  if (pathName.startsWith('/main/gameSports')) {
    const { gameType, platformId } = route.params
    const newId = Number(platformId)
    await useSportGame({ gameType, platformId: newId })
  }


}, { immediate: true });



onBeforeRouteLeave(() => {
  if (iframe.value) {
    gameStore.gameSportsUrl = '';
  }

})
const goBack = () => {

  router.back()
}

</script>

<template>
  <IonPage>
    <IonHeader mode="ios">
      <SportsHeader @goBack="goBack" />
    </IonHeader>
    <IonContent class="first-content">

      <iframe id="game-active-iframe" v-if="url" ref="iframe" v-show="loaded" :src="url" frameborder="0" width="100%"
        height="100%" @load="handleLoad" @error="handleError" @unload="handleUnload" />
    </IonContent>
  </IonPage>
</template>

<style lang="less"></style>
