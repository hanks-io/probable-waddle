<template>
  <div class="spins-box">
    <div class="spins-times">
      {{ $t('sort.000004') }} <span class="spins-times--count">{{ roundCount }}</span>
    </div>
    <div class="spins-invite" @click="shareHandle">
      <p>{{ $t('activity.inviteFriendsWithdrawal') }}</p>
      <img :src="shareBtn" class="spins-invite--share">
    </div>
  </div>
</template>

<script setup lang="ts">
import shareBtn from '@/assets/img/activity/AssistanceCash/style18/wheel-share.svg'

const { shareHandle } = defineProps<{
  shareHandle: () => void
  roundCount: number
}>()

</script>

<style lang="less" scoped>
// .spins-box {}

@keyframes liuguang-move {
  0% {
    transform: translateX(-30%);
  }

  100% {
    transform: translateX(30%);
  }
}

.spins-box {
  margin: 4.125rem .75rem 0 .75rem;
  background: radial-gradient(60.99% 70.99% at 48.63% -35%, var(--ep-color-background-fill-glow-primary-opacity-40) 0%, rgba(0, 0, 0, 0) 90%);
  backdrop-filter: blur(0.25rem);
  border-radius: var(--ep-border-radius-xl);
  padding: 0 0.875rem 0.875rem 0.875rem;
}

.spins-times {
  font-size: var(--ep-font-size-xl);
  text-align: center;
  padding: 0.5rem 0;

  .spins-times--count {
    color: var(--ep-color-text-warning);
    font-weight: var(--ep-font-weight-bold);
  }
}

.spins-invite {
  margin-top: 0.5rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  background-color: var(--ep-accent-green);
  border-radius: var(--ep-border-radius-m);
  font-weight: var(--ep-font-weight-medium);
  font-size: var(--ep-font-size-s);
  cursor: pointer;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    left: -50%;
    top: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(-45deg,
        transparent 40%,
        rgba(255, 255, 255, 0.32) 50%,
        transparent 60%);
    animation: liuguang-move 1.5s linear infinite;
  }

  &:active {
    opacity: 0.8;
    transition: opacity 0.2s ease-in-out;
  }

  .spins-invite--share {
    width: 1rem;
    height: 1rem;
    margin-left: 0.5rem;
  }
}
</style>
