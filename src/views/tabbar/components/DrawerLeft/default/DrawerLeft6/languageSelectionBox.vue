<template>
  <!-- 切换语言 -->
  <div v-show="showLangChange" class="language" @click="languageHandle">
    <div class="language-inner">
      <flag :iso="locale.split('-')[1]" style="font-size:0.875rem; border-radius: 50%;" />
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
  import { getLanguageName } from '@/utils/custom'
  import { useAppStore } from '@/store/app';
  import { useTenantStore } from '@/store/tenant';

  const appStore = useAppStore();           // 应用store
  const tenantStore = useTenantStore();     // 租户store

  const locale = computed(() => appStore.locale);               // 当前语言
  const showLangChange = computed(() => !!tenantStore.getTenantLanguageList().length) // 是否显示语言切换

  const currentLanguage = computed(() => getLanguageName(locale.value, locale.value).split(' ')[0]);
  /**
   * @description 语言切换
   */
  function languageHandle() {
    appStore.setLanguageModalVisible(true);
  }
</script>

<style scoped lang="less">
  @language-bg: #24221F;
  @arrow-bg: #38342E;
  @text-color3: #fff;
  @text-color1: var(--text-color1);

  .language {
    padding: .75rem .875rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: @language-bg;

    .language-inner {
      display: flex;
      align-items: center;

      .language-text {
        margin-inline-start: .4125rem;
        font-size: .75rem;
        font-weight: 500;
        color: @text-color3;
      }
    }

    .arrow-icon {
      padding: .3125rem;
      font-size: 0.875rem;
      border-radius: 0.625rem;
      background: @arrow-bg;
      color: @text-color1;
    }
  }
</style>