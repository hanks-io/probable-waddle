<script setup lang="ts">
import HotPoint from '@/components/HotPoint/ripplePoint.vue';
import { ZTActivityTypes } from '@/enums/types/activity.type';
import { formatToDateTime } from '@/utils/date';
import { IonIcon, IonImg, IonItem, IonLabel } from '@ionic/vue';
import { timeOutline } from 'ionicons/icons';
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
  <div :class="$attrs.class" :style="$attrs.style">
    <template v-for="item in activityList">
      <div v-if="sideValue == item.category" :key="item.id" @click="navigation(item)">
        <div class="activity-wrap">
          <div class="rounded-top" :style="`background: url(${item.bannerBackground}) center/cover`">
            <ion-item :class="{ shiny: redPointList.find(it => Number(it?.id) === Number(item.id))?.redPoint }">
              <div v-if="item.previewText && item.type != ZTActivityTypes.enum.Custom" class="intro-text" slot="start">
                <p v-for="(text, index) in (item.previewText.split('\n'))" :key="index">
                  {{ text }}
                </p>
              </div>
              <ion-img v-if="item.previewText" slot="end" :src="item.bannerLogo"/>
            </ion-item>
            <HotPoint v-show="redPointList.find(it => Number(it?.id) === Number(item.id))?.redPoint" class="hotPoint" size="0.6rem"/>
          </div>
          <div class="activity-bottom">
            <div class="activity-bottom-content">
              <div class="activity-info-details">
                <p class="activity-name">{{ item.name }}</p>
                <div v-show="!isActivityForever(item.endTime)" class="activity-time">
                  <ion-icon :icon="timeOutline"></ion-icon>
                  <span class="end-time">
                    {{ $t('viewsActivity.activityList01') }}{{ formatToDateTime(item.endTime) }}
                  </span>
                </div>
              </div>
              <div class="in-progress" :class="getActivityStatusColor(item.status)">
                {{ getActivityStatus(item.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>    
  <!-- 空列表提示 -->
  <div class="empty-tip" v-if="isShowEmpty">
    <ion-img src="/icons/No_record.png" />
    <ion-label color="medium">{{ $t('label.noRecord') }}</ion-label>
  </div>
</template>

<style scoped lang="less">

.activity-wrap {
  margin-bottom: 0.625rem;
  position: relative;
  .rounded-top {
    border-radius: var(--ep-border-radius-m, var(--rounded-middle)) var(--ep-border-radius-m, var(--rounded-middle)) 0 0;
    .intro-text {
      min-width: 10rem;
      max-width: 13rem;
      padding-left: 0.875rem;
      margin-inline-end: 0px;
      p {
        color: var(--color-activity-intro);
        font-size: 0.875rem;
        line-height: 1.3;
        font-weight: var(--ep-font-weight-bold, var(--font-weight-medium));
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    }
    ion-img {
      width: 6.25rem;
      height: 6.25rem;
      margin-inline-start: 0px;
      margin-top: 0.625rem /* 10px */;
      margin-right: 1.25rem /* 20px */;
      border-radius: var(--ep-border-radius-m, var(--rounded-middle));
    }
    .hotPoint {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(45%, -45%);
    }
  }
  .activity-bottom{
    .flex-center();
    width: 100%;
    height: 3.625rem;
    background-color: var(--ep-color-background-fill-surface-lowered, var(--color-bg-400));
    border-radius: 0 0 var(--ep-border-radius-m, var(--rounded-middle)) var(--ep-border-radius-m, var(--rounded-middle));
    .activity-bottom-content{
      .flex-between();
      width: 100%;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      .activity-info-details {
        display: flex;
        flex-direction: column;
        .activity-name {
          font-size: var(--ep-font-size-m, 0.875rem);
          line-height: 1.5;
          color: var(--ep-color-text-default, var(--color-activity-name));
          font-weight: var(--ep-font-weight-medium, 500);
        }
        .activity-time {
          color: var(--ep-color-text-weaker, var(--color-activity-name));
          .flexBox();
          ion-icon {
            font-size: var(--ep-font-size-s, 0.75rem);
            line-height: 1.5;
          }
          .end-time {
            font-size: var(--ep-font-size-s, 0.75rem);
            line-height: 1.5;
            text-align: left;
            margin-left: 0.25rem /* 4px */;
          }
        }
      }
      .in-progress {
        width: 6rem;
        height: 2rem;
        flex: none;
        background-color: var(--ep-color-background-fill-surface-raised-L1, var(--color-bg-200));
        text-align: center;
        font-size: var(--ep-font-size-s, 0.75rem);
        line-height: 2rem;
        font-weight: var(--ep-font-weight-medium, var(--font-weight-medium));
        border-radius: var(--ep-border-radius-s, var(--rounded-small));
      }
    }
  }
}

.empty-tip {
  .flex-center();
  flex-direction: column;
  ion-img {
    width: 7.5rem;
    margin-top: 9rem;
  }
}

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
