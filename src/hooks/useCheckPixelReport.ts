import { onMounted, onUnmounted } from "vue";
import { firstRechargeStatusApi } from "@/api/personal";
import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";
import { useTenantStore } from "@/store/tenant";
import { emitter } from "@/utils/event";
import { calcTimeDiff, type Time } from "@/utils/date";

export function useCheckPixelReport() {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const tenantStore = useTenantStore();

  let timer: ReturnType<typeof setInterval> | null = null;

  // 首充时间是否在一天内
  const isFirstRechargeWithinOneDay = (firstRechargetime: Time) => {
    const { hour } = calcTimeDiff(firstRechargetime);
    return Math.abs(hour) < 24;
  };

  // 检测首充回传
  const checkFirstRechargeReport = async () => {
    const reportStatus = userStore.getFirstRechargeStatus();
    if (reportStatus) {
      timer && clearInterval(timer);
      timer = null;
      return;
    }

    const isLogin = await appStore.checkUserHasLogin();
    if (!isLogin) return;

    const res = await firstRechargeStatusApi();
    const hasSentFirstRechargeAdData = res?.hasSentFirstRechargeAd;
    if (!hasSentFirstRechargeAdData) return;

    const { userId, hasSentFirstRechargeAd, firstRechargeAmount, orderNo, firstRechargeTime } = hasSentFirstRechargeAdData;

    userStore.setFirstRechargeStatus(hasSentFirstRechargeAd || false);

    // 首充时间不在24小时内可能为老用户，不用回传
    if (firstRechargeTime && !isFirstRechargeWithinOneDay(firstRechargeTime)) {
      userStore.setFirstRechargeStatus(true);
      return;
    }
    
    if (!hasSentFirstRechargeAd && firstRechargeAmount && orderNo) {
      emitter.emit("user/recharge-ad-report", {
        userId,
        tenantId: tenantStore.tenantInfo?.id,
        amount: Number(firstRechargeAmount) / 100,
        changeTwoType: "",
        currency: tenantStore.tenantInfo?.currency || "USD",
        isFirstRecharge: true,
        orderNo: orderNo,
      });
    }
  };

  onMounted(() => {
    // 上架包/马甲包中不需要检测回传
    if (!useSystemStore().isNative) {
      timer = setInterval(checkFirstRechargeReport, 60 * 1000);
    }
  });

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });
}
