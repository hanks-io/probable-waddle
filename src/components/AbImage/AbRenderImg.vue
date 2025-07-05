<script setup lang="ts" name="AbRenderImg">
import { isNullOrUnDefOrNoth } from "@/utils";
import { IonImg } from '@ionic/vue'

interface Props {
  url?: Ref<string> | ComputedRef<string> | string;
  src?: Ref<string> | ComputedRef<string> | string;
  type?: "bg" | "img"; // "bg" 背景图, "img" 用 <ion-img>
  setStyle?: boolean; // 是否设置 backgroundSize / position
}

const props = withDefaults(defineProps<Props>(), {
  type: "bg",
  setStyle: true
});
const emit = defineEmits(["loaded"]);

const originUrl = computed(() => {
  const src = props.src || props.url;
  return ref(src).value;
});

// 背景图样式
const styleBg = computed(() => {
  return props.setStyle
    ? { backgroundPosition: "center", backgroundRepeat: "no-repeat" }
    : null;
});

</script>
<script lang="ts">
// ✅ 在 script 中绑定局部指令（仅在当前组件生效）
import LazyDirective from './v-lazy'
export default {
  directives: {
    lazy: LazyDirective
  }
}
</script>

<template>
  <!-- 背景图懒加载 -->
  <div v-if="type === 'bg' && !isNullOrUnDefOrNoth(originUrl)" class="ab-render-img" :style="styleBg"
    v-lazy:background-image="originUrl">
    <slot></slot>
  </div>

  <!-- 无背景图地址 fallback -->
  <div v-else-if="type === 'bg'" class="ab-render-img" :style="styleBg">
    <slot></slot>
  </div>

  <!-- 图片懒加载 - 使用 ion-img -->
  <ion-img v-else :src="originUrl" class="ab-render-img" @ionImgDidLoad="emit('loaded')" />
</template>

<style lang="less" scoped>
.ab-render-img {
  background-size: cover;
}
</style>
