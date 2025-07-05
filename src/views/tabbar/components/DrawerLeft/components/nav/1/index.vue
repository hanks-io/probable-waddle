<template>
  <ul :class="['nav-list', layoutType]">
    <li v-for="item in navList" class="nav-item" :key="item.tab" @click="jumpToPage(item.path)">
      <ion-icon class="icon" :src="item.icon" />
      <ion-label class="label">{{ item.tab }}</ion-label>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel } from '@ionic/vue';
import useNavList from '@/views/tabbar/components/DrawerLeft/components/nav/logic';


const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1',
  },
})

const { navList, jumpToPage } = useNavList();
</script>

<style lang="less" scoped>
@import './index.less';
</style>