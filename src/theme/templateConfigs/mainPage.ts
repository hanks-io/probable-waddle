// app 首页相关的模板配置

// 首页功能类型，目前只有一个功能 'RegisterReward'
export type MainPageFeatures = 'RegisterReward';

// 首页配置类型：每个功能可以配置一个模板字符串
export type MainPageConfig = Partial<Record<MainPageFeatures, { template: string }>>;

// 首页模板配置：根据不同布局（如 Layout2:NeoBlue），定义各自的功能模板
export const mainPageTemplateConfig: Record<string, MainPageConfig> = {
  'Layout2:NeoBlue': {
    RegisterReward: { template: 'style_18' },
  },
  'Layout2:PhantomBlue': {
    RegisterReward: { template: 'style_17' },
  },
  'Layout2:MystLightBlue': {
    RegisterReward: { template: 'style_17' },
  },
  'Layout2:MidnightPurple': {
    RegisterReward: { template: 'style_17' },
  },
  'Layout2:GoldshineGreen': {
    RegisterReward: { template: 'style_18' },
  },
};
