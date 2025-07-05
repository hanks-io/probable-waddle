<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
const props = withDefaults(defineProps<{
    size: string,
}
>(), {
    size: '0.4375rem'
});

const fontSize = computed(() => {
    // 圆点为svg的r * 2 / 100
    const size = props.size;
    const str = size.match(/\d+(\.\d+)?/g)?.[0];
    const num = Number(str);
    if (isNaN(num)) {
        return size
    }
    const unit = size.slice(str!.length)
    return (num / 0.3) + unit
})
</script>
<template>
    <ion-icon class="point-cp" v-bind="$attrs" mode="ios"
        src="/first/svg/ripple-point.svg" />
</template>

<style scoped lang="less">
.point-cp {
    position: absolute;
    z-index: 100;
    /* color也可以通过class或classNames传入 */
    color: var(--color-danger, red);
    font-size: v-bind("fontSize");
}
</style>
