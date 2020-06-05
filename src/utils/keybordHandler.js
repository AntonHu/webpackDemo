/** 解决 ios软键盘回弹空白的问题 */

(function(_this) {
    var isIOS = /iphone|ipad|ipod/.test(_this.navigator.userAgent.toLowerCase());
    if (isIOS) {
        var keybordHandler = function() {
            var currentPosition, timer;
            var speed = 1 // 页面滚动距离
            timer = setInterval(function () {
              currentPosition = _this.document.documentElement.scrollTop || _this.document.body.scrollTop
              currentPosition -= speed
              window.scrollTo(0, currentPosition) // 页面向上滚动
              currentPosition += speed // speed变量
              window.scrollTo(0, currentPosition) // 页面向下滚动
              clearInterval(timer)
            }, 1);
        };
        var inputList = _this.document.getElementsByTagName('input');
        for ( var i = 0; i < inputList.length; i++ ) {
            inputList[i].addEventListener('blur', keybordHandler);
        }
    }
})(window);