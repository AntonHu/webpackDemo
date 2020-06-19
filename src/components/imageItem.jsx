//图片组件
(function () {
    $.ajax({
        isRepeated: true, //设置true时，不需要获取sessionId
        xhrFields: {
            withCredentials: true
        },
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
                jsApiList: ['chooseImage', 'previewImage', 'uploadImage']
            });
        }
    });
})();
var ImageItem = React.createClass({
    getInitialState: function () {
        return {};
    },
    deleteImg: function (i, e) {
        this.props.deleteImg(i, e);
    },
    previewHandle: function (current, all) {
        if (APP_TOOLS.isWechatClient() == 'zfb' && window.ap) {
            ap.previewImage({
                current: 0, // 当前显示图片的index
                urls: all // 需要预览的图片http链接列表
            });
        } else if (APP_TOOLS.isWechatClient() == 'hcz') {
            // 好车主待写入
        } else {
            wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: all // 需要预览的图片http链接列表
            });
        }
    },
    render: function () {
        var imgUrl = this.props.imgUrl,
            imgList = this.props.imgList,
            imgBigUrl = '',
            imgBigList = [],
            newImg = '';

        imgBigUrl = /(http:\/\/|https:\/\/)/.test(imgUrl) ? imgUrl : APP_CONFIG.IMG_URL + 'Big/' + imgUrl;
        newImg = /(http:\/\/|https:\/\/)/.test(imgUrl) ? imgUrl : APP_CONFIG.IMG_URL + imgUrl;
        for (var i = 0; i < imgList.length; i++) {
            if (imgList[i]) {
                var imgBigItem = /(http:\/\/|https:\/\/)/.test(imgList[i])
                    ? imgList[i]
                    : APP_CONFIG.IMG_URL + 'Big/' + imgList[i];
                imgBigList.push(imgBigItem);
            }
        }

        var styles = {
            imgWrap: { width: '23%', padding: '5px 0px', margin: '0px .9%', display: 'inline-block' },
            imgBox: { width: '100%', height: '0px', paddingBottom: '100%', margin: '0px', position: 'relative' },
            imgStyle: { position: 'absolute', width: '100%', height: '100%' },
            closeIcon: {
                width: '16px',
                height: '16px',
                position: 'absolute',
                top: '-8px',
                right: '-3px',
                zIndex: '2',
                display: this.props.showClose && this.props.showClose == 'true' ? 'inline-block' : 'none'
            }
        };
        return (
            <div style={styles.imgWrap}>
                <div style={styles.imgBox}>
                    <img
                        style={styles.closeIcon}
                        src={APP_CONFIG.STATIC_URL + 'wechat/images/common/close.png'}
                        onClick={this.deleteImg.bind(this, this.props.index)}
                    />
                    <img
                        style={styles.imgStyle}
                        src={newImg}
                        onClick={this.previewHandle.bind(this, imgBigUrl, imgBigList)}
                    />
                </div>
            </div>
        );
    }
});
