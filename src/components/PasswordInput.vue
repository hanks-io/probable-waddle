<template>
  <div :class="['grid-password', theme]">
    <div v-for="(item, index) in passwordArray" :key="index" class="grid-item"
      :class="{ 'grid-item-focus': focusIndex === index }">
      <div v-if="item !== null" class="dot"></div>
      <div v-else-if="focusIndex === index" class="cursor"></div>
    </div>
    <input ref="inputRef" class="hidden-input" autofocus inputmode="numeric" maxlength="6" v-model="password"
      @input="handleInput" @focus="handleFocus" @blur="handleBlur">
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import useAddThemeClassName from '@/hooks/useAddThemeClassName'
import { getTheme } from '@/theme/hooks'
const { theme, skin } = getTheme()
const emit = defineEmits(['input']) // 定义传递事件方法(添加事件名称)

const props = withDefaults(
  defineProps<{
    focus?: boolean  // 自动聚焦
  }>(),
  {
    focus: false
  }
)

defineExpose({
  clear
})

const inputRef = ref();     // 获取input元素(自动聚焦)
const password = ref('');   // 密码
const focusIndex = ref(-1); // 光标位置

const passwordArray = computed(() => {                            // 监听密码获取数组(用于显示密码点)
  let arr = Array(6).fill(null);                                  // 初始化数组(6位密码)
  password.value.toString().split('').forEach((char, index) => {  // 遍历密码赋值予显示密码点数组
    arr[index] = char;
  });
  return arr;
});

function handleInput() {
  let passwordStr = password.value.toString();  // 获取密码
  if (!/^\d*$/.test(passwordStr)) {             // 检查输入的值是否是数字, 如果不是清除输入的值或者设置为上一次的值
    password.value = passwordStr.slice(0, password.value.length - 1);
  }
  if (passwordStr.length > 6) {
    password.value = passwordStr.slice(0, 6);  // 截取前6位
  }
  focusIndex.value = password.value.length;       // 设置光标位置
  emit('input', password.value.toString())     // 传送事件(参数可为任意类型)
}

function handleFocus() {
  focusIndex.value = password.value.length;      // 设置光标位置(获取焦点)
}

function handleBlur() {
  focusIndex.value = -1;                          // 设置光标位置(失去焦点)
}

function clear() {
  password.value = '';                            // 清空密码
}

/**
 * 生命周期--挂载完成
 */
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (props.focus) {        // 如果自动聚焦设置为true
        inputRef.value?.focus(); // 自动聚焦
      }
    }, 500);
  });
});
</script>

<style scoped lang="less">
.grid-password {
  /* 最外层盒子 */
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid transparent;
  padding: 0;
}

.hidden-input {
  /* input(透明) */
  position: absolute;
  inset: 0;
  opacity: 0;
  caret-color: transparent;
  -webkit-text-fill-color: transparent;
}

.grid-item {
  /* 密码点 */
  width: 2.75rem;
  height: 2.75rem;
  background: var(--color-bg-payment-item);
  border-radius: var(--rounded-small);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.grid-item-focus {
  /* 密码点(聚焦) */
  border: 1px solid var(--color-focus);
}

.dot {
  /* 密码点(显示) */
  width: 10px;
  height: 10px;
  background: var(--color-text-100);
  border-radius: 50%;
}

.cursor {
  /* 光标 */
  position: absolute;
  width: 1px;
  height: 1rem;
  background: var(--color-text-100);
  animation: blink 1s infinite;
}

@keyframes blink {

  /* 光标闪烁 */
  0% {
    opacity: 1;
  }

  49% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.grid-password.purple-light {
  .grid-item {
    background-color: var(--color-bg-400);
  }

}

.grid-password.amber-purple {
  .grid-item {
    background-color: var(--color-bg-200);
  }

}

.grid-password.auroral-yellow {
  .grid-item {
    background-color: var(--color-bg-200);
  }

}

.new-skin-symbol {
  .grid-password {
    .grid-item {
      /* 密码点 */

      background: var(--ep-color-background-fill-surface-raised-L2);
      border-radius: var(--ep-border-radius-s);

    }

    .grid-item-focus {
      /* 密码点(聚焦) */
      border: 1px solid var(--ep-color-border-brand);
    }


    .dot {
      /* 密码点(显示) */
      width: 10px;
      height: 10px;
      background: var(--ep-color-text-default);
      border-radius: 50%;
    }


  }

}
</style>
