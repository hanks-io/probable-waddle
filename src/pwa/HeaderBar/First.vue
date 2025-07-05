<script setup lang="ts">
import HeaderBar from '../comp/HeaderBar.vue';
import Button from '@/components/first/Button/index.vue';
</script>
<template>
  <HeaderBar>

    <template #actionBtn="{ homeInstallAction, btnText }">
      <Button class="button" height="1.625rem"  @click="homeInstallAction">{{ btnText
        }}</Button>
  
  
    </template>

  </HeaderBar>
</template>

<style scoped lang="less">
:deep(.close) {
  color: var(--text-color-white-40)
}

.install .button {
  --button-font-size: .75rem;
  --button-font-weight: 700;
}


.yellow-dark {
  .install {
    .button {
      --button-text-color: var(--accent-color-red);

      :deep(.first-button) {
        --background: var(--text-color-white-100);

        &::part(native) {
          background: var(--text-color-white-100);
        }
      }
    }
  }
}

.green-dark {
  .install {
    .button {
      --button-text-color: var(--accent-color-orange-1);

      :deep(.first-button) {
        --background: var(--text-color-white-100);

        &::part(native) {
          background: var(--text-color-white-100);
        }
      }
    }
  }
}

.purple-light {
  .install {
    .button {
      --button-text-color: var(--accent-color-green);

      :deep(.first-button) {
        --background: var(--text-color-white-100);

        &::part(native) {
          background: var(--text-color-white-100);
        }
      }
    }
  }
}

.amber-purple {
  .install {
    .button {
      --button-text-color: var(--accent-color-orange-2);

      :deep(.first-button) {
        --background: var(--text-color-white-100);

        &::part(native) {
          background: var(--text-color-white-100) !important;
        }
      }
    }
  }

}
</style>
