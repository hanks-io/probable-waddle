import { modalController } from '@ionic/vue';
import { getUrlParam, checkIsSwModal } from '@/utils';
import { getTheme } from '@/theme/hooks'
import { type TDomainInfo } from '@/hooks/useDomain';
import { getRescueDomainApi } from '@/api/normal';
import { checkDomainAvailability } from '@/hooks/ping';

export interface CompulsoryModalProps {
  templateText?: {
    title?: string;
    description?: string;
    commission: number | number[];
    domain?: string | null | boolean;
  };
  buttonType?: 're-domain' | 'install' | string;
}
type DomainAmountConfig = {
  "bonusStatus": "disable" | "enable" | string;
  "giftAmountType": "fixed" | string;
  "giftMinAmount": number;
  "giftMaxAmount"?: number;
  "content": string;
  [key: string]: any;
  forceBomb?: boolean;
  install?: {
    installType: string;
    apkName: string;
    apkUrl: string;
  }
}

type RescueDomainData = {
  rescueDomainList: TDomainInfo[];
  rescueDomainAmountConfig: DomainAmountConfig;
}
/**
 * @description 当域名不可用时显示强制安装弹窗
 */
export default async () => {
  // 检查是否从 Service Worker 打开
  const contentHost = getUrlParam('contenthost') as string;
  // 获取域名配置信息
  const data = contentHost ? await getRescueDomainApi({ domain: contentHost }) : {};
  const { rescueDomainList, rescueDomainAmountConfig } = data as RescueDomainData;
  const conf = rescueDomainAmountConfig;
  const checkIsSw = checkIsSwModal();
  const isShowCompulsoryModal = () => {
    return (checkIsSw && rescueDomainList?.length > 0) // 如果从sw打开且有可用域名，则显示弹窗
      || (checkIsSw && !conf?.installType?.includes('pwa') && conf?.apkName) //如果从sw打开 且 非pwa安装，则显示弹窗
  }
  console.log('isShowCompulsoryModal', isShowCompulsoryModal());
  // 非 SW 且无可用域名时不显示弹窗
  if (!isShowCompulsoryModal()) return;

  // 根据主题加载对应组件
  const { skin } = getTheme();
  const modalComponents = {
    'default': () => import('@/pwa/compulsoryModal/default.vue'),
    'second': () => import('@/pwa/compulsoryModal/second.vue')
  };

  const component = await (modalComponents[skin as keyof typeof modalComponents] || modalComponents['default'])();

  const computedCommission = (conf: DomainAmountConfig) => {
    const isfixed = conf?.giftAmountType?.includes('fixed');
    return !isfixed ? [conf?.giftMinAmount, conf?.giftMaxAmount] : conf?.giftMinAmount
  }
  const availableDomain = await getAvailableDomain(rescueDomainList);
  const channelStore = useChannelStore();
  channelStore.promotionInfo.popupInterval = conf?.forceBomb ? '0' : '1'; // 是否强制弹窗
  const modal = await modalController.create({
    component: component.default,
    id: 'pwa-re-domain-modal',
    componentProps: <CompulsoryModalProps>{
      buttonType: 're-domain',
      templateText: {
        title: conf?.bonusStatus !== 'disable' ? 'ForceBindings.000002' : 'ForceBindings.000003',
        description: conf?.content || '',
        commission: computedCommission(conf) || 0,
        domain: availableDomain,
        install: {
          installType: conf?.installType,
          apkName: conf?.apkName,
          apkUrl: conf?.apkUrl
        }
      }
    }
  });

  modal.present();
}

async function getAvailableDomain(rescueDomainList: TDomainInfo[]) {
  for (const item of rescueDomainList) {
    try {
      const domain = await checkDomainAvailability(item.rescueDomain);
      if (domain) {
        return domain;
      }
    } catch (error) {
      console.error('检查域名可用性失败:', error);
    }
  }
  return null;
}
