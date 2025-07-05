
import { ZFlowType, type TFlowType } from '@/enums/types';
import i18n from '@/i18n/index';

// 稽核状态
export enum AuditStatus {
    NOT_START = 'notStarted',
    IN_PROGRESS = 'ongoing',
    COMPLETED = 'completed',
}

// 获取稽核类型名称
export function getAuditTypeName(type: TFlowType | null) {
  switch (type) {
    case ZFlowType.enum.RECHARGE:
      return i18n.global.t('option.recharge');
    case ZFlowType.enum.ACTIVITY:
      return i18n.global.t('srcTs.activityDiscounts');
    case ZFlowType.enum.SYSTEM:
      return i18n.global.t('viewsAssets.systemAudit');
    default:
      return '';
  }
};

// 获取稽核状态名称
export function getAuditStatusName(status: AuditStatus) {
  switch (status) {
    case AuditStatus.NOT_START:
      return i18n.global.t('srcTs.notStarted');
    case AuditStatus.IN_PROGRESS:
      return i18n.global.t('srcTs.inProgress');
    case AuditStatus.COMPLETED:
      return i18n.global.t('viewsActivity.completed');
    default:
      return '';
  }
};

// 获取稽核状态颜色
export function getAuditStatusColor(status: AuditStatus) {
  switch (status) {
    case AuditStatus.NOT_START:
      return '#EE4639';
    case AuditStatus.IN_PROGRESS:
      return '#EDC921';
    case AuditStatus.COMPLETED:
      return '#27D48B';
    default:
      return '';
  }
};

export function getAuditStatusColorFirst(status: AuditStatus) {
  switch (status) {
    case AuditStatus.NOT_START:
      return '--color-danger';
    case AuditStatus.IN_PROGRESS:
      return '--color-warning';
    case AuditStatus.COMPLETED:
      return '--color-success';
    default:
      return '';
  }
};
