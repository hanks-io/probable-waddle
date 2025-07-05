/**
 * @description 设置抽奖卡牌背景样式
 */
export function setCardStyle(type?: string, size?: string) {
  let style = {
    background: '',
    backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
    backgroundSize: '100% 22.22%, 100%, 100% auto',
    backgroundPosition: size ? '0 4rem, 0 0, 0 0' : '0 4.375rem, 0 0, 0 0',
  }
  switch(type) {
    case 'prop_H':
      style.background = 'linear-gradient(270deg, #E4D4F9 0%, #A973EE 100%), url(/svg/activity/card_snow.svg), linear-gradient(31.96deg, #AD65ED 1.88%, #E693F9 100%)'
      break;
    case 'prop_A':
      style.background = 'linear-gradient(270deg, #F9D4D4 0%, #FF5B5B 100%), url(/svg/activity/card_snow.svg), linear-gradient(31.96deg, #ED6565 1.88%, #F99393 100%)'
      break;
    case 'prop_P':
      style.background = 'linear-gradient(270deg, #F9D4D4 0%, #EEC473 100%), url(/svg/activity/card_snow.svg), linear-gradient(31.96deg, #ED6565 1.88%, #FFE925 100%)'
      break;
    case 'prop_P2':
      style.background = 'linear-gradient(270deg, #FFCAFC 0%, #F68EF1 100%), url(/svg/activity/card_snow.svg), linear-gradient(31.96deg, #ED65B7 1.88%, #F793F9 100%)'
      break;
    default:
      style.background = 'linear-gradient(270deg, #C3D3FF 0%, #91A2F7 100%), url(/svg/activity/card_snow.svg), linear-gradient(31.96deg, #65EDCC 1.88%, #939DF9 100%)'
  }
  return style;
}

/**
 * @description 设置抽奖卡牌文字样式
 */
export function setCardNameStyle(type?: string) {
  let style = {
    color: '',
  }
  switch(type) {
    case 'prop_H':
      style.color = '#DB55FF'
      break;
    case 'prop_A':
      style.color = '#FF5B5B'
      break;
    case 'prop_P':
      style.color = '#EEC473'
      break;
    case 'prop_P2':
      style.color = '#F68EF1'
      break;
    default:
      style.color = '#53BBFF'
  }
  return style;
}

/**
 * @description 设置抽奖卡牌数字描边样式
 */
export function setAccountStroke(type?: string, size: string = '1rem') {
  let style = {
    color: 'white',
    fontSize: size,
    textShadow: '',
  }
  switch(type) {
    case 'prop_H':
      style.textShadow = '-1px -1px 0 #BD5AF2, 1px -1px 0 #BD5AF2, -1px  1px 0 #BD5AF2, 1px  1px 0 #BD5AF2'
      break;
    case 'prop_A':
      style.textShadow = '-1px -1px 0 #FF5959, 1px -1px 0 #FF5959, -1px  1px 0 #FF5959, 1px  1px 0 #FF5959'
      break;
    case 'prop_P':
      style.textShadow = '-1px -1px 0 #FF8F16, 1px -1px 0 #FF8F16, -1px  1px 0 #FF8F16, 1px  1px 0 #FF8F16'
      break;
    case 'prop_P2':
      style.textShadow = '-1px -1px 0 #FD49CA, 1px -1px 0 #FD49CA, -1px  1px 0 #FD49CA, 1px  1px 0 #FD49CA'
      break;
    default:
      style.textShadow = '-1px -1px 0 #5182FF, 1px -1px 0 #5182FF, -1px  1px 0 #5182FF, 1px  1px 0 #5182FF'
  }
  return style;
}