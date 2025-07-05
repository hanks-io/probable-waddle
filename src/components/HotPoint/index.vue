<script setup lang="ts">

 withDefaults(defineProps<{
    isShow: boolean | number
    classNames: string,
    size?: string ,
    count?: number
}
>(), {
    isShow: false,
    size: '0.4375rem'

});
</script>
<template>
    <p class="red-point absolute  bg-[#FF0000] text-center rounded-full" :class="classNames"
        v-show="isShow">
          <span v-if="count && count > 0 ">{{ `${count > 99 ? `+${count}` : count  }`  }}</span>
        </p>
</template>

<style scoped lang="less">
   /* animation: breathing 3s infinite; */
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
