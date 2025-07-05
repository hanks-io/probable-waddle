(function () {
  window._refresh_btn = {};
  const uRLSearchParams = new URLSearchParams(window.location.search)
  const isFromSwCallDomain = uRLSearchParams.get('fromEntry') === 'sw';
  if (isFromSwCallDomain) {
    return;
  }
  const _html = `<div class="box xuanfu touming">
<input type="checkbox" class="boxButton " id="box-buttons" />
<label class="circular" for="box-buttons"></label>
<label class="fork" for="box-buttons"></label>
<ul>
  <li class="box-item">
    <a onclick="location.reload()" style="display: flex; align-items: center; justify-content: center;">
    <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg fill="#ccc" width="50px" height="50px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M27.1 14.313V5.396L24.158 8.34c-2.33-2.325-5.033-3.503-8.11-3.503C9.902 4.837 4.901 9.847 4.899 16c.001 6.152 5.003 11.158 11.15 11.16 4.276 0 9.369-2.227 10.836-8.478l.028-.122h-3.23l-.022.068c-1.078 3.242-4.138 5.421-7.613 5.421a8 8 0 0 1-5.691-2.359A7.993 7.993 0 0 1 8 16.001c0-4.438 3.611-8.049 8.05-8.049 2.069 0 3.638.58 5.924 2.573l-3.792 3.789H27.1z"/></svg>
    </a>
  </li>
</ul>
</div>`
  document.body.insertAdjacentHTML('beforeend', _html)
  const xuanfu = document.querySelector('.xuanfu')
  const boxButton = document.querySelector('.boxButton')
  // 判断父元素，是否有指定的类名
  function hasParentWithClassName(element, className) {
    while (element && element !== document.body) {
      if (element.classList.contains(className)) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }
  //绑定事件触摸
  xuanfu.addEventListener('touchstart', function (e) {
    // 获取元素当前距离左侧的偏移量
    this.l = this.offsetLeft
    // 获取触摸开始时 触摸点距离左侧的偏移量
    this.x = e.targetTouches[0].clientX

    // 获取元素当前距离顶侧的偏移量
    this.t = this.offsetTop
    // 获取触摸开始时 触摸点距离顶侧的偏移量
    this.y = e.targetTouches[0].clientY

    // 使其不透明
    this.classList.remove('touming')
  }, { passive: true })
  xuanfu.addEventListener('touchmove', function (e) {
    // 获取触摸移动后,触摸点距离左侧的偏移
    this._x = e.targetTouches[0].clientX
    // 计算最终的left
    let newLeft = this._x - (this.x - this.l);
    // 判断
    if (newLeft <= 0) newLeft = 0
    if (newLeft >= document.documentElement.clientWidth - this.offsetWidth) {
      newLeft = document.documentElement.clientWidth - this.offsetWidth
    }

    // 获取触摸移动后,触摸点距离左侧的偏移
    this._y = e.targetTouches[0].clientY
    // 计算最终的left
    let newTop = this._y - (this.y - this.t);
    // 判断
    if (newTop <= 0) newTop = 0
    if (newTop >= document.documentElement.clientWidth - this.offsetHeight) {
      newTop = document.documentElement.clientWidth - this.offsetHeight
    }
    // 设置样式
    this.style.left = newLeft + 'px'
    this.style.top = newTop + 'px'
  }, { passive: true })
  function hideRefreshButton(e) {
    if (!hasParentWithClassName(e.target, 'xuanfu')) {
      xuanfu.querySelector('.boxButton').checked = false
    }
  }
  function listenerFloatBtn(e) {
    // 清空定时器
    clearTimeout(window._refresh_btn.timer1)
    clearTimeout(window._refresh_btn.timer2)
    // 增加过渡效果
    this.style.transition = 'none'

    // 吸附效果
    // 计算居中状态下left值
    this.middle = (document.documentElement.clientWidth - this.offsetWidth) / 2
    //计算
    this.left = this.offsetLeft

    // 声明变量 存放最终的left值
    let newLeft
    //判断
    if (this.left <= this.middle) {
      newLeft = 0
    } else {
      newLeft = document.documentElement.clientWidth - this.offsetWidth
    }
    // 设置
    this.style.left = newLeft + 'px'
    // 启动定时器,使其变成透明的
    window._refresh_btn.timer1 = setTimeout(() => {
      this.classList.add('touming')
      clearTimeout(window._refresh_btn.timer1)
    }, 6000)
    window._refresh_btn.timer2 = setTimeout(() => {
      this.querySelector('.boxButton').checked = false
      document.removeEventListener('touchstart', hideRefreshButton)
      clearTimeout(window._refresh_btn.timer2)
    }, 6000)
    document.addEventListener('touchstart', hideRefreshButton)
  }
  xuanfu.addEventListener('touchend', listenerFloatBtn)
  xuanfu.addEventListener('click', listenerFloatBtn)
  window.addEventListener('beforeunload', function (e) {
    document.removeEventListener('touchstart', hideRefreshButton)
    xuanfu.removeEventListener('click', listenerFloatBtn)
    xuanfu.removeEventListener('touchend', listenerFloatBtn)
  });
  boxButton.addEventListener('click', function (e) {
    let res = (document.documentElement.clientWidth) / 2
    if (e.clientX <= res) {
      this.classList.add('boxButton2')
    } else {
      this.classList.remove('boxButton2')
      this.classList.add('boxButton1')
    }
  })
}())
