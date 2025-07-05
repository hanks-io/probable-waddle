
interface GameItem {
  [key: string]: any;
}

interface TransformedItem {
  [key: string]: any;
}

export default () => {
  const favoriteApiKey = {
    gameCode: 'code',
    gameId: 'id',
    gameLogo: 'logo',
    gameName: 'name',
    gameStatus: 'status',
    gameType: 'gameType',
    gameTypeStatus: 'gameTypeStatus',
    horizontalScreen: 'horizontalScreen',
    isFavorite: 'isFavorite',
    plateformLogo: 'plateformLogo',
    plateformBackground: 'background',
    plateformName: 'platformName',
    plateformSecondaryBackground: 'secondaryBackground',
    plateformTarget: 'target',
    platformCode: 'platformCode',
    platformId: 'platformId',
    platformStatus: 'platformStatus',
    regionCode: 'regionCode',
    status: 'status',
    top: 'top',
  } as const;

  type FavoriteApiKeyType = typeof favoriteApiKey;
  type FavoriteApiValueType = FavoriteApiKeyType[keyof FavoriteApiKeyType];

  const gameKeyMap = computed(() => new Map(Object.entries(favoriteApiKey).map(([key, value]) => [value, key])));

  const transformFavoriteParameter = (list: GameItem[]): TransformedItem[] => {
    return list.map(item => {
      const newItem: TransformedItem = {};
      for (const key in item) {
        const newKey = favoriteApiKey[key as keyof FavoriteApiKeyType];
        if (newKey) {
          newItem[newKey] = item[key];
        } else {
          newItem[key] = item[key];
        }
      }
      return newItem;
    });
  };

  const transformGameParameter = (list: TransformedItem[]): GameItem[] => {
    return list.map(item => {
      const params: GameItem = {};
      for (const key in item) {
        const newKey = gameKeyMap.value.get(key as FavoriteApiValueType);
        if (newKey) {
          params[newKey] = item[key];
        }
      }
      return params;
    });
  };

  return {
    transformGameParameter,
    transformFavoriteParameter,
  };
}