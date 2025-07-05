<template>
  <ion-input ref="ionInputEl" :value="inputValue" @ionInput="inputChange" v-bind="$attrs"></ion-input>
</template>
<script setup lang="ts">
  import { IonInput } from "@ionic/vue";
  /**
   * 
   * @param float 如果需要浮点数，传入 数字 或 字符串数字
   * @param type 固定位数字input，这里是防止错误传入
   */
  const { modelValue, float } = defineProps(["modelValue", 'float', 'type']);

  const emit = defineEmits(["update:modelValue"]);

  const ionInputEl = ref();
  const inputValue = ref<string>(modelValue);
  /**
   * @description 数字输入
   */
  const inputChange = (ev: any) => {
    const value = ev.target!.value;
    const reg = new RegExp(`^\\d*(?${ float ? '' : '!'}:\\.\\d{0,${float}})?`);
    const testValue = reg.exec(value);
    const filteredValue = testValue ? testValue[0] : '';
    inputValue.value = filteredValue;
    emit("update:modelValue", filteredValue);

    const inputCmp = ionInputEl.value;
    if (inputCmp !== undefined) {
      inputCmp.$el.value = filteredValue;
      inputCmp.$el.nativeInput.value = filteredValue;
    }
  }
</script>