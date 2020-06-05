(function(window){
    'use strict';

    function define_library(){
        var DD_TOOLS = {
            //配置
            setupConfig:function(callback){
                this.setupDDconfig(callback);
            },
            //获取用户信息
            setupUser:function(callback){
                this.setupDDuser(callback);
            },
            //设置抬头名称
            setHeadTitle:function(title){
                if(typeof(dd) === 'undefined')
                    return;

                dd.ready(function () {
                    dd.biz.navigation.setTitle({
                        title : title,
                        onSuccess : function(result) {},
                        onFail : function(err) {}
                    });
                }.bind(this))
            },
            setMenuTitle:function(title, showed, successCallback){
                if(typeof(dd) === 'undefined')
                    return;

                dd.ready(function (){
                    dd.biz.navigation.setRight({
                        show: showed,//控制按钮显示， true 显示， false 隐藏， 默认true
                        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
                        text: title,//控制显示文本，空字符串表示显示默认文本
                        onSuccess : function(result) {
                            successCallback();
                        },
                        onFail : function(err) {}
                    })
                });
            },
            setMenuList:function(menuList, successCallback){
                if(typeof(dd) === 'undefined')
                    return;

                dd.ready(function () {
                    dd.biz.navigation.setMenu({
                        backgroundColor : "#ffffff",
                        textColor : "#3333311",
                        items : menuList,
                        onSuccess: function(data) {
                            successCallback(data);
                        }.bind(this),
                        onFail: function(err) {
                            alert('error: ' + JSON.stringify(err));
                        }.bind(this)
                    });
                });
            },
            //预览图片
            previewImage:function(urls, current){
                if(typeof(dd) === 'undefined')
                    return;

                dd.ready(function () {
                    dd.biz.util.previewImage({
                        urls: urls,
                        current: current,
                    });
                });
            },
            //上传图片
            uploadImage:function(callback, multiple, max){
                if(typeof(dd) === 'undefined')
                    return;

                dd.ready(function () {
                    dd.biz.util.uploadImage({
                        multiple: multiple? multiple: true, //是否多选，默认false
                        max: max? max: 12, //最多可选个数
                        onSuccess : function(result) {
                            //onSuccess将在图片上传成功之后调用
                            if(callback!=null){
                                callback(result);
                            }
                        },
                        onFail : function() {
                        }
                    })
                });
            },
            //上传文件
            uploadFile: function(callback){
                if(typeof(dd) === 'undefined')
                    return;

                dd.ready(function(){
                    dd.biz.util.openLocalFile({
                        url: '', //本地文件的url
                        onSuccess : function(result) {
                            //onSuccess将在图片上传成功之后调用
                            if(callback!=null){
                                callback(result);
                            }
                        },
                        onFail : function() {}
                    })
                })
            },
            //获取当前定位
            geolocation: function(successCallback,errorCallback){
                if(this.isPC()){
                    if(successCallback!=null){
                        successCallback('isPc');
                    }
                }else{
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function () {
                        dd.device.geolocation.get({
                            targetAccuracy : 200,
                            withReGeocode : true,
                            onSuccess : function(result) {
                                if(successCallback!=null){
                                    successCallback(result);
                                }
                            },
                            onFail : function(err) {
                                if(errorCallback){
                                    errorCallback(err)
                                }
                            }
                        });
                    });
                }
            },
            //获取地址
            maplocation: function(lnglat, successCallback,errorCallback){
                if(this.isPC()){

                }else{
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function () {
                        dd.biz.map.locate({
                            latitude: lnglat[1], // 纬度
                            longitude: lnglat[0], // 经度
                            onSuccess: function (result) {
                                if(successCallback!=null){
                                    successCallback(result);
                                }
                                // {
                                //     province: 'xxx', // POI所在省会
                                //     provinceCode: 'xxx', // POI所在省会编码
                                //     city: 'xxx', // POI所在城市
                                //     cityCode: 'xxx', // POI所在城市
                                //     adName: 'xxx', // POI所在区名称
                                //     adCode: 'xxx', // POI所在区编码
                                //     distance: 'xxx', // POI与设备位置的距离
                                //     postCode: 'xxx', // POI的邮编
                                //     snippet: 'xxx', // POI的街道地址
                                //     title: 'xxx', // POI的名称
                                //     latitude: 39.903578, // POI的纬度
                                //     longitude: 116.473565, // POI的经度
                                // }
                            },
                            onFail: function (err) {
                                if(errorCallback){
                                    errorCallback(err)
                                }
                            }
                        });
                    });
                }
            },
            showmapview: function(name, lng, lat){
                if(this.isPC()){

                }else{
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function () {
                        dd.biz.map.view({
                            latitude: lat, // 纬度
                            longitude: lng, // 经度
                            title: name // 地址/POI名称
                        });
                    })
                }
            },
            share: function(url, title, content, imgUrl, suc, err){
                if(this.isPC()){

                }else{
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function () {
                        dd.biz.util.share({
                            type: 0,//分享类型，0:全部组件 默认；1:只能分享到钉钉；2:不能分享，只有刷新按钮
                            url: url,
                            title: title,
                            content: content,
                            image: imgUrl,
                            onSuccess : function() {
                                //onSuccess将在调起分享组件成功之后回调
                                if(typeof suc === 'function') suc();
                            },
                            onFail : function(err) {
                                if(typeof err === 'function') err(err);
                            }
                        })
                    })
                }
            },
            //弹出选择联系人/群会话弹窗
            pickConversation: function(callback, callbackFail){
                if(typeof(dd) === 'undefined')
                    return;

                var corpid = APP_TOOLS.getCookie('YGL_corpid')
                dd.ready(function() {
                    dd.biz.chat.pickConversation({
                        corpId: corpid, //企业id
                        isConfirm:'true', //是否弹出确认窗口，默认为true
                        onSuccess : function(data) {
                            //onSuccess将在选择结束之后调用
                            // 该cid和服务端开发文档-普通会话消息接口配合使用，而且只能使用一次，之后将失效
                            /*{
                                cid: 'xxxx',
                                title:'xxx'
                            }*/
                            if(callback!=null){
                                callback(data);
                            }
                        },
                        onFail : function() {
                            dd.ready(function() {
                                dd.device.notification.alert({
                                    message: '发送失败',
                                    title: '',
                                    onSuccess: function(){
                                        if(callbackFail!=null){
                                            callbackFail()
                                        }
                                    },
                                    onFail: function(){
                                        if(callbackFail!=null){
                                            callbackFail()
                                        }
                                    }
                                })
                            })
                        }
                    })
                })
            },
            //选人与部门
            chooseUser: function(cb, cbFail){
                var corpid = APP_TOOLS.getCookie('YGL_corpid')
//              if(this.isPC()){
//                  if(typeof(dd) === 'undefined')
//                      return;
//
//                  dd.ready(function(){
//                      dd.biz.contact.choose({
//                          multiple: false, //是否多选： true多选 false单选； 默认true
//                          users: [], //默认选中的用户列表，员工userid；成功回调中应包含该信息
//                          corpId: corpid, //企业id
//                          max: 10, //人数限制，当multiple为true才生效，可选范围1-1500
//                          onSuccess: function(data) {
//                              /* data结构
//                                [{
//                                  "name": "张三", //姓名
//                                  "avatar": "http://g.alicdn.com/avatar/zhangsan.png" //头像图片url，可能为空
//                                  "emplId": '0573', //员工userid
//                                 },
//                                 ...
//                                ]
//                              */
//                              if(cb!=null){
//                                  cb(data);
//                              }
//                          },
//                          onFail : function(err) {
//                              dd.ready(function() {
//                                  dd.device.notification.alert({
//                                      message: typeof err == 'string'? err: JSON.stringify(err),
//                                      title: '',
//                                      onSuccess: function(){
//                                          if(cbFail!=null){
//                                              cbFail()
//                                          }
//                                      },
//                                      onFail: function(){
//                                          if(cbFail!=null){
//                                              cbFail()
//                                          }
//                                      }
//                                  })
//                              })
//                          }
//                      });
//                  })
//              }else{
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function () {
                        dd.biz.contact.complexPicker({
                            title: "请选择人员",            //标题
                            corpId: corpid,              //企业的corpId
                            multiple: false,            //是否多选
                            limitTips: "最多可选10人",          //超过限定人数返回提示
                            maxUsers: 1000,            //最大可选人数
                            pickedUsers: [],            //已选用户
                            pickedDepartments: [],          //已选部门
                            disabledUsers: [],            //不可选用户
                            disabledDepartments: [],        //不可选部门
                            requiredUsers: [],            //必选用户（不可取消选中状态）
                            requiredDepartments: [],        //必选部门（不可取消选中状态）
                            appId: 166143202,              //微应用的Id
                            permissionType: "GLOBAL",          //选人权限，目前只有GLOBAL这个参数
                            responseUserOnly: true,        //返回人，或者返回人和部门
                            startWithDepartmentId: 0 ,   // 0表示从企业最上层开始，IOS不支持该字段
                            onSuccess: function(result) {
                                /**
                                {
                                    selectedCount:1,                              //选择人数
                                    users:[{"name":"","avatar":"","emplId":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），emplId（用户工号）三个字段
                                    departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
                                }
                                */
                                if(cb!=null){
                                    cb(result.users);
                                }
                            },
                            onFail : function(err) {
                                dd.ready(function() {
                                    dd.device.notification.alert({
                                        message: typeof err == 'string'? err: JSON.stringify(err),
                                        title: '',
                                        onSuccess: function(){
                                            if(cbFail!=null){
                                                cbFail()
                                            }
                                        },
                                        onFail: function(){
                                            if(cbFail!=null){
                                                cbFail()
                                            }
                                        }
                                    })
                                })
                            }
                        });
                    })
//              }
            },
            //发ding
            postDing: function(users, title, taskId, img, text, mainText, cb, cbFail){
                var corpid = APP_TOOLS.getCookie('YGL_corpid')
                if(this.isPC()){
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function(){
                        dd.biz.ding.post({
                            users : users, //用户列表，userid[]
                            corpId: corpid, //加密的企业id
                            type: 2, //钉类型 1：image  2：link
                            alertType: 2, //钉提醒类型 0：电话, 1：短信, 2：应用内
                            alertDate: {"format":"yyyy-MM-dd HH:mm","value":APP_TOOLS.getDateFormat(new Date().setMinutes(new Date().getMinutes()+1), 'Y-M-D H:I')}, //钉提醒时间
                            attachment: {
                                title: title, //附件的标题
                                url: APP_CONFIG.TASK_SYSTEM_URL+ 'index.html#/taskDetail/'+ taskId, //附件点击后跳转url
                                image: img, //附件显示时的图片 【可选】
                                text: text //附件显示时的消息体 【可选】
                            },
                            text: mainText, //消息体
                            onSuccess : function() {
                                if(cb!=null){
                                    cb();
                                }
                            },
                            onFail : function() {
                                dd.ready(function() {
                                    dd.device.notification.alert({
                                        message: '非常抱歉，@消息发送失败',
                                        title: '@消息发送失败',
                                        onSuccess: function(){
                                            if(cbFail!=null){
                                                cbFail()
                                            }
                                        },
                                        onFail: function(){
                                            if(cbFail!=null){
                                                cbFail()
                                            }
                                        }
                                    })
                                })
                            }
                        })
                    })
                }else{
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function () {
                        dd.biz.ding.create({
                            users : users,// 用户列表，工号[]
                            corpId: corpid, // 企业id
                            type: 2, // 附件类型 1：image  2：link
                            alertType: 2, // 钉发送方式 0:电话, 1:短信, 2:应用内
                            alertDate: {"format":"yyyy-MM-dd HH:mm","value":APP_TOOLS.getDateFormat(new Date().setMinutes(new Date().getMinutes()+1), 'Y-M-D H:I')},
                            attachment: {
                                title: title, //附件的标题
                                url: APP_CONFIG.TASK_SYSTEM_URL+ 'index.html#/taskDetail/'+ taskId, //附件点击后跳转url
                                image: img, //附件显示时的图片 【可选】
                                text: text //附件显示时的消息体 【可选】
                            },
                            text: mainText,  // 正文
                            bizType :0, // 业务类型 0：通知DING；1：任务；2：会议；
//                          confInfo:{
//                              bizSubType:0, // 子业务类型如会议：0：预约会议；1：预约电话会议；2：预约视频会议；（注：目前只有会议才有子业务类型）
//                              location:'某某会议室' , //会议地点；（非必填）
//                              startTime:{"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"},// 会议开始时间
//                              endTime:{"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"}, // 会议结束时间
//                              remindMinutes:30, // 会前提醒。单位分钟-1：不提醒；0：事件发生时提醒；5：提前5分钟；15：提前15分钟；30：提前30分钟；60：提前1个小时；1440：提前一天；
//                              remindType:2 // 会议提前提醒方式。0:电话, 1:短信, 2:应用内
//                          },
//                       
//                          taskInfo:{
//                              ccUsers: ['100', '101'], // 抄送用户列表，工号
//                              deadlineTime:{"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"} , // 任务截止时间
//                              taskRemind:30// 任务提醒时间，单位分钟0：不提醒；15：提前15分钟；60：提前1个小时；180：提前3个小时；1440：提前一天；
//                          },
                         
                            onSuccess : function() {
                                 //onSuccess将在点击发送之后调用
                                if(cb!=null){
                                    cb();
                                }
                            },
                            onFail : function() {
                                dd.ready(function() {
                                    dd.device.notification.alert({
                                        message: '非常抱歉，@消息发送失败',
                                        title: '@消息发送失败',
                                        onSuccess: function(){
                                            if(cbFail!=null){
                                                cbFail()
                                            }
                                        },
                                        onFail: function(){
                                            if(cbFail!=null){
                                                cbFail()
                                            }
                                        }
                                    })
                                })
                            }
                        })
                    })
                }
            },
            toast: function(text, type){
                if(this.isPC()){
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function(){
                        dd.device.notification.toast({
                            icon: type? type: "information", //toast的类型 alert, success, error, warning, information, confirm
                            text: text, //提示信息
                            duration: 2, //显示持续时间，单位秒，最短2秒，最长5秒
                            delay: 0, //延迟显示，单位秒，默认0, 最大限制为10
                            onSuccess : function(result) {
                                /*{}*/
                            },
                            onFail : function(err) {}
                        })
                    })
                }else{
                    if(typeof(dd) === 'undefined')
                        return;

                    dd.ready(function () {
                        dd.device.notification.toast({
                            icon: '', //icon样式，有success和error，默认为空 0.0.2
                            text: text, //提示信息
                            duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                            delay: 0, //延迟显示，单位秒，默认0
                            onSuccess : function(result) {
                                /*{}*/
                            },
                            onFail : function(err) {}
                        })
                    });
                }
            },
            confirm: function(text, cb, title){
                if(typeof(dd) === 'undefined')
                    return;
                
                dd.ready(function () {
                    dd.device.notification.confirm({
                        message: text,
                        title: title? title: '提示',
                        buttonLabels: ['确认', '取消'],
                        onSuccess : function(result) {
                            //onSuccess将在点击button之后回调
                            /*
                            {
                                buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
                            }
                            */
                            if(result.buttonIndex == 0){
                                if(cb!=null){
                                    cb()
                                }
                            }
                        },
                        onFail : function(err) {
                            
                        }
                    });
                });
            },

            //钉钉配置
            setupDDconfig: function(callback){
                $.ajax({
                    url: APP_CONFIG.DING_SIGNATURE_API + '?url='+ window.location.href,
                    cache: false,
                    success: function(config){
                        APP_TOOLS.setCookie('YGL_corpid', config.corpid, 1)
                        dd.config({
                            agentId: APP_CONFIG.PARTNER_APP,
                            corpId: config.corpid,
                            timeStamp: config.timestamp,
                            nonceStr: config.noncestr,
                            signature: config.signature,
                            jsApiList: [
                                'biz.user.get',
                                'biz.navigation.setTitle',
                                'biz.util.openLocalFile',
                                'biz.util.uploadImage',
                                'biz.util.previewImage',
                                'device.geolocation.get',
                                'biz.map.locate',
                                'biz.map.view',
                                'biz.contact.choose',
                                'biz.chat.pickConversation',
                                'biz.ding.create',
                                'biz.ding.post',
                                'biz.contact.complexPicker',
                                'device.notification.alert',
                                'device.notification.confirm'
                            ]
                        });
                    }.bind(this)
                });
            },

            //钉钉用户信息
            setupDDuser: function(callback){
                $.ajax({
                    url: APP_CONFIG.DING_SIGNATURE_API + '?url='+ window.location.href,
                    cache: false,
                    success: function(config){
                        APP_TOOLS.setCookie('YGL_corpid', config.corpid, 1)
                        dd.config({
                            agentId: APP_CONFIG.PARTNER_APP,
                            corpId: config.corpid,
                            timeStamp: config.timestamp,
                            nonceStr: config.noncestr,
                            signature: config.signature,
                            jsApiList: [
                                'biz.user.get',
                                'biz.navigation.setTitle',
                                'biz.util.openLocalFile',
                                'biz.util.uploadImage',
                                'biz.util.previewImage',
                                'device.geolocation.get',
                                'biz.map.locate',
                                'biz.map.view',
                                'biz.contact.choose',
                                'biz.chat.pickConversation',
                                'biz.ding.create',
                                'biz.ding.post',
                                'biz.contact.complexPicker',
                                'device.notification.alert',
                                'device.notification.confirm'
                            ]
                        });
                        dd.ready(function() {
                            dd.biz.user.get({
                                onSuccess: function (info) {
                                    console.log('userGet success: ' + JSON.stringify(info));
                                    window.localStorage.setItem("dd_userid", info.emplId)
                                    window.localStorage.setItem("dd_username", info.nickName)

                                    if(callback!=null){
                                        callback(info);
                                    }
                                }.bind(this),
                                onFail: function (err) {
                                    console.log('dd error: ' + JSON.stringify(err));
                                    $.toast('获取用户信息失败user', 'text')
                                }
                            });
                        }.bind(this));

                        dd.error(function(err) {
                            console.log('dd error: ' + JSON.stringify(err));
                            $.toast('获取用户信息失败ready', 'text')
                        });
                    }.bind(this)
                });
            },
            isPC: function(){
                var sUserAgent = navigator.userAgent.toLowerCase(),
                    bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
                    bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
                    bIsMidp = sUserAgent.match(/midp/i) == "midp",
                    bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
                    bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
                    bIsAndroid = sUserAgent.match(/android/i) == "android",
                    bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
                    bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                    return false;
                }else {
                    return true;
                }
            },
            isPcSideBar: function(){
                return /index-ddleft.html/.test(window.location.href);
            },
        };
        return DD_TOOLS;
    }

    if(typeof(DD_TOOLS) === 'undefined'){
        window.DD_TOOLS = define_library();
    }
    else{
        console.log("DD_TOOLS already defined.");
    }
})(window);
