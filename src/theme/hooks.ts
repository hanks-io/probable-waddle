import { ActivityNames } from '@/router/modules/activity';
import { useTenantStore } from "@/store/tenant";
import firstMystLightBlue, { specialSkinSettings as firstMystLightBlueSpecialSkinSettings } from '@/theme/configuration/first/mystlight-blue';
import firstMidnightPurple, { specialSkinSettings as firstMidnightPurpleSpecialSkinSettings } from '@/theme/configuration/first/midnight-purple';
import firstNeoBlue, { specialSkinSettings as firstNeoBlueSpecialSkinSettings } from '@/theme/configuration/first/neo-blue';
import firstPhantomBlue, { specialSkinSettings as firstPhantomBlueSpecialSkinSettings } from '@/theme/configuration/first/phantom-blue';
import firstGoldshineGreen from '@/theme/configuration/first/goldshine-green';
import firstYellowDark from '@/theme/configuration/first/yellow-dark';
import { SpreadSubPageConfig, SpreadSubPageNames, spreadTemplateConfig } from "@/theme/templateConfigs/spread";
import { activityConfigs } from './templateConfigs/activityConfig';
import { mainPageTemplateConfig } from "@/theme/templateConfigs/mainPage";

type ThemeConfig = {
  skin: string;
  theme: string;
  home?: string;
  color: string;
  newSkin?: string;
  configuration?: any;
  specialSkinSettings?: any;
  activityConfig?: {
    [key in keyof typeof ActivityNames]?: {
      template?: string;
    };
  };
  spreadConfig?: {
    [key in keyof SpreadSubPageNames]: SpreadSubPageConfig
  };
};

// 主题皮肤配置
const themeConfig: Record<string, ThemeConfig> = {
  // 线上商户旧版本皮肤编号兼容处理，不能删除
  "H5Dark:DarkGreen": { skin: "first", theme: "green-dark", color: '#22262E' },
  "H5Dark:GoldenYellow": { skin: "first", theme: "yellow-dark", color: '#262624' },
  "H5Dark:BluePurple": { skin: "first", theme: "purple-light", color: '#6526db' },

  // 新版本皮肤编号
  "Layout2:DarkGreen": { skin: "first", theme: "green-dark", color: '#22262E' }, // 1号皮肤
  "Layout2:GoldenYellow": { skin: "first", theme: "yellow-dark", color: '#262624', configuration: firstYellowDark },// 2号皮肤
  "Layout2:BluePurple": { skin: "first", theme: "purple-light", color: '#6526db' },// 3号皮肤
  "Layout3:AmberPurple": { skin: "second", theme: "amber-purple", color: '#262346' },// 4号皮肤
  "Layout1:Blue": { skin: "default", theme: "blue-default", color: '#090F1F' },// 5号皮肤
  "Layout1:Green": { skin: "default", theme: "green-default", color: '#2B4F14' },// 6号皮肤
  "Layout1:BlueV01": { skin: "default", theme: "blue-default", color: '#090F1F' },// 7号皮肤
  "Layout1:GreenV01": { skin: "default", theme: "green-default", home: 'v01', color: '#2B4F14' },// 8号皮肤
  "Layout1:GreenV02": { skin: "default", theme: "green-default", home: 'v02', color: '#2B4F14' },// 9号皮肤
  "Layout1:Blue_V01": { skin: "default", theme: "blue-default", home: 'v01', color: '#090F1F' },// 10号皮肤
  "Layout1:AmberPurple": { skin: "default", theme: "amber-purple", color: '#262346' },// 11号皮肤
  "Layout1:PineGreenV01": { skin: "default", theme: "forest-green", home: 'v01', color: '#004d37' },// 12号皮肤
  "Layout1:PineGreenV02": { skin: "default", theme: "forest-green", home: 'v02', color: '#004d37' },// 13号皮肤
  "Layout1:BlueV02": { skin: "default", theme: "blue-default", home: 'v02', color: '#090F1F' },// 14号皮肤
  "Layout1:AmberPurpleV01": { skin: "default", theme: "amber-purple", home: 'v01', color: '#262346' },// 15号皮肤
  "Layout1:AuroraYellow": { skin: "default", theme: "auroral-yellow", color: '#24221F' },// 16号皮肤
  "Layout2:PhantomBlue": { skin: "first", theme: "phantom-blue", color: '#1a1f30', newSkin: 'new-skin-symbol',configuration: firstPhantomBlue, specialSkinSettings: firstPhantomBlueSpecialSkinSettings },// 17号皮肤
  "Layout2:NeoBlue": { skin: "first", theme: "neo-blue", color: '#1d2a55', newSkin: 'new-skin-symbol',configuration: firstNeoBlue, specialSkinSettings: firstNeoBlueSpecialSkinSettings },// 18号皮肤
  "Layout2:MystLightBlue": { skin: "first", theme: "mystlight-blue", color: '#dde8ff', newSkin: 'new-skin-symbol',configuration: firstMystLightBlue, specialSkinSettings: firstMystLightBlueSpecialSkinSettings },// 19号皮肤
  "Layout2:MidnightPurple": { skin: "first", theme: "midnight-purple", color: '#372380', newSkin: 'new-skin-symbol',configuration: firstMidnightPurple, specialSkinSettings: firstMidnightPurpleSpecialSkinSettings },// 20号皮肤
  "Layout2:GoldshineGreen": { skin: "first", theme: "goldshine-green", color: '#0B785C', newSkin: 'new-skin-symbol',configuration: firstGoldshineGreen, specialSkinSettings: firstNeoBlueSpecialSkinSettings },// 21号皮肤
};

/**
 * @description 获取当前配置主题
 */
export const getTheme = () => {
  const viteTheme = import.meta.env.VITE_THEME as keyof typeof themeConfig;
  const skinTwoType = useTenantStore().tenantInfo?.skinTwoType as keyof typeof themeConfig;
  const activityConfig = activityConfigs[(viteTheme || skinTwoType) as keyof typeof activityConfigs] || {};
  const spreadConfig = spreadTemplateConfig[(viteTheme || skinTwoType) as keyof typeof spreadTemplateConfig] || {};
  const mainPageConfig = mainPageTemplateConfig[(viteTheme || skinTwoType) as keyof typeof mainPageTemplateConfig] || {};
  
  const defaultConfig = { skin: "default", theme: "blue-default", color: '#090F1F' };
  const config = themeConfig[viteTheme] || themeConfig[skinTwoType] || defaultConfig;
  return { ...config, activityConfig, spreadConfig, mainPageConfig };
};
