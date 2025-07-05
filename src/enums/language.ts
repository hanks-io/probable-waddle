export enum LanguageEnum {
  "en-US" = 'English',
  "zh-CN" = '中文',
  "pt-BR" = 'Português',
  "id-ID" = 'bahasa Indonesia',
  "hi-IN" = 'हिंदी',
  "en-PH" = 'English',
  "vi-VN" = 'Tiếng Việt',
}

// 支持的语言类型
export type LanguageType = keyof typeof LanguageEnum;

// 支持的语言数组
export const LanguageSupport = Object.keys(LanguageEnum);
