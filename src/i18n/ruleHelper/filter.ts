import { locale } from "@/i18n";

const phoneFilter = (value: string) => {
  const phoneMap: Record<string, (val: string) => string> = {
    'en-PH': (val) => '09' + val
  }
  if (phoneMap[locale.value]) {
    return phoneMap[locale.value](value)
  }
  return value
}

export default {
  phoneFilter
}

