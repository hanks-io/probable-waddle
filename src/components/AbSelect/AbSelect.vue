<script setup lang="ts" name="AbSelect">
import { IonSelect, IonSelectOption } from "@ionic/vue";
import { computed } from "vue";
import { useVModel } from "@vueuse/core";
import { GameTypes } from "@/enums/types";

// 选项类型定义
type SelectOption = string | {
  value: any;
  title: any;
};


interface Props {
  /** 当前选中的游戏类型 */
  modelValue: string;
  /** 是否显示"全部"选项 */
  showAll?: boolean;
  /**
   * 自定义选项列表，支持两种格式：
   * 1. 字符串数组: ['ELECTRONIC', 'CHESS', 'FISHING']
   * 2. 对象数组: [{value: 'ELECTRONIC', title: 'sort.ELECTRONIC'}, {value: 'CHESS', title: 'sort.CHESS'}]
   * 如果不提供则使用默认的游戏类型列表
   */
  options?: SelectOption[];
  /** 占位符文本 */
  placeholder?: string;
  /** 标签国际化key前缀，用于生成选项显示文本，默认为 'sort' */
  labelKey?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 接口类型 */
  interface?: "popover" | "action-sheet" | "alert";
  /** 模式 */
  mode?: "ios" | "md";
  /** 标签位置 */
  labelPlacement?: "stacked" | "floating" | "fixed";
  /** 自定义 CSS 类名，用于样式定制 */
  customClass?: string;
  /** 接口选项，可以传递给 ion-popover、ion-alert 等组件 */
  interfaceOptions?: any;
}

const props = withDefaults(defineProps<Props>(), {
  showAll: true,
  placeholder: "label.gameType",
  labelKey: "sort",
  disabled: false,
  interface: "popover",
  mode: "md",
  labelPlacement: "stacked",
  customClass: "ab-select-interface"
});

// 使用useVModel处理modelValue属性
const emit = defineEmits(["update:modelValue", "change"]);
const modelValue = useVModel(props, "modelValue", emit);

/**
 * 计算选项列表
 * 如果提供了自定义选项，则使用自定义选项
 * 否则使用默认的游戏类型列表
 */
const optionList = computed(() => {
  const baseOptions = props.options || GameTypes;
  return props.showAll ? ["ALL", ...baseOptions] : baseOptions;
});

/**
 * 计算接口选项
 * 合并用户传入的 interfaceOptions 和默认的 cssClass
 */
const computedInterfaceOptions = computed(() => {
  const defaultOptions = {
    cssClass: props.customClass
  };

  // 如果用户传入了 interfaceOptions，则合并
  if (props.interfaceOptions) {
    return {
      ...defaultOptions,
      ...props.interfaceOptions,
      // 如果用户也指定了 cssClass，则合并类名
      cssClass: props.interfaceOptions.cssClass
        ? `${defaultOptions.cssClass} ${props.interfaceOptions.cssClass}`
        : defaultOptions.cssClass
    };
  }

  return defaultOptions;
});

/**
 * 处理选择变化
 * 修复：确保 v-model 双向绑定正常工作
 */
const handleChange = (event: CustomEvent) => {
  modelValue.value = event.detail.value;
  emit("change", event);
};

console.warn("abselect");
</script>

<template>
  <ion-select class="ab-select" :interface="interface" :mode="mode" :value="modelValue"
              :label-placement="labelPlacement" :placeholder="$t(placeholder)" :disabled="disabled"
              :interface-options="computedInterfaceOptions" @click.stop @ionChange="handleChange">
    <ion-select-option v-for="(item, index) in optionList" :key="index"
                       :value="typeof item === 'string' ? item : item.value">
      {{ $t(typeof item === "string" ? `${labelKey}.${item}` : item.title) }}
    </ion-select-option>
  </ion-select>
</template>

<style lang="less">
ion-select {
  &.ab-select {
    --highlight-color: var(--ep-color-text-selected);
  }
}

// 通过自定义类名来控制 ion-popover 样式
.ab-select-interface {

  .popover-viewport {
    overflow: hidden;

    border-radius: var(--ep-border-radius-m, 0.375rem);
    border: 1px solid var(--ep-color-border-default);

    ion-list {
      background: var(--ep-color-background-fill-surface-raised-L1);

      ion-radio-group {
        ion-item {
          color: var(--ep-color-text-default);
          text-align: center;

          font-size: var(--ep-font-size-s, 12px);
          font-weight: var(--ep-font-weight-bold, var(--font-weight-bold));
          line-height: 150%;

          &.item-radio-checked {
            --background: var(--ep-color-background-fill-surface-raised-L2);
          }

          &:not(.item-radio-checked) {
            --background: var(--ep-color-background-fill-surface-raised-L1);
            color: var(--ep-color-text-weaker);
          }

          // 长按之后
          &.ion-activated {
            ion-radio {
              color: var(--ep-color-text-default);
            }
          }
        }
      }
    }
  }


}
</style>

