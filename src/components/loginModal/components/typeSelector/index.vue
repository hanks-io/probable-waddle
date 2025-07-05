<!-- 登录注册方式选择器 -->
<template>
  <div v-if="showSelector" class="warpper">
    <ion-segment mode="ios" :value="modelValue" @ionChange="onSegmentChange">
      <ion-segment-button v-for="type in optionTypes" :value="type" :key="type" @click="clickButton">
        <ion-label>{{ $t(`label.${type.toLowerCase()}`) }}</ion-label>
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script setup lang="ts">
import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/vue";
import { OperationType } from "@/enums/common";

const emits = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: any;
  type: OperationType;
}>();

const tenantStore = useTenantStore();

const optionTypes = computed(() => {
  if (props.type === OperationType.Login) {
    return tenantStore.getLoginTypes();
  }
  else if (props.type === OperationType.Register) {
    return tenantStore.getRegisterTypes();
  }
  return [];
});
const showSelector = computed(() => optionTypes.value.length > 1)

const onSegmentChange = (e: CustomEvent) => {
  emits('update:modelValue', e.detail.value);
}

const clickButton = (e: CustomEvent) => {
  // ionChange没有触发，所以改为手动触发
  const value = e.target?.value;
  if (props.modelValue !== value) {
    emits('update:modelValue', value);
  }
}

</script>

<style scoped lang="less">
@import "@/components/loginModal/styles/typeSelector/index-base.less";
@import "@/components/loginModal/styles/typeSelector/theme-style.less";

.yellow-dark {
  #components-loginModal-components-typeSelector-index.style();
}

.green-dark {
  #components-loginModal-components-typeSelector-index.style(var(--color-bg-400);
  );
}

.purple-light {
  #components-loginModal-components-typeSelector-index.style(var(--color-bg-400);
    var(--theme-color-800);
    var(--text-color-black-80);
    var(--text-color-white-100);
  );
}

.forest-green,
.green-default,
.green-v01,
.green-v02 {
  #components-loginModal-components-typeSelector-index.style(var(--color-bg-300);
    var(--color-bg-50);
    var(--color-text-gray-100);
    var(--color-text-gray-100);
    0.25rem;
  );
}

.blue-default {
  #components-loginModal-components-typeSelector-index.style(#070B18;
    var(--color-bg-50);
    var(--text-color-white-80);
    var(--theme-color-500);
    0.25rem;
  );
}

.auroral-yellow {
  #components-loginModal-components-typeSelector-index.style(#070B18;
    var(--color-bg-100);
    var(--text-color-white-80);
    var(--theme-color-800);
    0.25rem;
  );
}

.amber-purple {
  .default {
    #components-loginModal-components-typeSelector-index.style(@--theme-color-800: transparent;
      @--background-clip: text;
      @--background: var(--theme-color-gradient-100);
    );
  }
}

.amber-purple {
  #components-loginModal-components-typeSelector-index.style(var(--color-bg-300);
    var(--color-bg-100);
    var(--color-text-title-basic);
    var(--color-text-title-basic);
    0.25rem;
  );
}

// new skin defult
#components-loginModal-components-typeSelector-index.style(
  @--color-bg-300: var(--ep-color-background-fill-surface-lowered);
  @--color-bg-100: var(--ep-color-background-fill-surface-raised-L2);
  @--text-color-white-40: var(--ep-color-text-weaker);
  @--theme-color-800: var(--ep-color-text-selected);
  @--border-radius: var(--ep-border-radius-m);
  @--font-weight-bold: var(--ep-font-weight-bold);
);

</style>
