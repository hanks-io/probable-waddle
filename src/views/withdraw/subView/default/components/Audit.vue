<!-- 稽核记录 -->
<script setup lang="ts">
import { formatMoneyToShow } from "@/utils/custom";
import { IonContent, IonSelect, IonSelectOption, IonRefresher, IonRefresherContent, IonLabel } from "@ionic/vue";
import useAudit from "../../hooks/useAudit";
import SelectList from '@/components/first/selectlist/index.vue'
import { getAuditTypeName, getAuditStatusColor, getAuditStatusName } from "@/hooks/useAuditStatusName";

const { flowTypeIndex, sumValues, loading, recordList,selectList, detailHandle, handleRefresh, handleChange } = useAudit();
</script>
<template>
  <ion-content>
    <!-- 头部选项和信息 -->
    <div class="header">
      <div class="detail-text">{{ $t("viewsAssets.pendingAuditAmount") }}: <span class="currency">{{ `${formatMoneyToShow(sumValues)}` }}</span></div>
      <SelectList :selectList="selectList" v-model="flowTypeIndex"  @handleChange="handleChange"/>
    </div>
    <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <!-- 暂无数据 -->
    <div class="empty" v-if="!loading && !recordList.length">
      <div class="empty-bg-img"></div>
      <ion-label color="medium">{{ $t("label.noRecord") }}</ion-label>
    </div>
    <!-- 稽核记录列表 -->
    <div class="item" @click="detailHandle(item)" v-for="item in recordList" :key="item.flowListId">
      <div class="top">
        <ion-label>{{ getAuditTypeName(item.flowType) }}</ion-label
        ><span>{{ formatMoneyToShow(item.unfinished) }}</span>
      </div>
      <div class="label">
        <ion-label>{{ item.createTime }}</ion-label>
        <span :style="{ color: getAuditStatusColor(item.status) }">{{ getAuditStatusName(item.status) }}</span>
      </div>
    </div>
  </ion-content>
</template>

<style scoped lang="less">
@import "@/views/withdraw/subView/default/styles/audit/index-base.less";
@import "@/views/withdraw/subView/default/styles/audit/theme-style.less";
#withdraw-subView-default-audit.style();
.blue-default {
    #withdraw-subView-default-audit.style();
}
.green-default {
    #withdraw-subView-default-audit.style(
      --color-text-gray-100,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-gray-200
    );
}
.forest-green, .auroral-yellow {
  #withdraw-subView-default-audit.style(
      @Audit07 : --color-text-gray-200
  );
}

.amber-purple {
    #withdraw-subView-default-audit.style(
      --color-text-gray-100,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-bg-200,
      --color-text-gray-100,
      --color-text-gray-200
    );
}

</style>
