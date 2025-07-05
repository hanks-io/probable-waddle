<script setup lang="ts">
import { IonLabel, IonImg, IonItem } from '@ionic/vue';
import { ZTActivityTypes } from '@/enums/types/activity.type'
import HotPoint from '@/components/HotPoint/index.vue'
import useActivityListLogic from '../activityListLogic';

defineOptions({
    inheritAttrs: false
})
const props = defineProps<{
    sideValue: any
}>();

const emit = defineEmits<{
    (e: 'navigation', item: any): void
}>()

const { activityList, redPointList, isShowEmpty, navigation } = useActivityListLogic({props, emit})

</script>
<template>
    <div :class="$attrs.class" :style="$attrs.style">
        <template v-for="item in activityList">
            <div class="mb-2.5 rounded-[.625rem] relative" v-if="sideValue == item.category"
                :style="`background: url(${item.bannerBackground}) center/cover`" :key="item.id" @click="navigation(item)">
                <ion-item :class="{ shiny: redPointList.find(it => Number(it?.id) === Number(item.id))?.redPoint }">
                    <div class="text-[--color-text-btn-basic] me-0 w-40 pl-3.5 " slot="start" v-if="item.previewText">
                        <p class="text-base mb-2.5 line-clamp-1">{{ item.name }}</p>
                        <p :class="item.type === ZTActivityTypes.enum.Custom ? 'opacity-0' : 'opacity-100'"
                            v-for="(text, index) in (item.previewText.split('\n'))" :key="index"
                            class="text-xs line-clamp-3">
                            {{ text }}
                        </p>
                    </div>
                    <ion-img class="h-[6.25rem] mt-2.5 ms-0 mr-5" slot="end" :src="item.bannerLogo"
                        v-if="item.previewText" />
                </ion-item>
                <HotPoint :isShow="redPointList.find(it => Number(it?.id) === Number(item.id))?.redPoint"
                    classNames="top-0 right-0 -translate-y-1/4 translate-x-1/4" size=".875rem" />
            </div>
        </template>
    </div>
    <!-- 空列表提示 -->
    <div class="flex flex-col items-center justify-center" v-if="isShowEmpty">
        <ion-img class="w-[7.5rem] mt-36" src="/icons/No_record.png" />
        <ion-label color="medium">{{ $t('label.noRecord') }}</ion-label>
    </div>
</template>

<style scoped lang="less">
  // 基础公共 less
  @import "@/views/tabbar/tabs/promo/default/style/activityList/base.less";
  @import "@/views/tabbar/tabs/promo/default/style/activityList/theme-style.less";
  
  #tabbar-tabs-promo-default-activity-list.style();

  .blue-default {
    #tabbar-tabs-promo-default-activity-list.style(
      --color-text-white-100
    );
  }

  .green-default {
    #tabbar-tabs-promo-default-activity-list.style(
      --color-text-white-100
    );
  }

  .amber-purple {
    #tabbar-tabs-promo-default-activity-list.style(
      --text-color-white-100
    );
  }
</style>
