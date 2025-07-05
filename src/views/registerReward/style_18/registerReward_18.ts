import { registerRewardInfoApi } from "@/api/normal";
import { convertMoneyToShow, meanBy } from "@/utils";
import useLogic, { type WheelRewardType } from "@/views/registerReward/logic";
import { RewardType } from "@/enums/types";


import smallImg from "@/assets/img/registerReward/style_18/bonus.png";
import giftBoxImg from "@/assets/img/registerReward/style_18/gift_box.png";
import buttonImg from "@/assets/img/registerReward/style_18/button.png";
import buttonDisImg from "@/assets/img/registerReward/style_18/button-disabled.png";
import thksImg from "@/assets/img/registerReward/style_18/thks.png";
import bgImg from "@/assets/img/registerReward/style_18/bg.png";


//
export default function useRegRew18Logic() {
  const { isNotWinner, merchantCy } = useLogic();

  const multiple = ref(0);
  let applyAppTypeList: string[] = [];
  const deviceTypes = ref("");
  const prizes = ref<any[]>([]);


  const getRegisterRewardInfo = async () => {
    const { wheelReward, applyAppType, auditMultiple } = await registerRewardInfoApi() as {
      wheelReward: WheelRewardType[],
      applyAppType: string,
      auditMultiple: number
    };
    const fontInfo = {
      fontColor: "#fff ",
      fontSize: "12px",
      fontWeight: 700,
      stroke: "#1E2D67",
      strokeWidth: 1
    };
    multiple.value = auditMultiple;
    applyAppTypeList = applyAppType ? applyAppType.split(",") : [];

    const genFIXEDData = (size: "small" | "large") => {
      const imgMap = {
        small: smallImg,
        large: smallImg
      };

      return (rewardValue: number) => {
        return {
          imgs: [{
            src: imgMap[size],
            width: "2.501875rem",
            height: "2.501875rem",
            top: "10%"
          }],
          fonts: [{
            text: `${merchantCy.value} ${convertMoneyToShow(rewardValue)}`,
            ...fontInfo,
            top: "52%"
          }]
        };
      };
    };


    // 18号皮肤
    const wheelRewardMap: ReadonlyMap<Omit<RewardType, "FIXED">, any> = new Map([
      ["RANDOM", {
        imgs: [{
          src: giftBoxImg,
          width: "2.50625rem", // 40.1px
          height: "2.50625rem",
          top: "8%"
        }]
      }],
      ["THANKS", {
        imgs: [{
          src: thksImg,
          width: "2rem",
          height: "2rem",
          top: "6%",
          rotate: true
        }],
        fonts: [{
          text: "Thanks",
          ...fontInfo,
          top: "50%"
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
      width: "10.4rem",
      height: "10.4rem",
      top: "-5.2rem"
    }]
  }]);

  const blocks = [{
    imgs: [{
      src: bgImg,
      width: "100%",
      top: "0%",
      rotate: true
    }]
  }];

  return {
    getRegisterRewardInfo,
    buttons,
    blocks,
    prizes,
    multiple
  };

}