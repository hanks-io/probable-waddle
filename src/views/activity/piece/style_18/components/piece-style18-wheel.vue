<template>
  <!-- style18 助力金活动 -->
  <div class="wheel">
    <div class="wheel-box">
      <LuckyWheel ref="luckyRef" width="17.6875rem" height="17.6875rem" :prizes="prizesStyle18"
        :blocks="WHEEL_CONFIG.blocks" :buttons="WHEEL_CONFIG.buttons" :default-config="WHEEL_CONFIG.defaultConfig"
        :default-style="WHEEL_CONFIG.defaultStyle" @start="startHandle" @end="endHandle" />
    </div>
    <img :src="wheelBorder" class="wheel-border">
    <div class="wheel-round-count">{{ roundCount }}</div>
    <transition name="wheel-scale">
      <img :src="wheelFire" class="wheel-fire" :class="{ 'scale-in': isPlaying, 'scale-out': !isPlaying }"
        v-show="!hideFire">
    </transition>
    <img :src="wheelFinger" :class="['wheel-finger', { 'wheel-finger-animate': isAddAnimation }]"
      v-show="isShowAnimationEl">
    <img :src="wheelStartBtn"
      :class="['wheel-start-btn', { 'wheel-start-btn-animate': isAddAnimation && isShowAnimationEl }]">
    <!-- 抽中累积金融奖励展示 -->
    <p class="wheel-range-amount" v-if="getRangeAmount">
      +{{ convertMoneyToShow(awardCount) }}
    </p>
  </div>

</template>

<script setup lang="ts">
import { LuckyWheel } from "@lucky-canvas/vue";
import wheelBorder from '@/assets/img/activity/AssistanceCash/style18/wheel-border.png'
import wheelFire from '@/assets/img/activity/AssistanceCash/style18/wheel-fire.png'
import wheelFinger from '@/assets/img/activity/AssistanceCash/style18/wheel-finger.png'
import wheelStartBtn from '@/assets/img/activity/AssistanceCash/style18/wheel-start-btn.png'
import wheelPanel from '@/assets/img/activity/AssistanceCash/style18/wheel-panel.svg'
import { convertMoneyToShow } from '@/utils/custom'

/**
 * 接受需要配置的奖品金额文字
 */
const props = withDefaults(defineProps<{
  prizes?: any[]
  roundCount: number
  startClick: boolean
  startCallback: () => void
  endCallback: (prize: any) => Promise<void> | void
  luckyRef: Ref<InstanceType<typeof LuckyWheel>>
  isShowAnimationEl: boolean
  isAddAnimation: boolean
  rangeAmount: number
  winning: boolean
  prizeType: string
  awardCount: number
}>(), {
  prizes: () => []
})

/**
 * 奖品配置后处理
 */
const prizesStyle18 = computed(() =>
  props.prizes.map(prize => {
    if (prize.fonts) {
      prize.fonts[0].top = '2.25rem'
    }
    return prize
  })
)

/**
 * 是否中了累积金融奖励
 */
const getRangeAmount = computed(() => props.prizeType === 'rangeAmount' && props.winning && props.awardCount)


const luckyRef = useTemplateRef<InstanceType<typeof LuckyWheel>>('luckyRef')

const emit = defineEmits<{
  (e: 'update:luckyRef', value: InstanceType<typeof LuckyWheel>): void
}>()

watchEffect(() => {
  if (luckyRef.value) {
    emit('update:luckyRef', luckyRef.value)
  }
})

const isPlaying = ref(false) // 播放火焰动画
const hideFire = ref(true) // 隐藏火焰


/**
 * 转盘配置
 */
const WHEEL_CONFIG = {
  width: "13.4375rem",
  height: "13.4375rem",
  defaultConfig: {
    offsetDegree: -22.5,
  },
  defaultStyle: {
    fontColor: "#fff",
    fontWeight: 700,
    fontFamily: 'Smooch Sans',
    fontSize: '0.875rem',
  },
  blocks: [
    { imgs: [{ src: wheelPanel, width: "100%", height: "100%", rotate: true }] },
  ],
  fontsConfig: {
    top: "2.25rem",
    fontColor: "#fff",
    fontSize: '1rem'
  },
  buttons: [
    {
      radius: "50%"
    }
  ]
}

/**
 * 奖品配置
 */

const setPrizes = () => {
  props.prizes.forEach(prize => {
    if (prize.fonts) { // 文字类型奖励
      prize.fonts[0].fontColor = '#fff'
    }
  })
}



const startHandle = () => {
  props.startCallback()
}
const endHandle = (prize: any) => {
  props.endCallback(prize)
  isPlaying.value = false
  // 动画延迟需要
  setTimeout(() => {
    hideFire.value = true
  }, 300)
}

/**
 * 监听奖品配置
 */
watchEffect(() => {
  if (props.prizes.length) {
    setPrizes()
  }
})


/**
 * 监听startClick 控制转盘动画
 */
watch(() => props.startClick, (newVal: boolean) => {
  if (newVal) {
    isPlaying.value = true
    hideFire.value = false
  }
})

</script>


<style lang="less" scoped>
.wheel {
  position: relative;
  height: 30.25rem;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 25.9375rem;
    transform: translateY(-50%);
    height: 21.0625rem;
    background: #1624cf;
    border-radius: 100%;
    filter: blur(5rem);
    z-index: -3;
  }

  .wheel-box {
    position: absolute;
    top: 8.0625rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wheel-border {
    position: absolute;
    top: 1.5rem;
    left: calc(50% + 0.25rem);
    transform: translateX(-50%);
    width: 23.5rem;
    pointer-events: none;
  }

  .wheel-finger {
    position: absolute;
    top: 11.125rem;
    left: calc(50% - 2rem);
    width: 8.375rem;
    z-index: 3;
    opacity: 0;
    transform-origin: center;
    pointer-events: none;

    &.wheel-finger-animate {
      animation: finger-effect 5s ease-in-out infinite;
    }
  }

  .wheel-fire {
    position: absolute;
    top: 5.9375rem;
    left: 50%;
    width: 25rem;
    z-index: -2;
    transform-origin: center;
    transition: transform 1s ease;
  }

  .wheel-round-count {
    position: absolute;
    font-size: 2.25rem;
    top: calc(50% + 1.75rem);
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 1;
    font-weight: bold;
    z-index: 2;
    pointer-events: none;
  }

  .wheel-start-btn {
    position: absolute;
    top: 14.125rem;
    left: calc(50%);
    width: 5.625rem;
    transform: translateX(-50%);
    z-index: 1;
    pointer-events: none;

    &.wheel-start-btn-animate {
      animation: startBtnScaleIn 5s ease-in-out infinite;
    }
  }

  .wheel-range-amount {
    position: absolute;
    top: 12.5rem;
    left: calc(50%);
    transform: translateX(-50%);
    z-index: 1;
    pointer-events: none;
    font-size: 1.5rem;
    font-weight: 500;
    will-change: transform, opacity;
    animation: wheelRangeAmountIn 1.5s forwards;
  }
}

/* 缩放动画类 */
.scale-in {
  animation: wheelScaleIn 0.3s forwards;
}

.scale-out {
  animation: wheelScaleOut 0.3s forwards;
}

// 手指动画, 从屏幕外向屏幕内移动
@keyframes finger-effect {

  0% {
    opacity: 0;
    transform: translate(500px, -400px)
  }

  25% {
    opacity: 0.2;
    transform: translate(18.75rem, -18.75rem)
  }

  70% {
    opacity: 1;
    transform: translate(0, 0);
  }


  80% {
    opacity: 1;
    transform: translate(0, 0) scale(0.9);
  }


  90% {
    opacity: 1;
    transform: translate(0, 0) scale(1.1);
  }

  100% {
    opacity: 0.5;
    transform: translate(0, 0) scale(1);

  }
}


@keyframes startBtnScaleIn {
  0% {
    transform: translateX(-50%) scale(1);
  }

  70% {
    transform: translateX(-50%) scale(1);
  }

  80% {
    transform: translateX(-50%) scale(1.15);
  }

  85% {
    transform: translateX(-50%) scale(1);
  }

  90% {
    transform: translateX(-50%) scale(1.15);
  }

  100% {
    transform: translateX(-50%) scale(1);
  }
}



@keyframes wheelScaleIn {
  from {
    transform: translateX(-50%) scale(0.8);
  }

  to {
    transform: translateX(-50%) scale(1.15);
  }
}

@keyframes wheelScaleOut {
  from {
    transform: translateX(-50%) scale(1.15);
  }

  to {
    transform: translateX(-50%) scale(0.8);
  }
}


@keyframes wheelRangeAmountIn {
  from {
    transform: translateX(-50%) scale(1.5);
    opacity: 0.8;
  }

  to {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}
</style>
