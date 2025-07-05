<script setup lang="ts">
import { IonLabel, IonImg, IonItem, IonIcon } from '@ionic/vue';
import { ZTActivityTypes } from '@/enums/types/activity.type'
import HotPoint from '@/components/HotPoint/ripplePoint.vue'
import useActivityListLogic from '../activityListLogic';
import { timeOutline } from 'ionicons/icons'
import { formatToDateTime } from '@/utils/date'

defineOptions({
    inheritAttrs: false
})
const props = defineProps<{
    sideValue: any
}>();

const emit = defineEmits<{
    (e: 'navigation', item: any): void
}>()

const { 
    activityList, 
    redPointList, 
    isShowEmpty, 
    navigation, 
    isActivityForever,
    getActivityStatus,
    getActivityStatusColor
} = useActivityListLogic({props, emit})

</script>
<template>
    <div :class="$attrs.class" :style="$attrs.style" class=" pt-[0.625rem]">
        <template v-for="item in activityList">
            <div v-if="sideValue == item.category" :key="item.id" @click="navigation(item)">
               <div class="mb-2.5 relative">
                    <div class="rounded-top" :style="`background: url(${item.bannerBackground}) center/cover`">
                        <ion-item :class="{ shiny: redPointList.find(it => Number(it?.id) === Number(item.id))?.redPoint }">
                            <div v-if="item.previewText" class="intro-text-color me-0 w-40 pl-3.5" slot="start">
                                <p :class="item.type === ZTActivityTypes.enum.Custom ? 'opacity-0' : 'opacity-100'"
                                    v-for="(text, index) in (item.previewText.split('\n'))" :key="index"
                                    class="text-sm font-weight-medium line-clamp-3">
                                    {{ text }}
                                </p>
                            </div>
                            <ion-img v-if="item.previewText" class="h-[6.25rem] mt-2.5 ms-0 mr-5" slot="end" :src="item.bannerLogo"/>
                        </ion-item>
                        <HotPoint v-show="redPointList.find(it => Number(it?.id) === Number(item.id))?.redPoint" 
                            class="top-0 right-0 translate-x-[45%] translate-y-[-45%]" size="0.6rem"/>
                    </div>
                    <div class="w-full h-[3.625rem] bg-[--color-bg-fifth] rounded-bottom flex items-center justify-center">
                        <div class="w-full pl-[0.8438rem] pr-[0.5rem] flex flex-row items-center justify-between">
                            <div class="flex flex-col">
                                <p class="text-sm name-text-color leading-[1.3125rem]  mb-[0.0919rem] text-left  font-[--font-weight-semibold]">{{ item.name }}</p>
                                <div v-show="!isActivityForever(item.endTime)" class="flex items-center text-[--color-text-second] justify-start">
                                    <ion-icon :icon="timeOutline" class="text-xs  w-[1rem] h-[1rem] "></ion-icon>
                                    <span class="text-xs  text-left ml-[0.1406rem] left-[1.125rem]">
                                    {{ $t('viewsActivity.activityList01') }}   {{ formatToDateTime(item.endTime) }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex-none name-text-color bg-[--color-bg-third] w-[6.1875rem] h-[2rem] text-xs text-center font-[--font-weight-semibold]  leading-8  rounded"
                            :class="getActivityStatusColor(item.status)">
                                {{ getActivityStatus(item.status) }}
                            </div>
                        </div>
                    </div>
               </div>
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
ion-item.shiny {
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        animation: shiny 6s ease-in-out infinite;
        background: white;
        display: inline-block;
        height: 100%;
        left: 0;
        position: absolute;
        top: -180px;
        width: 30px;
        z-index: 100
    }
}

ion-content#main {
    --padding-start: 15px;
    --padding-end: 15px;
    --padding-top: 10px;
}

ion-content#main ion-item {
    --background: transparent;
    --inner-padding-end: 0px;
    --border-radius: 10px;
    --padding-start: 15px;
    --padding-end: 15px;
    --padding-top: 0;
    --padding-bottom: 0;
    --inner-border-width: 0px;
    --min-height: 7.5rem;
    --height: 7.5rem;
    --max-height: 7.5rem;
}

.rounded-top {
    border-radius: var(--rounded-large) var(--rounded-large) 0 0
}

.rounded-bottom {
    border-radius: 0 0 var(--rounded-large) var(--rounded-large)
}

.intro-text-color {
    color: var(--color-primary-btn-text-active);
}

.name-text-color {
    color: var(--color-text-first);
}
@keyframes shiny {
    0% {
        opacity: 0;
        transform: scale(0) rotate(45deg);
    }

    50% {
        opacity: 0.3;
        transform: scale(0) rotate(45deg);
    }

    81% {
        opacity: 0.6;
        transform: scale(4) rotate(45deg);
    }

    100% {
        opacity: 0;
        transform: scale(50) rotate(45deg);
    }
}
</style>
