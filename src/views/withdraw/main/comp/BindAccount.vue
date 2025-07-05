<script setup lang="ts">
import Card from '@/views/withdraw/comp/AddCard.vue'
import { IonIcon } from '@ionic/vue';
import { getImageUrl } from '@/utils/url'
import { CardInfo } from '@/views/withdraw/type'
import BankCard from '@/views/withdraw/comp/BankCard.vue'

const tenantStore = useTenantStore() // 商户信息
const router = useRouter()

const emit = defineEmits<{
  (e: 'changeActiveAccount', relatedCode: string): void
}>()
let props = withDefaults(defineProps<{
  accountList: CardInfo[]
  bindAccountMax: number
}
>(), {
  accountList: () => []
});
const activeAccount = ref<CardInfo>(props.accountList[0])
const { tenantInfo } = toRefs(tenantStore)
const gotoAccount = () => {
  router.push("/withdrawalAccount")
}
const relatedCode = ref('')
const handleChange = (activeCode: string) => {
  emit('changeActiveAccount', activeCode)
  relatedCode.value = activeCode
  activeAccount.value = props.accountList.find(it => it.relatedCode === activeCode)
}
watch(() => props.accountList, (list) => {
  if (!list.length) return
  if (!list[0].relatedCode) return
  relatedCode.value = list[0].relatedCode
  activeAccount.value = list[0]
}, { immediate: true })


const getAccountValue = () => {

  const key = tenantInfo.value?.code === "IN" ? 'IFSC' : 'BANKACCOUNT'
  return {
    account: activeAccount.value[key],
    realName: activeAccount.value.REALNAME,
    bankAccount: activeAccount.value.BANKACCOUNT,
    tenantWithdrawTypeSubId: activeAccount.value.tenantWithdrawTypeSubId

  }

}

defineExpose({
  getAccountValue
})
</script>
<template>
  <div class="bind-title flex-between">
    <span>{{ $t('viewsAssets.withdrawalAccount') }}</span><span class="my-account" @click="gotoAccount">{{
      $t('viewsAssets.myAccount') }}</span>
  </div>

  <Card v-if="!accountList.length" />


  <template v-for="it in accountList" v-else>
    <BankCard :cardInfo="it" type="info" :relatedCode="relatedCode" @click="handleChange(it.relatedCode)">
      <template #action>

        <ion-icon slot="icon-only" v-if="it.relatedCode === relatedCode" :src="getImageUrl('svg/ok.svg')"
          class="ok-icon" />


      </template>

    </BankCard>
  </template>



</template>

<style scoped lang="less">
#withdraw-main-comp-bindAccount-index {

  .style(@titleColor: --ep-color-text-default,
    @okIconColor: --ep-color-icon-selected,
    @accountTextColor: --ep-color-text-info) {

    .bind-title {
      width: 22.375rem;
      margin: 1.3125rem auto .75rem;
      color: var(@titleColor);
      font-weight: var(--ep-font-weight-bold, 700);
      font-size: var(--ep-font-size-s, .75rem);
      line-height: 1.125rem;
      box-sizing: border-box;
      padding: 0 .75rem;

      .my-account {
        cursor: pointer;
        color: var(@accountTextColor);

      }
    }

    .m-b {
      margin-bottom: 1.0625rem;
    }

    ion-icon.ok-icon {
      color: var(@okIconColor);
    }
  }

}



.green-default,
.yellow-dark,
.forest-green,
.green-dark,
.purple-light {
  #withdraw-main-comp-bindAccount-index.style(@titleColor: --color-text-100,
    @okIconColor: --theme-color-800,
    @accountTextColor: --color-link);
}

.auroral-yellow {
  #withdraw-main-comp-bindAccount-index.style(@titleColor: --color-text-100,
    @okIconColor: --color-text-white-100,
    @accountTextColor: --color-link);
}

.amber-purple {
  #withdraw-main-comp-bindAccount-index.style(@titleColor: --color-text-100,
    @okIconColor: --color-text-gray-100,
    @accountTextColor: --color-link);
}

.blue-default {
  #withdraw-main-comp-bindAccount-index.style(@titleColor: --color-text-100,
    @okIconColor: --theme-color-500,
    @accountTextColor: --theme-color-500);
}

.new-skin-symbol {
  #withdraw-main-comp-bindAccount-index.style();
}
</style>
