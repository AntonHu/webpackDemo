import CompVideo from '@/components/compVideo';
import '@/styles/meeting/video.scss';

var VIDEO_LIST = [
    {
        id: 1,
        title: '冬天可洗',
        description:
            '冬日洗车最大的挑战是遇到毛刷结冰，不仅无法正常清洗还可能对车漆造成不可逆的伤害。阿尔法独有的密闭式暖芯系统，可对毛刷内暖自热大幅降低运营成本，让严寒下的冬日洗车成为可能。',
        preImage: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/scene-1.jpg'
    },
    {
        id: 2,
        title: '高场地适应性',
        description:
            '仅有一个冰箱的大小的阿尔法，其场地比龙门机小25%，比隧道机小50%，还能轻松驾驭不同的路面，甚至是石板路。这让它可以方便的进入小区，地下车库等空间有限的地方。',
        preImage: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/scene-2.png',
        video: APP_CONFIG.STATIC_URL + 'wechat/video/meeting/多种路面.mp4'
    },
    {
        id: 3,
        title: '安全避障',
        description:
            '阿尔法新一代安全感知系统可动态感知知周围环境，若遇到障碍物闯入，立即停止，待障碍物离开后继续刷洗，确保安全。',
        preImage: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/scene-3.png',
        video: APP_CONFIG.STATIC_URL + 'wechat/video/meeting/安全避障.mp4'
    },
    {
        id: 4,
        title: '灵活刷洗',
        description:
            '阿尔法可智能检测出所洗车辆的表面轮廓数据及其他加装物，并针对性地制定毛刷的刷洗角度和安全策略，确保千车千面的洗车效果。',
        preImage: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/scene-4.jpg',
        video: APP_CONFIG.STATIC_URL + 'wechat/video/meeting/灵活刷洗.mp4'
    },
    {
        id: 5,
        title: '高效协同',
        description:
            '归功于阿尔法高效的智能协同控制系统，多台阿尔法可以协同清洗同一辆车，最快55秒就可以完成清洗，比市面上的隧道式洗车机还要高效40%。',
        preImage: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/meeting-video-img-5.jpg'
    },
    {
        id: 6,
        title: '永不停机',
        description:
            '当多台阿尔法机器人在一起清洗同一辆车时，如果其中一台阿尔法出现了故障，其他机器会立刻改写清洗程序，补充到故障位置中去，保证清洗质量。',
        preImage: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/scene-6.png',
        video: APP_CONFIG.STATIC_URL + 'wechat/video/meeting/meeting-video-6.mp4'
    },
    {
        id: 7,
        title: '总部统一维修',
        description:
            '阿尔法的设计高度精简和模块化，所有的零配件，甚至是整机，遇到故障后均由快递发货至总部维修中心统一维修，确保维修品质和维修效率。',
        preImage: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/scene-7.jpg'
    }
];
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

var MeetingVideo = React.createClass({
    getInitialState: function () {
        this.orderStatusTimer = null;
        this.FindLastOrderByUserId_API = APP_CONFIG.APP_SERVICE + 'weixin/order/findLastOrderByUserId';
        this.FindCarStatus_API = APP_CONFIG.APP_SERVICE + 'weixin/washCar/findStatus2';
        this.FindStatusByOrderId_API = APP_CONFIG.APP_SERVICE + 'weixin/order/findStatusByOrderId'; //订单状态
        this.API_GET_HISTORY = APP_CONFIG.APP_SERVICE + 'front/conference/getShowList'; // 获取历史推送消息

        return {
            client: '', // 环境
            videoId: 1,
            maxVideoId: 0, //最大播放的视频
            messageList: []
        };
    },
    componentDidMount: function () {
        this.getHistory();

        var id = $.getUrlParam('id') || 1;
        APP_TOOLS.isEnvClient(
            function (env) {
                this.setState(
                    {
                        client: env.client,
                        videoId: id
                    },
                    function () {
                        if (env.client === 'wx') {
                            this.shareWX();
                        }
                    }
                );
            }.bind(this)
        );
        if (dd.env.platform !== 'notInDingTalk') this.setShareDD();
    },
    goToNextVideo: function (videoId) {
        var _this = this;
        // window.location.search = '?id=' + videoId;
        $('.detail-box').scrollTop(0);
        _this.setState(
            {
                videoId: videoId
            },
            function () {
                if (_this.state.client === 'wx') {
                    _this.shareWX();
                }
            }
        );
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
    goToDownload: function () {
        $.toast('请使用驿公里洗车APP打开下载', 'text');
    },
    goToLive: function () {
        window.location.href = './livevod.html';
    },
    getHistory: function () {
        const _this = this;
        $.ajax({
            isRepeated: true, //设置true时，不需要获取sessionId
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            method: 'POST',
            url: this.API_GET_HISTORY,
            success: function (res) {
                if (res.status == 1 && res.data) {
                    _this.setState({
                        messageList: res.data
                    });
                }
            }.bind(this),
            error: function () {}
        });
    },
    //设置微信分享
    shareWX: function (isShowed) {
        var _t = this;
        var currentVideo = VIDEO_LIST.filter((item) => item.id == _t.state.videoId)[0];
        TD_TOOLS.initShareConfig({
            title: currentVideo.title,
            url: APP_CONFIG.WECHAT2_APP_URL + 'active/meeting/video.html?id=' + currentVideo.id,
            icon: APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/meeting_share_icon.png',
            desc: currentVideo.description,
            isShowed: isShowed,
            success: function () {}
        });
    },
    // 设置钉钉分享
    setShareDD: function () {
        var _t = this;
        var currentVideo = VIDEO_LIST.filter((item) => item.id == _t.state.videoId)[0];
        const title = currentVideo.title,
            url = APP_CONFIG.WECHAT2_APP_URL + 'active/meeting/video.html?showmenu=false&id=' + currentVideo.id,
            desc = currentVideo.description,
            icon = APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/meeting_share_icon.png';
        dd.biz.navigation.setRight({
            show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
            control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
            text: '更多', //控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
                //如果control为true，则onSuccess将在发生按钮点击事件被回调
                DD_TOOLS.share(url, title, desc, icon);
            },
            onFail: function (err) {}
        });
    },
    // 调起钉钉分享
    shareDD: function () {
        var _t = this;
        var currentVideo = VIDEO_LIST.filter((item) => item.id == _t.state.videoId)[0];
        const title = currentVideo.title,
            url = APP_CONFIG.WECHAT2_APP_URL + 'active/meeting/video.html?showmenu=false&id=' + currentVideo.id,
            desc = currentVideo.description,
            icon = APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/meeting_share_icon.png';
        DD_TOOLS.share(url, title, desc, icon);
    },

    render: function () {
        const _this = this;
        var st = this.state;
        const currentVideo = VIDEO_LIST.filter((item) => item.id == st.videoId)[0];
        return (
            <div id="page-meeting-video">
                <div id="wx-navigation" onClick={this.hideShare}>
                    <img src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/share_wx.png'} />
                </div>
                <div id="liulanqi-navigation" onClick={this.hideShare}>
                    <img src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/share_liulanqi.png'} />
                </div>
                <div id="download-navigation">
                    <img src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/download_liulanqi.png'} />
                </div>
                <div className="container">
                    {currentVideo.video && (
                        <CompVideo
                            className="main-video-box"
                            poster={currentVideo.preImage}
                            src={currentVideo.video}
                            autoPlay={true}
                        />
                    )}
                    {!currentVideo.video && <img className="main-video-box" src={currentVideo.preImage} />}
                    <div className="detail-box">
                        {/* style={{ backgroundImage: 'url(' + APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/main_bg.png)' }}> */}
                        <div className="detail-box-introduction">
                            <div className="introduction-header">
                                <div className="introduction-title">{currentVideo.title}</div>
                                <div className="introduction-btn-group">
                                    {!isPC() && (
                                        <img
                                            className="share-btn"
                                            onClick={this.goToShare}
                                            src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/share-btn.png'}
                                        />
                                    )}
                                    {/* {!isPC() &&  <img className="download-btn" onClick={this.goToDownload} src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/download-btn.png'} />} */}
                                </div>
                            </div>
                            <div className="introduction-content">{currentVideo.description}</div>
                        </div>

                        <div className="detail-box-video-list">
                            <div className="video-list-title">发布会</div>
                            <div className="video-list-container">
                                <div className="video-item" onClick={_this.goToLive}>
                                    <div className="video-image">
                                        <img
                                            src={APP_CONFIG.STATIC_URL + 'wechat/images/active/meeting/record-img.jpg'}
                                        />
                                    </div>
                                    <div className="video-content">
                                        <div className="video-title">你好，未来</div>
                                        <div className="video-description">驿公里智能新品发布会</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {st.messageList.length > 1 ? (
                            <div className="detail-box-video-list">
                                <div className="video-list-title">其他视频</div>
                                <div className="video-list-container">
                                    {VIDEO_LIST.filter(
                                        (videoItem) =>
                                            st.messageList.filter((msgItem) => msgItem.contentJson.id == videoItem.id)
                                                .length > 0 && videoItem.id != currentVideo.id
                                    ).map((item) => (
                                        <div className="video-item" onClick={_this.goToNextVideo.bind(_this, item.id)}>
                                            <div className="video-image">
                                                <img src={item.preImage} />
                                            </div>
                                            <div className="video-content">
                                                <div className="video-title">{item.title}</div>
                                                <div className="video-description">{item.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(<MeetingVideo />, document.getElementById('app'));
