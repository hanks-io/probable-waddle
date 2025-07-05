// 红包雨首页入口 逻辑层
import { useActivityStore } from '@/store/activity'
import { ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router'
import { ZValidCondition } from '@/enums/types/activity.type';

export default function useLogic() {
  const activityStore = useActivityStore()// 活动store

  const showRedPacketRain = ref(false)      // 是否显示红包雨
  const activityId = ref('')                // 红包雨活动ID
  const openRedModel = ref(false)           // 红包雨详情弹窗
  
  watch(() => activityStore.activityList, (activityList) => {
    if (activityList.length ) {
      const redDate = activityList.find(item => item.type == 'RedPacket')
      if (redDate?.id) {                                     // 是否配置红包雨
        activityId.value = redDate.id
        activityStore.setRedPacketDetail(redDate.id)
      }
      else {
        showRedPacketRain.value = false
      }
    }
    else {
      showRedPacketRain.value = false
    }
  })

  watch(() => activityStore.redPacketDetail, (details) => {
    if (details && activityId.value) {
      if (ZValidCondition.enum.RECHARGE === details?.JoinTypes) {
        showRedPacketRain.value = details?.dailyMaxCount ? details.dailyMaxCount > details?.receiveCount: true
      }
      else {
        showRedPacketRain.value = true
      }
    } else {
      const redDate = activityStore.activityList.find(item => item.type == 'RedPacket');
      if (!redDate?.id) return;
      if (!activityId.value) {
        activityId.value = redDate.id;
        activityStore.setRedPacketDetail(redDate.id);
      }
    }
  },{ deep: true, immediate: true })
  
  // 关闭红包雨
  function closeRedPacketRain () {
    showRedPacketRain.value = false
  }
  
  // 开启红包雨详情弹窗
   function openRedPacketModel() {
    openRedModel.value = true
   }
  
   function closeModel() {
    openRedModel.value = false
   }

   onBeforeRouteLeave((_to, _from, next) => {
    closeModel();
    next();
  })

   return {
    showRedPacketRain,
    activityId,
    closeRedPacketRain,
    openRedModel,
    openRedPacketModel,
    closeModel
   }
}


