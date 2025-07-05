<!-- 站点维护 -->
<template>
    <div class="w-full h-full max-w-[450px] mx-auto bg-[#090F1F]">
        <div class="mt-[9.3125rem]">
            <ion-img src="images/maintenanceBg.png"></ion-img>
            <p class="text-lg text-center mb-[0.625rem]">{{ $t('maintenance.text001') }}</p>
            <p class="text-sm text-center text-[#9BA7BE] ">{{ `${$t('maintenance.text002')}${endTime}` }}</p>
            <div class="w-[20rem] h-[5.625rem] mx-auto mt-[1.5625rem] rounded-[0.625rem] bg-[#101629] flex items-center justify-center">
                <ion-img class="flex-initial w-[3.4375rem] mr-5" src="/icons/customer_service.png" ></ion-img>
                <div>
                    <p class="text-sm leading-[1.375rem]">{{ $t('viewsUser.onlineCustService') }}</p>
                    <ion-button class="cust-btn" @click="onlineServiceHandle">
                        {{ $t('maintenance.text003') }}
                    </ion-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonImg, IonButton } from '@ionic/vue';
import { computed } from 'vue';
import { publicCustomerServiceApi } from '@/api/normal';
import { showLoading } from '@/utils/loading';
import { getRandomValue } from '@/utils/custom'
import { useI18n } from '@/hooks/useI18n';
import { openUrl } from '@/utils/app';
import { showToast } from '@/utils'

const props = withDefaults(
    defineProps<{
        endTime?: string;
    }>(),
    {
        endTime: '',
    }
)

const { t } = useI18n();

// 客服点击事件
async function onlineServiceHandle() {
    showLoading();
    const serviceConfig = await publicCustomerServiceApi();
    const onlineService = serviceConfig?.onlineServices ?? [];
    if (!onlineService.length) {
        showToast(t('maintenance.text004'));
        return;
    }

    const index = getRandomValue(0, onlineService.length - 1)
    const link = onlineService[index].link;
    if (!link) {
        showToast(t('maintenance.text004'));
        return;
    }

    openUrl(link)
}

</script>


<style scoped>

:global(ion-modal#maintenance::part(content)) {
    --height: 100%;
}

ion-content::part(background) {
    background: #090F1F;
}

ion-button {
    --background: linear-gradient(0deg, #0167CA -13.77%, #38A8FA 102.34%);
    --color: #FFFFFF;
    --border-radius: 0.375rem;
    --font-size: 0.75rem;
    padding: 0;
    min-height: 1.75rem;
}

ion-button::part(native) {
  width: 7.5rem;
  height: 1.75rem;
  white-space: normal;
  text-transform: none;
  font-size: 0.75rem;
  padding: 0;
}  
</style>
