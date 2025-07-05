<!-- 提示弹窗 -->
<template>
    <div class="tooltip-box">
        <div class="tooltip-box__content">
        <slot></slot>
        </div>
    </div>
    <ion-modal class="tooltip-box" :isOpen="isOpen" >
        <div class="title text-center mt-3">
            <p class="text-base">{{$t('main.tips') }}</p>
        </div>
        <div class="content text-[0.8125rem] text-center">
            <p>{{ props.content }}</p>
        </div>
        <div class="footer my-2 text-center">
            <ion-button class="btn" @click="onConfirm">{{ $t('activity.redPacket10') }}</ion-button>
        </div>
    </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonButton } from '@ionic/vue';
import { ref, watchEffect } from 'vue';

const isOpen = ref(false);

interface Props {
    modalIsOpen?: boolean;
    title?: string;
    content?: string;
    confirmText?: string;
    confirm?: (() => void) | null;
}

const props = withDefaults(defineProps<Props>(), {
    modalIsOpen: false,
    title: '提示',
    content: '',
    confirmText: '确定',
    confirm: null,
});

watchEffect(()=>{
    isOpen.value = props.modalIsOpen;
})

function onConfirm() {
    if (props.confirm && typeof props.confirm === 'function') {
        props.confirm();
    }
    else {
        isOpen.value = false;
    }
};

</script>

<style scoped>

ion-modal {
    --width: 19.375rem;
    --height: 10rem;
    --background: rgba(9,15,31,1);
    --border-radius: 15px;
}

ion-button {
    --background: #FBA531;
    --color: #FFF;
    --border-radius: 5px;
    min-height: 35px;
}

ion-button::part(native) {
  width: 110px;
  height: 35px;
}

</style>
