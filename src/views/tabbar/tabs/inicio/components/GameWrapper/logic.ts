import useCardStyle from '@/components/GameCard/useCardStyle'


export default (props: any) => {
  const { cardStyle  } = useCardStyle(props)

  const forTabValueOptions = (item: any) => {
    const { titleType, headType } = props.gameWrapperOptions;
    const { size, row, hotRow, hotSize, isShowAll } = props.gameWrapperOptions[cardStyle.value];
    let logoType = "1";
    let currentSize = size;
    let currentRow = row;
    let platformId = String(item.id);
    if (item.gameType === "POPULAR") {
      currentRow = hotRow;
      currentSize = hotSize;
    }
    if (item.hot) {
      platformId = String(item.platformId);
    }
    if (['POPULAR', 'SPORTS'].includes(item.gameType) || item.hot) {
      logoType = "2";
    }
    return {
      headType,
      logoType,
      isShowAll,
      titleType,
      platformId,
      size: currentSize,
      row: currentRow,
      platform: item,
      gameList: item.list,
    }
  }

  return {
    forTabValueOptions,
  }
}
