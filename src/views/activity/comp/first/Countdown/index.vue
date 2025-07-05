<script setup lang="ts">
import { Time } from '@/utils/date'
import useCountDownLogic from '../../countdownLogic';

const emit = defineEmits(["updateTime"])
const props = withDefaults(defineProps<{
    issueEndTime: Time | null
}
>(), {});

const { timeRef } = useCountDownLogic({props, emit})
</script>

<template>
    <div class="countdown-wrap">
        <div class="item" v-for="it in timeRef">
            <p class="digit">{{ it.digit }}</p>
            <p class="unit">{{ $t(`date.${it.unit}`) }}</p>
        </div>
    </div>
</template>

<style scoped lang="less">
.countdown-wrap {
    display: flex;
    text-align: center;
    position: absolute;
    top: 1.25rem;
    left: .625rem;
    font-size: .75rem;
    .item {
        width: 2.1875rem;
        height: 1.875rem;
        background: url('/svg/activity/countdown_bg.svg') no-repeat center center;
        background-size: cover;
        box-sizing: border-box;
        border-radius: .3125rem;
        padding-top: .25rem;

        .digit {
            box-sizing: border-box;
            font-weight: 700;
            line-height: .875rem;
            text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.30);
        }

        .unit {
            line-height: .5rem;
            font-size: .625rem;
            text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.30);
        }

        &:nth-child(2) {
            margin: 0 .375rem;
        }
    }
}
</style>
