<template>
  <slot v-bind="$attrs" :handleClick="jumpTo"/>
</template>

<script setup lang="ts">
import useLogic from './logic';

const {
  jumpTo
} = useLogic()

</script>

