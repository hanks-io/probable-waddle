<template>
  <div class="lucky-wheel-container">
    <lucky-wheel class="wheel" ref="myLucky" width="18.75rem" height="18.75rem" :blocks="blocks" :prizes="prizes"
      :buttons="buttons" :defaultConfig="defaultConfig" :defaultStyle="defaultStyle" @start="startCallback"
      @end="endCallback" />
    <img class="float-img" v-for="img in imgsList" :key="img.src" :src="img.src" :style="img.style">
    <img v-show="showMask" class="wheel-mask" src="/images/wheel-mask-1.png" />
  </div>
</template>

<script setup lang="ts">
import { LuckyWheel } from '@lucky-canvas/vue'
import { onMounted, onUnmounted, ref } from 'vue'

const emits = defineEmits(['start', 'end'])


const props = defineProps({
  prizes: {
    type: Array,
    default: [
      { fonts: [{ text: 'x1', top: '35' }] },
      { fonts: [{ text: 'Thanks', top: '35' }] },
      { fonts: [{ text: 'x1', top: '35' }] },
      { fonts: [{ text: 'Thanks', top: '35' }] },
      { fonts: [{ text: 'x1', top: '35' }] },
      { fonts: [{ text: 'Thanks', top: '35' }] },
      { fonts: [{ text: 'x1', top: '35' }] },
      { fonts: [{ text: 'Thanks', top: '35' }] },
      { fonts: [{ text: 'x1', top: '35' }] },
      { fonts: [{ text: 'Thanks', top: '35' }] },
      { fonts: [{ text: 'Thanks', top: '35' }] },
      { fonts: [{ text: 'Thanks', top: '35' }] },
    ]
  },
  numberOfDraws: {
    type: Number,
    default: 0
  },
  defaultStyle: {
    type: Object,
    default: {}
  },
  activePrizeStyle: {
    type: Object,
    default: {}
  },
  bgSrc: {
    type: String,
    default: '/images/wheel-1.png'
  },
  showMask: {
    type: Boolean,
    default: false
  }
})

const myLucky = ref<InstanceType<typeof LuckyWheel> | null>(null)

const defaultConfig = {
  offsetDegree: -45,
  accelerationTime: 5000,
  decelerationTime: 5000,
}

// 转盘配置
const blocks = [
  {
    imgs: [
      {
        src: props.bgSrc,
        width: '100%',
        height: '100%',
        rotate: true,
      }
    ]
  }
]

const btnImgList = ['/images/start-btn-disabled.png', '/images/start-btn.png', '/images/start-btn-active.png']
const isStart = ref(false)
const imgsList = computed(() => {
  const numberOfDraws = props.numberOfDraws
  let btnConfig = {
    src: btnImgList[0],
    style: {
      width: 'auto',
      height: '50%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -48%)',
      zIndex: 1,
    }
  }
  if (numberOfDraws > 0) {
    btnConfig = {
      src: btnImgList[1],
      style: {
        width: 'auto',
        height: '50%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -48%)',
        zIndex: 1,
      }
    }
  }
  if (isStart.value) {
    btnConfig = {
      src: btnImgList[2],
      style: {
        width: 'auto',
        height: '50%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -48%)',
        zIndex: 1,
      }
    }
  }
  return [
    btnConfig,
    {
      src: '/images/ring.png',
      style: {
        width: '9.375rem',
        height: '6.0938rem',
        top: '2.875rem',
        zIndex: 15,
      }
    },
  ]
})

const buttons = [
  {
    radius: '52%',
    background: 'transparent',
  }
]

const preloadImgs = (imgList: string[]) => {
  imgList.forEach((imgSrc) => {
    const img = new Image()
    img.src = imgSrc
  })
}

preloadImgs(btnImgList)

const startCallback = () => {
  if (props.numberOfDraws <= 0) return;
  isStart.value = true;

  // 开始转动
  myLucky.value?.play()

  emits('start', myLucky.value)
}

const endCallback = (prize: any) => {
  isStart.value = false;
  Object.assign(prize, props.activePrizeStyle)
  emits('end', prize)
}

// 添加 resize 处理函数
const resetWheel = () => {
  if (myLucky.value) {
    myLucky.value.init()
  }
}

onMounted(() => {
  window.addEventListener('resize', resetWheel)
})

onUnmounted(() => {
  window.removeEventListener('resize', resetWheel)
})
</script>

<style scoped lang="less">
.lucky-wheel-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 0;

  .wheel {
    z-index: 10;
  }

  .float-img {
    position: absolute;
    pointer-events: none;
  }

  .wheel-mask {
    position: absolute;
    width: 18.75rem;
    height: 18.75rem;
    z-index: 50;
    pointer-events: none;
    transform: rotate(0deg);
  }
}
</style>
