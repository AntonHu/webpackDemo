import '@/styles/meeting/livevodPC.scss';

var VIDEO_TYPE = [1, 2, 3, 4, 5, 6, 7];
var ifVideo = (messageId) => {
    for (var i = 0; i < VIDEO_TYPE.length; i++) {
        if (VIDEO_TYPE[i] == messageId) {
            return true;
        }
    }
    return false;
};
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
if (!isPC()) window.location.replace('./livevod.html');

var Livevod = React.createClass({
    getInitialState: function (){
        this.timer = null;
        this.API_GET_HISTORY = APP_CONFIG.APP_SERVICE + "front/conference/getShowList";   // 获取历史推送消息
        this.API_GET_CURRENT = APP_CONFIG.APP_SERVICE + "front/conference/getShow";   // 获取当前推送消息
        
        return {
            url: '',
            ifModalShow: false,
            newMessage: { contentJson: { } },
            messageList: []
        };
    },
    componentDidMount: function(){
        var _this = this;
        var id = $.getUrlParam("id") ? $.getUrlParam("id") : "b9097be1ccba4c6ea6b439a69b90676a";
        var url = "https://play.yunxi.tv/livestream/embed-player?id="+id;

    	this.setState({
    		url: url
        });
        _this.getHistory();
    },
    getHistory: function() {
        const _this = this;
        $.ajax({
            isRepeated: true,  //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            method: 'POST',
            url: this.API_GET_HISTORY,
            success: function(res) {
                if(res.status == 1 && res.data) {
                    let newMessage = { contentJson: { } };
                    const reverseArr = res.data.reverse();
                    for (var i = 0; i < reverseArr.length; i++) {
                        const id = reverseArr[i].contentJson.id;
                        if (ifVideo(id)) {
                            _this.showModal();
                            newMessage = reverseArr[i];
                            break;
                        }
                    }
                    _this.setState({
                        newMessage: newMessage,
                        messageList: reverseArr
                    });
                    setInterval(() => {
                        _this.getCurrent();
                    }, 5000);
                }
            }.bind(this),
            error: function() {

            }
        });
    },
    getCurrent: function() {
        const _this = this;
        $.ajax({
            isRepeated: true,  //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            method: 'POST',
            url: this.API_GET_CURRENT,
            success: function(res) {
                if(res.status == 1 && res.data && res.data.id) {
                    if (_this.state.newMessage.contentJson.content != res.data.content) {
                        _this.setState({
                            newMessage: { contentJson: res.data },
                            messageList: [{ contentJson: res.data }].concat(_this.state.messageList)
                        }, _this.showModal);
                        
                    }
                }
            }.bind(this),
            error: function(){
            }
        });
    },
    hideModal: function() {
        this.setState({
            ifModalShow: false
        });
    },
    showModal: function() {
        var _this = this;
        this.setState({
            ifModalShow: true
        }, function() {
            if (_this.timer) {
                clearTimeout(_this.timer);
            }
            _this.timer = setTimeout(function() {
                _this.hideModal();
            }, 60000);
        });
    },

    render: function() {
        const _this = this;
        const data = _this.state.newMessage.contentJson;
        return(
            <div id="page-meeting-livevod">
                <div className="container">
                    <iframe className="main-livevod-box" src={this.state.url} frameborder="0" scrolling="no" noresize></iframe>

                    {
                        data.id ? (
                            <div id="messageModal" className="message-modal" style={{
                                right: this.state.ifModalShow ? '30px' : -483 * document.body.clientWidth / 1920 + 'px',
                                transition: 'ease-in-out 1s'
                            }}>
                                <img className="message-modal-close-img" 
                                    onClick={this.state.ifModalShow ? this.hideModal : this.showModal} 
                                    src={APP_CONFIG.STATIC_URL + (this.state.ifModalShow ? 'wechat/images/active/meeting/close_image.png' : 'wechat/images/active/meeting/open_image.png')} />
                                <img className="message-modal-main-img" src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/video' + data.id + '.png'} />
                            </div>
                        ): null
                    }
                </div>
            </div>
        )
    }
})

ReactDOM.render(
    <Livevod />,
    document.getElementById('app')
)