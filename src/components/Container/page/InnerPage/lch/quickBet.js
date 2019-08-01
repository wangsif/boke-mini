import React from "react";
import {quickBetTwoFace,quickBetShengxiao,quickBetHeadLast,quickBetColor} from "./quickBetItem";

export default class QuickBet extends React.Component{
    constructor(props) {
        super(props);
        this.checkItemArr = [];
        this.state = {
            quickBetTwoFace:quickBetTwoFace,
            quickBetShengxiao:quickBetShengxiao,
            quickBetHeadLast:quickBetHeadLast,
            quickBetColor:quickBetColor,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let {quickBetTwoFace, quickBetShengxiao, quickBetHeadLast, quickBetColor} = nextState;
        if(nextProps.clearState!==this.props.clearState&&nextProps.clearState){
            quickBetTwoFace.map(value=>value.check=false);
            quickBetShengxiao.map(value=>value.check=false);
            quickBetHeadLast.map(value=>value.check=false);
            quickBetColor.map(value=>value.check=false);
            this.checkItemArr = []
        }
        return true;
    }

    render() {
        let {quickBetTwoFace,quickBetShengxiao,quickBetHeadLast,quickBetColor} = this.state;
        return (
            <div id="LHCQuickBet">
                <div className="lhc_quick_bet_title">快速投注</div>
                <ul className="lhc_quick_bet clearfix">
                    <li>
                        {quickBetTwoFace.map((val,ind)=>{
                            return (
                                <a key={ind} style={val.check?{backgroundColor:"#ffbe65"}:null} onClick={this.handleSelected.bind(this,quickBetTwoFace,ind)}>{val.quickBetName}</a>
                            );
                        })}
                    </li>
                    <li>
                        {quickBetShengxiao.map((val,ind)=>{
                            return (
                                <a key={ind} style={val.check?{backgroundColor:"#ffbe65"}:null} onClick={this.handleSelected.bind(this,quickBetShengxiao,ind)}>{val.quickBetName}</a>
                            );
                        })}
                    </li>
                    <li>
                        {quickBetHeadLast.map((val,ind)=>{
                            return (
                                <a key={ind} style={Object.assign({color:val.color},val.check?{backgroundColor:"#ffbe65"}:null)} onClick={this.handleSelected.bind(this,quickBetHeadLast,ind)}>{val.quickBetName}</a>
                            );
                        })}
                    </li>
                    <li style={{width:"152px"}}>
                        {quickBetColor.map((val,ind)=>{
                            return (
                                <a key={ind} style={Object.assign({color:val.color},val.check?{backgroundColor:"#ffbe65"}:null)} onClick={this.handleSelected.bind(this,quickBetColor,ind)}>{val.quickBetName}</a>
                            );
                        })}
                    </li>
                </ul>
            </div>
        )
    }
    handleSelected = (data,index)=>{
        let {checkItemHandle} = this.props;
        data[index]["check"] = !data[index]["check"];
        let {checkItemArr} = this;
        let indexIte = checkItemArr.indexOf(data[index].quickBetName);
        if(indexIte!==-1){
            checkItemArr.splice(indexIte,1);
        }else {
            checkItemArr.push(data[index].quickBetName);
        }
        this.checkItemArr = checkItemArr;
        this.setState({
            [data]:data,
        });
        checkItemHandle(data[index].quickBetName,data[index]["check"],checkItemArr);
    }
}