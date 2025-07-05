// 倒计时 逻辑层
import { calcTimeDiff, Time } from '@/utils/date'
import { onBeforeMount, ref, watch, reactive, computed, onBeforeUnmount, onDeactivated } from 'vue';

export interface Item {
  unit: string,
  digit: string
}

export default function useCountDownLogic({props, emit}: {props: any, emit: any}) {
  const timeRef = ref<Item[]>([])
  let timeId: number | null = null

  const addZero = (digit: number) => digit >= 10 ? `${digit} ` : `0${digit}`

  const getCountdownData = (time: Time) => {
    let { minute, hour, day ,second} = calcTimeDiff(time!)
    if (props.hasSecond == true) {
      if (second <= 0) {
        timeRef.value = [{ unit: 'DAYS', digit: '00' }, { unit: 'HOURS', digit: '00' }, { unit: 'MIN', digit: '00' },{ unit: 'SEC', digit: '00' }]
        //  倒计时归零 新的开始， 再次请求数据
        emit("updateTime")
        return
      }
    timeRef.value = [{ unit: 'DAYS', digit: addZero(day) }, { unit: 'HOURS', digit: addZero(hour - (day * 24)) }, { unit: 'MIN', digit: addZero(minute % 60) },{ unit: 'SEC', digit: addZero(second % 60) }]
    
    } else {
      if (minute <= 0) {
          timeRef.value = [{ unit: 'days', digit: '00' }, { unit: 'hour', digit: '00' }, { unit: 'minute', digit: '00' }]
          //  倒计时归零 新的开始， 再次请求数据
          emit("updateTime")
          return
      }

      timeRef.value = [{ unit: 'days', digit: addZero(day) }, { unit: 'hour', digit: addZero(hour - (day * 24)) }, { unit: 'minute', digit: addZero(minute % 60) }]
    }

  }

  watch(() => props.issueEndTime, (time) => {

      if (!props.issueEndTime) return
      if (timeId) clearInterval(timeId)
      getCountdownData(time!)
      //倒计时
      if (props.hasSecond == true) {
          timeId = window.setInterval(() => {
              getCountdownData(time!)
          }, 1000)
      } else{
        timeId = window.setInterval(() => {
          getCountdownData(time!)

      }, 60000)
      }


  }, { immediate: true })

  onBeforeUnmount(() => {
      if (timeId) clearInterval(timeId)
  })
  onDeactivated(() => {
      if (timeId) clearInterval(timeId)
  })

  return {
    timeRef
  }
}
