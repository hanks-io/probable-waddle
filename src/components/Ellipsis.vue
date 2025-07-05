<script setup lang="ts">
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
const emit = defineEmits([])
defineProps<{
  textContent: string
}
>()
const isCollapse = ref(true)  //   是否展开
const handleClick = () => {
  isCollapse.value =!isCollapse.value
}
</script>
<template>
  <div class="ellipsis-wrap flex-between">
    <p :class="[{ellipsis: isCollapse}, 'mr-0.5']">{{ textContent }}</p>
  
      <ion-icon  :src="!isCollapse ? chevronUpOutline : chevronDownOutline"
      @click="handleClick" />
   


  </div>
</template>

<style scoped lang="less">
.ellipsis-wrap {
  width: 100%;
  font-size: .75rem;
  line-height: 1.125rem;
  min-height: 1.125rem;
  align-items: flex-start !important;

  .ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  p {
    width: 95%;

  }
  ion-icon{
     cursor: pointer;
     font-size: var(--font-size-12);
  }
}
</style>
