import i18n from '@/i18n';

const { t } = i18n.global;

/**
 * @description 倒计时间转为字符串
 */
export function timeToString(time: number) {
  const days = Math.floor(time / 86400);
  const hours = Math.floor(time % 86400 / 3600);
  const minutes = Math.floor(time % 3600 / 60);
  const remainingSeconds = time % 60;
  if (days > 0)
    return `${days}${t('date.days')}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  else
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}