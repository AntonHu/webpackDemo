var LoginWX = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        console.log(
            '------------------------------------------------------------------------------------------------------------------------------------'
        );
        var backUrl = decodeURIComponent($.getUrlParam('backUrl'));
        var openid = $.getUrlParam('openid');
        if (APP_TOOLS.isWechatClient() == 'zfb') {
            openid = $.getUrlParam('userId');
        }
        if (openid) {
            tools.setCookie('w_openid', openid);
        }

        var url = window.location.href;
        var header = 'http://localhost:';

        //判断是否是local请求的，是的话需要回跳到local
        if (backUrl.indexOf(header) > -1 && url.indexOf(header) != 0) {
            var array1 = backUrl.split(header);
            if (array1 && array1.length > 1) {
                var array2 = array1[1].split('/');
                if (array2 && array2.length > 0) {
                    var port = array2[0];
                    var localUrl =
                        header +
                        port +
                        '/login/loginWX.html?openid=' +
                        openid +
                        '&backUrl=' +
                        encodeURIComponent(backUrl);
                    window.location.replace(localUrl);
                    return;
                }
            }
        }
        window.location.replace(backUrl);
    },
    render: function () {
        return <div></div>;
    }
});

ReactDOM.render(<LoginWX />, document.getElementById('app'));
