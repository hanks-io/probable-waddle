<template>
  <slot v-bind="$attrs" :gamePartnerPic="gamePartnerPic" />
</template>

<script setup lang="ts">
import useGamePlatformLogic from './logic';

const { gamePartnerPic } = useGamePlatformLogic();
</script>