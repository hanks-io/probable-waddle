<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue';
import { getTheme } from '@/theme/hooks'
import useAddThemeClassName from '@/hooks/useAddThemeClassName'
const tenantStore = useTenantStore();	// 租户信息
const merchanName = computed(() => tenantStore.tenantInfo?.name); // 商户名
const appLogo = computed(() => tenantStore.tenantInfo?.logo);
const router = useRouter()
const emit = defineEmits<{
  (e: 'goBack'): void
}>()
const goBack = () => {
  emit('goBack')
  // router.back()
}
</script>
<template>
  <div class="bt-header-wrap flex-between" :class="useAddThemeClassName()">
    <div class="back-area flex-start" @click="goBack">
      <IonIcon src="/first/svg/backSports.svg" class="back" />
      <span class="ml-1">{{ $t('main.back') }}</span>
    </div>
    <slot>

      <div>
        <ion-img class="h-[28px] max-w-[120px] pr-4" slot="secondary" :src="appLogo" />
      </div>

    </slot>

  </div>

</template>

<style scoped lang="less">
html {
  #game-sportsActions-comp-SportsHeader.style();
}

.new-skin-symbol {
  #game-sportsActions-comp-SportsHeader.style(
    @head-bg: var(--ep-color-background-fill-top-nav-secondary);
    @back-bg: var(--ep-color-background-fill-surface-raised-L2);
    @back-icon-color: var(--ep-color-icon-default);
    @text-color1: var(--ep-color-text-default);
  );
  .bt-header-wrap {

    &.scheme-light {

      .back-area {

        ion-icon.back {
          opacity: 1;
        }
      }
    }
  }
}

#game-sportsActions-comp-SportsHeader {
  .style(
    @head-bg: var(--theme-color-800);
    @back-bg: var(--theme-color-700);
    @back-icon-color: var(--color-text-secondary-2);
    @text-color1: var(--ep-color-text-default, #fff);
  ){
    .bt-header-wrap {
      width: 24.375rem;
      height: 3.125rem;
      box-sizing: border-box;
      line-height: 3.125rem;
      color: var(--text-color-white-100);
      .bg-200();

      &.scheme-light {
        background-color: @head-bg;

        .back-area {
          background-color: @back-bg;

          ion-icon.back {

            color: @back-icon-color;
            opacity: 0.4;
          }
        }

        .title {
          color: var(--color-bg-100);
          background: none;
          -webkit-text-fill-color: var(--color-bg-100);
        }
      }

      .back-area {
        width: 6.25rem;
        height: 100%;
        padding-left: 0.75rem;
        .bg-100();
        cursor: pointer;
        color: @text-color1;

        ion-icon.back {
          font-size: var(--font-size-20);
          color: var(--color-text-40);
        }
      }
    }
  }
}
</style>
