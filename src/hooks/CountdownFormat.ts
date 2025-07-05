import { Ref } from "vue";
import { delay } from "@/utils/delay";
import i18n from "@/i18n";

const { t } = i18n.global;

export function countdownFormat(time: number) {
  let countdown = '';
  if (time > 0) {
    const days = Math.floor(time / 86400);
    const hours = Math.floor(time % 86400 / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const remainingSeconds = time % 60;
    if (days > 0) {
      countdown = `${days}${t('date.days')}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      countdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  } else {
    countdown = '';
  }
  return countdown;
}

export function countdownFormat1(time: number) {
  let arrTime = ['00', '00', '00', '00'];
  if (time > 0) {
    let days = Math.floor(time / 86400);
    const hours = Math.floor(time % 86400 / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const remainingSeconds = time % 60;
    if (days <= 0) {
      days = 0
    }
    arrTime = [days.toString(), hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), remainingSeconds.toString().padStart(2, '0')]
  } 
  return arrTime;
}