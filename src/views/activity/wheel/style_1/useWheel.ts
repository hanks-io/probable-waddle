import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';


interface Props {
  onActivityApply: () => Promise<number | undefined>
  endCallback: (prize: any) => void,
  activityApplyParams: any
  showEndCountdown: Ref<boolean>
}

interface PrizeItem {
  type: string;
  amount: number;
}

interface PrizeFont {
  text: string;
  top: string;
  fontColor?: string;
}

interface PrizeImage {
  src: string;
  width: string;
  top: string;
}

interface WheelPrize {
  fonts: PrizeFont[];
  imgs: PrizeImage[];
}


export default (props: Props) => {
  const { t } = useI18n();
  
  const showMask = ref(false);
  const allPrizesDefaultStyle = reactive({
    background: 'transparent',
    fontSize: '0.875rem',
    fontColor: 'rgba(245, 215, 141, 1)',
    fontWeight: '700',
    fontFamily: 'Prompt',
  })
  // 新皮肤转盘HAPPY样式 
  const svgSymbol = ref (1)
  const htmlElement = document.querySelector<HTMLHtmlElement>('html')
  const isNewSkinSymbol = !!htmlElement?.className.match(/\bnew-skin-symbol\b/)
  if (isNewSkinSymbol) {
    svgSymbol.value = 2 //默认svg颜色为橙色，新皮肤为蓝色,此处用于区分
    const newSkinStyle = reactive({
      background: 'transparent',
      fontSize: '0.875rem',
      fontColor: 'rgba(255, 255, 255, 1)', // 转盘字体颜色 x1 Thanks
      fontWeight: '700',
      fontFamily: 'Prompt',
    })
    Object.assign(allPrizesDefaultStyle, newSkinStyle)
  }

  const activePrizeStyle = ref({
    background: 'transparent',
    fonts: [
      {
        fontColor: 'rgba(245, 215, 141, 1)'
      }
    ]
  })
  const prizesDataList = ref<PrizeItem[]>([]);
  const wheelPrizes1 = computed(() => {
    const list = JSON.parse(JSON.stringify(prizesDataList.value))
    return list.map((item: PrizeItem, index: number): WheelPrize => {
      const { type, amount } = item;
      if (type === 'goldCoins') {
        return {
          fonts: [{ text: convertMoneyToShow(amount), top: '50%' }],
          imgs: [{ src: `/svg/activity/wheel_goldCoins1.svg`, width: '2.25rem', top: '10%' }]
        }
      }
      if (type === 'nothing') {
        return {
          fonts: [{ text: 'Thanks', top: '50%' }],
          imgs: [{ src: `/svg/activity/wheel_nothing1.svg`, width: '1.5rem', top: '10%' }]
        }
      }
      return {
        fonts: [{ text: 'x1', top: '50%' }],
        imgs: [{ src: `/svg/activity/wheel_${type}${svgSymbol.value}.svg`, width: '1.75rem', top: '15%' }]
      }
    })
  });

  const countdownTime = ref(['00', '00', '00', '00']);
  const labelList = ['date.days', 'date.hour', 'date.minute', 'date.second'];
  const displayCountdownTime = computed(() => {
    let list = ['99', '99', '99', '99']
    if (props.showEndCountdown.value) {
      list = countdownTime.value
    }
    return list.map((item: string, index: number) => {
      return {
        label: t(labelList[index]),
        value: item,
      }
    })
  })

  const initPrizes = () => {
    showMask.value = false
    allPrizesDefaultStyle.fontColor = 'rgba(245, 215, 141, 1)'
  }

  const startBefore = async (elRef: any) => {
    const { onActivityApply, activityApplyParams } = props
    if ('exchangeCount' in activityApplyParams.applyInfo.info) {
      activityApplyParams.applyInfo.info.exchangeCount = 0
    }
    const index = await onActivityApply()
    if (typeof index === 'number' && Number.isFinite(index) && wheelPrizes1.value[index]) {
      const activePrize = JSON.parse(JSON.stringify(wheelPrizes1.value[index]))
      activePrize.fonts[0].fontColor = 'rgba(245, 215, 141, 1)'
      activePrize.background = 'transparent'
      activePrizeStyle.value = activePrize
      initPrizes()
      elRef.play()

      setTimeout(() => {
        elRef.stop(index)
      }, 2000)
    }
  }

  const endAfter = (prize: any) => {
    if (Object.keys(prize).length) {
      allPrizesDefaultStyle.fontColor = 'rgba(245, 215, 141, 0.3)'
      showMask.value = true
      props.endCallback(prize)
    }
  }

  return {
    endAfter,
    initPrizes,
    startBefore,
    showMask,
    wheelPrizes1,
    prizesDataList,
    countdownTime,
    activePrizeStyle,
    allPrizesDefaultStyle,
    displayCountdownTime,
  }
}
