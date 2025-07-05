<script setup lang="ts">
import InstallProgress from './InstallProgress.vue';
import { IonIcon, IonImg, IonButton } from '@ionic/vue';
import GuidePwa from './GuidePwa.vue';
import { useRedomain } from '@/pwa/hooks/useLogic';
import { type CompulsoryModalProps } from '@/pwa/hooks/useReDomainModal';
import { isArray } from '@/utils';
import { convertMoneyToShow } from '@/utils/custom';
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
import NewCompulsoryModal from './NewCompulsoryModal.vue';
import { getTheme } from '@/theme/hooks';

const { newSkin } = getTheme();

const { installRePwa } = useRedomain();


const {
  handleForcedInstallAction,
  installStatus,
  tenantInfo,
  onlineServiceHandle,
  computedAmonut,
  closeForceModal,
  btnText,
  promotionInfo,
  user,
  os,
  isSamsung,
  installProgress,
  isHasBottomToolbar,
  forceModalKey,
  theme,

} = usePwaLogic();

const reward = computed(() => promotionInfo.value?.popupType === "REWARD"); // 是否升级奖励

const calcGiftAmount = computed(() => {
  // 显示奖励金额
  const giftAmount = promotionInfo.value?.showGiftAmount || '';
  const giftAmountMap = {
    registerReward: () => `${tenantInfo.value?.merchantCy}${convertMoneyToShow(giftAmount)}`,
    array: () => {
      const [min, max] = giftAmount;
      return computedAmonut(true, [min, max]);
    },
    reward: () => {
      const { showGiftAmount, showGiftMaxAmount, showGiftAmountType } = promotionInfo.value || {};
      return showGiftMaxAmount && showGiftAmountType === 1
        ? computedAmonut(true, [showGiftAmount, showGiftMaxAmount])
        : computedAmonut(false, showGiftAmount);
    },
    default: () => 0
  };

  if (forceModalKey.value === 'registerReward') return giftAmountMap.registerReward();
  if (isArray(giftAmount)) return giftAmountMap.array();
  if (giftAmount && reward.value) return giftAmountMap.reward();
  return giftAmountMap.default();
});

const isRecharge = computed(() => promotionInfo.value?.popupTime === 'RECHARGE' && user.value?.id); // 充值显示强制安装pwa弹框
const isHome = computed(() => promotionInfo.value?.popupTime === 'HOME'); // 首页显示强制安装pwa弹框
const isFistWithdrawal = computed(() => promotionInfo.value?.popupTime === 'FIRST_WITHDRAWAL' && user.value?.id); //  第一次取款显示强制安装pwa弹框
const currentRegionCode = computed(() => tenantInfo.value?.code);

const props = withDefaults(defineProps<CompulsoryModalProps>(), {
  templateText: () => ({
    description: '',
    title: '',
    commission: 0,
    domain: null,
    install: {
      installType: '',
      apkName: '',
      apkUrl: ''
    }
  }),
  buttonType: '',
  newSkin: ''
})
const { commission, domain, install } = props.templateText
const commissionText = computed(() => computedAmonut(!!(commission?.length), commission))



</script>

<template>
  <NewCompulsoryModal v-if="newSkin" />
  <div class="h-full w-full flex justify-center items-end compulsory-warp" v-else>
    <GuidePwa v-if="installStatus === 'Installed' && isSamsung" @closeModal='closeForceModal' />
    <div class="content w-[24.375rem] rounded-t-[1.25rem] relative" :class="theme" @click.stop v-else>
      <div class="header w-full h-[8.4375rem]" :class="`header-${currentRegionCode}`" />
      <div class="absolute w-full top-0 flex items-center justify-end p-2.5">
        <ion-icon class="text-3xl" src="/svg/close_button.svg" @click="closeForceModal"
          v-if="promotionInfo?.popupInterval !== '0'" />
      </div>
      <div class="flex flex-col items-center px-6 pt-1 pb-7 text-black">
        <p class="font-semibold mb-2">{{ $t('components.progressierOperation1') }}</p>
        <div class="w-full">
          <p v-if="templateText?.title" class="text-xs">
            <i18n-t :keypath="templateText?.title">
              <template #commission v-if="templateText?.commission">
                <span class="accent">{{ commissionText }}</span>
              </template>
            </i18n-t>
          </p>
          <template v-else>
            <p class="text-xs" v-if="isRecharge || isFistWithdrawal">
              {{ $t('components.progressierOperation3') }}
              <span class="accent">{{ user?.id }}</span>
              {{ $t(`components.progressierOperation${isRecharge ? (reward ? 2 : 15) : (reward ? 12 : 16)}`) }}
              <span class="accent" v-if="calcGiftAmount">{{ calcGiftAmount }}</span>
            </p>
            <p class="text-xs tex-desc" v-if="isHome">
              <template v-if="forceModalKey === 'registerReward'">
                <span v-html="$t('components.progressierOperation18', { amount: calcGiftAmount })"></span>
              </template>
              <template v-else>
                {{ $t(`components.progressierOperation${reward ? 13 : 14}`) }}
                <span class="accent" v-if="calcGiftAmount">{{ calcGiftAmount }}</span>
              </template>
            </p>
          </template>
        </div>
        <div
          class="logo w-full my-3 flex items-center bg-[#F5F5F5] py-[.3125rem] px-2 rounded-[.3125rem] h-[3.4375rem]">
          <!-- PWA图标 -->
          <ion-img class="cover w-[2.8125rem] h-[2.8125rem] mr-2" slot="start" :src="tenantInfo?.icon" />
          <p>{{ tenantInfo?.name }}</p>
        </div>
        <!-- 安装进度条 -->
        <div class="flex items-center w-full">
          <slot name="install-area" :buttonType="buttonType" :domainList="domain" :install="install">
            <template v-if="buttonType === 're-domain'">
              <ion-button mode="md" class="flex-1 text-white" shape="round" @click="installRePwa(domain, install)">
                {{ $t(install.installType === 'pwa' ? 'ForceBindings.000007' : 'components.progressierOperation4') }}
              </ion-button>
            </template>
            <template v-else>
              <!-- 安装/启动按钮 -->
              <InstallProgress v-if="installStatus === 'Installing'" :value="installProgress" />
              <ion-button mode="md" class="flex-1 text-white" shape="round" v-else>
                <ion-icon class="text-white w-5" src="/svg/download/download.svg" slot="start" />
                <button class="w-full h-full" @click="handleForcedInstallAction">{{ btnText }}</button>
              </ion-button>
            </template>
            <!-- 客服 -->
            <div class="h-[2.8125rem] rounded-full p-2 bg-[#F5F5F5] ml-2.5" @click="onlineServiceHandle">
              <ion-icon class="text-[1.75rem]" src="/svg/download/cs.svg" />
            </div>
          </slot>
        </div>
        <!-- 安卓APK安装说明 -->
        <div v-if="os !== 'iOSH5'" class="tip-box">
          <p class="font-semibold my-2.5 text-sm">{{ $t('components.progressierOperation5') }}:</p>
          <div v-if="templateText?.description" class="text-xs flex w-full">
            <p class="mr-1.5">{{ templateText?.description }}</p>
          </div>
          <div v-else class="text-xs flex w-full"
            v-for="(it, i) in (install.installType === 'pwa' ? [4, 5, 6] : [6, 7, 8, 9])" :key="it">
            <p class="mr-1.5">{{ i + 1 }}.</p>
            <span>{{ $t(`${install.installType === 'pwa' ? 'ForceBindings.00000' :
              'components.progressierOperation'}${it}`)
            }}</span>
          </div>

          <div class="warn w-full mt-2 bg-[#F5F5F5] rounded-[.3125rem] px-2.5 py-[.3125rem]"
            :class="{ 'mb-10': isHasBottomToolbar }">
            <div class="flex items-center">
              <slot name="tipIcon">
                <ion-icon class="text-[.8125rem]" src="/svg/download/tip.svg" />
              </slot>
              <p class="text-[.8125rem] ml-1.5 font-semibold">{{ $t('components.progressierOperation10') }}</p>
            </div>
            <p class="text-[.625rem] leading-tight">{{ $t('components.progressierOperation11') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.content {
  background-color: var(--color-bg-progressier-operation, var(--ion-text-color));
  padding-bottom: var(--ion-safe-area-bottom);
}

.header {
  background: url('/images/bg-forced-popup-BR.png');
  background-size: 100%;
}

.header-BR {
  background: url('/images/bg-forced-popup-BR.png');
  background-size: 100%;
}

.header-PH {
  background: url('/images/bg-forced-popup-PH.png');
  background-size: 100%;
}

ion-button {
  --background: linear-gradient(180deg, #72CB45 0%, #337611 100%);
  text-transform: none;
  min-height: 0;
  height: 2.8125rem;
}

.accent {
  color: var(--color-currency);
}
</style>

<style lang="less">
.tex-desc {
  .accent {
    color: var(--color-currency);
    font-weight: 600;
    font-size: .875rem;
  }
}
</style>
