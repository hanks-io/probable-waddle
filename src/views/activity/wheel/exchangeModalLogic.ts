// 幸运转盘兑换弹窗 逻辑层
import { computed, ref } from 'vue';
import { showToast } from '@/utils'

export default function useExchangeModalLogic({props, emit}: {props: any, emit: any}) {
  const amount = ref('');

  const summation = computed(() => {
    return [...props.rewardCards].sort((a, b) => a.amount - b.amount)[0].amount;
  })

  /**
   * @description: 弹窗关闭事件
   */
  function modalDismiss() {
    emit('visibleChange', false);
  }

  /**
   * @description: 提交表单
   */
  function submitForm(event: Event) {
    event.preventDefault(); // 阻止默认事件
    if (!summation.value) return;
    if (Number(amount.value) > summation.value)
      return showToast('toast.numInsufficient');
    if (Number(amount.value) <= 0)
      return showToast('toast.exchangeQuantityCannot');
    emit('exchange', Number(amount.value));
  }

  /**
   * @description: 设置最大兑换数量
   */
  function setMaxHandle() {
    amount.value = summation.value;
  }

  return {
    amount,
    summation,
    modalDismiss,
    submitForm,
    setMaxHandle
  }
}
