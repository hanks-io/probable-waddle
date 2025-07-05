<!-- 组件/跑马灯 -->
<template>
   <div class="marquee">
    <div class="marquee__content" :style="`--animation-duration: ${animationDuration}s`">
      <label class="marquee__item" v-for="item in content" :key="item.name" @click="marqueeHandle(item)">{{item.content}}</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router'
import { useActivityStore } from '@/store/activity'
import { httpCompletion } from "@/utils";
import { CarouselConfigModel } from '@/api/normal/model';
import { openUrl } from '@/utils/app';

const router = useRouter();               // 路由对象
const activityStore = useActivityStore(); // 活动store

interface Props {
  content: CarouselConfigModel
}

const props = defineProps<Props>()

// 计算动画持续时间
const animationDuration = computed(() => {
  // 假设每个字符需要0.2秒
  const timePerChar = 0.2
  // 计算所有内容的总字符数
  let totalChars = props.content.reduce((total, item) => total + item.content.length + 32, 0)
  // 返回动画持续时间
  return totalChars * timePerChar
})

// 点击跑马灯内容
async function marqueeHandle(item: CarouselConfigModel[0]) {
  if (item.linkType === 'url') {
    openUrl(httpCompletion(item.linkValue))
  } else if (item.linkType === 'activity') {
    const activityList = await activityStore.getActivityList();
    if (activityList.length) {
      activityList.forEach((activity) => {
        if (activity.id === Number(item.linkValue)) {
          router.push({
            path: `/activity/${activity.type}/${activity.id}`
          })
        }
      });
    }
  }
}
</script>

<style scoped>
.marquee { /* 跑马灯盒子 */
  width: 100%;
  overflow: hidden;
}

.marquee__content { /* 跑马灯内容 */
  width: max-content;
  display: flex;
  animation: marquee var(--animation-duration) linear infinite;
}

.marquee__item { /* 跑马灯单项 */
  white-space: nowrap;
  margin-right: 24.375rem;
}

@keyframes marquee { /* 跑马灯动画 */
  0% {
    transform: translate3d(24.375rem, 0 , 0);
  }
  100% {
    transform: translate3d(calc(24.375rem - 100%), 0 , 0);
  }
}
</style>
