<script setup lang="ts">
import { IonBadge, IonIcon } from '@ionic/vue'
withDefaults(defineProps<{
    isShow: boolean | number
    classNames?: string,
    size?: string,
    count?: number
}
>(), {
    isShow: false,
    size: '0.4375rem'

});
</script>
<template>
    <component v-show="isShow" :is="count ? IonBadge : IonIcon" :class="[count ? 'badge-cp' : 'point-cp', classNames, $attrs.class]" mode="ios"
        src="/first/svg/ripple-point.svg">
        {{ count ? count : '' }}
    </component>
</template>

<style scoped lang="less">
/* animation: breathing 3s infinite; */
.point-cp {
    position: absolute;
    z-index: 100;
    /* color也可以通过class或classNames传入 */
    color: var(--color-danger, red);
    font-size: v-bind("$props.size");
}
.badge-cp {
    /* --background也可以通过class或classNames传入 */
    --background: var(--color-danger, red);
    font-size: v-bind("$props.size");
}
@keyframes breathing {
    0% {
        opacity: 0.5;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.2);
    }

    100% {
        opacity: 0.5;
        transform: scale(1);
    }
}
</style>
