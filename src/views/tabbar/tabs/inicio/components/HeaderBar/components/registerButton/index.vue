<template>
  <div class="register-btn-warper">
    <CButton 
      v-bind="$attrs"
      @click="showLogin('register')"
      :class="props.class"
    >{{ $t("main.signUp") }}
    </CButton>
    <RewardTag class="rewardTag"></RewardTag>
  </div>
</template>

<script setup lang="ts">
import CButton from '@/views/tabbar/tabs/inicio/components/button/index.vue';
import RewardTag from "@/components/registerReward/RewardTag.vue"
import { showLogin } from '@/hooks/ShowLogin';

const props = defineProps({
  class: {
    type: String,
    default: '',
  }
})

</script>

<style scoped lang="less">
.register-btn-warper {
  display: flex;
  align-items: center;
  position: relative;

  .rewardTag {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }
}
</style>