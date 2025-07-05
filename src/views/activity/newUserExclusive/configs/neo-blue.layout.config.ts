import { getImageUrlWithCache, getImageUrl } from "@/utils";
import { IMG_URL } from './common.layout.config';
const prizeGgimg1 = getImageUrlWithCache(IMG_URL + 'prize18_ac.svg')

export const neoBlueConfig = {
  'neo-blue': {
    block_border: '#200259',
    block_background: '#200259',
    active_color: 'transparent',
    font_color: '#fff',
    prizeGgimg0: getImageUrl(IMG_URL + 'prize18.svg'),
    prizeGgimg1: prizeGgimg1,
    shadow: '0px 0px 28px #7B44E4',
    firstimgwidth: '8.1rem',
    firstimgheight: '7.9625rem',
    outerpadding: '0rem',
    innerpadding: '-1rem 1rem -0.2rem -0.1rem',
    row: 1,
    col: 1,
    text_top: {
      xxxl: {
        fontSize: '2.25rem',
        top: '4.467rem'
      },
      xl: {
        fontSize: '1.25rem',
        top: '5.367rem'
      },
      s: {
        fontSize: '0.875rem',
        top: '5.35rem'
      }
    },
    img2: [
      {
        top: '2.25rem',
        url: getImageUrl(IMG_URL + 'style_18/coin1.png'),
        height: '2.4375rem',
        width: '3.125rem'
      },
      {
        top: '2.05rem',
        url: getImageUrl(IMG_URL + 'style_18/coin2.png'),
        height: '2.65rem',
        width: '4.1625rem'
      },
      {
        top: '2.05rem',
        url: getImageUrl(IMG_URL + 'style_18/coin3.png'),
        height: '2.5rem',
        width: '4.25rem'
      },
      {
        top: '1.85rem',
        url: getImageUrl(IMG_URL + 'style_18/coin4.png'),
        height: '3.0625rem',
        width: '4.4375rem'
      },
      {
        top: '1.75rem',
        url: getImageUrl(IMG_URL + 'style_18/coin5.png'),
        height: '3.25rem',
        width: '4.375rem'
      },
      {
        top: '1.45rem',
        url: getImageUrl(IMG_URL + 'style_18/coin6.png'),
        height: '3.625rem',
        width: '4.875rem'
      }
    ]
  }
}
