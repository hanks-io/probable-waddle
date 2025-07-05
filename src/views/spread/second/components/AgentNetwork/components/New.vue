<!-- 推广说明 -->
<template>
  <div class="m-2.5 border pb-4 border-[#2A324E] text-[.625rem] text-center rounded-[.625rem]">
    <div class="mx-4 py-2.5 px-4 flex border-b border-[#2A324E]">
      <div class="people w-10 h-10 rounded-full flex items-end justify-center">
        <p class="bg-[#FBA531] w-3 h-3 text-[.5rem] text-center rounded-full">A</p>
      </div>
      <div class="flex-1 text-center">
        <p>{{ $t('viewsSpread.agentNew1') }}</p>
        <p><span class="text-[#FBA531]">80</span><span>/10000</span></p>
      </div>
    </div>
    <p class="my-1.5 text-[#FBA531]">1830</p>
    <p >{{ $t('viewsSpread.agentNew2') }}</p>
    <p class="my-1.5 text-[#FBA531]">1440</p>
    <p> {{ $t('viewsSpread.agentNew3') }}</p>
  </div>
  <div class="flex justify-between relative text-[.625rem] i18n-padd">
    <div class="relative rotate-[-30deg] text-center w-24 mr-2.5 i18n-left">
      <p class="my-1.5">{{ $t('viewsSpread.agentNew4') }}</p>
      <p class="text-[#FBA531] mb-4">960</p>
      <ion-icon class="my-1.5 text-[5rem] absolute top-0 left-[.5rem] rotate-[30deg]" src="/svg/spread/arrow_right.svg"/>
      <p>{{ $t('viewsSpread.agentNew5') }}<span class="text-[#FBA531]">390</span></p>
    </div>
    <div class="relative rotate-[30deg] text-center w-24 mr-2.5 i18n-right">
      <p class="my-1.5">{{ $t('viewsSpread.agentNew6') }}</p>
      <p class="text-[#FBA531] mb-4">160</p>
      <ion-icon class="my-1.5 text-[5rem] absolute left-[.5rem] top-0 rotate-[-30deg]" src="/svg/spread/arrow_left.svg"/>
      <p>{{ $t('viewsSpread.agentNew7') }}<span class="text-[#FBA531]">0</span></p>
    </div>
    <div class="absolute w-full flex items-center flex-col pt-5">
      <ion-icon class="text-[#FBA531] text-[3.25rem]" src="/svg/spread/arrow_up.svg"/>
      <p>{{ $t('viewsSpread.agentNew30') }}</p>
      <p class="text-[#FBA531]">320</p>
    </div>
  </div>
  <div class="flex justify-around px-2 text-[.625rem] text-center">
    <div class="flex-1 flex flex-col items-center mx-[.3125rem]">
      <div class="people w-10 h-10 rounded-full flex items-end justify-center">
        <p class="bg-[#3139FB] w-3 h-3 text-[.5rem] rounded-full">B1</p>
      </div>
      <div class="border border-[#9BA7BE] rounded-[.3125rem]">
        <div class="h-20 px-1 flex flex-col justify-center items-center">
          <p class="text-[#8F97AC]">{{ $t('viewsSpread.agentNew8') }}</p>
          <p class="text-white"><span class="text-[#FBA531]">50</span>/120K</p>
        </div>
        <div class="h-[1px] w-full bg-[#566488]" />
        <p class="h-11 px-0.5 flex justify-center items-center">
          {{ $t('viewsSpread.agentNew9') }} 120K
        </p>
      </div>
    </div>
    <div class="flex-1 flex flex-col items-center mx-[.3125rem]">
      <div class="people w-10 h-10 rounded-full flex items-end justify-center">
        <p class="bg-[#3139FB] w-3 h-3 text-[.5rem] rounded-full">B2</p>
      </div>
      <div class="border border-[#9BA7BE] rounded-[.3125rem]">
        <div class="h-20 px-1 flex flex-col justify-center items-center">
          <p class="text-[#8F97AC]">B2 {{ $t('viewsSpread.agentNew10') }}</p>
        </div>
        <div class="h-[1px] w-full bg-[#566488]" />
        <p class="h-11 px-0.5 flex justify-center items-center">
          {{ $t('viewsSpread.agentNew9') }} 40K
        </p>
      </div>
    </div>
    <div class="flex-1 flex flex-col items-center mx-[.3125rem]">
      <div class="people w-10 h-10 rounded-full flex items-end justify-center">
        <p class="bg-[#3139FB] w-3 h-3 text-[.5rem] rounded-full">B3</p>
      </div>
      <div class="border border-[#9BA7BE] rounded-[.3125rem]">
        <div class="h-20 px-1 flex flex-col justify-center items-center">
          <p class="text-[#8F97AC]">{{ $t('viewsSpread.agentNew11') }}</p>
          <p class="text-white"><span class="text-[#FBA531]">80</span>/10K</p>
        </div>
        <div class="h-[1px] w-full bg-[#566488]" />
        <p class="h-11 px-0.5 flex justify-center items-center">
          {{ $t('viewsSpread.agentNew9') }} 20K
        </p>
      </div>
    </div>
  </div>
  <div class="flex">
    <div class="w-1/3 text-center pl-3.5 pt-3">
      <ion-icon class="text-2xl" src="/svg/spread/arrow_small_up.svg"/>
    </div>
    <div class="w-1/3">
      <ion-icon class="text-5xl" src="/svg/spread/arrow_small_left.svg"/>
    </div>
    <div class="w-1/3 text-center pr-1 pt-3">
      <ion-icon class="text-2xl" src="/svg/spread/arrow_small_up.svg"/>
    </div>
  </div>
  <div class="flex justify-around px-2 text-[.625rem] text-center">
    <div class="flex-1 flex flex-col items-center mx-[.3125rem]">
      <div class="people w-10 h-10 rounded-full flex items-end justify-center">
        <p class="bg-[#3139FB] w-3 h-3 text-[.5rem] rounded-full">C1</p>
      </div>
      <div class="border border-[#9BA7BE] rounded-[.3125rem]">
        <div class="h-20 px-1 flex flex-col justify-center items-center">
          <p class="text-[#8F97AC]">C1 {{ $t('viewsSpread.agentNew10') }}</p>
        </div>
        <div class="h-[1px] w-full bg-[#566488]" />
        <p class="h-11 px-0.5 flex justify-center items-center">
          {{ $t('viewsSpread.agentNew9') }} 100K
        </p>
      </div>
    </div>
    <div class="flex-1 flex flex-col items-center mx-[.3125rem]">
      <div class="people w-10 h-10 rounded-full flex items-end justify-center">
        <p class="bg-[#3139FB] w-3 h-3 text-[.5rem] rounded-full">C2</p>
      </div>
      <div class="border border-[#9BA7BE] rounded-[.3125rem]">
        <div class="h-20 px-1 flex flex-col justify-center items-center">
          <p class="text-[#8F97AC]">C2 {{ $t('viewsSpread.agentNew10') }}</p>
        </div>
        <div class="h-[1px] w-full bg-[#566488]" />
        <p class="h-11 px-0.5 flex justify-center items-center">
          {{ $t('viewsSpread.agentNew9') }} 30K
        </p>
      </div>
    </div>
    <div class="flex-1 flex flex-col items-center mx-[.3125rem]">
      <div class="people w-10 h-10 rounded-full flex items-end justify-center">
        <p class="bg-[#3139FB] w-3 h-3 text-[.5rem] rounded-full">C3</p>
      </div>
      <div class="border border-[#9BA7BE] rounded-[.3125rem]">
        <div class="h-20 px-1 flex flex-col justify-center items-center">
          <p class="text-[#8F97AC]">C3 {{ $t('viewsSpread.agentNew10') }}</p>
        </div>
        <div class="h-[1px] w-full bg-[#566488]" />
        <p class="h-11 px-0.5 flex justify-center items-center">
          {{ $t('viewsSpread.agentNew9') }} 3000K
        </p>
      </div>
    </div>
  </div>
  <div class="mx-2.5 p-2.5 border text-[.625rem] border-[#566488] rounded-[.625rem]">
    <p>
      {{ $t('viewsSpread.agentNew12') }}:<br>
      {{ $t('viewsSpread.agentNew13') }}
    </p>
    <p class="my-2.5">
      {{ $t('viewsSpread.agentNew14') }}
    </p>
    <p>
      {{ $t('viewsSpread.agentNew15') }}<br>
      {{ $t('viewsSpread.agentNew16') }}
      {{ $t('viewsSpread.agentNew18') }}<br>
      (120000+40000+20000) x 80/10000=<span class="text-[#FBA531]">1440</span><br>
      {{ $t('viewsSpread.agentNew29') }}<br>
      (100000+30000) x 50/10000=<span class="text-[#FBA531]">650</span><br>
      {{ $t('viewsSpread.agentNew19') }}<br>
      3 milhões x 80/10000=<span class="text-[#FBA531]">24000</span>
    </p>
    <p class="my-2.5">
      {{ $t('viewsSpread.agentNew20') }}<br>
      {{ $t('viewsSpread.agentNew21') }}<br>
      {{ $t('viewsSpread.agentNew22') }}<br>
      {{ $t('viewsSpread.agentNew23') }}<span class="text-[#FBA531]">0</span>
    </p>
    <p>
      {{ $t('viewsSpread.agentNew24') }}<br>
      {{ $t('viewsSpread.agentNew25') }}<br>
      {{ $t('viewsSpread.agentNew26') }}<br>
      {{ $t('viewsSpread.agentNew27') }}<br>
      {{ $t('viewsSpread.agentNew28') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

</script>

<style scoped lang="less">
div.people {
  background: url('/icons/spread/people.png'), #FFF;
  background-size: 100% 100%;
}
.i18n-padd {
  padding: 1.5rem 0;
}
.i18n-left {
  margin-left: 0.8rem;
}
.i18n-right {
  margin-right: 0.78rem;
}
</style>
