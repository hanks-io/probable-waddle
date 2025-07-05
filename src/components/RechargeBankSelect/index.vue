<template>
  <div class="recharge-bank-select px-[0.5rem] w-full" @click="selectBankClick">
    <div class="flex items-center" v-if="activeBankInfo.logo">
      <img class="w-[2rem] h-[2rem] bank-selected-icon mr-[0.375rem]" :src="activeBankInfo.logo" />
      <div class="bank-select-info">
        <div class="bank-type">{{ activeBankInfo.name }}</div>
        <div class="bank-name">{{ activeBankInfo.code }}</div>
      </div>
    </div>
    <div class="placeholder" v-else>{{ $t(`hint.tipBank`) }}</div>
    <ion-icon src="/first/svg/select-icon.svg" class="w-[0.875rem] h-[0.875rem]"
      :class="{ 'reverse-icon': bankPopoverVisible }" />
    <!-- 银行卡下拉列表 -->
    <ion-popover mode="md" trigger="recharge-bank-trigger" :isOpen="bankPopoverVisible" @didDismiss="dismissHandle"
      size="cover">
      <div class="select-bank-list mt-[0.625rem]">
        <!-- 搜索框 -->
        <ion-input fill="outline" class="bank-search-input w-full mb-[0.75rem]" v-model="searchValue"
          :placeholder="$t('sort.SEARCH')" @ionInput="enterInput">
          <ion-icon slot="start" class="search-icon w-[1.5rem] h-[1.5rem]" :icon="searchOutline" />
        </ion-input>
        <!-- 银行卡列表 -->
        <div class="select-bank-item mb-[0.75rem]" v-for="(item, index) in filteredBankList" :key="index"
          @click="bankChange(item)" :class="[{ active: item.code === bankCode }]">
          <img class="w-[2rem] h-[2rem] bank-selected-icon mr-[0.375rem]" :src="item.logo" />
          <div class="bank-select-info">
            <div class="bank-type">{{ item.name }}</div>
            <div class="bank-name">{{ item.code }}</div>
          </div>
        </div>
      </div>
    </ion-popover>
  </div>
  <div id="recharge-bank-trigger" class="w-full"></div>
</template>

<script setup lang="ts">
import { searchOutline } from 'ionicons/icons';
import { IonIcon, IonPopover, IonInput } from '@ionic/vue';
import type { BankInfoType } from '@/store/recharge'
import { throttle } from '@/utils';
const bankPopoverVisible = ref(false)
const searchValue = ref<string>('');
const filteredBankList = ref<BankInfoType[]>([]);
const emit = defineEmits<{
  (e: 'bankChange', bank: BankInfoType): void

}>()

const bankCode = defineModel<string>('bankCode', { required: true })
const props = defineProps<{
  bankList: BankInfoType[]
  activeBankInfo: BankInfoType

}
>()
const enterInput = throttle(() => {

  if (!searchValue.value) {
    filteredBankList.value = [...props.bankList];
    return
  }

  const normalizedQuery = searchValue.value.toLowerCase();
  filteredBankList.value = props.bankList.filter((item: BankInfoType) => {
    return item.name.toLowerCase().includes(normalizedQuery);
  });
}, 500)
const bankChange = (bank: BankInfoType) => {
  bankPopoverVisible.value = false

  emit(`bankChange`, bank)

}
const selectBankClick = () => {
  bankPopoverVisible.value = true;
  filteredBankList.value = [...props.bankList];
}

const dismissHandle = () => {
  bankPopoverVisible.value = false;
  searchValue.value = ''
}

onMounted(() => {
  filteredBankList.value = [...props.bankList];
})


</script>

<style scoped lang="less">
@import "@/components/RechargeBankSelect/styles/base-index.less";
@import "@/components/RechargeBankSelect/styles/theme-style.less";

#components-RechargeBankSelect-index.style();

.blue-default {
  #components-RechargeBankSelect-index.style();
}

.green-default,
.forest-green,
.auroral-yellow,
.yellow-dark,
.green-dark {
  #components-RechargeBankSelect-index.style(@components-RechargeBankSelect-index-09: --color-bg-400;
  );
}

.amber-purple {
  #components-RechargeBankSelect-index.style(@components-RechargeBankSelect-index-06: --color-bg-100;
    @components-RechargeBankSelect-index-09: --color-bg-400;
  )
}

.purple-light {
  #components-RechargeBankSelect-index.style(@components-RechargeBankSelect-index-11: --text-color-white-40;
    @components-RechargeBankSelect-index-09: --color-bg-400;
  )
}

.new-skin-symbol {
  @import "@/components/RechargeBankSelect/styles/base-theme.less";
}

.new-skin-symbol {
  #components-RechargeBankSelect-index.style(@placeholderColor: --ep-color-text-weaker;
    @components-RechargeBankSelect-index-01: --ep-color-background-fill-surface-raised-L2;
    @components-RechargeBankSelect-index-02: --ep-color-icon-weaker;
    @components-RechargeBankSelect-index-03: --ep-color-text-default;
    @components-RechargeBankSelect-index-04: --ep-color-text-weaker;
    @components-RechargeBankSelect-index-05: --ep-color-background-fill-surface-raised-L2;
    @components-RechargeBankSelect-index-06: --ep-color-background-fill-surface-raised-L1;
    @components-RechargeBankSelect-index-07: --ep-color-border-default;
    @components-RechargeBankSelect-index-08: --ep-color-border-default;
    @components-RechargeBankSelect-index-09: --ep-color-background-fill-surface-lowered;
    @components-RechargeBankSelect-index-10: --ep-color-border-selected;
    @components-RechargeBankSelect-index-11: --ep-color-icon-weaker;
  );
}
</style>
