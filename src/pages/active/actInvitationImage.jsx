/*
 * @文件描述: 邀请函生成js
 * @作者: Anton
 * @Date: 2020-06-02 11:42:41
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-18 19:44:48
 */
import '@/styles/active/actInvitationImage.scss';
$(function () {
    FastClick.attach(document.body);
});
// if ( window.location.origin.indexOf('wechat') === -1 ) {
//     window.location.replace(APP_CONFIG.WECHAT2_APP_URL + window.location.pathname.slice(1) + window.location.search);
// }
var IMAGE_ID = 'page-image';
var InviteShare = React.createClass({
    getInitialState: function () {
        return {
            showLoading: false,
            name: '', // 用户姓名
            imageUrl: '',
            imageWidth: '',
            imageHeight: '',
            isShared: false // 已经分享过的
        };
    },
    componentDidMount: function () {
        const name = $.getUrlParam('name');
        const isShared = $.getUrlParam('isShared');
        this.setState(
            {
                name: name,
                isShared: isShared
            },
            () => {
                this.downloadImage();
                this.shareWX();
                this.shareDD();
            }
        );
    },
    DPR: function () {
        // 获取设备dpi
        if (window.devicePixelRatio && window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
        return 1;
    },
    htmlToImage: function () {
        var _this = this;
        var ele = document.querySelector('#' + IMAGE_ID);
        return new Promise(function (resolve, reject) {
            // 获取像素比
            var scale = _this.DPR() * 2;
            var width = ele.offsetWidth;
            var height = ele.offsetHeight;
            console.log(ele, width, height);
            var canvas = document.createElement('canvas');
            canvas.width = width * scale;
            canvas.height = height * scale;
            var content = canvas.getContext('2d');
            content.mozImageSmoothingEnabled = false;
            content.webkitImageSmoothingEnabled = false;
            content.msImageSmoothingEnabled = false;
            content.imageSmoothingEnabled = false;
            content.scale(scale, scale);
            var rect = ele.getBoundingClientRect();
            content.translate(-rect.left, -rect.top);
            html2canvas(ele, {
                // allowTaint: true, // 开启这个，useCORS就失效
                tainTest: true,
                width: width,
                height: height,
                scale: scale,
                canvas: canvas,
                proxy: null,
                useCORS: true
            }).then(function (canvas) {
                resolve(canvas.toDataURL('image/png'));
            });
        });
    },
    downloadFile(fileName, content) {
        let aLink = document.createElement('a');
        let blob = this.base64ToBlob(content); //new Blob([content]);

        let evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); //兼容火狐
    },
    base64ToBlob(code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    },
    showLoading: function () {
        this.setState({
            showLoading: true
        });
    },
    hideLoading: function () {
        this.setState({
            showLoading: false
        });
    },
    nameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    downloadImage: function () {
        var _this = this;
        if (!_this.state.name) {
            $.alert('请先输入邀请人姓名！');
            return;
        }
        _this.showLoading();
        _this.htmlToImage().then(function (base64) {
            !APP_TOOLS.isPC() && _this.setState({ imageUrl: base64 }, _this.ddPreviewImage);
            _this.hideLoading();
        });
    },
    //设置微信分享
    shareWX: function () {
        const title = '诚邀您参加驿公里智能新品发布会',
            url = window.location.href + '&isShared=1',
            desc = '期待您的到来',
            icon = APP_CONFIG.STATIC_URL + 'wechat/images/active/actReleaseInvitationShareIcon.png';
        APP_TOOLS.isEnvClient(
            function (env) {
                if (env.client === 'wx') {
                    TD_TOOLS.initShareConfig({ title, url, icon, desc });
                }
            }.bind(this)
        );
    },
    shareDD: function () {
        if (dd.env.platform === 'notInDingTalk') return;
        if (this.state.isShared) {
            return;
        }
        const title = '诚邀您参加驿公里智能新品发布会',
            url = window.location.href + '&isShared=1' + '&showmenu=false',
            desc = '期待您的到来',
            icon = APP_CONFIG.STATIC_URL + 'wechat/images/active/actReleaseInvitationShareIcon.png';
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
    ddPreviewImage: function () {
        const { name, imageUrl, isShared } = this.state;
        if (dd.env.platform === 'notInDingTalk') return;
        dd.biz.util.previewImage({
            urls: [imageUrl], //图片地址列表
            current: imageUrl, //当前显示的图片链接
            onSuccess: function (result) {
                /**/
            },
            onFail: function (err) {}
        });
    },

    render: function () {
        const { name, imageUrl, isShared } = this.state;
        const bottomHeight = 50;
        const winHeight = window.innerHeight;
        const winWidth = window.winWidth;
        const countVH = (px) => {
            const bottomDom = document.getElementById('bottomTip');
            if (!isShared && !bottomDom) return 0;
            const canvasHeight = winHeight - (isShared ? 0 : document.getElementById('bottomTip').offsetHeight);
            const canvasHeightRate = canvasHeight / winHeight;
            if (canvasHeight / window.innerWidth < 697 / 418) {
                return (px / 697) * canvasHeightRate * winHeight + 'px';
            } else {
                return (px / 418) * 100 * canvasHeightRate + 'vw';
            }
        };
        const countVW = (px) => {
            return (px / 375) * 100 + 'vw';
        };
        return (
            <div id="page-actInvitationImage">
                <div
                    className="loadingContent"
                    style={{ display: this.state.showLoading ? 'block' : 'none' }}
                    onClick={this.stopPropagation}
                >
                    <div className="content">
                        <img src="https://source.1kmxc.com/static-web-new/wechat/images/active/invite/loading.gif" />
                    </div>
                </div>
                <div id="release-container" className="release-container">
                    <img
                        id="font-image"
                        className="font-image"
                        src={imageUrl}
                        onClick={this.ddPreviewImage}
                        style={{
                            position: 'absolute',
                            opacity: 0,
                            zIndex: 8,
                            width: countVH(418),
                            height: countVH(697)
                        }}
                    />
                    <div
                        id={IMAGE_ID}
                        className="page-image"
                        style={{
                            width: countVH(418),
                            height: countVH(697)
                        }}
                    >
                        <img
                            className="html-bg"
                            src={APP_CONFIG.STATIC_URL + 'wechat/images/active/actReleaseInvitation.jpg'}
                        />
                        <div className="operation">
                            <div
                                className="name-text"
                                style={{
                                    marginTop: countVH(240),
                                    fontSize: countVH(20)
                                }}
                            >
                                {name}
                            </div>
                        </div>
                    </div>
                    {!isShared && (
                        <div
                            id="bottomTip"
                            className="bottom"
                            style={{
                                height: countVW(bottomHeight),
                                lineHeight: countVW(bottomHeight)
                            }}
                        >
                            {dd.env.platform === 'notInDingTalk' ? '长按图片保存到相册' : '点击图片保存到相册'}
                        </div>
                    )}
                </div>
            </div>
        );
    }
});

ReactDOM.render(<InviteShare />, document.getElementById('app'));
