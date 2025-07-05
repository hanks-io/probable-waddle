<template>
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
            gameInfo: {regionCode: item.regionCode, platformCode: item.platformCode, code: item.code || item.gameCode },
            isFavorite: item.isFavorite,
          }"
        >
          <template #gameName v-if="!item.logo && item.externalGameId">
            <span>{{item.name}}</span>
          </template>
        </GameCard>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
  import GameCard from '@/components/GameCard/index.vue';
  import useGameStatus from '@/views/tabbar/tabs/inicio/components/GameWrapper/useGameStatus';
  import useStartSportGame from "@/hooks/useStartSportGame";
  import useLogic from "./logic";

  const { forGameStatus } = useGameStatus();

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

  const {
    pageList,
    onSwiper,
    isHallGame,
    gameHandle,
    showAllGame,
    headOptions,
    virtualSlide,
    onSlideChange,
    gameImageStyle,
    favoriteHandle,
    forPlatformLogo,
  } = useLogic(props);
</script>

<style scoped lang="less">

</style>