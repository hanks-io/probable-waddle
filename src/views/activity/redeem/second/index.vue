<!-- 兑换码活动 -->
<template>
    <div :class="$attrs.class" :style="$attrs.style">
        <div class=" rounded-[--rounded-large]  overflow-hidden mt-[0.8125rem] mb-[1.125rem]">
            <ion-img v-show="imgUrl" :src="imgUrl" @click="onImgClick"></ion-img>
        </div>
        <ion-input
            class="redeemSearch h-[2.625rem] min-h-[2.625rem] mb-[1.6875rem] rounded-[--rounded-large] border-[0.0625rem] border-[--color-border-input] "
            ref="inputRef" :placeholder="t('activity.redeem1')"  v-model.trim="redeemCode"
            type="text" :minlength="5" :maxlength="12" @ionInput="inputHandle">
            <ion-button fill="clear" slot="end" aria-label="Show/hide" v-show="redeemCode.length" @click='clearHandle'>
                <ion-icon slot="icon-only" :icon="closeCircle" aria-hidden="true"
                    class=" w-[1.125rem] h-[1.125rem] text-[--color-text-second]"></ion-icon>
            </ion-button>
        </ion-input>
        <div class="flex flex-col justify-end h-[3rem] mb-[2.9688rem]" @contextmenu="forbidContextmenu">
            <div class="btn   rounded-[0.875rem] overflow-hidden h-[3rem]">
                <Button @click="redemptionHandle" height="3rem" background="transpant">{{ $t('activity.redeem2')}}</Button>
            </div>
        </div>
        <PartView :gamePlatform="false" :paymentPlatform="false"></PartView>
        <div class="rule-text text-xs pt-[1.875rem] mb-10">
            <p class="keep-space">{{ description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonImg, IonInput, IonIcon, IonButton } from '@ionic/vue';
import { closeCircle } from 'ionicons/icons';
import Button from '@/components/second/Button/index.vue'
import useLogic from '../logic';
import PartView from '@/views/tabbar/tabs/inicio/components/PartView/first/index.vue';

defineOptions({
    inheritAttrs: false
})

const {
    inputRef,
    redeemCode,
    imgUrl,
    redemptionHandle,
    t,
    onImgClick,
    inputHandle,
    clearHandle,
    description,
    forbidContextmenu
} = useLogic();

</script>

<style scoped>
.rule-text {
    color: var(--color-activity-rule);
}

ion-input.redeemSearch {
    --padding-start: 0.75rem !important;
    --border-width: 0.0625rem;
    --border-radius: 0.25rem;
    --color: var(--color-text-first);
    --placeholder-color: var(--color-text-second);
    min-height: 2.625rem !important;
    font-size: 0.875rem;
    box-shadow: none;
    overflow: hidden;
    --background: var(--color-bg-fifth);
}

.btn {
    background: var(--color-gradients-btn);
    box-shadow: var(--color-shadow-bottom-btn);
}

.btn:active {
    background: var(--color-gradients-btn);
    box-shadow: none;
    height: 2.8rem;
}

ion-input.redeemSearch.ion-invalid {
    border-color: var(--color-danger) !important;
}
.rule-text {
    color: var(--color-text-second);
}
</style>
