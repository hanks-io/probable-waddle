<template>
  <ion-item lines="none">
    <ion-label class="ion-text-wrap">
      {{ $t('viewsSpread.agentOld1') }}
    </ion-label>
  </ion-item>
  <div class="flex flex-col p-[10px] border border-[#566488] rounded-[.625rem]">
    <ion-label>
      {{ $t('viewsSpread.agentOld2') }}
    </ion-label>
    <h6>1</h6>
    <ion-label>
      {{ $t('viewsSpread.agentOld3') }}
    </ion-label>
    <h6>2</h6>
    <ion-label>
      {{ $t('viewsSpread.agentOld4') }}
    </ion-label>
    <h6>3</h6>
    <ion-label>
      {{ $t('viewsSpread.agentOld5') }}
    </ion-label>

    <h6>{{ $t('viewsSpread.agentOld6') }}</h6>
    <div class="flex flex-col items-center">
      <p class="w-4 text-xs bg-[#66C7BC] text-center rounded-xl">A</p>
      <div class="flex justify-center">
        <ion-icon class="w-[7.25rem]" src="/svg/dashed_l.svg"/>
      </div>
      <div class="w-[8.25rem] flex justify-between">
        <p class="w-4 text-xs bg-[#FDB782] text-center rounded-xl">B</p>
        <p class="w-4 text-xs bg-[#7FE453] text-center rounded-xl">C</p>
      </div>
      <div class="w-[10.75rem] flex justify-between">
        <ion-icon class="w-14" src="/svg/dashed_m.svg"/>
        <ion-icon class="w-14" src="/svg/dashed_m.svg"/>
      </div>
      <div class="w-[11.75rem] flex justify-between">
        <p class="w-4 text-xs bg-[#E59B62] text-center rounded-xl">B1</p>
        <p class="w-4 text-xs bg-[#E59B62] text-center rounded-xl">B2</p>
        <p class="w-4 text-xs bg-[#69D03C] text-center rounded-xl">C1</p>
        <p class="w-4 text-xs bg-[#69D03C] text-center rounded-xl">C2</p>
      </div>
      <div class="w-[12.875rem] flex justify-between">
        <ion-icon class="w-8" src="/svg/dashed_s.svg"/>
        <ion-icon class="w-8" src="/svg/dashed_s.svg"/>
        <ion-icon class="w-8" src="/svg/dashed_s.svg"/>
        <ion-icon class="w-8" src="/svg/dashed_s.svg"/>
      </div>
      <div class="w-[13.75rem] flex justify-between">
        <p class="w-4 text-xs bg-[#E89E66] text-center rounded-xl" v-for="i in 4">...</p>
        <p class="w-4 text-xs bg-[#7EC361] text-center rounded-xl" v-for="i in 4">...</p>
      </div>
      <span class="mt-[20px] text-xs text-center">
        {{ $t('viewsSpread.agentOld7') }}
      </span>
      <div class="w-[12.5rem] mt-[16px] px-[10px] py-[7px] rounded-[.625rem] bg-[#090F1F] text-xs text-[#66C7BC]">
        <div class="flex flex-col w-auto">
          <label>{{ $t('viewsSpread.agentOld8') }} A</label>
          <div class="flex justify-between">
            <span>2,000,000.00</span><span>{{ $t('viewsSpread.agentOld9') }} 13</span>
          </div>
        </div>
      </div>
      <div class="w-[12.5rem] mt-[16px] px-[10px] py-[7px] rounded-[.625rem] bg-[#090F1F] text-xs text-[#FDB782]">
        <div class="flex flex-col w-auto">
          <label>{{ $t('viewsSpread.agentOld10') }} B</label>
          <div class="flex justify-between">
            <span>500,000.00</span><span>{{ $t('viewsSpread.agentOld9') }} 10</span>
          </div>
        </div>
      </div>
      <div class="w-[12.5rem] mt-[16px] px-[10px] py-[7px] rounded-[.625rem] bg-[#090F1F] text-xs text-[#7EC361]">
        <div class="flex flex-col w-auto">
          <label>{{ $t('viewsSpread.agentOld10') }} C</label>
          <div class="flex justify-between">
            <span>200,000.00</span><span>{{ $t('viewsSpread.agentOld9') }} 8</span>
          </div>
        </div>
      </div>
      <div class="w-[12.5rem] mt-[16px] px-[10px] py-[7px] rounded-[.625rem] bg-[#090F1F] text-xs text-center">
        {{ $t('viewsSpread.agentOld11') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
