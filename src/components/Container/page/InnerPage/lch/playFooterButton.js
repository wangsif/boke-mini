import React from "react";
import {Button, Modal as AntModal} from "antd";
import {connect} from "alt-react";
import PlayStore from "store/PlayStore";
class PlayFooterButton extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showOrderState:false
        }
    }
    render(){
        let {lotteryReturnMsg,betBtnDisabled} = this.props;
        return (
            <div className="playFooterBtn">
                <p style={lotteryReturnMsg===""?{display:"none"}:{display:"block",float:"left"}}>{lotteryReturnMsg}</p>
                <div style={lotteryReturnMsg===""?{display:"block"}:{display:"none"}}>
                    <Button onClick={this.onClickCancel.bind(this,false)}>取消</Button>
                    <Button onClick={this.onClickOk} type="primary" disabled={betBtnDisabled}>确认</Button>
                </div>
                <Button style={lotteryReturnMsg===""?{display:"none"}:{display:"inline-block"}} onClick={this.onClickCancel.bind(this,true)}>关闭</Button>
            </div>
        )
    }
    onClickOk=()=>{
        let {lotteryBet,lotteryBetChase,isChase} = this.props;
        if(isChase){
            lotteryBetChase(3);
            return;
        }
        lotteryBet(3);
    }
    onClickCancel=(param)=>{
        let {setLotteryVisible,toClearAllCheck} = this.props;
        if(param){//关闭才做清空
            toClearAllCheck();
        }
        setLotteryVisible(false);
    }
}
export default connect(PlayFooterButton, {
    listenTo() {
        return [PlayStore];
    },
    getProps() {
        return {
            lotteryReturnMsg: PlayStore.getState().lotteryReturnMsg,
            betBtnDisabled:PlayStore.getState().btnLock.betBtnDisabled,
        }
    }

});