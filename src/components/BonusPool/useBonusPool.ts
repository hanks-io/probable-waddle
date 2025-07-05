import { useTenantStore } from '@/store/tenant';
import { prizePoolInfoApi } from '@/api/normal/index';

export default (props?: { watchRoute: any }) => {

  const tenantStore = useTenantStore();
  const { tenantInfo } = toRefs(tenantStore);
  
  const money = ref(0);
  
  const moneyAddTime = 2; // 金额增长时间(秒)
  const errorIntervalTime = 60 * 1000; // 请求接口间隔时间(秒)
  const successIntervalTime = 60 * 1000; // 请求接口成功间隔时间(秒)

  const animationKey = ref(0);

  const addNumber = (nowNumber: string | number) => {
    cancelAnimationFrame(animationKey.value);
    const lastNumber = Number(nowNumber);
    const diffNumber = lastNumber - money.value;
    let changeTimes = moneyAddTime * 60;
    const randomNumber = diffNumber / changeTimes;
    
    const step = () => {
      changeTimes -= 1;
      money.value += randomNumber;
      if (changeTimes <= 0) {
        cancelAnimationFrame(animationKey.value);
      } else {
        animationKey.value = requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const forDataTimeKey = ref<NodeJS.Timeout | number>(0);

  async function forDataList(list: any[]) {
    clearTimeout(forDataTimeKey.value);
    list = list.sort((a, b) => a.time - b.time);
    const nowDate = Date.now();
    const newList = list.slice(list.findIndex(item => item.time * 1000 > nowDate));
    for (let i = 0; i < newList.length; i++) {
      await new Promise((resolve) => {
        forDataTimeKey.value = setTimeout(() => {
          addNumber(newList[i].prizePoolValue);
          resolve(true);
        }, 3000);
      });
    }
  }

  const getDataTimeKey = ref<NodeJS.Timeout[]>([]);

  function intermittentRequest(time: number) {
    const timeKey = setTimeout(() => {
      getPrizePoolInfoData();
    }, time);
    getDataTimeKey.value.push(timeKey);
  }

  const closePrizePoolInfoData = ref(false);

  async function getPrizePoolInfoData() {
    getDataTimeKey.value.forEach(clearTimeout);
    if (!tenantInfo.value?.switch || closePrizePoolInfoData.value) return;
    try {
      const dataList = await prizePoolInfoApi();
      if (!dataList || dataList.length < 1) {
        intermittentRequest(errorIntervalTime);
        return;
      }
      forDataList(dataList);
      intermittentRequest(successIntervalTime);
    } catch (error) {
      intermittentRequest(errorIntervalTime);
    }
  }

  props?.watchRoute?.use((path: string, oldPath: string, next: (path: string, oldPath: string) => {}) => {
    next(path, oldPath);
    if (path !== '/main/inicio') {
      closePrizePoolInfoData.value = true;
      cancelAnimationFrame(animationKey.value);
    } else {
      closePrizePoolInfoData.value = false;
      getPrizePoolInfoData();
    }
  });

  provide('bonusPoolData', {
    money,
  });

  onMounted(() => {
    getPrizePoolInfoData();
  });

  onBeforeUnmount(() => {
    closePrizePoolInfoData.value = true;
    cancelAnimationFrame(animationKey.value);
  });

  return {
    money
  }
}