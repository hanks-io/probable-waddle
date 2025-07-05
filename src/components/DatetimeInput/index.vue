<script setup lang="ts">
import { IonDatetime, IonIcon, IonPopover } from '@ionic/vue';
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
const props = withDefaults(defineProps<{
  timeFormat?: string,
  datetimeId: string
}>(), {
  timeFormat: 'YYYY-MM-DD',

});
const emits = defineEmits<{
  (e: 'update:datetime', datetime: string): void
  (e: 'datetimeChange', datetime: string): void

}>()
const { locale } = useI18n()
const datetime = defineModel<string>('datetime', { required: true })
const showPopover = ref<boolean>(false)
const currentDatetime = ref<string>(datetime.value)
const popoverDismiss = () => {
  showPopover.value = false;
}

const dateChange = (e: CustomEvent) => {
  currentDatetime.value = e.detail.value
  emits('update:datetime', currentDatetime.value)
  emits('datetimeChange', currentDatetime.value)

}

const formatDate = computed(() => {
  return dayjs(currentDatetime.value).format(props.timeFormat)
})


watch(() => datetime.value, (newVal) => {
  currentDatetime.value = newVal
}, { immediate: true })


</script>

<template>
  <div :id="datetimeId" :class="['calendar-area']">
    <div> {{ formatDate }}</div>
    <ion-icon class="before-icon" slot="start" src="/svg/login/calendar.svg" />
  </div>

  <ion-popover mode="md" :trigger="datetimeId" trigger-action="click" :isOpen="showPopover" :showBackdrop="false"
    @didDismiss="popoverDismiss">
    <ion-datetime presentation="date" mode="ios" :value="currentDatetime" :show-default-buttons="true"
      :cancel-text="$t('main.cancel')" :done-text="$t('mlmAgent.btnDone')" :locale="locale" @ionChange="dateChange" />
  </ion-popover>
</template>

<style scoped lang="less">
#date-time-input-comp {

  .style(@bg: --ep-color-background-fill-surface-lowered,
    @borderColor: --ep-color-border-default,
    @color: --ep-color-text-default,
    @ionDatetimeBg: --ep-color-background-fill-surface-raised-L2,
    @ionDatetimeColor: --ep-color-text-weak,
    @ionDatetimeHighlightBg: --ep-color-background-fill-active-primary,
    @calendarColor: --ep-color-text-inverse,
    @activeBg: --ep-color-background-fill-active-primary,
    @beforeIconColor: --ep-color-icon-weaker,
  ) {
    .calendar-area {
      background: var(@bg);
      border: 1px solid var(@borderColor);
      color: var(@color);
      border-radius: var(--ep-border-radius-m, .375rem);
      padding: .5rem .3125rem;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--ep-font-size-s, .75rem);

      .before-icon {
        font-size: var(--ep-font-size-xxl, 1.5rem);
        color: var(@beforeIconColor);
      }
    }

    ion-datetime {
      --background: var(@ionDatetimeBg);
      color: var(@ionDatetimeColor);
      --wheel-highlight-background: var(@ionDatetimeHighlightBg);

      &::part(calendar-day active) {
        color: var(@calendarColor);
        background: var(@activeBg);
      }

      &::part(month-year-button) {
        --color: var(@activeBg);
      }
    }
  }
}

.new-skin-symbol {
  #date-time-input-comp.style();
}

.purple-light,
.green-dark,
.yellow-dark,
.amber-purple,
.blue-default,
.forest-green,
.auroral-yellow,
.green-default {
  #date-time-input-comp.style(@bg: --color-bg-400,
    @borderColor: --line-color,
    @color: --color-text-100,
    @ionDatetimeBg: --color-bg-100,
    @ionDatetimeColor: --color-text-40,
    @ionDatetimeHighlightBg: --color-primary-800,
    @calendarColor: --agent-btn-color,
    @activeBg: --color-primary-800,
    @beforeIconColor: --color-text-40,
  );
}
</style>
