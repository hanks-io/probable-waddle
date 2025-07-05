<template>
  <div class="wall">
    <ProgressiveImages v-if="isImage" class="img-box" :src="props.src"/>
    <template v-else>
      <div v-html="svgContent" class="svg-container"></div>
      <slot>
        <SvgStyle />
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import SvgStyle from "./svgStyle.vue";
import ProgressiveImages from "@/components/GameCard/progressiveImages.vue";
import { useGradientSVG } from "@/hooks/useLoadComponent";

const props = defineProps({
  src: { type: String, default: "" }, // logo
  styleId: { type: String, default: "" }, // 样式id
});

const { selectSvgGradientID } = useGradientSVG();
const svgContent = ref("");

const isImage = ref(false);

const checkIfTheImage = () => {
  const svgPattern = /\.svg$/i;
  isImage.value = !svgPattern.test(props.src);
};

const requestImg = async () => {
  checkIfTheImage();
  if (isImage.value) return;
  const response = await fetch(props.src);
  const svgText = await response.text();
  const { styleId } = props;
  if (styleId) {
    svgContent.value = svgText.replace(/currentColor/g, `url(#${styleId})`);
    return;
  } 
  const key = selectSvgGradientID();
  if (key) {
    svgContent.value = svgText.replace(/currentColor/g, `url(#svg-theme-color${key})`);
    return;
  }
  svgContent.value = svgText;
};

requestImg();
</script>

<style lang="less" scoped>
.wall {
  width: 100%;
  font-size: inherit;

  .img-box {
    width: 0;
    height: 0;

    &.good-img {
      width: 100%;
      height: 100%;
    }
  }

  .svg-container {
    font-size: inherit;

    :deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
