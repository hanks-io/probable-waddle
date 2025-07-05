export const getCssProperty = (property: string) => {
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(property);
}

export function getRemInPixels(rem: number) {
  let rootFontSize = parseFloat(getComputedStyle(document.documentElement)?.fontSize || '16px');
  return `${rem * rootFontSize}px`;
}
