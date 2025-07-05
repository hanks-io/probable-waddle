
import { emitter } from "../event";
import { useTenantStore } from "@/store/tenant";
import Pusher from "pusher-js";

/**
 * @description 注册事件
 * @param pusher 推送方法实例
 */
export function registerEvents(pusher: Pusher) {
    pusher.bind('user/pay-success', (data: any) => {
        const tenantStore = useTenantStore();

        emitter.emit('user/pay-success', {
            ...data,
            amount: Number(data.amountChange) / 100,
            currency: tenantStore.tenantInfo?.currency || 'USD',
        });
    })

    pusher.bind('user/withdraw-success', (data: any) => {
        const tenantStore = useTenantStore();

        emitter.emit('user/withdraw-success', {
            ...data,
            amount: Number(data.amountChange) / 100,
            currency: tenantStore.tenantInfo?.currency || 'USD',
        });
    })

    pusher.bind('user/reward-success', (data: any) => {
        const tenantStore = useTenantStore();

        emitter.emit('user/reward-success', {
            ...data,
            amount: Number(data.amountChange) / 100,
            currency: tenantStore.tenantInfo?.currency || 'USD',
        });
    })

    pusher.bind('activity/recharge-activity', (data: any) => {
        const tenantStore = useTenantStore();
        
        emitter.emit('activity/recharge-activity', {
            ...data,
            currency: tenantStore.tenantInfo?.currency || 'USD',
        });
    })

    pusher.bind('user/recharge-ad-report', (data: any) => {
        const tenantStore = useTenantStore();
        emitter.emit('user/recharge-ad-report', {
            ...data,
            amount: Number(data.amountChange) / 100,
            currency: tenantStore.tenantInfo?.currency || 'USD',
        });
    })

    pusher.bind('betBy/refresh', (data: any) => {
        // const tenantStore = useTenantStore();
        emitter.emit('betBy/refresh', {
            ...data,
            
        });
    })

    pusher.bind('reward/manual-user-reward', (data: any) => {
        const tenantStore = useTenantStore();

        emitter.emit('reward/manual-user-reward', {
            ...data,
            amount: data.amount,
            currency: tenantStore.tenantInfo?.currency || 'USD',
        });
    })

    pusher.bind('task/newbie_task', (data: any) => {
        const tenantStore = useTenantStore();

        emitter.emit('task/newbie_task', {
            ...data,
            // amount: data.amount,
            currency: tenantStore.tenantInfo?.currency || 'USD',
        });
    })
}
