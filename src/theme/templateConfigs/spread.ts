// 推广中心-无限极差 模板配置
export type SpreadSubPageNames =
  | 'MyAgency'
  | 'MyPerformance'
  | 'MyCommission'
  | 'PromotionTutorial'
  | 'CommissionRatio'
  | 'DirectAccount'
  | 'DirectData';

export type SpreadSubPageConfig = Partial<Record<SpreadSubPageNames, { template: string }>>;

export const spreadTemplateConfig: Record<string, SpreadSubPageConfig> = {
  'Layout2:PhantomBlue': {
    MyAgency: { template: 'style_18' },
    CommissionRatio: { template: 'style_18' },
  },
  'Layout2:NeoBlue': {
    MyAgency: { template: 'style_18' },
    CommissionRatio: { template: 'style_18' },
  },
  'Layout2:MystLightBlue': {
    MyAgency: { template: 'style_18' },
    CommissionRatio: { template: 'style_18' },
  },
  'Layout2:MidnightPurple': {
    MyAgency: { template: 'style_18' },
    CommissionRatio: { template: 'style_18' },
  },
  'Layout2:GoldshineGreen': {
    MyAgency: { template: 'style_18' },
    CommissionRatio: { template: 'style_18' },
  },
};
