// 幸运转盘奖励弹窗 逻辑层
import { ref } from 'vue';
import { createAnimation } from '@ionic/vue';

export default function useRewardModalLogic({ emit }: { emit: any}) {
  const confirmClick = ref(false);  // 确定按钮点击状态
  const modalDuration = ref(1000);  // 弹窗动画时长

  // 奖品弹窗打开动画
  const enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = createAnimation()
      .addElement(root?.querySelector('ion-backdrop') || baseEl)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root?.querySelector('.modal-wrapper') || baseEl)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(modalDuration.value)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  // 奖品弹窗关闭动画
  const leaveAnimation = (baseEl: HTMLElement) => {
    modalDuration.value = 300;
    return enterAnimation(baseEl).direction('reverse');
  };

  /**
   * @description 点击奖品弹窗确定按钮
   */
  function confirmHandle() {
    confirmClick.value = true;
    setTimeout(() => {
      modalClocehandle();
      confirmClick.value = false;
    }, 250)
  }

  /**
   * @description 点击奖品弹窗关闭按钮
   */
  function modalClocehandle() {
    emit('visibleChange', false);
    modalDuration.value = 1000;
  }

  return {
    confirmClick,
    modalDuration,
    enterAnimation,
    leaveAnimation,
    confirmHandle,
    modalClocehandle,
  }

}
