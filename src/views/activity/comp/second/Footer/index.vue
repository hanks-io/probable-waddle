<script setup lang="ts">
</script>
<template>
    <div class="footer ">
        <slot></slot>
    </div>
</template>

<style scoped lang="less">
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: var(--color-activity-footer-bg);
    box-shadow: 0px 0.5px 0px 0px var(--color-border) inset;
    width: 100%;
    height: 5rem;
    margin: 0 auto;
    padding: 1.25rem 0.75rem;
    :slotted(.btn ){
        width: 17.5rem;
        margin: 0 auto;
    }
}
</style>
