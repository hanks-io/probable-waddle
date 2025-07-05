import { getCssProperty, convertMoneyToShow } from '@/utils'
import { commonLayoutConfig, DEFAULT_STYLE } from './common.layout.config'
import { neoBlueConfig } from './neo-blue.layout.config'
import { shallowRef } from 'vue'
import { type ThemeType, type StyleConstants, type IconConfig } from './type'

// 当前激活的标签
const labelActive = shallowRef({text: "",uuid: ""})

// 获取样式常量
const getStyleConstants = (themeStyle: Partial<StyleConstants> = {}): StyleConstants => ({
  block_border: getCssProperty('--ep-color-border-default') || DEFAULT_STYLE.block_border,
  block_background: getCssProperty('--ep-color-background-fill-body-default') || DEFAULT_STYLE.block_background,
  active_color: getCssProperty('--ep-color-border-brand') || DEFAULT_STYLE.active_color,
  font_color: getCssProperty('--ep-color-text-highlight') || DEFAULT_STYLE.font_color,
  prizeGgimg0: DEFAULT_STYLE.prizeGgimg0,
  prizeGgimg1: DEFAULT_STYLE.prizeGgimg1,
  shadow: DEFAULT_STYLE.shadow,
  outerpadding: DEFAULT_STYLE.outerpadding,
  innerpadding: DEFAULT_STYLE.innerpadding,
  row: DEFAULT_STYLE.row,
  col: DEFAULT_STYLE.col,
  firstimgwidth: DEFAULT_STYLE.firstimgwidth,
  firstimgheight: DEFAULT_STYLE.firstimgheight,
  text_top: DEFAULT_STYLE.text_top,
  img2: DEFAULT_STYLE.img2,
  ...themeStyle
})

// 主题样式映射
const THEME_STYLE_MAP: Record<ThemeType, Partial<StyleConstants>> = {
  ...commonLayoutConfig, // 其他号皮肤
  ...neoBlueConfig, // 18号皮肤
}

// 设置默认主题
THEME_STYLE_MAP['green-default'] = THEME_STYLE_MAP['forest-green']

// 获取主题样式常量
const STYLE_CONSTANTS = (theme: ThemeType) => getStyleConstants(THEME_STYLE_MAP[theme])

// 网格配置
const GRID_CONFIG = (theme: ThemeType) => {
  const style = STYLE_CONSTANTS(theme)
  return {
    blocks: [
      { padding: style.outerpadding, background: style.block_border, borderRadius: '0.375rem' },
      { padding: style.innerpadding, background: style.block_background }
    ],
    activeStyle: {
      background: style.active_color,
      shadow: style.shadow,
      top: '0.1875rem'
    },
    button: {
      innerClass: 'lucky-grid-button-text',
      class: 'lucky-grid-button',
      innerClassDisabled: 'lucky-grid-button-text-disabled',
      classDisabled: 'lucky-grid-button-disabled'
    }
  }
}

// 创建奖品配置
const createPrizeConfig = (config: {text: string, uuid: string, imgSort: number}, theme: ThemeType) => {
  const style = STYLE_CONSTANTS(theme)
  const {uuid,text,imgSort} = config
  const isActive = uuid === labelActive.value.uuid
  const fontSizeConfig = {
    'xxxl': {
      fontSize: getCssProperty('--ep-font-size-xxxl') || style.text_top.xxxl.fontSize,
      top: style.text_top.xxxl.top
    },
    'xl': {
      fontSize: getCssProperty('--ep-font-size-xl') || style.text_top.xl.fontSize,
      top: style.text_top.xl.top
    },
    's': {
      fontSize: getCssProperty('--ep-font-size-m') || style.text_top.s.fontSize,
      top: style.text_top.s.top
    }
  }
  const fontSizeWithPostion = (() => {
    if (text?.length > 7) return fontSizeConfig['s']
    if (text?.length > 3) return fontSizeConfig['xl']
    return fontSizeConfig['xxxl']
  })()
  const img2 = ((index: number = 0) => {
    if(Array.isArray(style.img2)) {
      return style.img2[index]
    }
    return style.img2
  })(imgSort)

  return {
    imgs: [
      {
        src: isActive && style.prizeGgimg1 ? style.prizeGgimg1 : style.prizeGgimg0,
        height: style.firstimgheight,
        width: style.firstimgwidth,
        top: '0.09rem'
      },
      {
        src: img2?.url,
        height: img2?.height,
        width: img2?.width,
        top: img2?.top
      }
    ],
    borderRadius: getCssProperty('--ep-border-radius-m') || '0.375rem',
    row: style.row,
    col: style.col,
    fonts: [{
      text,
      fontColor: style.font_color,
      fontWeight: getCssProperty('--ep-font-weight-bold') || 'bold',
      ...fontSizeWithPostion
    }],
    background: isActive ? style.active_color : null
  }
}

// 网格奖品配置
const GRID_PRIZES = (theme: ThemeType, config: {
  rewardAmount: string
  weight: number
  uuid: string
}[]) => { 
  if (!config?.length) return []
  
  // 根据rewardAmount排序获取索引映射
  const sortedIndices = config
    .map((item, index) => ({ rewardAmount: parseFloat(item.rewardAmount), originalIndex: index }))
    .sort((a, b) => a.rewardAmount - b.rewardAmount)
    .reduce((acc, item, sortedIndex) => {
      acc[item.originalIndex] = sortedIndex
      return acc
    }, {} as Record<number, number>)
  
  const createPrizeWithPosition = (index: number, x: number, y: number) => ({
    x,
    y,
    ...createPrizeConfig({
      text: convertMoneyToShow(config[index].rewardAmount, 2),
      uuid: config[index].uuid,
      imgSort: sortedIndices[index]
    }, theme)
  })

  return [
    createPrizeWithPosition(0, 0, 0),
    createPrizeWithPosition(1, 1, 0),
    createPrizeWithPosition(2, 2, 0),
    createPrizeWithPosition(3, 2, 1),
    createPrizeWithPosition(4, 1, 1),
    createPrizeWithPosition(5, 0, 1)
  ]
}

// 图标配置映射
const ICON_CONFIG_MAP: Record<ThemeType, IconConfig> = {
  'auroral-yellow': { fill: '#23DB8C', stroke: '#191919' },
  'forest-green': { fill: '#50B388', stroke: '#009F76' },
  'green-default': { fill: '#50B388', stroke: '#009F76' },
  'green-dark': { fill: '#5C82F5', stroke: 'white' },
  'amber-purple': { fill: '#3083E4', stroke: '#5F588C' },
  'purple-light': { fill: '#5C82F5', stroke: 'white' },
  'mystlight-blue': { fill: '#3C68F9', stroke: '#D4D4D4' }
}

// 获取信息配置
const INFO_CONFIG = (theme: ThemeType) => ICON_CONFIG_MAP[theme] || {}

// 需要用到图片刷新动画的样式
const refreshAnimationWithImage = ['neo-blue']

export { GRID_CONFIG, GRID_PRIZES, INFO_CONFIG, labelActive, refreshAnimationWithImage }
