(function ($) {
    $.msgTip = function (txt, t, callback) {
        var _tip = '<div class="_msgTip"><p>'+txt+'</p></div>';
        $('body').append(_tip);

        var time = 1800;
        if(typeof t === 'number') time = t;
        clearTimeout(window.msgTipTimeout);

        var msgTip = $("._msgTip");
        msgTip.css({
            'position':'fixed',
            'text-align':'center',
            'z-index':9998,
            'color':'#fff',
            'left':0,
            'right':0,
            'bottom':0,
            'top':0,
            'width':'100%',
            'height':'100%',
            'overflow':'hidden'
        });
        msgTip.find('p').css({
            'font-size':'14px',
            'background':'rgba(0,0,0,.8)',
            'padding':'10px 20px',
            'width':'55%',
            'border-radius':'10px',
            'margin':'65% auto 0',
            'position':'relative',
            'z-index':9999
        });

        window.msgTipTimeout = setTimeout(function () {
            msgTip.fadeOut(function (){
                msgTip.remove();
                toCallback();
            });
        }, time);
        msgTip.on('click', function (){
            var _t = $(this);
            _t.fadeOut(function (){
                _t.remove();
                clearTimeout(window.msgTipTimeout);
                toCallback();
            });
        });

        function toCallback(){
            if(typeof t === 'function'){
                t();
            }else if(typeof callback === 'function'){
                callback();
            }
        }
    }
    $.msgBottomTip = function (txt, t, callback) {
        var _tip = '<div class="_msgBottomTip"><p>'+txt+'</p></div>';
        $('body').append(_tip);

        var time = 1800;
        if(typeof t === 'number') time = t;
        clearTimeout(window.msgBottomTipTimeout);

        var msgBottomTip = $("._msgBottomTip");
        msgBottomTip.css({
            'position':'absolute',
            'text-align':'center',
            'z-index':9998,
            'color':'#fff',
            'left':0,
            'right':0,
            'bottom':0,
            'top':0,
            'width':'100%',
            'height':'100%',
            'overflow':'hidden'
        });
        msgBottomTip.find('p').css({
            'font-size':'14px',
            'background':'rgba(0,0,0,.8)',
            'padding':'10px 20px',
            'width':'50%',
            'border-radius':'10px',
            'bottom':'100px',
            'position':'absolute',
            'margin-left':'calc(50% - 25%)',
            'z-index':9999
        });

        window.msgBottomTipTimeout = setTimeout(function () {
            msgBottomTip.fadeOut(function (){
                msgBottomTip.remove();
                toCallback();
            });
        }, time);
        msgBottomTip.on('click', function (){
            var _t = $(this);
            _t.fadeOut(function (){
                _t.remove();
                clearTimeout(window.msgBottomTipTimeout);
                toCallback();
            });
        });

        function toCallback(){
            if(typeof t === 'function'){
                t();
            }else if(typeof callback === 'function'){
                callback();
            }
        }
    }
    $.showTip = function (title, txt, callback, type) {
        var icon = '\ue643';
        if(type == 'success'){
            icon = '\ue643';
        }
        var _tip = '<div class="_showTip"><div class="iconfont">'+icon+'</div><div class="tipTitle">'+title+'</div><p class="tipTxt">'+txt+'</p></div>';
        $('body').append(_tip);

        var time = 1800;
        if(typeof t === 'number') time = t;
        clearTimeout(window.showTipTimeout);

        var showTip = $("._showTip");
        showTip.css({
            'position':'fixed',
            'text-align':'center',
            'z-index':9998,
            'color':'#fff',
            'left':0,
            'right':0,
            'bottom':0,
            'top':0,
            'width':'200px',
            'height':'135px',
            'background':'rgba(58,58,58,.9)',
            'padding':'20px 15px',
            'margin':'auto',
            'border-radius':'10px',
            'overflow':'hidden'
        });
        showTip.find('.iconfont').css({
            'height':'40px',
            'font-size':'36px',
            'z-index':9999
        });
        showTip.find('.tipTitle').css({
            'height':'24px',
            'font-size':'16px',
            'line-height':'24px',
            'padding':'4px 0',
            'z-index':9999
        });
        showTip.find('.tipTxt').css({
            'height':'20px',
            'font-size':'13px',
            'line-height':'20px',
            'margin-top':'6px',
            'z-index':9999
        });

        window.showTipTimeout = setTimeout(function () {
            showTip.fadeOut(function (){
                showTip.remove();
                toCallback();
            });
        }, time);
        showTip.on('click', function (){
            var _t = $(this);
            _t.fadeOut(function (){
                _t.remove();
                clearTimeout(window.showTipTimeout);
                toCallback();
            });
        });

        function toCallback(){
            if(typeof t === 'function'){
                t();
            }else if(typeof callback === 'function'){
                callback();
            }
        }
    }
    $.showWashLoading = function (txt) {
        if($("._washLoadingDialog").length){
            $.hideWashLoading()
        }
        var _washLoading = '<div class="loading_dialog _washLoadingDialog"><div class="weui_mask loading_mask"></div><div class="weui_dialog loading_dialog loading_content" style="z-index:100;"><img width="100%" src="'+ APP_CONFIG.STATIC_URL + 'wechat/images/autowash/autowash.gif"/><div class="loading_tip">'+ txt +'</div></div>';
        $('body').append(_washLoading);
        
    }
    $.hideWashLoading = function () {
        $('._washLoadingDialog').remove();
    }
    $.yglAlert = function (title, img, txt, btn, callback) {
        var imgDom = img? '<img class="alert-img" src="'+img+'"/>': '';
        var _alert = '<div class="_alert-mask"><div class="alert"><div class="title">'+title+'</div>'+imgDom+'<div class="alert-txt">'+txt+'</div><button class="alert-btn">'+btn+'</button></div></div>';
        $('body').append(_alert);
        
        var alertMask = $("._alert-mask");
        alertMask.css({
            'display': 'flex',
            'display': '-webkit-flex',
            'align-items': 'center',
            'position':'fixed',
            'text-align':'center',
            'z-index':9998,
            'color':'#333',
            'left':0,
            'right':0,
            'bottom':0,
            'top':0,
            'width':'100vw',
            'height':'100vh',
            'background':'rgba(0,0,0,.6)',
            'margin':'auto',
            'overflow':'hidden',
            'opacity': '1',
            'transition': 'all .18s'
        });
        alertMask.find('.alert').css({
            'width': 'calc(100vw - 40px)',
            'margin': 'auto',
            'padding':'15px',
            'background': '#fff',
            'border-radius': '10px',
            'box-sizing': 'border-box'
        });
        alertMask.find('.title').css({
            'font-size':'17px',
            'line-height':'22px',
            'text-align': 'center',
            'padding-bottom':'16px'
        });
        alertMask.find('.alert-img').css({
            'width':'100%',
            'margin':'0 auto 14px',
            'vertical-align': 'top'
        });
        alertMask.find('.alert-txt').css({
            'font-size': '16px',
            'line-height': '22px',
            'text-align': 'center',
            'margin-bottom': '30px'
        });
        alertMask.find('.alert-btn').css({
            'width': '100%',
            'height': '40px',
            'background': '#fdd903',
            'border': 'none',
            'border-radius': '10px',
            'font-size': '17px',
            'line-height': '40px',
            'text-align': 'center',
            'cursor': 'pointer',
            'outline': 'none'
        });
        alertMask.find('.alert-btn').on('click', function (){
            toCallback();
        });

        function toCallback(){
            alertMask.remove();
            if(typeof callback === 'function'){
                callback();
            }
        }
    }
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null){
            return decodeURI(r[2]).replace(/[\r\n\t\b\f]/g, ""); return null;
        }
    }
})(jQuery);


(function(window){
    'use strict';

    function define_library(){
        var APP_TOOLS = {
            /**
             * 判断当前是不是PC设备
             */
            isPC: function() {
                var userAgentInfo = navigator.userAgent;
                var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
                var flag = true;
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            },
            tempShowActive: function(suc, factoryNo){      //是否显示年卡购买入口
                var opts = {};
                if(factoryNo){
                    opts.factoryNo = factoryNo
                }
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    url: APP_CONFIG.APP_SERVICE + 'weixin/activeBuy/findShowCardBannerStatus',
                    data: opts,
                    success:function(res){
                        if(res.status === '1'){
                            var data = res.data;
                            data.status = 0;// 接口返回的数据偶尔会有问题，导致页面显示年卡banner，原因未知，先前端处理掉
                            if(typeof suc === 'function') suc(data);
                        }
                    }.bind(this),
                    error: function(e){
                        
                    }
                });
            },
            getOpenidAndLogin: function (option) {
                var cookie_openid = this.getOpenId();
                if( !option.openId && ( !cookie_openid || cookie_openid==="1kmxc" || cookie_openid === "gzbp" ) ) {
                    this.isEnvClient(function(env) {
                        var client = env.client;
                        var source = env.source;
                        var miniApp = env.miniApp;
                        var cxyToken = $.getUrlParam('token');
                        if( source === 'F6' ) {
                            // F6系统
                            typeof option.err === 'function' && option.err();
                        } else if( source === 'JS_Sinopec' ) {
                            // 江苏石化易捷系统
                            typeof option.err === 'function' && option.err();
                        } else if (
                            cxyToken
                            && ( source==='TL_zfbMini' || source==='TL_gdMini' || source === 'TL_wxMini' ) 
                            && miniApp
                        ) {
                            // 车行易田螺小程序(支付宝、高德、微信小程序)
                            this.getThirdUserInfo('cxy', cxyToken, option.suc, option.err)
                        } else if ( client==='zfb' || client==='gdMap' ) {
                            //支付宝或者高德
                            if ( source == 'xkz' && miniApp ) {
                                //新康众天猫养车小程序
                                //新康众小程序中，如果没有用户信息，不做自动登录，需等用户勾选服务协议后再获取用户信息并登录
                                typeof option.err === 'function' && option.err();
                            } else if ( miniApp ) {
                                //驿公里小程序
                                this.getUserInfoYGL(function(udid) {
                                    option.openId = udid;
                                    this.loginByOpenId(option);
                                }.bind(this));
                            } else {
                                //支付宝网页版
                                var url = window.location.href;
                                var arr = url.split('#/');
                                if(arr && arr.length > 0){
                                    url = arr[0];
                                }
                                window.location.href = APP_CONFIG.APP_SERVICE + "auth/ali/entry?backUrl=" + encodeURIComponent(url);
                            }
                        } else if ( client === 'hcz' ) {
                            //平安好车主
                            this.getHczUuid(function(udid) {
                                option.openId = udid;
                                this.loginByOpenId(option);
                            }.bind(this));
                        } else if ( client === 'cez' ) {
                            //福建车e族
                            this.getCezUuid(function(udid){
                                option.openId = udid;
                                this.loginByOpenId(option);
                            }.bind(this));
                        } else if( client === 'zjrb' ) {
                            // 浙江人保
                            this.getZJRBUserId(option);
                        } else {
                            //微信端网页版、小程序等
                            //获取到openid，先跳转到loginWX.html
                            var url = window.location.href;
                            var arr = url.split('#/');
                            if ( arr && arr.length > 0 ) {
                                url = arr[0];
                            }
                            window.location.href = APP_CONFIG.APP_SERVICE + "weixin/channel/entry2?backUrl=" + encodeURIComponent(url);
                        }
                    }.bind(this));
                } else {
                    var tmp_openid = option.openId || cookie_openid;
                    option.openId = tmp_openid;
                    this.loginByOpenId(option);
                }
            },
            loginByOpenId: function(option){
                var client = this.isWechatClient();
                var url = APP_CONFIG.APP_SERVICE + 'auth/wx/loginByOpenId';
                var opts = {
                    openId: option.openId,
                };

                if ( option.openId === '1kmxc' || option.openid == 'gzbp' ) {
                    login(option);
                } else {
                    this.isEnvClient(function(env) {
                        var client = env.client;
                        var source = env.source;
                        var miniApp = env.miniApp;

                        if (
                            ( source==='TL_zfbMini' || source==='TL_gdMini' || source === 'TL_wxMini' ) 
                            && miniApp
                        ) {
                            //车行易田螺小程序(支付宝、高德、微信小程序)
                            url = APP_CONFIG.APP_SERVICE + 'auth/ali/loginByUserId';
                            opts.userId = option.openId;
                            opts.loginType = 'cxyApp';
                        } else if ( source==='F6' ) {
                            //天猫养车F6
                            opts.userId = option.openId;
                            opts.loginType = 'third_type_f6';
                        } else if ( source==='JS_Sinopec' ) {
                            //江苏石化易捷系统
                            opts.userId = option.openId;
                            opts.loginType = 'jsShihua';
                        } else if ( client==='zfb' || client==='gdMap' ) { //支付宝或者高德
                            url = APP_CONFIG.APP_SERVICE + 'auth/ali/loginByUserId';
                            opts.userId = option.openId;
                            if ( source=='xkz' && miniApp ) { //新康众天猫养车小程序
                                opts.loginType = 'xkzApp';
                            }
                        } else if( client === 'hcz' ) {
                            // 好车主
                            opts.openId = option.openId;
                            opts.loginType = 'third_type';
                        } else if( client === 'cez' ) {
                            // 车e族
                            opts.openId = option.openId;
                            opts.loginType = "cez";
                        }else if( client === 'zjrb' ) {
                            // 浙江人保
                            url = APP_CONFIG.APP_SERVICE + 'auth/app/getInfoByUUID';
                            opts.UUID = option.openId;
                            opts.loginType = 'zjPICC';
                        }

                        login(option);
                    }.bind(this));
                }

                function login(option) {
                    $.ajax({
                        isRepeated: true,  //设置true时，不需要获取sessionId
                        xhrFields: {
                            withCredentials: true
                        },
                        cache: false,
                        crossDomain: true,
                        url: url,
                        data: opts,
                        success: function(res) {
                            if( res.status === '1' ) {
                                //设置sessionId和userId
                                tools.setCookie('w_userid', res.data.f_id);
                                tools.setCookie('jsessionid', res.data.jsessionid);
                                typeof option.suc === 'function' && option.suc(res.data);
                            } else {
                                typeof option.err === 'function' && option.err(res);
                                if ( option.forceLogin ) {
                                    window.location.href = APP_CONFIG.WECHAT2_APP_URL + "login/login.html?openid=" + option.openId + "&url=" + encodeURIComponent(window.location.href);
                                }
                            }
                        }.bind(this),
                        error: function(e) {
                            $.hideLoading();
                            $.alert('网络异常，请重试');
                        }
                    });
                }
            },
            getHczUuid: function(suc) {
                //获取好车主的uuid
                var params = {
                    MethodName: 'getPhoneInfo',
                    Parameters:{
                        jsCallBack: 'onGetPhoneInfo'
                    }
                };
                var hczApp = window.hczApp || {};
                hczApp.CallNative = hczApp.CallNative || function(){};
                window.onGetPhoneInfo = function(data){
                    var udid = data.udid;
                    if(udid){
                        tools.setCookie('w_openid', udid);
                        //重新登录
                        if(typeof suc === "function") suc(udid);
                    }
                }.bind(this)
                hczApp.CallNative(JSON.stringify(params))
            },
            getCezUuid:function(suc){
                //获取车e族的uuid
                var userId = $.getUrlParam("userId"); //车e族客户端
                var platform = $.getUrlParam("platform"); //车e族客户端
                if(userId && platform){
                    tools.setCookie('w_openid', "cheezu_"+userId);

                    if(typeof suc === "function") suc("cheezu_"+userId);
                }else{
                    $.hideLoading();
                    $.alert('信息获取失败，请重新扫码！')
                }
            },
            getZJRBUserId: function(option) {
                var _t = this;
                // 获取浙江人保的uuid
                var uid = $.getUrlParam("uid");
                var code = $.getUrlParam('code');

                if( uid ){
                    if ( !code ) {
                        $.ajax({
                            isRepeated: true,  //设置true时，不需要获取sessionId
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            cache:false,
                            url: APP_CONFIG.APP_SERVICE + "app/zjPICC/getAppAuthCodeUrl",
                            data: { uuid: uid },
                            success: function(res){
                                // 获取第三方app的授权码：1.获取第三方url；2.增加重定向参数；3.调用第三方url；4.重定向后得到code。
                                if(res.status === '1' && res.data){
                                    var originURL = res.data;
                                    var redirect_uri = encodeURIComponent(window.location.href);
                                    window.location.replace(originURL + redirect_uri);
                                    // window.location.replace(window.location.href + '&code=12345678');
                                }else{
                                    $.hideLoading();
                                    $.alert('用户信息获取失败，请退出重试')
                                }
                            }.bind(this),
                            error: function(){
                                $.hideLoading();
                                $.alert('网络异常，请重试')
                                if(typeof err === 'function') err();
                            }
                        })
                    } else {
                        $.ajax({
                            isRepeated: true,  //设置true时，不需要获取sessionId
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            cache:false,
                            url: APP_CONFIG.APP_SERVICE + "/app/zjPICC/getAppUserInfo",
                            data: { 
                                uuid: uid, 
                                code: code 
                            },
                            success: function(res){
                                if(res.status === '1' && res.data){
                                    tools.setCookie('w_openid', res.data.userid);
                                    _t.addThirdUser('zjrb', res.data.userid, res.data.cellPhone, option.suc, option.err);
                                }else{
                                    $.hideLoading();
                                    $.alert('用户信息获取失败，请退出重试');

                                    // tools.setCookie('w_openid', 87654321);
                                    // _t.addThirdUser('zjrb', 87654321, 12345678901, option.suc, option.err);
                                }
                            }.bind(this),
                            error: function(){
                                $.hideLoading();
                                $.alert('网络异常，请重试')
                                if(typeof err === 'function') err();
                            }
                        })
                    }
                }else{
                    $.hideLoading();
                    $.alert('信息获取失败，请重新扫码！')
                }
            },
            getUserInfoYGL: function (suc){
                my.postMessage({'functionName': 'getYGLAuthCode'});
                my.onMessage = function(e) {
                    if(e.functionName === 'getYGLAuthCode'){
                        var udid = e.udid;
                        if(udid){
                            tools.setCookie('w_openid', udid);
                            //重新登录
                            if(typeof suc === "function") suc(udid);
                        }
                    }
                }.bind(this)
            },
            getUserInfoXkz: function (suc){
                my.postMessage({'functionName': 'getSessionId'});
                my.onMessage = function(e) {
                    if(e.functionName === 'getSessionId'){
                        this.getThirdUserInfo('xkz', e.sessionId, suc)
                    }
                }.bind(this)
            },
            //获取第三方账户信息（新康众/车行易）
            getThirdUserInfo: function(source, sessionid, suc, err) {
                var opts = {
                    factoryNo: 'YGL0000038',
                    token: sessionid,
                    openId: source
                };
                $.ajax({
                    isRepeated: true,  //设置true时，不需要获取sessionId
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    cache:false,
                    url: APP_CONFIG.APP_SERVICE + "weixin/user/getThirdUserInfo",
                    data: opts,
                    success: function(res){
                        if(res.status === '1' && res.data){     //获取到用户信息，去添加账号登录
                            if(source === 'xkz'){
                                tools.setCookie('xkz_userid', res.data.ucUserId);
                                this.addThirdUser({
                                    source: 'xkz',
                                    thirdUserId: res.data.ucUserId,
                                    mobile: res.data.userName,
                                    suc: suc,
                                    err: err
                                })
                            }else if(source === 'cxy'){
                                tools.setCookie('cxy_userid', res.data.userId);
                                this.addThirdUser({
                                    source: 'cxy',
                                    thirdUserId: res.data.userId,
                                    mobile: res.data.phone,
                                    suc: suc,
                                    err: err
                                })
                            }
                        }else {
                            $.hideLoading();
                            $.alert('用户信息获取失败，请退出重试');
                        }
                    }.bind(this),
                    error: function(){
                        $.hideLoading();
                        $.alert('网络异常，请重试')
                        if(typeof err === 'function') err();
                    }
                })
            },
            addThirdUser: function(data) {
                //来自第三方平台新用户注册
                var url = APP_CONFIG.APP_SERVICE + "weixin/user/addThirdUser";
                var opts = {
                    f_factory_no: 'YGL0000038'
                };
                
                if(!data.mobile){
                    throw 'addThirdUser：缺少mobile参数';
                }else if(!data.openid&& !data.thirdUserId){
                    throw 'addThirdUser：缺少openid或三方用户id';
                }else if(data.thirdUserId&& !data.source){
                    throw 'addThirdUser：缺少第三方来源';
                }
                if(data.mobile){    // 手机号必传
                    opts.f_username = data.mobile;
                    opts.f_nickname = data.mobile;
                    opts.f_realname = data.mobile;
                    opts.f_phone = data.mobile;
                }
                if(data.openid){      // openid在微信端使用
                    opts.f_openid = data.openid;
                }
                if(data.thirdUserId){     // thirdUserId是第三方用户id，对方有提供，需要保存
                    opts.thirdUserId = data.thirdUserId;
                }
                if(data.source){  // 三方来源，与thirdUserId一起传
                    opts.f_source = data.source;
                    if(data.source === 'xkz'){
                        opts.thirdPay = 1;
                    }else if(data.source === 'cxy'){
                        opts.thirdPay = 2;
                    }else if(data.source === 'F6'){
                        opts.thirdPay = 3;
                    }else if(data.source === 'zjrb') {
                        opts.thirdPay = 4;
                        url = APP_CONFIG.APP_SERVICE + 'app/user/addThirdUser';
                    }else if(data.source === 'JS_Sinopec'){
                        opts.thirdPay = 7;
                    }
                }
                if(data.factoryNo){       // 可以获取到factoryNo的，记录门店factoryNo，没有的默认YGL0000038
                    opts.f_factory_no = data.factoryNo;
                }
                
                $.ajax({
                    isRepeated: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    cache:false,
                    url: url,
                    data: opts,
                    success: function(res){
                        $.hideLoading();
                        if(res.status === '1'){     //账号注册成功，再重新登录
                            if(this.sourceFrom() === 'TL_wxMini'|| this.sourceFrom() === 'TL_zfbMini'|| this.sourceFrom() === 'TL_gdMini' || this.isWechatClient() === 'zjrb' ){
                                this.getOpenidAndLogin({
                                    openId: data.thirdUserId,
                                    suc: data.suc,
                                    err: data.err,
                                })
                            }else if(typeof data.suc === 'function'){
                                data.suc(res);
                            }
                        }else {
                            $.alert('登录失败，请退出重试')
                        }
                    }.bind(this),
                    error: function(err){
                        $.hideLoading();
                        console.log(err);
                        $.alert('网络异常，请重试')
                    }
                })
            },
            getOpenId: function () {
                if ( this.sourceFrom() === 'xkz' ) {     //在新康众小程序中，获取的新康众用户id
                    return tools.getCookie('xkz_userid');
                } else if (
                    this.sourceFrom() === 'TL_wxMini'
                    || this.sourceFrom() === 'TL_zfbMini'
                    || this.sourceFrom() === 'TL_gdMini'
                ) {
                    return tools.getCookie('cxy_userid');
                } else if ( this.sourceFrom() === 'F6' ) {
                    return tools.getCookie('f6_deviceid');
                } else if ( this.sourceFrom() === 'JS_Sinopec' ) {  // 江苏石化
                    return tools.getCookie('jssh_userid');
                } else{
                    return tools.getCookie('w_openid');
                }
            },
            sourceFrom: function() {
                // source第三方来源
                /*
                * xkz: 新康众,
                * TL_wxMini: 田螺微信小程序(车行易), TL_zfbMini:田螺支付宝小程序(车行易), TL_gdMini:田螺高德小程序(车行易),
                * F6: 天猫养车F6系统
                * JS_Sinopec: 江苏石化易捷
                */
                var source = window.sessionStorage.getItem('source_from');
                return source
            },
            setSourceFrom: function(val){
                window.sessionStorage.setItem('source_from', val)
            },
            
            generateUuid: function () {
                var text = "";
                var possible = "RSCtQrycoDLMTUVzdsNOPZpWAhiEXYuv0156FGHIB23efgJKjklmnabwx4q789";
                var seed = Math.floor(new Date().getTime() / 1000);
                for (var i = 0; i < 20; i++){
                    text += possible.charAt((Math.floor(Math.random() * seed)) % possible.length);
                }
                window.localStorage.setItem("uuid", text);
                return text;
            },
            //当前所在软件环境信息
            isEnvClient: function(cb) {
                var isThird = false;
                var client = this.isWechatClient();
                var source = this.sourceFrom();
                if( client==='hcz'
                    || client==='cez'
                    || client === 'zjrb'
                    || source === 'gdMap'
                    || source === 'xkz'
                    || source==='TL_zfbMini'
                    || source==='TL_gdMini'
                    || source === 'TL_wxMini'
                    || source === 'JS_Sinopec'
                ) {
                    isThird = true;
                }
                var envJson = {
                    client: client,        //所在的客户端
                    source: source,     //来源,比如:天猫养车/车行易
                    miniApp: false,
                    third: isThird, //是否在第三方环境
                };
                if(source === 'JS_Sinopec'){
                    // 江苏石化在小程序嵌入iframe引入我们页面，在iframe中无法执行获取是否在小程序环境的方法，所以这里只要是江苏石化的来源，默认都为小程序环境
                    envJson.miniApp = true;
                    if(typeof cb === 'function') cb(envJson);
                }else {
                    this.isMiniProgram(function(isMini) {
                        envJson.miniApp = isMini;
                        if(typeof cb === 'function') cb(envJson);
                    })
                }
            },
            //h5页面的客户端
            isWechatClient: function(){
                var ua = navigator.userAgent.toLowerCase();
                // return 'cez';
                if( /micromessenger/.test(ua) ) {
                    return 'wx';
                }else if( /alipayclient/.test(ua) ) {
                    return 'zfb';
                }else if( /hczios/.test(ua) || /hczandroid/.test(ua) ) {
                    //平安好车主
                    return 'hcz';
                }else if( /scapp-ios-shihua/.test(ua) || /scapp-android-shihua/.test(ua) ) {
                    //福建车e族APP
                    return 'cez';
                }else if( /amapclient/.test(ua) ) {    //高德地图
                    return 'gdMap';
                }else if( /appinfo=piccapp/.test(ua) ) {
                    // 浙江人保APP
                    return 'zjrb';
                }else{
                    return 'else';
                }
            },
            //判断是否是在小程序环境，做不同的跳转操作
            isMiniProgram: function(suc) {
                var client = this.isWechatClient();
                if ( client == "wx" ) {
                    if ( window.wx && window.wx.miniProgram ) {
                        wx.miniProgram.getEnv(function(res) {
                            if ( res.miniprogram ) {
                                typeof suc === 'function' && suc(true);
                            } else  {
                                typeof suc === 'function' && suc(false);
                            }
                        })
                    } else {
                        typeof suc === 'function' && suc(false);
                    }
                } else if ( client == "zfb" || client == "gdMap" ) {
                    if ( window.my ) {
                        my.getEnv(function(res) {
                            if ( res.miniprogram || res.miniProgram ) {
                                typeof suc === 'function' && suc(true);
                            }else{
                                typeof suc === 'function' && suc(false);
                            }
                        })
                    } else {
                        typeof suc === 'function' && suc(false);
                    }
                } else {
                    typeof suc === 'function' && suc(false);
                }
            },

            //1：微信下单 2:app 3:微信小程序  4:支付宝  5:广州APP  6:好车主APP  7:支付宝小程序  8:闸道自动扣款  9:新康众支付宝小程序 11:福建车e族APP  12:车行易小程序
            getOrderSource:function(client, source, miniApp) {
                if(source==='TL_zfbMini'||source==='TL_gdMini'||source === 'TL_wxMini'){
                    return "12";
                }else if(client=="wx" && miniApp){
                    return "3";
                }else if(client=="wx"){
                    return "1";
                }else if(client=="zfb" && miniApp){
                    if(source == "xkz"){
                        return "9";
                    }else{
                        return "7";
                    }
                }else if(client=="zfb"){
                    return "4";
                }else if(client=="hcz"){
                    return "6";
                }else if(client=="cez"){
                    return "11";
                }else{
                    return "0";
                }
            },
            pinganRegionCode: function(){
                return {    //平安方公司编号对应的地区信息
                    247: {id:33, name: '浙江'},    //杭州绍兴
                    212: {id:33, name: '浙江'},    //浙江分公司
                    229: {id:33, name: '浙江'},    //宁波分公司
                    248: {id:33, name: '浙江'},    //温州
                    225: {id:34, name: '安徽'},    //安徽公公司
                }
            },
            setOrderStatus: function (num){
                switch (num){
                    case 0: return '订单已取消';
                        break;
                    case 10: return '服务已创建';
                        break;
                    case 15: return '已退款';
                        break;
                    case 20: return '等待服务';
                        break;
                    case 25: return '待退款';
                        break;
                    case 30: return '服务中';
                        break;
                    case 40: return '待支付';
                        break;
                    case 50: return '已支付';
                        break;
                    case 60: return '服务完成';
                        break;
                    case 99: return '服务暂停';
                        break;
                }
            },
            setPayMethod: function (num){
                switch (num){
                    case 1: return '支付宝';
                        break;
                    case 2: return '微信';
                        break;
                    case 3: return '门店POS刷卡';
                        break;
                    case 4: return '门店现金';
                        break;
                    case 5: return '充值卡';
                        break;
                    case 6: return '移动POS支付';
                        break;
                    case 7: return 'SA 代收现金';
                        break;
                    case 8: return '优惠券';
                        break;
                    case 9: return '套餐抵扣';
                        break;
                    case 10: return '砍价';
                        break;
                    case 11: return '会员折扣';
                        break;
                    case 12: return '充值卡';   //充值赠送金额支付
                        break;
                    case 21: return '支付宝';   //APP支付宝
                        break;
                    case 22: return '微信';  //APP微信
                        break;
                    case 25: return '汽服卡';  //安徽易捷汽服-汽服卡支付
                        break;
                    case 28: return '优惠券';  //安徽易捷汽服-电子券支付
                        break;
                    case 29: return '余额支付';  //台州章鱼出行余额支付
                        break;
                    case 30: return '优惠券';  //台州章鱼出行优惠券支付 
                        break;
                    case 31: return '支付宝';   //app支付宝--直接
                        break;
                    case 32: return '微信';   //app微信支付--直接
                        break;
                    case 33: return '优惠券';   //浙石化洗车券
                        break;
                    case 34: return '洗车金 ';   //浙石化洗车金 
                        break;
                    case 35: return '优惠券';  //兑换码兑换
                        break;
                    case 36: return '优惠券';  //广州易捷电子券支付 
                        break;
                    case 37: return '优惠券';  //车点点优惠券支付 
                        break;
                }
            },
            //优惠券的限制
            getServiceName:function(code, waxingActive, canUse){
                var subTip = '';
                if(waxingActive&& canUse == '1'){     //优惠券可用，且开通1/10元打蜡精洗活动
                    subTip = '（活动期间可用于【打蜡精洗】模式）';
                }
                switch (code){
                    case 'XN000200': return '限【极速快洗】模式使用'+subTip;
                        break;
                    case 'XN000201': return '限【标准普洗】模式使用'+subTip;
                        break;
                    case 'XN000202': return '限【打蜡精洗】模式使用';
                        break;
                    case 'XN000200,XN000201': return '限【极速快洗】【标准普洗】模式使用'+subTip;
                        break;
                    case 'XN000200,XN000202': return '限【极速快洗】【打蜡精洗】模式使用';
                        break;
                    case 'XN000201,XN000202': return '限【标准普洗】【打蜡精洗】模式使用';
                        break;
                }
                return "";
            },
            //壳牌华北优惠券的限制（洗车模式跟正常模式不一致）
            getQiaoPaiServiceName:function(code, waxingActive, canUse){
                var subTip = '';
                if(waxingActive&& canUse == '1'){     //优惠券可用，且开通1/10元打蜡精洗活动
                    subTip = '（活动期间可用于【炫亮精洗】模式）';
                }
                switch (code){
                    case 'XN000200': return '限【标准普洗】模式使用'+subTip;
                        break;
                    case 'XN000201': return '限【打蜡精洗】模式使用'+subTip;
                        break;
                    case 'XN000202': return '限【炫亮精洗】模式使用';
                        break;
                    case 'XN000200,XN000201': return '限【标准普洗】【打蜡精洗】模式使用'+subTip;
                        break;
                    case 'XN000200,XN000202': return '限【标准普洗】【炫亮精洗】模式使用';
                        break;
                    case 'XN000201,XN000202': return '限【打蜡精洗】【炫亮精洗】模式使用';
                        break;
                }
                return "";
            },
            serviceName: function(code){
                switch (code){
                    case 'XN000138': return '智能洗车';
                        break;
                    case 'XN000200': return '极速快洗';
                        break;
                    case 'XN000201': return '标准普洗';
                        break;
                    case 'XN000202': return '打蜡精洗';
                        break;
                }
                return "智能洗车";
            },
            //判断当前模式是否可以使用当前的优惠券（优惠券是否使用当前洗车模式（XN000138的老券都可用））
            verifyServiceUsed:function(ticketCode, modelCode, waxingActive){    //waxingActive是否开启10元打蜡精洗活动
                var isUsed = true;
                if(ticketCode && modelCode && ticketCode!='XN000138'&& modelCode!='XN000138'&& (!waxingActive|| modelCode!='XN000202')){
                    if(ticketCode.indexOf(modelCode) < 0){
                        //避免ticketCode可使用在多种模式的情况
                        isUsed = false;
                    }
                }
                return isUsed;
            },
            checkAutoNo: function(no){
                var autoType = {        //type: 0、无效 1、普通车牌 2、特殊车牌
                    '0': {name: '非法车牌', val:0, type: '0', status: false},
                    '1': {name: '传统普通车牌', val:1, type: '1', status: true},
                    '2': {name: '新能源小型车牌', val:2, type: '1', status: true},
                    '3': {name: '新能源大型车牌', val:3, type: '1', status: true},
                    '4': {name: '警车牌', val:4, type: '2', status: true},
                    '5': {name: '驾校车牌', val:5, type: '2', status: true},
                    '6': {name: '大使馆车牌', val:6, type: '2', status: true},
                    '999': {name: '其他车牌', val:999, type: '2', status: true}
                };
                var result = autoType['0'];
                result.autoWord = no.substr(0,2);
                result.autoStr = no.substr(2);
                if(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[0-9A-Z]{5}$/.test(no)){
                    result = autoType['1'];
                    result.autoWord = no.substr(0,2);
                    result.autoStr = no.substr(2);
                }else if(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[DF]{1}[0-9A-HJ-Z]{1}[0-9]{4}$/.test(no)){
                    result = autoType['2'];
                    result.autoWord = no.substr(0,2);
                    result.autoStr = no.substr(2);
                }else if(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[0-9]{5}[DF]{1}$/.test(no)){
                    result = autoType['3'];
                    result.autoWord = no.substr(0,2);
                    result.autoStr = no.substr(2);
                }else if(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[0-9A-Z]{4}[警]$/.test(no)){
                    result = autoType['4'];
                    result.autoWord = no.substr(0,2);
                    result.autoStr = no.substr(2);
                }else if(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{1}[A-Z]{1}[0-9A-Z]{4}[学]$/.test(no)){
                    result = autoType['5'];
                    result.autoWord = no.substr(0,2);
                    result.autoStr = no.substr(2);
                }else if(/^[使]{1}[0-9]{3}[0-9]{3}$/.test(no)){
                    result = autoType['6'];
                    result.autoWord = no.substr(0,4);
                    result.autoStr = no.substr(4);
                }else if(/^[0-9]{3}[0-9]{3}[使]{1}$/.test(no)){
                    result = autoType['6'];
                    result.autoWord = no.substr(0,3);
                    result.autoStr = no.substr(3);
                }else if(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼领]{1}[A-Z]{1}[0-9A-Z]{4}[A-Z0-9领挂港澳]$/.test(no)){
                    result = autoType['999'];
                    result.autoWord = no.substr(0,2);
                    result.autoStr = no.substr(2);
                }
                return result
            },
            isRest: function(data){
                var hours = tools.getDateFormat(0, 'H'),
                    mins = tools.getDateFormat(0, 'I'),
                    secs = tools.getDateFormat(0, 'S'),
                    week = tools.getDateFormat(0, 'W'),
                    todaySecs = parseFloat(hours *60*60) +parseFloat(mins*60) +parseFloat(secs);
                var workInfo = tools.isJSON(data.f_work_info) ? JSON.parse(data.f_work_info):{},
                    shutDownInfo = workInfo.shutDownInfo? workInfo.shutDownInfo: {},
                    restInfo = workInfo.restInfo? workInfo.restInfo: [],
                    restStatus = workInfo.restStatus? workInfo.restStatus: false,
                    workStatusInfo = {
                        workStatus: '',
                        homeTip: '',
                        washTip: ''
                    };
                if(data.f_work_status){
                    workStatusInfo.workStatus = data.f_work_status;
                    workStatusInfo.homeTip = shutDownInfo.homeTip;
                    workStatusInfo.washTip = shutDownInfo.washTip;
                }else{
                    for(var i=0; i<restInfo.length; i++){
                        var dateEffective = false, timeEffective = false, restInfoItem = restInfo[i],
                            startTimeArr = restInfoItem.startTime? restInfoItem.startTime.split(':'): [0,0],
                            endTimeArr = restInfoItem.endTime? restInfoItem.endTime.split(':'): [0,0],
                            startTime = parseFloat(startTimeArr[0]*60*60) + parseFloat(startTimeArr[1]*60),
                            endTime = parseFloat(endTimeArr[0]*60*60) + parseFloat(endTimeArr[1]*60);
                        if(restInfoItem.startDate&& restInfoItem.startTime){
                            restInfoItem.startDate = restInfoItem.startDate.split(' ')[0] + ' ' + restInfoItem.startTime
                        }
                        if(restInfoItem.endDate&& restInfoItem.endTime){
                            if(startTime*1 > endTime*1){    //第二天恢复运营的,截止日期要增加一天
                                var newEndDate = new Date(new Date(restInfoItem.endDate).setDate(new Date(restInfoItem.endDate).getDate()+1));
                                restInfoItem.endDate = tools.getDateFormat(newEndDate, 'Y-M-D') + ' ' + restInfoItem.endTime;
                            }
                        }
                        if((restInfoItem.startDate&& restInfoItem.endDate&& new Date().getTime() > new Date(restInfoItem.startDate).getTime()&& new Date().getTime() < new Date(restInfoItem.endDate).getTime())||
                            (restInfoItem.startDate&& !restInfoItem.endDate&& new Date().getTime() > new Date(restInfoItem.startDate).getTime())||
                            (!restInfoItem.startDate&& restInfoItem.endDate&& new Date().getTime() < new Date(restInfoItem.endDate).getTime())||
                            (!restInfoItem.startDate&& !restInfoItem.endDate)){
                            dateEffective = true;
                        }
                        if((startTime*1 < endTime*1 && todaySecs > startTime && todaySecs < endTime)||
                            (startTime*1 > endTime*1 && (todaySecs > startTime || todaySecs < endTime))){
                            timeEffective = true;
                        }
                        if(restStatus == '1'&& dateEffective&& timeEffective&& (restInfoItem.invalidWeek&& !new RegExp(week).test(restInfoItem.invalidWeek)|| !restInfoItem.invalidWeek)){
                            workStatusInfo.workStatus = 'rest';
                            workStatusInfo.homeTip = restInfoItem.innerTip ? restInfoItem.innerTip:restInfoItem.homeTip;
                            workStatusInfo.washTip = restInfoItem.washTip;
                            break;
                        }
                    }
                }
                return workStatusInfo
            },

            //百度统计事件
            sendTrackEvent:function(label, timeRecord){
                if(typeof(_hmt) == "undefined")
                    return;

                var time = 0;
                if(timeRecord){
                    //需要加入记录时间的，会重置当前的页面时间
                    var timeStamp = tools.getCookie("trackTimeStamp");
                    if(!timeStamp){
                        timeStamp = (new Date()).getTime();
                    }

                    var nowTime = (new Date()).getTime();
                    time = nowTime - timeStamp;
                    tools.setCookie("trackTimeStamp", nowTime)
                }
                
                _hmt.push(['_trackEvent', "扫码洗车", "按钮点击", label, time]);
            },
            
            // 友盟统计事件
            czcSendTrackEvent: function(category,action,label,value,nodeid){
                if(typeof(_czc) !== 'undefined'){
                    _czc.push(["_trackEvent",category,action,label,value,nodeid]);
                }
            },
            // 百度统计事件
            baiduSendTrackEvent: function(category,action,label,value){
                if(typeof(_hmt) !== 'undefined'){
                    _hmt.push(["_trackEvent",category,action,label,value]);
                }
            },
            
            ownTrackEvent: function(opts){
                if(!opts.f_channel_code){
                    return
                }
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    cache: false,
                    url: APP_CONFIG.APP_SERVICE +"weixin/qrCode/generateLog",
                    data: opts,
                    success: function(res){
                        
                    }
                })
            },
            
            downloadAPP: function () {
                var ua = navigator.userAgent.toLowerCase(); 
                var isIOS = /iphone|ipad|ipod/.test(ua);
                //跳转微下载链接
                if(this.isWechatClient() == 'wx'){
                    if(isIOS){
                        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.haixiu.washcar.android";
                    }else{
                        window.location.href = "https://www.1kmxc.com/app/download.html";
                    }
                }else if(isIOS){
                    window.location.href = "itms-apps://itunes.apple.com/cn/app/%E9%A9%BF%E5%85%AC%E9%87%8C%E6%B4%97%E8%BD%A6/id1279764765?mt=8";
                }else{
                    window.location.href = "https://source.1kmxc.com/static-web-new/app/washapp.apk";
                }
            }
        };
        return APP_TOOLS;
    }

    if(typeof(APP_TOOLS) === 'undefined'){
        window.APP_TOOLS = define_library();
    }
    else{
        console.log("APP_TOOLS already defined.");
    }
})(window);


(function(window){
    'use strict';

    function define_library(){
        var tools = {
            getQuery : function (variable) {
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }
                console.log('Query Variable ' + variable + ' not found');
                return("");
            },
            storage: {
                set: function (key, val){
                    window.localStorage.setItem(key, val);
                },
                get: function (key){
                    return window.localStorage.getItem(key);
                },
                remove: function (key){
                    window.localStorage.removeItem(key);
                }
            },
            setCookie: function (name, value, expiresDays) { //写cookies函数
                var cookieString = name + "=" + escape(value),
                    cookieDir = '/';

                    cookieString = cookieString + "; path=" + cookieDir;

                // 判断是否设置过期时间
                if(expiresDays){
                    var date=new Date();
                    date.setTime(date.getTime + expiresDays*24*3600*1000);
                    cookieString += "; expires=" + date.toGMTString();
                }
                document.cookie = cookieString;
            },
            getCookie: function (name) {
                var strCookie = document.cookie;
                if (strCookie) {
                    var arrCookie = strCookie.split("; ");

                    for( var i = 0; i < arrCookie.length; i ++ ) {
                        var arr = arrCookie[i].split("=");
                        if( arr[0] == name ) return unescape( arr[1] );
                    }
                }
                    
                return "";
            },
            clearCookie: function (name) {  
                this.setCookie(name, "", -1);
            },
            /* JSON转字符串 */
            jsonToString: function (json){
                return JSON.stringify(json);
            },
            /* 字符串转JSON */
            stringToJson: function (str){
                return JSON.parse(str);
            },
            chooseImage:function(option){
                if(!window.FormData) {
                    $.msgTip('你的浏览器不支持异步上传');
                    return;
                }
                var input;
                if(document.getElementById('myUploadInput')){
                    console.log("create111");
                    input = document.getElementById('myUploadInput');
                    input.setAttribute('type', 'file');
                    input.setAttribute('name', 'file');
                    input.setAttribute('accept', option.accept);
                }else{
                    console.log("create222");
                    input = document.createElement('input');
                    input.setAttribute('id', 'myUploadInput');
                    input.setAttribute('type', 'file');
                    input.setAttribute('name', 'file');
                    input.setAttribute('accept', option.accept);
                    document.body.appendChild(input);
                    input.style.display = 'none';
                }
                    
                if(option.multiple){
                    input.setAttribute('multiple', true);
                }
                if(option.maxNum == 1){
                    input.removeAttribute('multiple');
                }

                input.click();
                
                input.onchange = function(){
                    if(!input.value){
                        console.log("input value undefined");
                        // $.msgTip('该文件好像已上传，请选择其他文件！')
                        return ;
                    }
                   
                    if(option.multiple&& option.maxNum && input.files.length > option.maxNum){
                        $.msgTip('本次最多上传'+ option.maxNum +'张');
                        return;
                    }
                    
                    var fd = new FormData(),
                        fileName = [];
                    for(var i=0; i<input.files.length; i++){ 
                        if(option.accept.indexOf('image') != -1){
                            var type = input.files[i].type.split('/').pop();
                            var picType =['jpg','png','jpeg'];
                            if(picType.indexOf(type.toLocaleLowerCase()) == -1){
                                $.msgTip("只能上传"+picType.join('、')+"格式的文件");
                                input.value = "";
                                return
                            }
                        }
                        if(option.maxSize &&  input.files[i].size > option.maxSize * 1024 * 1024){
                            input.value = "";
                            $.msgTip('请上传小于'+option.maxSize+'M的文件');
                            return ;
                        }
                        fd.append('files',input.files[i]);
                        fileName.push(input.files[i].name)
                    }
                    fileName = fileName.join(',');
                    //console.log(fd.getAll('files'));
                    
                    if(option.beforeSend instanceof Function){
                        if(option.beforeSend(input) === false){
                            return ;
                        }
                    }
                    
                    if(option.localFiles instanceof Function){
                        var imgFiles = [];      //本地图片
                        for(var i=0; i<input.files.length; i++){
                            //实例化一个FileReader对象
                            var fileReader = new FileReader();
                            //采用DataURL编码
                            fileReader.readAsDataURL(input.files[i]);
                            //设置FileReader对象初始化
                            fileReader.onload = function (event) {
                                //这块的可以去查HTML的FileReader对象对应的API
                                var imageData = event.target.result;    //本地图片base64编码
                                imgFiles.push(imageData);
                            };
                        }
                        option.localFiles(imgFiles);
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', option.url, true);
                    
                    input.value = "";
                    
                    xhr.onreadystatechange = function(){
                        console.log(fileName);
                        if(xhr.status == 200){
                            if(xhr.readyState == 4){
                                if(option.callback instanceof Function){
                                    option.callback(xhr.responseText,fileName);
                                }
                            }
                        }else{
                            $.msgTip("上传失败！("+JSON.parse(xhr.responseText).info+')');
                            if(typeof option.failUpload == 'function'){
                                option.failUpload(xhr.responseText,fileName);
                            }
                        }
                    };
                    
                    // xhr.upload.onprogress = function(event){
                    //     var pre = Math.floor(100 * event.loaded / event.total);
                    //     if(option.uploading instanceof Function){
                    //         option.uploading(pre);
                    //     }
                    // }
                    
                    xhr.send(fd);
                };
            },
            //两个经纬度之间的距离
            getFlatternDistance:function (lat1,lng1,lat2,lng2){
                var EARTH_RADIUS = 6378137.0;  
                var f = getRad((parseFloat(lat1) + parseFloat(lat2))/2);
                var g = getRad((parseFloat(lat1) - parseFloat(lat2))/2);
                var l = getRad((parseFloat(lng1) - parseFloat(lng2))/2);
                
                var sg = Math.sin(g);
                var sl = Math.sin(l);
                var sf = Math.sin(f);
                
                var s,c,w,r,d,h1,h2;
                var a = EARTH_RADIUS;
                var fl = 1/298.257;
                
                sg = sg*sg;
                sl = sl*sl;
                sf = sf*sf;
                
                s = sg*(1-sl) + (1-sf)*sl;
                c = (1-sg)*(1-sl) + sf*sl;
                
                w = Math.atan(Math.sqrt(s/c));
                r = Math.sqrt(s*c)/w;
                d = 2*w*a;
                h1 = (3*r -1)/2/c;
                h2 = (3*r +1)/2/s;
                
                return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));

                function getRad(d){
                    return d*Math.PI/180.0;
                }
            },
            //是否是json对象
            isJSON: function(str){
                if (typeof str == 'string') {
                    try {
                        var obj=JSON.parse(str);
                        if(typeof obj == 'object' && obj ){
                            return true;
                        }else{
                            return false;
                        }
                    } catch(e) {
                        return false;
                    }
                }
            },
            getDateFormat: function(unix,format, noZero){
                unix = unix == 0 ? Date.parse(new Date()) : unix;
                var week=["天","一","二","三","四","五","六"],
                    date = new Date(unix),
                    d={};
                d['Y'] = date.getFullYear();
                d['M'] = date.getMonth()+1 < 10 && !noZero ? '0' + (date.getMonth()+1) : date.getMonth()+1;
                d['D'] = date.getDate() < 10 && !noZero ? '0' + date.getDate() : date.getDate();
                d['H'] = date.getHours() < 10 && !noZero ? '0' + date.getHours() : date.getHours();
                d['I'] = date.getMinutes() < 10 && !noZero ? '0' + date.getMinutes() : date.getMinutes();
                d['S'] = date.getSeconds() < 10 && !noZero ? '0' + date.getSeconds() : date.getSeconds();
                d['W'] = week[date.getDay()];
                d['Q'] = Math.floor((date.getMonth() + 3) / 3);
        
                format=format.replace(/[Y|M|D|H|I|S|W|Q]/g,function(letter){
                    return d[letter];
                })
                return format;
            },
            getLocalTime: function (nS, format){
                Date.prototype.format = function(format) {
                    var date = {
                        "M+": this.getMonth() + 1,
                        "d+": this.getDate(),
                        "h+": this.getHours(),
                        "m+": this.getMinutes(),
                        "s+": this.getSeconds(),
                        "q+": Math.floor((this.getMonth() + 3) / 3),
                        "S+": this.getMilliseconds()
                    };
                    if(/(y+)/i.test(format)) {
                        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                    }
                    for(var k in date) {
                        if(new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? (date[k].toString().length == 1 ? '0' + date[k] : date[k]) : ('00' + date[k]).substr(('' + date[k]).length));
                        }
                    }
                    return format;
                }

                if(!format) format = 'yyyy-MM-dd';
                if(format === 'all') format = 'yyyy-MM-dd h:m:s';
                return new Date(parseInt(nS)).format(format);
            },
            fixedFloat:function(value){
                if(value){
                    if(value-parseInt(value)==0){
                        return value;
                    }
                    return parseFloat(value).toFixed(2)
                }
                return 0;
            },
        };
        return tools;
    }
    if(typeof(tools) === 'undefined'){
        window.tools = define_library();
    }
    else{
        console.log("tools already defined.");
    }
})(window);

(function(window){
    'use strict';

    function define_library(){
        var GPS = {
            PI : 3.14159265358979324,
            x_pi : 3.14159265358979324 * 3000.0 / 180.0,
            delta : function (lat, lon) {
                // Krasovsky 1940
                //
                // a = 6378245.0, 1/f = 298.3
                // b = a * (1 - f)
                // ee = (a^2 - b^2) / a^2;
                var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
                var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
                var dLat = this.transformLat(lon - 105.0, lat - 35.0);
                var dLon = this.transformLon(lon - 105.0, lat - 35.0);
                var radLat = lat / 180.0 * this.PI;
                var magic = Math.sin(radLat);
                magic = 1 - ee * magic * magic;
                var sqrtMagic = Math.sqrt(magic);
                dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
                dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
                return {'lat': dLat, 'lon': dLon};
            },

            //GPS---高德
            gcj_encrypt : function ( wgsLat , wgsLon ) {
                if (this.outOfChina(wgsLat, wgsLon))
                    return {'latitude': wgsLat, 'longitude': wgsLon};

                var d = this.delta(wgsLat, wgsLon);
                return {'latitude' : parseFloat(wgsLat) + parseFloat(d.lat),'longitude' : parseFloat(wgsLon) + parseFloat(d.lon)};
            },
            outOfChina : function (lat, lon) {
                if (lon < 72.004 || lon > 137.8347)
                    return true;
                if (lat < 0.8293 || lat > 55.8271)
                    return true;
                return false;
            },
            transformLat : function (x, y) {
                var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
                return ret;
            },
            transformLon : function (x, y) {
                var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
                return ret;
            }
        };
        return GPS;
    }

    if(typeof(GPS) === 'undefined'){
        window.GPS = define_library();
    }
    else{
        console.log("GPS already defined.");
    }
})(window);

// cookies https://github.com/js-cookie/js-cookie
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init (converter) {
        function api (key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                return (document.cookie = [
                    key, '=', value,
                    attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                    attributes.path    && '; path=' + attributes.path,
                    attributes.domain  && '; domain=' + attributes.domain,
                    attributes.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var name = parts[0].replace(rdecode, decodeURIComponent);
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                	cookie = cookie.slice(1, -1);
                }

                try {
                    cookie = converter.read ?
                        converter.read(cookie, name) : converter(cookie, name) ||
                        cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {}
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api(key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));


//设置sessionId，若不需要设置sessionId，则data中的isRepeated参数为true即可
(function($){  
    //首先备份下jquery的ajax方法  
    var _ajax=$.ajax;  

    /**
     * 重写jquery的ajax方法 
     * @param { Object } opt {
     *  { boolean } isRepeated 是否需要重新获取session
     * }
     */
    $.ajax=function(opt){
        //请求加入跨域权限
        // opt.xhrFields = {withCredentials: true};
        // opt.crossDomain = true;
        if(opt.isRepeated){
            //不需要重新获取session
            _ajax(opt);
        }else{
            var session_id = tools.getCookie('jsessionid');
            if(session_id){
                opt.complete = function(data){  
                    //请求完成后回调函数 (请求成功或失败之后均调用)
                    if(data && data.responseText){
                        var responseData = JSON.parse(data.responseText);
                        if(responseData.status == -999){
                            //session过期
                            getSessionIdPassedByOpenId(opt)
                        }else if(responseData.status == -9999){
                            //无权限
                            getSessionIdPassedByOpenId(opt)
                            $.msgTip("暂无权限");
                        }
                    }
                }

                _ajax(opt);
            }else{
                getSessionIdPassedByOpenId(opt)
            }
        }
    };

    // 通过openId获取sessionId
    function getSessionIdPassedByOpenId(opt) {

        APP_TOOLS.getOpenidAndLogin({
            suc: function(){_ajax(opt)},
            err: function(res){
                _ajax(opt)
            }
        })
    };
})(jQuery);


