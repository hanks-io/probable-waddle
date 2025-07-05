<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class=" px-3">
        <ion-img class="w-[84px]" slot="start" src="/icons/logo_1.png"/>
        <ion-icon class="text-[28px]" slot="end" :icon="close" @click="backHandle"/>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <form ref="form" @submit="submitForm" class="bg-white mx-auto max-w-[1024px] px-[25px] text-black rounded-xl py-[20px]">
        <p class="text-[22px] font-bold text-center mb-[20px]">{{ $t('label.forgotPassword') }}</p>
        <ion-item class="mb-[10px]">
          <ion-input ref="input" v-model="formData.account" @ionInput="validate" @ionBlur="blurAccount" mode="ios" :error-text="$t('hint.invalidUsername')" :placeholder="$t('label.username')" clearInput/>
        </ion-item>
        <ion-item class="button text-[16px] drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)] mb-[20px]">
          <ion-button class="w-full text-[16px] text-white" type="submit" fill="clear">{{ $t('main.confirm') }}</ion-button>
        </ion-item>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons';
import { Storage } from '@ionic/storage';
import { useIonRouter } from '@ionic/vue';
import { getCurrentInstance, onBeforeMount, onMounted, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonImg, IonItem, IonIcon, IonInput, IonButton } from '@ionic/vue';

const storage = new Storage();          // 缓存
const ionRouter = useIonRouter();       // 路由
const instance = getCurrentInstance();  // 获取所有ref标签

const form = ref();   // 表单
const input = ref();  // 输入内容

const formData = {
  account: '',
}

/**
 * @description 返回上一页
 */
function backHandle() {
  ionRouter.replace('/login');
}

/**
 * @description 验证账号格式
 * @param value 判判断值
 */
function validateAccount(value: string) {
  return value.match(
    /^[a-zA-Z][a-zA-Z0-9]{3,15}$/
  );
}

/**
 * @description 输入事件监听回调(验证账号格式)
 * @param value 输入值
 */
function validate(ev: any) {
  let value: string;
  if(typeof ev === 'string') {
    value = ev;
  } else {
    value = ev.target.value;
  }

  input.value.$el.classList.remove('ion-valid');
  input.value.$el.classList.remove('ion-invalid');

  validateAccount(value)
    ? input.value.$el.classList.add('ion-valid')
    : input.value.$el.classList.add('ion-invalid');
}

/**
 * @description 账号输入框失去焦点事件
 */
function blurAccount() {
  input.value.$el.classList.add('ion-touched');
  validate(formData.account);
}

/**
 * @description 提交表单
 * @param event 事件对象
 */
function submitForm(event: Event) {
  event.preventDefault();                                         // 阻止默认事件
  if (formData.account == '') return blurAccount();               // 账号为空时, 手动触发账号输入框失去焦点事件
  const classList = form.value.querySelectorAll('.ion-invalid');  // 获取所有未通过验证的元素
  if (classList.length) {``
    return console.log('表单验证未通过');
  }
  console.log('表单验证通过');
  ionRouter.replace('/reset');
}

/**
 * @description 生命周期-模板或渲染函数被编译之后，但是在挂载到 DOM 之前
 */
onBeforeMount(async () => {
  await storage.create();
})

/**
 * @description 生命周期-挂载到 DOM 之后
 */
onMounted(() => {
  console.log(instance!.refs)
})
</script>

<style scoped>
ion-toolbar {
  --min-height: 44px;
  --background: #101629;
}

ion-content {
  --padding-top: 10px;
  --padding-start: 25px;
  --padding-end: 25px;
}

ion-item {
  --background: transparent;
  --padding-bottom: 0px;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --inner-padding-end: 0;
  --inner-border-width: 0px;
}

ion-input {
  --background: #EAEDF6;
  --color: #000;
  --placeholder-color: #8792AF;
  --placeholder-opacity: 1;
  --padding-bottom: 0px;
  --padding-end: 10px;
  --padding-start: 10px;
  --padding-top: 0px;
  --border-width: 0px;
  --border-radius: 10px;
  font-size: 12px;
}

.sc-ion-input-ios-h:not(.legacy-input) {
  min-height: 40px; /* ion-input最小高度 */
}

ion-item.sc-ion-input-ios-h:not(.item-label):not(.item-has-modern-input), ion-item:not(.item-label):not(.item-has-modern-input) .sc-ion-input-ios-h {
  --padding-start: 10px; /* ion-input左内边距(ion-item内ion-input默认取消左内边距) */
}

ion-item.button {
  --min-height: 40px;
  --background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%);
  --border-radius: 10px;
}

ion-button {
  text-transform: none;
}
</style>