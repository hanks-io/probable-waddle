<script setup lang="ts">
import {
    IonItem,
    IonSpinner,
    IonButton,
} from "@ionic/vue";

import VButton from './AmberPurpleBtn.vue';
import { getTheme } from '@/theme/hooks'
const { theme, skin } = getTheme()
const emit = defineEmits<{

    (e: 'submit', event: CustomEvent): void
}>()
defineProps<{
    btnText: string,
    loading?: boolean
}
>()
const submit = (event: CustomEvent) => {
    emit('submit', event)
}
</script>
<template>
    <div v-if="theme === 'amber-purple'" class="submit-btn-warp">
        <VButton mode="md" class="flex-1 text-white" shape="round" @click="submit" :suffixLoading="loading">
            <button class="w-full h-full"> {{ btnText }}</button>
        </VButton>
    </div>

    <ion-item class="submit  drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)]" lines="none" v-else>
        <ion-button class="" mode="md" size="default" fill="clear" @click="submit">
            <ion-spinner class="z-10 w-5 h-5" slot="start" name="bubbles" v-if="loading" />
            {{ btnText }}
        </ion-button>
    </ion-item>


</template>

<style scoped lang="less">
ion-item.submit {
    --min-height: 0;
    --background: var(--theme-color-gradient-100);
    --border-radius: 10px;
    margin: 1.25rem auto 0;
    width: 17.5rem;
    font-size: var(--font-size-16);
    --tw-drop-shadow: drop-shadow(var(--drop-shadow-submit));
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

ion-item.submit ion-button {
    width: 100%;
    min-height: 2.5rem;
    --border-radius: 10px;
    font-size: var(--font-size-16);
    color: var(--color-text-white-100)
}

ion-button {
    text-transform: none;
    /* 取消按钮文本自动大写 */
}

.submit-btn-warp {
    width: 17.5rem;
    margin: 1.25rem auto 0;
}

.auroral-yellow {
    ion-item.submit {
        --background: var(--theme-color-800);
    }

    ion-item.submit ion-button {
        color: var(--color-text-black-100)
    }

}
</style>
