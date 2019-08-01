/**
 * Created by C3 on 2018/8/4.
 */
import alt from 'app/alt';
import {Map, List} from 'immutable';
import PlayAction from 'action/PlayAction';
import Modal from "../components/Container/page/InnerPage/lch/Modal";
import Config from 'app/common';
import RestAPI from 'utils/rest-api';

class PlayStore {

    constructor() {
        this.state = this._getInitialState();
        this.bindActions(PlayAction);
    }

    _getInitialState() {
        return {
            play: Map({
                loading: false,
                thirdGames: List(),
                a1Lotteries: List(),
                hotLotteries: List(),
                lotteries: List(),
                titleList: List()
            }),
            userInfo: Map({
                loading: false,
                userInfoAccount: {},
                data: {},
            }),
            currentPlay: Map({
                loading: false,
                data: List()
            }),
            //通告
            notify: Map({
                loading: false,
                data: List()
            }),
            playContentData: Map({
                isShowRadioList:false,
                type:1,
                selectedNum:'',
                data: List()
            }),
            //當前開獎問題
            currentPlayData: Map({
                loading: false,
                currentLotteryCodePlay: '',//当前彩票
                currentLottery: {},
                currentLotteryName: '',
                currentNameItem: '',
                systemTime: 0,
                lastExpectInfo: {},//下期彩票信息
                nexExpect: '',//确认投注的期号
                lastExpectTime: '',//倒计时开奖时间
                quantity: 0,
                cartParams: List(),
                creditData: List(),
                betOrders: List(),
                data: List(),
                modaltext: '二元',
                lotteryHighLowType:0
            }),
            //近期開獎
            newestData: Map({
                recentData: List(),
                luzituData: List(),
                type: 0,
                unit: 1,
                codeType: ''
            }),
            //返點顯示
            pointList: Map({
                recentData: List(),
                data: List()
            }),
            gameRule: Map({
                data: ''
            }),
            loading: false,
            refreshFlag:true,
            refreshTips:true,//投注记录刷新
            currentExpectInfo: Map({
                data: {}
            }),
            btnLock:{
                betBtnDisabled:false
            },
            openInterval: true,
            newBet:{},
            changeLotteryPage:false,
            lotteryReturnMsg:"",
            betOrderData:{},//投注成功后的信息,
            winData: {},
            haveUrgency:null,
            newBalance:0,
            markSixData:[],
            signData:{},
            haveReceiveRedPacket:false,
        }
    }
    getActivityKey(key){
        this.setState(({refreshTips}) => ({
            refreshTips: key==0?true:false,
        }));
    }
    updataCurrentNameItem(name) {
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('currentNameItem', name)
        }));
    }

    updateUnit(modaltext) {
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('modaltext', modaltext)
        }));
    }
    saveLotteryReturnMsg(msg){
        this.setState({
            lotteryReturnMsg: msg
        })
    }

    updateCartParams(params) {
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('cartParams', List(params))
        }));
    }

    //更新路子图
    updateLuzituData(luzituData) {
        let oldData = this.state.newestData.get('luzituData').toArray();
        let type = this.state.newestData.get('type');
        let unit = this.state.newestData.get('unit');
        let codeType = this.state.newestData.get('codeType');
        let len = oldData.length;
        let len2 = oldData[0].length - 1;
        let firstUnit = Config.getTextOfLuzitu(unit, codeType, luzituData, type);
        let isNextCol = false;
        for (let i = len - 1; i >= 0; i--) {
            if (oldData[i][len2].text) {
                if (firstUnit === oldData[i][len2].text) {
                    if (i < len - 1) {
                        oldData[i + 1][len2].text = firstUnit;
                        oldData[i + 1][len2].expect = luzituData.expect;
                        oldData[i + 1][len2].animation = true;
                    }
                } else {
                    isNextCol = true;
                }
                break;
                //找到最后一個存在即跳出循环
            }
        }
        if (isNextCol) {
            //向下移一個坐標
            //k:横坐标
            //j:纵坐标
            for (let k = 0; k <= len2; k++) {
                for (let j = 0; j < len; j++) {
                    if (k === len2) {
                        if (j === 0) {
                            oldData[0][29].text = firstUnit;
                            oldData[0][29].expect = luzituData.expect;
                            oldData[0][29].animation = true;
                        } else {
                            oldData[j][len2].text = '';
                            oldData[j][len2].expect = '';
                            oldData[j][len2].animation = false;
                        }
                    } else {
                        oldData[j][k].text = oldData[j][k + 1].text;
                        oldData[j][k].expect = oldData[j][k + 1].expect;
                        oldData[j][k].animation = false;

                    }
                }
            }
        }
        this.setState(({newestData}) => ({
            newestData: newestData.set('luzituData', List(oldData))
        }));

    }

    updateExpect(currentExpectInfo) {
        let data = currentExpectInfo;
        this.setState(({currentExpectInfo}) => ({
            currentExpectInfo: currentExpectInfo.set('data', data)
        }));
    }

    isLoading(tips) {
        // console.log("isLoading",tips);
        this.setState(({loading}) => ({
            loading: tips,
        }));
    }


    updateLotteryName(name) {
        //选择大彩种
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('currentLotteryName', name),
            changeLotteryPage: new Boolean(true)
        }));
    }

    updateLastExpectInfo(item) {
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('lastExpectInfo', item)
                .set('nexExpect', item.expect)
        }));
    }

    updateTime(item) {
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('lastExpectTime', item)
        }));
    }
    openInterval(params){
        this.setState({
            openInterval:params
        })
    }

    getCurrentTime(time) {
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('systemTime', time)
        }));
    }
    onFilterPlay({ isShowRadioList, type, selectedNum, playContentData, tips, unitList}){
        this.setState(({playContentData}) => ({
            playContentData: playContentData.set('isShowRadioList', isShowRadioList)
                .set('type', type)
                .set('selectedNum', selectedNum)
                .set('playContentData', List(playContentData))
                .set('tips', tips)
                .set('unitList', List(unitList))
        }));
    }
    getCurrentLottery(time) {
        let data = time.current;
        let last = time.last;
        this.setState(({currentExpectInfo, currentPlayData}) => ({
            currentExpectInfo: currentExpectInfo.set('data', data),
            currentPlayData: currentPlayData.set('lastExpectInfo', last)
                .set('nexExpect', last.expect)

        }));
    }
    onRefreshRedPacket(){
        let username = sessionStorage.getItem("username");
        RestAPI.request(`/api/app/user/redPack/${username}/noreceive`, {}, 'get').then((res) => {
            this.setState({
                haveReceiveRedPacket:res
            });
        }).catch((error) => {
            console.log(error)
        });
    }
    onFetchOrder(betOrders) {
        let newList = [];
        if (!betOrders.tips) {
            newList = this.state.currentPlayData.get('betOrders').toArray().concat(betOrders.orders);
        } else {
            newList = betOrders.orders;
        }
        let {haveUrgency,expect, totalWinMoney} = betOrders;
        this.setState(({currentPlayData}) => ({
            newBalance:betOrders.balance,
            currentPlayData: currentPlayData.set('betOrders', List(newList)),
            newBet:betOrders.orders[0],
            expect,
            totalWinMoney,
            haveUrgency,

        }));
    }

    onFetchDataNotify(data) {
        this.setState(({notify}) => ({
            notify: notify.set('data', List(data))
        }));
    }
    getSignData(){
        let username = sessionStorage.getItem("username");
        RestAPI.request(`/api/app/user/activity/${username}/signInActivity/item`, null, 'get')
            .then(res=>{
                this.setState({
                    signData:res
                });
            })
            .catch(err=>{
            })
    }

    onBetPlay({tips,res,isCartLottery}) {
        if (tips) {
            if(isCartLottery){
                Modal.open('投注成功！');
            }else{
                this.saveLotteryReturnMsg('投注成功！');
            }
            let btnLock = Object.assign({},this.state.btnLock,{betBtnDisabled: false})
            this.setState({
                btnLock,
                betOrderData:res,
                changeLotteryPage: new Boolean(true)
            });
        }
    }

    onGetPointList(points) {
        this.setState(({pointList}) => ({
            pointList: pointList.set('data', List(points))
        }));
    }

    onGetRecentExpect({recentResult, luzituData, type, unit}) {
        // if(Array.isArray(type)){
        //     type=type[0]+','+type[1]
        // }
        // console.log('iiii',type);
        this.setState(({newestData}) => ({
            newestData: newestData.set('recentData', List(recentResult))
                .set('luzituData', List(luzituData))
                .set('type', type)
                .set('unit', unit)
        }));
    }

    onGetRecentExpectRefresh(recentResult) {
        this.setState(({newestData}) => ({
            newestData: newestData.set('recentData', List(recentResult))

        }));
    }

    onFetchData({list}) {
        this.setState(({play, currentPlayData}) => ({
            play: play.set('a1Lotteries', List(list[1]['lotterysLists']))
                .set('lotteries', List(list[2]['lotterysLists']))
                .set('thirdGames', List(list[3]['lotterysLists']))
                .set('hotLotteries', List(list[0]['lotterysLists']))
                .set('titleList',List(list)),
            currentPlayData: currentPlayData.set('currentLotteryName', list[0]['lotterysLists'][0].name)
                .set('currentLotteryCodePlay', list[0]['lotterysLists'][0].code)

        }));
    }

    onGetUserInfo(data) {
        this.setState(({userInfo}) => ({
            userInfo: userInfo.set('userInfoAccount', data)
        }));
    }

    onGetUser(data) {
        this.setState(({userInfo}) => ({
            userInfo: userInfo.set('data', data)
        }));
    }
    onSetBtnDisabled({_state,type}){
        let btnLock = Object.assign({},this.state.btnLock,{[_state]: type})
        this.setState({btnLock});
    }
    clearCurrentLottery(data){
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData
                .set('currentLotteryCodePlay', data),
        }));
    }
    onCurrentPlay({gamePlay, name,code}) {
        // console.log('code',code);
        // console.log('gamePlay',gamePlay);
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('data', List(gamePlay))
                .set('currentNameItem', name)
                .set('currentLotteryCodePlay', code),
            loading:false
        }));
    }
    onChangeLotteryHighLowType(type){
        this.setState(({currentPlayData})=>({
            currentPlayData:currentPlayData.set("lotteryHighLowType",type)
        }));
    }

    onCreditCurrentPlay(data) {
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('creditData', List(data))
        }));
    }

    onGetCurrentRule(data) {
        this.setState(({gameRule}) => ({
            gameRule: gameRule.set('data', data.gameRule)

        }));
    }

    onGetQuantity(data) {
        let btnLock = Object.assign({},this.state.btnLock,{betBtnDisabled: false})
        this.setState(({currentPlayData}) => ({
            currentPlayData: currentPlayData.set('quantity', data.quantity),
            btnLock
        }));
    }

}

export default alt.createStore(PlayStore);