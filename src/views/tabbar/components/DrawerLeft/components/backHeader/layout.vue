<template>
  <slot v-bind="$attrs" :logo="appLogo" />
</template>

<script setup lang="ts">
import useLogic from './logic'

const { appLogo } = useLogic()
</script>
