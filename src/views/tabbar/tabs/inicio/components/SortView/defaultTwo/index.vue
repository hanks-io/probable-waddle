<!-- 分类游戏列表视图 -->
<template>
  <div>
    <div class="sort-container px-[.5625rem]" v-if="gameList.length">
      <div ref="headRef" class="pt-1 flex items-center pr-[1rem] headerBgImage h-12 pl-[.5625rem]">
        <ion-icon :src="logo" class="mr-1 text-4xl sort" />
        <ion-label class="font-black" >{{ platform.toUpperCase() + " " + $t(`sort.${type}`) }}</ion-label>
        <div class="blueLine bg-[#1680DC] w-[0.0625rem] h-[1.75rem] ml-[0.625rem] mr-[0.5rem]" ></div>
        <ion-label class="tab leading-3 px-[0.1875rem] py-[.1875rem] rounded-[.1875rem] text-right text-[0.75rem]"
          ><span class="font-black">{{ gameList.length }}</span><br><span class="opacity-40">{{ $t('sort.ALL') }}</span></ion-label>
        <div class="flex-1 h-full"></div>
        <ion-icon class="tab bg-[#354165] text-[#1680DC] text-sm px-1.5 py-1.5 rounded-full mx-[.3125rem]" :class="swiperIndex == 0 ? 'none' :''" :icon="arrowBack" @click="swiperToSlide('prev')" />
        <ion-icon class="tab bg-[#354165] text-[#1680DC] text-sm px-1.5 py-1.5 rounded-full" :icon="arrowForward" :class="showAll ? 'none' : swiperIndex == Math.floor(gameList.length / size) ? 'none' :''"
          @click="swiperToSlide()" />
      </div>
      <swiper class="mt-1" @swiper="onSwiper" @slideChange='onSlideChange' :modules="modules" virtual>
        <swiper-slide v-for="(list, i) in pageList" :key="i - 1" :virtualIndex="i - 1">
          <ion-row>
          <ion-col size="3" v-for="item in list" :key="Number(item.id)">
              <GameCard @click="gameHandle(item)" @favoriteHandle="() => favoriteHandle(item)"
                v-bind="{ isOwnGame: !!item.externalGameId, test: item?.test, cardBgStyle: gameCardStyle(item), isShowPlatformLogo: false, isFavorite: item?.isFavorite || false, status: item.status }">
                <template #gameName v-if="!item.logo && item.externalGameId">
                  <span>{{item.name}}</span>
                </template>
              </GameCard>
            </ion-col>
          </ion-row>
        </swiper-slide>
      </swiper>
      <div class="more" v-if="gameList.length > size">
        <ion-label
          class="label">{{ $t('main.Displaying', { total: gameList.length, quantity: pageList[swiperIndex] ? pageList[swiperIndex].length : 0 }) }}</ion-label>
        <div class="btn" @click="sizeChange">
          <ion-label class="btn-label">{{ showAll ? $t('main.Collapse') : $t('main.DisplayAll') }}</ion-label>
          <ion-icon slot="end" icon="/svg/circular-arrow.svg" :class="[showAll ? 'active' : '', 'btn-icon']" />
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
  import { Virtual } from "swiper/modules";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { arrowBack, arrowForward } from "ionicons/icons";
  import { IonImg, IonLabel, IonIcon, IonRow, IonCol } from "@ionic/vue";
  import GameCard from "@/components/GameCard.vue";
  import useSortViewLogic from "../logic";
  
  const props = defineProps({
    type: { type: String, required: true }, // 分类类型
    platform: { type: String, required: true }, // 平台名称
    platformIndex: { type: Number, required: true }, // 平台索引
  });
  
  const modules = [Virtual]; // 轮播图模块
  
  const { logo, gameList, swiperToSlide, onSwiper, gameCardStyle, categoryHandle, favoriteHandle, gameHandle, onSlideChange, swiperIndex } = useSortViewLogic(props);

  const size = 12; // 每页显示游戏数量
  const showAll = ref(false); // 是否显示全部游戏
  // 获取分页后的游戏列表
  const pageList = computed(() => {
    let list = [];
    if (showAll.value) {
      list.push(gameList.value);
    } else {
      for (let i = 0; i < gameList.value.length; i += size) {
        list.push(gameList.value.slice(i, i + size));
      }
    }
    return list;
  });
  // 头部ref
  const headRef = ref(null);
  /**
   * @description 显示全部游戏
   */
  function sizeChange() {
    showAll.value = !showAll.value;
    if (!showAll.value && headRef.value) {
      const { offsetTop } = headRef.value;
      const top = offsetTop - 60;
      // ion-content滚动到指定位置
      const mainContent = document.querySelector('.main-content') as any;
      mainContent.scrollEl.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }

  </script>
  
  <style lang="less" scoped>
  ion-col {
    --ion-grid-column-padding: 0.375rem;
  }
  
  .sort-container {
    background: #1A223A;
    border-radius: 0.625rem;
    margin-bottom: 1rem;
    padding-bottom: 0.375rem;
  }
  .headerBgImage{
    width: calc(100% + 1.125rem);
    margin-left: -0.5625rem;
    background: url('/images/headerTextBg.png') no-repeat left top /70% 100%;
  }
  .blueLine{
    transform: rotate(30deg);
    transform-origin: 50% 50%; /* 以中心为原点 */
  }
  .tab.none {
    pointer-events: none;
    color: #5A6892;
  }
  
  .green-default {
    .sort-container {
      ion-label {
        color: var(--color-text-gray-100);
      }
  
      div:first-child {
        .tab {
          background-color: var(--color-bg-50);
          color: var(--color-text-gray-100);
        }
      }
    }
  }
  
  div ion-icon.sort {
    color: var(--color-icon-platform-sort);
  }
  
  .green-default {
    .sort-container {
      ion-label {
        color: var(--color-text-gray-100);
      }
  
      div:first-child {
        .tab {
          background-color: var(--color-bg-50);
          color: var(--color-text-gray-100);
        }
      }
    }
  }
  
  div ion-icon.sort {
    color: var(--color-icon-platform-sort);
  }

  .more {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-block-start: 0.9375rem;
    padding-block-end: 1.625rem;
    text-transform: capitalize;
    font-size: 0.75rem;
    line-height: 1.5;

    .label {
      color: #566488;
      font-weight: 400;
    }

    .btn {
      color: #1680DC;

      .btn-label {
        font-weight: 600;
      }

      .btn-icon {
        margin-inline-start: 0.1875rem;
        vertical-align: middle;
        transform: rotateX(0deg);
        transition: transform 0.3s ease;
      }

      .active {
        transform: rotateX(180deg);
      }
    }
  }
  </style>
  
