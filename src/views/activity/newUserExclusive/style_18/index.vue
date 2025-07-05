<!-- 新人专属活动页面 -->
<template>
  <ion-page>
    <NavigationBar :title="activityName">
      <template #start>
        <BackButton @click="closePopup" />
      </template>
    </NavigationBar>
    <ion-content :class="theme">
      <div class="bg-image" :class="mainMediaShare ? '' : 'upbg'">
        <div class="share-platform-block" v-if="mainMediaShare">
          <SharePlatformBlock />
        </div>
        <div class="padding-block"></div>
        <div class="bg-image-content">
          <lucky-grid :blocks="blocks" :prizes="prizes" :width="'20.875rem'" :height="'13rem'"
            :lucky_grid_button="lucky_grid_button" :activeStyle="activeStyle" :once="once" :endCallback="endCallback">
            <template #lucky_grid_title>
              <div class="title-container">
                <span class="title-text">{{ $t('activity.totalAmountView') }}</span>
              </div>
            </template>
            <template #lucky_grid_button>
              {{ $t('activity.mysterious05') }}
            </template>
          </lucky-grid>
        </div>
        <div class="bg-text">
          <div class="info-title">
            <InfoIcon18 beforeOrAfter="before" />
            <span class="info-title-text">{{ $t('viewsActivity.activityRules') }}</span>
            <InfoIcon18 beforeOrAfter="after" />
          </div>
          <div class="rule-content keep-space" v-if="ruleType === ZActivityRuleType?.enum.DEFAULT">
            <p class="rule-text" v-for="(item, index) in defaultRule" :key="index">
              {{ index + 1 }}. {{ item }}
            </p>
          </div>
          <p class="rule-text" v-else>
          <p v-for="(item, index) in customRule" :key="index">{{ item }}</p>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import LuckyGrid from '@/components/LuckyGrid/index.vue';
import BackButton from '@/components/BackButton.vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import {  InfoIcon18 } from '@/views/activity/newUserExclusive/components';
import { useLogic } from '@/views/activity/newUserExclusive/logic';
import SharePlatformBlock from '@/views/activity/comp/share/sharePlatformBlock.vue';

interface Props {
  showCustomButton?: boolean;
  model?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCustomButton: false,
  model: false
});

const { blocks, prizes, lucky_grid_button, closePopup,
  activeStyle, once, theme, endCallback, activityName, defaultRule, customRule, ruleType, ZActivityRuleType, mainMediaShare } = useLogic(props);
</script>

<style scoped lang="less">
@import "@/views/activity/newUserExclusive/style_18/themo.less";

.fix-disabled-style(@bg, @color) {
  :deep(.lucky-grid-button) {
    &-text-disabled {
      opacity: 1;
      background: @bg;
      color: @color;
    }
  }

}

// new style
#activity-newUserExclusive-style_0.style();
.fix-disabled-style(@bg: var(--ep-color-background-fill-active-disabled, rgba(24, 59, 95, 1)), @color: var(--color-text-inverse-disabled, rgba(255, 255, 255, 0.40)));
</style>
