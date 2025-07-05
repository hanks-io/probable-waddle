import { getImageUrl } from "@/utils";
import { type StyleConstants } from './type';

// 图片资源路径
export const IMG_URL = 'img/activity/newuser/'

// 默认样式
export const DEFAULT_STYLE: StyleConstants = {
  block_border: 'rgba(36, 43, 66, 1)',
  block_background: 'rgba(16, 18, 29, 1)', 
  active_color: '#009dff',
  font_color: '#F5C84C',
  prizeGgimg0: getImageUrl(IMG_URL + 'prize.svg'),
  prizeGgimg1: '',
  shadow: '0px 0px 28px #FFF713',
  outerpadding: '0.0625rem',
  innerpadding: '0.8rem 0.2rem 0.75rem 0',
  row: 0.906,
  col: 0.896,
  firstimgwidth: '6.125rem',
  firstimgheight: '4.875rem',
  text_top: {
    xxxl: {
      fontSize: '2.25rem',
      top: '0.167rem'
    },
    xl: {
      fontSize: '1.25rem',
      top: '0.767rem'
    },
    s: {
      fontSize: '0.875rem',
      top: '1.15rem'
    }
  },
  img2: {
    top: '2.65rem',
    url: getImageUrl(IMG_URL + 'prize1.svg'),
    height: '2rem',
    width: '2rem'
  }
}

export const commonLayoutConfig = {
  'forest-green': {
    block_border: '#00694A',
    block_background: '#00422F',
    active_color: '#fff',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize2.svg'),
    shadow: '0px 0px 28px #fff'
  },
  'auroral-yellow': {
    block_border: '#37352F',
    block_background: '#24221F',
    active_color: '#F7FB43',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize3.svg'),
    shadow: '0px 0px 28px #FFF713'
  },
  'yellow-dark': {
    block_border: '#2E2D2C',
    block_background: '#181816',
    active_color: '#6691D5',
    font_color: '#FEB805',
    shadow: '0px 0px 28px #6691D5',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize4.svg')
  },
  'green-dark': {
    block_border: '#242F42',
    block_background: '#1A1D22',
    active_color: '#3E9B2F',
    font_color: '#F5C84C',
    shadow: '0px 0px 28px #3E9B2F',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize5.svg')
  },
  'amber-purple': {
    block_border: '#5F588C',
    block_background: '#292547',
    active_color: '#98C24F',
    font_color: '#F5C84C',
    shadow: '0px 0px 28px #98C24F',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize6.svg')
  },
  'purple-light': {
    block_border: '#CAB4FD',
    block_background: '#E3D4FC',
    active_color: '#FEB805',
    font_color: '#FC974C',
    shadow: '0px 0px 28px #FEB805',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize7.svg')
  },
  'mystlight-blue': {
    // block_border: '#24221F',
    // block_background: '#181816',
    // active_color: '#6691D5',
    // font_color: '#FEB805',
    shadow: '0px 0px 28px #FE963B',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize19.svg')
  }
}
