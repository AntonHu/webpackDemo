$(function () {
    FastClick.attach(document.body);
});
var FullKeyPressNoTemp = React.createClass({
    getInitialState: function () {
        this.num = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        this.str = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'L']
        ];

        return {};
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
        this.props.confirmCarInfo();
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
            <div
                id="fullkeypressID"
                className="press-box"
                onClick={this.stopPropagation}
                style={{ display: this.props.fullKeyPressDis, position: 'initial' }}
            >
                <div
                    style={{
                        display: this.props.topHidden ? 'none' : '',
                        background: '#efefef',
                        width: '100%',
                        height: '20px',
                        borderTop: '1px solid #ddd'
                    }}
                ></div>
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
        );
    }
});

var KeyPressNoTemp = React.createClass({
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
            entry: ''
        };
    },
    wordClickHandle: function (e) {
        var val = e.target.innerText,
            entry = this.state.entry;

        var f = this.strings;
        if (!entry.length) {
            entry = val;

            this.props.setWordEntry(entry);
        } else if (entry.length == 1) {
            entry += val;

            this.props.setWordEntry(entry);
            f = this.words;
            entry = '';
        }

        this.setState({
            f: f,
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
            <div
                id="keypressID"
                className="press-box"
                onClick={this.stopPropagation}
                style={{ display: this.props.keyPressDis, position: 'initial' }}
            >
                <div
                    style={{
                        display: this.props.topHidden ? 'none' : '',
                        background: '#efefef',
                        width: '100%',
                        height: '20px',
                        borderTop: '1px solid #ddd'
                    }}
                ></div>
                <div className="k-result" style={{ display: this.state.entry ? 'block' : 'none' }}>
                    <p>{this.state.entry}</p>
                    <div className="del" onClick={this.wordDeleteHandle.bind(this)}></div>
                </div>
                <div className="k-entry" onClick={this.wordClickHandle.bind(this)}>
                    {rowsNode}
                </div>
            </div>
        );
    }
});
