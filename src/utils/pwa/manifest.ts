import { removeSpecialNum } from "@/utils";

/**
 * @description 生成manifest协议号
 */
export function generateManifestProtocol(name: string) {
  name = removeSpecialNum(name.toLowerCase())
  return `web+pwa${name}`
}

/**
 * @description 生成manifest协议对象
 */
export function generateManifestProtocolHandler(name: string, url: string) {
  if (url.includes('?')) {
    url = `${url}&pwaprotocolredirect=%s`
  } else {
    url = `${url}?pwaprotocolredirect=%s`
  }

  const protocol = generateManifestProtocol(name)

  return {
    protocol,
    url
  }
}

/**
 * @description 生成指定大小图标(正方形)
 */
export async function generateNewIcon(icon: string, size: number = 192) {
  let canvas = document.createElement('canvas');  // 创建canvas画布标签
  canvas.width = size;   // 设置canvas画布的宽高
  canvas.height = size; // 设置canvas画布的宽高
  
  const img = new Image();
  img.src = icon;
  await new Promise((resolve, reject) => img.onload = function() {
    const ctx = canvas.getContext('2d');  // 获取canvas画布2d绘图环境对象
    ctx?.drawImage(img, 0, 0, size, size);
    resolve(true);
  })

  return canvas.toDataURL('image/png');
}

/**
 * @description 生成manifest图标对象
 */
export function generateManifestIcon(src: string, size: number = 0, type: string = 'image/png') {
  if (size) {
    return {
      sizes: `${size}x${size}`,
      src,
      type
    }
  } else {
    return {
      sizes: 'any',
      src,
      type,
    }
  }
}
