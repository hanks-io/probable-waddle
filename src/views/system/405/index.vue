<script setup lang="ts">
import { IonPage, IonContent, IonIcon } from '@ionic/vue';
const languageList = ['zh-CN', 'zh', 'pt-BR', 'en'] as const
type LanguageType = typeof languageList[number]

const languageMap: Record<LanguageType, Record<string, string>> = {
  "zh-CN": {
    text01: '访问受限',
    text02: '您的IP地址不在我们的服务范围内，请更改为其他地区IP，给您带来的不便，我们深表歉意。',
    text03: '客服',
    text04: '技术支援',
  },
  "zh": {
    text01: '访问受限',
    text02: '您的IP地址不在我们的服务范围内，请更改为其他地区IP，给您带来的不便，我们深表歉意。',
    text03: '客服',
    text04: '技术支援',
  },
  "pt-BR": {
    text01: 'Acesso restrito',
    text02: 'Seu endereço IP não está dentro do escopo de nossos serviços. Por favor, altere-o para um IP de outra região. Pedimos desculpas pelo transtorno causado a você.',
    text03: 'Suporte',
    text04: 'Suporte Técnico',
  },
  "en": {
    text01: 'Access restricted',
    text02: 'Your IP address is not within the scope of our services. Please change it to an IP from another region. We apologize for the inconvenience caused to you.',
    text03: 'Support',
    text04: 'Technical Support',
  }
}
const language = navigator.language as LanguageType


const getCurrentLanguageText = (language: LanguageType) => (key: string) => languageMap[language]?.[key] || languageMap.en[key]
const getCurrentLanguage = getCurrentLanguageText(language)
</script>
<template>
  <IonPage>
    <IonContent class="page-405" style="--background: #19191B">
      <div class="cloud"></div>
      <div class="main-area">
        <p class="title">{{ getCurrentLanguage('text01') }}</p>
        <p class="text">{{ getCurrentLanguage('text02') }}</p>
      </div>
      <div class="technical-support">{{ getCurrentLanguage('text04') }}:<span>Panda Game</span></div>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="less">
.color {
  color: rgba(255, 255, 255, 0.4);
}

.page-405 {
  .cloud {
    width: 327px;
    height: 127px;
    margin: 22px auto 0;
    background: url('@/assets/img/system/405/cloud-dark.svg') no-repeat;
    background-size: cover;
  }

  .main-area {
    width: 24.375rem;
    height: 28.125rem;
    background: url('@/assets/img/system/405/limit-dark.png') no-repeat;
    background-size: cover;
    text-align: center;
    font-family: Saira;


    .color();

    .title {
      color: #DF8644;
      font-size: 18px;
      font-weight: 700;
      line-height: 27px;
      padding-top: 240px;
    }

    .text {
      width: 366px;
      font-size: .75rem;
      line-height: 1.125rem;
      box-sizing: border-box;
      padding: 0 21px;
      margin: 16px auto 60px;

    }

    .support {
      display: flex;
      width: 242px;
      height: 52px;
      line-height: 52px;
      justify-content: center;
      align-items: center;
      border-radius: 52px;
      box-sizing: border-box;
      border: .0625rem solid rgba(255, 255, 255, 0.2);
      margin: 0 auto;
      font-weight: 500px;
      color: #fff;
      font-size: 16px;

      .support-icon {
        font-size: 26px;
        margin-right: 10px;

      }
    }
  }

  .technical-support {
    .color();
    width: 12.5rem;
    height: 1.125rem;
    line-height: 1.125rem;
    font-size: .75rem;
    text-align: center;
    margin: 13.125rem auto 0;

    span {
      color: #6691D5;
      font-weight: 700;
    }
  }
}
</style>
