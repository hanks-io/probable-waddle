
import { getTheme } from '@/theme/hooks';
export default () => {
  const {  theme } = getTheme();
 
   if(theme.includes('light'))  return `scheme-light`
   if(theme.includes('amber-purple'))  return `amber-purple`
   return ''
  // document.documentElement.classList.toggle(theme, true);
}
