<template>
  <ion-img ref="imgRef" :src="imgSrc" @ionError="loadError" @ionImgDidLoad="loadComplete" />
</template>

<script setup lang="ts">
import { IonImg } from "@ionic/vue";

const emits = defineEmits(['updateLoadingSuccess']);

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
})

const imgSrc = ref(props.lowResolutionImage || props.src);

const imgRef = ref<typeof IonImg | null>(null); // Add type annotation for imgRef


const replaceClassName = (className: string) => {
  if (imgRef.value) {
    const loadingState = className === 'good-img';
    const oldClassName = loadingState ? 'error-img' : 'good-img';
    emits('updateLoadingSuccess', loadingState);
    imgRef.value.$el.classList.remove(oldClassName);
    imgRef.value.$el.classList.add(className);
  }
}

const loadComplete = (e: any) => {
  if (e.target.src === props.errorImage && props.errorImage !== props.lowResolutionImage) {
    replaceClassName('error-img');
    return;
  }
  if (e.target.src === props.src) {
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

</script>

<style scoped lang="less">
ion-img {
  width: 0;

  &.good-img {
    width: 100%;
  } 
}
</style>
