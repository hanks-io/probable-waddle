import { useAppStore } from "@/store/app";
import { useI18n } from "@/hooks/useI18n";
import { useUserStore } from "@/store/user";
import { showLogin } from "@/hooks/ShowLogin";
import { showPopup } from "@/hooks/ShowPopup";
import { toastWhiteList } from "./toastWhiteList";
import { PopupType } from "@/components/Popup/data";
import { ERROR_CODE } from "@/enums/types/errorCode";
import { observable } from "@trpc/server/observable";
import { showMaintenance } from "@/hooks/Maintenance";
import type { AppRouter } from "../../../nuxt/server/logic/trpc/frontend/routers";
import type { TRPCLink } from "@trpc/client";
import { AccountStatus } from '@/enums/common'
import { showToast,hideLoading } from '@/utils'
import router from "@/router";
import { isLoaded } from '@/logic'
import { modalController } from '@ionic/vue';
const { t } = useI18n();

// 处理登录失效
export function handleLoginInvalid(accountStatus: AccountStatus) {
  useUserStore().accountStatus = accountStatus;
  showLogin();
}

// 显示游戏进入弹窗
async function showGameEnterModal() {
  showPopup({
    type: PopupType.EXCEPTION,
    msg: t('activity.freezeAmount'),
    showRightBtn: true,
    leftBtnText: t("viewsActivity.rechargePromotion16"),
    rightBtnText: t("main.cancel"),
    leftBtnCallback: async () => {
      const bool = await useHandleRecharge();
      !bool && router.push('/main/entrar');
    },
    reverseBtn: true,
  });
}

export const errorHandleLink: TRPCLink<AppRouter> = () => {
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      const subscribe = () => {
        const unsubscribe = next(op).subscribe({
          next(value) {
            observer.next(value);
          },
          async error(err) {
            // @ts-expect-error 限制请求
            if (err.meta?.response?.status === 429) {
              showToast(t("toast.error429", { ip: '' }));
              observer.error(err);
              return;
            }
            // @ts-expect-error 未授权
            if (err.meta?.response?.status === 412) {
              const message = JSON.parse(err.message);
              // 600: 站点维护中
              if (message.code === 600) {
                showMaintenance(message.message);
                return;
              }
            }
            // @ts-expect-error
            if (err.meta?.response?.status === 401) {
              try {
                const message = JSON.parse(err.message);
                if (message.code === "UNAUTHORIZED") {
                  await useAppStore().removeToken(); // 移除token
                  useUserStore().removeUser(); // 移除个人信息
                  handleLoginInvalid(AccountStatus.OFFLINE);
                }
              } catch (e) {
                console.error(err.message);
              }
              observer.error(err);
              return;
            }
            // @ts-expect-error 禁止
            if (err.meta?.response?.status === 403) {
              try {
                const message = JSON.parse(err.message);
                if ([ERROR_CODE.LOGIN_BLACKLIST, "USERS:LOGIN",ERROR_CODE.TOKEN_INVALID].includes(message.code)) {
                  await useAppStore().removeToken(); // 移除token
                  useUserStore().removeUser(); // 移除个人信息
                  const loginStatus = message.code === ERROR_CODE.TOKEN_INVALID ? AccountStatus.OFFLINE : AccountStatus.FROZEN; // 登录状态
                  handleLoginInvalid(loginStatus);
                } else {
                  showToast(message.message);
                }
              } catch (e) {
                showToast(t("tip.serverBusy") + `(${err.meta?.response?.status ?? "unknown"})`);
              }
              observer.error(err);
              return;
            }
            if (err.meta?.response?.status === 405) {
              isLoaded.value = true;
              if (router.currentRoute.value.path === '/405') return;

              setTimeout(() => {
                router.push("/405");
              }, 600)

              return;

            }

            try {
              const message = JSON.parse(err.message);
              if (message.code === ERROR_CODE.LOGIN_BLACKLIST) {
                handleLoginInvalid(AccountStatus.FROZEN);
                return observer.error(err);
              }
              else if (message.code === ERROR_CODE.CPF_INVALID) {
                showToast(message?.message);
                return observer.error(err);
              }
              else if (message.code === 10136) {
                showGameEnterModal()
                return observer.error(err);
              }
              else if (message[0]?.code === "invalid_type") {
                //  如果是参数类型错误直接抛出错误(不提示错误信息)
                return observer.error(err);
              } 
              // 推广中心-我的业绩-输入非法id报错处理
              else if (message[0].code === 'too_small') {
                showToast(message[0].message);
                return observer.error(err);
              }
              observer.error(err);
            } catch (e) {
              console.error(err.message);
              observer.error(err);
            }
            if (!toastWhiteList.includes(op.path)) {
              // 判断是否在提示白名单内
              showToast(err.message); // 弹窗提示错误信息
            }
            hideLoading();
          },
          complete() {
            observer.complete();
          },
        });
        return unsubscribe;
      };
      return subscribe();
    });
  };
};
