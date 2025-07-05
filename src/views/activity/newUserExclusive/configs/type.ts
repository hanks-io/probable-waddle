// 主题类型定义
type ThemeType = 'forest-green' | 'auroral-yellow' | string

type ImgItem = {
  top: string
  url: string
  height: string
  width: string
}

// 样式常量接口
interface StyleConstants {
  block_border: string
  block_background: string
  active_color: string
  font_color: string
  prizeGgimg0: string
  prizeGgimg1: string
  shadow: string
  outerpadding: string
  innerpadding: string
  row: number
  col: number
  firstimgwidth: string
  firstimgheight: string
  text_top: {
    xxxl: {
      fontSize: string
      top: string
    }
    xl: {
      fontSize: string
      top: string
    }
    s: {
      fontSize: string
      top: string
    }
  }
  img1?: ImgItem | ImgItem[]
  img2?: ImgItem | ImgItem[]
  img3?: ImgItem | ImgItem[]
}

// 图标配置接口
interface IconConfig {
  fill: string
  stroke: string
}

export type { ThemeType, StyleConstants, IconConfig }
