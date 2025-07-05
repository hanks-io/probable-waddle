export const tabs = [
  { tab: 'game', text: 'Games' },
  { tab: 'app', text: 'Apps' },
  { tab: 'file', text: 'Movies' },
  { tab: 'book', text: 'Books' },
  { tab: 'child', text: 'Kids' }
]

export enum STYLE_TEMPLATE {
  style_1 = 'first',
  style_2 = 'second',
  style_3 = 'third',
}

export const STYLE_TEMPLATE_COLOR = {
  style_1: '#fff',
  style_2: '#111611',
  style_3: '#111611',
}

export type StyleKey = keyof typeof STYLE_TEMPLATE;

export interface CommentType {
  userImg: string;
  userName: string;
  score: number;
  comment: string;
  date: string;
}

export const useDwData = () => {
  const { t } = useI18n();
  const BRCommentList: CommentType[] = [
    {
      userImg: 'https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/images/939ff21415174dc5118eb885cf5a535c65f19ae276be1.jpeg',
      userName: `${t('viewsSystem.downloadIndex29')}`,
      date: `${t('viewsSystem.downloadIndex30')}`,
      score: 5,
      comment: `${t('viewsSystem.downloadIndex31')}`,

    },
    {
      userImg: 'https://pwa-install-20240320.s3.sa-east-1.amazonaws.com/assets/images/2569dc84ad21c232d1ad8c6c74cdaeb365f19d0a73dee.jpeg',
      userName: `${t('viewsSystem.downloadIndex32')}`,
      date: `${t('viewsSystem.downloadIndex33')}`,
      score: 5,
      comment: `${t('viewsSystem.downloadIndex34')}`,

    }
  ];

 const PHCommentList: CommentType[] = [
    {
      userImg: '/dw/user/user1.jpg',
      userName: `shiela mae`,
      date: `november 5 2024`,
      score: 5,
      comment: `grabe ung vip benefits dito sa iba weekly lang, dito araw araw, weekly tapos may monthly pa.`,

    },
    {
      userImg: '/dw/user/user2.jpg',
      userName: `julia padilla`,
      date: `november 3 2024`,
      score: 5,
      comment: `grabe ung 700 pesos ko naging 4,500 pa hahaha solid.`,

    },
    {
      userImg: '/dw/user/user3.jpg',
      userName: ` jessica cruz`,
      date: `november 3 2024`,
      score: 5,
      comment: `masaya talaga ang pasko ngayon taon, ez 160k sa super ace jackpot.`,

    },

    {
      userImg: '/dw/user/user4.jpg',
      userName: `maemae`,
      date: `november 2 2024`,
      score: 5,
      comment: `ang bilis ng withdraw halos 3 minutes lang nasa gcash ko na agad.`,

    },
    {
      userImg: '/dw/user/user5.jpg',
      userName: `jelay cinko`,
      date: `november 1 2024`,
      score: 5,
      comment: `Playphp lang pala ang sagot sa mga problema ko, ngayon di na ko nahihirapan maging single mom.`,

    },
    {
      userImg: '/dw/user/user6.jpg',
      userName: `andrea madrid`,
      date: `november 1 2024`,
      score: 5,
      comment: `akala ko di na mawiwithdraw ung panalo ko, buti nalang ang bilis mag response ng customer service nila, halos 5 minutes lang nasolve agad ung problema ko`,

    },
  ];

 const monthMap = new Map([
    [1, t('month.01')],
    [2, t('month.02')],
    [3, t('month.03')],
    [4, t('month.04')],
    [5, t('month.05')],
    [6, t('month.06')],
    [7, t('month.07')],
    [8, t('month.08')],
    [9, t('month.09')],
    [10, t('month.10')],
    [11, t('month.11')],
    [12, t('month.12')]
  ]);
  return {
    BRCommentList,
    PHCommentList,
    monthMap
  }
}


