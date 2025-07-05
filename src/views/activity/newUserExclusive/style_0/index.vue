<!-- 新人专属活动页面 -->
<template>
  <ion-page>
    <NavigationBar :title="activityName">
      <template #start>
        <BackButton @click="closePopup" />
      </template>
    </NavigationBar>
    <ion-content :class="theme">
      <div class="bg-image">
        <img src="@/assets/img/activity/newuser/style_0/banner.png" alt="bg" />
      </div>
      <div class="title-container">
        <BeforeIcon :height="'1.0625rem'" :width="'1rem'" />
        <span class="title-text">{{ $t('activity.totalAmountView') }}</span>
        <AfterIcon :height="'1.0625rem'" :width="'1rem'" />
      </div>
      <lucky-grid :blocks="blocks" :prizes="prizes" :width="'22.75rem'" :height="'12.625rem'"
        :lucky_grid_button="lucky_grid_button" :activeStyle="activeStyle" :once="once" :endCallback="endCallback">
        <template #lucky_grid_button>
          {{ $t('activity.mysterious05') }}
        </template>
      </lucky-grid>
      <div class="info-title">
        <InfoBefore :fill="infoConfig.fill" :stroke="infoConfig.stroke" />
        <span class="info-title-text">{{ $t('viewsActivity.activityRules') }}</span>
        <InfoAfter :fill="infoConfig.fill" :stroke="infoConfig.stroke" />
      </div>
      <div class="rule-content keep-space" v-if="ruleType === ZActivityRuleType?.enum.DEFAULT">
        <p class="rule-text" v-for="(item, index) in defaultRule" :key="index">
          {{ index + 1 }}. {{ item }}
        </p>
      </div>
      <p class="rule-text" v-else>
      <p v-for="(item, index) in customRule" :key="index">{{ item }}</p>
      </p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import LuckyGrid from '@/components/LuckyGrid/index.vue';
import BackButton from '@/components/BackButton.vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
import { AfterIcon, BeforeIcon, InfoBefore, InfoAfter } from '@/views/activity/newUserExclusive/components';
import { useLogic } from '@/views/activity/newUserExclusive/logic';

interface Props {
  showCustomButton?: boolean;
  model?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCustomButton: false,
  model: false
});

const { blocks, prizes, lucky_grid_button, closePopup,
  activeStyle, once, theme, infoConfig, endCallback, activityName, defaultRule, customRule, ruleType, ZActivityRuleType } = useLogic(props);
</script>

<style scoped lang="less">
@import "@/views/activity/newUserExclusive/style_0/themo.less";

.fix-disabled-style(@bg, @color) {
  :deep(.lucky-grid-button) {
    &-text-disabled {
      opacity: 1;
      background: @bg;
      color: @color;
    }
  }

}

// 主题样式
.yellow-dark {
  #activity-newUserExclusive-style_0.style(@bg: var(--ep-color-background-fill-body-default, #1B1B19);
    @title-text-color: var(--ep-color-text-warning, #FC974C);
    @border-color: var(--ep-color-border-default, #181816);
    @text-base-bgcolor: var(--ep-color-background-fill-active-primary, #FEB805);
    @text-base-color: var(--ep-color-text-inverse, #2D2D2D);
    @button-base-bgcolor-disable: var(--ep-color-background-fill-surface-raised-L2, #181816);
    @shadow-color: rgba(21, 23, 138, 0);
  );
  .fix-disabled-style(#E0C57E, rgba(45, 45, 45, 0.60));
}

.auroral-yellow {
  #activity-newUserExclusive-style_0.style(@bg: var(--ep-color-background-fill-body-default, #191919);
    @title-text-color: var(--ep-color-text-warning, #FC974C);
    @border-color: var(--ep-color-border-default, #191919);
    @text-base-bgcolor: var(--ep-color-background-fill-active-primary, #F7FB43);
    @text-base-color: var(--ep-color-text-inverse, #000);
    @button-base-bgcolor-disable: var(--ep-color-background-fill-surface-raised-L2, #191919);
    @shadow-color: rgba(21, 23, 138, 0);
  );
}

.green-dark {
  #activity-newUserExclusive-style_0.style(@bg: var(--ep-color-background-fill-body-default, #1A1D22);
    @title-text-color: var(--ep-color-text-warning, #FC974C);
    @border-color: var(--ep-color-border-default, #242F42);
    @text-base-bgcolor: var(--ep-color-background-fill-active-primary, #3E9B2F);
    @text-base-color: var(--ep-color-text-inverse, #FFF);
    @button-base-bgcolor-disable: var(--ep-color-background-fill-surface-raised-L2, #181816);
    @shadow-color: rgba(21, 23, 138, 0);
  );
}

.purple-light {
  #activity-newUserExclusive-style_0.style(@bg: var(--ep-color-background-fill-body-default, #ECE2FE);
    @title-text-color: var(--ep-color-text-warning, #FC974C);
    @border-color: var(--ep-color-border-default, #CAB4FD);
    @text-base-bgcolor: var(--ep-color-background-fill-active-primary, #6526DB);
    @text-base-color: var(--ep-color-text-inverse, #FFF);
    @info-title-color: var(--ep-color-text-default, rgba(0, 0, 0, 0.80));
    @button-base-bgcolor-disable: var(--ep-color-background-fill-surface-raised-L2, #ECE2FE);
    @rule-text-color: var(--ep-color-text-default, rgba(0, 0, 0, 0.50));
    @shadow-color: rgba(21, 23, 138, 0);
  );
}

.green-default,
.forest-green {
  #activity-newUserExclusive-style_0.style(@bg: var(--ep-color-background-fill-body-default, #004D37);
    @title-text-color: var(--ep-color-text-warning, #FC974C);
    @border-color: var(--ep-color-border-default, #004D37);
    @text-base-bgcolor: var(--ep-color-background-fill-active-primary, #17B663);
    @text-base-color: var(--ep-color-text-inverse, #FFF);
    @info-title-color: var(--ep-color-text-default, #FFF);
    @button-base-bgcolor-disable: var(--ep-color-background-fill-surface-raised-L2, #004D37);
    @shadow-color: rgba(21, 23, 138, 0);
  );
}

.amber-purple {
  #activity-newUserExclusive-style_0.style(@bg: var(--ep-color-background-fill-body-default, #262346);
    @title-text-color: var(--ep-color-text-warning, #D45B4D);
    @border-color: var(--ep-color-border-default, #292547);
    @text-base-bgcolor: var(--ep-color-background-fill-active-primary, linear-gradient(270deg, #7041F3 0%, #F5C84C 130.92%));
    @text-base-color: var(--ep-color-text-inverse, #fff);
    @button-base-bgcolor-disable: var(--ep-color-background-fill-surface-raised-L2, #292547);
    @shadow-color: #292547;
    @rule-text-color: var(--ep-color-text-default, #686299);
  );
  .fix-disabled-style(@bg: #3B3466, @color: #BDB8E1);
}

.mystlight-blue {
  #activity-newUserExclusive-style_0.style(@shadow-color: rgba(0, 0, 0, 0);
  );
}


// new style
#activity-newUserExclusive-style_0.style();
.fix-disabled-style(@bg: var(--ep-color-background-fill-active-disabled, rgba(24, 59, 95, 1)), @color: var(--color-text-inverse-disabled, rgba(255, 255, 255, 0.40)));
</style>
