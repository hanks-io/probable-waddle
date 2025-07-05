<template>
  <Layout>
    <template #default="{ mediaList, handleClick, ...rest }">
      <div v-if="socialMedia && mediaList.length" class="social-box" v-bind="rest">
        <ProgressiveImages
          v-for="item of mediaList"
          class="social-img"
          :src="item.icon"
          :key="item.id"
          @click="handleClick(item.link, item.type)"
        />
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../layout.vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';


const props = defineProps({
  socialMedia: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['linkHandle'])
</script>

<style lang="less" scoped>
@import './index.less';
</style>