<script setup lang="ts">
 withDefaults(defineProps<{
    isShow: boolean
    btnText?: string
}
>(), {
    isShow: false,

});
</script>
<template>
    <div class="receive-btn" v-if="isShow">{{ btnText ?? $t("activity.receiveBtnText") }}</div>

</template>

<style scoped>
.receive-btn {
    min-width: 3.125rem;
    height: 1rem;
    padding: .125rem .3125rem;
    border-radius: 1rem;
    background: linear-gradient(180deg, #FF0900 24.04%, #990600 87.5%);
    border: 1px solid #FBA805;
    line-height: .75rem;
    font-size: .625rem;
    box-sizing: border-box;
    color: #fff;
    font-weight: 400;
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    text-align: right;
    z-index: 100;


}
</style>
