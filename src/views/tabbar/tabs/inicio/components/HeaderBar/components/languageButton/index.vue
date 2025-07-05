<template>
  <c-button
    v-if="supportLanguages.length > 1"
    id="click-language"
    buttonType="text"
    class="language-btn"
    v-bind="$attrs"
  >
    <ion-icon class="language-icon icon-btn" slot="icon-only" :src="loadImage.icon1" />
  </c-button>
  <ion-popover id="language" mode="md" trigger="click-language" side="bottom" alignment="end" dismiss-on-select>
    <ul class="language-list">
      <li v-for="lang in supportLanguages" :class="['language-item', locale === lang ? 'active' : '']" :key="lang" @click="changeLanguage(lang)">
        <flag :iso="getCurrency(lang)" class="flag" />
        {{ getLanguageName(lang, locale) }}
      </li>
    </ul>
  </ion-popover>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonPopover } from '@ionic/vue';
import CButton from '@/views/tabbar/tabs/inicio/components/button/index.vue';

import { getCurrency } from '@/i18n';
import { getLanguageName } from '@/utils/custom';
import useLanguageButtonLogic from './logic';


const props = defineProps<{
  loadImage: Object;
}>()

const {
  locale,
  changeLanguage,
  supportLanguages,
} = useLanguageButtonLogic();
</script>

<style lang="less" scoped>
@import './index.less';
</style>