
export default () => {

  const forGameStatus = (item: { platformStatus: string, gameTypeStatus: string, status: string }) => {
    const { platformStatus, gameTypeStatus, status } = item;
    const lock = [status, gameTypeStatus, platformStatus].some(s => s === 'MAINTAIN');
    if (lock) {
      return 'MAINTAIN';
    }
    return 'ON'
  }

  return {
    forGameStatus
  }
}
