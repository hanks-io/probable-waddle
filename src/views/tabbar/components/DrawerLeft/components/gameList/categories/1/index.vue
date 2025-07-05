<template>
  <Layout>
    <template #default="{ list, handleClick }">
      <ion-menu-toggle>
        <div
          v-for="item in list"
          class="categories-item"
          :key="item.gameType"
          @click="handleClick(item)"
        >
          <ion-icon class="categories-item-icon" :src="item.src" />
          <ion-label class="categories-item-label">{{ item.name }}</ion-label>
        </div>
      </ion-menu-toggle>
    </template>
  </Layout>
</template>


<script setup lang="ts">
import { IonMenuToggle, IonIcon, IonLabel } from '@ionic/vue';
import Layout from '@/views/tabbar/components/DrawerLeft/components/gameList/categories/layout.vue'
</script>

<style scoped lang="less">
@import './index.less';
</style>
