<template>
  <img ref="imgRef" :src="imgSrc" @error="loadError" @load="loadComplete" />
</template>

<script setup lang="ts">
import { IonImg } from "@ionic/vue";

const props = defineProps({
  errorImage: {
    type: String,
    default: '',
  },
  lowResolutionImage: {
    type: String,
    default: '',
  },
  src: {
    type: String,
    default: '',
  },
  loadImage: {
    type: Object,
    default: () => ({}),
  },
})

const imgSrc = ref('');

const imgRef = ref<typeof IonImg | null>(null); // Add type annotation for imgRef

const replaceClassName = (className: string) => {
  if (imgRef.value) {
    const oldClassName = className === 'good-img' ? 'error-img' : 'good-img';
    imgRef.value.classList.remove(oldClassName);
    imgRef.value.classList.add(className);
  }
}

const loadComplete = (e: any) => {
  if (e.target.src === props.errorImage && props.errorImage !== props.lowResolutionImage) {
    replaceClassName('error-img');
    return;
  }
  if (props.src && (e.target.src === props.src || e.target.src.includes(props.src))) {
    replaceClassName('good-img');
  } else {
    const img = new Image();
    img.src = props.src;
    img.onload = () => {
      imgSrc.value = props.src;
    };
    img.onerror = () => {
      replaceClassName('error-img');
    };
  }
}

const loadError = () => {
  imgSrc.value = props.errorImage;
};

watch(() => props.src, (value) => {
  imgSrc.value = value;
});

onMounted(() => {
  setTimeout(() => {
    const { loadImage, src, lowResolutionImage } = props;
    imgSrc.value = loadImage?.icon1 || lowResolutionImage || src;
  }, 1000);
})

</script>

<style scoped lang="less">
ion-img {
  width: 0;

  &.good-img {
    width: 100%;
  } 
}
</style>
