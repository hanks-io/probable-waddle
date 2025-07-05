<!-- 会员答谢(多日) -->
<template>
    <ion-page>
        <!-- 导航标签 -->
        <ion-header class="ion-no-border">
            <ion-toolbar mode="ios">
                <BackButton slot="start"  />
                <ion-title>{{ activityInfo.name }}</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!-- 活动时间 -->
            <div class="banner">
                <div class="boardBox">
                    <div class="timeBoard  leading-[0.9375rem]">
                        <p class="textBasic font-[380] text-[1rem]">{{ $t('activity.appreciation01') }}</p>
                        <p class="textEmphasis font-[700] text-[1.25rem]">{{ activityInfo.endTime }}</p>
                        <p></p>
                    </div>
                </div>
            </div>
            <!-- 倒计时 -->
            <div class="timeBox" :class=" timer ? '' : 'noTime'" v-if="timeBegin != '没有下一个会员日了'">
                <div class="tittle">
                    <div class="left">{{ todayIsMemberDay ? $t('activity.appreciation15') : $t('activity.appreciation20') }}</div>
                    <div class="right">{{ timeBegin }}</div>
                </div>
                <div class="timeCard">
                    <div class="timeCardItem">
                        <div class="top">
                            <div class="textBg">
                                {{ endTimeShow.days }}
                            </div>
                        </div>
                        <div class="bottom">{{ $t('activity.appreciation16') }}</div>
                    </div>
                    <div class="gap">
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                    <div class="timeCardItem">
                        <div class="top">
                            <div class="textBg">
                                {{ endTimeShow.hours }}
                            </div>
                            </div>
                        <div class="bottom">{{ $t('activity.appreciation17') }}</div>
                    </div>
                    <div class="gap">
                        <div class="dot"></div>
                        <div class="dot"></div>                   
                    </div>
                    <div class="timeCardItem">
                        <div class="top">
                            <div class="textBg">
                                {{ endTimeShow.minutes }}
                            </div>
                        </div>
                        <div class="bottom">{{ $t('activity.appreciation18') }}</div>
                    </div>
                    <div class="gap">
                        <div class="dot"></div>
                        <div class="dot"></div>                       
                    </div>
                    <div class="timeCardItem">
                        <div class="top">
                            <div class="textBg">
                                {{ endTimeShow.seconds }}
                            </div>
                        </div>
                        <div class="bottom">{{ $t('activity.appreciation19') }}</div>
                    </div>
                    <div class="middleLine">
                    </div>
                </div>
            </div>
            <div class="mx-auto w-[21.25rem] bg-[#090f1f]">
                <div class="des">
                    <!-- 循环周期 -->
                    <div>
                        <div class="flex items-center  mb-[0.5625rem]">
                            <ion-icon class=" text-2xl" icon="/first/svg/mysterious-icon1.svg"></ion-icon>
                            <span class="ml-1 font-medium text-sm leading-7  title-text">{{ $t('activity.appreciation02')
                                }}</span>
                        </div>
                        <div class="item w-full h-[3rem] rounded-[0.5rem]  flex items-center justify-center">
                            <span class="textTime text-xl font-bold">
                                {{ activityInfo.cycle }}
                            </span>
                        </div>
                    </div>
                    <!-- 奖励金额 -->
                    <div>
                        <div class="flex items-center mt-[1.5rem] mb-[0.5625rem]">
                            <ion-icon class="text-[1.6875rem]" icon="/first/svg/mysterious-icon2.svg"></ion-icon>
                            <span class="ml-1 font-medium text-sm leading-7  title-text">{{ $t('activity.appreciation12')
                                }}</span>
                        </div>
                        <div class="item w-full h-[3rem] rounded-[0.5rem]  flex items-center justify-center">
                            <span>
                                <span class="textCoin">{{ merchantCy }}</span>
                                <span class="textReward">{{ activityInfo.maxReward }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 活动规则 -->
                <div class="mt-[1.5rem] pb-28">
                    <p class="ruleHeader ">{{ $t('activity.appreciation13') }}</p>
                    <div class="ruleItem text-[1rem] font-normal textRule mb-[0.4375rem] text-[#7F8EB3]" v-for="(item, index) in activityInfo.description.split('\n')" :key="index">
                        <p  class="ruleDes w-full" v-if="activityInfo.ruleType == 'DEFAULT'">
                            {{ index != 0 && item ? item.replace(/^\d+\./, "") : null }}
                        </p>
                        <p  class="ruleDes w-full" v-else>
                            {{ item }}
                        </p>
                    </div>
                </div>
            </div>
        </ion-content>
        <Footer>
            <!-- 领取按钮 -->
            <div class="btn" :class="activityInfo.canReceive ? 'shiny active' : 'unable'" @click="onActivityApply">{{
                $t('toggle.claim') }}</div>
        </Footer>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonToolbar, IonHeader, IonIcon, IonTitle } from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'
import Footer from '@/views/activity/comp/default/Footer/index.vue';
import useLogic from './logic';

const { activityInfo, merchantCy, onActivityApply,endTimeShow,timer,timeBegin,todayIsMemberDay } = useLogic();


</script>

<style scoped lang="less">
// 基础公共 less
@import "@/views/activity/appreciationMultiDay/base-index.less";

ion-toolbar {
    --background: #10162966;
    --color: #fff;
    margin-bottom: -3.125rem;
    height: 3.125rem;
}

:deep(ion-button ion-icon) {
  color: #fff ;
}


.footer {
    height: 4.5rem;
    padding-top: 0.75rem;
    background: #101629 !important;
    box-shadow: 0rem 0.0313rem 0rem 0rem #2C354B inset !important;

    .btn {
        width: 22.875rem;
        height: 3rem;
        border-radius: 0.25rem;
        line-height: 3rem;
    }

    .btn.active {
        background: linear-gradient(350.74deg, #6A3AC1 23.01%, #B271E0 131.39%);
        box-shadow: none;
    }

    .btn.unable {
        opacity: 0.5;
        background: linear-gradient(350.74deg, #6A3AC1 23.01%, #B271E0 131.39%);
        color: #fff;

    }
}

.timeBox {
    width: 21.25rem;
    height: 8.375rem;
    background: #222634;
    border-radius: 0.5rem;
    margin: 3.75rem auto 1.5rem;
    padding-top: 0.75rem;
    .tittle {
        font-family: 'SF Pro Text';
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 1.5rem;
        margin-bottom: 0.75rem;
        line-height: 1.5rem;
        font-size: 0.8438rem;
        padding-left: 1.5938rem;
        padding-right: 1.5938rem;
        .left {
            font-weight: 700;
            color: #465375;
            margin-right: 0.5rem;
        }
        .right {
            font-weight: 600;
            color: #B5E9FF;


        }
    }
    .timeCard{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        position: relative;
        .timeCardItem {
            width: 4rem;
            .top {
                height: 3.5rem;
                line-height: 3.625rem;
                background: url('/svg/activity/appreciationFollowTimeCard.svg') no-repeat;
                background-size: cover;
                font-weight: 700;
                color: #7400C2;
                font-size: 3.75rem;
                .textBg {
                    font-family: 'Smooch Sans' !important;
                }
            }

            .bottom {
                font-family: 'Share Tech';
                font-size: 0.75rem;
                font-weight: 400;
                color: #F2F2F2;
                height: 0.875rem;
                margin-top: 0.25rem;
                line-height: 0.875rem;
            }
        }
        .gap {
                width: 0.25rem;
                height: 0.75rem;
                margin-left: 0.25rem;
                margin-right: 0.25rem;
                transform: translateY(-0.5625rem);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .dot {
                    width: 0.25rem;
                    height: 0.25rem;
                    background: #4C5266;
                    border-radius: 50%;
                    
                }
        }
        .middleLine {
            width: 100%;
            height: 0.125rem;
            background: #222634;
            position: absolute;
            left: 0;
            top: 1.75rem;
            transform: translateY(-50%);
            z-index: 1;
        }

    }
}
.timeBox.noTime {

    .timeCard{
        .timeCardItem {
            .top {
                background: url('/svg/activity/appreciationFollowTimeCardNoTime.svg') no-repeat;
                color: #7986A7;
                .textBg {
                    position: relative;
                    z-index: 2 ;
                }
            }

            .bottom {
                color: #3E4354;
            }
        }
    }
}
</style>


