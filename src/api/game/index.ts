import { appTrpc } from "@/trpc/app.trpc";
import { apiHandle } from "../handle";
import { GameLoginParams, PlatformLoginParams } from "./model";


/**
 * @description 获取游戏URL
 */
export const gameLoginApi = (params: GameLoginParams) => apiHandle(appTrpc.game.login.query, params);

/**
 * @description 获取游戏URL
 */
export const gameEndApi = (userId: number) => apiHandle(appTrpc.game.end.query, { userId });


/**
 * @description 获取BTSports游戏Token信息
 */
export const gameGetSportTokenApi = (userId: number) => apiHandle(appTrpc.game.getSportToken.query, { userId });


/**
 * @description  对接游戏平台api
 */
export const platformLoginApi = (params: PlatformLoginParams) => apiHandle(appTrpc.platform.login.query, params);
