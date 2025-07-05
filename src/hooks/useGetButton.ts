
import ButtonFirst from "@/components/first/Button/index.vue";
import ButtonSecond from "@/components/second/Button/index.vue";
import { getTheme } from "@/theme/hooks";
import { Component } from "vue";

/**
 * @description 根据当前的版面获取Button组件
 * @returns Button组件
 */
export default function useGetButton(): Component {
  const { skin } = getTheme();
  return skin === "second" ? ButtonSecond : ButtonFirst;
}
