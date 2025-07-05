<template>
  <div :class="['hot-game-list-box', layoutType]">
    <div class="hot-game-list" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @mousemove="handleMouseMove">
      <ion-menu-toggle 
        v-for="item in hotGameList" 
        :key="item.id"
        :class="[cardStyle, 'card']" 
        @click="goToGame(item)"
      >
        <ProgressiveImages class="img" :src="item.logo" />
      </ion-menu-toggle>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonMenuToggle } from '@ionic/vue';
import useCustomDraggable from '@/hooks/useCustomDraggable';
import useGameList from '@/views/tabbar/components/DrawerLeft/components/hotGame/components/gameList/logic';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue'


const props = defineProps({
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

const {
  goToGame,
  cardStyle,
  hotGameList,
} = useGameList();

const {
  handleMouseDown,
  handleMouseUp,
  handleMouseLeave,
  handleMouseMove
} = useCustomDraggable();

</script>

<style scoped lang="less">
@import './index.less';
</style>