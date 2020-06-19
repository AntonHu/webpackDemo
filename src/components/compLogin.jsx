/** 接口 */
var COMP_LOGIN_INTERFACE = {
    LOGIN: APP_CONFIG.APP_SERVICE + 'auth/wx/login',
    GET_CODE: APP_CONFIG.APP_SERVICE + 'weixin/sms/sendAuthCodeChange'
};

/** 公用请求方法 */
var comp_login_sendRequest = function (option) {
    $.showLoading('加载中...');
    $.ajax({
        isRepeated: true, //设置true时，不需要获取sessionId
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        url: option.url,
        type: option.method,
        data: option.data,
        success: function (res) {
            $.hideLoading();
            option.suc && typeof option.suc === 'function' && option.suc(res);
        },
        error: function (e) {
            $.hideLoading();
            option.fail && typeof option.fail === 'function' && option.fail(e);
        }
    });
};

var CompLogin = React.createClass({
    getInitialState: function () {
        return {
            ifCodeSend: true, // 验证码是否可点击
            codeTime: 60, // 验证码倒计时
            username: '', // 账号 手机号
            code: '' // 验证码
        };
    },
    componentDidMount: function () {
        this.getCodeStatus();
    },
    // 获取验证码获取状态 60s 倒计时是否结束
    getCodeStatus() {
        var _this = this,
            timestamp = (Date.parse(new Date()) * 1) / 1000, // 当前时间戳
            min = 60 - (timestamp - tools.getCookie('codeMin')); // 当前剩余倒计时
        if (min > 0 && min < 60) {
            _this.setState(
                {
                    codeTime: min,
                    ifCodeSend: false
                },
                _this.countTimer
            );
        }
    },
    // 点击登录按钮
    clickLogin() {
        this.props.clickLogin && this.props.clickLogin();
    },
    // 取消登录
    handleCancel() {
        this.props.handleCancel && this.props.handleCancel();
    },
    // 登录
    submitLogin: function () {
        var _this = this;
        var phone = _this.state.username;
        var code = _this.state.code;

        this.clickLogin();

        if (!/^(1)[0-9]{10}$/.test(phone)) {
            $.msgTip('请输入正确的手机号');
        } else if (code == '') {
            $.msgTip('验证码不能为空');
        } else {
            var successHandler = function (res) {
                if (res.status == '1') {
                    tools.setCookie('w_userid', res.data.f_id);
                    _this.props.handleLogin && _this.props.handleLogin();
                } else {
                    $.msgTip(res.info);
                }
            };
            var failedHandler = function (err) {
                $.msgTip('链接异常，请重试');
            };
            comp_login_sendRequest({
                url: COMP_LOGIN_INTERFACE.LOGIN,
                data: {
                    openId: tools.getCookie('w_openid'),
                    mobile: phone,
                    smsCode: code
                },
                method: 'POST',
                suc: successHandler,
                fail: failedHandler
            });
        }
    },
    // 发送验证码
    sendCode: function () {
        var _this = this;
        if (!_this.state.ifCodeSend) return;

        var phone = _this.state.username;
        if (!/^(1)[0-9]{10}$/.test(phone)) {
            $.msgTip('请输入正确的手机号');
            return false;
        }

        var successHandler = function (res) {
            if (res.status == 1) {
                var timestamp = (Date.parse(new Date()) * 1) / 1000;
                tools.setCookie('codeMin', timestamp);
                _this.countTimer();
            } else {
                $.msgTip(res['info']);
            }
        };
        comp_login_sendRequest({
            url: COMP_LOGIN_INTERFACE.GET_CODE,
            data: {
                tel: phone
            },
            method: 'GET',
            suc: successHandler
        });
    },
    // 验证码计时
    countTimer: function () {
        var _this = this;
        var timestamp = (Date.parse(new Date()) * 1) / 1000,
            min = 60 - (timestamp - tools.getCookie('codeMin'));

        if (min <= 0) {
            this.setState({
                ifCodeSend: true,
                codeTime: 60
            });
        } else {
            this.setState({
                ifCodeSend: false,
                codeTime: min
            });
            setTimeout(function () {
                _this.countTimer();
            }, 1000);
        }
    },
    // 绑定输入框数据
    handleInputChange(type, e) {
        var _this = this;
        _this.setState({
            [type]: e.target.value
        });
    },
    render() {
        var state = this.state;
        var props = this.props;
        return (
            <div id="comp-login">
                <div className="comp-login-header">
                    {
                        // 登录弹窗标题
                        props.title && <div className="comp-login-title">{props.title}</div>
                    }
                    {
                        // 登录弹窗提示
                        props.tips && (
                            <div className="comp-login-tips">
                                {props.tips.map(function (item) {
                                    return <div>{item}</div>;
                                })}
                            </div>
                        )
                    }
                </div>
                <div className="comp-login-container">
                    <div className="comp-login-row">
                        <img
                            className="comp-login-row-icon-phone"
                            src="https://source.1kmxc.com/static-web-new/wechat/images/active/paidCollect/phone-image.png"
                        />
                        <input
                            maxLength="11"
                            value={state.username}
                            onChange={this.handleInputChange.bind(this, 'username')}
                            className="comp-login-input-phone"
                            placeholder="请输入手机号"
                        />
                    </div>
                    <div className="comp-login-row">
                        <img
                            className="comp-login-row-icon-code"
                            src="https://source.1kmxc.com/static-web-new/wechat/images/active/paidCollect/verifyCode-image.png"
                        />
                        <input
                            maxLength="6"
                            value={state.code}
                            onChange={this.handleInputChange.bind(this, 'code')}
                            className="comp-login-input-code"
                            placeholder="请输入验证码"
                        />
                        <div
                            style={!state.ifCodeSend ? { color: '#ddd' } : {}}
                            onClick={this.sendCode}
                            className="comp-login-codeBtn"
                        >
                            {state.ifCodeSend ? '获取验证码' : '重新获取(' + state.codeTime + 's)'}
                        </div>
                    </div>
                </div>
                <div className="comp-login-footer">
                    <div className="comp-login-btn-cancel" onClick={this.handleCancel}>
                        取消
                    </div>
                    <div className="comp-login-btn-submit" onClick={this.submitLogin}>
                        登录
                    </div>
                </div>
            </div>
        );
    }
});
