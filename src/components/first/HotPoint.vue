<script setup lang="ts">

 withDefaults(defineProps<{
    isShow: boolean | number
    classNames: string,
    size?: string ,
    count?: number
}
>(), {
    isShow: false,
    size: '0.4rem'

});
</script>
<template>
    <div v-show="isShow" class="absolute bg-white bg-opacity-20 w-6 h-6 rounded-small flex-center" :class="classNames">
        <div class="red-point animation bg-[#D74141] rounded-full" >
                <span v-if="count && count > 0 ">{{ `${count > 99 ? `+${count}` : count  }`  }}</span>
        </div>
    </div>
</template>

<style scoped lang="less">
.animation {
    animation: breathing 1s infinite;
}
.red-point {
    width: v-bind("$props.size");
    height: v-bind("$props.size");
    z-index: 100;
    text-align: center;
    font-size: .625rem;
    line-height: v-bind("$props.size");
    span{
        color: #fff
    }
}

@keyframes breathing {
    0% {
        outline: 0px solid rgba(215, 65, 65, 0);
    }

    25% {
        outline: 1.6px solid rgba(215, 65, 65, 0.075);
    }

    50% {
        outline: 3.2px solid rgba(215, 65, 65, 0.15);
    }

    75% {
        outline: 4.8px solid rgba(215, 65, 65, 0.275);
    }

    100% {
        outline: 6.4px solid rgba(215, 65, 65, 0.3);
    }
}
</style>
