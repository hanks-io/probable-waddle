<!-- 分类游戏列表视图 -->
<template>
  <div class="tabbar-tabs-inicio-components-GameWrapper-index">
    <component
      v-for="item in componentList"
      :key="item.key"
      ref="headRef"
      :is="item.component"
      v-bind="{
        ...item.options,
        ...headOptions,
      }"
      @swiperToSlide="swiperToSlide"
    />
    <slot>
      <div v-if="isHallGame" :class="[showAllGame ? '' : 'onMore', 'card-container']">
        <HorizontalGameCard class="aspect-ratio-card"
          v-for="item of gameList"
          :key="item.id"
          :game="item"
          :platform="{gameType: headOptions.type}"
          @click="() => useStartSportGame({...item, gameType: headOptions.type, platformId: item.id})"
        />
      </div>
      <swiper v-else @swiper="onSwiper" @slideChange="onSlideChange">
        <swiper-slide v-for="(list, i) in pageList" :key="i - 1">
          <div :class="[showAllGame ? '' : 'onMore', 'card-container']" v-if="virtualSlide(i)">
            <div v-if="i === 0 && bonusPoolLayout && tenantStore.tenantInfo?.switch" :class="['bonus-pool-container', bonusPoolLayout?.layout]">
              <div class="bonus-pool-container-top">
                <BonusPool3 class="bonus-pool-container-top-bonus-pool" :loadImage="{ icon1: bonusPoolLayout?.icon1 }" />
                <div class="bonus-pool-container-card-container">
                  <GameCard
                    class="bonus-pool-container-card"
                    v-for="item in list.slice(0, bonusPoolLayout?.size)"
                    :style="gameImageStyle"
                    :key="Number(item.id)"
                    @click="gameHandle(item)"
                    @favoriteHandle="() => favoriteHandle(item)"
                    v-bind="{
                      isOwnGame: !!item.externalGameId,
                      test: item?.test,
                      logo: forPlatformLogo(item),
                      status: forGameStatus(item),
                      isLogo: isShowPlatformLogo,
                      gameInfo: { logoFlag: item.logoFlag, regionCode: item.regionCode, platformCode: item.platformCode, code: item.code || item.gameCode },
                      isFavorite: item.isFavorite,
                    }"
                  >
                    <template #gameName v-if="!item.logo && item.externalGameId">
                      <span>{{item.name}}</span>
                    </template>
                  </GameCard>
                </div>
              </div>
              <GameCard
                v-for="item in list.slice(bonusPoolLayout.size)"
                :style="gameImageStyle"
                :key="Number(item.id)"
                @click="gameHandle(item)"
                @favoriteHandle="() => favoriteHandle(item)"
                v-bind="{
                  isOwnGame: !!item.externalGameId,
                  test: item?.test,
                  logo: forPlatformLogo(item),
                  status: forGameStatus(item),
                  isLogo: isShowPlatformLogo,
                  gameInfo: { logoFlag: item.logoFlag, regionCode: item.regionCode, platformCode: item.platformCode, code: item.code || item.gameCode },
                  isFavorite: item.isFavorite,
                }"
              >
                <template #gameName v-if="!item.logo && item.externalGameId">
                  <span>{{item.name}}</span>
                </template>
              </GameCard>
            </div>
            <template v-else>
              <GameCard
                v-for="item in list"
                :style="gameImageStyle"
                :key="Number(item.id)"
                @click="gameHandle(item)"
                @favoriteHandle="() => favoriteHandle(item)"
                  v-bind="{
                  isOwnGame: !!item.externalGameId,
                  test: item?.test,
                  logo: forPlatformLogo(item),
                  status: forGameStatus(item),
                  isLogo: isShowPlatformLogo,
                  gameInfo: { logoFlag: item.logoFlag, regionCode: item.regionCode, platformCode: item.platformCode, code: item.code || item.gameCode },
                  isFavorite: item.isFavorite,
                }"
              >
                <template #gameName v-if="!item.logo && item.externalGameId">
                  <span>{{item.name}}</span>
                </template>
              </GameCard>
            </template>
          </div>
        </swiper-slide>
      </swiper>
    </slot>
    <CShowAll v-if="showAllGame" />
  </div>
</template>

<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import useLogic from "@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapper/logic";
  import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
  import GameCard from '@/components/GameCard/index.vue';
  import useGameStatus from '@/views/tabbar/tabs/inicio/components/GameWrapper/useGameStatus';
  import useStartSportGame from "@/hooks/useStartSportGame";
  import CShowAll from '@/views/tabbar/tabs/inicio/components/GameWrapper/components/showAll/2/index.vue'
  import BonusPool3 from '@/components/BonusPool/3/index.vue';
  
  const props = defineProps({
    row: { type: Number, default: 2 }, // 每页展示行数
    size: { type: Number, default: 6 }, // swiper每页展示数量
    logoType: { type: String, default: '1' }, // logo类型
    titleType: { type: String, default: '1' }, // 标题类型
    gameList: { type: Array, required: true }, // 游戏列表
    platform: { type: Object }, // 平台信息(厂商类型是游戏类型分类不会传入平台信息，用于区分热门列表)
    headType: { type: String, required: true }, // 头部类型
    platformId: { type: String, required: true }, // 平台id
    isShowPlatformLogo: { type: Boolean, default: true }, // 是否展示平台logo
    isShowAll: { type: Boolean, default: false }, // 是否展示全部
    componentList: {
      type: Array,
      default: () => []
    },
  });

  const { forGameStatus } = useGameStatus();

  const {
    headRef,
    showAll,
    pageList,
    onSwiper,
    isHallGame,
    sizeChange,
    gameHandle,
    showAllGame,
    headOptions,
    swiperIndex,
    tenantStore,
    virtualSlide,
    swiperToSlide,
    onSlideChange,
    gameImageStyle,
    favoriteHandle,
    forPlatformLogo,
    bonusPoolLayout,
  } = useLogic(props);

</script>

<style scoped lang="less">
@import './index.less';  
</style>
