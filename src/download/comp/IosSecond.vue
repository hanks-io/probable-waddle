<template>
  <ion-content>
    <div class="ios-second" ref="iosSecond">
      <ion-header mode="ios" collapse="fade" id="first">
        <!-- slogo -->
        <ion-toolbar>
          <div class="top-sub-header">
            <div class="iphone">
              <svg viewBox="0 0 13 44" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m13.0729 17.6825a3.61 3.61 0 0 0 -1.7248 3.0365 3.5132 3.5132 0 0 0 2.1379 3.2223 8.394 8.394 0 0 1 -1.0948 2.2618c-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6834-.9089-2.4787-2.0243a9.7842 9.7842 0 0 1 -1.6628-5.2776c0-3.0984 2.014-4.7405 3.9969-4.7405 1.0535 0 1.9314.6919 2.5924.6919.63 0 1.6112-.7333 2.8092-.7333a3.7579 3.7579 0 0 1 3.1604 1.5802zm-3.7284-2.8918a3.5615 3.5615 0 0 0 .8469-2.22 1.5353 1.5353 0 0 0 -.031-.32 3.5686 3.5686 0 0 0 -2.3445 1.2084 3.4629 3.4629 0 0 0 -.8779 2.1585 1.419 1.419 0 0 0 .031.2892 1.19 1.19 0 0 0 .2169.0207 3.0935 3.0935 0 0 0 2.1586-1.1368z">
                </path>
              </svg>
            </div>
            <div class="right-ico flex items-center">
              <span><svg height="48" viewBox="0 0 17 48" width="17" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m16.2294 29.9556-4.1755-4.0821a6.4711 6.4711 0 1 0 -1.2839 1.2625l4.2005 4.1066a.9.9 0 1 0 1.2588-1.287zm-14.5294-8.0017a5.2455 5.2455 0 1 1 5.2455 5.2527 5.2549 5.2549 0 0 1 -5.2455-5.2527z">
                  </path>
                </svg></span>
              <span><svg height="48" viewBox="0 0 17 48" width="17" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m13.4575 16.9268h-1.1353a3.8394 3.8394 0 0 0 -7.6444 0h-1.1353a2.6032 2.6032 0 0 0 -2.6 2.6v8.9232a2.6032 2.6032 0 0 0 2.6 2.6h9.915a2.6032 2.6032 0 0 0 2.6-2.6v-8.9231a2.6032 2.6032 0 0 0 -2.6-2.6001zm-4.9575-2.2768a2.658 2.658 0 0 1 2.6221 2.2764h-5.2442a2.658 2.658 0 0 1 2.6221-2.2764zm6.3574 13.8a1.4014 1.4014 0 0 1 -1.4 1.4h-9.9149a1.4014 1.4014 0 0 1 -1.4-1.4v-8.9231a1.4014 1.4014 0 0 1 1.4-1.4h9.915a1.4014 1.4014 0 0 1 1.4 1.4z">
                  </path>
                </svg></span>
              <span><svg width="18" height="18" viewBox="0 0 18 18">
                  <polyline id="globalnav-menutrigger-bread-bottom" fill="none" stroke="currentColor" stroke-width="1.2"
                    stroke-linecap="round" stroke-linejoin="round" points="2 12, 16 12">
                    <animate id="globalnav-anim-menutrigger-bread-bottom-open" attributeName="points" keyTimes="0;0.5;1"
                      dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline"
                      keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 2 12, 16 12; 2 9, 16 9; 3.5 15, 15 3.5">
                    </animate>
                    <animate id="globalnav-anim-menutrigger-bread-bottom-close" attributeName="points"
                      keyTimes="0;0.5;1" dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline"
                      keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 3.5 15, 15 3.5; 2 9, 16 9; 2 12, 16 12">
                    </animate>
                  </polyline>
                  <polyline id="globalnav-menutrigger-bread-top" fill="none" stroke="currentColor" stroke-width="1.2"
                    stroke-linecap="round" stroke-linejoin="round" points="2 5, 16 5"
                    class="globalnav-menutrigger-bread globalnav-menutrigger-bread-top">
                    <animate id="globalnav-anim-menutrigger-bread-top-open" attributeName="points" keyTimes="0;0.5;1"
                      dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline"
                      keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 2 5, 16 5; 2 9, 16 9; 3.5 3.5, 15 15"></animate>
                    <animate id="globalnav-anim-menutrigger-bread-top-close" attributeName="points" keyTimes="0;0.5;1"
                      dur="0.24s" begin="indefinite" fill="freeze" calcMode="spline"
                      keySplines="0.42, 0, 1, 1;0, 0, 0.58, 1" values=" 3.5 3.5, 15 15; 2 9, 16 9; 2 5, 16 5"></animate>
                  </polyline>
                </svg></span>
            </div>
          </div>
        </ion-toolbar>
      </ion-header>
      <!-- 顶部下载-->
      <div class="wrap">
        <div class="top-content">
          <div :class="['top-title', { 'position-fixed': showFooter }]">
            <span>{{ $t('viewsSystem.downloadIndex89') }}</span>
            <p>{{ $t('viewsSystem.downloadIndex69') }}</p>
          </div>
          <div class="app-info flex    ">
            <div class="left-content">
              <img :src="template?.appIconUrl"  class="logo " />
            </div>
            <div class="right-content">
              <h1 class=" app-name">
                <span class="name">{{ template?.appName }}</span>
                <span class="badge--product-title">
                  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fill-rule="evenodd">
                      <rect fill="#2D973D" width="16" height="16" rx="1.3"></rect>
                      <path
                        d="M6.408 4.607l1.065 6.805H5.622l-.096-1.229h-.643l-.1 1.229H2.917l.92-6.805h2.572zM5.215 6.144l-.344 2.83h.562l-.218-2.83zm3.067 5.268V4.607h1.584l-.001 5.2H13.1v1.605H8.282z"
                        fill="#FFF"></path>
                    </g>
                  </svg>
                </span>
                <span>
                  +4
                </span>
              </h1>
              <p class="developer">{{ template?.appDomain }}</p>
              <p class="developer-info">{{ $t('viewsSystem.downloadIndex0') }}</p>
              <div class="flex">
                <p @click="checkHandle">{{ $t('viewsSystem.downloadIndex90') }}</p>
                <p>{{ $t('viewsSystem.downloadIndex91') }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 宣传海报 -->
        <div class="banner ">
          <div class="banner-content">
            <h2 class="title">{{ $t('viewsSystem.downloadIndex92') }}</h2>
            <div class="flex overflow-x-auto">
              <div class='publicUrl' v-for="item of (template?.appPublicUrl?.filter((it: any) => it.includes('http')))"
                :key="item">
                <img :src="item">
              </div>
            </div>
          </div>
        </div>
        <div class="line" />
        <div class="w-[87.5%] mx-auto pt app-description">
          <!-- 关于游戏 -->
          <div class="about-game ">
            <p v-for="it in introductlist" :key="it">{{ it }}</p>
          </div>
        </div>
        <div class="line" />
        <div class="w-[87.5%] mx-auto pt app-description">
          <!-- 更新 -->
          <div class="new-updata ">
            <h2>
              {{ $t('viewsSystem.downloadIndex138') }}
            </h2>
            <p class="mb-4"> {{ $t('viewsSystem.downloadIndex139') }}</p>
            <p> {{ $t('viewsSystem.downloadIndex140') }}</p>
          </div>
        </div>
        <div class="line" />

        <!-- 用户隐私 -->
        <div class="w-[87.5%] mx-auto pt privacy-info">
          <h2>{{ $t('viewsSystem.downloadIndex95') }}</h2>
          <p class="privacy-info-text">
            <strong v-if="false"></strong>
            <span>{{ $t('viewsSystem.downloadIndex96') }}
              <a href="javascript:void(0)" @click="checkHandle">{{ $t('viewsSystem.downloadIndex97') }}</a></span>
          </p>
          <div class="privacy">
            <div class="privacy-content">
              <div class="privacy-svg">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                  <path
                    d="M32.09 61.568c16.185 0 29.586-13.43 29.586-29.587 0-16.186-13.43-29.587-29.616-29.587-16.157 0-29.558 13.4-29.558 29.587 0 16.156 13.43 29.587 29.587 29.587zm0-4.932c-13.692 0-24.628-10.964-24.628-24.655 0-13.692 10.907-24.656 24.598-24.656 13.691 0 24.656 10.964 24.685 24.656.03 13.69-10.965 24.655-24.656 24.655zM28.897 45.76c.958 0 1.77-.464 2.35-1.363L44.504 23.54c.32-.551.696-1.219.696-1.857 0-1.276-1.16-2.117-2.378-2.117-.725 0-1.45.435-2.002 1.305l-12.038 19.29-5.714-7.368c-.696-.928-1.334-1.19-2.146-1.19-1.248 0-2.234 1.016-2.234 2.321 0 .61.261 1.247.667 1.799l7.078 8.673c.725.957 1.508 1.363 2.465 1.363z">
                  </path>
                </svg>
              </div>
              <h3 class="privacy-type__heading">{{ $t('viewsSystem.downloadIndex98') }}</h3>
              <p class="privacy-type__description">{{ $t('viewsSystem.downloadIndex99') }}</p>
            </div>
          </div>
          <p class="app-privacy__learn-more">{{ $t('viewsSystem.downloadIndex100') }}<a href="javascript:void(0)"
              @click="checkHandle">{{ $t('viewsSystem.downloadIndex101') }}</a></p>
        </div>
        <!-- app信息 -->
        <div class="line" />
        <div class="pt section--information   w-[87.5%] mx-auto">
          <div>
            <div>
              <h2 class="section__headline">{{ $t('viewsSystem.downloadIndex102') }}</h2>
              <dl class="information-list--app">
                <div class="information-list__item">
                  <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex103') }}</dt>
                  <dd class="information-list__item__definition">
                    <!-- Sehba Yogi -->
                  </dd>
                </div>
                <div class="information-list__item ">
                  <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex104') }}</dt>
                  <dd class="information-list__item__definition" aria-label="6,3 megabytes">
                    {{ $t('viewsSystem.downloadIndex105') }}</dd>
                </div>
                <div class="information-list__item">
                  <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex106') }}</dt>
                  <dd class="information-list__item__definition">
                    <a href="javascript:void(0)" class="link" @click="checkHandle">
                      {{ $t('viewsSystem.downloadIndex107') }}
                    </a>
                  </dd>
                </div>
                <div class="information-list__item">
                  <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex108') }}</dt>
                  <dd class="information-list__item__definition">
                    <dl class="information-list__item__definition__item">
                      <dt class="information-list__item__definition__item__term">
                        {{ $t('viewsSystem.downloadIndex109') }}
                      </dt>
                      <dd class="information-list__item__definition__item__definition">
                        {{ $t('viewsSystem.downloadIndex110') }}
                      </dd>
                    </dl>
                    <dl class="information-list__item__definition__item">
                      <dt class="information-list__item__definition__item__term">
                        {{ $t('viewsSystem.downloadIndex111') }}
                      </dt>
                      <dd class="information-list__item__definition__item__definition">
                        {{ $t('viewsSystem.downloadIndex110') }}
                      </dd>
                    </dl>
                    <dl class="information-list__item__definition__item">
                      <dt class="information-list__item__definition__item__term">
                        {{ $t('viewsSystem.downloadIndex112') }}
                      </dt>
                      <dd class="information-list__item__definition__item__definition">
                        {{ $t('viewsSystem.downloadIndex113') }}
                      </dd>
                    </dl>
                  </dd>
                </div>
                <div class="information-list__item">
                  <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex114') }}</dt>
                  <dd
                    class="we-truncate we-truncate--multi-line we-truncate--interactive  information-list__item__definition">
                    <p data-test-bidi="">{{ $t('viewsSystem.downloadIndex115') }}</p>
                  </dd>
                </div>
                <div class="information-list__item">
                  <dl class="information-list__item__definition__item">
                    <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex116') }}</dt>
                    <dd class="information-list__item__definition">
                      +4
                    </dd>
                  </dl>
                </div>
                <div class="information-list__item" v-if="false">
                  <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex117') }}</dt>
                  <dd class="information-list__item__definition information-list__item__definition--copyright">© </dd>
                </div>
                <div class="information-list__item">
                  <dt class="information-list__item__term">{{ $t('viewsSystem.downloadIndex118') }}</dt>
                  <dd class="information-list__item__definition">{{ $t('viewsSystem.downloadIndex119') }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div class="line" />
        <div class="w-[87.5%] mx-auto section--link-list">
          <ul class="link-list link-list--a"><!---->
            <li class="link-list__item link-list__item--a">
              <a class="link icon icon-after icon-external" href="javascript:void(0)" @click="checkHandle">
                {{ $t('viewsSystem.downloadIndex120') }}
              </a>
            </li>
            <li class="link-list__item link-list__item--a">
              <a class="link icon icon-after icon-external" href="javascript:void(0)" @click="checkHandle">
                {{ $t('viewsSystem.downloadIndex121') }}
              </a>
            </li>
          </ul>
        </div>
        <!-- 版权信息 -->
        <div class="we-global-footer">
          <div class="w-[87.5%] mx-auto">
            <div>
              <div class="we-global-footer__legal-copyright">
                <p>
                  <span>{{ $t('viewsSystem.downloadIndex121') }}</span>
                  <span>{{ $t('viewsSystem.downloadIndex122') }}</span>
                  <span>{{ $t('viewsSystem.downloadIndex123') }}</span>
                </p>
              </div>
              <div class="terms">
                <p><a href="javascript:void(0)" @click="checkHandle">{{ $t('viewsSystem.downloadIndex124') }}
                    <i>｜</i></a></p>
                <p><a href="javascript:void(0)" @click="checkHandle">{{ $t('viewsSystem.downloadIndex142') }}
                    <i>｜</i></a></p>
                <p><a href="javascript:void(0)" @click="checkHandle"></a></p>
                <p><a href="javascript:void(0)" @click="checkHandle">{{ $t('viewsSystem.downloadIndex125') }} <i>｜</i>
                    {{ $t('viewsSystem.downloadIndex126') }}</a></p>
              </div>
            </div>
          </div>
        </div>
        <!-- 赞助链接 -->
        <div class="footer">
          <footer id="ac-globalfooter" class="footer-coneter mx-auto">
            <div class="ac-gf-content">
              <section class="ac-gf-footer">
                <div class="ac-gf-footer-shop" x-ms-format-detection="none">
                  <p>{{ $t('viewsSystem.downloadIndex127') }}<a href="javascript:void(0)" @click="checkHandle">{{
                    $t('viewsSystem.downloadIndex128') }}</a>
                    {{ $t('viewsSystem.downloadIndex129') }} <a href="javascript:void(0)" @click="checkHandle">{{
                      $t('viewsSystem.downloadIndex130') }}</a>
                    {{ $t('viewsSystem.downloadIndex131') }}
                  </p>
                  <p>{{ $t('viewsSystem.downloadIndex132') }}</p>
                </div>
                <div class="ac-gf-footer-locale">
                  <a class="ac-gf-footer-locale-link" href="javascript:void(0)" @click="checkHandle">
                    {{ $t('viewsSystem.downloadIndex141') }}</a>
                </div>
                <div class="ac-gf-footer-legal">
                  <ul class="ac-gf-footer-legal-links" role="list">
                    <li class="ac-gf-footer-legal-links-item" role="listitem">
                      <a class="ac-gf-footer-legal-link" href="javascript:void(0)" @click="checkHandle">{{
                        $t('viewsSystem.downloadIndex134') }}</a><i>|</i>
                    </li>
                    <li class="ac-gf-footer-legal-links-item" role="listitem">
                      <a class="ac-gf-footer-legal-link" href="javascript:void(0)" @click="checkHandle">{{
                        $t('viewsSystem.downloadIndex135') }}</a><i>|</i>
                    </li>
                    <li class="ac-gf-footer-legal-links-item" role="listitem">
                      <a class="ac-gf-footer-legal-link" href="javascript:void(0)" @click="checkHandle">{{
                        $t('viewsSystem.downloadIndex136') }}</a><i>|</i>
                    </li>
                    <li class="ac-gf-footer-legal-links-item" role="listitem">
                      <a class="ac-gf-footer-legal-link" href="javascript:void(0)" @click="checkHandle">{{
                        $t('viewsSystem.downloadIndex137') }}</a>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </ion-content>
</template>
<script setup lang="ts">
import { IonContent, IonImg, } from '@ionic/vue';
import useTemplateLogic from '@/download/useTemplateLogic';

const {
  template,
  introductlist,
} = useTemplateLogic();
const emit = defineEmits(["checkHandle"])
const checkHandle = () => {
  emit("checkHandle")
}
const iosSecond = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const showFooter = ref(false)

const handleScroll = () => {
  if (iosSecond.value) {
    scrollPosition.value = iosSecond.value.scrollTop
    showFooter.value = scrollPosition.value >= 48
  }
}

onMounted(() => {
  if (iosSecond.value) {
    iosSecond.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (iosSecond.value) {
    iosSecond.value.removeEventListener('scroll', handleScroll)
  }
})



</script>
<style scoped lang="less">
p,
div,
span,
a,
strong,
dt,
dd,
li,
h1,
h2 {
  font-family: "SF Pro Text", "SF Pro Icons", "Apple WebExp Icons Custom", "Helvetica Neue", Helvetica, Arial, sans-serif;

}

.pt {
  padding-top: 1.1875rem;
  padding-bottom: 2rem;
}

.line {
  width: 87.5%;
  height: 1px;
  margin: 0 auto;
  background: #d6d6d6
}

ion-content {
  height: 100%;
  font-family: Roboto, "Google Sans", Arial, sans-serif;
  .ios-second {
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    background-color: #fff;
    font-size: 0.875rem;
    color: rgba(0, 0, 0, .87);
    font-family: Roboto, RobotoDraft, "Google Sans", Helvetica, Arial, sans-serif;
    overflow-y: scroll;

    /* 隐藏滚动条 */
    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;

    .in-toolbar {
      height: 3rem;
      position: relative;
      padding: 0px 0px;

      .top-sub-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        width: 100%;
        height: 3rem;
        background-color: #fafafccc;

        .iphone {
          width: 3rem;

          svg {
            height: 3.1875rem;
          }
        }

      }

      .right-ico {
        span {
          display: inline-block;
          width: 3rem;
          height: 3rem;

        }
      }

      svg {
        fill: rgba(0, 0, 0, .8);
        color: rgba(0, 0, 0, .8);
        margin: 0 auto;
        line-height: 3rem;
        height: 3rem;
      }

    }

    .wrap {
      margin: 0 auto;
      overflow-y: scroll;
      

      .top-content {
        .top-title {
          height: 4.6875rem;
          padding: 0.75rem 1rem 1rem;
          font-size: 1.1875rem;
          letter-spacing: 0.228px;
          border-bottom: 1px solid #E0E0E0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, background-color, backdrop-filter;

          &.position-fixed {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            backdrop-filter: saturate(180%) blur(1.25rem);
            background-color: rgba(255, 255, 255, .72);
            transform: translateY(0);
          }

          span {
            line-height: 1.1875rem;
            font-weight: 400;
            color: #636366;
          }

          p {
            color: #000000;
            line-height: 1rem;
            font-weight: 600;
          }
        }

        .app-info {
          width: 87.5%;
          padding: 1.25rem 0 2rem;
          margin: 0 auto;
          border-bottom: 1px solid #d6d6d6;
          background-color: rgba(255, 255, 255, .72);

          .left-content {
            width: 8.4375rem;
            min-height: 8.4375rem;

            img.logo {
              width: 8.4375rem;
              border-radius: 22.5%;
            }
          }

          .right-content {
            width: 12.875rem;
            margin-left: 0.75rem;

            h1.app-name {
              margin-top: 0px;
              margin-bottom: 0px;
              font-weight: 600;
              font-size: 1.125rem;
              letter-spacing: 0.486px;
              align-items: flex-end;
              overflow-wrap: anywhere;
              word-break: keep-all;
              white-space: break-spaces;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 0.25rem;

              .badge--product-title {
                display: inline-flex;
                margin-left: 0.25rem;
                font-size: 0.65rem;
                letter-spacing: 0.416px;
                vertical-align: middle;
                flex-shrink: 0;
              }

              span:not(.badge--product-title) {
                padding: 0 0.25rem;
                font-size: 0.5625rem;
                border: 1px solid #636366;
                border-radius: 0.1875rem;
                margin-left: 0.5rem;
                white-space: nowrap;
                flex-shrink: 0;
              }

              span.name {
                display: inline-block;
                font-size: 18px;
                border: 0;
                margin: 0;
                padding: 0;
                flex-shrink: 1;
                min-width: 0;
                white-space: break-spaces;
              }

            }

            .developer {
              margin-top: 0.125rem;
              font-size: 0.8125rem;
              color: #0070c9
            }

            .developer-info {
              font-size: 0.8125rem;
              color: #636366
            }

            div {
              margin-top: 0.875rem;
              font-size: 0.75rem;

              p:first-child {
                font-size: 0.75rem;
                background: #0070c9;
                color: white;
                padding: 0.1875rem 0.625rem;
                border-radius: 0.3125rem;
                text-decoration: none;
                margin-right: 0.375rem;
              }
            }

          }
        }
      }

      // 轮播图
      .banner {
        width: 87.5%;
        margin: 1.1875rem auto 2.3125rem;

        /* 隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }

        -ms-overflow-style: none;
        scrollbar-width: none;

        .banner-content {
          width: 22.8125rem;

          .title {
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: .48px;
            margin-bottom: 1.0625rem;
          }

          .publicUrl {
            width: 12.5rem;
            height: 22.1875rem;
            flex-shrink: 0;
            margin-right: 0.375rem;
            background-size: 100% 100%;

            img {
              vertical-align: top;
              width: 100%;
              height: 100%;
            }
          }
        }

      }

      .app-description {
        font-size: 0.8125rem;
        line-height: 1.125rem;
        letter-spacing: -0.065px;
      }

      .about-game {
        h2 {
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1d1d1f;
          line-height: 1.5rem;
          letter-spacing: 0.48px;
          margin-bottom: 1.0625rem;
        }
      }

      .new-updata {
        h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }
      }

      .privacy-info {
        h2 {
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1d1d1f;
          line-height: 1.5rem;
          letter-spacing: .48px;
          margin-bottom: 1.0625rem;
        }

        .privacy-info-text {
          font-size: 0.8125rem;
          line-height: 1.125rem;
          letter-spacing: -0.065px;

          a {
            color: #0070c9;
            text-decoration: none;
          }
        }
      }

      .privacy {
        margin-top: 0.8125rem;
        display: grid;
        grid-gap: 1.25rem;

        .privacy-content {
          padding: 1.75rem 1.25rem 1.25rem;
          width: 100%;
          border-radius: 1rem;
          background-color: #f8f8f8;

          .privacy-svg {
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;

            svg {
              fill: #0070c9;
            }
          }

          .privacy-type__heading {
            margin-top: 0.5625rem;
            margin-bottom: 0.375rem;
            color: #111;
            text-align: center;
            font-size: 0.9375rem;
            line-height: 1.33338;
            font-weight: 600;
            letter-spacing: -0.24px;
            font-family: "SF Pro Text", "SF Pro Icons", "Apple WebExp Icons Custom", "Helvetica Neue", Helvetica, Arial, sans-serif;
          }

          .privacy-type__description {
            margin-top: 0px;
            color: #666;
            text-align: center;
            font-size: 0.8125rem;
            line-height: 1.38462;
            font-weight: 400;
            letter-spacing: -0.065px;
            font-family: "SF Pro Text", "SF Pro Icons", "Apple WebExp Icons Custom", "Helvetica Neue", Helvetica, Arial, sans-serif;
          }
        }
      }

      .app-privacy__learn-more {
        font-size: 0.8125rem;
        margin-top: 1.25rem;
        letter-spacing: -0.065px;
        line-height: 1.125rem;
      }
    }

    .section--information {
      font-family: "SF Pro Display", "SF Pro Icons", "Apple WebExp Icons Custom", "Helvetica Neue", Helvetica, Arial, sans-serif;

      .section__headline {
        margin-top: 0;
        margin-bottom: 17px;
        flex-shrink: 1;
        font-size: 20px;
        line-height: 1.2;
        font-weight: 700;
        letter-spacing: .024em;
        font-family: "SF Pro Display", "SF Pro Icons", "Apple WebExp Icons Custom", "Helvetica Neue", Helvetica, Arial, sans-serif;
      }

      .information-list--app {
        .information-list__item {
          padding-bottom: 1.0625rem;
          font-size: 0.8125rem;
          line-height: 1.125rem;

          .information-list__item__term {
            line-height: 1.125rem;
            display: block;
            vertical-align: top;
            color: #636366;
            text-align: left
          }

          .information-list__item__definition__item__term {
            color: #000;
            font-size: 0.8125rem;
            line-height: 1.38;
            font-weight: 600;
            letter-spacing: -0.065px;
            font-family: "SF Pro Text", "SF Pro Icons", "Apple WebExp Icons Custom", "Helvetica Neue", Helvetica, Arial, sans-serif;
          }

          .information-list__item__definition__item:not(:first-of-type) {
            padding-top: 16px;
          }
        }
      }
    }

    .section--link-list {
      padding-top: 0;
      padding-bottom: 1.1875rem;
      font-size: 1.125rem;

      .link-list--a .link-list__item {
        margin-bottom: 0;
        padding-top: 0.625rem;
        padding-bottom: 0.625rem;
        border-bottom: 1px solid #d6d6d6;

        a.link {
          margin-top: -0.625rem;
          margin-bottom: -0.625rem;
          padding-top: 0.625rem;
          padding-bottom: 0.625rem;
          width: 100%;
          display: block;
          color: #0070c9;


        }
      }
    }

    .we-global-footer {
      --pageBG: white;
      --systemPrimary: rgba(0, 0, 0, 0.72);
      --systemSecondary: rgba(134, 134, 139, 1);
      background-color: #f5f5f7;
      padding-top: 1.5625rem;
      padding-bottom: 1.25rem;

      .we-global-footer__legal-copyright {
        font-size: 0.8125rem;
        margin-top: 0.125rem;
        color: #86868b;
      }

      .we-global-footer__legal-link {
        text-decoration: none;
        display: inline-block;
        margin-top: 0.3125rem;
        font-size: 0.8125rem;
        color: var(--systemPrimary);
        border-inline-end: 1px solid rgba(0, 0, 0, .1);
        margin-right: 0.4375rem;
        padding-right: 0.625rem;
      }

      .terms {
        a {
          color: rgba(0, 0, 0, .72);

          i {
            font-style: normal;
            color: rgba(0, 0, 0, .1);
          }
        }
      }
    }


    .footer {
      background-color: #f5f5f7;
      padding-bottom: 1.25rem;

      .footer-coneter {
        padding: 0 1.375rem;
        font-size: 0.75rem;

        .ac-gf-footer-shop {
          font-size: 0.75rem;
          line-height: 1rem;
          margin-bottom: 0.625rem;
          color: rgba(0, 0, 0, .56);

          a {
            text-decoration: underline;
          }
        }

        .ac-gf-footer-locale a {
          font-size: 12px;
          color: rgba(0, 0, 0, .72);
        }

        .ac-gf-footer-legal-copyright {
          padding-top: 0.75rem;
        }

        .ac-gf-footer-legal-links {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.3125rem;

          a {
            color: rgba(0, 0, 0, .72);
          }

          i {
            margin: 0 0.375rem;
            font-style: normal;
            white-space: nowrap;
            color: rgba(0, 0, 0, .48);
          }
        }
      }


    }

  }
}

.top-title {
  position: sticky;
  top: 0;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, background-color, backdrop-filter;

  &.position-fixed {
    backdrop-filter: saturate(180%) blur(1.25rem);
    background-color: rgba(255, 255, 255, .72);
  }
}
</style>
