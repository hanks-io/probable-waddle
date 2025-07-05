<!-- 批量优惠领取弹窗 -->
<template>
  <div class="warpper">
    <div class="content">
      <!-- 宝箱开启动画 -->
      <div class="open">
        <div class="box-open">
          <img v-show="!showReward" class="openArt" src="@/assets/svg/bonusModal/giftBoxOpen.png" alt="动画">
          <img v-show="showReward" class="normalArt" src="@/assets/svg/bonusModal/giftBoxNormal.png" alt="动画">
          <div v-show="showReward" class="text-warpper">
            <ion-img v-show="showReward" class="coin" src="/svg/bonusModal/coin.svg"></ion-img>
            <p class="reward">+ {{ convertMoneyToShow(rewardAmount) }}</p>
          </div>
          <div v-show="showReward" class="boxBottom">
            <div v-show="showReward" class="btn-remark" >{{ props.data.popUpRemark }}</div>
            <div v-show="showReward" class="btn-receive" @click="receiveHandle">{{ $t('activity.bathReward04') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IonImg, modalController } from "@ionic/vue";
import { activityApplyApi } from "@/api/activity";
import { convertMoneyToShow } from "@/utils/custom";
import { useThrottleFn } from '@vueuse/core'
import { showToast } from "@/utils/toast";
import { useI18n } from '@/hooks/useI18n';

const props = defineProps<{ data: any }>()

const userStore = useUserStore();
const { t } = useI18n();

const showReward = ref(false); // 是否显示奖励
const rewardAmount = ref(props.data.amount); // 奖励金额
const isClicked = ref(false); // 是否已经点击过,进行节流

// 开启宝箱
const openHandle = async () => {
  setTimeout(() => {
    showReward.value = true;
  }, 1600);
}

// 领取彩金
const receiveHandle = useThrottleFn(async () => {
  // 如果已经点击过，直接返回，不执行任何操作
  if (isClicked.value) {
    return;
  }
  
  // 设置为已点击，防止重复点击
  isClicked.value = true;
  
  try {

    const res = await activityApplyApi({
      id: props.data.id as number,
      applyInfo: {
        type: props.data.type,
        info: {
          userId: userStore.user?.userId!,
        },
      },
    })
    if (res) {
      userStore.getAssets();
      userStore.setBatchDiscountList(props.data.id+''+userStore.user?.userId);
    }
    else {
      showToast(t('activity.bathReward06'));
    }

  } catch (error) {
    console.error(error);
  } finally {
    const modal = await modalController.getTop();
    modal?.dismiss();
  }
}, 1000);

onMounted(() => {
  openHandle()
})

</script>

<style lang="less" scoped>
:global(ion-modal#bonusModal::part(content)) {
  --height: 100%;
  --max-width: 30.375rem;
}

.content {
  width: 100%;
  height: 100%;
  .flex-center();
}

.main-text {
  color: #F8FF7A;
  text-align: center;
  text-shadow: 0.125rem 0 0 #d72f2f,
    /* 右 */
    0 0.125rem 0 #d72f2f,
    /* 下 */
    -0.125rem 0 0 #d72f2f,
    /* 左 */
    0 -0.125rem 0 #d72f2f,
    /* 上 */
    0.125rem 0.125rem 0 #d72f2f,
    /* 右下 */
    -0.125rem 0.125rem 0 #d72f2f,
    /* 左下 */
    0.125rem -0.125rem 0 #d72f2f,
    /* 右上 */
    -0.125rem -0.125rem 0 #d72f2f;
  /* 左上 */
  text-transform: uppercase;
}

.open {
  width: 24.375rem;
  height: 24.375rem;
  position: relative;

  .box-open {
    width: 28rem;
    height: 28rem;
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    .flex-center();

    .openArt {
      width: 21.75rem;
      height: 22.1875rem;
      position: absolute;
      top: 50%;
      left: 47%;
      transform: translate(-50%, -50%);
    }

    .normalArt {
      width: 22.5rem;
      height: 19.125rem;
      position: absolute;
      top: 44%;
      left: 45.5%;
      transform: translate(-50%, -50%);
    }

    .text-warpper {
      width: 100%;
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      .flex-center();

      .coin {
        width: 2.625rem;
        height: 3.1719rem;
      }

      .reward {
        .main-text();
        font-size: 2.625rem;
        font-style: normal;
        font-weight: 700;
        line-height: 2.5;
      }
    }

    .boxBottom {
      width: 100%;
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);

      .btn-receive {
        width: 8.875rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        background: var(--color-background-fill-active-primary, #3A8EE3);
        text-align: center;
        font-size: 0.875rem;
        font-weight: 700;
        line-height: 2.5rem;
        color: #fff;
        text-transform: uppercase;
        margin: 0.75rem auto 0;
      }

      .btn-remark {
        width: 17.5rem;
        margin: 0 auto 0;
        color: #fff;
        text-align: center;
        font-size: 0.875rem;
        margin-top: 13rem;
        font-weight: 700;
      }
    }
  }
}

.warpper {
  width: 100%;
  height: 100%;
  font-family: Inter;
  .flex-center();
}



// 宝箱光圈动画
.open::before {
  content: "";
  background: transparent;
  border: 0.375rem solid #fff;
  display: inline-block;
  width: 0.0625rem;
  height: 0.0625rem;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  animation: shiny 4s ease infinite;
}

@keyframes shiny {
  0% {
    opacity: 0;
    width: 0rem;
    height: 0rem;
  }

  80% {
    opacity: 0;
    width: 0rem;
    height: 0rem;
  }

  81% {
    opacity: 0.4;
    width: 4.375rem;
    height: 4.375rem;
  }

  100% {
    opacity: 0;
    width: 17.5rem;
    height: 17.5rem;
  }

}
</style>
