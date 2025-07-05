/**
 * 网络图片转base64
 * @param url
 */
export function urlToBase64(url: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status === 200) {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result);
        }
        reader.readAsDataURL(this.response);
      } else {
        reject(new Error('Image download failed, status: ' + this.status));
      }
    };
    xhr.onerror = function() {
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}