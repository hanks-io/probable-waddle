<template>
  <!-- 语言列表弹窗 -->
  <ion-modal ref="profileModalLanguageRef" mode="md" :is-open="isOpen" id="modal-language" @didDismiss="modelDismiss">
    <div class="w-[22.5rem] px-[.625rem] mx-auto change-language-modal">
      <div class="text-center change-language-tips py-4">{{ $t('label.chooseLanguage') }}</div>
      <div v-for="lang in langList" :key="lang" class="change-language-item" @click="changeLanguage(lang)">
        <p class="change-language-item-name py-4">{{ getLanguageName(lang, locale) }}</p>
        <ion-checkbox mode="md" :checked="true" v-if="locale.toString() == lang" />
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { useTenantStore } from '@/store/tenant';
import { computed, ref } from 'vue';
import { getTheme } from '@/theme/hooks'
import { IonModal, IonCheckbox } from '@ionic/vue';
import { getLanguageName } from '@/utils/custom'


const appStore = useAppStore(); // 应用信息
const tenantStore = useTenantStore(); // 租户信息

const profileModalLanguageRef = ref();  // 语言列表弹窗DOM

const curDefaultSkin = computed(() => getTheme().skin == 'default');  // 旧版皮肤
const curFirstSkin = computed(() => ['first','second'].includes(getTheme().skin));      // 新皮肤
const langList = computed(() => tenantStore.getTenantLanguageList()); // 语言列表
const locale = computed(() => appStore.locale);               // 当前语言
const isOpen = computed(() => appStore.languageModalVisible); // 是否打开语言列表弹窗

/**
 * @description 切换语言
 */
function changeLanguage(language: string) {
  appStore.setLocale(language);
  profileModalLanguageRef.value.$el.dismiss();
}

/**
 * @description 关闭弹窗回调
 */
function modelDismiss() {
  appStore.setLanguageModalVisible();
}
</script>

<style lang="less" scoped>
@import "@/views/tabbar/components/styles/LanguageModal/base-index.less";
@import "@/views/tabbar/components/styles/LanguageModal/theme-style.less";

#tabbar-components-LanguageModal-index.style();

.blue-default {
  #tabbar-components-LanguageModal-index.style(
    --theme-color-gradient-300,
    --color-text-100,
    --color-border-400,
    --color-text-100,
    --theme-color-gradient-100
  );
}

.green-default {
  #tabbar-components-LanguageModal-index.style(
    --color-bg-300,
    --color-text-gray-100,
    --line-color,
    --color-text-gray-100,
    --theme-color-gradient-100
  );
}

.forest-green {
  #tabbar-components-LanguageModal-index.style(
    --color-bg-300,
    --color-text-gray-100,
    --color-line,
    --color-text-gray-100,
    --theme-color-gradient-100
  );
}

.amber-purple {
  #tabbar-components-LanguageModal-index.style(
    --color-bg-200,
    --color-text-gray-100,
    --color-line,
    --color-text-gray-100,
    --theme-color-gradient-100
  );
}

.auroral-yellow {
  #tabbar-components-LanguageModal-index.style(
    --color-bg-200,
    --color-text-100,
    --color-line,
    --color-text-100,
    --theme-color-gradient-100
  );
}

.green-dark {
  #tabbar-components-LanguageModal-index.style(
    --color-bg-200,
    --color-text-100,
    --color-line,
    --color-text-100,
    --theme-color-800
  );
}

.yellow-dark {
  #tabbar-components-LanguageModal-index.style(
    --color-bg-200,
    --text-color-white-100,
    --color-line,
    --text-color-white-100,
    --theme-color-800
  );
}  

.purple-light {
  #tabbar-components-LanguageModal-index.style(
    --color-bg-300,
    --text-color-black-100,
    --color-line,
    --text-color-black-100,
    --theme-color-800
  );
}

.new-skin-symbol {
  #tabbar-components-LanguageModal-index.style(
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-color-border-default,
    --ep-color-text-default,
    --ep-dynamic-primary
  );
}

.new-skin-symbol { 
  @import "@/views/tabbar/components/styles/LanguageModal/base-phantom.less";
}
</style>
