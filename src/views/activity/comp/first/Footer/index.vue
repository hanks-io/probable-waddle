<template>
    <div class="footer ">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
</script>
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
.new-skin-symbol {
    .footer {
        background-color: var(--ep-color-background-fill-surface-raised-L1);
        box-shadow: 0rem 0.0313rem 0rem 0rem var(--ep-color-border-default) inset;
    }
}
</style>
