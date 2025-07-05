<!-- 公用弹窗 -->
<template>
    <div class="h-full w-full flex justify-center items-center public-popup-wrap">
        <div class="relative w-[21.25rem] min-h-[13.75rem] bg-white rounded-[1.25rem]">
            <ion-img :src="bgUrl"></ion-img>
            <ion-img class="absolute top-0 -translate-y-[4.375rem]" :src="iconUrl"></ion-img>
            <!-- content -->
            <component :is="customComponent"  v-if="customComponent" />
            <div v-else class="w-full min-h-[3.75rem] my-5 flex items-center justify-center">
                <div class="w-[16.25rem] text-sm text-center text-[#595959]">
                    <div v-html="content"></div>
                </div>
            </div>
            <!-- button list -->
            <div class="btnList mx-[2.8125rem] flex justify-around mb-5" :class="{ 'flex-row-reverse': reverseBtn }">
                <ion-button mode="md" v-show="showLeftBtn" class="leftBtn" @click="leftBtnCallback">{{ leftBtnText ||
                    $t('main.confirm') }}</ion-button>
                <ion-button mode="md" v-show="showRightBtn" :disabled="rightBtnIsDisabled" class="rightBtn" @click="rightBtnCallback">{{ rightBtnText ||
                    $t('main.cancel') }}
                    <span v-show="countdownEnable > 0">{{ `(${countdownTime})` }}</span>
                </ion-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonImg, IonButton } from '@ionic/vue';
import { PopupType, PopupParams } from '../data';
import useLogic from '../logic'

const props = withDefaults(
    defineProps<PopupParams>(),
    {
        type: PopupType.TIPS,
        showLeftBtn: true,
        showRightBtn: false,
        reverseBtn: false,
        countdownEnable: 0,
    }
)

const {
    bgUrl,
    iconUrl,
    content,
    rightBtnIsDisabled,
    countdownTime,
    customComponent,
    leftBtnCallback,
    rightBtnCallback,
} = useLogic(props)



</script>

<style scoped>
ion-button::part(native) {
    width: 6.875rem;
    height: 2.1875rem;
    border-radius: 0.3125rem;
}

.btnList:nth-child(2) {
    margin-left: 1.875rem;
}

.leftBtn {
    min-height: 2.1875rem;
    --background: var(--color-bg-btn-popup-cancel);
    --color: var(--color-text-btn-basic);
    --box-shadow: none;
    font-size: 0.75rem;
}

.rightBtn {
    min-height: 2.1875rem;
    --background: transparent;
    --background-activated: transparent;
    --border-width: 0.0625rem;
    --border-style: solid;
    --border-color: var(--color-border-popup-confirm);
    --color: #595959;
    --box-shadow: none;
    font-size: 0.75rem;
}
</style>
