/**
 * 解决hbuilder打包app之后点击手机返回键直接退出app的
 */
document.addEventListener('plusready', function () {
  var webview = plus.webview.currentWebview()
  plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      webview.back()
      // webview.close() //hide,quit
      // plus.runtime.quit()
      // 首页返回键处理
      // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
      var first = null
      plus.key.addEventListener(
        'backbutton',
        function () {
          // 首次按键时间
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 400) {
              //退出程序
              plus.runtime.quit()
            }
          }
        },
        false
      )

    })
  })
})
