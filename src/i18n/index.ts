import { createI18n } from 'vue-i18n';
export const sysLocale = 'pt-BR';
const cache = {} as Record<string, any>; // 缓存语言包
const loadLocaleData = async (locale: string) => {
  if (cache[locale]) {
    return cache[locale];
  }

  let messages;
  switch (locale) {
    case 'pt-BR':
      messages = await import('./locales/pt_BR.json');
      break;
    case 'en-US':
      messages = await import('./locales/en_US.json');
      break;
    case 'zh-CN':
      messages = await import('./locales/zh_CN.json');
      break;
    case 'id-ID':
      messages = await import('./locales/id_ID.json');
      break;
    case 'hi-IN':
      messages = await import('./locales/hi_IN.json');
      break;
    case 'vi-VN':
      messages = await import('./locales/vi_VN.json');
      break;
    case 'en-PH':
      const en_PH = await import('./locales/en_PH.json');
      const en_US = await import('./locales/en_US.json');
      messages = {
        default: merge(en_US.default, en_PH.default)
      };
      break;
    // 添加其他语言
    default:
      messages = await import('./locales/pt_BR.json'); // 默认语言
  }
  cache[locale] = messages.default;
  return messages.default;
};
// 动态加载语言包
const loadLocaleMessages = async (locale: string) => {
  try {
    const messages = await loadLocaleData(locale);
    i18n.global.setLocaleMessage(locale, messages);
  } catch (error) {
    console.error(`Cannot load locale ${locale}:`, error);
  }
};

const i18n = createI18n({
  legacy: false,      // 设置为 false 来启用 composition API 模式
  locale: sysLocale,  // 默认显示的语言
  messages: {}
})


export const getCurrency = (locale: string) => locale.split('-')[1];

export const getLanguages = () => Object.keys(i18n.global.messages);

export const t = i18n.global.t;

export const locale = i18n.global.locale;

export const loadAsycMassage = loadLocaleMessages;

export default i18n;



