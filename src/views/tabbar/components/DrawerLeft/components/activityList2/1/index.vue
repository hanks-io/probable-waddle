<template>
  <Layout>
    <template #default="{ list, handleClick }">
      <ion-menu-toggle v-for="item in list" class="activity-box" :key="item.id" @click="handleClick(item)">
        <ProgressiveImages class="activity-img" :src="item.logoSrc"/>
        <ion-label class="label">{{ item.name }}</ion-label>
      </ion-menu-toggle>
    </template>
  </Layout>
</template>


<script setup lang="ts">
import { IonMenuToggle, IonLabel } from '@ionic/vue';
import Layout from '../layout.vue'
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'

</script>

<style scoped lang="less">
@import './index.less';
</style>
