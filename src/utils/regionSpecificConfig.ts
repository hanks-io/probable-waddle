// 地区特殊性配置
import { AssetChangeSubType, AssetChangeSubTypes } from '@/enums/types';

/**
 * @description 获取地区账变子类列表
 */
export function getRegionChangeSubTypes(type: string, region: string) {
  let subTypeList: AssetChangeSubType[]= [];
  if (type === 'all') return subTypeList;
  if (type === 'activity') {
    const regionConfig: {[key:string]: AssetChangeSubType} = {
      'PH': 'activity:walletUserActivity',
      'VN': 'activity:walletUserActivity',
      'BR': 'activity:cpfActivity',
    }
    subTypeList = AssetChangeSubTypes.filter(item => {
      return item.indexOf(type) !== -1 && (!Object.values(regionConfig).includes(item));
    });
    regionConfig[region] && subTypeList.push(regionConfig[region]);
  }
  else {
    subTypeList = AssetChangeSubTypes.filter(item => item.indexOf(type) !== -1);
  }
  return subTypeList;
}
