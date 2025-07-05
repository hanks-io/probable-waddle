export interface ActivityVariables {
  [key: string]: string | number;
}

export interface ActivityRulesMap {
  [key: string]: {
    [subKey: string]: string;
  };
}

export interface ActivityRulesMap_Recharge {
  [language: string]: {
    [category: string]: {
      [type: string]: string | { [type: string]: string }; // 允许字符串或对象
    };
  };
}

export interface ActivityRulesMap_Rebate {
  [language: string]: {
    [type: string]: string;
  };
}

export interface ActivityRulesMap_MysteryReward {
  [language: string]: {
    [category: string]: {
      [type: string]: {
        [status: string]: string; // status 可以是 NONE 或 PERIODIC
      };
    };
  };
}


export type Language = "zh-CN" | "en-US" | "pt-BR" | "id-ID" | "hi-IN" | "en-PH";
type RechargeType = "FIRST" | "SINGLE" | "SUM";
type ResetType = "NONE" | "DAILY" | "WEEKLY" | "WEEKLY_DAY" | "MONTHLY_DAY" | "PERIODIC";
type AgencyTypes = "ALL" | "NEW_REGISTER";
type RebateType = 'RECHARGE' | 'NORECHARGE';
type HighestType = 'OTHER' | 'REBATE';
type GameTypes = 'ELECTRONIC' | 'CHESS' | 'FISHING' | 'VIDEO' | 'LOTTERY' | 'ELECTRONIC';
type AcviticyType = "RedPacket" | "Agency" | "AssistanceCash" | "SignIn" | "Recharge" | "Rebate" | "LuckyWheel" | "Assistance" | "Custom" | "RechargeReward" | "MysteryReward" | "CommissionReward" | "googleDomainReward";
type AssistanceRewardType = "FIXED" | "RANGE";
type IncludeOrExclude = "EXCLUDE_GIFT" | "NORMAL";
type AwardType = "ACTIVITY" | "BALANCE";
type AwardTimeType = "IMMEDIATELY" | "DELAY";
type ExpiredAwardType = "ABANDONED" | "AUTO" | "RETAIN_DAY_AUTO" | "RETAIN_DAY_ABANDONED";
type TJoinType = "ALL" | "NEW_REGISTER";


// 公用第四条
const comTemplates_four: ActivityRulesMap = {
  "zh-CN": {
    ON: `本活动所赠送的奖金（不含本金）需{multiplier}倍有效投注才能提现，(投注仅限{limitData});\n`,
    OFF: `本活动所赠送的奖金（不含本金）需{multiplier}倍有效投注才能提现，(投注不限游戏平台);\n`
  },
  "en-US": {
    ON: `The bonus (excluding principal) of this event requires {multiplier} times of valid bets for withdrawal, (betting is limited to {limitData});\n`,
    OFF: `The bonus (excluding principal) of this event requires {multiplier} times of valid bets for withdrawal, (betting is not limited to game platform);\n`
  },
  "pt-BR": {
    ON: `O bônus (excluindo o principal) concedido por esta atividade requer {multiplier} vez o valor em apostas valida para serem retiradas, (A aposta está limitada a {limitData});\n`,
    OFF: `O bônus (excluindo o principal) concedido por esta atividade requer {multiplier} vez o valor em apostas valida para serem retiradas, (A aposta não está limitada a qualquer plataforma ou jogo);\n`
  },
  "id-ID": {
    ON: `Bonus yang diberikan dalam kegiatan ini (tidak termasuk modal) harus dipertaruhkan {multiplier} kali lipat untuk dapat ditarik，(Hanya Taruhan{limitData});\n`,
    OFF: `Bonus yang diberikan dalam kegiatan ini (tidak termasuk modal) harus dipertaruhkan {multiplier} kali lipat untuk dapat ditarik，(Taruhan tidak terbatas pada platform game);\n`
  },
  "hi-IN": {
    ON: `इस प्रमोशन द्वारा दी गई बोनस राशि (मूल राशि को छोड़कर) को निकालने के लिए {multiplier} गुना प्रभावी दांव लगाने की आवश्यकता है, (दांव केवल {limitData} तक सीमित है);\n`,
    OFF: `इस प्रमोशन द्वारा दी गई बोनस राशि (मूल राशि को छोड़कर) को निकालने के लिए {multiplier} गुना प्रभावी दांव लगाने की आवश्यकता है, (दांव किसी भी गेमिंग प्लेटफ़ॉर्म पर सीमित नहीं है);\n`
  },
  "vi-VN": {
    ON: `Tiền thưởng (không bao gồm tiền gốc) do hoạt động này cung cấp yêu cầu phải có {multiplier} lần cược hiệu quả để được rút (cược bị giới hạn ở {limitData});\n`,
    OFF: `Tiền thưởng (không bao gồm tiền gốc) được trao trong hoạt động này yêu cầu số lần đặt cược hiệu quả là {multiplier} trước khi có thể rút tiền (việc đặt cược không giới hạn ở các nền tảng trò chơi);\n`
  },
};

// 充值第3条(新)
const new_comTemplates_four_Gift: ActivityRulesMap = {
  "zh-CN": {
    Gift: "彩金（不含本金）需 {multiplier} 倍有效投注才能提现;\n",
    GiftAndRecharge: "彩金（含本金）需 {multiplier} 倍有效投注才能提现;\n"
  },
  "en-US": {
    Gift: "The bonus (excluding the principal) requires {multiplier} times of valid bets to withdraw;\n",
    GiftAndRecharge: "The bonus (including the principal) requires {multiplier} times of valid bets to withdraw;\n"
  },
  "pt-BR": {
    Gift: "O bônus (excluindo o principal) requer {multiplier} vezes de apostas válidas para sacar;\n",
    GiftAndRecharge: "O bônus (incluindo o principal) requer {multiplier} vezes de apostas válidas para sacar;\n"
  },
  "id-ID": {
    Gift: "Bonus (tidak termasuk pokok) memerlukan {multiplier} kali taruhan yang valid untuk ditarik;\n",
    GiftAndRecharge: "Bonus (termasuk pokok) memerlukan {multiplier} kali taruhan yang valid untuk ditarik;\n"
  },
  "hi-IN": {
    Gift: "बोनस (मूलधन को छोड़कर) को निकालने के लिए {multiplier} बार वैध दांव की आवश्यकता होती है।;\n",
    GiftAndRecharge: "बोनस (मूलधन सहित) को वापस लेने के लिए वैध दांव के {multiplier} गुना की आवश्यकता होती है।;\n"
  },
  "vi-VN": {
    Gift: "Tiền thưởng (không bao gồm tiền gốc) yêu cầu phải cược hợp lệ {multiplier} lần trước khi rút tiền;\n",
    GiftAndRecharge: "Tiền thưởng (bao gồm tiền gốc) yêu cầu phải cược hợp lệ {multiplier} lần trước khi rút tiền;\n"
  }
};

//公用的规则模板
const addFiveSixRules: ActivityRulesMap = {
  "zh-CN": {
    5: `仅限账号本人进行正常的人为操作，否则将取消或扣除奖励、冻结、甚至拉入黑名单;\n`,
    6: `为避免文字理解差异，平台将保留本活动最终解释权。\n`
  },
  "en-US": {
    5: `Only the account owner can perform normal manual operations, otherwise the bonus will be cancelled or deducted, frozen, or even blacklisted;\n`,
    6: `In order to avoid differences in text understanding, the platform will reserve the final right of interpretation of this activity.\n`
  },
  "pt-BR": {
    5: `Somente o proprietário da conta pode realizar operações manuais normais, caso contrário, o bônus será cancelado ou deduzido, congelado ou até mesmo colocado na lista negra;\n`,
    6: `Para evitar diferenças na compreensão do texto, a plataforma se reserva o direito final de interpretação desta atividade.\n`
  },
  "id-ID": {
    5: `Hanya pemilik akun yang dapat melakukan operasi manual normal, jika tidak, bonus akan dibatalkan atau dikurangi, dibekukan, atau bahkan masuk daftar hitam;\n`,
    6: `Untuk menghindari perbedaan pemahaman teks, platform akan memiliki hak akhir untuk menafsirkan aktivitas ini.\n`
  },
  "hi-IN": {
    5: `केवल खाता स्वामी ही सामान्य मैन्युअल संचालन कर सकता है, अन्यथा बोनस रद्द या काट लिया जाएगा, फ्रीज कर दिया जाएगा, या यहां तक ​​कि ब्लैकलिस्ट भी कर दिया जाएगा।;\n`,
    6: `पाठ समझ में अंतर से बचने के लिए, प्लेटफ़ॉर्म इस गतिविधि की व्याख्या का अंतिम अधिकार सुरक्षित रखेगा।\n`
  },
  "vi-VN": {
    5: `Chỉ chủ tài khoản mới có thể thực hiện các thao tác thủ công thông thường, nếu không phần thưởng sẽ bị hủy hoặc khấu trừ, đóng băng hoặc thậm chí bị đưa vào danh sách đen;\n`,
    6: `Để tránh sự khác biệt trong việc hiểu văn bản, nền tảng sẽ giữ quyền giải thích cuối cùng cho hoạt động này.\n`
  },
};

// 红包雨模板
const redPacketTemplatesFirstSecond: ActivityRulesMap = {
  "zh-CN": {
    1: `本活动每日定时开启{times}次,每次持续{duration}分钟,开采到的水晶石自动转换为彩金;\n`,
    2: `彩金需要手动领取，过期后彩金将作废;\n`
  },
  "en-US": {
    1: `This activity is scheduled to start {times} times a day, and each time lasts {duration} minutes. The mined crystals are automatically converted into bonuses;\n`,
    2: `Bonuses need to be collected manually, and will be invalid after expiration;\n`
  },
  "pt-BR": {
    1: `Esta atividade está programada para começar {times} vezes por dia, e cada vez dura {duration} minutos. Os cristais minerados são automaticamente convertidos em bônus;\n`,
    2: `Os bônus precisam ser coletados manualmente e serão inválidos após a expiração;\n`
  },
  "id-ID": {
    1: `Aktivitas ini dijadwalkan untuk dimulai {times} kali sehari, dan setiap kali berlangsung selama {duration} menit. Kristal yang ditambang secara otomatis diubah menjadi bonus;\n`,
    2: `Bonus perlu dikumpulkan secara manual, dan tidak akan berlaku setelah kedaluwarsa;\n`
  },
  "hi-IN": {
    1: `यह गतिविधि दिन में {times} बार शुरू होने के लिए निर्धारित है, और हर बार {duration} मिनट तक चलती है। खनन किए गए क्रिस्टल स्वचालित रूप से बोनस में परिवर्तित हो जाते हैं।;\n`,
    2: `बोनस को मैन्युअल रूप से एकत्र करने की आवश्यकता होती है, और समाप्ति के बाद अमान्य हो जाएगा।;\n`
  },
  "vi-VN": {
    1: `Hoạt động này được lên lịch bắt đầu {times} lần một ngày, mỗi lần kéo dài {duration} phút và các viên đá pha lê khai thác được sẽ tự động được chuyển đổi thành tiền thưởng;\n`,
    2: `Tiền thưởng cần phải được thu thập thủ công và sẽ không còn hiệu lực sau ngày hết hạn;\n`
  },
};

export const commissonSpecialSecond: ActivityRulesMap = {
  "zh-CN": {
    DAILY_RECEIVE_BALANCE: "返奖金额=昨日所领取的全部代理佣金，对应的奖励",
    DAILY_RECEIVE_RATE: "返奖金额=昨日所领取的全部代理佣金x佣金比例",
    WEEKLY_DAY_RECEIVE_BALANCE: "返奖金额=上周所领取的全部代理佣金，对应的奖励",
    WEEKLY_DAY_RECEIVE_RATE: "返奖金额=上周所领取的全部代理佣金x佣金比例",
    MONTHLY_DAY_RECEIVE_BALANCE: "返奖金额=上月所领取的全部代理佣金，对应的奖励",
    MONTHLY_DAY_RECEIVE_RATE: "返奖金额=上月所领取的全部代理佣金x佣金比例",

    DAILY_RECHARGE_BALANCE: "返奖金额=昨日代理直属会员累计充值，对应的奖励",
    DAILY_RECHARGE_RATE: "返奖金额=昨日代理直属会员累计充值x佣金比例",
    WEEKLY_DAY_RECHARGE_BALANCE: "返奖金额=上周代理直属会员累计充值，对应的奖励",
    WEEKLY_DAY_RECHARGE_RATE: "返奖金额=上周代理直属会员累计充值x佣金比例",
    MONTHLY_DAY_RECHARGE_BALANCE: "返奖金额=上月代理直属会员累计充值，对应的奖励",
    MONTHLY_DAY_RECHARGE_RATE: "返奖金额=上月代理直属会员累计充值x佣金比例",

    DAILY_SETTLE_BALANCE: "返奖金额=昨日所结算的全部代理佣金，对应的奖励",
    DAILY_SETTLE_RATE: "返奖金额=昨日所结算的全部代理佣金x佣金比例",
    WEEKLY_DAY_SETTLE_BALANCE: "返奖金额=上周所结算的全部代理佣金，对应的奖励",
    WEEKLY_DAY_SETTLE_RATE: "返奖金额=上周所结算的全部代理佣金x佣金比例",
    MONTHLY_DAY_SETTLE_BALANCE: "返奖金额=上月所结算的全部代理佣金，对应的奖励",
    MONTHLY_DAY_SETTLE_RATE: "返奖金额=上月所结算的全部代理佣金x佣金比例",
  },
  "en-US": {
    DAILY_RECEIVE_BALANCE: "Refund Amount = Total Commission Received by Agents Yesterday, Corresponding Rewards",
    DAILY_RECEIVE_RATE: "Refund Amount = Total Commission Received by Agents Yesterday × Commission Rate",
    WEEKLY_DAY_RECEIVE_BALANCE: "Refund Amount = Total Commission Received by Agents Last Week, Corresponding Rewards",
    WEEKLY_DAY_RECEIVE_RATE: "Refund Amount = Total Commission Received by Agents Last Week × Commission Rate",
    MONTHLY_DAY_RECEIVE_BALANCE: "Bonus amount = Total commission received by the agent last month, corresponding to the rewards",
    MONTHLY_DAY_RECEIVE_RATE: "Bonus amount = Total commission received by the agent last month × Commission rate",

    DAILY_RECHARGE_BALANCE: "Bonus amount = Cumulative recharge of direct members by the agent yesterday, corresponding to the rewards",
    DAILY_RECHARGE_RATE: "Bonus amount = Cumulative recharge of direct members by the agent yesterday × Commission rate",
    WEEKLY_DAY_RECHARGE_BALANCE: "Bonus amount = Cumulative recharge of direct members by the agent last week, corresponding to the rewards",
    WEEKLY_DAY_RECHARGE_RATE: "Bonus amount = Cumulative recharge of direct members by the agent last week × Commission rate",
    MONTHLY_DAY_RECHARGE_BALANCE: "Bonus amount = Cumulative recharge of direct members by the agent last month, corresponding to the rewards",
    MONTHLY_DAY_RECHARGE_RATE: "Bonus amount = Cumulative recharge of direct members by the agent last month × Commission rate",

    DAILY_SETTLE_BALANCE: "Bonus amount = Total commission settled yesterday by the agent, corresponding to the rewards",
    DAILY_SETTLE_RATE: "Bonus amount = Total commission settled by the agent yesterday × Commission rate",
    WEEKLY_DAY_SETTLE_BALANCE: "Reward amount = Total agent commissions settled last week, corresponding rewards",
    WEEKLY_DAY_SETTLE_RATE: "Reward amount = Total agent commissions settled last week × Commission rate",
    MONTHLY_DAY_SETTLE_BALANCE: "Reward amount = Total agent commissions settled last month, corresponding rewards",
    MONTHLY_DAY_SETTLE_RATE: "Reward amount = Total agent commissions settled last month × Commission rate",
  },
  "pt-BR": {
    DAILY_RECEIVE_BALANCE: "Valor do Reembolso = Total de Comissões Recebidas pelos Agentes Ontem, Recompensas Correspondentes",
    DAILY_RECEIVE_RATE: "Valor do Reembolso = Total de Comissões Recebidas pelos Agentes Ontem × Taxa de Comissão",
    WEEKLY_DAY_RECEIVE_BALANCE: "Valor do Reembolso = Total de Comissões Recebidas pelos Agentes na Última Semana, Recompensas Correspondentes",
    WEEKLY_DAY_RECEIVE_RATE: "Valor do Reembolso = Total de Comissões Recebidas pelos Agentes na Última Semana × Taxa de Comissão",
    MONTHLY_DAY_RECEIVE_BALANCE: "Valor do bônus = Total da comissão recebida pelo agente no mês passado, correspondente às recompensas",
    MONTHLY_DAY_RECEIVE_RATE: "Valor do bônus = Total da comissão recebida pelo agente no mês passado × Taxa de comissão",

    DAILY_RECHARGE_BALANCE: "Valor do bônus = Recarregamento acumulado dos membros diretos do agente ontem, correspondente às recompensas",
    DAILY_RECHARGE_RATE: "Valor do bônus = Recarregamento acumulado dos membros diretos do agente ontem × Taxa de comissão",
    WEEKLY_DAY_RECHARGE_BALANCE: "Valor do bônus = Recarregamento acumulado dos membros diretos do agente na semana passada, correspondente às recompensas",
    WEEKLY_DAY_RECHARGE_RATE: "Valor do bônus = Recarregamento acumulado dos membros diretos do agente na semana passada × Taxa de comissão",
    MONTHLY_DAY_RECHARGE_BALANCE: "Valor do bônus = Recarregamento acumulado dos membros diretos do agente no mês passado, correspondente às recompensas",
    MONTHLY_DAY_RECHARGE_RATE: "Valor do bônus = Recarregamento acumulado dos membros diretos do agente no mês passado × Taxa de comissão",

    DAILY_SETTLE_BALANCE: "Valor do bônus = Total da comissão liquidada pelo agente ontem, correspondente às recompensas",
    DAILY_SETTLE_RATE: "Valor do bônus = Total da comissão liquidada pelo agente ontem × Taxa de comissão",
    WEEKLY_DAY_SETTLE_BALANCE: "Valor da recompensa = Total das comissões de agentes liquidadas na semana passada, recompensas correspondentes",
    WEEKLY_DAY_SETTLE_RATE: "Valor da recompensa = Total das comissões de agentes liquidadas na semana passada × Taxa de comissão",
    MONTHLY_DAY_SETTLE_BALANCE: "Valor da recompensa = Total das comissões de agentes liquidadas no mês passado, recompensas correspondentes",
    MONTHLY_DAY_SETTLE_RATE: "Valor da recompensa = Total das comissões de agentes liquidadas no mês passado × Taxa de comissão",
  },
  "id-ID": {
    DAILY_RECEIVE_BALANCE: "Jumlah Pengembalian = Total Komisi yang Diterima oleh Agen Kemarin, Hadiah yang Sesuai",
    DAILY_RECEIVE_RATE: "Jumlah Pengembalian = Total Komisi yang Diterima oleh Agen Kemarin × Persentase Komisi",
    WEEKLY_DAY_RECEIVE_BALANCE: "Jumlah Pengembalian = Total Komisi yang Diterima oleh Agen Minggu Lalu, Hadiah yang Sesuai",
    WEEKLY_DAY_RECEIVE_RATE: "Jumlah Pengembalian = Total Komisi yang Diterima oleh Agen Minggu Lalu × Persentase Komisi",
    MONTHLY_DAY_RECEIVE_BALANCE: "Jumlah bonus = Total komisi yang diterima oleh agen bulan lalu, sesuai dengan hadiah",
    MONTHLY_DAY_RECEIVE_RATE: "Jumlah bonus = Total komisi yang diterima oleh agen bulan lalu × Persentase komisi",

    DAILY_RECHARGE_BALANCE: "Jumlah bonus = Pengisian ulang kumulatif anggota langsung agen kemarin, sesuai dengan hadiah",
    DAILY_RECHARGE_RATE: "Jumlah bonus = Pengisian ulang kumulatif anggota langsung agen kemarin × Persentase komisi",
    WEEKLY_DAY_RECHARGE_BALANCE: "Jumlah bonus = Pengisian ulang kumulatif anggota langsung agen minggu lalu, sesuai dengan hadiah",
    WEEKLY_DAY_RECHARGE_RATE: "Jumlah bonus = Pengisian ulang kumulatif anggota langsung agen minggu lalu × Persentase komisi",
    MONTHLY_DAY_RECHARGE_BALANCE: "Jumlah bonus = Pengisian ulang kumulatif anggota langsung agen bulan lalu, sesuai dengan hadiah",
    MONTHLY_DAY_RECHARGE_RATE: "Jumlah bonus = Pengisian ulang kumulatif anggota langsung agen bulan lalu × Persentase komisi",

    DAILY_SETTLE_BALANCE: "Jumlah bonus = Total komisi yang diselesaikan oleh agen kemarin, sesuai dengan hadiah",
    DAILY_SETTLE_RATE: "Jumlah bonus = Total komisi yang diselesaikan oleh agen kemarin × Persentase komisi",
    WEEKLY_DAY_SETTLE_BALANCE: "Jumlah hadiah = Total komisi agen yang diselesaikan minggu lalu, hadiah yang sesuai",
    WEEKLY_DAY_SETTLE_RATE: "Jumlah hadiah = Total komisi agen yang diselesaikan minggu lalu × Persentase komisi",
    MONTHLY_DAY_SETTLE_BALANCE: "Jumlah hadiah = Total komisi agen yang diselesaikan bulan lalu, hadiah yang sesuai",
    MONTHLY_DAY_SETTLE_RATE: "Jumlah hadiah = Total komisi agen yang diselesaikan bulan lalu × Persentase komisi",
  },
  "hi-IN": {
    DAILY_RECEIVE_BALANCE: "रिफंड राशि = कल एजेंटों द्वारा प्राप्त कुल कमीशन, संबंधित पुरस्कार।",
    DAILY_RECEIVE_RATE: "रिफंड राशि = कल एजेंटों द्वारा प्राप्त कुल कमीशन × कमीशन दर।",
    WEEKLY_DAY_RECEIVE_BALANCE: "रिफंड राशि = पिछले सप्ताह एजेंटों द्वारा प्राप्त कुल कमीशन, संबंधित पुरस्कार।",
    WEEKLY_DAY_RECEIVE_RATE: "रिफंड राशि = पिछले सप्ताह एजेंटों द्वारा प्राप्त कुल कमीशन × कमीशन दर।",
    MONTHLY_DAY_RECEIVE_BALANCE: "बोनस राशि = पिछले महीने एजेंट द्वारा प्राप्त कुल कमीशन, संबंधित पुरस्कारों के अनुसार।",
    MONTHLY_DAY_RECEIVE_RATE: "बोनस राशि = पिछले महीने एजेंट द्वारा प्राप्त कुल कमीशन × कमीशन दर।",

    DAILY_RECHARGE_BALANCE: "बोनस राशि = कल एजेंट के प्रत्यक्ष सदस्यों द्वारा किए गए कुल रिचार्ज, संबंधित पुरस्कारों के अनुसार।",
    DAILY_RECHARGE_RATE: "बोनस राशि = कल एजेंट के प्रत्यक्ष सदस्यों द्वारा किए गए कुल रिचार्ज × कमीशन दर।",
    WEEKLY_DAY_RECHARGE_BALANCE: "बोनस राशि = पिछले सप्ताह एजेंट के प्रत्यक्ष सदस्यों द्वारा किए गए कुल रिचार्ज, संबंधित पुरस्कारों के अनुसार।",
    WEEKLY_DAY_RECHARGE_RATE: "बोनस राशि = पिछले सप्ताह एजेंट के प्रत्यक्ष सदस्यों द्वारा किए गए कुल रिचार्ज × कमीशन दर।",
    MONTHLY_DAY_RECHARGE_BALANCE: "बोनस राशि = पिछले महीने एजेंट के प्रत्यक्ष सदस्यों द्वारा किए गए कुल रिचार्ज, संबंधित पुरस्कारों के अनुसार।",
    MONTHLY_DAY_RECHARGE_RATE: "बोनस राशि = पिछले महीने एजेंट के प्रत्यक्ष सदस्यों द्वारा किए गए कुल रिचार्ज × कमीशन दर।",

    DAILY_SETTLE_BALANCE: "बोनस राशि = कल एजेंट द्वारा निपटाई गई कुल कमीशन, संबंधित पुरस्कारों के अनुसार।",
    DAILY_SETTLE_RATE: "बोनस राशि = कल एजेंट द्वारा प्राप्त कुल कमीशन × कमीशन दर।",
    WEEKLY_DAY_SETTLE_BALANCE: "इनाम राशि = पिछले सप्ताह में निपटाए गए सभी एजेंट कमीशन, संबंधित इनाम।",
    WEEKLY_DAY_SETTLE_RATE: "इनाम राशि = पिछले सप्ताह में निपटाए गए सभी एजेंट कमीशन × कमीशन दर।",
    MONTHLY_DAY_SETTLE_BALANCE: "इनाम राशि = पिछले महीने निपटाए गए सभी एजेंट कमीशन, संबंधित इनाम।",
    MONTHLY_DAY_SETTLE_RATE: "इनाम राशि = पिछले महीने निपटाए गए सभी एजेंट कमीशन × कमीशन दर।",
  },
  "vi-VN": {
    DAILY_RECEIVE_BALANCE: "Số tiền thưởng = tổng số hoa hồng đại lý nhận được ngày hôm qua, tiền thưởng tương ứng",
    DAILY_RECEIVE_RATE: "Số tiền thưởng = tổng hoa hồng đại lý nhận được ngày hôm qua x tỷ lệ hoa hồng",
    WEEKLY_DAY_RECEIVE_BALANCE: "Số tiền thưởng = tổng hoa hồng đại lý nhận được tuần trước, tiền thưởng tương ứng",
    WEEKLY_DAY_RECEIVE_RATE: "Số tiền hoàn lại = tổng hoa hồng đại lý nhận được tuần trước x tỷ lệ hoa hồng",
    MONTHLY_DAY_RECEIVE_BALANCE: "Số tiền thưởng = tổng hoa hồng đại lý nhận được tháng trước, tiền thưởng tương ứng",
    MONTHLY_DAY_RECEIVE_RATE: "Số tiền hoàn lại = tổng hoa hồng đại lý nhận được tháng trước x tỷ lệ hoa hồng",

    DAILY_RECHARGE_BALANCE: "Số tiền thưởng = tổng tiền gửi tích lũy của các thành viên đại lý trực tiếp ngày hôm qua và tiền thưởng tương ứng",
    DAILY_RECHARGE_RATE: "Số tiền thưởng = tổng tiền gửi của các thành viên đại lý trực tiếp ngày hôm qua x tỷ lệ hoa hồng",
    WEEKLY_DAY_RECHARGE_BALANCE: "Số tiền thưởng = tổng tiền gửi tích lũy của các thành viên đại lý trực tiếp tuần trước và tiền thưởng tương ứng",
    WEEKLY_DAY_RECHARGE_RATE: "Số tiền thưởng = tổng tiền gửi của các thành viên trực tiếp của đại lý tuần trước x tỷ lệ hoa hồng",
    MONTHLY_DAY_RECHARGE_BALANCE: "Số tiền thưởng = tổng tiền gửi tích lũy của các thành viên trực tiếp của đại lý trong tháng trước và tiền thưởng tương ứng",
    MONTHLY_DAY_RECHARGE_RATE: "Số tiền thưởng = tổng tiền gửi của các thành viên đại lý trực tiếp trong tháng trước x tỷ lệ hoa hồng",

    DAILY_SETTLE_BALANCE: "Số tiền thưởng = tổng hoa hồng đại lý đã thanh toán ngày hôm qua, tiền thưởng tương ứng",
    DAILY_SETTLE_RATE: "Số tiền thưởng = tổng hoa hồng đại lý đã thanh toán ngày hôm qua x tỷ lệ hoa hồng",
    WEEKLY_DAY_SETTLE_BALANCE: "Số tiền thưởng = tổng hoa hồng đại lý đã thanh toán tuần trước, tiền thưởng tương ứng",
    WEEKLY_DAY_SETTLE_RATE: "Số tiền hoàn lại = tổng hoa hồng đại lý đã thanh toán tuần trước x tỷ lệ hoa hồng",
    MONTHLY_DAY_SETTLE_BALANCE: "Số tiền thưởng = tổng hoa hồng đại lý đã thanh toán tháng trước, tiền thưởng tương ứng",
    MONTHLY_DAY_SETTLE_RATE: "Số tiền hoàn lại = tổng hoa hồng đại lý đã thanh toán tháng trước x tỷ lệ hoa hồng",
  },
};


//签到规则1、2
const signInTemplates_firstSecond: ActivityRulesMap = {
  "zh-CN": {
    1: `本活动为签到活动，会员累计签到，可获得相应彩金;\n`,
    2: `彩金自动领取，过期后彩金将作废;\n`,
  },
  "en-US": {
    1: `This event is a sign-in event. Members who sign in cumulatively can get corresponding bonuses;\n`,
    2: `Bonuses are automatically collected and will be invalid after expiration;\n`,
  },
  "pt-BR": {
    1: `Este evento é um evento de entrada. Os membros que se inscreverem cumulativamente podem obter bônus correspondentes;\n`,
    2: `Os bônus são coletados automaticamente e serão inválidos após a expiração;\n`,
  },
  "id-ID": {
    1: `Acara ini adalah acara masuk. Anggota yang masuk secara kumulatif bisa mendapatkan bonus yang sesuai;\n`,
    2: `Bonus dikumpulkan secara otomatis dan tidak akan berlaku setelah kedaluwarsa;\n`,
  },
  "hi-IN": {
    1: `यह इवेंट एक साइन-इन इवेंट है। संचयी रूप से साइन इन करने वाले सदस्य संबंधित बोनस प्राप्त कर सकते हैं।;\n`,
    2: `बोनस स्वचालित रूप से एकत्र किए जाते हैं और समाप्ति के बाद अमान्य हो जाएंगे।;\n`,
  },
  "vi-VN": {
    1: `Hoạt động này là hoạt động đăng nhập. Các thành viên đăng ký tích lũy có thể nhận được phần thưởng tương ứng;\n`,
    2: `Tiền thưởng sẽ được tự động thu thập và sẽ hết hiệu lực sau ngày hết hạn;\n`,
  },
};

//佣金奖励规则1
const commissionRewardTemplates_first: ActivityRulesMap = {
  "zh-CN": {
    1: `每日代理的直属会员累计存款满足活动要求，可获得相应彩金;\n`,
  },
  "en-US": {
    1: `The direct members of the daily agent can obtain the corresponding bonus if their accumulated deposits meet the activity requirements;\n`,
  },
  "pt-BR": {
    1: `Os membros diretos do agente diário podem obter o bônus correspondente se seus depósitos acumulados atenderem aos requisitos da atividade;\n`,
  },
  "id-ID": {
    1: `Anggota langsung agen harian dapat memperoleh bonus yang sesuai jika setoran yang terkumpul memenuhi persyaratan aktivitas;\n`,
  },
  "hi-IN": {
    1: `दैनिक एजेंट के प्रत्यक्ष सदस्य संबंधित बोनस प्राप्त कर सकते हैं यदि उनकी संचित जमा राशि गतिविधि आवश्यकताओं को पूरा करती है।;\n`,
  },
  "vi-VN": {
    1: `Các thành viên trực tiếp của đại lý hàng ngày có thể nhận được tiền thưởng tương ứng nếu tiền gửi tích lũy của họ đáp ứng được yêu cầu hoạt động;\n`,
  },
};

// CPF邀请好友规则1
const cpfActivityTemplates_firstSecond: ActivityRulesMap = {
  "zh-CN": {
    1: `邀请好友进入游戏，且好友完成注册/存款/投注等，即可获得彩金;\n`,
  },
  "en-US": {
    1: `Invite friends to the game, and you will receive bonuses after they complete registration/deposit/bet;\n`,
  },
  "pt-BR": {
    1: `Convide amigos para o jogo e você receberá bônus depois que eles concluírem o registro/depósito/aposta;\n`,
  },
  "id-ID": {
    1: `Undang teman ke permainan, dan Anda akan menerima bonus setelah mereka menyelesaikan pendaftaran/deposit/taruhan;\n`,
  },
  "hi-IN": {
    1: `दोस्तों को खेल में आमंत्रित करें, और उनके पंजीकरण/जमा/दांव पूरा करने के बाद आपको बोनस प्राप्त होगा।;\n`,
  },
  "vi-VN": {
    1: `Mời bạn bè vào trò chơi và bạn sẽ nhận được tiền thưởng sau khi họ hoàn tất đăng ký/gửi tiền/đặt cược;\n`,
  },
};

//佣金奖励规则2
const commissionRewardTemplates_second: ActivityRulesMap = {
  "zh-CN": {
    RETAIN_DAY_AUTO: "彩金需要手动领取，过期后彩金将自动派发;\n",
    RETAIN_DAY_ABANDONED: "彩金需要手动领取，过期后彩金将作废;\n"
  },
  "en-US": {
    RETAIN_DAY_AUTO: "The bonus needs to be collected manually, and it will be automatically distributed after expiration;\n",
    RETAIN_DAY_ABANDONED: "The bonus needs to be collected manually, and it will be invalid after expiration;\n"
  },
  "pt-BR": {
    RETAIN_DAY_AUTO: "O bônus precisa ser coletado manualmente e será distribuído automaticamente após o vencimento;\n",
    RETAIN_DAY_ABANDONED: "O bônus precisa ser coletado manualmente e será inválido após o vencimento;\n"
  },
  "id-ID": {
    RETAIN_DAY_AUTO: "Bonus perlu dikumpulkan secara manual, dan akan didistribusikan secara otomatis setelah kedaluwarsa;\n",
    RETAIN_DAY_ABANDONED: "Bonus perlu dikumpulkan secara manual, dan akan menjadi tidak berlaku setelah kedaluwarsa;\n"
  },
  "hi-IN": {
    RETAIN_DAY_AUTO: "बोनस को मैन्युअल रूप से एकत्र करने की आवश्यकता है, और यह समाप्ति के बाद स्वचालित रूप से वितरित किया जाएगा।;\n",
    RETAIN_DAY_ABANDONED: "बोनस को मैन्युअल रूप से एकत्र करने की आवश्यकता है, और यह समाप्ति के बाद अमान्य हो जाएगा।;\n"
  },
  "vi-VN": {
    RETAIN_DAY_AUTO: "Tiền thưởng cần phải được thu thập thủ công và sẽ được tự động phân phối sau ngày hết hạn;\n",
    RETAIN_DAY_ABANDONED: "Tiền thưởng cần phải được thu thập thủ công và sẽ không còn hiệu lực sau ngày hết hạn;\n"
  },
};

//代理第一二三条 
const agencyTemplates_Threes: ActivityRulesMap = {
  "zh-CN": {
    1: `邀请好友领彩金，邀请人数越多，彩金越多;\n`,
    2: `彩金需要手动领取，过期后彩金将自动派发，可与其他代理的彩金和佣金同时享有;\n`,
    3: `彩金（不含本金）需{multiplier}倍有效投注才能提现;\n`,
  },
  "en-US": {
    1: `Invite friends to claim bonuses. The more people you invite, the more bonuses you will get;\n`,
    2: `Bonuses need to be claimed manually. After expiration, the bonuses will be automatically distributed and can be enjoyed together with bonuses and commissions from other agents;\n`,
    3: `Bonuses (excluding principal) require {multiplier} times of valid bets to be withdrawn;\n`,
  },
  "pt-BR": {
    1: `Convide amigos para reivindicar bônus. Quanto mais pessoas você convidar, mais bônus você receberá;\n`,
    2: `Os bônus precisam ser reivindicados manualmente. Após a expiração, os bônus serão distribuídos automaticamente e podem ser aproveitados junto com bônus e comissões de outros agentes;\n`,
    3: `Os bônus (excluindo o principal) exigem {multiplier} vezes de apostas válidas para serem sacados;\n`,
  },
  "id-ID": {
    1: `Undang teman untuk mengklaim bonus. Semakin banyak orang yang Anda undang, semakin banyak bonus yang akan Anda dapatkan;\n`,
    2: `Bonus perlu diklaim secara manual. Setelah kedaluwarsa, bonus akan didistribusikan secara otomatis dan dapat dinikmati bersama dengan bonus dan komisi dari agen lain;\n`,
    3: `Bonus (tidak termasuk pokok) memerlukan {multiplier} kali taruhan yang valid untuk ditarik;\n`,
  },
  "hi-IN": {
    1: `बोनस का दावा करने के लिए दोस्तों को आमंत्रित करें। आप जितने ज़्यादा लोगों को आमंत्रित करेंगे, आपको उतने ज़्यादा बोनस मिलेंगे।;\n`,
    2: `बोनस का दावा मैन्युअल रूप से किया जाना चाहिए। समाप्ति के बाद, बोनस स्वचालित रूप से वितरित किए जाएँगे और अन्य एजेंटों से बोनस और कमीशन के साथ उनका आनंद लिया जा सकता है।;\n`,
    3: `बोनस (मूलधन को छोड़कर) के लिए {multiplier} बार वैध दांव वापस लेने की आवश्यकता होती है।;\n`,
  },
  "vi-VN": {
    1: `Mời bạn bè của bạn cùng nhận tiền thưởng. Bạn mời càng nhiều người, bạn sẽ nhận được càng nhiều tiền thưởng;\n`,
    2: `Tiền thưởng cần phải được thu thập thủ công. Sau khi hết hạn, tiền thưởng sẽ được tự động phân phối và có thể được hưởng cùng với tiền thưởng và hoa hồng từ các đại lý khác;\n`,
    3: `Tiền thưởng (không bao gồm tiền gốc) yêu cầu phải cược hợp lệ {multiplier} lần trước khi rút tiền;\n`,
  },
};

//助力领现金规则1、2
const assistanceCashTemplates_firstSecond: ActivityRulesMap = {
  "zh-CN": {
    1: `每天登录有{freeDrawCount}次抽奖机会，抽奖金额累计达到{totalAmount}即可提款，邀请好友获得更多抽奖机会;\n`,
    2: `每个活动有效期为{cycleDaily}天，可多次参与，彩金自动领取，过期后彩金将作废\n`,
  },
  "en-US": {
    1: `Log in every day to get {freeDrawCount} chances to win a prize. You can withdraw the prize when the prize amount reaches {totalAmount}. Invite friends to get more chances to win a prize;\n`,
    2: `Each activity is valid for {cycleDaily} days. You can participate multiple times. The prize money will be automatically collected. After the expiration, the prize money will be invalid\n`,
  },
  "pt-BR": {
    1: `Faça login todos os dias para ter {freeDrawCount} chances de ganhar um prêmio. Você pode sacar o prêmio quando o valor do prêmio atingir {totalAmount}. Convide amigos para ter mais chances de ganhar um prêmio;\n`,
    2: `Cada atividade é válida por {cycleDaily} dias. Você pode participar várias vezes. O prêmio em dinheiro será coletado automaticamente. Após o vencimento, o prêmio em dinheiro será inválido\n`,
  },
  "id-ID": {
    1: `Login setiap hari untuk mendapatkan {freeDrawCount} peluang memenangkan hadiah. Anda dapat menarik hadiah saat jumlah hadiah mencapai {totalAmount}. Undang teman untuk mendapatkan lebih banyak peluang memenangkan hadiah;\n`,
    2: `Setiap aktivitas berlaku selama {cycleDaily} hari. Anda dapat berpartisipasi beberapa kali. Uang hadiah akan dikumpulkan secara otomatis. Setelah kedaluwarsa, uang hadiah tidak akan berlaku\n`,
  },
  "hi-IN": {
    1: `पुरस्कार जीतने के {freeDrawCount} मौके पाने के लिए हर दिन लॉग इन करें। पुरस्कार राशि {totalAmount} तक पहुँचने पर आप पुरस्कार वापस ले सकते हैं। पुरस्कार जीतने के अधिक मौके पाने के लिए दोस्तों को आमंत्रित करें।;\n`,
    2: `प्रत्येक गतिविधि {cycleDaily} दिनों के लिए वैध है। आप कई बार भाग ले सकते हैं। पुरस्कार राशि स्वचालित रूप से एकत्र की जाएगी। समाप्ति के बाद, पुरस्कार राशि अमान्य हो जाएगी।\n`,
  },
  "vi-VN": {
    1: `Bạn sẽ có {freeDrawCount} cơ hội trúng thưởng mỗi ngày sau khi đăng nhập. Bạn có thể rút giải thưởng khi số tiền thưởng tích lũy đạt đến {totalAmount}. Mời bạn bè để có thêm cơ hội trúng giải;\n`,
    2: `Mỗi hoạt động có hiệu lực trong {cycleDaily} ngày. Bạn có thể tham gia nhiều lần và tiền thưởng sẽ được tự động nhận. Sau ngày hết hạn, tiền thưởng sẽ không còn giá trị\n`,
  },
};

// 返水活动 第一条数据
const rebateTemplates_First: ActivityRulesMap_Rebate = {
  "zh-CN": {
    1: '有效投注后将按比例返还彩金，领取彩金后累计有效投注清零;\n',
  },
  "en-US": {
    1: 'After valid betting, the bonus will be returned in proportion, and the accumulated valid bets will be cleared after the bonus is received;\n',
  },
  "pt-BR": {
    1: 'Após apostas válidas, o bônus será devolvido proporcionalmente, e as apostas válidas acumuladas serão compensadas após o recebimento do bônus;\n',
  },
  "id-ID": {
    1: 'Setelah taruhan yang valid, bonus akan dikembalikan secara proporsional, dan taruhan valid yang terkumpul akan dihapus setelah bonus diterima;\n',
  },
  "hi-IN": {
    1: 'वैध सट्टेबाजी के बाद, बोनस आनुपातिक रूप से वापस कर दिया जाएगा, और बोनस प्राप्त होने के बाद संचित वैध दांव साफ़ कर दिए जाएंगे।;\n',
  },
  "vi-VN": {
    1: 'Sau khi đặt cược hợp lệ, tiền thưởng sẽ được trả lại theo tỷ lệ tương ứng và số tiền cược hợp lệ tích lũy sẽ được xóa sau khi nhận được tiền thưởng;\n',
  },
};

// 返水活动第2条规则
const rebateTemplates_Two: ActivityRulesMap = {
  "zh-CN": {
    ACTIVITY: "彩金需要手动领取，彩金（不含本金）需{multiplier}倍有效投注才能提现;\n",
    BALANCE: "彩金自动领取，彩金（不含本金）需{multiplier}倍有效投注才能提现;\n"
  },
  "en-US": {
    ACTIVITY: `The bonus needs to be manually received, and the bonus (excluding the principal) needs to be {multiplier} times valid bets before it can be withdrawn;\n`,
    BALANCE: `The bonus will be automatically received, and the bonus (excluding the principal) needs to be {multiplier} times valid bets before it can be withdrawn;\n`,
  },
  "pt-BR": {
    ACTIVITY: `O bônus precisa ser recebido manualmente, e o bônus (excluindo o principal) precisa ser {multiplier} vezes as apostas válidas antes de poder ser sacado;\n`,
    BALANCE: `O bônus será recebido automaticamente, e o bônus (excluindo o principal) precisa ser {multiplier} vezes as apostas válidas antes de poder ser sacado;\n`,
  },
  "id-ID": {
    ACTIVITY: `Bonus harus diterima secara manual, dan bonus (tidak termasuk pokok) harus {multiplier} kali taruhan yang valid sebelum dapat ditarik;\n`,
    BALANCE: `Bonus akan diterima secara otomatis, dan bonus (tidak termasuk pokok) harus {multiplier} kali taruhan yang valid sebelum dapat ditarik;\n`,
  },
  "hi-IN": {
    ACTIVITY: `बोनस को मैन्युअल रूप से प्राप्त करने की आवश्यकता है, और बोनस (मूलधन को छोड़कर) को वापस लेने से पहले वैध दांवों से {multiplier} गुना होना चाहिए।;\n`,
    BALANCE: `बोनस स्वचालित रूप से प्राप्त हो जाएगा, और बोनस (मूलधन को छोड़कर) को वापस लेने से पहले वैध दांवों से {multiplier} गुना होना चाहिए।;\n`,
  },
  "vi-VN": {
    ACTIVITY: `Tiền thưởng cần phải được thu thập thủ công và tiền thưởng (không bao gồm tiền gốc) cần có {multiplier} lần cược hợp lệ trước khi có thể rút được;\n`,
    BALANCE: `Tiền thưởng sẽ được tự động thu thập. Tiền thưởng (không bao gồm tiền gốc) cần có {multiplier} lần cược hợp lệ trước khi có thể rút được;\n`,
  },
};

//充值活动模板  规则1
const rechargeTemplates_First: ActivityRulesMap = {
  "zh-CN": {
    FIRST: "会员首次存款，可获得相应彩金;\n",
    SINGLE: "会员单笔存款，可获得相应彩金;\n",
    SUM: "会员累计存款，可获得相应彩金;\n",
  },
  // 英语
  "en-US": {
    FIRST: "Members can get corresponding bonuses for their first deposit;\n",
    SINGLE: "Members can get corresponding bonuses for a single deposit;\n",
    SUM: "Members can get corresponding bonuses for cumulative deposits;\n",
  },
  // 葡萄牙语
  "pt-BR": {
    FIRST: "Os membros podem obter bônus correspondentes para seu primeiro depósito;\n",
    SINGLE: "Os membros podem obter bônus correspondentes para um único depósito;\n",
    SUM: "Os membros podem obter bônus correspondentes para depósitos cumulativos;\n",
  },
  //印尼语
  "id-ID": {
    FIRST: "Anggota bisa mendapatkan bonus yang sesuai untuk deposit pertama mereka;\n",
    SINGLE: "Anggota bisa mendapatkan bonus yang sesuai untuk deposit tunggal;\n",
    SUM: "Anggota bisa mendapatkan bonus yang sesuai untuk deposit kumulatif;\n",
  },
  //印地语
  "hi-IN": {
    FIRST: "सदस्य अपनी पहली जमा राशि के लिए संगत बोनस प्राप्त कर सकते हैं।;\n",
    SINGLE: "सदस्य एकल जमा राशि के लिए संगत बोनस प्राप्त कर सकते हैं।;\n",
    SUM: "सदस्य संचयी जमा राशि के लिए संगत बोनस प्राप्त कर सकते हैं।;\n",
  },
  //越南语
  "vi-VN": {
    FIRST: "Thành viên có thể nhận được tiền thưởng tương ứng khi thực hiện khoản tiền gửi đầu tiên;\n",
    SINGLE: "Thành viên có thể nhận được tiền thưởng tương ứng cho một lần gửi tiền;\n",
    SUM: "Thành viên có thể nhận được tiền thưởng tương ứng bằng cách tích lũy tiền gửi;\n",
  },
};

// 幸运转盘 第一 二 三条数据
const luckyWheelTemplates_Threes: ActivityRulesMap = {
  "zh-CN": {
    1: `会员存款或投注可获得抽奖券，消耗抽奖券参与抽奖，收集道具可兑换相应彩金，每收集一套道具可兑换一次彩金;\n`,
    2: `活动期间，当日未使用的抽奖券与兑换券，次日会保留;\n`,
    3: `彩金（不含本金）需{multiplier}倍有效投注才能提现;\n`,
  },
  "en-US": {
    1: `Members can get raffle tickets by depositing or betting, and participate in the raffle by consuming raffle tickets. Collecting props can be exchanged for corresponding bonuses. Each set of props collected can be exchanged for one bonus;\n`,
    2: `During the event, raffle tickets and exchange coupons not used on the day will be retained the next day;\n`,
    3: `The bonus (excluding the principal) requires {multiplier} times of valid bets to be withdrawn;\n`,
  },
  "pt-BR": {
    1: `Os membros podem obter bilhetes de rifa depositando ou apostando, e participar do sorteio consumindo bilhetes de rifa. Os adereços coletados podem ser trocados por bônus correspondentes. Cada conjunto de adereços coletados pode ser trocado por um bônus;\n`,
    2: `Durante o evento, os bilhetes de rifa e cupons de troca não utilizados no dia serão retidos no dia seguinte;\n`,
    3: `O bônus (excluindo o principal) requer {multiplier} vezes de apostas válidas para ser sacado;\n`,
  },
  "id-ID": {
    1: `Anggota bisa mendapatkan tiket undian dengan melakukan deposit atau taruhan, dan berpartisipasi dalam undian dengan menggunakan tiket undian. Alat peraga yang terkumpul dapat ditukar dengan bonus yang sesuai. Setiap set alat peraga yang terkumpul dapat ditukar dengan satu bonus;\n`,
    2: `Selama acara berlangsung, tiket undian dan kupon penukaran yang tidak digunakan pada hari tersebut akan disimpan pada hari berikutnya;\n`,
    3: `Bonus (tidak termasuk pokok) memerlukan {multiplier} kali taruhan yang valid untuk ditarik;\n`,
  },
  "hi-IN": {
    1: `सदस्य जमा या दांव लगाकर रैफल टिकट प्राप्त कर सकते हैं, और रैफल टिकट का उपभोग करके रैफल में भाग ले सकते हैं। एकत्रित प्रॉप्स को संबंधित बोनस के लिए एक्सचेंज किया जा सकता है। एकत्रित प्रॉप्स के प्रत्येक सेट को एक बोनस के लिए एक्सचेंज किया जा सकता है।;\n`,
    2: `इवेंट के दौरान, उस दिन उपयोग नहीं किए गए रैफल टिकट और एक्सचेंज कूपन अगले दिन बनाए रखे जाएंगे।;\n`,
    3: `बोनस (मूलधन को छोड़कर) के लिए {multiplier} बार वैध दांव वापस लेने की आवश्यकता होती है।;\n`,
  },
  "vi-VN": {
    1: `Các thành viên có thể nhận được vé số bằng cách gửi tiền hoặc đặt cược và sử dụng vé số để tham gia rút thăm trúng thưởng. Đạo cụ thu thập được có thể đổi lấy phần thưởng tương ứng và mỗi bộ đạo cụ thu thập được có thể đổi lấy phần thưởng;\n`,
    2: `Trong suốt sự kiện, vé số và phiếu đổi thưởng chưa sử dụng sẽ được giữ lại vào ngày hôm sau;\n`,
    3: `Tiền thưởng (không bao gồm tiền gốc) yêu cầu phải cược hợp lệ {multiplier} lần trước khi rút tiền;\n`,
  },
};

const assistanceTemplates_first: ActivityRulesMap = {
  "zh-CN": {
    DAILY: `本活动为每日救援金活动，会员昨日亏损，可获得救援金;\n`,
    WEEKLY: `本活动为每周救援金活动，会员上周亏损，可获得救援金;\n`,
  },
  "en-US": {
    DAILY: `This event is a daily relief fund event. Members who lost money yesterday can get relief funds;\n`,
    WEEKLY: `This event is a weekly relief fund event. Members who lost money last week can get relief funds;\n`,
  },
  "pt-BR": {
    DAILY: `Este evento é um evento de fundo de alívio diário. Os membros que perderam dinheiro ontem podem obter fundos de alívio;\n`,
    WEEKLY: `Este evento é um evento de fundo de alívio semanal. Os membros que perderam dinheiro na semana passada podem obter fundos de alívio;\n`,
  },
  "id-ID": {
    DAILY: `Acara ini adalah acara dana bantuan harian. Anggota yang kehilangan uang kemarin bisa mendapatkan dana bantuan;\n`,
    WEEKLY: `Acara ini adalah acara dana bantuan mingguan. Anggota yang kehilangan uang minggu lalu bisa mendapatkan dana bantuan;\n`,
  },
  "hi-IN": {
    DAILY: `यह घटना एक दैनिक राहत निधि घटना है। कल पैसे खोने वाले सदस्य राहत निधि प्राप्त कर सकते हैं।;\n`,
    WEEKLY: `यह घटना एक साप्ताहिक राहत निधि घटना है। पिछले सप्ताह पैसे खोने वाले सदस्य राहत निधि प्राप्त कर सकते हैं।;\n`,
  },
  "vi-VN": {
    DAILY: `Hoạt động này là hoạt động gây quỹ cứu trợ hàng ngày. Các thành viên bị thiệt hại ngày hôm qua có thể nhận được tiền cứu trợ;\n`,
    WEEKLY: `Hoạt động này là hoạt động gây quỹ cứu trợ hàng tuần. Các thành viên bị thiệt hại vào tuần trước có thể nhận được tiền cứu trợ;\n`,
  },
};

const assistanceTemplates_firstSpecial: ActivityRulesMap = {
  "zh-CN": {
    CUMULATIVE_LOSS: `本活动为每日救援金活动，会员累计亏损，可获得救援金;\n`
  },
  "en-US": {
    CUMULATIVE_LOSS: `This event is a daily relief fund event. Members who have accumulated losses can get relief funds;\n`
  },
  "pt-BR": {
    CUMULATIVE_LOSS: `Este evento é um evento de fundo de alívio diário. Os membros que acumularam perdas podem obter fundos de alívio;\n`
  },
  "id-ID": {
    CUMULATIVE_LOSS: `Acara ini adalah acara dana bantuan harian. Anggota yang telah mengumpulkan kerugian bisa mendapatkan dana bantuan;\n`
  },
  "hi-IN": {
    CUMULATIVE_LOSS: `यह घटना एक दैनिक राहत निधि घटना है। जिन सदस्यों ने नुकसान जमा किया है, वे राहत निधि प्राप्त कर सकते हैं।;\n`
  },
  "vi-VN": {
    CUMULATIVE_LOSS: `Hoạt động này là hoạt động gây quỹ cứu trợ hàng ngày. Các thành viên có khoản lỗ tích lũy có thể nhận được tiền cứu trợ;\n`
  },
};

// 领取方式通用规则
const commonTemplates_awardType: ActivityRulesMap_Recharge = {
  "zh-CN": {
    ACTIVITY: {
      AUTO: '彩金需要手动领取，过期后彩金将自动派发;\n',
      ABANDONED: '彩金需要手动领取，过期后彩金将作废;\n',
      RETAIN_DAY_AUTO: '彩金需要手动领取，彩金保留{awardExpiredDays}天后自动派发;\n',
      RETAIN_DAY_ABANDONED: '彩金需要手动领取，彩金保留{awardExpiredDays}天后作废;\n',
      ACTIVITY: '彩金需要手动领取，活动期间彩金将一直保留;\n',
    },
    BALANCE: {
      AUTO: '彩金自动领取，过期后彩金将自动派发;\n',
      ABANDONED: '彩金自动领取，过期后彩金将作废;\n',
      RETAIN_DAY_AUTO: '彩金自动领取，彩金保留{awardExpiredDays}天后自动派发;\n',
      RETAIN_DAY_ABANDONED: '彩金自动领取，彩金保留{awardExpiredDays}天后作废;\n',
      BALANCE: '彩金自动领取，活动期间彩金将一直保留;\n',
    },
  },
  "en-US": {
    ACTIVITY: {
      AUTO: 'The bonus needs to be collected manually, and the bonus will be automatically distributed after expiration;\n',
      ABANDONED: 'The bonus needs to be collected manually, and the bonus will be invalid after expiration;\n',
      RETAIN_DAY_AUTO: 'The bonus needs to be collected manually, and will be automatically distributed after {awardExpiredDays} days of retention;\n',
      RETAIN_DAY_ABANDONED: 'The bonus needs to be collected manually, and will be invalid after {awardExpiredDays} days of retention;\n',
      ACTIVITY: 'The bonus needs to be claimed manually, and will be retained throughout the event;\n',
    },
    BALANCE: {
      AUTO: 'The bonus is automatically collected, and the bonus will be automatically distributed after expiration;\n',
      ABANDONED: 'The bonus is automatically collected, and the bonus will be invalid after expiration;\n',
      RETAIN_DAY_AUTO: 'The bonus is automatically claimed and will be automatically distributed after {awardExpiredDays} days of retention;\n',
      RETAIN_DAY_ABANDONED: 'The bonus is automatically claimed and will be voided after {awardExpiredDays} days of retention;\n',
      BALANCE: 'The bonus is automatically claimed, and will be retained throughout the event;\n',
    },
  },
  "pt-BR": {
    ACTIVITY: {
      AUTO: 'O bônus precisa ser coletado manualmente e será distribuído automaticamente após o vencimento;\n',
      ABANDONED: 'O bônus precisa ser coletado manualmente e será inválido após o vencimento;\n',
      RETAIN_DAY_AUTO: 'O bônus precisa ser coletado manualmente e será distribuído automaticamente após {awardExpiredDays} dias de retenção;\n',
      RETAIN_DAY_ABANDONED: 'O bônus precisa ser coletado manualmente e será invalidado após {awardExpiredDays} dias de retenção;\n',
      ACTIVITY: 'O bônus deve ser coletado manualmente e permanecerá disponível durante o evento;\n',
    },
    BALANCE: {
      AUTO: 'O bônus é coletado automaticamente e será distribuído automaticamente após o vencimento;\n',
      ABANDONED: 'O bônus é coletado automaticamente e será inválido após o vencimento;\n',
      RETAIN_DAY_AUTO: 'O bônus será coletado e distribuído automaticamente após ser retido por {awardExpiredDays} dias;\n',
      RETAIN_DAY_ABANDONED: 'O bônus será coletado automaticamente e se tornará inválido após {awardExpiredDays} dias;\n',
      BALANCE:  'O bônus é coletado automaticamente e permanecerá disponível durante o evento;\n',
    },
  },
  "id-ID": {
    ACTIVITY: {
      AUTO: 'Bonus perlu dikumpulkan secara manual, dan bonus akan didistribusikan secara otomatis setelah kedaluwarsa;\n',
      ABANDONED: 'Bonus perlu dikumpulkan secara manual, dan bonus tidak akan berlaku setelah kedaluwarsa;\n',
      RETAIN_DAY_AUTO: 'Bonus perlu dikumpulkan secara manual, dan akan didistribusikan secara otomatis setelah {awardExpiredDays} hari penyimpanan;\n',
      RETAIN_DAY_ABANDONED: 'Bonus perlu dikumpulkan secara manual, dan akan menjadi tidak berlaku setelah {awardExpiredDays} hari penyimpanan;\n',
      ACTIVITY: 'Bonus harus diklaim secara manual, dan akan tetap tersedia selama acara berlangsung;\n',
    },
    BALANCE: {
      AUTO: 'Bonus dikumpulkan secara otomatis, dan bonus akan didistribusikan secara otomatis setelah kedaluwarsa;\n',
      ABANDONED: 'Bonus dikumpulkan secara otomatis, dan bonus tidak akan berlaku setelah kedaluwarsa;\n',
      RETAIN_DAY_AUTO: 'Bonus akan secara otomatis dikumpulkan dan didistribusikan secara otomatis setelah disimpan selama {awardExpiredDays} hari;\n',
      RETAIN_DAY_ABANDONED: 'Bonus akan dikumpulkan secara otomatis dan akan menjadi tidak valid setelah {awardExpiredDays} hari;\n',
      BALANCE:  'Bonus diklaim secara otomatis, dan akan tetap tersedia selama acara berlangsung;\n',
    },
  },
  "hi-IN": {
    ACTIVITY: {
      AUTO: 'बोनस को मैन्युअल रूप से एकत्र करने की आवश्यकता है, और बोनस समाप्ति के बाद स्वचालित रूप से वितरित किया जाएगा।;\n',
      ABANDONED: 'बोनस को मैन्युअल रूप से एकत्र करने की आवश्यकता है, और बोनस समाप्ति के बाद अमान्य हो जाएगा।;\n',
      RETAIN_DAY_AUTO: 'बोनस को मैन्युअल रूप से एकत्र किया जाना चाहिए, और {awardExpiredDays} दिनों के प्रतिधारण के बाद स्वचालित रूप से वितरित किया जाएगा।;\n',
      RETAIN_DAY_ABANDONED: 'बोनस को मैन्युअल रूप से एकत्र किया जाना चाहिए, और {awardExpiredDays} दिनों के प्रतिधारण के बाद अमान्य हो जाएगा।;\n',
      ACTIVITY: 'बोनस को मैन्युअली क्लेम करना होगा, और यह इवेंट के दौरान उपलब्ध रहेगा।;\n',
    },
    BALANCE: {
      AUTO: 'बोनस स्वचालित रूप से एकत्र किया जाता है, और बोनस समाप्ति के बाद स्वचालित रूप से वितरित किया जाएगा।;\n',
      ABANDONED: 'बोनस स्वचालित रूप से एकत्र किया जाता है, और बोनस समाप्ति के बाद अमान्य हो जाएगा।;\n',
      RETAIN_DAY_AUTO: 'बोनस स्वचालित रूप से एकत्रित किया जाएगा और {awardExpiredDays} दिनों तक रखे जाने के बाद स्वचालित रूप से वितरित किया जाएगा।;\n',
      RETAIN_DAY_ABANDONED: 'बोनस स्वचालित रूप से एकत्रित किया जाएगा और {awardExpiredDays} दिनों तक रखे जाने के बाद स्वचालित रूप से वितरित किया जाएगा।;\n',
      BALANCE: 'बोनस का दावा स्वचालित रूप से किया जाता है, और यह इवेंट के दौरान उपलब्ध रहेगा।;\n',
    },
  },
  "vi-VN": {
    ACTIVITY: {
      AUTO: 'Tiền thưởng cần được yêu cầu thủ công và sẽ được tự động phân phối sau khi hết hạn;\n',
      ABANDONED: 'Tiền thưởng cần được yêu cầu thủ công và sẽ bị hủy sau khi hết hạn;\n',
      RETAIN_DAY_AUTO: 'Tiền thưởng cần được yêu cầu thủ công và sẽ được tự động phân phối sau {awardExpiredDays} ngày;\n',
      RETAIN_DAY_ABANDONED: 'Tiền thưởng cần được yêu cầu thủ công và sẽ bị hủy sau {awardExpiredDays} ngày;\n',
      ACTIVITY: 'Tiền thưởng cần được yêu cầu thủ công và sẽ được giữ lại trong suốt thời gian sự kiện;\n',
    },
    BALANCE: {
      AUTO: 'Tiền thưởng được tự động yêu cầu và sẽ được tự động phân phối sau khi hết hạn;\n',
      ABANDONED: 'Tiền thưởng được tự động yêu cầu và sẽ không còn hiệu lực sau khi hết hạn;\n',
      RETAIN_DAY_AUTO: 'Tiền thưởng được tự động yêu cầu và sẽ được tự động phân phối sau {awardExpiredDays} ngày giữ lại;\n',
      RETAIN_DAY_ABANDONED: 'Tiền thưởng được tự động yêu cầu và sẽ không còn hiệu lực sau {awardExpiredDays} ngày giữ lại;\n',
      BALANCE: 'Tiền thưởng được yêu cầu tự động và sẽ được giữ lại trong suốt thời gian sự kiện;\n',
    },
  },
};

// 会员答谢
const memberRewardTemplates_first: ActivityRulesMap = {
  "zh-CN": {
    RECHARGE: `本活动为“会员答谢”活动，会员存款，可获得相应彩金;\n`,
    PROFIT: `本活动为“会员答谢”活动，会员盈亏，可获得相应彩金;\n`,
    UNLIMITED: `本活动为“会员答谢”活动，会员可获得固定彩金;\n`,
    BET: `本活动为“会员答谢”活动，会员有效投注，可获得相应彩金;\n`,
  },
  "en-US": {
    RECHARGE: `This activity is a "member appreciation" activity. Members can get corresponding bonuses by depositing;\n`,
    PROFIT: `This activity is a "member appreciation" activity. Members can get corresponding bonuses by making profits or losses;\n`,
    UNLIMITED: `This activity is a "member appreciation" activity. Members can get fixed bonuses;\n`,
    BET: `This activity is a "member appreciation" activity. Members can get corresponding bonuses by making valid bets;\n`,
  },
  "pt-BR": {
    RECHARGE: `Esta atividade é uma atividade de "apreciação de membros". Os membros podem obter bônus correspondentes ao depositar;\n`,
    PROFIT: `Esta atividade é uma atividade de "apreciação de membros". Os membros podem obter bônus correspondentes ao obter lucros ou perdas;\n`,
    UNLIMITED: `Esta atividade é uma atividade de "apreciação de membros". Os membros podem obter bônus fixos;\n`,
    BET: `Esta atividade é uma atividade de "apreciação de membros". Os membros podem obter bônus correspondentes ao fazer apostas válidas;\n`,
  },
  "id-ID": {
    RECHARGE: `Aktivitas ini adalah aktivitas "apresiasi anggota". Anggota bisa mendapatkan bonus yang sesuai dengan melakukan deposit;\n`,
    PROFIT: `Aktivitas ini adalah aktivitas "apresiasi anggota". Anggota bisa mendapatkan bonus yang sesuai dengan melakukan keuntungan atau kerugian;\n`,
    UNLIMITED: `Aktivitas ini adalah aktivitas "apresiasi anggota". Anggota bisa mendapatkan bonus tetap;\n`,
    BET: `Aktivitas ini adalah aktivitas "apresiasi anggota". Anggota bisa mendapatkan bonus yang sesuai dengan melakukan taruhan yang valid;\n`,
  },
  "hi-IN": {
    RECHARGE: `यह गतिविधि एक "सदस्य प्रशंसा" गतिविधि है। सदस्य जमा करके संबंधित बोनस प्राप्त कर सकते हैं।;\n`,
    PROFIT: `यह गतिविधि एक "सदस्य प्रशंसा" गतिविधि है। सदस्य लाभ या हानि करके संबंधित बोनस प्राप्त कर सकते हैं।;\n`,
    UNLIMITED: `यह गतिविधि एक "सदस्य प्रशंसा" गतिविधि है। सदस्य निश्चित बोनस प्राप्त कर सकते हैं।;\n`,
    BET: `यह गतिविधि एक "सदस्य प्रशंसा" गतिविधि है। सदस्य वैध दांव लगाकर संबंधित बोनस प्राप्त कर सकते हैं।;\n`,
  },
  "vi-VN": {
    RECHARGE: `Hoạt động này là hoạt động “tri ân thành viên”. Các thành viên nạp tiền có thể nhận được tiền thưởng tương ứng;\n`,
    PROFIT: `Sự kiện này là sự kiện “tri ân thành viên”. Các thành viên có thể nhận được tiền thưởng tương ứng với lợi nhuận hoặc thua lỗ của mình;\n`,
    UNLIMITED: `Sự kiện này là sự kiện "tri ân thành viên" và thành viên có thể nhận được tiền thưởng cố định;\n`,
    BET: `Sự kiện này là sự kiện “tri ân thành viên”. Các thành viên đặt cược hợp lệ có thể nhận được tiền thưởng tương ứng;\n`,
  },
};

// 会员答谢(多日版)
const MemberRewardMultiDayTemplates_first: ActivityRulesMap = {
  "zh-CN": {
    1: `本活动为“会员答谢（多日）”活动，在会员日参与活动可获得相应彩金;\n`,
  },
  "en-US": {
    1: `This event is a “Member Appreciation (Multi-Day)” event. Join on Member Days to receive bonus rewards;\n`,
  },
  "pt-BR": {
    1: `Este é um evento de “Agradecimento aos Membros (Vários Dias)”. Participe nos Dias do Membro para receber bônus em dinheiro;\n`,
  },
  "id-ID": {
    1: `Ini adalah acara “Apresiasi Member (Beberapa Hari)”. Ikuti di Hari Member untuk mendapatkan bonus hadiah;\n`,
  },
  "hi-IN": {
    1: `यह एक "सदस्य आभार (कई दिन)" कार्यक्रम है। सदस्य दिवस पर भाग लें और बोनस पुरस्कार प्राप्त करें।;\n`,
  },
  "vi-VN": {
    1: `Đây là sự kiện “Tri ân hội viên (nhiều ngày)”. Tham gia vào Ngày Hội Viên để nhận thưởng tiền mặt;\n`,
  },
};

// 邀请好友2活动规则
const ReferralRewardsNewTemplates: ActivityRulesMap = {
  "zh-CN": {
    1: `邀请下级注册即可获得高额奖金，邀请好友越多，下级活跃度越高，每日可结算的奖金越丰厚;\n`,
    2: `奖金根据您的发展进行累计，每日00:00~04:00平台根据下级会员真实性和有效性，结算对应可领取的奖金;\n`,
    3: `本活动仅限真实有效操作，禁止租用或使用外挂、机器人、接口、协议、利用漏洞或其他技术手段，否则奖励将被取消、扣除、冻结，甚至列入黑名单。\n`,
  },
  "en-US": {
    1: `Invite referrals to register and earn generous bonuses. The more friends you invite and the more active they are, the higher your daily bonus;\n`,
    2: `Bonuses are accumulated based on your network growth. Every day between 00:00 and 04:00, the system calculates eligible bonuses based on the authenticity and activity of your referrals;\n`,
    3: `This promotion is for genuine activity only. Renting accounts, using bots, scripts, APIs, exploits, or any technical cheating methods is strictly prohibited. Violations may result in cancellation, deduction, freezing of rewards, or permanent blacklisting;\n`,
  },
  "pt-BR": {
    1: `Convide afiliados para se registrarem e ganhe grandes bônus! Quanto mais amigos você convidar e quanto mais ativos eles forem, maiores serão seus bônus diários;\n`,
    2: `Os bônus são acumulados com base no seu crescimento de rede. Todos os dias, entre 00:00 e 04:00, a plataforma calcula os bônus elegíveis com base na autenticidade e atividade dos seus indicados;\n`,
    3: `Esta promoção é válida apenas para operações reais e legítimas. É proibido alugar contas ou usar bots, scripts, APIs, falhas ou qualquer método técnico para burlar o sistema. Violações podem resultar em cancelamento, dedução, congelamento dos bônus ou inclusão na lista negra;\n`,
  },
  "id-ID": {
    1: `Undang bawahan untuk mendaftar dan dapatkan bonus besar! Semakin banyak teman yang diundang dan semakin aktif mereka, semakin besar bonus harian yang bisa kamu dapatkan;\n`,
    2: `Bonus akan diakumulasi berdasarkan perkembangan jaringan kamu. Setiap hari antara pukul 00:00 hingga 04:00, platform akan menghitung bonus yang bisa diklaim berdasarkan keaslian dan aktivitas anggota bawahan;\n`,
    3: `Promo ini hanya berlaku untuk aktivitas nyata dan sah. Dilarang menyewa akun, menggunakan bot, skrip, API, celah sistem, atau metode teknis curang lainnya. Pelanggaran dapat mengakibatkan pembatalan, pengurangan, pembekuan hadiah, bahkan masuk daftar hitam;\n`,
  },
  "hi-IN": {
    1: `अपने रेफ़रल को रजिस्टर कराएं और भारी बोनस कमाएं। जितने अधिक दोस्तों को आमंत्रित करेंगे और जितनी ज़्यादा उनकी सक्रियता होगी, प्रतिदिन मिलने वाला बोनस उतना ही बड़ा होगा।;\n`,
    2: `बोनस आपके नेटवर्क के विकास के अनुसार प्रतिदिन जोड़ा जाएगा। हर दिन रात 00:00 से 04:00 के बीच, प्लेटफ़ॉर्म आपके निमंत्रित सदस्यों की प्रामाणिकता और सक्रियता के आधार पर योग्य बोनस की गणना करेगा।;\n`,
    3: `यह ऑफ़र केवल वास्तविक और वैध गतिविधि के लिए है। किराए के खाते, बॉट्स, स्क्रिप्ट, API, प्रोटोकॉल, बग या किसी अन्य तकनीकी तरीके का उपयोग सख्त वर्जित है। उल्लंघन करने पर इनाम रद्द, कटौती, फ्रीज़ या ब्लैकलिस्ट किया जा सकता है।;\n`,
  },
  "vi-VN": {
    1: `Mời người dùng cấp dưới đăng ký để nhận thưởng hấp dẫn. Càng mời nhiều bạn bè và họ càng hoạt động tích cực, bạn nhận được càng nhiều tiền thưởng mỗi ngày;\n`,
    2: `Tiền thưởng được tích lũy dựa trên sự phát triển hệ thống của bạn. Từ 00:00 đến 04:00 mỗi ngày, hệ thống sẽ tính toán số tiền thưởng có thể nhận được dựa trên độ xác thực và hiệu quả hoạt động của cấp dưới;\n`,
    3: `Chương trình này chỉ áp dụng cho hoạt động thực tế, nghiêm cấm sử dụng tài khoản thuê, bot, phần mềm gian lận, API, giao thức tự động hoặc khai thác lỗ hổng. Hành vi gian lận sẽ bị huỷ thưởng, khấu trừ, đóng băng hoặc đưa vào danh sách đen;\n`,
  }
};

// 充值大酬宾规则
const RechargePromotionTemplates: ActivityRulesMap = {
  "zh-CN": {
    1: `活动当天，进入“大额存款奖励”版块，存入指定金额，即可获得大额彩金;`,
    2: `活动每{activityDay}开始，所有玩家每天只能参加一次，不可重复参加;`,
    3: `请注意：使用传统方法进行的存款不符合此促销资格;`,
  },
  "en-US": {
    1: `On the day of the event, enter the "Large Deposit Bonus" section and deposit the specified amount to get a large bonus;`,
    2: `The event starts every {activityDay}, and all players can only participate once a day and cannot participate repeatedly;`,
    3: `Please note: deposits made using traditional methods are not eligible for this promotion;`,
  },
  "pt-BR": {
    1: `No dia do evento, entre na seção "Bônus de depósito grande" e deposite o valor especificado para obter um bônus grande;`,
    2: `O evento começa toda {activityDay}, e todos os jogadores podem participar apenas uma vez por dia e não podem participar repetidamente;`,
    3: `Observação: depósitos feitos usando métodos tradicionais não são elegíveis para esta promoção;`,
  },
  "id-ID": {
    1: `Pada hari acara, masuk ke bagian "Bonus Deposit Besar" dan setorkan jumlah yang ditentukan untuk mendapatkan bonus besar;`,
    2: `Acara dimulai setiap {activityDay}, dan semua pemain hanya dapat berpartisipasi sekali sehari dan tidak dapat berpartisipasi berulang kali;`,
    3: `Harap diperhatikan: deposit yang dilakukan menggunakan metode tradisional tidak memenuhi syarat untuk promosi ini;`,
  },
  "hi-IN": {
    1: `इवेंट के दिन, "बड़ा डिपॉज़िट बोनस" अनुभाग में प्रवेश करें और बड़ा बोनस पाने के लिए निर्दिष्ट राशि जमा करें।;`,
    2: `इवेंट हर {activityDay} को शुरू होता है, और सभी खिलाड़ी दिन में केवल एक बार भाग ले सकते हैं और बार-बार भाग नहीं ले सकते।;`,
    3: `कृपया ध्यान दें: पारंपरिक तरीकों का उपयोग करके किए गए डिपॉज़िट इस प्रमोशन के लिए पात्र नहीं हैं।;`,
  },
  "vi-VN": {
    1: `Vào ngày diễn ra sự kiện, hãy vào mục "Phần thưởng gửi tiền lớn", gửi số tiền quy định và bạn sẽ nhận được phần thưởng lớn;`,
    2: `Sự kiện bắt đầu vào thứ {activityDay} hàng tuần. Mỗi người chơi chỉ có thể tham gia một lần mỗi ngày và không thể tham gia nhiều lần;`,
    3: `Xin lưu ý: Các khoản tiền gửi được thực hiện bằng phương pháp truyền thống không được hưởng khuyến mãi này;`,
  }
};

// 充值大酬宾活动日
const RechargePromotionActivityDayTemplates: ActivityRulesMap = {
  "zh-CN": {
    1: `星期一`,
    2: `星期二`,
    3: `星期三`,
    4: `星期四`,
    5: `星期五`,
    6: `星期六`,
    7: `星期日`,
  },
  "en-US": {
    1: `Monday`,
    2: `Tuesday`,
    3: `Wednesday`,
    4: `Thursday`,
    5: `Friday`,
    6: `Saturday`,
    7: `Sunday`,
  },
  "pt-BR": {
    1: `Segunda-feira`,
    2: `Terça-feira `,
    3: `Quarta-feira`,
    4: `Quinta-feira`,
    5: `Sexta-feira`,
    6: `Sábado`,
    7: `Domingo`,
  },
  "id-ID": {
    1: `Senin`,
    2: `Selasa`,
    3: `Rabu`,
    4: `Kamis`,
    5: `Jumat`,
    6: `Sabtu`,
    7: `Minggu`,
  },
  "hi-IN": {
    1: `सोमवार`,
    2: `मंगलवार`,
    3: `बुधवार`,
    4: `गुरुवार`,
    5: `शुक्रवार`,
    6: `शनिवार`,
    7: `रविवार`,
  },
  "vi-VN": {
    1: `Thứ Hai`,
    2: `Thứ Ba`,
    3: `Thứ Tư`,
    4: `Thứ Năm`,
    5: `Thứ Sáu`,
    6: `Thứ Bảy`,
    7: `Chủ Nhật`,
  },
};

// 神秘彩金 第一条数据
const mysteryRewardTemplates_first: ActivityRulesMap_Rebate = {
  "zh-CN": {
    1: `活动期间，会员主动报名参与活动，完成存款和有效投注，可获得相应彩金;\n`,
  },
  "en-US": {
    1: `During the event, members who actively sign up to participate in the event, complete deposits and valid bets, can receive corresponding bonuses;\n`,
  },
  "pt-BR": {
    1: `Durante o evento, os membros que se inscreverem ativamente para participar do evento, concluírem depósitos e apostas válidas, podem receber bônus correspondentes;\n`,
  },
  "id-ID": {
    1: `Selama acara berlangsung, anggota yang secara aktif mendaftar untuk berpartisipasi dalam acara, menyelesaikan setoran dan taruhan yang valid, dapat menerima bonus yang sesuai;\n`,
  },
  "hi-IN": {
    1: `इवेंट के दौरान, जो सदस्य इवेंट में भाग लेने के लिए सक्रिय रूप से साइन अप करते हैं, जमा राशि और वैध दांव पूरा करते हैं, वे संबंधित बोनस प्राप्त कर सकते हैं।;\n`,
  },
  "vi-VN": {
    1: `Trong suốt sự kiện, các thành viên tích cực đăng ký tham gia sự kiện, hoàn tất khoản tiền gửi và đặt cược hợp lệ có thể nhận được tiền thưởng tương ứng;\n`,
  },
};

// 神秘彩金 第二条数据
const mysteryRewardTemplates_Two: ActivityRulesMap = {
  "zh-CN": {
    NONE: '活动于报名后第31天23:59:59结束，',
    PERIODIC: '活动于报名后第31天23:59:59重置，',
  },
  "en-US": {
    NONE: 'The event will end at 23:59:59 on the 31st day after registration，',
    PERIODIC: 'The event will be reset at 23:59:59 on the 31st day after registration，',
  },
  "pt-BR": {
    NONE: 'O evento terminará às 23:59:59 no 31º dia após o registro，',
    PERIODIC: 'O evento será reiniciado às 23:59:59 no 31º dia após o registro，',
  },
  "id-ID": {
    NONE: 'Acara akan berakhir pada pukul 23:59:59 pada hari ke-31 setelah pendaftaran，',
    PERIODIC: 'Acara akan direset pada pukul 23:59:59 pada hari ke-31 setelah pendaftaran，',
  },
  "hi-IN": {
    NONE: 'इवेंट पंजीकरण के बाद 31वें दिन 23:59:59 पर समाप्त हो जाएगा，',
    PERIODIC: 'इवेंट पंजीकरण के बाद 31वें दिन 23:59:59 पर रीसेट हो जाएगा，',
  },
  "vi-VN": {
    NONE: 'Hoạt động kết thúc vào lúc 23:59:59 ngày thứ 31 sau khi đăng ký，',
    PERIODIC: 'Hoạt động sẽ được thiết lập lại vào lúc 23:59:59 ngày thứ 31 sau khi đăng ký，',
  },
};

// 新人任务第一、二条
const NewbieTaskFirstSecondTemplates: ActivityRulesMap = {
  "zh-CN": {
    1: `每个新注册的账号都可以完成以上任务，完成任务后可获得一定金额奖金，难度越高，奖励越多;`,
    2: `满足条件即可直接领取，可在{applyAppType}任意一端直接领取，过期作废（即未主动领取视为自愿放弃);`,
  },
  "en-US": {
    1: `Each newly registered account can complete the above tasks and earn a certain amount of bonus upon completion. The higher the difficulty, the greater the reward;`,
    2: `You can claim the reward directly once the conditions are met, and it can be claimed on either side of {applyAppType}. It will expire if not claimed (i.e., if not claimed proactively, it is considered voluntarily forfeited);`,
  },
  "pt-BR": {
    1: `Cada nova conta registrada pode concluir as tarefas acima, e ao completar as tarefas, o usuário receberá uma recompensa em dinheiro. Quanto maior a dificuldade, maior a recompensa;`,
    2: `Você pode resgatar diretamente assim que atender aos requisitos, e pode fazer isso em qualquer plataforma de {applyAppType}. O prêmio expira se não for resgatado (ou seja, não resgatar proativamente será considerado como desistência voluntária);`,
  },
  "id-ID": {
    1: `Setiap akun yang baru terdaftar dapat menyelesaikan tugas-tugas di atas, dan setelah menyelesaikan tugas, pengguna akan mendapatkan sejumlah bonus uang. Semakin tinggi tingkat kesulitan, semakin besar hadiahnya;`,
    2: `Anda dapat langsung mengklaim hadiah begitu memenuhi syarat, dan dapat mengklaimnya di mana saja di {applyAppType}. Hadiah akan kedaluwarsa jika tidak diklaim (yaitu, jika tidak diklaim secara proaktif, dianggap sebagai pengunduran diri sukarela);`,
  },
  "hi-IN": {
    1: `हर नया पंजीकृत खाता ऊपर दिए गए कार्यों को पूरा कर सकता है, और कार्य पूरा करने के बाद उसे एक निश्चित राशि का बोनस मिलेगा। जितनी अधिक कठिनाई होगी, पुरस्कार उतना ही अधिक होगा।;`,
    2: `आप शर्तें पूरी करते ही सीधे पुरस्कार प्राप्त कर सकते हैं, और इसे {applyAppType} के किसी भी प्लेटफॉर्म पर सीधे प्राप्त किया जा सकता है। यदि समय सीमा समाप्त हो जाती है तो पुरस्कार अमान्य हो जाएगा (यानी यदि पुरस्कार को सक्रिय रूप से प्राप्त नहीं किया जाता है, तो इसे स्वेच्छा से त्यागना माना जाएगा)।;`,
  },
  "vi-VN": {
    1: `Mỗi tài khoản mới đăng ký đều có thể hoàn thành các nhiệm vụ trên, sau khi hoàn thành sẽ nhận được một khoản tiền thưởng, nhiệm vụ càng khó, phần thưởng càng lớn;`,
    2: `Đáp ứng điều kiện là có thể nhận thưởng trực tiếp, có thể nhận ở cả thiết bị Android hoặc iOS, quá hạn sẽ bị hủy (tức là không nhận xem như tự nguyện từ bỏ);`,
  },
};

// 新人专享规则
const NewUserExclusiveTemplates: ActivityRulesMap = {
  "zh-CN": {
    1: `彩金自动领取，会员首次存款即可使用彩金;\n`,
    2: `彩金（不含本金）需{multiplier}倍有效投注才能提现;\n`,
    3: `仅限账号本人进行正常的人为操作，否则将取消或扣除奖励、冻结、甚至拉入黑名单;\n`,
    4: `为避免文字理解差异，平台将保留本活动最终解释权;\n`,
  },
  "en-US": {
    1: `The bonus is automatically collected and members can use the bonus after making their first deposit;\n`,
    2: `Bonuses (excluding principal) require {multiplier} times of valid bets to be withdrawn;\n`,
    3: `Only the account owner can perform normal manual operations, otherwise the bonus will be cancelled or deducted, frozen, or even blacklisted;\n`,
    4: `In order to avoid differences in text understanding, the platform will reserve the final right of interpretation of this activity;\n`,
  },
  "pt-BR": {
    1: `O bônus é coletado automaticamente e os membros podem usá-lo após fazer seu primeiro depósito;\n`,
    2: `Os bônus (excluindo o principal) exigem {multiplier} vezes de apostas válidas para serem sacados;\n`,
    3: `Somente o proprietário da conta pode realizar operações manuais normais, caso contrário, o bônus será cancelado ou deduzido, congelado ou até mesmo colocado na lista negra;\n`,
    4: `Para evitar diferenças na compreensão do texto, a plataforma se reserva o direito final de interpretação desta atividade;\n`,
  },
  "id-ID": {
    1: `Bonus dikumpulkan secara otomatis dan anggota dapat menggunakan bonus setelah melakukan setoran pertama;\n`,
    2: `Bonus (tidak termasuk pokok) memerlukan {multiplier} kali taruhan yang valid untuk ditarik;\n`,
    3: `Hanya pemilik akun yang dapat melakukan operasi manual normal, jika tidak, bonus akan dibatalkan atau dikurangi, dibekukan, atau bahkan masuk daftar hitam;\n`,
    4: `Untuk menghindari perbedaan pemahaman teks, platform akan memiliki hak akhir untuk menafsirkan aktivitas ini;\n`,
  },
  "hi-IN": {
    1: `बोनस स्वचालित रूप से एकत्र किया जाता है और सदस्य अपनी पहली जमा राशि जमा करने के बाद बोनस का उपयोग कर सकते हैं;\n`,
    2: `बोनस (मूलधन को छोड़कर) को वापस लेने के लिए वैध दांव के {multiplier} गुना की आवश्यकता होती है।;\n`,
    3: `केवल खाता स्वामी ही सामान्य मैन्युअल संचालन कर सकता है, अन्यथा बोनस रद्द या काट लिया जाएगा, फ्रीज कर दिया जाएगा, या यहां तक ​​कि ब्लैकलिस्ट भी कर दिया जाएगा।;\n`,
    4: `पाठ समझ में अंतर से बचने के लिए, प्लेटफ़ॉर्म इस गतिविधि की व्याख्या का अंतिम अधिकार सुरक्षित रखेगा।;\n`,
  },
  "vi-VN": {
    1: `Tiền thưởng được tự động tích lũy và thành viên có thể sử dụng tiền thưởng sau khi thực hiện khoản tiền gửi đầu tiên;\n`,
    2: `Tiền thưởng (không bao gồm tiền gốc) yêu cầu phải cược hợp lệ {multiplier} lần trước khi rút tiền;\n`,
    3: `Chỉ chủ tài khoản mới có thể thực hiện các thao tác thủ công thông thường, nếu không phần thưởng sẽ bị hủy hoặc khấu trừ, đóng băng hoặc thậm chí bị đưa vào danh sách đen;\n`,
    4: `Để tránh sự khác biệt trong việc hiểu văn bản, nền tảng sẽ giữ quyền giải thích cuối cùng cho hoạt động này;\n`,
  }
};

//幸运注单 第一条
const LuckyBetTemplates_first: ActivityRulesMap = {
  "zh-CN": {
    TAIL_NUMBER: `每日单笔注单金额大于等于{validBetAmount}，且该笔注单的后8位数字中，尾号包含规定号码，即可获得相应彩金;\n`,
    CONSECUTIVE_NUMBER: `每日单笔注单金额大于等于{validBetAmount}，且该笔注单的后8位数字中，任意位置包含规定号码，即可获得相应彩金;\n`,
    CONTAINS_ANY_POSITION: `每日单笔注单金额大于等于{validBetAmount}，且该笔注单的后8位数字中，任意位置包含规定号码，即可获得相应彩金;\n`,
  },
  "en-US": {
    TAIL_NUMBER: `The amount of a single bet per day is greater than or equal to {validBetAmount}, and the last digit of the last 8 digits of the bet contains the specified number, and the corresponding bonus can be obtained;\n`,
    CONSECUTIVE_NUMBER: `The amount of a single bet per day is greater than or equal to {validBetAmount}, and the last 8 digits of the bet contain the specified number at any position, and the corresponding bonus can be obtained;\n`,
    CONTAINS_ANY_POSITION: `The amount of a single bet per day is greater than or equal to {validBetAmount}, and the last 8 digits of the bet contain the specified number at any position, and the corresponding bonus can be obtained;\n`,
  },
  "pt-BR": {
    TAIL_NUMBER: `O valor de uma aposta única por dia é maior ou igual a {validBetAmount}, e o último dígito dos últimos 8 dígitos da aposta contém o número especificado, e o bônus correspondente pode ser obtido;\n`,
    CONSECUTIVE_NUMBER: `O valor de uma aposta única por dia é maior ou igual a {validBetAmount}, e os últimos 8 dígitos da aposta contêm o número especificado em qualquer posição, e o bônus correspondente pode ser obtido;\n`,
    CONTAINS_ANY_POSITION: `O valor de uma aposta única por dia é maior ou igual a {validBetAmount}, e os últimos 8 dígitos da aposta contêm o número especificado em qualquer posição, e o bônus correspondente pode ser obtido;\n`,
  },
  "id-ID": {
    TAIL_NUMBER: `Jumlah taruhan tunggal per hari lebih besar atau sama dengan {validBetAmount}, dan digit terakhir dari 8 digit terakhir taruhan berisi angka yang ditentukan, dan bonus yang sesuai dapat diperoleh;\n`,
    CONSECUTIVE_NUMBER: `Jumlah taruhan tunggal per hari lebih besar atau sama dengan {validBetAmount}, dan 8 digit terakhir taruhan berisi angka yang ditentukan pada posisi mana pun, dan bonus yang sesuai dapat diperoleh;\n`,
    CONTAINS_ANY_POSITION: `Jumlah taruhan tunggal per hari lebih besar atau sama dengan {validBetAmount}, dan 8 digit terakhir taruhan berisi angka yang ditentukan pada posisi mana pun, dan bonus yang sesuai dapat diperoleh;\n`,
  },
  "hi-IN": {
    TAIL_NUMBER: `प्रतिदिन एक बेट की राशि {validBetAmount} से अधिक या उसके बराबर होती है, और बेट के अंतिम 8 अंकों में से अंतिम अंक में निर्दिष्ट संख्या होती है, और संबंधित बोनस प्राप्त किया जा सकता है।;\n`,
    CONSECUTIVE_NUMBER: `प्रतिदिन एक बेट की राशि {validBetAmount} से अधिक या उसके बराबर होती है, और बेट के अंतिम 8 अंकों में किसी भी स्थिति में निर्दिष्ट संख्या होती है, और संबंधित बोनस प्राप्त किया जा सकता है।;\n`,
    CONTAINS_ANY_POSITION: `प्रतिदिन एक बेट की राशि {validBetAmount} से अधिक या उसके बराबर होती है, और बेट के अंतिम 8 अंकों में किसी भी स्थिति में निर्दिष्ट संख्या होती है, और संबंधित बोनस प्राप्त किया जा सकता है।;\n`,
  },
  "vi-VN": {
    TAIL_NUMBER: `Nếu số tiền cược đơn lẻ lớn hơn hoặc bằng {validBetAmount} mỗi ngày và 8 chữ số cuối của cược chứa số được chỉ định, bạn có thể nhận được tiền thưởng tương ứng;\n`,
    CONSECUTIVE_NUMBER: `Nếu số tiền cược đơn lẻ lớn hơn hoặc bằng {validBetAmount} mỗi ngày và bất kỳ chữ số cuối nào trong 8 chữ số của cược chứa số được chỉ định, bạn có thể nhận được tiền thưởng tương ứng;\n`,
    CONTAINS_ANY_POSITION: `Nếu số tiền cược đơn lẻ lớn hơn hoặc bằng {validBetAmount} mỗi ngày và bất kỳ chữ số cuối nào trong 8 chữ số của cược chứa số được chỉ định, bạn có thể nhận được tiền thưởng tương ứng;\n`,
  },
};

//幸运注单 第二条
const LuckyBetTemplates_second: ActivityRulesMap_Recharge = {
  "zh-CN": {
    ALL: {
      FIXED_COUNT: `所有平台投注均有效，每日领取次数固定{dayLimit}次, `,
      RECHARGE: '所有平台投注均有效，根据当日存款获得领取次数, ',
      BET: '所有平台投注均有效，根据当日投注获得领取次数, ',
    },
    SELECT: {
      FIXED_COUNT: `以下平台投注才有效：{limitLuckyBetData}, 每日领取次数固定{dayLimit}次，`,
      RECHARGE: '以下平台投注才有效：{limitLuckyBetData}, 根据当日存款获得领取次数 ',
      BET: '以下平台投注才有效：{limitLuckyBetData}, 根据当日投注获得领取次数，',
    }
  },
  "en-US": {
    ALL: {
      FIXED_COUNT: `All platform bets are valid, You can claim up to {dayLimit} times per day, `,
      RECHARGE: `All platform bets are valid, Number of claims depends on today's deposit, `,
      BET: `All platform bets are valid, Number of claims depends on today's betting, `,
    },
    SELECT: {
      FIXED_COUNT: `The following platform bets are valid: {limitLuckyBetData}, You can claim up to {dayLimit} times per day, `,
      RECHARGE: `The following platform bets are valid: {limitLuckyBetData}, Number of claims depends on today's deposit, `,
      BET: `The following platform bets are valid: {limitLuckyBetData}, Number of claims depends on today's betting, `,
    }
  },
  "pt-BR": {
    ALL: {
      FIXED_COUNT: `Todas as apostas da plataforma são válidas, Você pode resgatar até {dayLimit} vezes por dia, `,
      RECHARGE: 'Todas as apostas da plataforma são válidas, O número de resgates depende do valor depositado hoje, ',
      BET: 'Todas as apostas da plataforma são válidas, O número de resgates depende do valor apostado hoje, ',
    },
    SELECT: {
      FIXED_COUNT: `As seguintes apostas da plataforma são válidas: {limitLuckyBetData}, Você pode resgatar até {dayLimit} vezes por dia, `,
      RECHARGE: 'As seguintes apostas da plataforma são válidas: {limitLuckyBetData}, O número de resgates depende do valor depositado hoje, ',
      BET: 'As seguintes apostas da plataforma são válidas: {limitLuckyBetData}, O número de resgates depende do valor apostado hoje, ',
    }
  },
  "id-ID": {
    ALL: {
      FIXED_COUNT: `Semua taruhan platform berlaku, Kamu bisa klaim hingga {dayLimit} kali per hari, `,
      RECHARGE: 'Semua taruhan platform berlaku, Jumlah klaim tergantung pada total deposit hari ini, ',
      BET: 'Semua taruhan platform berlaku, Jumlah klaim tergantung pada total taruhan hari ini, ',
    },
    SELECT: {
      FIXED_COUNT: `Taruhan platform berikut berlaku: {limitLuckyBetData}, Kamu bisa klaim hingga {dayLimit} kali per hari, `,
      RECHARGE: 'Taruhan platform berikut berlaku: {limitLuckyBetData}, Jumlah klaim tergantung pada total deposit hari ini, ',
      BET: 'Taruhan platform berikut berlaku: {limitLuckyBetData}, Jumlah klaim tergantung pada total taruhan hari ini, ',
    }
  },
  "hi-IN": {
    ALL: {
      FIXED_COUNT: `सभी प्लेटफ़ॉर्म बेट मान्य हैं, प्रतिदिन प्राप्तियों की संख्या {dayLimit} गुना तय की जाती है, `,
      RECHARGE: 'सभी प्लेटफ़ॉर्म बेट मान्य हैं, दिन में प्राप्त जमा राशि की संख्या के अनुसार, ',
      BET: 'सभी प्लेटफ़ॉर्म बेट मान्य हैं, दिन में प्राप्त बेट की संख्या के अनुसार, ',
    },
    SELECT: {
      FIXED_COUNT: `निम्नलिखित प्लेटफ़ॉर्म बेट मान्य हैं: {limitLuckyBetData}, प्रतिदिन प्राप्तियों की संख्या {dayLimit} गुना तय की जाती है, `,
      RECHARGE: 'निम्नलिखित प्लेटफ़ॉर्म बेट मान्य हैं: {limitLuckyBetData}, दिन में प्राप्त जमा राशि की संख्या के अनुसार, ',
      BET: 'निम्नलिखित प्लेटफ़ॉर्म बेट मान्य हैं: {limitLuckyBetData}, दिन में प्राप्त बेट की संख्या के अनुसार, ',
    }
  },
  "vi-VN": {
    ALL: {
      FIXED_COUNT: `Tất cả cược trên nền tảng đều có giá trị, Bạn có thể nhận tối đa {dayLimit} lần mỗi ngày, `,
      RECHARGE: 'Tất cả cược trên nền tảng đều có giá trị, Số lượt nhận phụ thuộc vào số tiền bạn nạp hôm nay, ',
      BET: 'Tất cả cược trên nền tảng đều có giá trị, Số lượt nhận phụ thuộc vào số tiền bạn đặt cược hôm nay, ',
    },
    SELECT: {
      FIXED_COUNT: `Các nền tảng sau đây có giá trị để cá cược: {limitLuckyBetData}, Bạn có thể nhận tối đa {dayLimit} lần mỗi ngày, `,
      RECHARGE: 'Các nền tảng sau đây có giá trị để cá cược: {limitLuckyBetData}, Số lượt nhận phụ thuộc vào số tiền bạn nạp hôm nay, ',
      BET: 'Các nền tảng sau đây có giá trị để cá cược: {limitLuckyBetData}, Số lượt nhận phụ thuộc vào số tiền bạn đặt cược hôm nay, ',
    }
  },
};

//幸运注单 第二条(限制总领取次数)
const LuckyBetTemplates_second_receiveLimit: ActivityRulesMap_Rebate = {
  "zh-CN": {
    1: '活动期间最多领取{receiveLimit}次;\n',
  },
  "en-US": {
    1: 'Maximum {receiveLimit} claims during the event;\n',
  },
  "pt-BR": {
    1: 'Máximo de {receiveLimit} resgates durante o evento;\n',
  },
  "id-ID": {
    1: 'Maksimal {receiveLimit} klaim selama periode event.;\n',
  },
  "hi-IN": {
    1: 'इवेंट के दौरान अधिकतम {receiveLimit} बार दावा किया जा सकता है।;\n',
  },
  "vi-VN": {
    1: 'Tối đa {receiveLimit} lượt nhận trong suốt sự kiện;\n',
  },
};

const LuckyBetTemplates_second_receiveNoLimit: ActivityRulesMap_Rebate = {
  "zh-CN": {
    1: '活动期间不限领取次数;\n',
  },
  "en-US": {
    1: 'Unlimited claims during the event;\n',
  },
  "pt-BR": {
    1: 'Resgates ilimitados durante o evento;\n',
  },
  "id-ID": {
    1: 'Klaim tanpa batas selama periode event;\n',
  },
  "hi-IN": {
    1: 'इवेंट के दौरान असीमित बार दावा किया जा सकता है।;\n',
  },
  "vi-VN": {
    1: 'Không giới hạn lượt nhận trong sự kiện;\n',
  },
};

// 签到Volume规则1、2
const SignInVolumeTemplates_FirstSecond: ActivityRulesMap = {
  "zh-CN": {
    1: `本活动为7天连续签到活动，会员投注达到等级，即可领取相应彩金;\n`,
    2: `若签到中断，将从第一天起重新开始接收彩金;\n`,
  },
  "en-US": {
    1: `This event is a 7-day continuous sign-in event. Members who bet to a certain level can receive the corresponding bonus;\n`,
    2: `If the sign-in is interrupted, the bonus will be received again from the first day;\n`,
  },
  "pt-BR": {
    1: `Este evento é um evento de entrada contínua de 7 dias. Os membros que apostarem até um certo nível podem receber o bônus correspondente;\n`,
    2: `Se a entrada for interrompida, o bônus será recebido novamente a partir do primeiro dia;\n`,
  },
  "id-ID": {
    1: `Acara ini adalah acara masuk terus-menerus selama 7 hari. Anggota yang bertaruh pada level tertentu dapat menerima bonus yang sesuai;\n`,
    2: `Jika masuk terputus, bonus akan diterima lagi mulai hari pertama;\n`,
  },
  "hi-IN": {
    1: `यह इवेंट 7-दिन का निरंतर साइन-इन इवेंट है। जो सदस्य एक निश्चित स्तर तक दांव लगाते हैं, उन्हें संबंधित बोनस मिल सकता है।;\n`,
    2: `यदि साइन-इन बाधित होता है, तो बोनस पहले दिन से फिर से प्राप्त होगा।;\n`,
  },
  "vi-VN": {
    1: `Sự kiện này là sự kiện đăng nhập liên tục trong 7 ngày. Các thành viên đạt đến một mức cược nhất định có thể nhận được tiền thưởng tương ứng;\n`,
    2: `Nếu quá trình đăng nhập bị gián đoạn, bạn sẽ bắt đầu nhận lại tiền thưởng từ ngày đầu tiên;\n`,
  }
};

// 代理
function generateAgencyRule(language: Language, variables: ActivityVariables): string {
  const agencyTemplate = agencyTemplates_Threes[language];
  if (!agencyTemplate) {
    return "Unsupported language";
  }
  let result = ''
  result = Object.entries(agencyTemplate).map(([key, value]) => {
    return `${key}. ${value.replace("{multiplier}", `${variables.multiplier}`)}`;
  }).join("\n");

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }

  return result;
}

// 生成默认规则
export function generateDefultRules(language: Language, activityType: string, variables: ActivityVariables) {
  let result = "";
  language = getLanguageCode(language);
  //活动内容
  const noNeedTitleActivitys = ["LuckyBet", "ReferralRewardsNew"]
  let activityDetails = ""
  if (!noNeedTitleActivitys.includes(activityType)) {
    activityDetails = `${generateEventDetails(language)}\n`;
  }
  
  if (activityType === "RedPacket") {
    result += activityDetails + generateRedPacketRules(language as Language, variables);
  }
  //带条件的活动
  if (activityType === "AssistanceCash") {
    result += activityDetails + generateAssistanceCashRules(language as Language, variables);
  } else if (activityType === "Recharge") {
    result += activityDetails + generateRechargeRules(language as Language, variables);
  } else if (activityType === "Rebate") {
    result += activityDetails + generateRebateRules(language as Language, variables);
  } else if (activityType === "Agency") {
    result += activityDetails + generateAgencyRule(language as Language, variables);
  } else if (activityType === "LuckyWheel") {
    result += activityDetails + generateLuckyWheelRules(language as Language, variables);
  } else if (activityType === "Assistance") {
    result += activityDetails + generateAssistanceRules(language as Language, variables);
  } else if (activityType === "AssistanceFollow") {
    result += generateAssistanceRules(language as Language, variables);
  } else if (activityType === "MemberReward") {
    result += activityDetails + generateMemberRewardRules(language as Language, variables);
  } else if (activityType === "MemberRewardFollow") {
    result += generateMemberRewardRules(language as Language, variables);
  } else if (activityType === "MysteryReward") {
    result += activityDetails + generateMysteryRewardRules(language as Language, variables);
  } else if (activityType === 'SignIn') {
    result += generateSignInRules(language as Language, variables);
  } else if (activityType === "CommissionReward") {
    result += generateCommissionRewardRules(language as Language, variables);
  } else if (activityType === 'CPFActivity') {
    result += activityDetails + generateCPFActivityRules(language as Language, variables);
  } else if (activityType === "NewbieTask") {
    result += activityDetails + generateDefultNewTaskRules(language as Language, variables);
  } else if (activityType === "LuckyBet") {
    result += activityDetails + generateLuckyBetRules(language as Language, variables);
  } else if (activityType === "SignInVolume") {
    result += activityDetails + generateSignInVolumeRules(language as Language, variables);
  } else if (activityType === "MemberRewardMultiDay") {
    result += activityDetails + generateMemberRewardMultiDayRules(language as Language, variables);
  } else if (activityType === "RechargePromotion") {
    result += activityDetails + generateRechargePromotionRules(language as Language, variables);
  } else if (activityType === 'WalletUserActivity') {
    result += activityDetails + generateCPFActivityRules(language as Language, variables);
  } else if (activityType === "NewUserExclusive") {
    result += activityDetails + generateNewUserExclusiveRules(language as Language, variables);
  }else if (activityType === 'ReferralRewardsNew') {
    result += activityDetails + generateReferralRewardsNewRules(language as Language, variables);
  }

  return result
}


// 生成默认新人任务规则
export function generateDefultNewTaskRules(language: Language, variables: ActivityVariables) {
  let result = "";
  language = getLanguageCode(language);

  // 合并第一和第二条规则
  const firstSecondTemplate = NewbieTaskFirstSecondTemplates[language];
  result = Object.entries(firstSecondTemplate).map(([key, value]) => {
    return `${key}. ${value.replace("{applyAppType}", variables.applyAppType.toString())}`;
  }).join("\n");

  const comTemplate = comTemplates_four[language];
  if (!comTemplate) {
    return "Unsupported language";
  }

  const condition = variables.limitType;
  const fourthTemplate = comTemplate[condition];
  if (!fourthTemplate) {
    return "Unsupported condition";
  }

  // 替换模板中的变量
  let thirdTemplate = fourthTemplate.replace("{multiplier}", `${variables.multiplier}`);
  if (condition === "ON") {
    // 如果条件是ON，还需要替换{limitData}
    // ON: `本活动所赠送的奖金（不含本金）需{multiplier}倍有效投注才能提现，{投注仅限limitData};`,
    thirdTemplate = thirdTemplate.replace("{limitData}", `${variables.limitData}`);
  }
  // result += finalTemplate
  result += `\n${3}. ` + thirdTemplate;
  // 添加规则4和5
  const additionalRules = addFiveSixRules[language];
  if (additionalRules) {
    result += `\n4. ${additionalRules[5]}\n`;
    result += `5. ${additionalRules[6]}`;
  }
  return result;
}

//会员答谢活动规则 
export function generateMemberRewardRules(language: Language, variables: ActivityVariables): string {
  let result = "";

  // 规则1
  const firstTemplate = memberRewardTemplates_first[language][variables.amountType];
  result += `1. ${firstTemplate}`;

  // 规则2
  variables.awardType = 'ACTIVITY'
  const secondTemplate = generateAwardExpiredRules(language, variables.awardType as AwardType, variables.expiredAwardType as ExpiredAwardType, variables.awardExpiredDays as string);
  result += `\n2. ${secondTemplate}`;

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }
  return result;
}

//会员答谢(多日版)活动规则 
export function generateMemberRewardMultiDayRules(language: Language, variables: ActivityVariables): string {
  let result = "";

  // 规则1
  const firstTemplate = MemberRewardMultiDayTemplates_first[language];
  if (firstTemplate) {
    result += `\n1. ${firstTemplate[1]}\n`;
  }

  // 规则2
  variables.awardType = 'ACTIVITY'
  const secondTemplate = generateAwardExpiredRules(language, variables.awardType as AwardType, variables.expiredAwardType as ExpiredAwardType, variables.awardExpiredDays as string);
  if (secondTemplate) {
    result += `2. ${secondTemplate}\n`;
  }

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }
  return result;
}

// 充值大酬宾活动规则
export function generateRechargePromotionRules(language: Language, variables: ActivityVariables) {
  let result = "";
  language = getLanguageCode(language);

  // 合并规则
  const rechargePromotionTemplate = RechargePromotionTemplates[language];
  result = Object.entries(rechargePromotionTemplate).map(([key, value]) => {
    return `${key}. ${value.replace("{activityDay}", RechargePromotionActivityDayTemplates[language][variables.activityDay])}`;
  }).join("\n");

  // 规则4
  variables.rewardAuditType = variables.rewardAuditType || 'GiftAndRecharge'
  const finalTemplate = generateNewGiftRule(language, variables, 4);
  if(finalTemplate) {
    if(language === 'zh-CN') {
      result += finalTemplate.replace(/[;；]\s*$/, '。');
    } else {
      result += finalTemplate.replace(/[;；]\s*$/, '.');
    }
  }
  return result;
}

// 新人专享规则
export function generateNewUserExclusiveRules(language: Language, variables: ActivityVariables) {
  let result = "";
  language = getLanguageCode(language);

  // 合并规则
  const newUserExclusiveTemplate = NewUserExclusiveTemplates[language];
  result = Object.entries(newUserExclusiveTemplate).map(([key, value]) => {
    return `${key}. ${value.replace("{multiplier}", `${variables.multiplier}`)}`;
  }).join("\n");
  return result;
}

// 神秘彩金活动
export function generateMysteryRewardRules(language: Language, variables: ActivityVariables): string {
  let result = "";

  // 第一条规则
  const firstTemplate = mysteryRewardTemplates_first[language][1];
  if (firstTemplate) {
    result += `1. ${firstTemplate}\n`;
  }

  // 第二条规则
  const resetType: string = variables.resetType as string;
  const secondTemplate = mysteryRewardTemplates_Two[language][resetType];
  const awardExpiredTemplate = generateAwardExpiredRules(language, variables.awardType as AwardType, variables.expiredAwardType as ExpiredAwardType, variables.awardExpiredDays as string);
  if (secondTemplate || awardExpiredTemplate) {
    result += `2. `;
    if (secondTemplate) {
      result += `${secondTemplate}`;
    }

    if (awardExpiredTemplate) {
      result += `${awardExpiredTemplate}`;
    }
  }

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }

  console.log('神秘彩金活动', result)
  return result;
}

// 签到活动
export function generateSignInRules(language: Language, variables: ActivityVariables): string {
  let result = "";

  // 规则1、2 
  const firstSecondTemplate = signInTemplates_firstSecond[language];
  if (!firstSecondTemplate) {
    return "Unsupported language";
  }
  Object.entries(firstSecondTemplate).forEach(([key, value]) => {
    result += `\n${key}. ${value}`;
  });

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }
  return result;
}

// 佣金奖励活动
export function generateCommissionRewardRules(language: Language, variables: ActivityVariables): string {
  let result = "";

  // 规则1
  const firstCommissonTemplate = commissionRewardTemplates_first[language];
  if (!firstCommissonTemplate) {
    return "Unsupported language";
  }
  result += `\n1. ${firstCommissonTemplate[1]}`;

  // 规则2
  const secondCommissonTemplate = commissionRewardTemplates_second[language][variables.expiredAwardType];
  result += `\n2. ${secondCommissonTemplate}`;

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }
  return result;
}

// CPF邀请好友活动
export function generateCPFActivityRules(language: Language, variables: ActivityVariables): string {
  let result = "";

  // 第一条规则
  const firstTemplate = cpfActivityTemplates_firstSecond[language][1];
  if (firstTemplate) {
    result += `1. ${firstTemplate}\n`;
  }

  // 规则2
  variables.awardType = 'ACTIVITY'
  variables.expiredAwardType  = variables.expiredAwardType || 'ABANDONED'
  const secondTemplate = generateAwardExpiredRules(language, variables.awardType as AwardType, variables.expiredAwardType as ExpiredAwardType, variables.awardExpiredDays as string);
  if (secondTemplate) {
    result += `2. ${secondTemplate}\n`;
  }

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }
  return result;
}

// 邀请好友2活动
export function generateReferralRewardsNewRules(language: Language, variables: ActivityVariables) {
  let result = "";
  language = getLanguageCode(language);

  // 合并规则
  const referralRewardsNewTemplate = ReferralRewardsNewTemplates[language];
  result = Object.entries(referralRewardsNewTemplate).map(([key, value]) => {
    return `${key}. ${value}`;
  }).join("\n");
  return result;
}

// 助力领现金活动规则
export function generateAssistanceCashRules(language: Language, variables: ActivityVariables) {
  // 合并第一二三条规则
  const firstSecondTemplate = assistanceCashTemplates_firstSecond[language];
  if (!firstSecondTemplate) {
    return "Unsupported language";
  }

  let result = Object.entries(firstSecondTemplate).map(([key, value]) => {
    return `${key}. ${value
      .replace("{freeDrawCount}", variables.freeDrawCount.toString())
      .replace("{totalAmount}", variables.totalAmount.toString())
      .replace("{cycleDaily}", variables.cycleDaily.toString())
      }`;
  }).join("\n");

  // 助力领现金第3条数据
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }

  return result;
}

// 充值活动
export function generateRechargeRules(language: Language, variables: ActivityVariables): string {
  // 首先，根据语言和充值类型选择正确的模板
  const template = rechargeTemplates_First[language][variables.rechargeType];
  if (!template) {
    return "Unsupported recharge type or reset type";
  }

  // 充值活动第1条数据
  let result = `1. ${template}\n`;

  // 规则2
  const secondTemplate = generateAwardExpiredRules(language, variables.awardType as AwardType, variables.expiredAwardType as ExpiredAwardType, variables.awardExpiredDays as string);
  if (secondTemplate) {
    result += `2. ${secondTemplate}\n`;
  }

  // 充值活动第3条数据
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4和5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }

  return result;
}


// 红包雨活动规则
export function generateRedPacketRules(language: Language, variables: ActivityVariables): string {
  const firstSecondTemplate = redPacketTemplatesFirstSecond[language];
  if (!firstSecondTemplate) {
    return "Unsupported language";
  }

  let result = Object.entries(firstSecondTemplate).map(([key, value]) => {
    return `${key}. ${value
      .replace("{times}", variables.times.toString())
      .replace("{duration}", variables.duration.toString())
      }`;
  }).join("\n");

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则5和6
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }

  return result;
}


function generateFourthRule(language: Language, variables: ActivityVariables, ruleNumber: number, type?: String): string {
  const comTemplate = comTemplates_four[language];
  if (!comTemplate) {
    return "Unsupported language";
  }

  const condition = variables.limitType;
  const fourthTemplate = comTemplate[condition];
  if (!fourthTemplate) {
    return "Unsupported condition";
  }

  // 替换模板中的变量
  let finalTemplate = fourthTemplate.replace("{multiplier}", `${variables.multiplier}`);
  if (condition === "ON") {
    // 如果条件是ON，还需要替换{limitData}
    // ON: `本活动所赠送的奖金（不含本金）需{multiplier}倍有效投注才能提现，{投注仅限limitData};`,
    finalTemplate = finalTemplate.replace("{limitData}", `${variables.limitData}`);
  }

  const ruleNumberValue = `\n${ruleNumber}. `;
  if (type == 'MemberRewardFollow') {
    const ruleNumberFollowValue = `\n `;
    return ruleNumberFollowValue + finalTemplate;
  }
  return ruleNumberValue + finalTemplate;
}


function generateNewGiftRule(language: Language, variables: ActivityVariables, ruleNumber: number): string {
  const comTemplateGift = new_comTemplates_four_Gift[language];
  if (!comTemplateGift) {
    return "Unsupported language";
  }

  // 根据奖金类型选择模板
  const auditType = variables.rewardAuditType; // 假设 variables 中包含奖金类型（Gift 或 GiftAndRecharge）
  const giftTemplate = comTemplateGift[auditType];
  if (!giftTemplate) {
    return "Unsupported bonus type";
  }

  // 替换模板中的变量
  let finalTemplate = giftTemplate.replace("{multiplier}", `${variables.multiplier}`);

  const ruleNumberValue = `\n${ruleNumber}. `;
  return ruleNumberValue + finalTemplate;
}

// 返水活动
export function generateRebateRules(language: Language, variables: ActivityVariables): string {
  // 选择返水活动的第一条数据模板
  const firstTemplate = rebateTemplates_First[language][1];
  if (!firstTemplate) {
    return "Unsupported language";
  }
  let result = "1. " + firstTemplate

  // 根据奖金类型选择模板
  const giftTemplate = rebateTemplates_Two[language]['BALANCE'];
  if (!giftTemplate) {
    return "Unsupported bonus type";
  }

  // 替换模板中的变量
  let secondTemplate = giftTemplate.replace("{multiplier}", `${variables.multiplier}`);
  result += `\n2. ${secondTemplate}`;

  // 添加规则3和4
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n3. ${rulesFiveSix[5]}\n4. ${rulesFiveSix[6]}`;
  }

  return result
}

// 幸运转盘
export function generateLuckyWheelRules(language: Language, variables: ActivityVariables): string {
  // 合并第一二三条规则
  const luckyWheelTemplate = luckyWheelTemplates_Threes[language];
  if (!luckyWheelTemplate) {
    return "Unsupported language";
  }

  let result = Object.entries(luckyWheelTemplate).map(([key, value]) => {
    return `${key}. ${value.replace("{multiplier}", `${variables.multiplier}`)}`;
  }).join("\n");

  // 添加规则3和4
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }

  return result
}

// 领取通用规则
function generateAwardExpiredRules(language: Language, awardType: AwardType, expiredAwardType: ExpiredAwardType, awardExpiredDays: string): string {

  const awardExpiredTemplate = commonTemplates_awardType[language][awardType][expiredAwardType];

  if (expiredAwardType === 'RETAIN_DAY_AUTO' || expiredAwardType === 'RETAIN_DAY_ABANDONED') {
    if(awardExpiredDays === 0 || !awardExpiredDays) {
      return commonTemplates_awardType[language][awardType][awardType];
    }
    return awardExpiredTemplate.replace('{awardExpiredDays}', awardExpiredDays);
  }

  return awardExpiredTemplate;
}

// 救援金活动规则
export function generateAssistanceRules(language: Language, variables: ActivityVariables): string {
  let result = ''

  if (variables.includeOrExclude === "CUMULATIVE_LOSS") {
    // 累计亏损 规则1
    const specialTemplate = assistanceTemplates_firstSpecial[language];
    if (!specialTemplate) {
      return "Unsupported language";
    }

    const specialRewardTemplate = specialTemplate.CUMULATIVE_LOSS;
    result = "1. " + specialRewardTemplate  + "\n";;
  } else {
    // 非累计亏损 规则1
    const firstTemplate = assistanceTemplates_first[language];
    if (!firstTemplate) {
      return "Unsupported language";
    }

    // 根据 resetType选择模板
    const resetTypeTemplate = firstTemplate[variables.resetType as keyof typeof firstTemplate];
    if (!resetTypeTemplate) {
      return "Unsupported reset type";
    }
    result = "1. " + resetTypeTemplate  + "\n";;
  }

  // 规则2
  const secondTemplate = generateAwardExpiredRules(language, variables.awardType as AwardType, variables.expiredAwardType as ExpiredAwardType, variables.awardExpiredDays as string);
  if (secondTemplate) {
    result += `2. ${secondTemplate}`;
  }

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4、5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n4. ${rulesFiveSix[5]}\n5. ${rulesFiveSix[6]}`;
  }

  return result;
}

// 生成幸运注单默认规则
export function generateLuckyBetRules(language: Language, variables: ActivityVariables) {

  const firstTemplate = LuckyBetTemplates_first[language];
  if (!firstTemplate) {
    return "Unsupported language";
  }

  // 根据 resetType 和 rewardType 选择模板
  const winTypeTemplate = firstTemplate[variables.winType as keyof typeof firstTemplate];
  if (!winTypeTemplate) {
    return "Unsupported reset type";
  }

  let result = "1. " + winTypeTemplate.replace("{validBetAmount}", `${formatAmount(Number(variables.validBetAmount), language)}`) + "\n";

  // 第二条规则
  let secondTemplateStr
  const secondTemplate = LuckyBetTemplates_second[language][variables.limitLuckyBetType][variables.receiveCountType];
  if(!variables.receiveLimit || variables.receiveLimit === 0){
    secondTemplateStr = secondTemplate + LuckyBetTemplates_second_receiveNoLimit[language][1]
  }else{
    secondTemplateStr = secondTemplate + LuckyBetTemplates_second_receiveLimit[language][1]
  }
  if (secondTemplateStr) {
    result += `2. ${secondTemplateStr.replace(/{(\w+)}/g, (_, key) => variables[key]?.toString() ?? '')}`;
  }

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加4、5规则（使用公共模板）
  const additionalRules = addFiveSixRules[language];
  if (additionalRules) {
    result += `\n4. ${additionalRules[5]}\n`;
    result += `5. ${additionalRules[6]}`;
  }
  return result.trim();
}

// 签到奖励活动
export function generateSignInVolumeRules(language: Language, variables: ActivityVariables) {
  let result = "";

  // 规则1、2
  const firstSecondTemplates = SignInVolumeTemplates_FirstSecond[language];
  if (!firstSecondTemplates) {
    return "Unsupported language";
  }
  Object.entries(firstSecondTemplates).forEach(([key, value]) => {
    result += `\n${key}. ${value}`;
  });

  // 规则3
  variables.rewardAuditType = 'Gift'
  result += generateNewGiftRule(language, variables, 3);

  // 添加规则4、5
  const rulesFiveSix = addFiveSixRules[language];
  if (rulesFiveSix) {
    result += `\n5. ${rulesFiveSix[5]}\n6. ${rulesFiveSix[6]}`;
  }

  return result;
}

// 活动内容
export function generateEventDetails(language: Language): string {
  const eventDetails = {
    "zh-CN": "活动内容: ",
    "en-US": "Event Details: ",
    "pt-BR": "Detalhes do Evento: ",
    "id-ID": "Detail Acara: ",
    "hi-IN": "गतिविधि सामग्री: ",
    "vi-VN": "Nội dung hoạt động: ",
  };
  return eventDetails[language];
}


const previewText_First: ActivityRulesMap = {
  "zh-CN": {
    OTHER: "最高奖励{maximum}",
    REBATE: "最高返水比例{maximum}%",
    OTHER_RANGE: "最高奖励{maximum}%",
  },
  "en-US": {
    OTHER: "Maximum bonus {maximum}",
    REBATE: "Maximum rebate rate {maximum}%",
    OTHER_RANGE: "Maximum bonus {maximum}%",
  },
  "pt-BR": {
    OTHER: "Bônus máximo {maximum}",
    REBATE: "Taxa máxima de cashback {maximum}%",
    OTHER_RANGE: "Bônus máximo {maximum}%",
  },
  "id-ID": {
    OTHER: "Hadiah Tertinggi {maximum}",
    REBATE: "Persentase Pengembalian Uang Tertinggi {maximum}%",
    OTHER_RANGE: "Hadiah Tertinggi {maximum}%",
  },
  "hi-IN": {
    OTHER: "अधिकतम बोनस {maximum}",
    REBATE: "अधिकतम रिबेट दर {maximum}%",
  },
  "vi-VN": {
    OTHER: "Tiền thưởng tối đa{maximum}",
    REBATE: "Tỷ lệ hoàn tiền tối đa {maximum}%",
    OTHER_RANGE: "Tiền thưởng tối đa {maximum}%",
  }
};

const previewText_Second: ActivityRulesMap = {
  "zh-CN": {
    NONE: "不重置",
    DAILY: "每日重置",
    WEEKLY: "每周重置",
    WEEKLY_DAY: "每周重置",
    MONTHLY_DAY: "每月重置",
    PERIODIC: "跟随活动",
  },
  "en-US": {
    NONE: "No reset",
    DAILY: "Reset daily",
    WEEKLY: "Reset weekly",
    WEEKLY_DAY: "Reset weekly",
    MONTHLY_DAY: "Reset monthly",
    PERIODIC: "Following activity",
  },
  "pt-BR": {
    NONE: "Sem reinício",
    DAILY: "Reinício diário",
    WEEKLY: "Reinício semanal",
    WEEKLY_DAY: "Reinício semanal",
    MONTHLY_DAY: "Reinício mensal",
    PERIODIC: "Atividade seguinte",
  },
  "id-ID": {
    NONE: "Tidak Mereset",
    DAILY: "Reset Harian",
    WEEKLY: "Reset Mingguan",
    WEEKLY_DAY: "Reset Mingguan",
    MONTHLY_DAY: "Reset Bulanan",
    PERIODIC: "Kegiatan lanjutan",
  },
  "hi-IN": {
    NONE: "रीसेट नहीं",
    DAILY: "दैनिक रीसेट",
    WEEKLY: "साप्ताहिक रीसेट",
    WEEKLY_DAY: "साप्ताहिक रीसेट",
    MONTHLY_DAY: "हर महीने रीसेट",
    PERIODIC: "अनुवर्ती गतिविधि",
  },
  "vi-VN": {
    NONE: "Không thiết lập lại",
    DAILY: "Đặt lại hàng ngày",
    WEEKLY: "Thiết lập lại hàng tuần",
    WEEKLY_DAY: "Thiết lập lại hàng tuần",
    MONTHLY_DAY: "Đặt lại hàng tháng",
    PERIODIC: "Theo dõi sự kiện",
  }
};

const previewText_Second_mysteryReward: ActivityRulesMap = {
  "zh-CN": {
    NONE: "一次性",
    PERIODIC: "循环",
  },
  "en-US": {
    NONE: "Disposable",
    PERIODIC: "Cycle",
  },
  "pt-BR": {
    NONE: "Descartável",
    PERIODIC: "Ciclo",
  },
  "id-ID": {
    NONE: "Disposable",
    PERIODIC: "Siklus",
  },
  "hi-IN": {
    NONE: "डिस्पोजेबल",
    PERIODIC: "चक्र",
  },
  "vi-VN": {
    NONE: "dùng một lần",
    PERIODIC: "chu trình",
  }
};

const previewText_Third: ActivityRulesMap = {
  "zh-CN": {
    ABANDONED: "过期作废",
    AUTO: "过期自动发放",
    RESERVE: "跨天，跨周，跨月时，未领取奖励邮件下发",
    ABOLISHMENT: "跨天，跨周，跨月时，未领取奖励系统回收作废",
    RETAIN_DAY_AUTO: "奖励保留天数自动发放",
    RETAIN_DAY_ABANDONED: "奖励保留天数作废",
  },
  "en-US": {
    ABANDONED: "Void if not claimed",
    AUTO: "Auto-payout upon expiration",
    RESERVE: "Unclaimed rewards will be sent via email when crossing day, week, or month boundaries",
    ABOLISHMENT: "Unclaimed rewards will be voided by the system when crossing day, week, or month boundaries",
    RETAIN_DAY_AUTO: "Auto-payout after reward retention period",
    RETAIN_DAY_ABANDONED: "Void after reward retention period",
  },
  "pt-BR": {
    ABANDONED: "Nulo se não reclamado",
    AUTO: "Pagamento automático ao expirar",
    RESERVE: "Recompensas não reclamadas serão enviadas por e-mail ao cruzar limites de dia, semana ou mês",
    ABOLISHMENT: "Recompensas não reclamadas serão anuladas pelo sistema ao cruzar limites de dia, semana ou mês",
    RETAIN_DAY_AUTO: "Pagamento automático após o período de retenção da recompensa",
    RETAIN_DAY_ABANDONED: "Nulo após o período de retenção da recompensa",
  },
  "id-ID": {
    ABANDONED: "Kadaluarsa dan Dinyatakan Tidak Berlaku",
    AUTO: "Otomatis Dikeluarkan saat Kadaluarsa",
    RESERVE: "Hadiah yang belum diklaim akan dikirim melalui email saat melewati batas hari, minggu, atau bulan",
    ABOLISHMENT: "Hadiah yang belum diklaim akan dibatalkan oleh sistem saat melewati batas hari, minggu, atau bulan",
    RETAIN_DAY_AUTO: "Pembayaran otomatis setelah masa penyimpanan hadiah",
    RETAIN_DAY_ABANDONED: "Tidak berlaku setelah masa penyimpanan hadiah",
  },
  "hi-IN": {
    ABANDONED: "यदि दावा नहीं किया गया तो अमान्य",
    AUTO: "Đã hết hạn và không hợp lệ",
    RESERVE: "दिन, सप्ताह, या महीने की सीमाएं पार करने पर दावा न किए गए पुरस्कार ईमेल के माध्यम से भेजे जाएंगे",
    ABOLISHMENT: "दिन, सप्ताह, या महीने की सीमाएं पार करने पर दावा न किए गए पुरस्कार सिस्टम द्वारा रद्द कर दिए जाएंगे",
    RETAIN_DAY_AUTO: "पुरस्कार प्रतिधारण अवधि के बाद स्वचालित भुगतान",
    RETAIN_DAY_ABANDONED: "पुरस्कार प्रतिधारण अवधि के बाद अमान्य",
  },
  "vi-VN": {
    ABANDONED: "Đã hết hạn và không hợp lệ",
    AUTO: "Tự động phát hành khi hết hạn",
    RESERVE: "Tiền thưởng chưa nhận sẽ được gửi qua email khi quá ngày, tuần hoặc tháng",
    ABOLISHMENT: "Tiền thưởng chưa nhận sẽ được hệ thống tái chế và vô hiệu hóa khi quá ngày, tuần hoặc tháng",
    RETAIN_DAY_AUTO: "Tiền thưởng sẽ được tự động phát hành sau số ngày được giữ lại",
    RETAIN_DAY_ABANDONED: "Tiền thưởng sẽ không hợp lệ sau số ngày được giữ lại",
  }
};

// 定义充值活动名字
export function getRechargeActivityName(language: Language, resetType: ResetType, rechargeType: RechargeType): string {
  const names = {
    "zh-CN": {
      NONE: {
        FIRST: "首充额外奖励",
        SINGLE: "单笔充值加赠",
        SUM: "累计充值加赠",
      },
      DAILY: {
        FIRST: "每日首充加赠",
        SINGLE: "每日单笔充值加赠",
        SUM: "每日累计充值加赠",
      },
      WEEKLY: {
        FIRST: "每周首充加赠",
        SINGLE: "每周单笔充值加赠",
        SUM: "每周累计充值加赠",
      },
    },
    "en-US": {
      NONE: {
        FIRST: "First Deposit Extra Reward",
        SINGLE: "Additional bonus for every recharge",
        SUM: "Cumulative recharge additional reward",
      },
      DAILY: {
        FIRST: "Daily First Deposit Extra Reward",
        SINGLE: "Daily Additional bonus for every recharge",
        SUM: "Daily Cumulative recharge additional reward",
      },
      WEEKLY: {
        FIRST: "Weekly First Deposit Extra Reward",
        SINGLE: "Weekly Additional bonus for every recharge",
        SUM: "Weekly Cumulative recharge additional reward",
      },
    },
    "pt-BR": {
      NONE: {
        FIRST: "Recompensa Extra para Primeiro Depósito",
        SINGLE: "Bônus adicional para cada recarga",
        SUM: "Recompensa adicional de recarga acumulativa",
      },
      DAILY: {
        FIRST: "Recompensa Extra de Primeiro Depósito Diário",
        SINGLE: "Bônus adicional diário para cada recarga",
        SUM: "Recompensa adicional diária por recarga acumulada",
      },
      WEEKLY: {
        FIRST: "Recompensa Extra de Primeiro Depósito Semanal",
        SINGLE: "Bônus adicional semanal para cada recarga",
        SUM: "Bônus Semanal de Recarga Cumulativa",
      },
    },
    "id-ID": {
      NONE: {
        FIRST: "Bonus tambahan untuk isi ulang pertama",
        SINGLE: "Bonus tambahan untuk setiap isi ulang",
        SUM: "Bonus tambahan untuk akumulasi isi ulang",
      },
      DAILY: {
        FIRST: "Bonus tambahan untuk isi ulang pertama setiap hari",
        SINGLE: "Bonus tambahan untuk setiap isi ulang tunggal harian",
        SUM: "Bonus tambahan untuk akumulasi isi ulang harian",
      },
      WEEKLY: {
        FIRST: "Bonus tambahan untuk isi ulang pertama setiap minggu",
        SINGLE: "Bonus tambahan untuk setiap isi ulang tunggal mingguan",
        SUM: "Bonus tambahan untuk akumulasi isi ulang mingguan",
      },
    },
    "hi-IN": {
      NONE: {
        FIRST: "पहली जमा पर अतिरिक्त इनाम",
        SINGLE: "प्रत्येक रिचार्ज पर अतिरिक्त बोनस",
        SUM: "संचयी रिचार्ज अतिरिक्त इनाम",
      },
      DAILY: {
        FIRST: "दैनिक पहले जमा पर अतिरिक्त इनाम",
        SINGLE: "प्रत्येक रिचार्ज पर दैनिक अतिरिक्त बोनस",
        SUM: "दैनिक संचयी रिचार्ज अतिरिक्त इनाम",
      },
      WEEKLY: {
        FIRST: "साप्ताहिक पहले जमा पर अतिरिक्त इनाम",
        SINGLE: "प्रत्येक रिचार्ज पर साप्ताहिक अतिरिक्त बोनस",
        SUM: "साप्ताहिक संचयी रिचार्ज अतिरिक्त इनाम",
      },
    },
    "vi-VN": {
      NONE: {
        FIRST: "Tiền thưởng thêm khi gửi tiền lần đầu",
        SINGLE: "Tiền thưởng gửi tiền một lần",
        SUM: "Tiền thưởng tiền gửi tích lũy",
      },
      DAILY: {
        FIRST: "Tiền thưởng gửi tiền đầu tiên hàng ngày",
        SINGLE: "Tiền thưởng gửi tiền đơn hàng ngày",
        SUM: "Tiền thưởng gửi tiền tích lũy hàng ngày",
      },
      WEEKLY: {
        FIRST: "Tiền thưởng gửi tiền đầu tiên hàng tuần",
        SINGLE: "Tiền thưởng gửi tiền một lần hàng tuần",
        SUM: "Tiền thưởng gửi tiền tích lũy hàng tuần",
      },
    },
  };

  return names[language][resetType][rechargeType];
}

// 获取救援金活动名字
function getRescueFundActivityName(language: Language, resetType: ResetType): string {
  const names = {
    "zh-CN": {
      NONE: "",
      DAILY: "每日救援金",
      WEEKLY: "每周救援金",
    },
    "en-US": {
      NONE: "",
      DAILY: "Daily loss rescue fund",
      WEEKLY: "Weekly loss rescue fund",
    },
    "pt-BR": {
      NONE: "",
      DAILY: "Fundo de Resgate de Perdas Diárias",
      WEEKLY: "Fundo de Resgate de Perdas Semanais",
    },
    "id-ID": {
      NONE: "",
      DAILY: "Uang bantuan harian",
      WEEKLY: "Uang bantuan mingguan",
    },
    "hi-IN": {
      NONE: "",
      DAILY: "दैनिक राहत कोष",
      WEEKLY: "साप्ताहिक राहत कोष",
    },
    "vi-VN": {
      NONE: "",
      DAILY: "Quỹ cứu trợ hàng ngày",
      WEEKLY: "Quỹ cứu trợ hàng tuần",
    },
  };

  return names[language][resetType];
}

// 幸运转盘活动名字
function getLuckyWheelActivityName(language: Language, resetType: ResetType): string {
  const names = {
    "zh-CN": {
      NONE: "幸运转盘",
      DAILY: "每日幸运转盘",
      WEEKLY: "每周幸运转盘",
    },
    "en-US": {
      NONE: "Lucky Spin",
      DAILY: "Daily Lucky Spin",
      WEEKLY: "Weekly Lucky Spin",
    },
    "pt-BR": {
      NONE: "Giro da Sorte",
      DAILY: "Giro da Sorte Diário",
      WEEKLY: "Giro da Sorte Semanal",
    },
    "id-ID": {
      NONE: "Roda Keberuntungan",
      DAILY: "Roda Keberuntungan Harian",
      WEEKLY: "Roda Keberuntungan Mingguan",
    },
    "hi-IN": {
      NONE: "लकी रूले",
      DAILY: "दैनिक लकी रूले",
      WEEKLY: "साप्ताहिक लकी रूले",
    },
    "vi-VN": {
      NONE: "Vòng quay may mắn",
      DAILY: "Vòng quay may mắn hàng ngày",
      WEEKLY: "Vòng quay may mắn hàng tuần",
    },
  };

  return names[language][resetType];
}

// 获取佣金奖励活动名字
function getCommissionRewardActivityName(language: Language, resetType: ResetType): string {
  const names = {
    "zh-CN": {
      NONE: "",
      DAILY: "每日佣金奖励",
      WEEKLY_DAY: "每周佣金奖励",
      MONTHLY_DAY: "每月佣金奖励",
    },
    "en-US": {
      NONE: "",
      DAILY: "Daily commission reward",
      WEEKLY_DAY: "Weekly commission reward",
      MONTHLY_DAY: "Monthly commission reward",
    },
    "pt-BR": {
      NONE: "",
      DAILY: "Recompensa de Comissão Diária",
      WEEKLY_DAY: "Recompensa de Comissão Semanal",
      MONTHLY_DAY: "Recompensa de Comissão Mensal",
    },
    "id-ID": {
      NONE: "",
      DAILY: "Hadiah Acara Komisi Harian",
      WEEKLY_DAY: "Hadiah Acara Komisi Mingguan",
      MONTHLY_DAY: "Hadiah Acara Komisi Bulanan",
    },
    "hi-IN": {
      NONE: "",
      DAILY: "दैनिक कमीशन इवेंट पुरस्कार",
      WEEKLY_DAY: "साप्ताहिक कमीशन इवेंट पुरस्कार",
      MONTHLY_DAY: "महीने का कमीशन इवेंट पुरस्कार",
    },
    "vi-VN": {
      NONE: "",
      DAILY: "Tiền thưởng hoa hồng hằng ngày",
      WEEKLY_DAY: "Tiền thưởng hoa hồng hàng tuần",
      MONTHLY_DAY: "Tiền thưởng hoa hồng hàng tháng",
    },
  };

  return names[language][resetType];
}

// 生成活动名字
export function getActivityDefaultName(language: Language, activityType: AcviticyType, variables: ActivityVariables): string {
  language = getLanguageCode(language);
  if (activityType === 'Recharge') {
    return getRechargeActivityName(language, variables.resetType as ResetType, variables.rechargeType as RechargeType)
  } else if (activityType === 'Assistance') {
    return getRescueFundActivityName(language, variables.resetType as ResetType)
  } else if (activityType === 'LuckyWheel') {
    return getLuckyWheelActivityName(language, variables.resetType as ResetType)
  } else if (activityType === 'CommissionReward') {
    return getCommissionRewardActivityName(language, variables.resetType as ResetType)
  }

  const activityNames = {
    Recharge: {},
    Assistance: {},
    LuckyWheel: {},
    SignIn: {
      "zh-CN": "签到",
      "en-US": "Sign in",
      "pt-BR": "Entrar",
      "id-ID": "Pendaftaran",
      "hi-IN": "साइन इन",
      "vi-VN": "Đăng nhập",
    },
    Custom: {
      "zh-CN": "自定义",
      "en-US": "Custom event",
      "pt-BR": "Evento personalizado",
      "id-ID": "Disesuaikan",
      "hi-IN": "कस्टम इवेंट",
      "vi-VN": "Tùy chỉnh",
    },
    RechargeReward: {
      "zh-CN": "充值赠送",
      "en-US": "Recharge discount",
      "pt-BR": "Desconto de recarga",
      "id-ID": "Bonus Isi Ulang",
      "hi-IN": "रिचार्ज छूट",
      "vi-VN": "Khuyến mãi nạp lại",
    },
    RedPacket: {
      "zh-CN": "神秘矿场",
      "en-US": "Mysterious Mine",
      "pt-BR": "Mina Misteriosa",
      "id-ID": "Tambang Misterius",
      "hi-IN": "रहस्यमय खदान",
      "vi-VN": "Mỏ vàng bí ẩn",
    },
    Agency: {
      "zh-CN": "推荐好友领彩金",
      "en-US": "Refer friends to receive a bonus",
      "pt-BR": "Indique amigos para receber um bônus",
      "id-ID": "Rekomendasikan teman untuk menerima bonus",
      "hi-IN": "दोस्तों को रेफर करें और बोनस प्राप्त करें।",
      "vi-VN": "Giới thiệu bạn bè để nhận thưởng",
    },
    Rebate: {
      "zh-CN": "返水活动",
      "en-US": "Wagering Cashback",
      "pt-BR": "Cashback de Apostas",
      "id-ID": "Program Pengembalian Uang",
      "hi-IN": "शर्त लगाने पर कैशबैक",
      "vi-VN": "Trả lại tiền cược",
    },
    AssistanceCash: {
      "zh-CN": "助力领现金",
      "en-US": "Earn cash by inviting friends",
      "pt-BR": "Ganhe dinheiro convidando amigos",
      "id-ID": "Bantu untuk Dapatkan Uang Tunai",
      "hi-IN": "दोस्तों को आमंत्रित करके नकद कमाएं",
      "vi-VN": "Giúp bạn kiếm tiền bằng cách giới thiệu bạn bè",
    },
    MemberReward: {
      "zh-CN": "会员答谢(单日)",
      "en-US": "Member Appreciation",
      "pt-BR": "Apreciação aos Membros",
      "id-ID": "Apresiasi Anggota",
      "hi-IN": "सदस्य प्रशंसा",
      "vi-VN": "Cảm ơn thành viên",
    },
    MysteryReward: {
      "zh-CN": "神秘彩金活动",
      "en-US": "Mystery Bonus Event",
      "pt-BR": "Evento de Bônus Misterioso",
      "id-ID": "Acara Bonus Misteri",
      "hi-IN": "रहस्यमय बोनस इवेंट",
      "vi-VN": "Sự kiện bất ngờ",
    },
    newbieTaskReward: {
      "zh-CN": "新人福利",
      "en-US": "Newbie benefits",
      "pt-BR": "Benefícios para iniciantes",
      "id-ID": "Manfaat bagi pemula",
      "hi-IN": "नौसिखिया लाभ",
      "vi-VN": "Lợi ích cho người mới",
    },
    CommissionReward: {
      "zh-CN": "每日佣金奖励",
      "en-US": "Daily Commission Event Reward",
      "pt-BR": "Recompensa do Evento de Comissão Diária",
      "id-ID": "Hadiah Acara Komisi Harian",
      "hi-IN": "दैनिक कमीशन इवेंट पुरस्कार",
      "vi-VN": "Phần thưởng sự kiện hoa hồng hàng ngày",
    },
    CPFActivity: {
      "zh-CN": "邀请好友",
      "en-US": "Invite Friends",
      "pt-BR": "Convidar Amigos",
      "id-ID": "Undang Teman",
      "hi-IN": "मित्रों को आमंत्रित करें",
      "vi-VN": "Mời bạn bè",
    },
    googleDomainReward: {
      "zh-CN": "版本升级奖金",
      "en-US": "Version Upgrade Bonus",
      "pt-BR": "Bônus de atualização de versão",
      "id-ID": "Bonus peningkatan versi",
      "hi-IN": "संस्करण उन्नयन बोनस",
      "vi-VN": "Phần thưởng cập nhật phiên bản",
    },
    LuckyBet: {
      "zh-CN": "幸运注单",
      "en-US": "Lucky Bet",
      "pt-BR": "Aposta da Sorte",
      "id-ID": "Taruhan Beruntung",
      "hi-IN": "भाग्यशाली बेट",
      "vi-VN": "Đặt cược may mắn",
    },
    SignInVolume: {
      "zh-CN": "签到奖励",
      "en-US": "Sign in reward",
      "pt-BR": "Recompensa de entrada",
      "id-ID": "Hadiah masuk",
      "hi-IN": "साइन इन पुरस्कार",
      "vi-VN": "Phần thưởng điểm danh",
    },
    WalletUserActivity: {
      "zh-CN": "邀请好友",
      "en-US": "Invite Friends",
      "pt-BR": "Convidar Amigos",
      "id-ID": "Undang Teman",
      "hi-IN": "मित्रों को आमंत्रित करें",
      "vi-VN": "Mời bạn bè",
    },
    MemberRewardMultiDay: {
      "zh-CN": "会员答谢(多日)",
      "en-US": "Member Appreciation (Multiple Days)",
      "pt-BR": "Apreciação aos Membros (Vários Dias)",
      "id-ID": "Apresiasi Anggota (Multi Hari)",
      "hi-IN": "सदस्य प्रशंसा (कई दिन)",
      "vi-VN": "Cảm ơn thành viên (Nhiều ngày)",
    },
    RechargePromotion: {
      "zh-CN": "充值大酬宾",
      "en-US": "Deposit Rewards",
      "pt-BR": "Recompensas de depósito",
      "id-ID": "Hadiah Deposit",
      "hi-IN": "जमा पुरस्कार",
      "vi-VN": "Khuyến mãi nạp lại",
    },
    NewUserExclusive: {
      "zh-CN": "新人首充奖励",
      "en-US": "New member first deposit reward",
      "pt-BR": "recompensa de primeiro depósito para novos membros",
      "id-ID": "hadiah deposit pertama member baru",
      "hi-IN": "नये सदस्य को प्रथम जमा पुरस्कार",
      "vi-VN": "phần thưởng tiền gửi đầu tiên của thành viên mới",
    },
    FirstRechargeRebate: {
      "zh-CN": "首充亏损返利",
      "en-US": "First Recharge Loss Rebate",
      "pt-BR": "Rebate da Primeira Recarga de Perda",
      "id-ID": "Bonus Rebatu Pertama untuk Kerugian",
      "hi-IN": "पहली शुल्क वापसी के लिए नुकसान",
    },
    FirstWithdrawRebate: {
      "zh-CN": "首次提现返利",
      "en-US": "First Withdrawal Rebate",
      "pt-BR": "Rebate da Primeira Saque",
      "id-ID": "Bonus Rebatu Pertama untuk Penarikan",
      "hi-IN": "पहली निकासी वापसी",
    },
    ReferralRewardsNew: {
      "zh-CN": "分享赚钱",
      "en-US": "Share to Earn",
      "pt-BR": "Compartilhe para Ganhar",
      "id-ID": "Bagikan untuk Menghasilkan",
      "hi-IN": "शेयर करें और कमाएँ",
      "vi-VN": "Chia sẻ để kiếm tiền",
    },  };
  return activityNames[activityType][language] || "Unknown Activity";
}

export function getRecommendActivityDefaultName(language: Language, activityType: AcviticyType) {
  const activityNames = {
    AssistanceCash: {
      "zh-CN": "助力领现金",
      "en-US": "Earn",
      "pt-BR": "Ganhar",
      "vi-VN": "Kiếm tiền",
      "id-ID": "Dapatkan",
      "hi-IN": "कमाएँ",
    },
    SignIn: {
      "zh-CN": "签到",
      "en-US": "Check-in",
      "pt-BR": "Check-in",
      "vi-VN": "Điểm Danh",
      "id-ID": "Check-in",
      "hi-IN": "चेक-इन",
    },
    SignInVolume: {
      "zh-CN": "签到",
      "en-US": "Check-in",
      "pt-BR": "Check-in",
      "vi-VN": "Điểm Danh",
      "id-ID": "Check-in",
      "hi-IN": "चेक-इन",
    },
    Recharge: {
      "zh-CN": "充值",
      "en-US": "Deposit",
      "pt-BR": "Depósito",
      "vi-VN": "Nạp Tiền",
      "id-ID": "Deposit",
      "hi-IN": "जमा करें",
    },
    RechargePromotion: {
      "zh-CN": "充值筹宾",
      "en-US": "Deposit",
      "pt-BR": "Depósito",
      "vi-VN": "Nạp",
      "id-ID": "Deposit",
      "hi-IN": "जमा",
    },
    MemberReward: {
      "zh-CN": "会员答谢",
      "en-US": "Gift",
      "pt-BR": "Presente",
      "vi-VN": "Quà",
      "id-ID": "Hadiah",
      "hi-IN": "उपहार",
    },
    CPFActivity: {
      "zh-CN": "邀请好友",
      "en-US": "Invite",
      "pt-BR": "Indique",
      "vi-VN": "Mời Bạn",
      "id-ID": "Undang",
      "hi-IN": "इनवाइट",
    },
    WalletUserActivity: {
      "zh-CN": "邀请好友",
      "en-US": "Invite",
      "pt-BR": "Indique",
      "vi-VN": "Mời Bạn",
      "id-ID": "Undang",
      "hi-IN": "इनवाइट",
    },
    ReferralRewardsNew: {
      "zh-CN": "分享赚钱",
      "en-US": "Share",
      "pt-BR": "Compartilhar",
      "vi-VN": "Chia sẻ",
      "id-ID": "Bagikan",
      "hi-IN": "शेयर करें",
    },
    LuckyBet: {
      "zh-CN": "幸运注单",
      "en-US": "Lucky",
      "pt-BR": "Sorte",
      "vi-VN": "Vận may",
      "id-ID": "Beruntung",
      "hi-IN": "लकी बेट",
    },
    MysteryReward: {
      "zh-CN": "神秘彩金",
      "en-US": "Mystery",
      "pt-BR": "Misterioso",
      "vi-VN": "Bí Ẩn",
      "id-ID": "Misteri",
      "hi-IN": "रहस्य",
    },
    RechargeReward: {
      "zh-CN": "充值赠送",
      "en-US": "Bonus",
      "pt-BR": "Ganhe Já",
      "vi-VN": "Thưởng",
      "id-ID": "Ambil Bonus",
      "hi-IN": "बोनस पाएंट",
    },
    Agency: {
      "zh-CN": "代理活动",
      "en-US": "Affiliate",
      "pt-BR": "Agente",
      "vi-VN": "Đại Lý",
      "id-ID": "Agen",
      "hi-IN": "एजेंट",
    },
    newbieTaskReward: {
      "zh-CN": "新人任务",
      "en-US": "Newbie",
      "pt-BR": "Novato",
      "vi-VN": "Tân Thủ",
      "id-ID": "Pemula",
      "hi-IN": "नवीन",
    },
    LuckyWheel: {
      "zh-CN": "幸运转盘",
      "en-US": "Spin",
      "pt-BR": "Gire",
      "vi-VN": "Quay",
      "id-ID": "Putar",
      "hi-IN": "घुमाओ",
    },
    Assistance: {
      "zh-CN": "救援金",
      "en-US": "Rescue",
      "pt-BR": "Resgate",
      "vi-VN": "Cứu Trợ",
      "id-ID": "Penyelamatan",
      "hi-IN": "बचाव",
    },
    RedPacket: {
      "zh-CN": "红包雨",
      "en-US": "Cash Drop",
      "pt-BR": "Pegue Já",
      "vi-VN": "Rơi Tiền",
      "id-ID": "Uang Turun",
      "hi-IN": "कैश ड्रॉप शुरू",
    },
    Rebate: {
      "zh-CN": "实时返水",
      "en-US": "Rebate",
      "pt-BR": "Reembolso",
      "vi-VN": "Hoàn Tiền",
      "id-ID": "Cashback",
      "hi-IN": "कैशबैक",
    },
    CommissionReward: {
      "zh-CN": "佣金奖励",
      "en-US": "Commission",
      "pt-BR": "Comissão",
      "vi-VN": "Hoa Hồng",
      "id-ID": "Komisi",
      "hi-IN": "कमीशन",
    },
    NewUserExclusive: {
      "zh-CN": "新人专享",
      "en-US": "NewbieBonus",
      "pt-BR": "NovosBrindes",
      "vi-VN": "MoiNhanQua",
      "id-ID": "Hadiah Awal",
      "hi-IN": "नवागंतुक पुरस्कार",
    },
    recharge: {
      "zh-CN": "充值页",
      "en-US": "Check-in",
      "pt-BR": "Check-in",
      "vi-VN": "Điểm Danh",
      "id-ID": "Check-in",
      "hi-IN": "चेक-इन",
    },
    withdraw: {
      "zh-CN": "提现页",
      "en-US": "Withdraw",
      "pt-BR": "Saque",
      "vi-VN": "Rút Tiền",
      "id-ID": "Penarikan",
      "hi-IN": "निकासी",
    },
    promotion: {
      "zh-CN": "推广中心页",
      "en-US": "Affiliate",
      "pt-BR": "Afiliado",
      "vi-VN": "Đại Lý",
      "id-ID": "Referral",
      "hi-IN": "प्रमोशन सेंटर",
    },
    activity_list: {
      "zh-CN": "活动页",
      "en-US": "Promotion",
      "pt-BR": "Promoções",
      "vi-VN": "Khuyến Mãi",
      "id-ID": "Promosi",
      "hi-IN": "प्रमोशन",
    },
    vip: {
      "zh-CN": "VIP页",
      "en-US": "VIP",
      "pt-BR": "VIP",
      "vi-VN": "VIP",
      "id-ID": "VIP",
      "hi-IN": "VIP",
    },
    redeem_code: {
      "zh-CN": "兑换码页",
      "en-US": "Redeem",
      "pt-BR": "Resgatar",
      "vi-VN": "Đổi Mã",
      "id-ID": "Tukar Kode",
      "hi-IN": "कोड रिडीम करें",
    },
    home: {
      "zh-CN": "兑换码页",
      "en-US": "Home",
      "pt-BR": "Início",
      "vi-VN": "Trang Chủ",
      "id-ID": "Beranda",
      "hi-IN": "होम",
    },
  };

  return activityNames?.[activityType]?.[language] ?? "Unknown Activity";
}

// 获取当前活动名字
export function getCurrentActivityName(multilingual: Record<string, string>, language: Language, activityType: AcviticyType,) {
  if (multilingual.nameType === "CUSTOM") return multilingual.name
  const params = JSON.parse(multilingual?.nameParams)
  return getActivityDefaultName(language, activityType, params.variablesValue)
}

// 根据当前语言格式化金额
export function formatAmount(amount: number, language: Language): string {
  language = getLanguageCode(language);
  return new Intl.NumberFormat(language, { style: 'decimal' }).format(amount);
}

// 生成预览文本
export function generatePreviewText(language: Language, variables: ActivityVariables): string {
  language = getLanguageCode(language);
  // 根据语言和类型选择正确的模板
  const firstTemplate = previewText_First?.[language]?.[variables.highestType];
  if (!firstTemplate) {
    return "Unsupported type";
  }

  // 替换模板中的变量
  let result = `1. ${firstTemplate.replace("{maximum}", formatAmount(Number(variables.highestReward), language))}`;

  // 设置默认的 activityType 为 Recharge
  const activityType = variables?.activityType || 'Recharge';

  // 添加第二条数据
  let secondTemplate;
  if (activityType === 'MysteryReward') {
    secondTemplate = previewText_Second_mysteryReward[language][variables.resetType];
  } else if (activityType === 'SignInVolume') {
    secondTemplate = previewText_Second_mysteryReward[language]['PERIODIC'];
  } else {
    secondTemplate = previewText_Second[language][variables.resetType];
  }
  if (secondTemplate) {
    result += `\n2. ${secondTemplate}`;
  }

  // 添加第三条数据
  const noNeedPreviewText_Third = ["NewUserExclusive"]
  const thirdTemplate = previewText_Third[language][variables.expiredAwardType];
  if (!noNeedPreviewText_Third.includes(activityType) && thirdTemplate) {
    result += `\n3. ${thirdTemplate}`;
  }

  return result;
}

export function getLanguageCode(language: Language): Language {
  if (language === 'en-PH') {
    return 'en-US';
  }
  return language; // 返回原语言
}

export function formatMoneyToShow(money: number | string, language: Language, fixed = 2): string {
  // 做个参数兼容处理，如果是字符串就直接返回
  if (typeof money === 'string') {
    return money
  }
  const locale = language
  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  }).format(money);
}
