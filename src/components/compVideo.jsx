var CompVideo = React.createClass({
    componentDidMount: function() {
        var video = document.getElementById('comp-video');
        video.setAttribute('playsinline', true); /*IOS微信浏览器支持小窗内播放*/ 
        video.setAttribute('webkit-playsinLine', true); /*这个属性是ios 10中设置可以让视频在小窗内播放，也就是不是全屏播放*/  

        video.setAttribute('x5-playsinline', true); /*Android微信浏览器支持小窗内播放*/ 
        // video.setAttribute('x-webkit-airplay', true); /*这个属性还不知道作用*/   
        // video.setAttribute('x5-video-player-type', 'h5'); /*启用H5播放器,是wechat安卓版特性*/  
        // video.setAttribute('x5-video-player-fullscreen', true); /*全屏设置，设置为 true 是防止横屏*/ 
    },
    render() {
        var props = this.props;
        return (
            <video id="comp-video"
                style={{
                    objectPosition: 'center',
                    objectFit: 'fill'
                }}
                controls
                src={props.src}
                poster={props.poster}
                {...props}
            />
        )
    }
});

export default CompVideo;
