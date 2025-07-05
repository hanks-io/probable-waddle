<template>
  <!-- 切换语言 -->
  <div v-if="showLangChange" class="language" @click="languageHandle">
    <div class="language-inner">
      <flag :iso="locale.split('-')[1]" class="language-logo" />
      <ion-label class="language-text">{{ currentLanguage }}</ion-label>
    </div>
    <ion-icon class="arrow-icon" icon="/first/svg/select-icon.svg" />
  </div>
</template>

<script setup lang="ts">
  import {
    IonIcon,
    IonLabel
  } from '@ionic/vue';

  import useLanguageLogic from '@/views/tabbar/components/DrawerLeft/components/language/logic';

  const {
    locale,
    showLangChange,
    currentLanguage,
    languageHandle,
  } = useLanguageLogic();

</script>

<style scoped lang="less">
@import './index.less';
</style>