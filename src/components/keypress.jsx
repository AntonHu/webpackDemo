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

        if (!entry.length) {
            entry = val;
        } else if (entry.length == 1) {
            entry += val;

            this.props.setWordEntry(entry);
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
                        <em onClick={this.wordDeleteHandle.bind(this)}></em>
                    </div>
                    <div className="k-entry" onClick={this.wordClickHandle.bind(this)}>
                        {rowsNode}
                    </div>
                </div>
            </div>
        );
    }
});
