<template>
  <ProgressiveImages v-if="paymentPlatform && paymentPartnerPic" class="payment-img" :src="paymentPartnerPic" />
</template>

<script setup lang="ts">
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import usePaymentPartnerLogic from '@/views/tabbar/tabs/inicio/components/PartView/components/paymentPartner/logic';

const props = defineProps({
  paymentPlatform: {
    type: Boolean,
    default: true,
  },
})

const { paymentPartnerPic } = usePaymentPartnerLogic();

</script>
