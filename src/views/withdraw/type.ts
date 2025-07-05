export interface TabInfo {
  name: string
  id: number

}
export interface AssetsTabInfo extends TabInfo {
  tagValue?: string
  code?: string
  icon?: string

}


export interface TabTagInfo {
  name: string,
  value: string
}
export interface CardInfo {
  name: string
  IFSC: string
  icon: string
  REALNAME: string
  BANKACCOUNT: string
  relatedCode: string
  tenantWithdrawTypeSubId: number
  
}


export interface SelectInfo {
  name: string
  code: string
  icon: string
}


const  regionCode = ['PH', "IN"] as const

export type RegionCodeType = typeof regionCode[number]
