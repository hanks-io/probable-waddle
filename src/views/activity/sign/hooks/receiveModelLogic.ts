import { ref } from 'vue'

interface Params {
  emit: any;
}

export function useReceiveModelLogic({ emit }: Params) {
  const visible = ref<boolean>(true);

  // 知道了按钮 click 事件
  function receiveBtnClick() {
    emit('closeReceive')
  }

  return {
    visible,
    receiveBtnClick
  }
}
