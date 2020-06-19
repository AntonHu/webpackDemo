$(function () {
    FastClick.attach(document.body);
});
var FullKeyPress = React.createClass({
    getInitialState: function () {
        this.num = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        this.str = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'L']
        ];

        return {
            dis: 'none'
        };
    },
    show: function () {
        this.setState({
            dis: 'block'
        });
    },
    hide: function () {
        this.setState({ dis: 'none' });
    },
    wordClickHandle: function (e) {
        var val = e.target.innerText,
            entry = this.props.entry;

        // 车牌为临时，点击word取消临时状态
        if (this.props.entry === '-----') return this.props.setNoEntry(val);

        if (!entry.length) {
            entry = val;
        } else if (entry.length >= 1 && entry.length < 6) {
            entry += val;
        } else if (entry.length == 6) {
            entry = entry.substring(0, entry.length - 1);
            entry += val;
        }

        this.props.setNoEntry(entry);
    },
    wordDeleteHandle: function () {
        var entry = this.props.entry;

        if (!entry.length) return;
        entry = entry.substring(0, entry.length - 1);
        this.props.setNoEntry(entry);
    },
    confirm: function () {
        this.setState({
            dis: 'none'
        });
    },
    interimClickHandle: function () {
        if (this.props.entry === '-----') {
            this.props.setNoEntry('');
        } else {
            this.props.setNoEntry('-----');
        }
    },
    stopPropagation: function (e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    },
    render: function () {
        var kpNumNode = [],
            kpStrNode = [];

        for (var i = 0; i < this.str.length; i++) {
            var ddNode = [];
            for (var j = 0; j < this.str[i].length; j++) {
                ddNode.push(<dd onTouchEnd={this.wordClickHandle.bind(this)}>{this.str[i][j]}</dd>);
            }
            kpStrNode.push(<dl>{ddNode}</dl>);
        }

        for (var i = 0; i < this.num.length; i++) {
            kpNumNode.push(<dd onTouchEnd={this.wordClickHandle.bind(this)}>{this.num[i]}</dd>);
        }

        return (
            <div className="key-press full" onClick={this.hide} style={{ display: this.state.dis }}>
                <div className="press-box" onClick={this.stopPropagation}>
                    <div
                        className={this.props.entry === '-----' ? 'interim-check active' : 'interim-check'}
                        onClick={this.interimClickHandle}
                    >
                        <em></em>
                        <span>我是临时车牌</span>
                    </div>
                    <div className="k-entry">
                        <dl>{kpNumNode}</dl>
                        <div className="clearfix">
                            <div className="kp-str fl">{kpStrNode}</div>
                            <div className="kp-action fr">
                                <div className="del" onTouchEnd={this.wordDeleteHandle}></div>
                                <div className="confirm" onClick={this.confirm}>
                                    确定
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var KeyPress = React.createClass({
    getInitialState: function () {
        this.words = [
            ['京', '沪', '浙', '苏', '粤', '鲁', '晋', '冀'],
            ['豫', '川', '渝', '吉', '辽', '黑', '皖', '鄂'],
            ['湘', '赣', '闽', '陕', '甘', '宁', '蒙', '津'],
            ['桂', '云', '贵', '琼', '青', '新', '藏', '']
        ];
        this.strings = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'L']
        ];

        return {
            f: this.words,
            entry: '',
            dis: 'none'
        };
    },
    show: function () {
        this.setState({
            dis: 'block',
            f: this.words,
            entry: ''
        });
    },
    hide: function () {
        this.setState({ dis: 'none' });
    },
    wordClickHandle: function (e) {
        var val = e.target.innerText,
            entry = this.state.entry;
        if (!val.length) {
            return;
        }
        if (!entry.length) {
            entry = val;
            this.props.setWordEntry(entry);
        } else if (entry.length == 1) {
            entry += val;

            this.props.setWordEntry(entry);
            this.props.showFullKeyPress();
            this.setState({
                dis: 'none'
            });
        }

        this.setState({
            f: this.strings,
            entry: entry
        });
    },
    wordDeleteHandle: function () {
        var entry = this.state.entry;

        if (!entry.length) return;
        if (entry.length <= 1) {
            this.setState({
                f: this.words
            });
        }
        entry = entry.substring(0, entry.length - 1);

        this.setState({
            entry: entry
        });
    },
    stopPropagation: function (e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    },
    render: function () {
        var rowsNode = [];
        for (var i = 0; i < this.state.f.length; i++) {
            var ddNode = [];
            for (var j = 0; j < this.state.f[i].length; j++) {
                ddNode.push(<dd>{this.state.f[i][j]}</dd>);
            }
            rowsNode.push(<dl>{ddNode}</dl>);
        }
        return (
            <div className="key-press" onClick={this.hide} style={{ display: this.state.dis }}>
                <div className="press-box" onClick={this.stopPropagation}>
                    <div className="k-result" style={{ display: this.state.entry ? 'block' : 'none' }}>
                        <p>{this.state.entry}</p>
                        <div className="del" onClick={this.wordDeleteHandle.bind(this)}></div>
                    </div>
                    <div className="k-entry" onClick={this.wordClickHandle.bind(this)}>
                        {rowsNode}
                    </div>
                </div>
            </div>
        );
    }
});

var AutoNoInput = React.createClass({
    getInitialState: function () {
        this.index = this.props.index || '1';
        return {
            autoWord: '',
            autoStr: '',
            autoNoType: 1 //录入车牌类型：1、普通 2、特殊
        };
    },
    componentDidMount: function () {
        if (document.querySelector('#auto-hand-input-' + this.index)) {
            document.querySelector('#auto-hand-input-' + this.index).onkeydown = this.submitAutoNo;
        }
        var autoInfo = APP_TOOLS.checkAutoNo(this.props.autoWord + this.props.autoStr);
        if (autoInfo.type == 2) {
            if (document.querySelector('#auto-hand-input-' + this.index)) {
                setTimeout(
                    function () {
                        document.querySelector('#auto-hand-input-' + this.index).focus();
                    }.bind(this),
                    10
                );
            }
            this.state.autoNoType = 2;
            this.props.hidePress();
        }
        this.setState({
            autoWord: this.props.autoWord,
            autoStr: this.props.autoStr
        });
    },
    componentWillReceiveProps: function (np) {
        var autoInfo = APP_TOOLS.checkAutoNo(np.autoWord + np.autoStr);
        if (autoInfo.type == 2 && this.state.autoNoType == 1) {
            $('#auto-hand-input-' + this.index).val(np.autoWord + np.autoStr);
            if (document.querySelector('#auto-hand-input-' + this.index)) {
                setTimeout(
                    function () {
                        document.querySelector('#auto-hand-input-' + this.index).focus();
                    }.bind(this),
                    10
                );
            }
            this.props.hidePress();
            this.setState({
                autoNoType: 2
            });
        } else if (autoInfo.type == 1 && this.state.autoNoType == 2) {
            this.setState({
                autoNoType: 1
            });
        }
    },
    switchAutoNoType: function (type) {
        if (type == this.state.autoNoType) {
            return;
        }
        if (type == 2) {
            if (document.querySelector('#auto-hand-input-' + this.index)) {
                setTimeout(
                    function () {
                        document.querySelector('#auto-hand-input-' + this.index).focus();
                    }.bind(this),
                    10
                );
            }
            if (document.querySelector('#auto-hand-input-' + this.index)) {
                document.querySelector('#auto-hand-input-' + this.index).value =
                    this.props.autoWord + this.props.autoStr;
            }
            this.props.hidePress();
        } else {
            if (document.querySelector('#auto-hand-input-' + this.index)) {
                document.querySelector('#auto-hand-input-' + this.index).blur();
            }
            this.props.showFullKeyPress();
        }
        this.setState({
            autoNoType: type
        });
    },
    submitAutoNo: function (e) {
        var val = e.currentTarget.value.toUpperCase();
        if (e.keyCode == 13 && val) {
            var autoInfo = APP_TOOLS.checkAutoNo(val);
            if (!autoInfo.status) return $.msgTip('请输入正确的车牌');
            if (document.querySelector('#auto-hand-input-' + this.index)) {
                document.querySelector('#auto-hand-input-' + this.index).blur();
            }
            this.props.setAutoNo(val);
        }
    },
    inputAutoNo: function (e) {
        var val = e.currentTarget.value.toUpperCase();
        this.props.changeAutoNo(val);
    },
    render: function () {
        var st = this.state,
            isGreen = false,
            autoWord = this.props.autoWord,
            autoStr = this.props.autoStr,
            autoInfo = APP_TOOLS.checkAutoNo(autoWord + autoStr);
        if (autoInfo.val == 2 || autoInfo.val == 3) {
            isGreen = true;
        }

        return (
            <div className="autono-input-wrapper">
                {this.props.noSpecial ? null : (
                    <div className="autono-input-switch">
                        <span
                            className={st.autoNoType == 1 ? 'autono-label-item active' : 'autono-label-item'}
                            onClick={this.switchAutoNoType.bind(this, 1)}
                        >
                            普通车牌
                        </span>
                        <span
                            className={st.autoNoType == 2 ? 'autono-label-item active' : 'autono-label-item'}
                            onClick={this.switchAutoNoType.bind(this, 2)}
                        >
                            特殊车牌
                        </span>
                    </div>
                )}
                <div
                    className={isGreen ? 'carsno green' : 'carsno'}
                    style={{ display: st.autoNoType == 1 ? 'block' : 'none' }}
                >
                    <div className="f-choosebtn" onClick={this.props.showKeyPress}>
                        <span className="f-result">
                            {this.props.autoWord} <i></i>
                        </span>
                    </div>
                    <div className="end-string">
                        <input
                            readOnly="true"
                            value={autoStr}
                            onClick={this.props.showFullKeyPress}
                            className={autoStr ? 'active' : ''}
                            type="url"
                            placeholder="输入车牌号"
                        />
                    </div>
                </div>
                {this.props.noSpecial ? null : (
                    <div className="carsno" style={{ display: st.autoNoType == 2 ? 'block' : 'none' }}>
                        <input
                            className="auto-hand-input"
                            id={'auto-hand-input-' + this.index}
                            type="text"
                            placeholder="如：沪A0006警"
                            onChange={this.inputAutoNo}
                        />
                    </div>
                )}
            </div>
        );
    }
});
