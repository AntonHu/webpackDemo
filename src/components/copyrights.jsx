$(function () {
    FastClick.attach(document.body);
});
var CopyRights = React.createClass({
    render: function () {
        var style = {
            textAlign: 'center',
            fontSize: '10px',
            lineHeight: '14px',
            color: 'rgba(0,0,0,0.38)',
            borderTop: '1px solid rgba(0,0,0,0.12)',
            padding: '10px 0'
        };
        return (
            <div style={style}>
                <div>Copyright © 2015-2016 上海氦修网络科技有限公司</div>
                <div>All Rights Reserved</div>
            </div>
        );
    }
});
