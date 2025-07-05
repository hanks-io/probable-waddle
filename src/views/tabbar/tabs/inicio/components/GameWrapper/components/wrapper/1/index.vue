<!-- 分类游戏列表视图 -->
<template>
  <div class="tabbar-tabs-inicio-components-GameWrapper-index">
    <component ref="headRef" :is="headComponent" v-bind="headOptions" @swiperToSlide="swiperToSlide"
      @categoryHandle="categoryHandle" />
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
            <GameCard v-for="item in list" :style="gameImageStyle" :key="Number(item.id)" @click="gameHandle(item)"
              @favoriteHandle="() => favoriteHandle(item)" v-bind="{
                isOwnGame: !!item.externalGameId,
                test: item?.test,
                logo: forPlatformLogo(item),
                status: forGameStatus(item),
                isLogo: isShowPlatformLogo,
                gameInfo: { logoFlag: item.logoFlag },
                isFavorite: item.isFavorite,
              }">
              <template #gameName v-if="!item.logo && item.externalGameId">
                <span>{{ item.name }}</span>
              </template>
            </GameCard>
          </div>
        </swiper-slide>
      </swiper>
    </slot>
    <div class="more" v-if="showAllGame">
      <ion-label class="label">{{ $t('main.Displaying', {
        total: props.gameList.length, quantity: pageList[swiperIndex] ?
          pageList[swiperIndex].length : 0 })}}</ion-label>
      <div class="btn" @click="sizeChange">
        <ion-label class="btn-label">{{ showAll ? $t('main.Collapse') : $t('main.DisplayAll') }}</ion-label>
        <ion-icon slot="end" icon="/svg/circular-arrow.svg" :class="[showAll ? 'active' : '', 'btn-icon']" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { IonLabel, IonIcon } from '@ionic/vue';
import useLogic from "@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapper/logic";
import HorizontalGameCard from '@/components/HorizontalGameCard.vue';
import GameCard from '@/components/GameCard/index.vue';
import useGameStatus from '@/views/tabbar/tabs/inicio/components/GameWrapper/useGameStatus';
import useStartSportGame from "@/hooks/useStartSportGame";


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
  virtualSlide,
  swiperToSlide,
  headComponent,
  onSlideChange,
  gameImageStyle,
  categoryHandle,
  favoriteHandle,
  forPlatformLogo,
} = useLogic(props);

</script>

<style scoped lang="less">
@import './index.less';
</style>
