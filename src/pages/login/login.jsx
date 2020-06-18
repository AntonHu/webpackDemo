$(function() {
    FastClick.attach(document.body);
});
var Login = React.createClass({
    getInitialState:function(){
        this.LOGIN_API = APP_CONFIG.APP_SERVICE +"auth/wx/login";
        this.ZFB_LOGIN_API = APP_CONFIG.APP_SERVICE +"auth/ali/login";
        this.SENDCODE_API = APP_CONFIG.APP_SERVICE +"weixin/sms/sendAuthCodeChange";
        this.AGREEMENT_API = APP_CONFIG.APP_SERVICE + 'weixin/user/updateUserAttentionStatus';        //是否阅读并同意服务协议隐私政策

        var openId = APP_TOOLS.getOpenId();
        var backUrl = decodeURIComponent($.getUrlParam("url"));
        if(!backUrl|| backUrl == ""|| backUrl == "null"){
            backUrl = "https://wechat.1kmxc.com/mycenter/index.html";
        }
        return {
            "url": backUrl,
            "openid":openId,
            "codeSent": false,
            "showAgreementModal": false,
            "showPrivacyAgreement": false,
            subSource: '-1',
        };
    },
    componentDidMount: function() {
        var that = this;
        APP_TOOLS.isEnvClient(function(env){
            that.client = env.client;
            that.source = env.source;
            that.miniApp = env.miniApp;
            that.third = env.third;

            if(that.client === 'zfb' && that.miniApp && that.source === 'xkz'){
                my.postMessage({'functionName': 'getSessionId'});
                my.onMessage = function(e) {
                    that.setState({
                        openid: e.sessionId
                    })
                    APP_TOOLS.getThirdUserInfo(e.sessionId, function(){
                        that.updateAgreement();
                    }, function(){})
                }
            }
        });

        $(this.refs.content).css("min-height", $(window).height() - 100);
        this.getCodeStatus();
        
        var subSource = this.getURLSource(this.state.url, "source");
        this.state.subSource = subSource;
        this.modalPopstate();

        this.setState()
    },

    getURLSource:function(url,par){
        if(url){
            var urlsearch = url.split('?');
            if(urlsearch && urlsearch.length > 1){
                pstr = urlsearch[1].split('&');
                for (var i = pstr.length - 1; i >= 0; i--) {
                    var tep = pstr[i].split("=");
                    if(tep[0] == par){
                        return tep[1];
                    }
                }
            }
        }
        
        return null;
    },
    //modal控制
    modalPopstate:function(){
        var title = this.state.subSource == 'shell'?"壳牌华北智能洗车":"驿公里智能";
        if(APP_TOOLS.isWechatClient() == "zfb"&& window.ap){
            ap.setNavigationBar({
                title: title
            });
        }else{
            document.title = title;
        }


        if(window.location.href.indexOf("agreementModal") > 0|| window.location.href.indexOf("privacyAgreement") > 0){
            window.history.back()
            if(APP_TOOLS.isWechatClient() == "zfb"&& window.ap){
                ap.setNavigationBar({
                    title: title
                });
            }else{
                document.title = title;
            }
            this.setState({
                showAgreementModal: false,
                showPrivacyAgreement: false
            })
        }
        window.addEventListener("popstate", function() {
            //服务协议
            if(APP_TOOLS.isWechatClient() == "zfb"&& window.ap){
                ap.setNavigationBar({
                    title: title
                });
            }else{
                document.title = title;
            }
            if(window.location.href.indexOf("agreementModal") > 0){
                if(APP_TOOLS.isWechatClient() == "zfb"&& window.ap){
                    ap.setNavigationBar({
                        title: '服务协议'
                    });
                }else{
                    document.title = '服务协议';
                }
                this.setState({
                    showAgreementModal: true
                })
            }else{
                this.setState({
                    showAgreementModal: false
                })
            }
            //隐私政策
            if(window.location.href.indexOf("privacyAgreement") > 0){
                if(APP_TOOLS.isWechatClient() == "zfb"&& window.ap){
                    ap.setNavigationBar({
                        title: '隐私政策'
                    });
                }else{
                    document.title = '隐私政策';
                }
                this.setState({
                    showPrivacyAgreement: true
                })
            }else{
                this.setState({
                    showPrivacyAgreement: false
                })
            }
        }.bind(this));
    },
    submitLogin: function(){
        var phone = $(this.refs.phone).val();
        var code = $(this.refs.code).val();

        if (!/^(1)[0-9]{10}$/.test(phone)) {
            $.alert("您的手机号有误");
        } else if (code == ""){
            $.alert("验证码不能为空");
        } else {
            $.showLoading("登录中...");

            var client = APP_TOOLS.isWechatClient();
            if(client == 'zfb' || client==='gdMap'){
                this.loginByZFB(phone, code);
            }else if(client == 'hcz' || client == 'cez'){
                this.loginByWX(phone, code, 'third_type');
            }else{
                this.loginByWX(phone, code, '');
            }
        }
    },
    loginByWX:function(phone, code, type){
        $.ajax({
            isRepeated: true,  //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.LOGIN_API,
            data: {"openId": this.state.openid,"mobile":phone,"smsCode":code, 'loginType':type},
            success: function (res) {
                if (res.status == "1") {
                    $.hideLoading();
                    this.updateAgreement();
                } else {
                    $.hideLoading();
                    $.alert(res.info);
                }
            }.bind(this)
        })
    },
    loginByZFB:function(phone, code){
        $.ajax({
            isRepeated: true,  //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.ZFB_LOGIN_API,
            data: {"userId": this.state.openid,"mobile":phone,"smsCode":code},
            success: function (res) {
                if (res.status == "1") {
                    $.hideLoading();
                    this.updateAgreement();
                } else {
                    $.hideLoading();
                    $.alert(res.info);
                }
            }.bind(this)
        })
    },
    //阅读并同意服务协议隐私政策
    updateAgreement:function() {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            cache:false,
            url: this.AGREEMENT_API,
            data:{"f_attention_status":1},
            success: function(res){
                if(res.status == 1){
                    $.toast("登录成功");
                    window.location.replace(this.state.url);
                }
            }.bind(this)
        })
    },
    getCodeStatus : function(){
        var min = tools.getCookie("codeMin"),
            timestamp = Date.parse(new Date())*1 / 1000;
        if (timestamp - min < 60) {
            this.setState({"codeSent":true});
            $(this.refs.codeBtn).css("color","rgba(0,0,0,0.3)");
            this.countDown();
        }
    },
    sendCode: function(){
        if (this.state.codeSent) { return false }

        var phone = $(this.refs.phone).val();
        if (!/^(1)[0-9]{10}$/.test(phone)) {
            $.alert("您输入的手机号有误!!");
            return false;
        }

        this.setState({"codeSent":true});
        $(this.refs.codeBtn).css("color","rgba(0,0,0,0.3)");

        $.ajax({
            isRepeated: true,  //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.SENDCODE_API,
            data: {"tel": phone},
            success: function (res) {
                if (res.status == 1) {
                    var timestamp = Date.parse(new Date())*1 /1000;
                    tools.setCookie("codeMin", timestamp);
                    timestamp = Date.parse(new Date())
                    
                    this.countDown();
                } else {
                    this.setState({"codeSent":false});
                    $(this.refs.codeBtn).css("color","rgba(0,0,0,0.54)");
                    $.alert(res['info']);
                }
            }.bind(this)
        })
    },
    countDown: function(){
        var btn = $(this.refs.codeBtn),
            timestamp=Date.parse(new Date())*1 /1000,
            min = 60 - ( timestamp - tools.getCookie("codeMin") );

        if (min <= 0) {
            btn.html("获取验证码");
            this.setState({"codeSent":false});
            $(this.refs.codeBtn).css("color","rgba(0,0,0,0.54)");
        } else {
            btn.html(min + "秒后重新获取");
            setTimeout(function () {
                this.countDown();
            }.bind(this), 1000)
        }
    },

    render: function(){
        // style
        var titleStyle = {color:"rgba(0,0,0,0.54)", textAlign:"center", paddingTop:"35px",fontSize:"20px"};
        var inputWrapper = {padding:"5px 15px"};
        var inputLabel = {color:"rgba(0,0,0,0.87)", fontSize:"16px", width:"80px"};
        var inputStyle = {color:"rgba(0,0,0,0.87)", fontSize:"14px", lineHeight:"44px", height:"44px"};
        var btnWrapper = {marginTop:"20px",padding:"0 15px"};
        var codeBtnStyle = {fontSize:"12px",lineHeight:"20px"};
        
        var agreementModal = [], privacyAgreement = [];
        if(this.state.showAgreementModal){
            agreementModal = [<AgreementModal source={this.state.subSource}/>]
        }
        if(this.state.showPrivacyAgreement){
            privacyAgreement = [<PrivacyAgreement source={this.state.subSource}/>]
        }
        return(
            <div>
                <div ref="content">
                    <div style={titleStyle}>手机号登录</div>
                    <div className="weui_cells weui_cells_form">
                        <div className="weui_cell" style={inputWrapper}>
                            <div className="weui_cell_hd"><label className="weui_label" style={inputLabel}>手机号</label></div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input ref="phone" className="weui_input" type="tel" placeholder="请输入手机号" style={inputStyle} />
                            </div>
                        </div>
                    </div>
                    <div className="weui_cells weui_cells_form" style={{marginTop:"-1px"}}>
                        <div className="weui_cell weui_vcode" style={inputWrapper}>
                            <div className="weui_cell_hd"><label className="weui_label" style={inputLabel}>验证码</label></div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input ref="code" className="weui_input" type="number" placeholder="请输入验证码" style={inputStyle}/>
                            </div>
                            <div className="weui_cell_ft">
                                <div ref="codeBtn" style={codeBtnStyle} onClick={this.sendCode}>获取验证码</div>
                            </div>
                        </div>
                    </div>
                    <div style={btnWrapper}>
                        <a href="javascript:;" className="weui_btn weui_btn_primary" style={{fontSize:"16px",lineHeight:"42px", background:'#fdd903', color:'#333'}} onClick={this.submitLogin}>登录</a>
                    </div>
                </div>
                <div style={{padding:"0 15px"}}><AgreementBtm /></div>
                {this.state.subSource=="shell"||this.state.subSource=="-1"? "" : <AgreementPopup /> }
                {agreementModal}
                {privacyAgreement}
            </div>
        )
    }
});

ReactDOM.render(
    <Login />,
    document.getElementById('app')
);
