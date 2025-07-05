/**
 * capacitor是打包app的
 * capacitor/keyboard是app专用键盘
 */
import { ObjectDirective, VNode, DirectiveBinding } from "vue";
import { Keyboard } from "@capacitor/keyboard";
import { useSystemStore } from '@/store/system';
import { PLATFORM } from '@/enums/device';

const { platform } = useSystemStore();
// 显示键盘时，隐藏元素
const hateKeyboard: ObjectDirective = {
	mounted: (el, binding, vnode) => {
        const handleKeyboardDidShow = () => {
            el.style.display = "none"; // 隐藏元素示例代码
        };

        const handleKeyboardDidHide = () => {
            el.style.display = ""; // 显示元素示例代码
        };
        // 仅android有Keyboard
        if (platform === PLATFORM.ANDROID) {
            Keyboard.addListener("keyboardWillShow", handleKeyboardDidShow);
            Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide);
        }
	},
	beforeUnmount: (el, binding, vnode) => {
        if (platform === PLATFORM.ANDROID) {
            // 在组件卸载前移除所有事件监听器
            Keyboard.removeAllListeners();
        }
	},
};

export default hateKeyboard;

