<template>
  <div>
    <div class="hall-wrapper"
      :style="game[imageKey] ? `background: url('${game[imageKey]}') no-repeat 0 0 / 100% 100%` : ''">
      <ion-icon :class="[isFavorite ? 'animate-star active' : '', 'favorite']" :src="favoriteIcon" @click.stop="favoriteHandle(game)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { useUserStore } from '@/store/user'
import { isEmpty } from '@/utils';
import favoriteIcon from '@/assets/svg/favorite.svg'

const emit = defineEmits<{
  (e: 'cancelFavorite', id: number): void
}>()
const userStore = useUserStore()

interface Props {
  game: Record<string, any>
  platform?: any
  imageKey?: string
}
// 设置props默认值
const props = withDefaults(defineProps<Props>(), {
  imageKey: 'background'
})


const isFavorite = ref(false)
watch(() => props.game, (newValue) => {
  if (isEmpty(newValue)) return
  isFavorite.value = newValue.isFavorite
}, { immediate: true })

/**
 * @description 收藏事件
 */
function favoriteHandle(item: Record<string, any>) {
  // item.isFavorite = !item.isFavorite;
  const game = {
    gameName: item.gameName || item.name,
  };
  Object.assign(game, item);
  if (!isFavorite.value) {
    userStore.addFavorite(game, props.platform);
    isFavorite.value = true
  } else {
    userStore.cancelFavorite(game, props.platform);
    isFavorite.value = false
    emit("cancelFavorite", Number(item.id))
  }
}
</script>

<style scoped>
.hall-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.favorite {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 4;
  font-size: 1.125rem;
  border-radius: 50%;
  box-shadow: 0 0.125rem 0.3125rem 0 rgba(0, 0, 0, 0.4);
  color: transparent;

  &.active {
    color: #FF8E04;
  }
}
</style>
