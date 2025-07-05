<template>
  <ion-page>
    <ion-content>
      <div class="flex flex-col items-center justify-center h-full">
        <!-- <ion-spinner class="w-10 h-10 " name="crescent" /> -->
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { delay } from '@/utils/delay';
import { useRouter } from 'vue-router';
import { getUrlParams, getUrlPath } from '@/hooks/HttpCompletion';
import { useTenantStore } from '@/store/tenant';
import { onMounted, nextTick, onBeforeMount, computed } from 'vue';
import { IonPage, IonContent, IonSpinner } from '@ionic/vue';
import { BROWSER } from '@/enums/device';
const router = useRouter(); // 路由实例


const tenantStore = useTenantStore(); // 租户信息
const systemStore = useSystemStore();   // 系统信息
const { browser, isPwa } = toRefs(systemStore)
/**
 * 生命周期: 组件挂载前
 */
onBeforeMount(() => {
  window.parent.postMessage({ type: 'pageLoaded', message: 'Page has been loaded' }, '*'); // 发送消息给父级窗口(iframe加载完成
});


/**
 * 生命周期: 组件挂载完成
 */
onMounted(async () => {
  await delay(60);
  let href = sessionStorage.getItem('href');
  if (href?.includes('.js') || href?.includes('.css') || !href) {
    router.replace('/main/inicio');
    return
  }
  const query = getUrlParams(`${href}`);
  const path = getUrlPath(`${href}`);
  if (href === '/main' || href?.includes('launch') || href === '/') {
    router.replace({ path: '/main', query })
    return
  }
  // 处理输入错误的路由
  let pathList = router.getRoutes().map((item) => item.path).filter((item) => item !== '/:pathMatch(.*)*');
  // 判断路由是否存在
  let isHasPath = pathList.some((item) => {
    if (item.includes(':')) {
      let pathList = item.split('/:')
      let len = pathList.length - 1;
      let strArr = path.split('/')
      strArr.splice(-len)
      let str = strArr.join('/').toLowerCase()
      return str === pathList[0].toLowerCase()
    } else {
      return item.toLowerCase() === path.toLowerCase()
    }
  });
  if (!isHasPath) {
    router.replace({ path: '/main', query })
    return
  }

  if (href && href.includes(window.location.host)) {
    let path = href.split(window.location.host)[1];
    //  处理还有用hash路由浏览的问题
    if (path.startsWith('/#')) {
      // /#这样结尾没有后面的斜杠 /#/后面有斜杠
      path = path.replace(/#\/?/, '')
    }

    if (path === '/' || path.startsWith('/?')) {
      router.replace({ path: '/main' })
      return
    }
    if (path.includes('?')) {
      path = path.split('?')[0];
    }
    router.replace(path);
  } else {
    router.replace({ path, query });
  }

})
</script>

<style scoped></style>
