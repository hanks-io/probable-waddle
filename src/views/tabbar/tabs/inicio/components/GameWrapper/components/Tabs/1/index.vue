<template>
  <ion-segment mode="md" :scrollable="true" v-model="tabValue" @ionChange="tabChange">
    <ion-segment-button v-for="item in tabs" :value="item.key" :key="item.key" class="btn">
      <ion-label>{{
        item.label
      }}</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>


<script setup lang="ts">
  import {
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
  } from "@ionic/vue";
  import useLogic from "@/views/tabbar/tabs/inicio/components/GameWrapper/components/Tabs/logic";

  const props = defineProps({
    platformId: {
      type: String,
      required: true,
    },
  });

  const emits = defineEmits(["tabChange"]);

  const { tabs, tabValue, tabChange } = useLogic(props, emits);
</script>

<style scoped lang="less">
@import './index.less';
</style>
