import { registerTrackEvents } from "../ad/ad-tracker";
import { registerPusherEvents } from "../pusher";
import { registerStoreEvents } from "../store/emitter";
import { registerToastEvents } from "../toast/emitter";

export function registerEvent() {
    registerTrackEvents()   // 注册广告事件埋点
    registerPusherEvents()  // 注册推送事件
    registerStoreEvents()   // 注册store事件
    registerToastEvents()   // 注册toast事件
}