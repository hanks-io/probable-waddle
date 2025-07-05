import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue';
import VueLuckyCanvas from '@lucky-canvas/vue'
import router from './router';
import App from './App.vue'
import i18n from './i18n';
import genManifestJson, { isRunGenManifestJson } from '@/utils/pwa/genManifestJson';
import pinia from '@/store'
import { bootstrap, setupSentry } from '@/utils';
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import Flag from '@/components/Flag/index.vue';
/* Theme variables */
import './theme/variables.css';
import './common/theme.less'

const app = createApp(App)
  .component('flag', Flag)
  .use(VueLuckyCanvas)
  .use(IonicVue)
  .use(pinia)
  .use(i18n)
  .use(router);

//  三星浏览器必须要在浏览器解析html中head要有manifest.json文件
// 并且三星浏览用js更新manifest.json无效。因为有这两个特征，我们现在的写法三星浏览器无法安装pwa
// 单独对三星浏览器的manifestJson特殊处理，
// 三星浏览器，要先加载manifest.json文件
if (isRunGenManifestJson()) {
  genManifestJson(router)
}

setupSentry(app)

router.isReady() 
  .then(async () => await bootstrap(app));
