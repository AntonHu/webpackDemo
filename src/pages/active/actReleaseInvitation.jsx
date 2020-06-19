/*
 * @文件描述: 邀请函生成js
 * @作者: Anton
 * @Date: 2020-06-02 11:42:41
 * @LastEditors: Anton
 * @LastEditTime: 2020-06-18 19:28:32
 */
import '@/styles/active/actReleaseInvitation.scss';
// $(function () {
//     FastClick.attach(document.body);
// });
var PAGE_ID = 'page-html';
var IMAGE_ID = 'page-image';

// if ( window.location.origin.indexOf('wechat') === -1 ) {
//     window.location.replace(APP_CONFIG.WECHAT2_APP_URL + window.location.pathname.slice(1) + window.location.search);
// }
var InviteShare = React.createClass({
    getInitialState: function () {
        return {
            showLoading: false,
            name: '', // 用户姓名
            imageUrl: '',
            imageWidth: '',
            imageHeight: ''
        };
    },
    componentDidMount: function () {
        this.shareWX();
        this.shareDD();
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
        const { name } = _this.state;
        if (!name) {
            $.alert('请先输入邀请人姓名！');
            return;
        }
        if (!APP_TOOLS.isPC()) {
            window.location.replace('./actInvitationImage.html?name=' + name);
            return;
        }
        _this.showLoading();
        _this.htmlToImage().then(function (base64) {
            !APP_TOOLS.isPC() && _this.setState({ imageUrl: base64 });
            APP_TOOLS.isPC() && _this.downloadFile('邀请函.jpg', base64);
            _this.hideLoading();
        });
    },
    //设置微信分享
    shareWX: function () {
        const title = '邀请函生成器',
            url = window.location.href,
            desc = '输入被邀人姓名即可生成图片',
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
        const title = '邀请函生成器',
            url = window.location.href,
            desc = '输入被邀人姓名即可生成图片',
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

    render: function () {
        const { name, imageUrl, imageWidth, imageHeight } = this.state;
        const getSize = () => {
            const styleObject = {
                opacity: imageUrl ? 1 : 0,
                zIndex: imageUrl ? 10 : 8
            };
            if (imageWidth) {
                styleObject.width = imageWidth;
                styleObject.height = imageHeight;
            }
            return styleObject;
        };
        const countVH = (px) => {
            if (window.innerHeight / window.innerWidth < 697 / 418) {
                return (px / 697) * 100 + 'vh';
            } else {
                return (px / 418) * 100 + 'vw';
            }
        };
        return (
            <div id="page-actReleaseInvitation">
                <div id="release-container" className="release-container">
                    <img
                        id="font-image"
                        className="font-image"
                        src={imageUrl}
                        style={{
                            opacity: imageUrl ? 1 : 0,
                            zIndex: imageUrl ? 10 : 8,
                            width: countVH(418),
                            height: countVH(697)
                        }}
                    />
                    <div
                        className="loadingContent"
                        style={{ display: this.state.showLoading ? 'block' : 'none' }}
                        onClick={this.stopPropagation}
                    >
                        <div className="content">
                            <img src="https://source.1kmxc.com/static-web-new/wechat/images/active/invite/loading.gif" />
                        </div>
                    </div>
                    <div
                        id={PAGE_ID}
                        className="page-html"
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
                            <input
                                className="name-input"
                                placeholder="请输入"
                                onChange={this.nameChange}
                                value={name}
                                style={{
                                    marginTop: countVH(240),
                                    fontSize: countVH(20)
                                }}
                            />
                            <div
                                className="btn-group"
                                style={{
                                    marginTop: countVH(200)
                                }}
                            >
                                <button className="down-btn" onClick={this.downloadImage}>
                                    {APP_TOOLS.isPC() ? '下载图片' : '生成图片'}
                                </button>
                            </div>
                        </div>
                    </div>
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
                </div>
                {/* {!APP_TOOLS.isPC() && <div className="bottom">长按图片保存到相册</div>} */}
            </div>
        );
    }
});

ReactDOM.render(<InviteShare />, document.getElementById('app'));
