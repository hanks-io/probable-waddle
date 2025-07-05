import QRCode from 'qrcode';
import { urlToBase64 } from './urlToBase64';

/**
 * 生成海报
 * @param logo 顶部/中心logo
 * @param qrCode 二维码
 * @param siteName 标题
 * @param icon 底部描述图标
 * @param background 背景图
 * @param intro 底部描述文字
 */
export async function generatePoster(logo: string, qrCode: string, siteName: string, icon: string, background: string, intro: string) {
  let canvas = document.createElement('canvas');  // 创建canvas画布标签
  let ctx = canvas.getContext('2d');              // 获取canvas画布2d绘图环境对象

  const qrCodeUrl = await QRCode.toDataURL(qrCode, { width: 350 }); // 生成二维码<base64>(根据文本内容<网址>)
  let logoImg = new Image();        // 创建logo图片对象
  let iconImg = new Image();        // 创建底部描述图片对象
  let backgroundImg = new Image();  // 创建背景图片对象
  let qrCodeImg = new Image();      // 创建二维码图片对象

  Promise.all([ // 等待所有图片加载完成
    new Promise((resolve, reject) => logoImg.onload = function() {
      resolve(true);
    }),
    new Promise((resolve, reject) => iconImg.onload = function() {
      resolve(true);
    }),
    new Promise((resolve, reject) => backgroundImg.onload = function() {
      resolve(true);
    }),
    new Promise((resolve, reject) => qrCodeImg.onload = function() {
      resolve(true);
    })
  ]).then(() => {
    canvas.width = backgroundImg.width;   // 设置canvas画布的宽高
    canvas.height = backgroundImg.height; // 设置canvas画布的宽高

    if (ctx) {
      // 绘制背景图片
      ctx.drawImage(backgroundImg, 0, 0, backgroundImg.width, backgroundImg.height);

      // 绘制顶部logo图片
      if (logoImg.height <= 100) {   // 高度小于 等于 100
        const baseY = 70 - logoImg.height/2
        if (logoImg.width > 100) {  // 大于100 高度等比例缩放 调整Y轴距离
          const newHeight = logoImg.height/(logoImg.width/100)
          ctx.drawImage(logoImg, 50, 70 - newHeight/2 , 100, newHeight);
        } else {                    // 小于 等于100 只需要调整Y轴距离
          ctx.drawImage(logoImg, 50, baseY, logoImg.width, logoImg.height);
        } 
      } else {                      // 高度 大于 100
        const newWidth = logoImg.width/(logoImg.height/100)  // 宽度等比例缩放
        if (newWidth > 100) {      // 缩放后宽度依然大于100  宽度为100  等比例缩放高度
          const newHeight =  100 / (newWidth/100)
          ctx.drawImage(logoImg, 50, 70 - newHeight/2, 100 , newHeight);
        } else {                   // 小于等于 
          ctx.drawImage(logoImg, 50, 15, newWidth , 100);
        }
      }

      // 绘制顶部标题文字
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(siteName, 165, 80);

      // 绘制底部描述图标
      if (iconImg.height > 100) {       // 高度大于100
        const newWidth = iconImg.width/(iconImg.height/100);
        if (newWidth > 100) {
          const newHeight = 100/(newWidth/100)
          const baseY = newHeight > 70 ? 690 : 725;
          ctx.drawImage(iconImg, 10, baseY, 100, newHeight);
        } else {
          ctx.drawImage(iconImg, 10, 690, newWidth, 100);
        }
      } else {
        if (iconImg.width > 100) {     // 高度小于等于100  宽度大于100
          const newHeight = iconImg.height/(iconImg.width/100)
          // 高度小于等于100 等比例缩放后不存在高度大于100的情况 高度小于100 调整Y轴距离
          const baseY = newHeight > 70 ? 690 : 725;
          ctx.drawImage(iconImg, 10, baseY, 100, newHeight);
        } else {                       // 高度小于等于100  宽度小于100
          // 高度小于等于100 宽度小于等于100 只需调整Y轴距离
          const baseY = iconImg.height > 70 ? 690 : 725;
          ctx.drawImage(iconImg, 10, baseY, iconImg.width, iconImg.height);
        }
      }

      // 绘制二维码图片
      ctx.drawImage(qrCodeImg, 50, 230, qrCodeImg.width, qrCodeImg.height);

      // 绘制底部描述文字
      ctx.fillStyle = '#FFF';
      ctx.font = '20px "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif'
      const introArray = Array.from(intro); // 将字符串转换为数组(表情包占两字符长度,无法使用split正常分割)
      if (/[\u4e00-\u9fa5]/.test(intro)) { // 判断是否包含中文,中文字符会比英文字符占用更多的宽度
        if (introArray.length > 30) {
          const intro_1 = introArray.slice(0, 15).join('');
          const intro_2 = introArray.slice(15, 30).join('');
          const intro_3 = introArray.slice(30).join('');
          ctx.fillText(intro_1, 120, 720);
          ctx.fillText(intro_2, 120, 750);
          ctx.fillText(intro_3, 120, 780);
        } else if (introArray.length > 16) {
          const intro_1 = introArray.slice(0, 15).join('');
          const intro_2 = introArray.slice(15).join('');
          ctx.fillText(intro_1, 120, 730);
          ctx.fillText(intro_2, 120, 770);
        } else {
          ctx.fillText(intro, 120, 750);
        }
      } else{
        if (introArray.length > 24) {
          const intro_1 = introArray.slice(0, 24).join('');
          const intro_2 = introArray.slice(24).join('');
          ctx.fillText(intro_1, 120, 730);
          ctx.fillText(intro_2, 120, 770);
        } else {
          ctx.fillText(intro, 120, 750);
        }
      }

      // 创建一个带有圆角的正·方形路径
      let x = 190, y = 370, width = 70, height = 70, radius = 10; // 设置形状的位置、宽高、圆角半径
      ctx.beginPath();                                            // 开始一个新的路径
      ctx.moveTo(x + radius, y);                                  // 将画笔移动到左上角的圆角的起始位置
      ctx.arcTo(x + width, y, x + width, y + height, radius);     // 画出右上角的圆角
      ctx.arcTo(x + width, y + height, x, y + height, radius);    // 画出右下角的圆角
      ctx.arcTo(x, y + height, x, y, radius);                     // 画出左下角的圆角
      ctx.arcTo(x, y, x + width, y, radius);                      // 画出左上角的圆角
      ctx.closePath();                                            // 关闭路径
      ctx.fillStyle = '#FFF';                                     // 设置填充颜色
      ctx.fill();                                                 // 填充路径

      // 在正方形区域内绘制图片
      ctx.drawImage(logoImg, 190, 370, 65, 65);
    }

    // 生成图片并下载
    let dataURL = canvas.toDataURL('image/png');  // 将canvas画布转换为base64图片地址
    let link = document.createElement('a');       // 创建a标签
    link.href = dataURL;                          // 将a标签的href属性设置为图片的base64地址
    link.download = 'poster.png';                 // 设置a标签的download属性为图片的名称
    link.click();                                 // 触发a标签的click事件
  });
  
  // 设置图片的src属性<base64>
  backgroundImg.src = await urlToBase64(background) as string;
  qrCodeImg.src = qrCodeUrl;
  iconImg.src = await urlToBase64(icon) as string;
  logoImg.src = await urlToBase64(logo) as string;
}
