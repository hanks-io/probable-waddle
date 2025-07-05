export const assetslist = ['recharge', 'withdraw'] as const;
type AssetsType = typeof assetslist[number];

export const handleAssetsKeydown = (event: KeyboardEvent, type: AssetsType = 'withdraw') => {
  const valueList = ['e', 'E', '-', '+', '.']
  if (valueList.includes(event.key)) {
    event.preventDefault();
  }
}

