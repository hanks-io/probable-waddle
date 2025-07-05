<template>
  <div v-if="userId" class="assets-box" v-bind="$attrs">
    <div class="assets-box-inner">
      <ProgressiveImages v-if="loadImage.icon2" class="assets-img" :src="loadImage.icon2"/>
      <div class="assets-box-info">
        <div class="assets-box-info-inner">
          <ion-label class="currency" :style="currencyStyle">{{ merchantCy }}</ion-label>
          <ion-label class="assets-box-number" :style="numberStyle">{{ asset }}</ion-label>
        </div>
        <ion-label class="assets-box-intro">{{ $t("label.balance") }}</ion-label>
      </div>
    </div>
    <CButton class="deposit" @click="handleClick">
      {{ $t("main.entrar") }}
    </CButton>
  </div>

  <div v-else class="primaryBtn" >
    <template v-for="item in componentList" :key="item.key">
      <component v-if="item.componentName === 'tabbar_inicio_loginButton'" :is="item.component" v-bind="item.options" @click="showLogin()">
        {{ $t("main.login") }}
      </component>
      <component v-else :is="item.component" v-bind="item.options" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { IonLabel, IonIcon } from '@ionic/vue';
import CButton from '@/views/tabbar/tabs/inicio/components/button/index.vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import useAssetsLogic from '../logic';


const props = defineProps({
  componentList: {
    type: Array,
    default: () => []
  },
  loadImage: {
    type: Object,
    default: () => ({})
  },
  clickType: {
    type: String,
    default: 'apply'
  },
  currencyStyle: {
    type: Object,
    default: () => ({})
  },
  numberStyle: {
    type: Object,
    default: () => ({})
  }
})


const {
  asset,
  userId,
  showLogin,
  merchantCy,
  handleClick,
} = useAssetsLogic(props);

</script>

<style scoped lang="less">
@import './index.less';
</style>