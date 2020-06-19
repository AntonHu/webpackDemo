/*
 * @文件描述: 驿公里新品发布会邀请活动
 * @作者: CZY
 * @Date: 2020-05-28 17:31:59
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-19 11:18:49
 */

import '@/styles/meeting/index.scss';
//审核状态
var RESULT_TYPE = {
    RESULT_NORMAL: -1, //常规
    RESULT_CHECK: 0, //审核中
    RESULT_SUCCESS: 1, //审核通过
    RESULT_FAIL: 2 //审核拒绝
};

(function () {
    $.ajax({
        isRepeated: true, //设置true时，不需要获取sessionId
        xhrFields: {
            withCredentials: true
        },
        cache: false,
        crossDomain: true,
        url: APP_CONFIG.APP_SERVICE + 'share/wxShare/shareConfig',
        data: { pageUrl: window.location.href },
        success: function (res) {
            if (APP_TOOLS.isWechatClient() != 'wx' && APP_TOOLS.isWechatClient() != 'else') {
                return;
            }

            wx.config({
                debug: false,
                appId: res['appid'],
                timestamp: res['timestamp'],
                nonceStr: res['noncestr'],
                signature: res['signature'],
                jsApiList: ['getLocation', 'openLocation']
            });

            wx.error(function (res) {});
        }
    });
})();

var Index = React.createClass({
    getInitialState: function () {
        this.API_GetByOpenId = APP_CONFIG.APP_SERVICE + 'weixin/distribute/getByOpenId'; //根据用户openId获取用户信息
        this.API_FindByMobileOrSave = APP_CONFIG.APP_SERVICE + 'weixin/distribute/findByMobileOrSave'; //根据手机号匹配，匹配到则更新openid，匹配不到新增一条
        this.API_FindDistributeById = APP_CONFIG.APP_SERVICE + 'weixin/distribute/findDistributeById'; //根据短信跳转链接中的id和签名获取用户信息
        this.API_GetLiveTime = APP_CONFIG.APP_SERVICE + 'common/parameters/code'; //根据短信跳转链接中的id和签名获取用户信息

        return {
            openId: '1kmxc',
            distributeInfo: {},
            type: RESULT_TYPE.RESULT_NORMAL,

            meetingInfo: {
                f_name: '杭州国际博览中心',
                f_lat: '30.229506',
                f_lng: '120.238787',
                f_address: '杭州国际博览中心大宴会厅'
            },
            hotelInfo: {
                f_name: '明豪国际酒店',
                f_lat: '30.202719',
                f_lng: '120.203062',
                f_address: '江南大道558号'
            }
        };
    },
    componentDidMount: function () {
        var id = $.getUrlParam('id');
        var sign = $.getUrlParam('sign');
        if (id && sign) {
            //短信推送入口
            $.showLoading();

            this.openId = '1kmxc';
            //默认登录1kmxc用户
            APP_TOOLS.getOpenidAndLogin({
                openId: this.openId,
                suc: function (data) {
                    this.verifyStartLive();
                    this.findDistributeById(id, sign);
                }.bind(this),
                err: function (e) {
                    $.hideLoading();
                    $.alert('网络异常，请重试');
                }
            });
        } else {
            $.showLoading();
            APP_TOOLS.getOpenidAndLogin({
                suc: function (res) {
                    this.state.openId = APP_TOOLS.getOpenId();

                    this.verifyStartLive();
                    this.getDistributeByOpenId();
                }.bind(this),
                err: function () {
                    this.state.openId = APP_TOOLS.getOpenId();

                    this.verifyStartLive();
                    this.getDistributeByOpenId();
                }.bind(this),
                forceLogin: false
            });
        }
    },
    //判断是否已开始直播
    verifyStartLive: function () {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.API_GetLiveTime,
            data: { code: 'Activity.meeting.date' },
            success: function (res) {
                if (res.status == 1 && res.data && res.data.f_value) {
                    var value = res.data.f_value.replace(/-/g, '/');
                    if (value) {
                        var startDate = new Date(value).getTime(),
                            nowDate = new Date().getTime();
                        if (nowDate >= startDate) {
                            window.location.href = './livevod.html';
                        }
                    }
                }
            }.bind(this),
            error: function () {}
        });
    },

    //短信通知入口查询信息
    findDistributeById: function (id, sign) {
        var opts = {
            f_id: id,
            f_sign: sign
        };
        $.ajax({
            isRepeated: true, //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.API_FindDistributeById,
            data: opts,
            success: function (res) {
                $.hideLoading();
                if (res.status == '1') {
                    this.setState({
                        distributeInfo: res.data,
                        type: res.data.f_status
                    });
                }
            }.bind(this),
            error: function () {
                $.hideLoading();
            }
        });
    },
    //微信直接扫码入口查询信息
    getDistributeByOpenId: function () {
        $.ajax({
            isRepeated: true, //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.API_GetByOpenId,
            data: { f_openid: this.state.openId },
            success: function (res) {
                $.hideLoading();
                if (res.status == '1' && res.data) {
                    this.setState({
                        distributeInfo: res.data,
                        type: res.data.f_status
                    });
                }
            }.bind(this),
            error: function () {
                $.hideLoading();
            }
        });
    },

    stopPropagation: function (e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    },
    submit: function () {
        var name = $('#name-input').val();
        var phone = $('#phone-input').val();
        var companyName = $('#companyName-input').val();
        // var position = $("#position-input").val();
        var role = $.getUrlParam('role');
        var partner = $('#partner-input').val();

        if (name == '') {
            $.alert('姓名不能为空');
            return;
        } else if (!/^(1)[0-9]{10}$/.test(phone)) {
            $.alert('您的手机号有误');
            return;
        } else if (companyName == '') {
            $.alert('公司名称不能为空');
            return;
        }
        // else if (position == ""){
        //     $.alert("公司职位不能为空");
        //     return;
        // }

        $.showLoading();
        var opts = {
            f_openid: this.state.openId,
            f_name: name,
            f_mobile: phone,
            f_company_name: companyName
            // f_company_position: position
        };
        if (role == 1) {
            opts.f_role = 'VIP用户';
        }
        if (partner) {
            opts.f_partner = partner;
        }
        $.ajax({
            isRepeated: true, //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.API_FindByMobileOrSave,
            data: opts,
            success: function (res) {
                $.hideLoading();
                if (res.status == '1') {
                    $('.dialog-modal').fadeIn();

                    this.setState({
                        distributeInfo: res.data,
                        type: res.data.f_status
                    });
                } else {
                    $.msgTip(res.info);
                }
            }.bind(this),
            error: function () {
                $.hideLoading();
                $.msgTip('网络异常');
            }
        });
    },
    playNavigation: function (type) {
        var info = {};
        if (type == 1) {
            info = this.state.meetingInfo;
        } else {
            info = this.state.hotelInfo;
        }
        var opts = {
            latitude: parseFloat(info.f_lat), // 纬度，浮点数，范围为90 ~ -90
            longitude: parseFloat(info.f_lng), // 经度，浮点数，范围为180 ~ -180。
            name: info.f_name, // 位置名
            address: info.f_address, // 地址详情说明
            scale: 13, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: 'https://www.1kmxc.com/' // 在查看位置界面底部显示的超链接,可点击跳转
        };

        TD_TOOLS.openLocation(opts);
    },
    gotoLivevod: function () {
        window.location.href = './livevod.html';
    },

    render: function () {
        var type = this.state.type;
        var distributeInfo = this.state.distributeInfo;
        return (
            <div className="page">
                <div className="bg-wrapper">
                    <img
                        width="100%"
                        src="https://source.1kmxc.com/static-web-new/wechat/images/active/meeting/main_bg.png"
                    />
                </div>
                {type == RESULT_TYPE.RESULT_NORMAL && (
                    <div className="resultNormal">
                        <div className="resultNormal-wrapper">
                            <div className="title">报名已结束,感谢您的支持！</div>
                        </div>
                        <div className="schedule-wrapper">
                            <div className="title" style={{ visibility: 'hidden' }}>
                                —— 发布会日程 ——
                            </div>
                            <div className="schedule-content" style={{ visibility: 'hidden' }}>
                                <div className="subtitle">
                                    <div className="subtitle-label">
                                        <div>会</div>
                                        <div>场</div>
                                        <div>签</div>
                                        <div>到：</div>
                                    </div>
                                    <div className="subtitle-value">09:00-10:00</div>
                                </div>
                                <div className="subtitle">
                                    <div className="subtitle-label">
                                        <div>发</div>
                                        <div>布</div>
                                        <div>会：</div>
                                    </div>
                                    <div className="subtitle-value">10:00-11:30</div>
                                </div>
                                <div className="subtitle">
                                    <div className="subtitle-label">
                                        <div>互</div>
                                        <div>动</div>
                                        <div>交</div>
                                        <div>流：</div>
                                    </div>
                                    <div className="subtitle-value">11:30-12:00</div>
                                </div>
                            </div>
                            <div className="tip">
                                <div>如未能到现场</div>
                                <div onClick={this.gotoLivevod}>
                                    您还可以<span className="line">观看现场直播视频</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {type != RESULT_TYPE.RESULT_NORMAL && (
                    <div className="main-wrapper">
                        <div className="info-wrapper">
                            <div className="info-box">
                                <div className="title">嘉宾信息</div>
                                <div className="subtitle">
                                    {distributeInfo.f_name + '   ' + distributeInfo.f_mobile}
                                </div>
                                {type == RESULT_TYPE.RESULT_SUCCESS ? (
                                    <div>
                                        <div
                                            className="subtitle"
                                            style={{ display: distributeInfo.f_seat_num ? '' : 'none' }}
                                        >
                                            发布会现场座位： {distributeInfo.f_seat_num}
                                        </div>
                                        <div
                                            className="subtitle"
                                            onClick={this.playNavigation.bind(this, 2)}
                                            style={{ display: distributeInfo.f_eat_status == 1 ? '' : 'none' }}
                                        >
                                            住宿/就餐：<span className="address">{distributeInfo.f_street}</span>
                                            <i className="iconfont nav_img">&#xe646;</i>
                                        </div>
                                    </div>
                                ) : null}
                                {type == RESULT_TYPE.RESULT_CHECK ? (
                                    <div className="subtitle">正在等待工作人员安排和通知</div>
                                ) : null}
                                {type == RESULT_TYPE.RESULT_FAIL ? (
                                    <div className="subtitle">由于参加人员较多，未能安排现场发布会</div>
                                ) : null}
                            </div>
                            <button className="btn" onClick={this.playNavigation.bind(this, 1)}>
                                导航到会场
                            </button>
                        </div>
                        <div className="schedule-wrapper">
                            <div className="title">—— 发布会日程 ——</div>
                            <div className="schedule-content">
                                <div className="subtitle">
                                    <div className="subtitle-label">
                                        <div>会</div>
                                        <div>场</div>
                                        <div>签</div>
                                        <div>到：</div>
                                    </div>
                                    <div className="subtitle-value">09:00-10:00</div>
                                </div>
                                <div className="subtitle">
                                    <div className="subtitle-label">
                                        <div>发</div>
                                        <div>布</div>
                                        <div>会：</div>
                                    </div>
                                    <div className="subtitle-value">10:00-11:30</div>
                                </div>
                                <div className="subtitle">
                                    <div className="subtitle-label">
                                        <div>互</div>
                                        <div>动</div>
                                        <div>交</div>
                                        <div>流：</div>
                                    </div>
                                    <div className="subtitle-value">11:30-12:00</div>
                                </div>
                            </div>
                            <div className="tip">
                                <div>如未能到现场，请提前告知工作人员；</div>
                                <div onClick={this.gotoLivevod}>
                                    您还可以<span className="line">观看现场直播视频</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Dialog type={this.state.type} />
            </div>
        );
    }
});

var Dialog = React.createClass({
    onSure: function () {
        $('.dialog-modal').fadeOut();
    },
    render: function () {
        var type = this.props.type;

        return (
            <div className="dialog-modal">
                {type == RESULT_TYPE.RESULT_SUCCESS ? (
                    <div className="dialog-wrapper">
                        <img src="https://source.1kmxc.com/static-web-new/wechat/images/active/meeting/main_success_tip.png" />
                        <div className="title">确定参加</div>
                        <div className="subtitle">
                            嘉宾席位预约成功，发布会将于6月17日在杭州国际博览中心举行，请安排好您的行程以免错过精彩时刻。
                        </div>
                        <div className="btn" onClick={this.onSure}>
                            确定
                        </div>
                    </div>
                ) : null}
                {type == RESULT_TYPE.RESULT_CHECK ? (
                    <div className="dialog-wrapper">
                        <img src="https://source.1kmxc.com/static-web-new/wechat/images/active/meeting/main_loading_tip.png" />
                        <div className="title">等待安排</div>
                        <div className="subtitle">
                            感谢您的关注，因为参加人员较多，工作人员会尽量安排现场名额，我们会第一时间通知您。
                        </div>
                        <div className="btn" onClick={this.onSure}>
                            确定
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
});

ReactDOM.render(<Index />, document.getElementById('app'));
