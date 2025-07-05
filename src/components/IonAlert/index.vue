<template>
  <ion-modal ref="modal" :is-open="true" @willDismiss="maskBtn">
    <div class="logout-modal">
      <!-- alert 标题 -->
      <div class="logout-modal-title w-full">{{ alertOptions.title }}</div>
      <!-- alert 内容 -->
      <div class="logout-modal-message w-full">{{ alertOptions.message }}</div>
      <!-- 底部按钮 -->
      <div class="logout-modal-btn">
        <!-- 取消 -->
        <ion-button 
          v-if="showLeftBtn" 
          @click="cancelButton" 
          class="logout-modal-btn-left"
          :style="{ 
              '--color': alertOptions?.cancelOption?.textColor,
              '--background': alertOptions?.cancelOption?.btnBgColor,
           }"
        >
          {{ defaultLeftText }}
        </ion-button>
        <!-- 确定 -->
        <ion-button 
          v-if="showRightBtn" 
          @click="sureButton" 
          class="logout-modal-btn-right"
          :style="{ 
              '--color': alertOptions?.sureOption?.textColor,
              '--background': alertOptions?.sureOption?.btnBgColor,
           }"
        >
          {{ defaultRightText }}
        </ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import i18n from "@/i18n";
import { computed } from "vue";
import { IonButton, IonModal } from "@ionic/vue";
import { getTheme } from "@/theme/hooks";

type BtnLeftOptionType = {
  textColor: string,
  btnBgColor: string,
  borderColor: string,
  showCancel: boolean,
  cancelText: string,
}

type BtnRightOptionType = {
  textColor: string,
  btnBgColor: string,
  borderColor: string,
  showSure: boolean,
  sureText: string
}

type alertOptionsType = {
  title: string,
  message: string, 
  cancelOption: BtnLeftOptionType,
  sureOption: BtnRightOptionType
}

const { t } = i18n.global;
const props = defineProps({
  alertOptions: {
    type: Object as () => alertOptionsType,
    default: {
      title: '',
      message: '',
      cancelOption: { textColor: '', btnBgColor: '', borderColor: '' },
      sureOption: { textColor: '', btnBgColor: '', borderColor: '' }
    },
  },
});

// 当前属于旧皮肤
const curDefaultSkin = computed(() => getTheme().skin == 'default');
const curFirstSkin = computed(() => ['first','second'].includes(getTheme().skin));

// 取消按钮是否显示
const showLeftBtn = computed(() => {
  const isShowLefBtn = props?.alertOptions?.cancelOption?.showCancel;
  return isShowLefBtn ? isShowLefBtn : true;
});
// 确定按钮是否显示
const showRightBtn = computed(() => {
  const isShowRightBtn = props?.alertOptions?.sureOption?.showSure;
  return isShowRightBtn ? isShowRightBtn : true;
});
// 取消文本
const defaultLeftText = computed(() => {
  const cancelText = props?.alertOptions?.cancelOption?.cancelText;
  return cancelText ? cancelText : t("main.cancel");
});
// 确定文本
const defaultRightText = computed(() => {
  const sureText = props?.alertOptions?.sureOption?.sureText;
  return sureText ? sureText : t("label.logout");
});

// 取消按钮颜色
const emit = defineEmits(["maskClick", "cancelClick", "sureClick"]);

// 取消  click 事件
function cancelButton() {
  emit("cancelClick", "");
}
// 确定 click 事件
function sureButton() {
  emit("sureClick", "");
}
// 遮罩层 点击事件
function maskBtn() {
  emit("maskClick", "");
}
</script>

<style scoped lang="less">
@import '@/components/IonAlert/styles/base-index.less';
@import '@/components/IonAlert/styles/theme-style.less';

#components-IonAlert-index.style();

.blue-default {
  #components-IonAlert-index.style(
    --color-bg-700,
    --color-text-100,
    --color-text-40,
    --color-text-100,
    --theme-color-gradient-100,
    --color-text-100,
    --color-bg-700,
    --theme-color-gradient-100,
    --theme-color-900,
  );
}

.green-default {
  #components-IonAlert-index.style(
    --color-bg-200,
    --color-text-100,
    --color-text-40,
    --color-text-white-100,
    --color-border-input-prefix,
    --color-text-white-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100
  );
}

.forest-green {
  #components-IonAlert-index.style(
    --color-bg-200,
    --color-text-gray-100,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-bg-50,
    --color-text-gray-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100,
    --theme-color-gradient-100
  );
}

.amber-purple {
  #components-IonAlert-index.style(
    --color-bg-200,
    --text-color-light-purple-1-100,
    --text-color-light-purple-2-100,
    --text-color-white-100,
    --color-bg-100,
    --text-color-white-100,
    --theme-color-800,
    --theme-color-gradient-100,
    --theme-color-gradient-100
  );
}

.auroral-yellow {
  #components-IonAlert-index.style(
    --color-bg-200,
    --color-text-100,
    --color-text-40,
    --color-text-100,
    --color-bg-100,
    --color-text-black-100,
    --theme-color-800,
    --theme-color-gradient-100,
    --theme-color-800
  );
}

.yellow-dark {
  #components-IonAlert-index.style(
    --color-card-bg-200,
    --text-color-white-100,
    --text-color-white-40,
    --text-color-white-40,
    --color-card-bg--100,
    --text-color-black-100,
    --theme-color-800,
  );
}

.green-dark {
  #components-IonAlert-index.style(
    --color-bg-200,
    --text-color-white-100,
    --text-color-white-40,
    --text-color-white-100,
    --color-bg-100,
    --text-color-white-100,
    --theme-color-800
  )
}

.purple-light {
  #components-IonAlert-index.style(
    --color-bg-300,
    --text-color-black-100,
    --text-color-black-80,
    --text-color-black-80,
    --color-bg-100,
    --text-color-white-100,
    --theme-color-800
  );
}

.new-skin-symbol {
  #components-IonAlert-index.style(
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-default,
    --ep-color-text-weaker,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L2,
    --ep-color-text-default,
    --ep-dynamic-primary
  );
}

.new-skin-symbol { 
  @import '@/components/IonAlert/styles/base-phantom.less';
}
</style>
