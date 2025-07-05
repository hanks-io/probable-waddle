<template>
  <Layout>
    <template #default="{ mediaList, handleClick, ...rest }">
      <div v-if="socialMedia && mediaList.length" class="social-media" v-bind="rest">
        <ion-label class="title">{{ $t('title.socialNetworks') }}</ion-label>
        <ion-label class="subtitle">{{ $t('subtitle.contactUs') }}</ion-label>
        <div class="social-box">
          <ProgressiveImages
            v-for="item of mediaList"
            class="social-img"
            :src="item.icon"
            :key="item.id"
            @click="handleClick(item.link, item.type)"
          />
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue'
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