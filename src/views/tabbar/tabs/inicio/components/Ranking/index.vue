<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { getUserTopListApi } from '@/api/normal'
import { convertMoneyToShow, maskMiddle, getImageUrl } from '@/utils'
import { getTheme } from '@/theme/hooks'
const rankingType = ['bet', 'profit', 'bonus', 'commission'] as const
type RankingType = typeof rankingType[number]
interface RankingItem {
  avatar: string
  userId: string
  rankValue: number | string
  rank: string | number
}
const { skin } = getTheme()
const { t } = useI18n()
const tenantStore = useTenantStore();	// 租户信息
const userRankSwitch = computed(() => tenantStore.tenantInfo?.rankConfig?.userRankSwitch)
let intervalId: number | null = null
const titleMap = new Map<RankingType, string>([
  ['bet', t('homeRank.000004')],
  ['profit', t('homeRank.000007')],
  ['bonus', t('homeRank.000006')],
  ['commission', t('homeRank.000005')],
])
const title = ref(titleMap.get('bet'))
const rankingList = ref<RankingItem[]>([])

defineProps<{
  style: string
  loadImage: Record<string, string>
}>()

const getRandomNumber = (min: number = 1, max: number = 20): number => {
  if (min >= max) throw new Error('Min must be less than max');
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomAvatar = () => {
  const list = ['male', 'female']
  const avatarIndex = getRandomNumber(0, list.length - 1)
  const prefix = skin === 'default' ? '' : 'first_'
  return `${prefix}${list[avatarIndex]}_${getRandomNumber()}.jpg`
}

const formatRankItem = (rankItem: RankingItem) => {
  const url = tenantStore?.tenantInfo?.avatarBucket?.url || ''
  return {
    ...rankItem,
    userId: maskMiddle(rankItem.userId),
    rankValue: convertMoneyToShow(rankItem.rankValue),
    avatar: `${url}${rankItem.avatar || getRandomAvatar()}`
  }
}



const getUserTopList = async () => {
  const { rankType, userRankList } = await getUserTopListApi()
  if(!userRankList || !rankType || !userRankList?.length) return
  title.value = titleMap.get(rankType)
  userRankList.sort((a, b) => b.rankValue - a.rankValue)
  topThreeList.value = [
    { ...formatRankItem(userRankList[1]), rank: 2 },
    { ...formatRankItem(userRankList[0]), rank: 1 },
    { ...formatRankItem(userRankList[2]), rank: 3 },
  ]
  rankingList.value = userRankList.slice(3).map((item: RankingItem, index: number) => formatRankItem({ ...item, rank: index + 4 >= 10 ? index + 4 : `0${index + 4}` }))
}


const topThreeList = ref<RankingItem[]>([])
const rankingHeaderList = [t('homeRank.000001'), t('homeRank.000002'), t('homeRank.000003')]
const placeholderHeight = "18.75rem"
const height = ref(300)

const topPosition = ref(0);
const animationId = ref<number | null>(null);
const speed = 0.02;
const itemHeight = 3;
const totalHeight = computed(() => itemHeight * rankingList.value.length)
const lazyComponentRef = useTemplateRef<HTMLDivElement>('placeholderRef');
const shouldRender = shallowRef(false);
// 禁用自动属性继承
defineOptions({
  inheritAttrs: false,
});

const startScroll = () => {
  function animate() {
    topPosition.value -= speed;
    if (topPosition.value <= -totalHeight.value) {
      topPosition.value += totalHeight.value;
    }
    animationId.value = requestAnimationFrame(animate);
  }
  animationId.value = requestAnimationFrame(animate);
};

const stopScroll = () => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
    animationId.value = null;
  }
};


onUnmounted(() => {
  stopScroll()
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
const { stop } = useIntersectionObserver(
  lazyComponentRef,
  async ([{ isIntersecting }]) => {
    if (isIntersecting) {
      shouldRender.value = isIntersecting;
      console.log("LazyComponent: isIntersecting9999", shouldRender.value);
      await getUserTopList()
      stop(); // 停止观察
      nextTick(() => {
        startScroll()
      })
      intervalId = window.setInterval(getUserTopList, 600000);
    }
  },
  {
    rootMargin: '50px 0px',
  }
);

setTimeout(() => {
  height.value = 0
}, 1000)
</script>
<template>
  <template v-if="userRankSwitch">
    <div :style="{ height: `${height}px` }" v-if="height"></div>
    <template v-else>
      <div ref="placeholderRef" class="placeholder" :style="{ height: placeholderHeight }" v-if="!shouldRender">
        <slot name="placeholder"></slot>
      </div>

      <div class="ranking-area" :style="style" v-if="rankingList.length && shouldRender">
        <div class="ranking-header">
          <div class="line"></div>

          <ion-icon :src="getImageUrl('img/inicio/start.svg')" class="ranking-start" />
          <div class="ranking-title">{{ title }}</div>
          <ion-icon :src="getImageUrl('img/inicio/start.svg')" class="ranking-start" />
        </div>
        <div class="top-three-area">
          <div :class="['ranking-item', `ranking-item-${item.rank}`]" v-for="(item, index) in topThreeList"
            :key="item.userId">
            <div class="ranking-avatar">
              <div :class="['avatar-border', `avatar-border-${item.rank}`]"> </div>
              <img :src="item.avatar" alt="" class="avatar-img">
            </div>

            <div class="name">{{ item.userId }}</div>
            <div class="amount">{{ item.rankValue }}</div>
          </div>

          <div class="top-three-bg" :style="{ backgroundImage: `url(${loadImage.icon1})`}"></div>
          <img :src="getImageUrl('img/inicio/ranking-aperture.png')" alt="" class="ranking-aperture">
        </div>
        <ul class="ranking-header-list item-parent">
          <li class="item" v-for="item in rankingHeaderList" :key="item">
            {{ item }}
          </li>
        </ul>
        <div class="ranking-list-container">
          <ul class="ranking-list" :style="{ top: `${topPosition}rem` }">
            <li v-for="(item) in rankingList" :key="item.userId">
              <div class="rank item">{{ item.rank }}</div>
              <div class="ranking-user-info item">
                <img :src="item.avatar" alt="" class="avatar-img">
                <div class="name">{{ item.userId }}</div>
              </div>

              <div class="amount item">{{ item.rankValue }}</div>
            </li>
            <li v-for="(item) in rankingList" :key="`${item.userId}-2`">
              <div class="rank item">{{ item.rank }}</div>
              <div class="ranking-user-info item">
                <img :src="item.avatar" alt="" class="avatar-img">
                <div class="name">{{ item.userId }}</div>
              </div>

              <div class="amount item">{{ item.rankValue }}</div>
            </li>

          </ul>
        </div>

      </div>
    </template>
  </template>
</template>

<style scoped lang="less">
@keyframes scaleFade {
  0% {
    transform: scale(0.5);
    opacity: 1;

  }

  50% {
    transform: scale(2);
    opacity: 0.5;
  }

  100% {
    transform: scale(3.5);
    opacity: 0;
  }
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100%);
  }
}

.itemWidth() {
  .item {
    &:nth-child(1) {
      width: 3.75rem;
    }

    &:nth-child(2) {
      width: 12.5rem;
    }

    &:nth-child(3) {
      width: 6.25rem;
    }

  }
}





#tabbar-tabs-inicio-components-Ranking-index {

  .style(@bgColor: --ep-color-background-fill-surface-raised-L1,
    @lineColor: --ep-color-border-brand,
    @titleColor: --ep-color-text-success,
    @startColor: --ep-color-icon-success,
    @borderColor: --ep-color-border-default,
    @topThreeColor1: --ep-color-text-default,
    @topThreeColor2: --ep-color-text-warning,
    @headerColor: --ep-color-text-weakest,
    @rankColor: --ep-color-text-brand-primary,
    @nameColor: --ep-color-text-weak,
    @amountColor: --ep-color-text-default,
  ) {
    .ranking-area {
      background-color: var(@bgColor);
      width: 100%;
      padding-bottom: 1.25rem;


      .ranking-header {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 3.125rem;
        border-bottom: 1px solid var(@borderColor);

        .ranking-title {
          color: var(@titleColor);
          font-size: var(--ep-font-size-xl, 1.125rem);
          font-weight: var(--ep-font-weight-bold, 700);
          margin: 0 .4375rem;
        }

        .ranking-start {
          color: var(@startColor);
          font-size: var(--ep-font-size-s, .75rem);
        }

        .line {
          position: absolute;
          height: 1px;
          width: 12.5rem;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(90deg, rgba(10, 119, 218, 0.00) 0%, var(@lineColor, #0A77DA) 50%, rgba(10, 119, 218, 0.00) 100%);
        }


      }

      .top-three-area {
        height: 18.5rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        position: relative;

        overflow: hidden;

        .ranking-item-2 {
          margin-top: 5.1875rem;
        }

        .ranking-item-1 {
          margin-top: 2.5625rem;
        }

        .ranking-item-3 {
          margin-top: 5.5rem;
        }

        .ranking-item {
          text-align: center;
          width: 7.8125rem;
          position: relative;
          z-index: 3;

          .ranking-avatar {
            position: relative;
            width: 4.375rem;
            height: 4.375rem;
            overflow: hidden;
            margin: 0 auto;

            .avatar-border {
              width: 100%;
              height: 100%;
              background: url('@/assets/img/inicio/ranking-avatar-border.png') no-repeat;
              background-size: 300% 100%;
              overflow: hidden;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 3;

            }

            .avatar-border-1 {
              background-position: 0 0;
            }

            .avatar-border-2 {
              background-position: 50% 0;
            }

            .avatar-border-3 {
              background-position: 100% 0;
            }

            .avatar-img {
              width: 3.75rem;
              height: 3.75rem;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 1;
            }

          }

          .name {
            color: var(@topThreeColor1);
            font-size: var(--ep-font-size-s, .75rem);
            font-weight: var(--ep-font-weight-bold, 700);
            line-height: 1.125rem;

          }

          .amount {
            color: var(@topThreeColor2);
            font-size: var(--ep-font-size-s, .75rem);
            line-height: 1.125rem;

          }


        }

        .top-three-bg {
          height: 9.75rem;
          width: 23.4375rem;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center center;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .ranking-aperture {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1;
          transform-origin: center center;
          animation: scaleFade 12s ease-out infinite;
        }
      }

      .ranking-header-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 .75rem;
        text-align: center;
        color: var(@headerColor);
        font-size: var(--ep-font-size-s, .75rem);
        font-weight: var(--ep-font-weight-bold, 700);
        line-height: 1.125rem;
        margin-top: .5625rem;


      }

      .ranking-list-container {
        height: 15rem;
        overflow: hidden;
        position: relative;
      }

      .ranking-list {
        position: absolute;
        width: 100%;

        &:hover {
          animation-play-state: paused;
        }

        &::after {
          content: "";
          display: block;
          height: 15rem; // Same as container height
        }

        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          height: 3rem;
          line-height: 3rem;
          .itemWidth();

          .rank {
            color: var(@rankColor);
            font-size: var(--ep-font-size-s, .75rem);
            font-weight: var(--ep-font-weight-medium, 600);
          }

          .ranking-user-info {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: .5rem;

            .avatar-img {
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 50%;
            }

            .name {
              color: var(@nameColor);
              font-size: var(--ep-font-size-s, .75rem);
            }
          }

          .amount {
            color: var(@amountColor);
            font-size: var(--ep-font-size-s, .75rem);
            font-weight: var(--ep-font-weight-medium, 600);
          }
        }
      }


    }




  }
}

.new-skin-symbol {
  #tabbar-tabs-inicio-components-Ranking-index.style();
}
</style>
