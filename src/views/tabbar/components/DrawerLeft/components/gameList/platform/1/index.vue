<template>
  <Layout>
    <template #default="{ list, handleClick }">
      <ion-menu-toggle>
        <div
          v-for="item in list"
          class="platform-item"
          :key="item.gameType"
          @click="handleClick(item.id)"
        >
          <ImgOrSvg v-if="item.code === 'ONE_API_HOT'" class="platform-item-icon" :src="item.src" />
          <i v-else class="platform-item-icon" :style="item.src"/>
          <ion-label class="platform-item-label">{{ item.name }}</ion-label>
        </div>
      </ion-menu-toggle>
    </template>
  </Layout>
</template>


<script setup lang="ts">
import { IonMenuToggle, IonLabel } from '@ionic/vue';
import ImgOrSvg from '@/components/GradientSVG/imgOrSvg.vue';
import Layout from '@/views/tabbar/components/DrawerLeft/components/gameList/platform/layout.vue'
</script>

<style scoped lang="less">
@import './index.less';
</style>
