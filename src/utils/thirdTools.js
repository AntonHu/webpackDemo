(function(window){
    'use strict';

    function define_library(){
        var TD_TOOLS = {
            getLocation:function(option){
                //获取经纬度
                var client = APP_TOOLS.isWechatClient();
                if(client=='zfb' && window.ap){
                    ap.getLocation(function(res) {
                        if(res.latitude && res.latitude!=0){
                            if(typeof option.success === "function"){
                                //获取成功
                                option.success(res)
                            }
                        }else if(res.error&&res.error==16){
                            if(typeof option.fail === "function"){
                                //无权限
                                option.fail(res)
                            }
                        }else if(res.error){
                            if(typeof option.error === "function"){
                                //获取失败
                                option.error(res)
                            }
                        }
                    });
                }else if(client=='gdMap' && window.my){
                    my.getLocation({
                        success: function (res) {
                            if(res.latitude && res.latitude!=0){
                                if(typeof option.success === "function"){
                                    //获取成功
                                    option.success(res)
                                }
                            }else {
                                if(typeof option.error === "function"){
                                    //获取失败
                                    option.error(res)
                                }
                            }
                        },
                        fail: function (){
                            if(typeof option.error === "function"){
                                //获取失败
                                option.error(res)
                            }
                        }
                    });
                }else if(client=='hcz' && window.hczApp){
                    //好车主
                    var params = {
                        MethodName: 'getGDLocation',
                        Parameters:{
                            jsCallBack: 'onGetGDLocation'
                        }
                    };
                    var hczApp = window.hczApp || {};
                    hczApp.CallNative = hczApp.CallNative || function(){};
                    window.onGetGDLocation = function(res){
                        if(res.latitude && res.latitude!=0){
                            if(typeof option.success === "function"){
                                //获取成功
                                option.success(res)
                            }
                        }else{
                            if(typeof option.error === "function"){
                                //获取失败
                                option.error(res)
                            }
                        }
                    }
                    hczApp.CallNative(JSON.stringify(params))
                } else if ( client=='cez' && ( window.iOSInfo || window.scApp ) ) {
                    //车e族
                    $(document).ready(function(){
                        window.getUserLocationNewCallBack = function(res){
                            if(res && typeof(res) === "string"){
                                res = JSON.parse(res);
                            }
                            if(res.latitude && res.latitude!=0){
                                if(typeof option.success === "function"){
                                    //获取成功
                                    option.success(res)
                                }
                            }else if(res.code == "1"){
                                //app未开启定位权限
                                if(typeof option.fail === "function"){
                                    //无权限
                                    option.fail(res)
                                }
                            }else{
                                if(typeof option.error === "function"){
                                    //获取失败
                                    option.error(res)
                                }
                            }
                        };
                        if (window.iOSInfo) {
                            window.webkit.messageHandlers.getUserLocationNew.postMessage('getUserLocationNewCallBack')
                        } else if (window.scApp) {
                            window.scApp.getUserLocationNew('getUserLocationNewCallBack')
                        }
                    })
                }else if(client=='wx'&& APP_TOOLS.sourceFrom() !== 'JS_Sinopec'){
                    wx.ready(function (){
                        // 获取用户定位信息
                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                if(typeof option.success === "function"){
                                    //获取成功
                                    option.success(res)
                                }
                            },
                            fail: function (res) {
                                //app未开启定位权限
                                if(typeof option.fail === "function"){
                                    //无权限
                                    option.fail(res)
                                }
                            },
                            cancel: function (res) {
                                if(typeof option.error === "function"){
                                    //获取失败
                                    option.error(res)
                                }
                            }
                        });
                    });
                }else{
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(res){
                            if(typeof option.success === "function"){
                                //获取成功
                                option.success(res)
                            }
                        }, function(res){
                            if(typeof option.fail === "function"){
                                //无权限
                                option.fail(res)
                            }
                        });
                    }
                }
            },
            //打开导航
            openLocation:function(opts){
                var client = APP_TOOLS.isWechatClient();
                if(client == 'zfb' && window.ap){
                    ap.openLocation(opts);
                }else if(client == 'hcz'){
                    this.checkHczMapList(opts);
                }else if(client == 'cez'){
                    $.alert("非常抱歉，暂不支持导航功能！")
                }else if(client == 'wx'){
                    wx.openLocation(opts)
                }else {
                    var location = opts.latitude +","+ opts.longitude,
                        title = opts.name, content = opts.address;

                    var ua = navigator.userAgent.toLowerCase(); 
                    var isIOS = /iphone|ipad|ipod/.test(ua);
                    //跳转微下载链接
                    if(isIOS){
                        window.location.href = "baidumap://map/marker?location="+location+"&title="+title+"&content="+content+"&src=ios.baidu.openAPIdemo";
                    }else{
                        window.location.href = "bdapp://map/show?center="+location+"&zoom=13&traffic=on&src=andr.baidu.openAPIdemo";
                    }
                }
            },
            //扫描二维码
            scan:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client=='zfb' && window.ap) {
                    APP_TOOLS.isEnvClient(function(env){
                        var miniApp = env.miniApp;
                        if(miniApp){
                            my.postMessage({'functionName': 'scanQR'});     //通知小程序调起摄像头扫码
                            my.onMessage = function(e) {
                                if(e.functionName === 'scanQR'){        //接收到小程序发来的扫码信息
                                    var result = e.result;
                                    if(!result) return;

                                    if(typeof option.success === "function"){
                                        option.success(result);
                                    }
                                }
                            }
                        }else{
                            ap.scan(function(res){
                                var result = res.code;
                                if(!result) return;

                                if(typeof option.success === "function"){
                                    option.success(result);
                                }
                            });
                        }
                    })
                }else if(client=='hcz' && window.hczApp){
                    //好车主
                    var params = {
                        MethodName: 'pushScanQRCodeVC',
                        Parameters:{
                            jsCallBack: 'onPushScanQRCodeVC'
                        }
                    };
                    var hczApp = window.hczApp || {};
                    hczApp.CallNative = hczApp.CallNative || function(){};
                    window.onPushScanQRCodeVC = function(res){
                        var result = res.result;
                        if(!result) return;

                        if(typeof option.success === "function"){
                            option.success(result);
                        }
                    }
                    hczApp.CallNative(JSON.stringify(params))
                }else if(client=='cez'){
                    if (window.iOSInfo) {
                        //iOS调用
                        window.webkit.messageHandlers.showScannerView.postMessage(null)
                    } else if (window.scApp) {
                        // Android 调用
                        window.scApp.showScannerView()
                    }
                }else if(client=='zjrb' && window.PiccAppNative) {
                    window.onPICCScanCallBack = function(result) {
                        var result = JSON.parse(result);
                        var code = $.getUrlParam('code'),
                            data = $.getUrlParam('data'),
                            uid = $.getUrlParam('uid');
                        var codeStr = code ? '&code=' + code : '',
                            dataStr = data ? '&data=' + data : '',
                            uidStr = uid ? '&uid=' + uid : '';
                        result.data && option.success(result.data.scanString + codeStr + dataStr + uidStr);
                    };
                    PiccAppNative.callNative({
                        module: "device",
                        method: "scan",
                        params: "{}",
                        callback: "onPICCScanCallBack"
                    });
                }else {
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        desc: 'scanQRCode',
                        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            var result = res.resultStr;
                            if(!result) return;

                            if(typeof option.success === "function") {
                                var data = $.getUrlParam('data'),
                                    uid = $.getUrlParam('uid');
                                var dataStr = data ? '&data=' + data : '',
                                    uidStr = uid ? '&uid=' + uid : '';
                                option.success(result + dataStr + uidStr);
                            }
                        },
                        fail:function(err){
                            $.alert("微信无法扫码，请刷新后重试");
                        }
                    });
                }
            },

            //平安好车主，检查地图的开放情况
            checkHczMapList:function(opts){
                var params = {
                    MethodName: 'getMapList',
                    Parameters:{
                        jsCallBack: 'onGetMapList'
                    }
                };
                var hczApp = window.hczApp || {};
                hczApp.CallNative = hczApp.CallNative || function(){};
                window.onGetMapList = function(res){
                    this.openHclMap(res, opts);
                }.bind(this)
                hczApp.CallNative(JSON.stringify(params))
            },
            openHclMap:function(res, opts){
                if(res&&res.maplist&&res.maplist.length){
                    var label = "";
                    for(var i=0; i<res.maplist.length; i++){
                        var item = res.maplist[i];
                        if(item == 'baidu' || item == 'gaode'|| item == 'tencent'){
                            label = item;
                            break;
                        }
                    }

                    if(label){
                        var params = {
                            MethodName: 'openDesignatedMap',
                            Parameters:{
                                mapName: label,
                                endLatitude: opts.latitude,
                                endLongitude: opts.longitude,
                            }
                        };
                        var hczApp = window.hczApp || {};
                        hczApp.CallNative = hczApp.CallNative || function(){};
                        hczApp.CallNative(JSON.stringify(params))
                    }else{
                        $.alert("未检测到高德地图客户端")
                    }
                }else{
                    $.alert("未检测到高德地图客户端")
                }
            },

            //微信分享初始化入口
            initShareConfig:function(option){
                var client = APP_TOOLS.isWechatClient();
                APP_TOOLS.isEnvClient(function(env){
                    var client = env.client;
                    var miniApp = env.miniApp;
                    var third = env.third;

                    if(client === "wx"){
                        //微信分享
                        this.wechatShare(option);
                    }else if(client === "zfb" && miniApp && !third){
                        //驿公里的支付宝小程序
                        this.zfbMiniShare(option);
                    }else if(client === 'zfb' && !miniApp && option.isShowed){
                        //驿公里的支付宝网页
                        this.zfbShare(option);
                    }
                }.bind(this))
            },
            //微信分享
            wechatShare: function(option){
                var title = option.title,
                    url = option.url,
                    icon = option.icon,
                    desc = option.desc,
                    localUrl = option.localUrl;

                var newUrl = /\?/.test(url)? url+"&isFrom=1": url+"?isFrom=1";
                if(!localUrl){
                    localUrl = window.location.href;
                }

                $.ajax({
                    isRepeated: true,  //设置true时，不需要获取sessionId
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    url:APP_CONFIG.APP_SERVICE + "share/wxShare/shareConfig",
                    data:{"pageUrl":localUrl},
                    success:function(res){
                        if(APP_TOOLS.isWechatClient()=='zfb'){
                            return;
                        }
                        
                        wx.config({
                            debug: false,
                            appId: res['appid'], // 必填，公众号的唯一标识
                            timestamp: res['timestamp'], // 必填，生成签名的时间戳
                            nonceStr: res['noncestr'], // 必填，生成签名的随机串
                            signature: res['signature'], // 必填，签名
                            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表
                        });

                        wx.ready(function () {
                            wx.onMenuShareTimeline({
                                title: title, // 分享标题
                                link:  newUrl, // 分享链接
                                imgUrl: icon, // 分享图标
                                success: function () {
                                    if(typeof option.success === "function"){
                                        option.success();
                                    }
                                },
                                cancel: function () {
                                   //alert("分享取消");
                                }
                            });

                            wx.onMenuShareAppMessage({
                                title: title, // 分享标题
                                link:  newUrl, // 分享链接
                                imgUrl: icon, // 分享图标
                                desc: desc, // 分享标题
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                    if(typeof option.success === "function"){
                                        option.success();
                                    }
                                },
                                cancel: function () {
                                   // 用户取消分享后执行的回调函数
                                }
                            });

                            // wx.onMenuShareAppMessage({
                            //     title: '视频测试', // 分享标题
                            //     link: 'https://mp4.1kmxc.com/static-web-new/website/video/home/ygl_home_intact_video.mp4', // 分享链接
                            //     imgUrl: icon, // 分享图标
                            //     desc: '这是一条视频测试', // 分享标题
                            //     type: 'video', // 分享类型,music、video或link，不填默认为link
                            //     dataUrl: 'https://mp4.1kmxc.com/static-web-new/website/video/home/ygl_home_intact_video.mp4', // 如果type是music或video，则要提供数据链接，默认为空
                            //     success: function () {
                            //         // 用户确认分享后执行的回调函数
                            //         if(typeof option.success === "function"){
                            //             option.success();
                            //         }
                            //     },
                            //     cancel: function () {
                            //        // 用户取消分享后执行的回调函数
                            //     }
                            // });
                        });
                    }
                })
            },
            //支付宝小程序分享
            zfbMiniShare:function(option) {
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb" || !window.my){
                    return;
                }

                var url = option.url; // 分享链接
                var newUrl = /\?/.test(url)? url+"&isFrom=1": url+"?isFrom=1";

                my.postMessage({
                    'functionName': 'showSharePanel',
                    'title': option.title,   // 分享标题
                    'desc': option.desc,     // 分享内容
                    'webUrl': newUrl,           // 分享链接
                    'imageUrl': option.icon,    // 分享图标
                    'isShowed': option.isShowed,   //是否立即显示
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'showSharePanel'){        //接收到小程序发来的扫码信息
                        if(typeof option.success === "function"){
                            option.success();
                        }
                    }
                }
            },
            //支付宝分享
            zfbShare:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb" || !window.ap){
                    return;
                }
                var url = option.url; // 分享链接
                var newUrl = /\?/.test(url)? url+"&isFrom=1": url+"?isFrom=1";

                ap.share({
                    title: option.title,
                    content: option.desc,
                    url: newUrl,
                    image: option.icon,
                }, function(result){
                    if(result.shareResult && typeof option.success === "function"){
                        option.success();
                    }
                });
            },
            navigateToMiniProgram:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb"){
                    return;
                }
                my.postMessage({
                    'functionName': 'navigateToMiniProgram',
                    'appId': option.appId,   // appId
                    'path': option.path,     // 跳转路径
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'navigateToMiniProgram'){
                        if(typeof option.success === "function"){
                            option.success();
                        }
                    }
                }
            },setStorageSync:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb"){
                    return;
                }
                my.postMessage({
                    'functionName': 'setStorageSync',
                    'key': option.key,   // 缓存key
                    'data': option.data,     // 缓存值
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'setStorageSync'){
                        if(typeof option.success === "function"){
                            option.success(e.data);
                        }
                    }
                }
            },
            getStorageSync:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb"){
                    return;
                }
                my.postMessage({
                    'functionName': 'getStorageSync',
                    'key': option.key,   // 缓存key
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'getStorageSync'){
                        if(typeof option.success === "function"){
                            option.success(e);
                        }
                    }
                }
            },
            removeStorageSync:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb"){
                    return;
                }
                my.postMessage({
                    'functionName': 'removeStorageSync',
                    'key': option.key,   // 缓存key
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'removeStorageSync'){
                        if(typeof option.success === "function"){
                            option.success(e);
                        }
                    }
                }
            },
            setStorageSync:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb"){
                    return;
                }
                my.postMessage({
                    'functionName': 'setStorageSync',
                    'key': option.key,   // 缓存key
                    'data': option.data,     // 缓存值
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'setStorageSync'){
                        if(typeof option.success === "function"){
                            option.success(e.data);
                        }
                    }
                }
            },
            getStorageSync:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb"){
                    return;
                }
                my.postMessage({
                    'functionName': 'getStorageSync',
                    'key': option.key,   // 缓存key
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'getStorageSync'){
                        if(typeof option.success === "function"){
                            option.success(e);
                        }
                    }
                }
            },
            removeStorageSync:function(option){
                var client = APP_TOOLS.isWechatClient();
                if(client != "zfb"){
                    return;
                }
                my.postMessage({
                    'functionName': 'removeStorageSync',
                    'key': option.key,   // 缓存key
                });
                my.onMessage = function(e) {
                    if(e.functionName === 'removeStorageSync'){
                        if(typeof option.success === "function"){
                            option.success(e);
                        }
                    }
                }
            },
            backToHomePage:function(){
                var client = APP_TOOLS.isWechatClient();
                if(client=='zfb' && window.ap){
                    window.location.href = "../index.html"
                }else if(client=='hcz' && window.hczApp){
                    //好车主
                    var hczApp = window.hczApp || {};
                    hczApp.CallNative('{"MethodName":"popSelfVC"}')
                }else if(client=='cez'){
                    //车e族
                    if (window.iOSInfo) {
                        //iOS调用
                        window.webkit.messageHandlers.finishFromJs.postMessage(null)
                    } else if (window.scApp) {
                        // Android 调用
                        window.scApp.finishFromJs()
                    }
                }else {
                    window.location.href = "../index.html"
                }
            }
        };
        return TD_TOOLS;
    }

    if(typeof(TD_TOOLS) === 'undefined'){
        window.TD_TOOLS = define_library();
    }
    else{
        console.log("TD_TOOLS already defined.");
    }
})(window);

