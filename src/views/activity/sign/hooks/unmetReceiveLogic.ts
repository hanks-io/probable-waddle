import { ref } from 'vue'

interface Params {
  emit: any;
}

export function useUnmetReceiveLogic({ emit }: Params) {

  const visible = ref<boolean>(true);

  // 知道了按钮 click 事件
  function unmetBtnClick() {
    emit('closeUnmetReceive')
  }

  return {
    visible,
    unmetBtnClick
  }
}
