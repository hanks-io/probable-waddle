import UAParser from 'ua-parser-js';
import { BROWSER } from '@/enums/device';

const uaParser = new UAParser();
export default uaParser;


export const isSamsungInternet = () => {
  const browser = uaParser.getBrowser();
  return browser.name === BROWSER.SAMSUNG_INTERNET;
}
