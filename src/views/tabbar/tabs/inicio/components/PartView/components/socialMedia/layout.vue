<template>
  <slot v-bind="$attrs" :mediaList="mediaList" :handleClick="linkHandle" />
</template>

<script setup lang="ts">
import useSocialMediaLogic from './logic';

const { mediaList, linkHandle } = useSocialMediaLogic();
const attrs = useAttrs();
</script>
