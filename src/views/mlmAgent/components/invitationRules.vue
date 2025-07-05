<!-- 多级分销 邀请规则 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('label.invite') + $t('main.rules')" />
    <ion-content>
      <!-- 顶部图片 -->
      <div class="top-img w-full"></div>
      <!-- 规则信息 -->
      <div class="rule-main">
        <div v-if="!isDefaultRule" class="item">
          <div v-html="customRuleList" class="custom-item"></div>
          <div class="item-count">01</div>
        </div>
        <div v-if="isDefaultRule">
          <div class="rule-item" v-for="(item,index) in invitationRuleList" :key="index">
            <div class="item-count">{{ handleRuleItemCount(index+1) }}</div>
            {{ item }}
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getTheme } from '@/theme/hooks'
import { useInvitationRulesLogic } from '../hooks/invitationRulesLogic'
import { IonPage, IonContent } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'


//顶部图片
const currentTopBgMap: Record<string, string> = {
  'purple-light': 'url(/first/agent/purple-light-invitation-rules.png)',
}
const currentTopPng = computed(() => {
  const { theme } = getTheme();
  return currentTopBgMap[theme] || `url(/first/agent/invitation-rules.png)`;
})

// item右侧背景图
const currentRightRulePng = computed(() => {
  const data = getTheme();
  const skin = data.skin == 'second' ? 'second' : 'first'
  return `url('/${skin}/agent/${data.theme}-rules-rightTopBg.png')`
})

const { 
  invitationRuleList,
  isDefaultRule,
  customRuleList,
  handleRuleItemCount
} = useInvitationRulesLogic()
</script>

<style scoped lang="less">
@import '@/views/mlmAgent/styles/InvitationRules/base-index.less';
@import '@/views/mlmAgent/styles/InvitationRules/theme-style.less';

#mlmAgent-components-invitationRules-index.style();

.top-img {
  background: v-bind(currentTopPng) no-repeat;
  background-size: 100% 100%;
}

.rule-item,
.custom-item {
  background-image: v-bind(currentRightRulePng);
}

.yellow-dark,
.green-dark,
.purple-light,
.amber-purple,
.blue-default,
.forest-green,
.green-default,
.auroral-yellow {
  #mlmAgent-components-invitationRules-index.style(
    --mlm-toolbar-bg-color,
    --color-text-40,
    --mlm-rules-content-text-color,
    --mlm-agent-level-item-bgc,
    --mlm-agent-rule-item-count-textc
  );
}

.auroral-yellow {
  #mlmAgent-components-invitationRules-index.style(
    @mlmAgent-components-invitationRules-index-03: --color-text-white-100,
    @mlmAgent-components-invitationRules-index-05: --text-color-white-20
  );
}

.new-skin-symbol {
  #mlmAgent-components-invitationRules-index.style(
    --ep-color-background-fill-top-nav-secondary,
    --ep-color-text-weakest,
    --ep-color-text-default,
    --ep-color-background-fill-surface-raised-L1,
    --ep-color-text-weakest
  )
}

.new-skin-symbol {
  @import '@/views/mlmAgent/styles/InvitationRules/index-phantom.less';
}
</style>
