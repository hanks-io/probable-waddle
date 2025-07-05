<script setup lang="ts">
import InstallProgress from './InstallProgress.vue';
import { IonIcon, IonImg, IonButton } from '@ionic/vue';
import GuidePwa from './GuidePwa.vue';
import { useRedomain } from '@/pwa/hooks/useLogic';
import { type CompulsoryModalProps } from '@/pwa/hooks/useReDomainModal';
import { isArray } from '@/utils';
import { convertMoneyToShow } from '@/utils/custom';
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';
import { close } from "ionicons/icons";
import { getImageUrl } from '@/utils/url';
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
  isIOS,
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
  buttonType: ''
})
const { commission, domain, install } = props.templateText
const commissionText = computed(() => computedAmonut(!!(commission?.length), commission))


const getDescTextList = () => {
  if (isIOS.value) {
    return [20, 21, 22]
  }
  return install.installType === 'pwa' ? [4, 5, 6] : [6, 7, 8, 9]
}


</script>

<template>
  <div class="h-full w-full flex justify-center items-end compulsory-warp">
    <GuidePwa v-if="installStatus === 'Installed' && isSamsung" @closeModal='closeForceModal' />

    <div class="content " :class="theme" @click.stop v-else>
      <div class="circle"></div>
      <ion-icon v-if="promotionInfo?.popupInterval !== '0'" class="close-icon" :icon="close" @click="closeForceModal" />
      <div class="aperture1"></div>
      <div class="aperture2"></div>

      <div class="logo-area">
        <!-- PWA图标 -->
        <div class="logo-wrap">
          <ion-img class="logo" slot="start" :src="tenantInfo?.icon" />
        </div>

        <div class="app-name">{{ tenantInfo?.name }}</div>
      </div>

      <div class="force-img-area moveUpDown">
        <ion-img class="force-img" slot="start" :src="getImageUrl('img/force.png')" />
      </div>

      <div class="tips-area">
        <p class="version">{{ $t('components.progressierOperation1') }}</p>
        <div class="w-full">
          <p v-if="templateText?.title" class="sub-title">
            <i18n-t :keypath="templateText?.title">
              <template #commission v-if="templateText?.commission">
                <span class="accent">{{ commissionText }}</span>
              </template>
            </i18n-t>
          </p>
          <template v-else>
            <p class="sub-title" v-if="isRecharge || isFistWithdrawal">
              {{ $t('components.progressierOperation3') }}
              <span class="accent">{{ user?.id }}</span>
              {{ $t(`components.progressierOperation${isRecharge ? (reward ? 2 : 15) : (reward ? 12 : 16)}`) }}
              <span class="accent" v-if="calcGiftAmount">{{ calcGiftAmount }}</span>
            </p>
            <p class="sub-title tex-desc" v-if="isHome">
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
      </div>
      <!-- 安装进度条 -->
      <div class="action-area">

        <template v-if="buttonType === 're-domain'">
          <ion-button mode="md" class="action-btn " @click="installRePwa(domain, install)">
            {{ $t(install.installType === 'pwa' ? 'ForceBindings.000007' : 'components.progressierOperation4') }}
          </ion-button>
        </template>
        <template v-else>
          <!-- 安装/启动按钮 -->
          <InstallProgress v-if="installStatus === 'Installing'" type="force-modal" :value="installProgress" />
          <ion-button mode="md" class="action-btn" v-else @click="handleForcedInstallAction">
            <ion-icon class="download-svg" :src="getImageUrl('svg/download-new.svg')" slot="start" />
            <button class="btn-text">{{ btnText }}</button>
          </ion-button>
        </template>
        <!-- 客服 -->
        <div class="customer-wrap" @click="onlineServiceHandle">
          <ion-icon class="customer" src="/first/svg/perfil/customer.svg" />
        </div>

      </div>
      <!-- 安卓APK安装说明 -->
      <div v-if="os !== 'iOSH5'" class="instructions-area">
        <p class="title">{{ $t(`components.progressierOperation${isIOS ? 19 : 5}`) }}:</p>
        <div class="aperture3"></div>
        <div v-if="templateText?.description" class="details">
          <p class="mr-1.5">{{ templateText?.description }}</p>
        </div>
        <div v-else class="details" v-for="(it, i) in getDescTextList()" :key="it">
          <p class="mr-1.5">{{ i + 1 }}.</p>
          <span>{{ $t(`${install.installType === 'pwa' && !isIOS ? 'ForceBindings.00000' :
            'components.progressierOperation'}${it}`)
          }}</span>
        </div>

        <div class="warn-area" :class="{ 'mb-10': isHasBottomToolbar }">
          <div class="top">
            <ion-icon class="tip-icon" src="/svg/download/tip.svg" />
            <div class="tip-title">{{ $t('components.progressierOperation10') }}</div>
          </div>
          <p class="details">{{ $t(`components.progressierOperation${isIOS ? 23 : 11}`) }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.compulsory-warp {
  .aperture {
    border-radius: 50%;
    position: absolute;
  }

  .content {
    width: 22.875rem;
    position: relative;
    background: var(--ep-dynamic-tertiary, linear-gradient(90deg, var(--ep-color-background-fill-gradients-tertiary-a, #357FCF) -27.5%, var(--ep-color-background-fill-gradients-tertiary-b, #2D8C2E) 127.5%));
    border-radius: var(--ep-border-radius-surface-small, .875rem);
    overflow: hidden;
    margin: 0 auto .9375rem;

    .circle {
      width: 12.9375rem;
      height: 12.9375rem;
      border-radius: 50%;
      background: var(--ep-color-icon-brand-primary, #3A8EE3);
      position: absolute;
      right: -4.3125rem;
      top: -4.3125rem;
    }

    .aperture1 {
      width: 2.9375rem;
      height: 2.9375rem;
      background: var(--ep-color-text-success, #53C154);
      filter: blur(11.949999809265137px);
      top: 6.375rem;
      left: 3.4375rem;
      opacity: 0.53;
      .aperture()
    }

    .aperture2 {
      width: 3.5rem;
      height: 3.5rem;
      background: var(--ep-color-text-warning, #FC974C);
      filter: blur(3.549999952316284px);
      top: 10rem;
      right: 1.875rem;
      z-index: 5;
      opacity: 0.48;
      .aperture();
    }

    .aperture3 {
      width: 6.5625rem;
      height: 6.5625rem;
      background: var(--ep-color-text-danger, #E64021);
      filter: blur(2.8125rem);
      bottom: 2rem;
      left: 1.875rem;
      opacity: 0.35;
      .aperture();
    }

    .close-icon {
      position: absolute;
      color: var(--ep-color-icon-highlight-white, #fff);
      font-size: var(--ep-font-size-xl, 1.125rem);
      right: .75rem;
      top: .75rem;
      z-index: 10;
    }

    .logo-area {
      display: flex;
      align-items: center;
      margin: 1.8125rem 0 0 1.1875rem;

      .logo-wrap {
        width: 3.125rem;
        height: 3.125rem;
        border-radius: var(--ep-border-radius-surface-small, .75rem);
        overflow: hidden;


        .logo {
          width: 100%;
          height: 100%;
        }
      }

      .app-name {
        height: 3.125rem;
        line-height: 3.125rem;
        font-size: var(--ep-font-size-xl, 1.125rem);
        font-weight: var(--ep-font-weight-bold, 700);
        color: var(--ep-color-text-highlight-white, #fff);
        margin-left: .5625rem;
      }
    }

    .force-img-area {
      width: 216px;
      height: 216px;
      position: absolute;
      right: .3125rem;
      top: 0;

      .force-img {
        width: 100%;
        height: 100%;
      }
    }

    .tips-area {
      width: 21.25rem;
      margin: 5rem auto 0;

      .version {
        font-size: var(--ep-font-size-xl, 1.125rem);
        line-height: 1.75rem;
        font-weight: var(--ep-font-weight-bold, 700);
        color: var(--ep-color-text-highlight-white, #fff);
      }

      .sub-title {
        font-size: var(--ep-font-size-m, .875rem);
        line-height: 1.25rem;
        color: var(--ep-color-text-highlight-white-weak, rgba(255, 255, 255, 0.6));

        .accent {
          color: var(--ep-color-text-warning, --color-currency);
        }
      }



    }

    .action-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1.5625rem auto 1.375rem;
      width: 21.5625rem;

      .action-btn {
        width: 18.125rem;
        height: 2.625rem;
        text-align: center;
        font-size: var(--ep-font-size-m, .875rem);
        line-height: 2.625rem;
        font-weight: var(--ep-font-weight-bold, 700);
        --box-shadow: none;
        color: var(--ep-color-text-highlight-white, #fff);
        --border-radius: var(--ep-border-radius-m, .375rem);
        --background: var(--ep-color-icon-brand-primary, #CF3F5B);

        .download-svg {
          font-size: var(--ep-font-size-xxl, 2.25rem);
          color: var(--ep-color-icon-inverse, #fff);
          font-weight: var(--ep-font-weight-medium, 700);
        }

        .btn-text {
          font-size: var(--ep-font-size-m, .875rem);
          line-height: 2.625rem;
          font-weight: var(--ep-font-weight-bold, 700);
          color: var(--ep-color-text-highlight-white, #fff);
        }

      }



      .customer-wrap {
        height: 2.625rem;
        width: 2.625rem;
        border-radius: var(--ep-border-radius-s, 0.25rem);
        background: var(--ep-color-icon-brand-secondary, #3A8EE3);
        text-align: center;
        padding: .5rem;
        cursor: pointer;

        .customer {
          font-size: 1.625rem;
          color: var(--ep-color-icon-inverse, #fff);
        }
      }
    }

    .instructions-area {
      width: 21.25rem;
      margin: 0 auto 2.5rem;
      position: relative;

      .title {
        color: var(--ep-color-text-highlight-white, #fff);
        font-size: var(--ep-font-size-m, .875rem);
        font-weight: var(--ep-font-weight-medium, 600);
        line-height: 1.375rem;
        margin-bottom: 1rem;
      }

      .details {
        display: flex;
        color: var(--ep-color-text-highlight-white-weak, rgba(255, 255, 255, 0.60));
        font-size: var(--ep-font-size-s, .75rem);
      }

      .warn-area {
        width: 100%;
        background: var(--ep-neutral-white-white-10, rgba(255, 255, 255, 0.1));
        padding: .3125rem .625rem .4375rem .625rem;
        border-radius: var(--ep-border-radius-m, .375rem);
        margin-top: 1rem;

        .top {
          display: flex;
          align-items: center;
          font-size: var(--ep-font-size-m, .875rem);
          line-height: 1.375rem;

          .tip-icon {
            color: var(--ep-color-icon-info, #5C82F5);

          }

          .tip-title {
            color: var(--ep-color-text-highlight-white-weak, #fff);
            margin-left: .3125rem;
            font-weight: var(--ep-font-weight-medium, 600);
          }
        }

        .details {
          font-size: var(--ep-font-size-xs, .625rem);
          color: var(--ep-color-text-highlight-white-weaker, rgba(255, 255, 255, 0.60));
          line-height: 1.125rem;
        }
      }
    }


  }
}



.moveUpDown {
  animation: moveUpDown 8s ease-in-out infinite;
  /* 动画持续2秒，无限循环 */
}

@keyframes moveUpDown {

  0%,
  50%,
  100% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(2px);
  }

  75% {
    transform: translateY(-10px);
  }
}
</style>

<style lang="less">
.tex-desc {
  .accent {
    color: var(--color-currency);
    font-weight: var(--ep-font-weight-medium, 600);
    font-size: .875rem;
  }
}
</style>
