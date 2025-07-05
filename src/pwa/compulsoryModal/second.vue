<script setup lang="ts">
import CompulsoryModal from '../comp/CompulsoryModal.vue';
import VButton from '@/components/second/Button/index.vue';
import InstallProgress from '@/pwa/comp/InstallProgress.vue';
import { useRedomain } from '@/pwa/hooks/useLogic';
import { usePwaLogic } from '@/pwa/hooks/usePwaLogic';


const { installRePwa } = useRedomain();
const {
  handleForcedInstallAction,
  installStatus,
  onlineServiceHandle,
  btnText,
  installProgress,
} = usePwaLogic();

</script>

<template>
  <CompulsoryModal>
    <template #install-area="slotProps">
      <!-- 客服 -->
      <div
        @click="onlineServiceHandle"
        class="support flex items-center justify-center h-[2.5rem] w-[2.5rem] mr-[1.8125rem]"
      >
        <ion-icon class="text-[1.75rem]" src="/svg/serivce.svg" />
      </div>

      <template v-if="slotProps.buttonType === 're-domain'">
        <VButton
          mode="md"
          class="flex-1 text-white"
          shape="round"
          @click="installRePwa(slotProps.domainList, slotProps.install)"
        >
          <button class="w-full h-full btn-text">
            {{ slotProps.install.installType === 'pwa' ? $t('ForceBindings.000007') : $t('components.progressierOperation4') }}
          </button>
        </VButton>
      </template>

      <template v-else>
        <!-- 安装/启动按钮 -->
        <InstallProgress
          v-if="installStatus === 'Installing'"
          :value="installProgress"
        />
        <VButton
          v-else
          mode="md"
          class="flex-1 text-white"
          shape="round"
          @click="handleForcedInstallAction"
        >
          <button class="w-full h-full btn-text">{{ btnText }}</button>
        </VButton>
      </template>
    </template>

    <template #tipIcon>
      <ion-icon class="text-[.8125rem]" src="/svg/download/tip-2.svg" />
    </template>
  </CompulsoryModal>
</template>

<style scoped lang="less">
:deep(.amber-purple) {
  .header {
    background: url('/images/bg-forced-popup-amber-BR.png');
    background-size: 100%;
  }

  .header-BR {
    background: url('/images/bg-forced-popup-amber-BR.png');
    background-size: 100%;
  }

  .header-PH {
    background: url('/images/bg-forced-popup-amber-PH.png');
    background-size: 100%;
  }

  background-color: var(--color-bg-300);

  .title {
    color: var(--text-color-light-purple-1-100);
  }

  p {
    color: var(--text-color-light-purple-2-100);
  }

  span {
    color: var(--accent-color-yellow);
  }

  .logo {
    background-color: var(--color-bg-100);

    p {
      color: var(--text-color-light-purple-1-100);
    }
  }

  .support {
    border-width: 1px;
    border-style: solid;
    border-radius: 0.5rem;
    border-color: var(--line-color);
    background: var(--color-bg-200);
    box-shadow: 0px 4px 6.8px 0px rgba(0, 0, 0, 0.25),
      0px -2px 4px 0px rgba(0, 0, 0, 0.11) inset;
  }

  .tip-box {
    span {
      color: var(--text-color-light-purple-2-100);
    }
  }

  .warn {
    background-color: var(--color-bg-100);
  }

  .btn-text {
    color: var(--color-primary-btn-text-active);
  }
}
</style>
