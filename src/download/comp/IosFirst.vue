<template>

    <ion-content>
      <div class="ios-first">
        <div class="wrap">
          <div class="top-content">
            <!-- 顶部 -->
            <div class="header">
              <div class="content-top-wrap relative pb-[0.0625rem]">
                <div class="gradient-overlay"></div>
                <div class="flex  iconHeader">
                  <!-- 应用图标 -->
                  <img 
                    :src="template?.appIconUrl" />
                  <div class="flex-1 header-text ">
                    <p class="p1 main-text text-2xl leading-none  ellipsis w-[15.375rem] font-family-google-sans">{{ template?.appName }}</p>
                    <p class="p2 leading-none text-[#0070c9] font-family-google-sans"> {{ template?.appDomain }} </p>
                    <p class="p3 text-[.75rem]  sub-text font-family-roboto">{{ $t('viewsSystem.downloadIndex0')  }}</p>
                  </div>
                </div>
                <div class=" app-score items-center text-sm text-center">
                  <div class="flex items-center star">
                    <div class="">
                      <span class="font-family-google-sans"><i class="star-text font-family-google-sans">{{ appScore ? appScore : currentScore }}</i><i v-for="item in 5" :key="item" class="star-icon">★</i></span>
                      <p class="text font-family-roboto">{{  $t('viewsSystem.downloadIndex1') }}</p>
                    </div>
                    <div class="">
                      <span class="font-family-google-sans">500 mi+ </span>
                      <p class="text font-family-roboto">{{  $t('viewsSystem.downloads') }}</p>
                    </div>
                    <div class="">
                      <span class="icon-img font-family-google-sans"><img :src="getImageUrl('img/download/favicon.ico')"   class="w-[1rem] h-[1rem]"   /></span>
                      <p class="text font-family-roboto">{{ $t('viewsSystem.downloadIndex2') }}</p>
                    </div>
                  </div>
                </div>
                <!-- 安装模块 -->
                <div class="btn  shiny flex flex-col items-center text-xs" @click="checkHandle">
                  <div class="flex items-center">
                    <span class="text-sm text-[#ffffff] font-family-google-sans">{{   $t('viewsSystem.downloadIndex87') }}</span>
                    <i class="download"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 宣传海报 -->
          <div class="banner flex overflow-x-auto">
            <div class='publicUrl' v-for="item of (template?.appPublicUrl?.filter((it: any) => it.includes('http')))"
              :key="item">
              <img :src="item">
            </div>
          </div>
          <!-- 关于游戏 -->
          <div class="about-game font-family-google-sans">
            <div class="font-family-google-sans text-[#202124]">
              {{ $t('viewsSystem.downloadIndex5') }}
            </div>
            <p class="font-family-roboto"  v-for="it in introductlist" :key="it">{{ it }}</p>
          </div>
          <!-- 更新时间 -->
          <div class="update-game">
            <div class="update-title font-family-google-sans text-[#202124]">{{ $t('viewsSystem.downloadIndex9') }}</div>
            <div class="update-time font-family-roboto">{{ $t('viewsSystem.downloadIndex10') }}</div>
            <!-- 推荐游戏 -->
            <div class="recom-games flex flex-wrap mt-7">
              <div>{{$t('viewsSystem.downloadIndex11') }}</div>
              <div>{{$t('viewsSystem.downloadIndex12') }}</div>
              <div>{{$t('viewsSystem.downloadIndex13') }}</div>
              <div>{{$t('viewsSystem.downloadIndex14') }}</div>
              <div>{{$t('viewsSystem.downloadIndex15') }}</div>
              <div>{{$t('viewsSystem.downloadIndex16') }}</div>
            </div>
          </div>
          <!-- 数据安全 -->
          <div class="data-safety  mt-5">
            <div class="text-[#202124] text-lg flex   justify-between mb-5 safety-title font-family-google-sans">
              {{  $t('viewsSystem.downloadIndex17') }}
              <ion-img @click="checkHandle" class="w-[.9375rem]"
                src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-right-arrow.png" />
            </div>
            <div class="safety-content font-family-roboto" data-t="data_safety.content">
              {{ $t('viewsSystem.downloadIndex18') }}
            </div>
            <div class="safety-info mt-5 border rounded-lg">
              <div class="flex item items-start">
                <div class="icon icon-img1"></div>
                <div>
                  <p class="font-family-roboto">{{ $t('viewsSystem.downloadIndex19') }} {{ $t('viewsSystem.downloadIndex20') }}</p>
                </div>
              </div>
              <div class="flex item items-start ">
                <div class="icon icon-img2"></div>
                <div>
                  <p class="font-family-roboto">{{ $t('viewsSystem.downloadIndex21') }}</p>
                </div>
              </div>
              <div class="flex item items-start ">
                <div class="icon icon-img3"></div>
                <div>
                  <p class="font-family-roboto">{{ $t('viewsSystem.downloadIndex22') }}</p>
                </div>
              </div>
              <div class="flex item items-start">
                <div class="icon icon-img4"></div>
                <div>
                  <p class="font-family-roboto">{{ $t('viewsSystem.downloadIndex23') }}</p>
                </div>
              </div>
              <!-- 查看详情 -->
              <div class="mt-4 details">
                <p @click="checkHandle">{{ $t('viewsSystem.downloadIndex67') }}</p>
              </div>
            </div>
          </div>
          <!-- 评级评分 -->
          <div class="mt-5 rating">
            <div class="text-lg flex justify-between mb-5 text-[#202124] comments-title font-family-google-sans">{{ $t('viewsSystem.downloadIndex24') }} <ion-img @click="checkHandle" class="w-[.9375rem]"
              src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-right-arrow.png" /> </div>
            <div class="comments__tips font-family-google-sans">
              {{ $t('viewsSystem.downloadIndex25') }}
            </div>
            <div class="mt-5 mb-3 flex flex-wrap device">
              <div
                class=" font-family-google-sans flex    bg-[#e6f3ef]   mt-2.5 mr-4 text-[#028760]">
                <ion-img class="w-[.8125rem] mr-1"
                  src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-phone.png" />
               <span>{{ $t('viewsSystem.downloadIndex26') }}</span>
              </div>
              <div class=" font-family-google-sans flex border border-[#dadce0] px-3  mt-2.5 mr-4">
                <ion-img class="w-[.8125rem] mr-1"
                  src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-tablet.png" />
                {{ $t('viewsSystem.downloadIndex27') }}
              </div>
            </div>
            <div class="  flex items-center justify-between">
              <div>
               
                <div class="text-[#202124] text-[3.625rem] leading-tight">
                   {{ appScore ? appScore : currentScore }}
                </div>
                <div class="flex">
                  <p class="start"v-for="item in 5" :key="item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0070c9;">
                      <path d="M0 0h24v24H0z" fill="none"> </path>
                      <path d="M0 0h24v24H0z" fill="none"> </path>
                      <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                      </path>
                    </svg>
                  </p>
                </div>
              </div>
              <div>
                <div class="h-4 text-[.6875rem] flex items-center justify-between">
                  5
                  <div class="ml-3.5 w-40 h-[.625rem] bg-[#e3e3e3] rounded-md">
                    <p class="h-full bg-[rgb(0,112,201)] rounded-md"></p>
                  </div>
                </div>
                <div class="h-4 text-[.6875rem] flex items-center justify-between">
                  4
                  <div class="ml-3.5 w-40 h-[.625rem] bg-[#e3e3e3] rounded-md">
                    <p class="h-full w-12 bg-[rgb(0,112,201)] rounded-md"></p>
                  </div>
                </div>
                <div class="h-4 text-[.6875rem] flex items-center justify-between">
                  3
                  <div class="ml-3.5 w-40 h-[.625rem] bg-[#e3e3e3] rounded-md">
                    <p class="h-full w-5 bg-[rgb(0,112,201)] rounded-md"></p>
                  </div>
                </div>
                <div class="h-4 text-[.6875rem] flex items-center justify-between">
                  2
                  <div class="ml-3.5 w-40 h-[.625rem] bg-[#e3e3e3] rounded-md">
                    <p class="h-full w-4 bg-[rgb(0,112,201)] rounded-md"></p>
                  </div>
                </div>
                <div class="h-4 text-[.6875rem] flex items-center justify-between">
                  1
                  <div class="ml-3.5 w-40 h-[.625rem] bg-[#e3e3e3] rounded-md">
                    <p class="h-full w-1 bg-[rgb(0,112,201)] "></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="leading-loose my-1.5 text-xs">{{  $t('viewsSystem.downloadIndex1') }}</div>
            <div>
              <div class="mt-5 comment-item" v-for="(item, index) in currentCommentList" :key="item.userName">
                  <div class="flex justify-between">
                    <div class="flex items-center">
                      <ion-img class="w-8 h-8 rounded-full object-fill overflow-hidden" :src="item.userImg" />
                    <div class="ml-3">{{ $t(`${item.userName}`) }} </div>
                  </div>
                  <ion-img class="w-1"
                    src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-more.png" />
                </div>
                <div class="flex items-center mt-4">
                  <p class="start_small" v-for="it in item.score" :key="it">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0070c9;">
                      <path d="M0 0h24v24H0z" fill="none"> </path>
                      <path d="M0 0h24v24H0z" fill="none"> </path>
                      <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
                      </path>
                    </svg>
                  </p>
                  <span class="text-xs ml-2">{{ $t(`${item.date}`) }}</span>
                </div>
                <div class="mt-2 comment">{{  $t(`${item.comment}`) }}</div>
                <div class="user-help">{{$t('viewsSystem.downloadIndex59')}} {{  parseInt(288*0.5*Number(index+1)+(index*5.1)) }}</div>
                <div class="flex mt-2 help items-center">
                  <span class="is-help">{{ $t('viewsSystem.downloadIndex60') }}</span>
                  <p class="flex">
                    <span @click="checkHandle" class="font-family-google-sans">{{$t('viewsSystem.downloadIndex61')}}</span>
                    <span @click="checkHandle" class="font-family-google-sans">{{$t('viewsSystem.downloadIndex62')}}</span>
                  </p>
                  </div>
              </div>
            </div>
            <!-- 查看所有评论 -->
            <div class="flex items-center pl-2 mt-5 h-[3.25rem] lh-[3.25rem] text-[#0070c9]" @click="checkHandle">
              {{ $t('viewsSystem.downloadIndex63') }}
            </div>
            <div class="all-comment mt-5">
              <p class="text-[1.1875rem] flex justify-between mb-5 text-[#202124]">{{$t('viewsSystem.downloadIndex64')}}</p>
              <div class="description items-center font-family-roboto"><br>
               <p> {{$t('viewsSystem.downloadIndex65')}}</p>
               <p>{{$t('viewsSystem.downloadIndex86')}}{{template?.appName}}</p>
                <p>-{{$t('viewsSystem.downloadIndex83')}}</p>
                <p>-{{$t('viewsSystem.downloadIndex84')}}</p>
                <p>{{$t('viewsSystem.downloadIndex85')}}</p>
              </div>
            </div>
            <!-- 推荐游戏 -->
             <div class="mt-5 text-[1.1875rem] flex justify-between mb-5 text-[#202124]">{{$t('viewsSystem.downloadIndex66')}}
              <ion-img @click="checkHandle" class="w-[.9375rem]"
                src="https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/icons/icon-right-arrow.png" />
             </div>
             <div class="recommend-game mt-5 flex justify-between flex-wrap font-family-roboto">
              <div class="list flex items-center" v-for="item in GameList" :key="item.name">
                <ion-img class="w-14 h-14 rounded-[.5rem] overflow-hidden "  :src="item.img" />
                <div class="ml-3" >
                  <p>{{ $t(`${item.name}`) }}</p>
                  <p>{{ $t(`${item.title}`) }}</p>
                  <p class="star">{{item.star}} <em>★</em></p>
                </div>
              </div>
              <div class="mt-5"><i class="mark"></i>{{$t('viewsSystem.downloadIndex68')}}</div>
             </div>
            <!-- 安装模块 -->
            <div class="bottom-shiny    flex flex-col items-center text-xs" @click="checkHandle">
              <div class="flex items-center">
                <span class="text-sm text-[#ffffff] font-family-google-sans">{{ $t('viewsSystem.downloadIndex88') }}</span>
                <i class="download"></i>
              </div>
            </div>
            <div class="line"></div>
            <div class="store">
              <p>{{$t('viewsSystem.downloadIndex69')}}</p>
              <div class="flex h-12 items-center ">
                <img   class="flag mr-3" :src="countryFlag"  />
                <span>{{$t('viewsSystem.downloadIndex70')}}</span>
              </div>
            </div>
          </div>
          <div class="mt-20" />
        </div>
      </div>
    </ion-content>
</template>
<script setup lang="ts">
import { IonContent, IonImg, } from '@ionic/vue';
import useTemplateLogic from '@/download/useTemplateLogic';
import { getImageUrl } from '@/utils/url';
import {  Language } from '@/i18n/ruleHelper/activityRule'
import { useAppStore } from '@/store/app'

const {
  template,
  introductlist,
  currentScore,
  currentCommentList,
  appScore
} = useTemplateLogic();
const emit = defineEmits(["checkHandle"])
const checkHandle = () => {
  emit("checkHandle")
}
const GameList = reactive([
  {
    name: 'viewsSystem.downloadIndex71',
    title: 'viewsSystem.downloadIndex72',
    star:"4,3",
    img:getImageUrl('img/download/game1.webp')
  },
  {
    name: 'viewsSystem.downloadIndex73',
    title: 'viewsSystem.downloadIndex74',
    star:"4,5",
    img:getImageUrl('img/download/game2.webp')
  },
  {
    name: 'viewsSystem.downloadIndex75',
    title: 'viewsSystem.downloadIndex76',
    star:"4,8",
    img:getImageUrl('img/download/game3.webp')
  },
  {
    name: 'viewsSystem.downloadIndex77',
    title: 'viewsSystem.downloadIndex78',
    star:"4,9",
    img:getImageUrl('img/download/game4.webp')
  },
  {
    name: 'viewsSystem.downloadIndex79',
    title: 'viewsSystem.downloadIndex80',
    star:"4,7",
    img:getImageUrl('img/download/game5.webp')
  },
  {
    name: 'viewsSystem.downloadIndex81',
    title: 'viewsSystem.downloadIndex82',
    star:"4,7",
    img:getImageUrl('img/download/game6.webp')
  }
])
onMounted( () => {
  getLanguage()
})
const countryFlag = ref('')
const getLanguage = async () => {
    const appStore = useAppStore()
    const language = (await appStore.getLocale()) as Language
    countryFlag.value =  getImageUrl('img/download/' + language+'.png')
}
</script>
<style scoped lang="less">

.font-family-roboto{
  font-family:Roboto, "Google Sans",  Arial, sans-serif;
}
.font-family-google-sans{
  font-family: "Google Sans", Roboto, Arial, sans-serif;
}
p,div,span{
  font-family:Roboto, "Google Sans",  Arial, sans-serif;
}
ion-content {
  font-family:Roboto, "Google Sans",  Arial, sans-serif;
  .ios-first {
      margin: 0;
      padding: 0;
      border: 0;
      vertical-align: baseline;
      background-color: #fff;
      font-size: 0.875rem;
      color: rgba(0, 0, 0, .87);
      font-family: Roboto, RobotoDraft,"Google Sans", Helvetica, Arial, sans-serif;
      overflow-y: scroll;

    .wrap {
      width: calc(100% - 3rem);
      position: relative;
      margin: 0 auto;

      .top-content {
        margin-top: 3rem;
        height: auto;
        margin-bottom: 1.5625rem;

        .header {
          color: #202124;
          .iconHeader img {
            width: 4.5rem;
            height: 4.5rem;
            border-width: 0;
            box-shadow: 0 0.0625rem 0.125rem 0 rgba(60, 64, 67, .3), 0 0.0625rem 0.1875rem 0.0625rem rgba(60, 64, 67, .15);
            border-radius: 20%;
            margin: 0.4375rem 1.5rem 0 0;
          }
          .header-text{
            .p1{
              width: 100%;
              font-size: 1.5rem;
              display: flex ;
              line-height: 2rem;
              letter-spacing: 0;
              font-weight: 400;
              font-weight: 500;
              align-items: flex-end;
              overflow-wrap: anywhere;
              word-break: keep-all;
              white-space:break-spaces;
            }
            .p2{
              font-size: 1rem;
              color: #0070c9;
              margin-top: 0.0625rem;
              line-height: 1.5rem;
              font-size: 1rem;
              letter-spacing: .00625em;
              font-weight: 500;
            }
            .p3{
              font-size: 0.75rem;
              line-height: 1rem;
              font-size: .75rem;
              letter-spacing: .025em;
              font-weight: 400;
              color: #5f6368;
            }
            
          }
          .app-score{
            height: 4rem;
            margin:1rem 0 0.75rem;
            padding: 0.75rem 0;
            font-size: 0.75rem;
            div.star {
              height: 2.75rem;
              margin:0 auto;
              div{
                position: relative;
                min-width: 6rem;
                height: 2.75rem;
                padding: 0.125rem 1rem;
                &:first-child{
                  padding: 0px;
                }
                &:not(:first-child)::before {
                    content: "";
                    background-color: #e8eafd;
                    display: block;
                    height: 1.5rem;
                    left: 0;
                    position: absolute;
                    top: calc(50% - 0.75rem);
                    width: 0.0625rem;
                  }
                  .star-text{
                      font-size: 0.875rem;
                      font-style: normal;
                    }
                  .star-icon{
                    display: inline-block;
                    margin-top: 0.0625rem;
                    vertical-align: middle;
                    font-size: 0.75rem;
                    font-style: normal;
                    color: rgb(32, 33, 36);
                  }
                  .text{
                    color: #5f6368;
                    line-height: 1rem;
                    display: inline-block;
                    height: 1.25rem;
                    &:last-child{
                      justify-content: center;
                      white-space: nowrap;
                    }
                  }
                  span{
                    display: inline-block;
                    height: 1.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    &.icon-img{
                      height: auto;
                    }
                  }
              }
            }
          }
        }
      }
      // 轮播图
      .banner{
        /* 隐藏滚动条 */
        &::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none; 
        scrollbar-width: none; 

        .publicUrl {
          width: 7.1875rem;
          height: 12.75rem;
          flex-shrink: 0;
          margin-right: .75rem;
          background-size: 100% 100%;
          border-radius: 0.5rem;
          overflow: hidden;
          img {
            vertical-align: top;
            width: 100%;
            height: 100%;
            }
        }
      }
    
      .shiny {
        position: relative;
        overflow: hidden;
        .download {
          display: inline-block;
          width: 1.25rem;
          height: 1.25rem;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAaUlEQVR4nGNgGDHgzacvR99++vofhN98/HKY6ha8hRoOw6MWYIC3o0E0/ILo7acv5eiG4sJvPn2pp5klb8g1nBhL3lBqOD5LqGY4NkuobjgMvP34tQGE4QKjgKqA2Ez1lkhMfwsYhioAAPmkvKD8qPnDAAAAAElFTkSuQmCC);
        }
      }
      .btn {
        width: 100%;
        height: 2.25rem;
        margin-top: 1.125rem;
        border-radius: 0.5rem;
        background: #0070c9;
        color: #fff;
        cursor: pointer;
        div{
          height: 100%;
          span{
            font-weight: 500;
          }
        }
      }

      .rating {
        color: rgb(95, 99, 104);
        .comments-title{
          font-weight: 500;
        }
        .comment{
          line-height: 1.25rem;
          font-size:0.875rem;
        }
        .user-help{
          line-height: 1.25rem;
          font-size:0.75rem;
        }
        .help{
          .is-help{
            font-size:0.75rem;
            color: #5f6368;
          }
          p span{
            display: inline-block;
            border: 0.0625rem rgba(95, 99, 104,0.5) solid;
            font-size:0.875rem;
            padding: 0 0.625rem;
            border-radius: 1rem;
            margin-left: 0.875rem;
          }
        }
      }

      .description__content,
      .comments__tips,
      .items-start {
        color: rgb(95, 99, 104);
        line-height: 1.25rem;
      }
      .device{
        >div{
          height: 2rem;
          line-height: 2rem;
          padding: 0 1rem;
          border-radius: 1rem;
          color: #202124;
          font-weight: 500;
        }
      }
      .start {
        width: 1rem;
        height: 1rem;
        font-size: 0.75rem
      }

      .start_small {
        width: 0.75rem;
        height: 0.75rem;

      }

      svg {
        fill: #0070c9;
      }

    }
  }
}
// 关于游戏
.about-game{
    margin-top: 1.25rem;
    font-weight: 500;
    div{
      font-size: 1.125rem;
      margin-bottom: 1.25rem;
      font-weight: 500;
      line-height: 1.5rem;
      display: flex
;
    justify-content: space-between;
    }
    p{
      font-size: 0.875rem;
      letter-spacing: 0.2px;
      line-height: 1.25rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 6;
      max-height: 7.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: normal;
      color: #5f6368;
    }
}
// 更新游戏
.update-game{
  margin-top: 1.5rem;
  .update-title{
    line-height: 1.25rem;
    font-size: .875rem;
    letter-spacing: 0.2px;
    font-weight: 500;
  }
  .update-time{
    font-size: .875rem;
    font-weight: 400;
    letter-spacing: .0142857143em;
    line-height: 1.25rem;
    margin-top: 0.25rem;
    color:#5f6368;
  }
  
}
// 推荐游戏
.recom-games{
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 0.75rem;
    margin-bottom: 0.25rem;
    margin-top: 1.75rem;
  div{
    height: 2rem;
    line-height: 2rem;
    padding: 0 0.9375rem 0;
    color: #5f6368;
    border: 1px solid #dadce0;
    border-radius: 1rem;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
}

// 数据安全
.data-safety{
  .safety-title{
    font-weight: 500;
  }
  .safety-content{
    line-height: 1.25rem;
    color: #5f6368;
    letter-spacing:0.2px;
  }
  .safety-info{
    padding: 1.25rem 1.25rem 0;
    line-height: 1.25rem;

    .item{
      &:not(:first-child){
        margin-top: 1.25rem;
      }
        .icon {
          width: 1.25rem;
          height: 1.25rem;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          margin-right: 1.25rem;
          padding: 0.625rem;
      }
      .icon-img1{
        background-image: url(data:image/png;base64,UklGRuwAAABXRUJQVlA4TN8AAAAvE8AEEDW4jQBGbTSIVyPp7C4wRM5doOcdmEp/F6xy2cZs6TKBFOE2tm1V+ZELDjW4Q/wo5b8YDbUEJ3Zpx6qwCFLdCtxGbQJ0l/UM/YPk1VwI6F8Q659Z7pLYDNXukmM7IPKK2rXTjRccHZAQwnwg1smxFRJwa+Wp2WK8zuPNv2C5pquBlov4gaQHcLv8goUvwoI3Mjzm+e78swbx84yYz0FRlq/kAQufzQ2nWcPVQM1FckXSA/ia/WQc6aVdOpquS0eSXgVATNZTjo9nm+F6xPde+2fEemeBs1yYSkUBAA==);
      }
      .icon-img2{
        background-image: url(data:image/png;base64,UklGRkQBAABXRUJQVlA4TDcBAAAvE8AEEJXArm3b2HPb/GPb9qtt286rW0gV6cDasQtY0Zdxv3yIgGNb2/Eqtm0bI7BKd5lFOrt1cm/HDp3VegC2bVvvBPARSrKYbB1sGVhOSPqM9UQ8JEEiWO9rKfukvrqXvXnhhBNX9pY3VH2C5AmQt8SDuctW6kcMqXY0AWQFiR2QJQFaux7ain95KW8Q4afcu/sCyLjNXX7gMGpTL44CEhmEoaXeJIGXfPtLzqmtnJYZyDhN+AAMPf7LSfxxnX+DqlvIOXMc+REvDkY6AWqHz6IFe27oADLE/2QcI0E8rFTuQc5pyIOzjS8JDDbpKeXyOR198SAu0yWvbMaI72Vf5B09cBBIgJwNoKXXetZu1ihe9Ox9L/FDSgDZOjuaR+qnFTMIcZv6m8daR/5aRpuHJspiGsQ7BwA=);
      }
      .icon-img3{
        background-image: url(data:image/png;base64,UklGRuYAAABXRUJQVlA4TNkAAAAvE8AEEMegoJGkZsC/I3ygpHcbitpGcrLLn9LiWBRX/i2K2jaSzB/QAlki+z/DNrJtJd/d0Jgh9G5onDqI3AkAICGUURme+Wm6KKI8/UIsgYFx7FWlGv03eF8s9xy+jnV2vs+23wDcXxAhQGDQSJKiOXo8Zv9Wn+YdRPRfkdu2jXTK6vwFfqnXVX8gQq+l1B7EC8soyR+HT2UsD9ScFjftnOpeHVPioZzjVgzF4kVbwkVLeDU1AGd177h6AlvZYXK8mQ32snFwAdXCLcS9FfWm1NtTf8T85R8BAA==);
      }
      .icon-img4{
        background-image: url(data:image/png;base64,UklGRugAAABXRUJQVlA4TNsAAAAvE8AEEP+goI0kZfwbvCcVzL82lEaSFHX+EaLwSNQPq6htJCf88d3vUPQ+O0wCAEwzZsVTDPr9K1GFBwClWQACCNAAAggQEMCCkmqecy6qGCn+/9N3v+J/Qj+GVtJ5P/C7n445zY/v3Mv1vqh+YAESQwGOMbNiAIaRJClZ7PHD5Y3NP08cAojo/wTg7Xkr0uZnymkcVpJch3Eq92aenvegNQ61xqExyIogKDIYc6qjUuyuCOOY8nc9lWJ/yhqEKZCGMPbI+SiJlYqTyLujZePhthyhqaUSqaRu8G4A);
      }
    }
    .details{
      color: #0070c9;
      line-height: 3.5rem;
      margin-top: 0;
    }
  }
}
// 查看所有评论
.all-comment{
  .description{
    line-height: 1.25rem;
    color: #5f6368;
  }
}
// 推荐游戏
.recommend-game{
  .list{
     padding:0.75rem 0 ;
      div{
        display: grid;
        grid-template-rows: max-content;
        height: fit-content;
        row-gap: 0.375rem;
        width: 6.1875rem;
        overflow: hidden;
        font-size: .75rem;
        p{
          display: inline-flex;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          align-items: center;
          &.star{
            em{
              font-style: normal;
              font-size: 0.625rem;
            }
          }
        }
      }
  }
  .mark {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    vertical-align: middle;
    margin-right: 1rem;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAhCAYAAACvBDmYAAACJ2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjMzIgogICBleGlmOlBpeGVsWERpbWVuc2lvbj0iNDIiCiAgIGV4aWY6VXNlckNvbW1lbnQ9IlNjcmVlbnNob3QiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjE0NC8xIgogICB0aWZmOllSZXNvbHV0aW9uPSIxNDQvMSIvPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0iciI/PohRH5IAAAFeaUNDUElDQyBQcm9maWxlAAAokW2QPUhCYRSG31tXhAopcGy4Q9APFnL73UIdJGi4aNEPFFw/TQOvfVxvlASuETS31NAgrQ0VDi0NDU0tQUVDzdESBC4lX+fT6mp14HAeXl4O57xAi2pynlUBWDnHjkXD2vzCouZ9hgcKutCDMZPlecgwpsmC79lclVvyUt0Myl2vJ8t+q7hfOjsoPL4EnxJ//U3VlkzlGc0P6gHGbQdQ+oiNDYdL3iT223QU8a7kdJ0PJSfqfFrzzMQixFfEnSxjJonviQOJBj3dwFZ2nX3dIK/vSOVm4zR91N2IQ8c4wphAEAZl8793pOaNYA0cBdhYRRoZONAQIoUjixTxFHJgGEKAWKd9OkZlxr+zc7XtJWBySwhx7mpRyueY2nftar1FemMHuCxx0zZ/ElUqan5lWK9zexnw7AnxNgd4+4HqnRDvZSGqR0DrA3BR+QQKfmhAwdifhAAAAYZJREFUWAlj/A8EDEMAMA0BN4KdOGQcykJKiIJSyd+/f0nRAlbLwkKSNVjNJ8mEDRs3MyxfuQarQfgEp03uZxAREcanhKAcXaL+wcOHBB1CSAGdHPqIkDsIyjOSUjyt37AJHvWR4SEMgQF+OC04euwEw8TJ03DKo0ssWzyPAV9aplmIKijIo7uFIj7NHCopIc7Azs5GkeOQNZOU65E1EmIzMTExLJg7kwFfxRcVm0TIGLg8zRwKsoGZmRluEaUMmkU9pQ5D1z/qUPQQoZQ/ZEKU7MwEqvOJrfejI8MY/P188AYqIyMjXnm6hOiDh4/wOoIYSfo49AHljRKyoz48NIghwN8XZ2D8+fOXITElnQFEP332nCEqNhGnWmIkyHYoqObBV6CD5GRlZBjuQ0MT5GB8AF8NBtJHtkPxWQqTU1JSZHj8+AmMi5cmlJlo6tD01CQGEKYGoEtmGnUoNUKA2maMRv2IDVGSiicNDXWG0JBAcGCB2PQEJHWX6ekwdLtGMxN6iFDKBwB2gViXF4bkxAAAAABJRU5ErkJggg==);
  }
}
.bottom-shiny{
    width: 100%; 
    height: 2.25rem;
    margin: 0.375rem 0;
    border-radius: 0.5rem;
    background: #0070c9;
    color: #fff;
    div{
      height: 100%;
      span{
        font-weight: 500;
      }
    }
}
.line{
  width: 100%;
  height: 1px;
  background: #dadce0;
  margin: 2.5rem 0;
}
.store .flag{
  width: 1.5rem;
  height: 1.125rem;
}
</style>
