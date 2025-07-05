export function remToPx(rem: number) {
  const fontSize = document.documentElement.style.fontSize;
  return rem * parseFloat(fontSize);
}