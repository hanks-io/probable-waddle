export const useBetAmount = (userFlow: any[]) => {
  const needFlow = userFlow.reduce((accumulator: number, currentValue: any) => accumulator + currentValue.needFlow, 0)
  const currentFlow = userFlow.reduce((accumulator: number, currentValue: any) => accumulator + currentValue.currentFlow, 0)
  return needFlow - currentFlow
}
