import { ref } from 'vue'

interface Params {
  emit: any;
}

export function useReceivedModalLogic({ emit }: Params) {

  const visible =ref<boolean>(true);
  const starNumber = ref<number>(9);

  // 知道了 按钮 click事件
  function receivedCloseBtn() {
    emit('closeReceived')
  }
  
  return {
    visible,
    starNumber,
    receivedCloseBtn
  }
}
