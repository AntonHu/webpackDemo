var SelectPayType = React.createClass({
    getInitialState: function () {
        return {
            configPayType: [
                //配置实例
                {
                    title: '年卡支付',
                    icon: this.STATIC_IMGURL + 'pay-vip-icon.png',
                    type: '9',
                    value: '剩余0次',
                    tip: '购买年卡享9折起'
                },
                { title: '免密支付', icon: this.STATIC_IMGURL + 'sec_pay_account.png', type: '5', value: '余额￥0' },
                { title: '支付宝支付', icon: this.STATIC_IMGURL + 'sec_pay_zfb.png', type: '1' },
                { title: '微信支付', icon: this.STATIC_IMGURL + 'pay_wx.png', type: '2' }
            ]
        };
    },
    componentDidMount: function () {},
    chooseType: function (data) {
        this.cancel();
        this.props.setPayType(data);
    },
    cancelBubble: function (e) {
        e.stopPropagation();
    },
    selectPayType: function () {
        $('#select-pay-type').css('display', 'block');
        $('#mask-pop').animate({ opacity: '0.3' }, 200);
        $('#btn-list').animate({ bottom: '0px' }, 200);
    },
    cancel: function () {
        this.props.hidePayType();
        $('#mask-pop').animate({ opacity: '0' }, 200, function () {
            $('#select-pay-type').css('display', 'none');
        });
        $('#btn-list').animate({ bottom: '-' + (this.props.configPayType.length + 2) * 70 + 'px' }, 200);
    },
    render: function () {
        if (this.props.showSelectPayType) {
            $('#select-pay-type').css('display', 'block');
            $('#mask-pop').animate({ opacity: '0.3' }, 200);
            $('#btn-list').animate({ bottom: '0px' }, 200);
        } else {
            $('#mask-pop').animate({ opacity: '0' }, 200, function () {
                $('#select-pay-type').css('display', 'none');
            });
            $('#btn-list').animate({ bottom: '-' + (this.props.configPayType.length + 2) * 70 + 'px' }, 200);
        }
        var styles = {
            wrapperStyle: {
                position: 'fixed',
                display: 'none',
                top: '0px',
                left: '0px',
                zIndex: '998',
                width: '100vw',
                height: $(window).height()
            },
            maskStyle: {
                background: '#000',
                opacity: '0',
                width: '100vw',
                height: '100%'
            },
            listBox: {
                background: '#f3f3f3',
                position: 'absolute',
                bottom: '-' + (this.props.configPayType.length + 2) * 70 + 'px',
                left: '0px',
                width: '100%',
                maxHeight: '70%'
            },
            ulStyle: {
                fontSize: '18px',
                background: '#fff',
                opacity: '1',
                listStyle: 'none'
            },
            titleStyle: {
                textAlign: 'center',
                background: '#fff',
                lineHeight: '65px',
                color: '#333',
                borderBottom: '1px solid #f4f1fe',
                position: 'relative'
            },
            closeImg: {
                display: 'inline-block',
                width: '16px',
                position: 'absolute',
                left: '15px',
                top: '50%',
                marginTop: '-8px'
            },
            liContentStyle: {
                height: '100%',
                padding: '12px 22px 12px 0px',
                borderBottom: '1px solid #f4f1fe'
            },
            payIconStyle: {
                width: '38px',
                position: 'absolute',
                left: '4px',
                top: '50%',
                marginTop: '-19px'
            }
        };
        var payTypeList = this.props.configPayType.map(
            function (item, i) {
                var topTitleStyle = {
                        lineHeight: '46px',
                        fontSize: '17px',
                        fontWeight: '300'
                    },
                    liStyle = {
                        background: '#fff',
                        height: '70px',
                        lineHeight: '46px',
                        color: '#333',
                        paddingLeft: '30px',
                        textAlign: 'left'
                    },
                    topTipStyle = {},
                    btmTipStyle = {},
                    topText = '',
                    btmText = '';
                if (item.type == 9) {
                    topText = item.value ? item.value : '';
                    btmText = item.tip ? item.tip : '';
                    topTitleStyle = {
                        lineHeight: item.tip ? '24px' : '46px',
                        paddingTop: item.tip ? '3px' : '0px',
                        fontSize: '17px',
                        fontWeight: '300'
                    };
                    topTipStyle = {
                        display: item.value ? 'inline-block' : 'none',
                        fontSize: '14px',
                        color: '#9b9b9b',
                        paddingLeft: '16px',
                        fontWeight: '300'
                    };
                    btmTipStyle = {
                        display: item.tip ? 'inline-block' : 'none',
                        fontSize: '13px',
                        color: '#FF6704',
                        lineHeight: '18px',
                        fontWeight: '300',
                        verticalAlign: 'top'
                    };
                } else {
                    topText = '';
                    btmText = item.value ? item.value : '';
                    topTitleStyle = {
                        lineHeight: item.value ? '24px' : '46px',
                        paddingTop: item.value ? '3px' : '0px',
                        fontSize: '17px',
                        fontWeight: '300'
                    };
                    topTipStyle = {
                        display: 'none'
                    };
                    btmTipStyle = {
                        display: item.value ? 'inline-block' : 'none',
                        fontSize: '13px',
                        color: '#9b9b9b',
                        lineHeight: '18px',
                        fontWeight: '300',
                        verticalAlign: 'top'
                    };
                }

                if (item.title == '') {
                    liStyle.display = 'none';
                } else {
                    liStyle.display = 'block';
                }
                return (
                    <li style={liStyle} onClick={this.chooseType.bind(this, item)}>
                        <div style={styles.liContentStyle}>
                            <div style={{ height: '100%', padding: '0px 40px 0px 72px', position: 'relative' }}>
                                <img style={styles.payIconStyle} src={item.icon} />
                                <div style={topTitleStyle}>
                                    {item.title}
                                    <span style={topTipStyle}>{topText}</span>
                                </div>
                                <span style={btmTipStyle}>{btmText}</span>
                                <span
                                    className={this.props.payType == item.type ? 'select-icon select' : 'select-icon'}
                                ></span>
                            </div>
                        </div>
                    </li>
                );
            }.bind(this)
        );
        return (
            <div id="select-pay-type" style={styles.wrapperStyle} onClick={this.cancel}>
                <div id="mask-pop" style={styles.maskStyle}></div>
                <div id="btn-list" style={styles.listBox} onClick={this.cancelBubble}>
                    <div style={styles.titleStyle}>
                        <img style={styles.closeImg} src="../../images/common/close_1.png" onClick={this.cancel} />
                        选择支付方式
                    </div>
                    <div style={{ height: $('#btn-list').height() - 66 + 'px', overflowY: 'auto' }}>
                        <ul style={styles.ulStyle}>
                            {payTypeList}
                            <li style={{ background: '#fff', height: '12px' }}></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});
