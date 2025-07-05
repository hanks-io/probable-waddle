import { alertController } from '@ionic/vue';
import { AlertButton } from "@ionic/core/components";
import i18n from '@/i18n';

const { t } = i18n.global

let alert: HTMLIonAlertElement | null = null

async function showAlert(
  header: string = t('main.tips'),
	message: string,
  alertButtons: (AlertButton | string)[] = [t('main.confirm')],
  subHeader: string = ''
) {
  if (alert) {
    await alert.dismiss()
    alert = null
  }
  alert = await alertController.create({
    mode: 'ios',
    header: header,
    message: message,
    buttons: alertButtons,
    cssClass: 'alert-controller',
    subHeader: subHeader,
  })

  await alert.present()
}

export default showAlert