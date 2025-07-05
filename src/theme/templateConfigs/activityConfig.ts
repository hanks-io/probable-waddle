import { ActivityNames } from '@/router/modules/activity';

export type ActivityConfig = {
  [key in keyof typeof ActivityNames]?: { template?: string }
}
//需要绑定活动的皮肤编号
export const activityConfigs: Record<string, ActivityConfig> = {
  "Layout2:PhantomBlue" : {
    [ActivityNames.AssistanceCash]: { template: 'style_1' },
    [ActivityNames.LuckyWheel]: { template: 'style_1' },
    [ActivityNames.RedPacket]: { template: 'style_1' },
    [ActivityNames.Recharge]: { template: 'style_1' },
  },
  "Layout2:NeoBlue" : { // 18号皮肤
    [ActivityNames.AssistanceCash]: { template: 'style_18' },
    [ActivityNames.LuckyWheel]: { template: 'style_1' },
    [ActivityNames.NewUserExclusive]: { template: 'style_18' },
    [ActivityNames.RedPacket]: { template: 'style_1' },
    [ActivityNames.Recharge]: { template: 'style_18' },
  },
  "Layout2:MystLightBlue" : { // 19号皮肤
    [ActivityNames.AssistanceCash]: { template: 'style_1' },
    [ActivityNames.LuckyWheel]: { template: 'style_1' },
    [ActivityNames.RedPacket]: { template: 'style_1' },
    [ActivityNames.Recharge]: { template: 'style_1' },
  },
  "Layout2:MidnightPurple" : {  // 20号皮肤
    [ActivityNames.AssistanceCash]: { template: 'style_1' },
    [ActivityNames.LuckyWheel]: { template: 'style_1' },
    [ActivityNames.RedPacket]: { template: 'style_1' },
    [ActivityNames.Recharge]: { template: 'style_1' },
  },
  "Layout2:GoldshineGreen" : {  // 21号皮肤
    [ActivityNames.AssistanceCash]: { template: 'style_18' },
    [ActivityNames.LuckyWheel]: { template: 'style_1' },
    [ActivityNames.NewUserExclusive]: { template: 'style_18' },
    [ActivityNames.RedPacket]: { template: 'style_1' },
    [ActivityNames.Recharge]: { template: 'style_1' },
  }
}
