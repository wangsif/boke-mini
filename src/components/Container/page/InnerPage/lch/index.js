import React from 'react';
import {Table, Row, Col, Input, Modal as AntModal} from 'antd'
import {trim} from "utils/utils";
import Modal from "../lch/Modal";
import PlayAction from "action/PlayAction";
import PlayFooterButton from "../lch/playFooterButton";
import {connect} from "alt-react";
import PlayStore from "store/PlayStore";
import {markSixLotteryQuickSelect} from "./markSixLotteryQuickSelect";
import QuickBet from "./quickBet";
import LchStore from "store/LchStore";
import LchAction from  "action/LchAction";

class Type1 extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            col:10,
            red:[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46],
            bule:[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48],
            green:[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49],
            numCount:49,
            betMoney:0,
            fixRebate:0,//用户固定返点
            rebate: 0,//返点
            pointList:[],
            betNumber: 0,
            maxFd:0, //最大返点
            hjOdds:0,
            lotteryVisible: false,
            average:0,
            totalMoney:"",
            afterLotteryBetData:{
                expect: "",
                betNumber: "",
                betMoney: "",
            },
            quickBet:false,
            clearState:false,
            quickBetMoney:0,
            betNum:0
        }
    }

    // k 当前列数
    // len 总列数
    _getTableData = (k,len,datas)=>{
        let oddsJson = {1: "48.000", 2: "48.000", 3: "48.000", 4: "48.000", 5: "48.000", 6: "48.000", 7: "48.000", 8: "48.000", 9: "48.000", 10: "48.000", 11: "48.000", 12: "48.000", 13: "48.000", 14: "48.000", 15: "48.000", 16: "48.000", 17: "48.000", 18: "48.000", 19: "48.000", 20: "48.000", 21: "48.000", 22: "48.000", 23: "48.000", 24: "48.000", 25: "48.000", 26: "48.000", 27: "48.000", 28: "48.000", 29: "48.000", 30: "48.000", 31: "48.000", 32: "48.000", 33: "48.000", 34: "48.000", 35: "48.000", 36: "48.000", 37: "48.000", 38: "48.000", 39: "48.000", 40: "48.000", 41: "48.000", 42: "48.000", 43: "48.000", 44: "48.000", 45: "48.000", 46: "48.000", 47: "48.000", 48: "48.000", 49: "48.000"}
        let {rebate,maxFd,hjOdds} = this.state
        let items = [];
        console.log(oddsJson)
        Object.keys(oddsJson).forEach((key,i)=>{
            //当i等于当前列数时(第一行) 如果不是第一列判断是否满足一个周期取模为0
            if(i == k || (i - k)%len == 0 && i != 0){
                items.push({
                    color:this.getContentNumColor(i + 1),
                    name:i + 1,
                    money:'',
                    odds:hjOdds,
                    check:false
                })
            }
        })
        return items
    }
    _getPointList = (point) =>{
        let pointList = []
        let basePoint = 0.1;
        for (let i = 0; i <= (point + 0.01) ; i = i + basePoint ){
            pointList.push(`${i.toFixed(1)}%`)
        }
        return pointList
    }

    _getBetData = (data) =>{
        let betNumber = 0
        let betData = '';
        let betMoney = ''
        for (let i=0;i<data.length ; i++){
            let item = data[i]
            console.log(item)
            item.map((e,index) => {
                if (e.money !== "" && e.money !==undefined&& e.money !=0){
                    if (betData!==''){
                        betData = betData + ',' + e.name
                        betNumber = betNumber + 1
                    }else{
                        betData = e.name
                    }

                    if (betMoney !== ''){
                        betMoney = betMoney + ',' + e.money
                    } else{
                        betMoney = e.money
                    }
                }
            })
        }
        this.setState({
            betNumber:betNumber
        })
        return betData + '&' + betMoney
    }
    handleQuickBet = (tip,check)=>{
        let {quickBet}  = this.state
        if(quickBet===tip){
            return;
        }
        if(check){
            this._clearBet()
            this.setState({
                quickBet:tip,
                betMoney:0
            });
            return;
        }
        this.setState({
            quickBet:tip,
        });
    }
    lotteryCheckBet=(tips)=>{
        let {isData,purchaseKey,code,currentPlayData} = this.props;
        let {betMoney,data,rebate,maxFd,fixRebate,afterLotteryBetData} = this.state
        let betDate = this._getBetData(data)
        let betNumber = betDate.split("&")[0].split(",").length
        let id = betDate.split("&")[0];
        let totalMoney = betDate.split("&")[1];
        console.log(betMoney)  //所选号数加起来的总金额
        console.log(betDate)  //所选号数以及各个号数的金额
        console.log(betNumber)  //选了几个号数
        console.log(id)
        console.log(totalMoney)
        this.myClick(id,totalMoney)
        if (betMoney === 0) {
            Modal.open('请输入单注额度');
            return;
        }
        if (betDate === ''){
            Modal.open('请输入单注额度');
            return;
        }
        let orders = [];
        let betTotalMoney = 0;
        let returnCount = rebate.substring(0,rebate.indexOf('%'))
        // let {expect} = currentPlayData.get('lastExpectInfo');
        this.setState({
            afterLotteryBetData: Object.assign(
                afterLotteryBetData, {
                    // expect: expect,
                    betNumber,
                    betMoney
                }),
        });
        returnCount = fixRebate - returnCount
        if (betDate) {
            let data = [{
                betData: betDate,
                betMoney: betMoney,
                betNumber: betNumber,
                multiple: 1,
                multipleUnit: '元',
                purchaseKey: purchaseKey,
                returnCount: returnCount,
            }];
            betTotalMoney = betMoney + betTotalMoney;
            let params = {
                betTotalMoney: betTotalMoney,
                lotteryCode: code,
                level: 1,
                orders: data
            };
            orders.push(params);
        } if(tips===1){
            this.setState({lotteryVisible:true});
        }else{
            this.lotteryBetChaseCredit(orders)
        }

    }
    betHandle = (id,idx)=>{
        let {data,quickBetMoney} = this.state;
        data[id][idx]["check"]=!data[id][idx]["check"]
        this.setState({data});
        this.quickBetCheckChange(data,quickBetMoney)
    }
    lotteryBetChaseCredit = (orders) => {
        let {toClearAllCheckCredit} = this.props;
        let len = orders.length;
        let username = sessionStorage.getItem('username');
        orders.map((item, index) => {
            if (index === (len - 1)) {
                PlayAction.betPlay(username, item, true,false);
                this._clearBet();
            } else {
                PlayAction.betPlay(username, item, false);
            }
        });
    };
    quickBetCheckChange = (data,quickBetMoney)=>{
        let checkNum = 0;
        data.map(ite=>{
            ite.map(arr=>{
                if(arr.check){
                    checkNum++;
                    arr["money"] = quickBetMoney
                }
            });
        });
        this.setState({data,betNum:checkNum,betMoney:quickBetMoney*checkNum});
    }
    _betOrder = (param) =>{
        console.log(param)

        this.lotteryCheckBet(param)
    }
    componentDidMount(){

        LchAction.fetchData();
    }

    componentWillMount(){
        let {userInfoAccount,purchaseKey,oddsJson} = this.props;
        let fd = "PlayAction";
        if (userInfoAccount!==null){
        }
        let lhcFd = 0;
        let maxFd = 0;
        let purchaseHjOdds = {}
        // let hjOdds = 0;
        if (fd != null ){
            for (let i = 0 ; i < fd.length ; i++){
                if (fd[i].lotteryCode === 'lhc'){
                    lhcFd = fd[i].fd
                    maxFd = fd[i].maxFd
                    purchaseHjOdds = fd[i]['purchaseHjOdds']
                    // hjOdds = purchaseHjOdds[purchaseKey] ?purchaseHjOdds[purchaseKey]:0;
                }
            }
        }
        let pointList = this._getPointList(lhcFd)
        this.setState({
            fixRebate:lhcFd.toFixed(1),
            rebate:lhcFd.toFixed(1) + "%",
            pointList:pointList,
            maxFd:maxFd,
            // hjOdds: hjOdds,
        },()=>{
            this._filterData()
        })
    }
    _filterData(){
        let items = new Array(49).fill(1).map((v,i)=>v+1);
        let len = Math.ceil(items.length / this.state.col);
        let data = [];
        for(let i = 0;i < len; i ++){
            data.push(this._getTableData(i,len,items));
        }
        this.setState({
            data
        })
    }
    _TableInputChange = (row,col,e)=>{
        let {data} = this.state;
        let intRex = /^([1-9]\d+|\d).*$/;
        let value = e.target.value;
        let betMoney = 0;
        let result = value.match(intRex)&&value.match(intRex)[1]?value.match(intRex)[1]:'';
        console.log(result)
        data[col][row]['money'] = result;
        data.forEach((items)=>{
            items.forEach((item)=>{
                betMoney += Number(item.money)
            })
        })
        this.setState({
            data,betMoney
        })

    }
    _clearBet = ()=>{
        let {data,betMoney,betNumber,quickBetMoney} = this.state
        for (let i=0;i<data.length ; i++){
            for (let j=0;j<data[i].length;j++){
                data[i][j].money = ''
                data[i][j]["check"] = false;
            }
        }
        quickBetMoney= 0
        betMoney = 0
        betNumber = 0
        this.setState({
            data:data,
            betMoney:betMoney,
            betNumber:betNumber,
            quickBetMoney:quickBetMoney,
            clearState:new Boolean(true)
        })
    }
    getContentNumColor=(val)=>{
        let {red,bule} = this.state;
        if(red.includes(val)){
            return "red";
        }else if(bule.includes(val)){
            return "blue";
        }else{
            return "green";
        }
    }
    _getContentNumStyle = (num)=>{
        let {red,bule} = this.state;
        if(red.includes(num)){
            return Object.assign({},style.TableContentSpan,style.backgroundColorRed);
        }else if(bule.includes(num)){
            return Object.assign({},style.TableContentSpan,style.backgroundColorBlue);
        }else{
            return Object.assign({},style.TableContentSpan,style.backgroundColorGreen);
        }
    }
    checkItemHandle=(checkIte,checkType,checkItemArr)=>{
        let {data,quickBetMoney} = this.state;
        if(checkItemArr.indexOf(checkIte)===-1){
            let resdata = markSixLotteryQuickSelect(checkIte,data,false);
            this.setState({data:resdata});
        }
        checkItemArr.map(val=>{
            let resdata = markSixLotteryQuickSelect(val,data,true);
            this.setState({data:resdata});
            this.handleQuickBet(true)
        });
        this.quickBetCheckChange(data,quickBetMoney)
    }
    myClick = (id,totalMoney) =>{
        LchAction.addSubject1(id,totalMoney)
    };
    render(){
        let {currentPlayData, lchData, lotteryReturnMsg, oddsJson} = this.props;
        let {afterLotteryBetData,quickBet,clearState,quickBetMoney,betNum,totalMoney} = this.state;
        //let currentLotteryName = currentPlayData.get('currentLotteryName');//大彩种名称
        let {data,betMoney,rebate,pointList} =  this.state;
        let len = Math.ceil(this.state.numCount / this.state.col);
        let flexStyle = {
            display:'flex',
            justifyContent:'spaceAround'
        }
        let {closeBetModal} = this.props;
        let meanData = lchData.get('total')/48;
        // let {userInfo} = this.props;
        // let {otherFrequencyReturnPointOdds} = "sdfsdfdf";
        // let lhc = 1;
        // let {purchaseHjOdds} = lhc;
        // let {lhc_credit_tm} = purchaseHjOdds;
        console.log(lchData.get('total'))
        console.log(this.props)
        return (
            <div className = 'markSixType1' style={{background:'#00A7B0' }}>
                <div className="selectTypeContent">
                    <span className="selectTypeItem" style={quickBet?{backgroundColor:"#9DA802"}:null} onClick={this.handleQuickBet.bind(this,false,true)}>常规</span>
                    <span className="selectTypeItem" style={quickBet?null:{backgroundColor:"#9DA802"}} onClick={this.handleQuickBet.bind(this,true,true)}>手工</span>
                </div>
                <Row type="flex" justify="center">
                    {
                        data.map((items,k)=>{
                            return (
                                <Col style = {{width:(100/len) + '%'}} key = {k}>
                                    <table style = {{width:'100%',fontSize:'8px'}}>
                                        <tbody>
                                        <tr>
                                            <td style = {Object.assign({},style.TableTitle,{width:'50%'})}>号码</td>
                                            {/*<td style = {Object.assign({},style.TableTitle,{width:'25%'})}>赔率</td>*/}
                                            {/*{quickBet?<td style = {Object.assign({},style.TableTitle,{width:'40%'})}>赔率</td>:<td style = {Object.assign({},style.TableTitle,{width:'40%'})}>金额/元</td>}*/}
                                            <td style={{width:'50%'}}>统计</td>
                                        </tr>
                                        {
                                            items.map((item,i)=>{
                                                // console.log(lchData.get('data').get(item.name-1))
                                                 //console.log(item.name)
                                                //console.log(len)
                                                let out = 0;
                                                if (lchData.get('data').get(item.name-1)!=undefined){
                                                    out = lchData.get('data').get(item.name-1).totalMoney;
                                                }
                                                if (lchData.get('data').get(item.name-1)!=undefined){
                                                    return (
                                                        <tr key = {i} onClick={quickBet?this.betHandle.bind(this,k,i):null}>

                                                            <td style = {Object.assign({},style.TableContent,{width:'50%'},item.check&&quickBet?{backgroundColor:"#ffbe65"}:null)}>
                                                                <span style = {this._getContentNumStyle(item.name)}>&nbsp;{item.name}</span>
                                                            </td>
                                                            {/*<td style = {Object.assign({},style.TableContent,{width:'25%'})}>{item.odds}</td>*/}
                                                            {/*<td style = {Object.assign({},style.TableContent,{width:'25%'})}>{lhc_credit_tm}</td>*/}
                                                            {/*{quickBet?<td style = {Object.assign({},style.TableContent,{width:'40%'},item.check?{backgroundColor:"#ffbe65"}:null)}>{"48"}</td>:<td style = {Object.assign({},style.TableContent,{width:'40%'})}><input style = {{width:'90%',height:'90%',overflow: 'visible',color:'red' ,background: "transparent", border: "1px solid #eaeaea",textIndent: "6px"}} className="betInput"  onChange = {(e)=>{*/}
                                                            {/*this._TableInputChange(i,k,e)*/}
                                                            {/*}} value = {item.money}*/}
                                                            {/*placeholder={`赔:  ${"48"}`}*/}
                                                            {/*></input></td>}*/}


                                                            {out > meanData ? <td style={{
                                                                    width: '50%',
                                                                    backgroundColor: "#A81300"
                                                                }}> &nbsp;&nbsp;&nbsp;{lchData.get('data').get(item.name - 1).totalMoney}</td> :
                                                                <td style={{width: '50%'}}> &nbsp;&nbsp;&nbsp;{lchData.get('data').get(item.name - 1).totalMoney}</td>}

                                                        </tr>
                                                    )
                                                }

                                            })
                                        }

                                        </tbody>
                                    </table>
                                </Col>
                            )
                        })
                    }
                </Row>

                <div className = 'playSubmitModel' ref = 'playSubmitModel'>
                    <div className="playCreditCard playContentBottomU">
                        <div className="playContentBottomU">
                            <div className="widthAuto playResultAddMultiple playPadding">
                                {/* <div className="inline-block">总注数：<span
                                    className="fontColor">{1}</span></div> */}
                                <div className="inline-block" style={{color:"red"}}>金额：<span
                                    className="fontColor">{betMoney}</span>元
                                </div>
                            </div>
                            {/*<div className="playResultAddMultiple left">*/}
                            {/*<div className="playResultText">返点：</div>*/}
                            {/*<div className="playResultText">*/}
                            {/*<select className="playResultSelect" onChange={(event) => {*/}
                            {/*this.setState({*/}
                            {/*rebate: event.target.value,*/}
                            {/*},()=>{*/}
                            {/*this._filterData()*/}
                            {/*});*/}
                            {/*}} value={rebate}>*/}
                            {/*{pointList ? pointList.map((item, index) => {*/}
                            {/*return (<option value={item}*/}
                            {/*key={index}>{item}</option>)*/}
                            {/*}) : null}*/}
                            {/*</select>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                            <div className=" inline-block right">
                                {quickBet?<input type="text" className="quickBetInput" placeholder="请输入单注金额" value={quickBetMoney} onChange={text=>{
                                    this.quickBetCheckChange(data,text.target.value);
                                    this.setState({quickBetMoney:text.target.value })
                                }}/>:null}
                                <button className="betNow resultBtn"
                                        onClick={this._clearBet}
                                        style={{background:"#ccc"}}
                                >清除
                                </button>
                                <button
                                    className={"resultBtn "+(betMoney>0||quickBetMoney>0&&(betNum>0)?"betNow ":"betNowDisabled")}
                                        disabled={betMoney===0&&(quickBetMoney===0||betNum===0)}
                                        onClick={this._betOrder.bind(this,1)}
                                >确定
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{fontSize:"50"}}>总金额：{lchData.get('total')}</div>
                    <QuickBet clearState={clearState} checkItemHandle={this.checkItemHandle}  handleQuickBet={this.handleQuickBet}/>
                    {closeBetModal?<div className = 'closeBetModal'>已封盘</div>:null}
                </div>
                {/*<AntModal*/}
                    {/*zIndex={1}*/}
                    {/*width={430}*/}
                    {/*centered*/}
                    {/*visible={this.state.lotteryVisible}*/}
                    {/*closable={false}*/}
                    {/*footer={<PlayFooterButton isChase={false}*/}
                                              {/*setLotteryVisible={this.setLotteryVisible}*/}
                                              {/*lotteryBet={this._betOrder}*/}
                                              {/*lotteryBetChase={()=>{}}*/}
                                              {/*toClearAllCheck={this._clearBet}*/}
                    {/*/>}*/}
                {/*>*/}
                    {/*<div className="confirmLottery clearfix">*/}
                        {/*<div className="confirmLotteryTitle clearfix">*/}
                            {/*<p className="confirmLotteryName left">{currentLotteryName}</p>*/}
                            {/*<p className="confirmLotteryOrder right">订单号：{(lotteryReturnMsg !== "" && betOrderData.orderNo) ? betOrderData.orderNo : "--"}</p>*/}
                        {/*</div>*/}
                        {/*<div className="confirmLotteryContainer">*/}
                            {/*<div className="confirmLotteryRow clearfix">*/}
                                {/*<p className="confirmLotteryLabel left">期号:</p>*/}
                                {/*<p className="confirmLotteryValue left">{afterLotteryBetData.expect}</p>*/}
                            {/*</div>*/}
                            {/*<div className="confirmLotteryRow clearfix">*/}
                                {/*<p className="confirmLotteryLabel left">注数:</p>*/}
                                {/*<p className="confirmLotteryValue left">{afterLotteryBetData.betNumber}</p>*/}
                            {/*</div>*/}
                            {/*/!*<div className="confirmLotteryRow clearfix">*!/*/}
                            {/*/!*<p className="confirmLotteryLabel left">{isChase ? "起始倍数" : "倍数"}:</p>*!/*/}
                            {/*/!*<p className="confirmLotteryValue left">{isChase ? beginTimes : betTimes}</p>*!/*/}
                            {/*/!*</div>*!/*/}
                            {/*<div className="confirmLotteryRow clearfix">*/}
                                {/*<p className="confirmLotteryLabel left">金额:</p>*/}
                                {/*<p className="confirmLotteryValue left">{afterLotteryBetData.betMoney}</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</AntModal>*/}

            </div>
        )
    }
    setLotteryVisible = (param) => {
        this.setState({
            lotteryVisible: param
        }, () => {
            if (!param) {
                PlayAction.saveLotteryReturnMsg("");
            }
        });
    }
}
export default connect(Type1, {
    listenTo() {
        return [LchStore];
    },
    getProps() {
        return {
            lchData: LchStore.getState().lchData,
        }
    }

});
const style = {
    flexStyle:{
        display:'flex',
        justifyContent:'spaceAround'

    },
    TableTitle:{display:'inlineBlock',fontWeight:'bold'},
    TableContent:{display:'inlineBlock',fontWeight:'bold'},
    TableContentSpan:{display:'inline-block',width:'21px',lineHeight:'21px',borderRadius:'50%',color:'#fff'},
    backgroundColorRed:{backgroundColor:'#FF4A62'},
    backgroundColorBlue:{backgroundColor:'#3D35FF'},
    backgroundColorGreen:{backgroundColor:'#14C20F'}

}
