// 洗车服务进度组件
var ServiceProcessMini = React.createClass({
    getInitialState: function () {
        this.Stop_WashCar_API = APP_CONFIG.APP_SERVICE + 'weixin/washCar/stop';
        this.loadProcessTimer = null;
        return {
            precent: 0,
            serviceTime: {
                //服务时间
                XN000138: 8 * 60 * 1000,
                XN000200: 4 * 60 * 1000,
                XN000201: 6 * 60 * 1000,
                XN000202: 8 * 60 * 1000
            },
            curSerTime: 8 * 60 * 1000, //当前服务时间
            orderEntity: {}
        };
    },
    componentDidMount: function () {},
    componentWillReceiveProps: function (props) {
        if (props.orderEntity) {
            if (
                props.orderEntity.f_status == 0 ||
                props.orderEntity.f_status == 15 ||
                props.orderEntity.f_status == 25
            ) {
                this.processLoading(100, props.orderEntity.f_notice_type);
                this.setState({
                    precent: 100
                });
            } else if (props.orderEntity.f_status >= 40) {
                this.successPage();
            } else {
            }
            if (props.orderEntity && props.orderEntity.f_order_id && !this.state.orderEntity.f_order_id) {
                //订单信息第一次加载执行
                var curSerTime = props.orderEntity.f_eshop_flow_no
                    ? this.state.serviceTime[props.orderEntity.f_eshop_flow_no]
                    : 8 * 60 * 1000;
                this.setState(
                    {
                        curSerTime: curSerTime,
                        orderEntity: props.orderEntity
                    },
                    function () {
                        this.reloadData(props.orderEntity);
                    }.bind(this)
                );
            }
        }
    },
    reloadData: function (data) {
        if (!data || (data.f_status == 0 && data.f_notice_type != 0)) {
            return;
        }

        var startTime = data.f_appointment_start_time,
            betweenTime = new Date().getTime() - startTime >= 0 ? new Date().getTime() - startTime : 0, //时间差的毫秒数,防止本地时间比服务器时间慢，导致刚进页面，进度条就显示99%
            curSerTime = this.state.curSerTime;
        if (data.f_status >= 40 || data.f_status == 0 || data.f_status == 25 || data.f_status == 15) {
            this.successPage();
        } else if (betweenTime > curSerTime) {
            this.successPage();
        } else {
            var precent = betweenTime / curSerTime;
            this.calProcessStatus(precent);
        }
    },
    calProcessStatus: function (process) {
        var orderEntity = this.props.orderEntity;
        status = orderEntity.f_status;
        if (process >= 1 || status >= 40 || status == 15 || status == 25 || status == 0) {
            this.successPage();
            return;
        }

        this.setState({ precent: process * 100 });
        this.processLoading(process * 100, orderEntity.f_notice_type);

        clearTimeout(this.loadProcessTimer);
        this.loadProcessTimer = setTimeout(
            function () {
                this.reloadData(this.props.orderEntity);
            }.bind(this),
            5000
        );
    },
    successPage: function () {
        var orderEntity = this.props.orderEntity;
        status = orderEntity.f_status;
        if (status == 30) {
            this.processLoading(99, orderEntity.f_notice_type);
            this.setState({ precent: 99 });
        } else {
            if (status >= 40 || status == 0 || status == 15 || status == 25) {
                this.processLoading(100, orderEntity.f_notice_type);
                this.setState({ precent: 100 });
            }
        }
    },
    processLoading: function (process, noticeType) {
        var canvas = document.getElementById('minCanvas'); //获取canvas元素
        var lineWidth = 14;
        if (canvas && canvas.getContext) {
            var context = canvas.getContext('2d'), //获取画图环境，指明为2d
                centerX = canvas.width / 2, //Canvas中心点x轴坐标
                centerY = canvas.height / 2, //Canvas中心点y轴坐标
                rad = (Math.PI * 2) / 100, //将360度分成100份，那么每一份就是rad度
                speed = process; //加载的快慢就靠它了

            //绘制绿/红色外圈
            function greenCircle(n) {
                context.save();

                var g = context.createLinearGradient(centerX, centerY, 100, 100); //创建渐变对象  渐变开始点和渐变结束点
                if (noticeType != 0) {
                    g.addColorStop(1, '#f4535c'); //添加颜色点
                    g.addColorStop(0, '#fb5269'); //添加颜色点
                    context.shadowColor = '#fb5269';
                } else {
                    g.addColorStop(1, '#B5EB45'); //添加颜色点
                    g.addColorStop(0, '#7ED321'); //添加颜色点
                    context.shadowColor = '#7ED321';
                }
                context.strokeStyle = g; //使用渐变对象

                context.lineWidth = lineWidth; //设置线宽
                context.beginPath(); //路径开始

                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowBlur = 8;
                context.arc(centerX, centerY, 66, -Math.PI / 2, -Math.PI / 2 + n * rad, false);
                context.stroke(); //绘制
                context.closePath(); //路径结束
                context.restore();
            }
            //绘制白色外圈
            function whiteCircle(n) {
                context.save();

                var g = context.createLinearGradient(centerX, centerY, 100, 100); //创建渐变对象  渐变开始点和渐变结束点
                g.addColorStop(1, 'rgba(255,255,255,.3)'); //添加颜色点
                g.addColorStop(0, 'rgba(255,255,255,.3)'); //添加颜色点
                context.strokeStyle = g; //使用渐变对象

                context.lineWidth = 10; //设置线宽
                context.beginPath(); //路径开始
                context.arc(centerX, centerY, 66, -Math.PI / 2, -Math.PI / 2 + n * rad, true); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
                context.stroke(); //绘制
                context.closePath(); //路径结束
                context.restore();
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            greenCircle(speed);
            whiteCircle(speed);
        }
    },
    showStopTip: function () {
        //（显示弹窗）该方法写到父组件中
        $('.stop_dialog').css('visibility', 'visible');
        $('.stop_mask').css('visibility', 'visible');

        $('.stop_dialog').animate({ opacity: '1' }, 100);
        $('.stop_mask').animate({ opacity: '0.7' }, 100);
    },
    stopMachine: function () {
        $.showWashLoading('正在关闭洗车机...');
        var factoryId = this.props.orderEntity.f_factory_id,
            orderId = this.props.orderEntity.f_order_id;
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: this.Stop_WashCar_API,
            data: { factoryId: factoryId, orderId: orderId },
            success: function (res) {
                if (res.status == 1) {
                    //自动会去判断订单是否成功
                    window.location.href =
                        APP_CONFIG.WECHAT2_APP_URL +
                        'autowash/reset.html?factoryId=' +
                        factoryId +
                        '&orderId=' +
                        orderId +
                        '&type=stop';
                } else {
                    $.hideWashLoading();
                    $.msgTip('洗车机关闭失败，请重试');
                }
            }.bind(this),
            error: function (e) {
                $.hideWashLoading();
                $.msgTip('网络异常，请重试');
            }.bind(this)
        });
    },
    render: function () {
        var orderEntity = this.props.orderEntity;
        var showedStop = -1; //初始化
        var f_status = orderEntity.f_status;
        if (f_status == 30) {
            showedStop = 0; //服务中
        } else if (f_status != -1) {
            showedStop = 1; //已完成或关闭
        }
        var precent = 0;
        if (this.state.precent) {
            precent = parseInt(this.state.precent);
        }
        var minServiceTitle = '';
        if (orderEntity.f_status >= 40) {
            if (orderEntity.f_emergency == 1) {
                minServiceTitle = '服务已停止';
            } else {
                minServiceTitle = '洗车已完成';
            }
        } else if (orderEntity.f_status == 0 || orderEntity.f_status == 15 || orderEntity.f_status == 25) {
            minServiceTitle = '服务已结束';
        } else {
            minServiceTitle = '正在服务中';
        }
        return (
            <div
                className={
                    this.props.fixed
                        ? 'min-service-process-box min-service-process-box-fixed'
                        : 'min-service-process-box'
                }
            >
                <span className="min-service-status">
                    【{APP_TOOLS.serviceName(orderEntity.f_order_type)}】{minServiceTitle}
                </span>
                {showedStop === 0 ? <button onClick={this.showStopTip}>紧急停止</button> : null}
                <div id="min-canvas">
                    <canvas id="minCanvas">驿</canvas>
                    <div className="title">{precent + '%'}</div>
                </div>
                <StopWashPopup stop={this.stopMachine} />
            </div>
        );
    }
});

var StopWashPopup = React.createClass({
    showStopTip: function () {
        //（显示弹窗）该方法写到父组件中
        $('.stop_dialog').css('visibility', 'visible');
        $('.stop_mask').css('visibility', 'visible');

        $('.stop_dialog').animate({ opacity: '1' }, 100);
        $('.stop_mask').animate({ opacity: '0.7' }, 100);
    },
    stopMachine: function () {
        this.cancel();
        this.props.stop();
    },
    cancel: function () {
        $('.stop_dialog').css('visibility', 'hidden');
        $('.stop_mask').css('visibility', 'hidden');

        $('.stop_dialog').animate({ opacity: '0' }, 100);
        $('.stop_mask').animate({ opacity: '0' }, 100);
        if (this.props.cancel && typeof this.props.cancel === 'function') {
            this.props.cancel();
        }
    },
    render: function () {
        return (
            <div className="js_dialog">
                <div className="weui_mask stop_mask"></div>
                <div className="weui_dialog stop_dialog" style={{ width: '90%', left: '5%' }}>
                    <div className="weui_dialog_hd">
                        <div className="weui_dialog_title">紧急停止</div>
                        <img
                            style={{ width: '60px', margin: '15px auto' }}
                            src={APP_CONFIG.STATIC_URL + 'wechat/images/autowash/warn.png'}
                        />
                    </div>
                    <div
                        className="weui_dialog_bd"
                        style={{ lineHeight: '19px', textAlign: 'justify', color: '#333333' }}
                    >
                        停止洗车机，强行结束当前洗车服务，如需再次服务需要重新扫码支付，请谨慎操作。
                    </div>
                    <div className="weui_dialog_ft" style={{ padding: '4px 0px' }}>
                        <a
                            onClick={this.cancel}
                            className="weui_dialog_btn weui_dialog_btn_default"
                            style={{ color: '#333333', borderRight: '1px solid #D5D5D6' }}
                        >
                            取消
                        </a>
                        <a
                            onClick={this.stopMachine}
                            className="weui_dialog_btn weui_dialog_btn_primary"
                            style={{ color: '#FF4C00' }}
                        >
                            结束洗车
                        </a>
                    </div>
                </div>
            </div>
        );
    }
});
export default ServiceProcessMini;
