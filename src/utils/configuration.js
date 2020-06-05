(function(window){
    'use strict';

    function define_library(){
        var APP_CONFIG = {
            APPID_QP : "wx525c1aa33476c7d9",  //壳牌华北小程序id
            APP_SERVICE : "https://api-test.1kmxc.com/appservice/",
            WECHAT2_APP_URL : "https://wechat-test.1kmxc.com/",
            STATIC_URL : "https://source.1kmxc.com/static-web-new/",
            HOME_STATIC : "https://home-static.1kmxc.com/",     //本地服务器静态文件目录
            IMG_URL : "https://source.1kmxc.com/",
            IMG_BIG_URL : "https://source.1kmxc.com/Big/",
            PINGAN_URL : "https://icore-vass-client-stg1.pingan.com/",   //平安好车主的域名
            BPPC_URL : "https://ppst02.bppc.com.cn",  //中油BP的域名
            ZJZSY_URL : "http://hos.dev.zjzsyxs.com/portal.html?pageName=washCarDeatail&data=", //浙江中石油订单页链接
        };
        return APP_CONFIG;
    }

    if(typeof(APP_CONFIG) === 'undefined'){
        window.APP_CONFIG = define_library();
    }
    else{
        console.log("APP_CONFIG already defined.");
    }
})(window);
