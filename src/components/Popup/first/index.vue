<!-- 公用弹窗 -->
<template>
  <div class="public-popup-wrap">
    <div class="main-bg">
      <div class="bg-img-wrapper">
        <ion-img :src="bgUrl" class="bg-img"></ion-img>
      </div>
      <ion-img class="popup-icon -translate-y-[4.375rem]" :src="iconUrl"></ion-img>
      <!-- content -->
      <component :is="customComponent" v-if="customComponent" />
      <div v-else class="content-wrapper">
        <div class="content">
          <div v-html="content"></div>
        </div>
      </div>
      <!-- button list -->
      <div class="btn-wrapper" :class="{ 'flex-row-reverse': reverseBtn }">
        <Button v-show="showLeftBtn" width="9.375rem"  background="var(--ep-dynamic-primary, var(--common-dialog-left-btn-bg))"
            @click="leftBtnCallback"
            :style="{ '--button-text-color': 'var(--ep-color-text-inverse, var(--common-dialog-left-btn-text-color))' }">
            {{ leftBtnText || $t('main.confirm') }}
        </Button>
        <Button v-show="showRightBtn" :disabled="rightBtnIsDisabled" classType="raised" width="9.375rem"
            background="var(--ep-color-background-fill-surface-raised-L2, var(--common-dialog-right-btn-bg))" @click="rightBtnCallback"
            :style="{ '--button-text-color': 'var(--ep-color-text-default, var(--common-dialog-right-btn-text-color))' }">
            {{ rightBtnText || $t('main.cancel') }}
            <span v-show="countdownEnable > 0">{{ `(${countdownTime})` }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonImg } from '@ionic/vue';
import Button from '@/components/first/Button/index.vue'
import { PopupType, PopupParams } from '../data';
import useLogic from '../logic'

const props = withDefaults(
  defineProps<PopupParams>(),
  {
    type: PopupType.TIPS,
    showLeftBtn: true,
    showRightBtn: false,
    reverseBtn: false,
    countdownEnable: 0,
  }
)

const {
  bgUrl,
  iconUrl,
  content,
  rightBtnIsDisabled,
  countdownTime,
  customComponent,
  leftBtnCallback,
  rightBtnCallback,
} = useLogic(props)
</script>

<style scoped lang="less">

.public-popup-wrap {
  height: 100%;
  width: 100%;
  .flex-center();
}

.main-bg {
  width: 21.25rem;
  min-height: 13.75rem;
  position: relative;
  background-color: var(--ep-color-background-fill-surface-raised-L1, var(--common-dialog-bg));
  border-radius: var(--ep-border-radius-surface-small, 1.125rem);
}
.bg-img-wrapper{
  border-radius: var(--ep-border-radius-surface-small, 1.125rem) var(--ep-border-radius-surface-small, 1.125rem) 0 0;
  overflow: hidden;
}

.popup-icon {
  position: absolute;
  top: 0px;
}

.content-wrapper {
  width: 100%;
  min-height: 3.75rem;
  margin: 1.25rem 0;
  .flex-center();
}

.content {
  width: 16.25rem;
  font-size: var(--ep-font-size-m, 0.875rem);
  line-height: 1.5;
  font-weight: var(--ep-font-weight-regular, 400);
  text-align: center;
  color: var(--ep-color-text-weak, var(--common-dialog-text-color));
}

.btn-wrapper {
  margin: 0 0.5rem 1.25rem;
  .flex-around();
}

.left-btn {
  background-color: var(--ep-dynamic-primary, var(--common-dialog-left-btn-bg));
  color: var(--ep-color-text-inverse, var(--common-dialog-left-btn-text-color));
}

.right-btn {
  background-color: var(--ep-color-background-fill-surface-raised-L2, var(--common-dialog-right-btn-bg));
  color: var(--ep-color-text-default, var(--common-dialog-right-btn-text-color));
}
</style>
