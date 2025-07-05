// 公用弹窗逻辑层
import { modalController } from '@ionic/vue'
import { computed, ref, onMounted } from 'vue';
import { getPopupBg, getPopupIcon, PopupParams } from './data';

export default function useLogic(props: PopupParams) {
    const tenantStore = useTenantStore();

    const country = computed(() => tenantStore.tenantInfo?.code);
    const bgUrl = computed(() => getPopupBg(country.value));
    const iconUrl = computed(() => getPopupIcon(props.type!, country.value));
    const content = computed(() => props.msg || '');
    const countdownTime = ref(props.countdownEnable!);
    const rightBtnIsDisabled = ref(!!props.countdownEnable);
    const customComponent = computed(() => props.contentComp || null);
    let intervalId: number = 0;

    // 左边按钮回调
 function leftBtnCallback() {
        if (props.leftBtnCallback) {
            props.leftBtnCallback();
        }
          modalController.dismiss();
    }

    // 右边按钮回调
 function rightBtnCallback() {
        if (props.rightBtnCallback) {
            props.rightBtnCallback();
        }
          modalController.dismiss();
    }

    // 开始倒计时
    function startCountdown() {
        intervalId && clearInterval(intervalId);
        intervalId = window.setInterval(() => {
            if (countdownTime.value <= 0) {
                clearInterval(intervalId);
                rightBtnIsDisabled.value = false;
                return;
            }
            countdownTime.value--;
        }, 1000);
    }

    onMounted(() => {
        if (countdownTime.value > 0) {
            startCountdown();
        }
    })

    onUnmounted(() => {
        intervalId && clearInterval(intervalId);
    })

    return {
        bgUrl,
        iconUrl,
        content,
        rightBtnIsDisabled,
        countdownTime,
        customComponent,
        leftBtnCallback,
        rightBtnCallback,
    }
}
