import { convertMoneyToShow } from "@/utils/custom";
import { registerRewardInfoApi, registerRewardApplyApi } from "@/api/normal";

import { meanBy } from "@/utils";
import { AppType } from "@/api/normal/model";
import { PopupType } from "@/components/Popup/data";
import { showPopup } from "@/hooks/ShowPopup";
import { emitter } from "@/utils/event";
import { getTheme } from "@/theme/hooks";
//
import bgImg from "@/assets/img/registerReward/style_1/bg.png";
import bonusImg from "@/assets/img/registerReward/style_1/bonus.png";
import bonusLargeImg from "@/assets/img/registerReward/style_1/bonus-large.png";
import buttonImg from "@/assets/img/registerReward/style_1/button.png";
import buttonDisImg from "@/assets/img/registerReward/style_1/button-disabled.png";
import giftBoxImg from "@/assets/img/registerReward/style_1/gift_box.png";


//
const RewardTypeList = ["RANDOM", "THANKS", "FIXED"] as const;
type RewardType = typeof RewardTypeList[number]

export interface WheelRewardType {
  rewardType: RewardType,
  rewardValue: number
}

export default function useLogic() {
  const tenantStore = useTenantStore(); // 租户store
  const currentRegionCode = computed(() => tenantStore.tenantInfo?.code); // 租户信息
  const router = useRouter();
  const { t } = useI18n(); // 国际化
  const systemStore = useSystemStore();
  const userStore = useUserStore();
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy);
  const prizes = ref<any[]>([]);
  let awardAmount = 0;
  let wheelRewardList: WheelRewardType[] = [];
  const luckyRef = ref();
  const deviceTypes = ref("");
  const isNotWinner = ref(false);
  const isStart = ref(false);
  const isSpinning = ref(false);
  const multiple = ref(0);
  let applyAppTypeList: string[] = [];
  const getRandomNumber = (num1: number, num2: number) => {
    return Math.floor(Math.random() * (num2 - num1 + 1)) + num1;
  };
  const startCallback = async () => {
    if (isNotWinner.value) return;
    const appType = systemStore.app?.build as AppType;
    isSpinning.value = true;
    const indexMap = new Map([
      [0, 2],
      [-1, 4]
    ]);
    let index = indexMap.get(0);

    if (applyAppTypeList.includes(appType) || !applyAppTypeList.length) {
      luckyRef.value.play();
    } else {
      console.warn(`${appType}不在applyAppTypeList中==applyAppTypeList ===${applyAppTypeList}`);
    }
    try {
      const response = await registerRewardApplyApi({ appType }) as { awardAmount?: number };
      isStart.value = true;
      awardAmount = response?.awardAmount ?? 0;
      const awardIndex = awardAmount === 0
        ? 0
        : wheelRewardList.findIndex(item => item.rewardValue === awardAmount);

      isNotWinner.value = awardAmount === 0;
      index = indexMap.get(awardAmount) ??
        indexMap.get(awardIndex) ??
        awardIndex ??
        2;
    } catch (error) {
      console.error("Register reward error:", error);
      isNotWinner.value = true;
      luckyRef.value.stop(index);
      setTimeout(() => {
        isSpinning.value = false;
      }, getRandomNumber(800, 1000));
      return;
    }


    luckyRef.value.stop(index);
    setTimeout(() => {
      isStart.value = false;
    }, getRandomNumber(800, 1000));


  };


  const navigate = () => {
    userStore.isAlreadyDisplayRegisterReward = true;
    emitter.emit("registerReward/receive-success", {});
    router.push("/main/inicio");
  };


  onBeforeRouteLeave(() => {
    isNotWinner.value = false;
  });
  const endCallback = () => {
    setTimeout(() => {
      isSpinning.value = false;
    }, getRandomNumber(800, 1000));
    if (awardAmount) {
      if (userStore.user) {
        userStore.user = {
          ...userStore.user,
          canUseRegisterRewardInfo: true
        };
      }
      showPopup({
        type: PopupType.BONUS,
        msg: t("registerReward.000020", {
          amount: merchantCy.value + convertMoneyToShow(awardAmount)
        }),
        leftBtnCallback: navigate
      });
    }

  };


  const blocks = [{
    imgs: [{
      src: bgImg,
      width: "100%",
      top: "0%",
      rotate: true
    }]
  }];

  const getRegisterRewardInfo = async () => {
    const { wheelReward, applyAppType, auditMultiple } = await registerRewardInfoApi() as {
      wheelReward: WheelRewardType[],
      applyAppType: string,
      auditMultiple: number
    };
    wheelRewardList = wheelReward;
    const fontInfo = {
      fontColor: "#fff ",
      fontSize: "12px",
      fontWeight: 700
    };
    multiple.value = auditMultiple;
    applyAppTypeList = applyAppType ? applyAppType.split(",") : [];

    const genFIXEDData = (size: "small" | "large") => {
      const imgMap = {
        small: bonusImg,
        large: bonusLargeImg
      };

      return (rewardValue: number) => {
        return {
          imgs: [{
            src: imgMap[size],
            width: size === "small" ? "40px" : "47px",
            height: size === "small" ? "30px" : "36px",
            top: "18%"
          }],
          fonts: [{
            text: `${merchantCy.value} ${convertMoneyToShow(rewardValue)}`,
            ...fontInfo,
            top: "52%"
          }]
        };
      };
    };

    // 普通版1
    const wheelRewardMap: ReadonlyMap<Omit<RewardType, "FIXED">, any> = new Map([
      ["RANDOM", {
        imgs: [{
          src: giftBoxImg,
          width: "53px",
          height: "48px",
          top: "18%"
        }]
      }],
      ["THANKS", {
        fonts: [{
          text: "THANKS",
          ...fontInfo,
          top: "22%"
        }]
      }]
    ]);

    const deviceTypeMap = new Map([
      ["iOSH5", t("registerReward.000012")],
      ["AndroidH5", t("registerReward.000013")],
      ["PWA", t("registerReward.000014")],
      ["APK", t("registerReward.000015")],
      ["iOSApp", t("registerReward.000016")],
      ["iOSBookmark", t("registerReward.000017")],
      ["APKRelease", t("registerReward.000018")],
      ["DesktopOS", t("registerReward.000019")]
    ]);
    deviceTypes.value = `${applyAppTypeList.map(item => deviceTypeMap.get(item as string) ?? "").join(",")}`;

    const getFIXEDSmallRewardValue = genFIXEDData("small");
    const getFIXEDLargeRewardValue = genFIXEDData("large");
    const meanRewardValue = meanBy(wheelReward.filter(item => item.rewardType === "FIXED"), "rewardValue");

    prizes.value = wheelReward.map(item => {
      const { rewardType, rewardValue } = item;
      if (rewardType !== "FIXED") {
        return wheelRewardMap.get(rewardType);
      }
      return rewardValue > meanRewardValue ? getFIXEDLargeRewardValue(rewardValue) : getFIXEDSmallRewardValue(rewardValue);
    });
  };


  const buttons = computed(() => [{
    radius: "30%",
    fonts: [],
    imgs: [{
      src: isNotWinner.value ? buttonDisImg : buttonImg,
      width: "4.625rem",
      height: "4.625rem",
      top: "-2.3rem"
    }]
  }]);


  return {
    getRegisterRewardInfo,
    navigate,
    isSpinning,
    isStart,
    blocks,
    prizes,
    buttons,
    startCallback,
    endCallback,
    currentRegionCode,
    deviceTypes,
    multiple,
    //
    luckyRef,
    isNotWinner,
    merchantCy
  };
}

export const useComponents = () => {
  const { mainPageConfig } = getTheme();

  const templateList = {
    "style_1": () => import(`@/views/registerReward/style_1/index.vue`),
    "style_17": () => import(`@/views/registerReward/style_17/index.vue`),
    "style_18": () => import(`@/views/registerReward/style_18/index.vue`)
  } as const;
  
  // 安全的模板键验证
  const templateKey = mainPageConfig["RegisterReward"]?.template as keyof typeof templateList;
  const validTemplateKey = templateKey && templateKey in templateList ? templateKey : "style_1";
  
  const component = templateList[validTemplateKey];
  return markRaw(defineAsyncComponent(component));
};
