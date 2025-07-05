<!-- 新人专属 -->
<template>
  <component 
    :is="currentSignVue"
    :key="componentKey"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useComponents } from '@/views/activity/newUserExclusive/logic';

const componentKey = ref(0)
const currentSignVue = useComponents()

// 强制组件重新渲染
const forceUpdate = () => {
  componentKey.value++
}

// 暴露方法供外部调用
defineExpose({
  forceUpdate
})
</script>
