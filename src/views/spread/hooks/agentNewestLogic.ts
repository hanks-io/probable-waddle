import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getTheme } from '@/theme/hooks'

export function useAgentNewestLogic() {
  const { locale } = useI18n();
  const className = computed(() =>
    locale.value === "zh-CN" ? "w-1/2" : "w-full"
  );
  const avatarStyle = {
    "margin-left": "1.5rem",
  };
  
  const agentBColor = computed(() => {
    const data = getTheme();
    if (['green-dark','yellow-dark','purple-light',''].includes(data.theme)) {
      return '#005dfe'
    } else {
      return 'var(--ep-color-icon-info)'
    }
  })

  const agentColor = computed(() => {
    const data = getTheme();
    if (['green-dark','yellow-dark','purple-light',''].includes(data.theme)) {
      return '#04be02'
    } else {
      return 'var(--ep-color-icon-success)'
    }
  })
  
  //  生成代理对象数据的函数
  const generateAgentObj = (
    color: string,
    agentlevel: string,
    betAmount: number,
    commission: number
  ) => ({ color, agentlevel, betAmount, commission });
  
  const agentB1 = generateAgentObj(agentBColor.value, "B1", 500, 15);
  const agentB2 = generateAgentObj(agentBColor.value, "B2", 3000, 90);
  const agentB3 = generateAgentObj(agentBColor.value, "B3", 2000, 60);
  const agentC1 = generateAgentObj(agentColor.value, "C1", 1000, 10);
  const agentC2 = generateAgentObj(agentColor.value, "C2", 2000, 20);
  const agentC3 = generateAgentObj(agentColor.value, "C3", 20000, 600);

  return {
    className,
    avatarStyle,
    agentB1,
    agentB2,
    agentB3,
    agentC1,
    agentC2,
    agentC3,
  }
}
