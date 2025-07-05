function generateWebIcon(type?: string) {
    let icon512 = '';
    let icon192 = '';
    window.webAppManifestSettings.icons.forEach(icon => {
      if (icon.sizes === '512x512') {
        icon512 = icon.src;
      } else if (icon.sizes === '192x192') {
        icon192 = icon.src;
      }
    })

    icon192 = icon192 || icon512;

    const iconsData = [
      { rel: 'shortcut icon', href: icon192 },
      { rel: 'apple-touch-icon', href: icon192 },
      { sizes: '180x180', rel: 'apple-touch-icon', href: icon192 },
      { rel: 'apple-touch-icon-precomposed', href: icon192 }
    ];
    
    const headElement = document.getElementsByTagName('head')[0];
    
    iconsData.forEach(icon => {
      // 查找是否已存在具有相同rel和sizes的link元素
      let selector = `link[rel="${icon.rel}"]`;
      if (icon.sizes) {
        selector += `[sizes="${icon.sizes}"]`;
      }
      let existingLink = document.querySelector(selector);
    
      const link = document.createElement('link');
      link.rel = icon.rel;
      link.href = icon.href;
      if (type) {
      link.setAttribute('sign', type);
      }
      if (icon.sizes) {
        link.setAttribute('sizes', icon.sizes);
      }
    
      if (existingLink) {
        // 如果存在相同的link标签，则替换
        headElement.replaceChild(link, existingLink);
      } else {
        // 如果不存在，则添加新的link标签
        headElement.appendChild(link);
      }
    });
  }
  export { generateWebIcon };