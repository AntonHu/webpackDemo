/*
 * @文件描述: 
 * @作者: CZY
 * @Date: 2020-05-28 17:31:59
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-18 19:49:04
 */
import '@/styles/meeting/livevod.scss';

var QR_CODE_DOM_ID = "qrcode-image";
var VIDEO_TYPE = [1, 2, 3, 4, 5, 6, 7];
/**
 * 判断当前是不是PC设备
 */
const isPC = () => {
    const userAgentInfo = navigator.userAgent;
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
};
if (isPC()) window.location.replace('./livevodPC.html');
var Livevod = React.createClass({
    getInitialState: function () {
        this.API_GET_HISTORY = APP_CONFIG.APP_SERVICE + "front/conference/getShowList";   // 获取历史推送消息
        this.API_GET_CURRENT = APP_CONFIG.APP_SERVICE + "front/conference/getShow";   // 获取当前推送消息
        this.orderStatusTimer = null;
        this.FindLastOrderByUserId_API = APP_CONFIG.APP_SERVICE + 'weixin/order/findLastOrderByUserId';
        this.FindCarStatus_API = APP_CONFIG.APP_SERVICE + 'weixin/washCar/findStatus2';
        this.FindStatusByOrderId_API = APP_CONFIG.APP_SERVICE + 'weixin/order/findStatusByOrderId';     //订单状态

        return {
            url: '',
            client: '', // 环境

            newMessage: { contentJson: {} },
            messageList: [],

            isLogined: false,
            defaultFactoryId: '',
            factoryInfo: {},

            serviceOrderInfo: {},
            orderShow: false,       //标记显示隐藏（用来处理动画效果）
            orderBottom: '60px',

            serviceTime: {
                'XN000138': 8 * 60 * 1000,
                'XN000200': 4 * 60 * 1000,
                'XN000201': 6 * 60 * 1000,
                'XN000202': 8 * 60 * 1000
            },
            curSerTime: 8 * 60 * 1000,
        }
    },
    componentDidMount: function () {
        var _this = this;
        var id = $.getUrlParam("id") ? $.getUrlParam("id") : "b9097be1ccba4c6ea6b439a69b90676a";
        var url = "https://play.yunxi.tv/livestream/embed-player?id=" + id;

        APP_TOOLS.isEnvClient(function (env) {
            this.setState({
                client: env.client,
            }, function () {
                if (env.client === 'wx') {
                    this.shareWX();
                }
            });
        }.bind(this));

        _this.setState({
            url: url
        });
        _this.getHistory();
        this.userLogin();
        if (dd.env.platform !== 'notInDingTalk') this.setShareDD();
    },
    getCurrent: function () {
        const _this = this;
        $.ajax({
            isRepeated: true,  //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            method: 'POST',
            url: this.API_GET_CURRENT,
            success: function (res) {
                if (res.status == 1 && res.data && res.data.content) {
                    if (_this.state.newMessage.contentJson.content != res.data.content) {
                        var newMessage = {
                            dateTime: new Date().getTime(),
                            contentJson: res.data,
                        }
                        _this.setState({
                            newMessage: newMessage,
                            messageList: [newMessage].concat(_this.state.messageList)
                        });
                    }
                }
            }.bind(this),
            error: function () {
            }
        });
    },
    getHistory: function () {
        const _this = this;
        $.ajax({
            isRepeated: true,  //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            method: 'POST',
            url: this.API_GET_HISTORY,
            success: function (res) {
                if (res.status == 1 && res.data) {
                    const reverseArr = res.data.reverse();
                    _this.setState({
                        newMessage: reverseArr.slice(0, 1)[0] || { contentJson: {} },
                        messageList: reverseArr
                    });
                    setInterval(() => {
                        _this.getCurrent();
                    }, 5000);
                }
            }.bind(this),
            error: function () {

            }
        });
    },
    goToImageLive: function () {
        window.location.href = "https://play.yunxi.tv/pages/7b9e25d6099c4a00b68acf6db9c0a271";
    },
    goToVideo: function (id) {
        window.location.href = APP_CONFIG.WECHAT2_APP_URL + "active/meeting/video.html?showmenu=false&id=" + id;
    },
    goToShare: function () {
        if (this.state.client === 'wx') {
            $('#wx-navigation').show();
        } else if (dd.env.platform !== 'notInDingTalk') {
            this.shareDD();
        } else {
            $('#liulanqi-navigation').show();
        }
    },
    hideShare: function () {
        $('#wx-navigation').hide();
        $('#liulanqi-navigation').hide();
    },
    userLogin: function () {
        //判断是否在小程序内
        APP_TOOLS.isEnvClient(function (env) {
            this.client = env.client;
            this.source = env.source;
            this.miniApp = env.miniApp;
            this.third = env.third;

            if (this.client !== 'wx') return;
            if (this.client === 'zfb' && this.miniApp && this.source === 'xkz' && !tools.getCookie('xkz_userid')) {
                this.loginDefaultUserInfo();
            } else {
                APP_TOOLS.getOpenidAndLogin({
                    suc: function (data) {
                        this.setState({
                            isLogined: true,
                        })

                        //登录成功
                        this.findLastOrderByUserId(data.f_id);
                    }.bind(this),
                    err: function () {
                        //登录失败，默认用户登录
                        this.loginDefaultUserInfo();
                    }.bind(this)
                })
            }
        }.bind(this));
    },
    loginDefaultUserInfo: function () {
        this.openId = "1kmxc";

        APP_TOOLS.getOpenidAndLogin({
            openId: this.openId,
            suc: function (data) {
                //设置sessionId和userId
                tools.setCookie('jsessionid', data.jsessionid);
            }.bind(this),
            err: function (e) {
                $.alert('网络异常，请重试')
            }
        })
    },
    setPosition: function () {
        var orderHeight = $('.order-wrapper').innerHeight();
        if (this.state.orderShow) {
            this.setState({
                orderBottom: "60px"
            })
        } else {
            this.setState({
                orderBottom: -orderHeight + 'px'
            });
        }

        //隐藏时在这里处理，否则没有动画效果
        setTimeout(function () {
            if (!this.state.orderShow) {
                $('.order-wrapper').css('display', 'none')
            }
        }.bind(this), 300)
    },
    setOrderShow: function (value) {
        this.state.orderShow = value;
        this.setPosition();
    },
    //查询是否有未完成的订单
    findLastOrderByUserId: function (userId) {
        var opts = {
            userId: userId,
            serviceId: '2002'
        }
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            cache: false,
            crossDomain: true,
            url: this.FindLastOrderByUserId_API,
            data: opts,
            success: function (res) {
                if (res.status == 1 && res.data) {
                    this.orderId = res.data.f_order_id;
                    var orderStatus = res.data.f_status,
                        curSerTime = res.data.f_eshop_flow_no ? this.state.serviceTime[res.data.f_eshop_flow_no] : 8 * 60 * 1000,
                        startTime = res.data.f_appointment_start_time,
                        betweenTime = new Date().getTime() - startTime,   //时间差的毫秒数  
                        isJump = betweenTime / 1000 / 60 > 20 ? false : true;  //订单超过20分钟不查询报警

                    this.state.curSerTime = curSerTime;
                    if (isJump && res.data.f_notice_type != 0) {
                        this.checkMachineStatus(res.data);
                    }
                    if (orderStatus == 30 && isJump) {
                        this.setState({
                            serviceOrderInfo: res.data,
                            orderShow: true,
                        })
                        this.findStatusByOrderId();
                        $('.order-wrapper').css('display', 'block')
                        this.setPosition()
                    }
                }
            }.bind(this),
        });
    },
    findStatusByOrderId: function () {
        this.orderStatusTimer && clearTimeout(this.orderStatusTimer);
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            cache: false,
            crossDomain: true,
            url: this.FindStatusByOrderId_API,
            data: { orderId: this.orderId },
            success: function (res) {
                if (res.status == 1 && res.data) {
                    this.setState({
                        serviceOrderInfo: res.data
                    })
                    if (!(res.data.f_status === 0 || res.data.f_status === 15 || res.data.f_status === 25 || res.data.f_status >= 40)) {
                        this.orderStatusTimer = setTimeout(function () {
                            this.findStatusByOrderId();
                        }.bind(this), 5000);
                    }
                }
            }.bind(this),
            error: function () {
                this.orderStatusTimer = setTimeout(function () {
                    this.findStatusByOrderId();
                }.bind(this), 5000);
            }.bind(this),
        });
    },
    //检测订单是否在待机中
    checkMachineStatus: function (orderData) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            isRepeated: false,
            crossDomain: true,
            cache: false,
            url: this.FindCarStatus_API,
            data: { factoryId: orderData.f_factory_id },
            success: function (res) {
                if (res.status === '1' && res.data) {
                    var waitData = res.data['待机中'],
                        warningData = res.data['报警'],
                        stopData = res.data['停止中'];
                    if (orderData.f_emergency == 1) {
                        //紧急停止
                        if (stopData == '1') {
                            this.setState({
                                serviceOrderInfo: orderData,
                                orderShow: true,
                            })
                        }
                    } else {
                        if (waitData != 1 && warningData == 1) {
                            this.setState({
                                serviceOrderInfo: orderData,
                                orderShow: true,
                            })
                        } else {
                            this.state.orderShow = false;
                        }
                    }
                    this.setPosition()
                }
            }.bind(this),
            error: function (e) {
            }.bind(this)
        });
    },
    //设置微信分享
    shareWX: function (isShowed) {
        TD_TOOLS.initShareConfig({
            title: "你好，未来",
            url: APP_CONFIG.WECHAT2_APP_URL + "active/meeting/livevod.html",
            icon: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/meeting_share_icon.png',
            desc: '驿公里智能新品发布会，共同见证洗车新物种',
            isShowed: isShowed,
            success: function () {
            },
        })
    },
    // 设置钉钉分享
    setShareDD: function() {
        const title = "你好，未来",
            url = APP_CONFIG.WECHAT2_APP_URL  + "active/meeting/livevod.html?showmenu=false",
            desc = '驿公里智能新品发布会，共同见证洗车新物种',
            icon = APP_CONFIG.STATIC_URL + "wechat/images/active/meeting/meeting_share_icon.png";
        dd.biz.navigation.setRight({
            show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
            control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '更多',//控制显示文本，空字符串表示显示默认文本
            onSuccess : function(result) {
                //如果control为true，则onSuccess将在发生按钮点击事件被回调
                DD_TOOLS.share(url, title, desc, icon);
            },
            onFail : function(err) {}
        });
    },
    // 调起钉钉分享
    shareDD: function() {
        const title = "你好，未来",
            url = APP_CONFIG.WECHAT2_APP_URL  + "active/meeting/livevod.html?showmenu=false",
            desc = '驿公里智能新品发布会，共同见证洗车新物种',
            icon = APP_CONFIG.STATIC_URL + "wechat/images/active/meeting/meeting_share_icon.png";
        DD_TOOLS.share(url, title, desc, icon);
    },

    render: function () {
        var _this = this;
        var st = this.state;
        var messageList = st.messageList;
        var ifVideo = (messageId) => {
            for (var i = 0; i < VIDEO_TYPE.length; i++) {
                if (VIDEO_TYPE[i] == messageId) {
                    return true;
                }
            }
            return false;
        };
        return (
            <div id="page-meeting-livevod">
                <div id="wx-navigation" onClick={this.hideShare}>
                    <img src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/share_wx.png'} />
                </div>
                <div id="liulanqi-navigation" onClick={this.hideShare}>
                    <img src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/share_liulanqi.png'} />
                </div>

                <div className="container">
                    <iframe className="main-livevod-box" src={this.state.url} frameborder="0" scrolling="no" noresize></iframe>
                    <div className="detail-box">
                        <div className="title-live-container">
                            <div className="title-content">
                                <div className="left-content">
                                    <div className="title">驿公里智能新品发布会</div>
                                    <div className="subtitle">2020年6月17日 上午10:00</div>
                                </div>
                                <div className="share-btn" onClick={this.goToShare}>
                                    <div className="iconfont">&#xe6ad;</div>
                                    <div>分享</div>
                                </div>
                            </div>
                            <div className="image-live-container" onClick={this.goToImageLive}>
                                <span className="iconfont">&#xe642;</span>
                                {"图片直播 >"}
                            </div>
                        </div>
                        <div id="message-list" className="detail-box-message-list">
                            {messageList.length === 0 && <div className="empty-item">
                                <img className="empty-image" src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/empty_image.png'} />
                                <div className="empty-text">更多精彩，即将发送</div>
                            </div>}
                            {messageList.length > 0 && <div className="message-list-container">
                                {messageList.map(item => {
                                    const data = item.contentJson;
                                    return (
                                        <div className="message-content">
                                            <div className="message-time">{item.dateTime ? tools.getDateFormat(item.dateTime, "H:I") : ''}</div>
                                            <div className="message-item">
                                                {data.content && data.imgUrl && !ifVideo(data.id) && <div className="message-item-mix">
                                                    <img className="message-item-mix-image" src={data.imgUrl} />
                                                    <div className="message-item-mix-text">{data.content}</div>
                                                </div>}
                                                {data.imgUrl && !data.content && <div className="message-item-image">
                                                    <img className="message-item-mix-image" src={data.imgUrl} />
                                                </div>}
                                                {!data.imgUrl && data.content && <div className="message-item-text">
                                                    <div className="message-item-mix-text">{data.content}</div>
                                                </div>}
                                                {data.content && data.imgUrl && ifVideo(data.id) && <div className="message-item-video" onClick={_this.goToVideo.bind(_this, data.id)}>
                                                    <div className="message-item-video-left">
                                                        <img className="message-item-video-image" src={data.imgUrl} />
                                                    </div>
                                                    <div className="message-item-video-right">
                                                        <div className="message-item-video-text">{data.name}</div>
                                                        <div className="message-item-video-btn">{"查看演示 >"}</div>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>}
                        </div>

                        {/* <img width="90%" src='https://source.1kmxc.com/static-web-new/wechat/images/active/meeting/meeting-last-day.jpg' /> */}
                    </div>
                    {st.serviceOrderInfo.f_status == 30 && <div style={{
                        position: 'fixed',
                        bottom: '60px',
                        width: '100%'
                    }}>
                        <ServiceProcessMini orderEntity={st.serviceOrderInfo} fixed={false} />
                    </div>}
                </div>
            </div>
        )
    }
})

ReactDOM.render(
    <Livevod />,
    document.getElementById('app')
)