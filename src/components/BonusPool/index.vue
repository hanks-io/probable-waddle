<template>
  <div v-if="tenantInfo.switch" class="bonus" @click="bonusClick">
    <progressiveImages class="bonus-img" :src="tenantInfo.background" />
    <ion-label ref="moneyRef" :class="moneyClassName"
    >{{ showMoney }}
    </ion-label>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel } from '@ionic/vue';
  import progressiveImages from '@/components/GameCard/progressiveImages.vue';
  import useLogic from './logic';


  const {
    tenantInfo,
    moneyRef,
    showMoney,
    bonusClick,
    moneyClassName,
  } = useLogic();
</script>

<style lang="less" scoped>
.bonus {
  position: relative;
  width: 22.625rem;
  height: 8.25rem;
  margin-inline: .9375rem;
  // background-color: #fff;

  .bonus-img {
    width: 0;
    
    &.good-img {
      width: 100%;
      height: 100%;
    }
  }
}

.money-1,
.money-2,
.money-3,
.money-4,
.money-5,
.money-6,
.money-7,
.money-8 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-transform: capitalize;
  font-size: 20px;
  font-weight: 700;
}

.money-1,
.money-7,
.money-8 {
  filter:
    drop-shadow(0 0.125rem 0 #6E0412) drop-shadow(0 0.1875rem 0.125rem #000);
  background: linear-gradient(180deg, #FFC41A 16.67%, #FEFFA6 38.67%, #FFC21A 66.67%, #FD6E15 83.33%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.money-2,
.money-4,
.money-5 {
  color: #FFF;
  text-shadow:
    0 0 0.03125rem #6302D3,
    0 0 0.03125rem #6302D3,
    0 0 0.0625rem #6302D3,
    0 0 0.0625rem #6302D3,
    0 0 0.125rem #6302D3,
    0 0 0.125rem #6302D3,
    0 0 0.1875rem #6302D3,
    0 0 0.1875rem #6302D3,
    0 0.1875rem 0.1875rem #33016D,
    0 0.25rem 0.25rem #260052;
  -webkit-text-stroke-width: 2;
  -webkit-text-stroke-color: #000;
}

.money-3 {
  filter:
    drop-shadow(0 1px 1px #EE1E00) drop-shadow(0 -1px 0 #FFF148) drop-shadow(0 -1px 0 #FFFDC2);
  background: linear-gradient(180deg, #250A18 18.75%, #752525 75.83%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.money-6 {
  filter:
    drop-shadow(0 0.0625rem 0.0625rem #6E0412) drop-shadow(0 0.0625rem 0.0625rem #fc0505);
  background: linear-gradient(180deg, #FFFDC2 0%, #FFF148 50%, #fc0505 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.money-1 {
  bottom: 1.375rem;
}

.money-2 {
  bottom: 1.375rem;
}

.money-3 {
  bottom: 1.375rem;
}

.money-4 {
  bottom: 1.375rem;
}

.money-5 {
  bottom: 1.75rem;
}

.money-6 {
  bottom: 1.5rem;
}

.money-7 {
  bottom: 1.625rem;
}

.money-8 {
  bottom: 1.625rem;
}
</style>
