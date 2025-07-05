
import { getImageUrl } from '@/utils';

/**
 * @description 公用弹窗类型
 */
export enum PopupType {
    /**Tips */
    TIPS = 1,
    /**账号异常 */
    EXCEPTION = 2,
    /**流水提示 */
    FLOW = 3,
    /**获得彩金 */
    BONUS = 4,
    /**体验金 */
    TRIAL = 5,
    /**新用户专属 */
    NEW_USER_EXCLUSIVE = 6,
}

/**
 * @description 公用弹窗参数类型
 */
export type PopupParams = {
    /**弹窗ID */
    id?: string;
    /**是否允许重复 */
    allowRepeat?: boolean;
    /**弹窗的唯一id */
    uniqueId?: string | number;
    /**是否拦截当前弹窗 */
    checkIntercept?: () => boolean;
    /**弹窗类型 */
    type?: PopupType;
    /**自定义弹窗组件 */
    component?: any;
    /**自定义弹窗数据 */
    data?: any;
    /**内容 */
    msg?: string;
    /**是否显示左边按钮 */
    showLeftBtn?: boolean;
    /**是否显示右边按钮 */
    showRightBtn?: boolean;
    /**左边按钮文案 */
    leftBtnText?: string;
    /**右边按钮文案 */
    rightBtnText?: string;
    /**左边按钮回调 */
    leftBtnCallback?: () => void;
    /**右边按钮回调 */
    rightBtnCallback?: () => void;
    /**按钮是否交换位置 */
    reverseBtn?: boolean;
    /**倒计时启用按钮 */
    countdownEnable?: number;
    /**自定义内容组件 */
    contentComp?: any;
    /**custom props for component */
    [key: string]: any;
}

/**
 * @description 根据弹窗类型和地区获取弹窗背景图
 */
export function getPopupBg(countryCode: string): string {
    const name = 'popup_bg';
    const countryStr = countryCode === 'PH' ? '_PH' : '';
    return getImageUrl(`img/${name}${countryStr}.png`);
}

/**
 * @description 根据弹窗类型获取图标路径
 */
export function getPopupIcon(type: PopupType, countryCode: string): string {
    let name = 'popup_icon001';
    switch (type) {
        case PopupType.TIPS:
        case PopupType.EXCEPTION:
        case PopupType.FLOW:
            name = 'popup_icon001';
            break;
        case PopupType.TRIAL:
            name = 'popup_icon002';
            break;
        case PopupType.BONUS:
            name = 'popup_icon003';
            break;
    }
    const countryStr = countryCode === 'PH' ? '_PH' : '';
    return `/images/popup/${name}${countryStr}.png`;
}
