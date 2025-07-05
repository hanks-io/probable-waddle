import { registerRewardInfoApi } from "@/api/normal";
import { convertMoneyToShow, getImageUrl, meanBy } from "@/utils";
import useLogic, { type WheelRewardType } from "@/views/registerReward/logic";
import { RewardType } from "@/enums/types";
import { getTheme } from '@/theme/hooks'

import smallImg from "@/assets/img/registerReward/style_17/bonus.png";
import giftBoxImg from "@/assets/img/registerReward/style_17/gift_box.png";
import buttonImg from "@/assets/img/registerReward/style_17/button.png";
import buttonDisImg from "@/assets/img/registerReward/style_17/button-disabled.png";
import thksImg from "@/assets/img/registerReward/style_17/thks.png";


//
export default function useRegRewLogic() {
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
            width: "2.8rem",
            top: "10%"
          }],
          fonts: [{
            text: `${merchantCy.value} ${convertMoneyToShow(rewardValue)}`,
            ...fontInfo,
            top: "50%"
          }]
        };
      };
    };


    // 18号皮肤
    const wheelRewardMap: ReadonlyMap<Omit<RewardType, "FIXED">, any> = new Map([
      ["RANDOM", {
        imgs: [{
          src: giftBoxImg,
          width: "4rem", // 40.1px
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
      width: "9.6rem",
      height: "9.6rem",
      top: "-4.2rem"
    }]
  }]);

  const { theme } = getTheme();
  const bgUrlMap = {
    "phantom-blue": getImageUrl('img/registerReward/style_17/bg.png'),
    "mystlight-blue": getImageUrl('img/registerReward/style_19/bg.png'),
    "midnight-purple": getImageUrl('img/registerReward/style_20/bg.png')
  }

  const blocks = [{
    imgs: [{
      // @ts-ignore
      src: bgUrlMap[theme],
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