var TicketUseFactorysList = React.createClass({
    render: function(){
        var canUse=this.props.canUse,       //1:表示要显示可用门店  0：表示要显示不可用门店
            ticketScreenType = this.props.ticketScreenType,     //站点限制类型 13：限站点
            showScreenInfo = this.props.showScreenInfo;     //标题及描述等自定义信息（不同页面显示的可能会不一样）
        var styles = {
            ruleWrap: {
                position: "fixed",
                top: "100vh",
                left: "0px",
                width: "100%",
                height: "100vh",
                background: "#fff",
                padding: "0px 10px",
                display: "none",
                overflow: "hidden",
                overflowY: "scroll",
                "-webkit-overflow-scrolling": "touch",
                zIndex: "100",
                boxSizing: 'border-box'
            },
            title: {
                fontSize: "18px",
                fontWeight: "bolder",
                padding: "20px 0px",
                borderBottom: "1px solid #d8d8d8",
            },
            subtitle_1: {
                fontSize: "15px",
                padding: "20px 0px",
                lineHeight: "20px"
            },
            subtitle_2: {
                fontSize: "15px",
                padding: "0px",
                lineHeight: "22px",
                marginBottom: "10px"
            }
        };
        var factoryScreenData = this.props.factoryScreenData, formatScreenData = [];
        for(var i=0; i<factoryScreenData.length; i++){
            var haveData = false;
            for(var j=0; j<formatScreenData.length; j++){
                if(factoryScreenData[i].f_city_id == formatScreenData[j].cityId){
                    formatScreenData[j]['factoryData'].push(factoryScreenData[i]);
                    haveData = true;
                    continue;
                }
            }
            if(!haveData){
                formatScreenData.push({
                    cityId: factoryScreenData[i].f_city_id,
                    cityName: factoryScreenData[i].f_city,
                    factoryData: [factoryScreenData[i]]
                })
            }
        }
        var list = formatScreenData.map(function(item, i){
            var itemList = '', itemListArr = [];
            for(var j=0; j<item.factoryData.length; j++){
                itemListArr.push(item.factoryData[j].f_name)
            }
            itemList = itemListArr.join('、')
            return(
                <div style={styles.subtitle_2}>{item.cityName}：<span style={{color:'#999'}}>{itemList}</span></div>
            )
        }.bind(this))
        
        var title = '优惠券使用说明',
            subtitle1 = '驿公里智能洗车大部分站点都可使用此券，仅有少数洗车点暂不支持使用优惠券，敬请谅解。',
            subtitle2 = '支持使用的站点列表（不定期更新）：';
        if(this.props.type){
            title = '套餐使用说明';
            subtitle1 = '部分站点暂不支持使用年卡支付，其余驿公里智能洗车站点均可使用。';
            subtitle2 = '暂不支持使用的站点列表（不定期更新）：';
        }else {
            title = '优惠券使用说明';
            subtitle1 = '驿公里智能洗车大部分站点都可使用此券，仅有少数洗车点暂不支持使用优惠券，敬请谅解。';
            if(canUse == '1'){       //可用优惠券门店
                subtitle1 = '该优惠券限驿公里智能洗车以下站点使用，更多站点在不断开放中，敬请期待。';
                subtitle2 = '支持使用的站点列表（不定期更新）：';
            }else if(canUse == '0'){       //不可用优惠券门店
                // if(this.props.factoryScreenVal != 1){
                //     subtitle1 = '该优惠券在以下驿公里站点暂不支持使用，给您带来不便，敬请谅解。';
                // }
                subtitle2 = '不支持使用的站点列表（不定期更新）：';
            }
            if(ticketScreenType == '13'){        //限站点
                subtitle1 = '该优惠券只限驿公里以下站点使用。';
                subtitle2 = '支持使用的站点：';
            }
        }
        if(this.props.shareInviteTicket){           //分享券站点列表文字
            title = '邀请好友获得1元洗车券使用说明',
            subtitle1 = '驿公里智能洗车大部分站点都可使用此券，仅有少数洗车点暂不支持使用优惠券，敬请谅解。',
            subtitle2 = '不支持使用的站点列表（不定期更新）：';
        }
        if(showScreenInfo){
            if(showScreenInfo.title!= undefined){
                title = showScreenInfo.title
            }
            if(showScreenInfo.subtitle1!= undefined){
                subtitle1 = showScreenInfo.subtitle1
            }
            if(showScreenInfo.subtitle2!= undefined){
                subtitle2 = showScreenInfo.subtitle2
            }
        }
        return(
            <div id="limitFactoryList" style={styles.ruleWrap}>
                <div style={styles.title}>{title}</div>
                <div style={styles.subtitle_1}>{subtitle1}</div>
                <div style={styles.subtitle_2}>{subtitle2}</div>
                {list}
                <div style={{height:"20px"}}></div>
            </div>
        )
    }
})
