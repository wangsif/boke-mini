import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import Modal from "../components/Container/page/InnerPage/lch/Modal";
import {map} from 'lodash/fp';
import Config from 'app/common';

class PlayAction {

    constructor() {
        this.generateActions('updateLuzituData', 'updateLotteryName', 'getCurrentLottery', 'getCurrentTime', 'updateLastExpectInfo',
            'isLoading', 'updateCartParams', 'updateExpect', 'updateUnit', 'updateTime', 'updataCurrentNameItem', 'openInterval',
            "saveLotteryReturnMsg", 'getActivityKey','clearCurrentLottery','getSignData','refreshRedPacket',"changeLotteryHighLowType");
        this.firstLoadPoint = true;
    }

    fetchData(username) {
        let _self = this;
        return function (dispatch) {
            return RestAPI.request(`/api/app/home/typeInfo`, null, 'get', false)
                .then((res) => {
                    _self.currentPlay(res.list[0].lotterysLists[0].code);
                    _self.getUserInfo(username);
                    _self.getRecentExpect(res.list[0].lotterysLists[0].code, '-1', 0, 1);
                    // _self.getCurrentLottery(res.hotLotteries[0].code);
                    _self.fetchOrder(username, 1);
                    dispatch(res);
                }).catch(error => {
                    console.log(error)
                    // console.log("typeInfo:",error)
                    Modal.open(error);
                });
        }
    }

    fetchOrder(username, page, tips) {
        tips = tips === true ? tips : false;
        return function (dispatch) {
            return RestAPI.request(`/api/app/user/${username}/home-online`, {
                size: 15,
                page
            }, 'get')
                .then((res) => {
                    let data = {
                        orders: res.orders,
                        tips: tips,
                        expect: res.expects,
                        totalWinMoney: res.totalWinMoney,
                        haveUrgency: res.haveUrgency,
                        balance: res.balance
                    };
                    dispatch(data);
                }).catch((err) => {
                    Modal.open(err);
                });
        }
    }

    fetchDataNotify(username) {
        return function (dispatch) {
            return RestAPI.request(`/api/app/notify/${username}/notifies/1`, null, 'get', false)
                .then((res) => {
                    dispatch(res);
                }).catch(error => {
                    // console.log('err', error);

                    Modal.open(error);
                });
        }
    }

    getUserInfo(username) {
        let _self = this;
        return function (dispatch) {
            return RestAPI.request(`/api/app/user/${username}/account/user`, {username: username}, 'get')
                .then((res) => {
                    if(_self.firstLoadPoint){
                        _self.firstLoadPoint = false
                        _self.getPointList('元', res.highFrequencyReturnPoint,0);
                    }
                    sessionStorage.setItem('highPointAndLowPoints', res.highFrequencyReturnPoint+"/"+res.lowFrequencyReturnPoint);
                    dispatch(res);
                }).catch(error => {
                    Modal.open(error);
                });
        }
    }



    getPointList = (modaltext, point,pointType) => {
        let type = modaltext;
        let heightPoints=0,
            lowPoints=0;
        if(pointType===0){
            heightPoints = Number(point) ? Number(point) : Number(sessionStorage.getItem('highPointAndLowPoints').split("/")[0]);
        }else{
            lowPoints= Number(point) ? Number(point) : Number(sessionStorage.getItem('highPointAndLowPoints').split("/")[1]);
        }
        return function (dispatch) {
            return RestAPI.request(`/api/app/home/point/${type}`, {heightPoints,lowPoints}, 'GET')
                .then((res) => {
                    let data = pointType===0? res.heightPoints:res.lowPoints
                    dispatch(data);
                }).catch((error) => {
                    Modal.open(error);
                })
        }

    };

    betPlay(username, params, tips, isCartLottery) {
        let _self = this;
        this.setBtnDisabled("betBtnDisabled", true);
        // 对下注 的信息加密
        // if (params !== undefined) {
        //     let orders = params.orders
        //     for (let i = 0; i < orders.length; i++) {
        //         orders[i].betData = zip(orders[i].betData)
        //     }
        //     params.orders = orders
        // }
        return function (dispatch) {
            return RestAPI.request(`/api/app/user/${username}/order`, params, 'post')
                .then((res) => {
                    _self.getUserInfo(sessionStorage.getItem('username'));
                    if (tips) {
                        _self.fetchOrder(username, 1, true)

                    }
                    _self.isLoading(false);
                    let data = {
                        tips: 1,
                        res: res,
                        isCartLottery: isCartLottery ? true : false
                    }
                    dispatch(data);
                }).catch(error => {
                    _self.isLoading(false);
                    _self.setBtnDisabled("betBtnDisabled", false);
                    Modal.open(error);
                });
        }
    }
    currentPlay(code) {
        let currentLotteryCodePlay = code;
        let _self = this;
        _self.isLoading(true);
        return function (dispatch) {
            let status = code == 'lhc' ? 1 : 0;
            return RestAPI.request(`/api/app/lottery/${currentLotteryCodePlay}/purchase/${status}`, {}, 'get', false)
                .then((res) => {
                    let gamePlay = [];
                    let officialInfo = res;
                    let i = 0, j = 0;
                    for (let playGroup of Object.keys(officialInfo)) {
                        let item = {};
                        item.value = playGroup;
                        item.children = [];
                        let officialPlayGroup = officialInfo[playGroup];
                        for (let officialPlayItem of officialPlayGroup) {

                            let subItem = officialPlayItem;
                            subItem.label = officialPlayItem.name;
                            subItem.value = i + '|' + j;
                            item.children.push(subItem);
                            j++;
                        }
                        gamePlay.push(item);
                        i++;
                        j = 0;
                    }
                    let name = gamePlay[0].children[0].name;
                    let idx = 0;
                    gamePlay.map((item, index) => {
                        if (item.value === '定位胆') {
                            name = item.children[0].label;
                            idx = index
                        }
                        if(item.value==='猜特码'){
                            name = item.children[0].label;
                            idx = index
                        }
                    });
                    let data = {
                        gamePlay,
                        name,
                        code: currentLotteryCodePlay
                    };
                    // console.log('gamePlay[idx].children[0].purchaseKey',gamePlay[idx].children[0].purchaseKey)
                    if(currentLotteryCodePlay==="lhc"){
                        _self.getCurrentRule(gamePlay[idx].children[0].purchaseKey, 'credit');
                    }else{
                        _self.getCurrentRule(gamePlay[idx].children[0].purchaseKey, 'official');
                    }
                    // _self.isLoading(false);
                    dispatch(data);
                }).catch(error => {
                    Modal.open(error);
                    _self.isLoading(false);

                });
        }
    }

    creditCurrentPlay(code, type) {
        let currentLotteryCodePlay = code;
        let isCredit = type;
        return function (dispatch) {
            return RestAPI.request(`/api/app/lottery/${currentLotteryCodePlay}/purchase/${isCredit}`, {}, 'get', false)
                .then((res) => {
                    let menuData = [], checkedBet = {};
                    let creditInfo = res;
                    let isFirst = true;
                    for (let playGroup in creditInfo) {
                        checkedBet[playGroup] = 0;
                        let item = {};
                        item.text = playGroup;
                        item.key = playGroup;
                        let itemContentData = {};
                        let creditPlayGroup = creditInfo[playGroup];
                        for (let play in creditPlayGroup) {
                            let creditPlayItem = creditPlayGroup[play];
                            let oddsJson = JSON.parse(creditPlayItem['oddsJson']);
                            let contentItemArr = [];
                            for (let key in oddsJson) {
                                let contentItem = {
                                    check: false,
                                    text: key + ' ' + oddsJson[key],
                                    oddsJson: oddsJson[key],
                                    purchaseKey: creditPlayItem.purchaseKey
                                };
                                contentItemArr.push(contentItem);
                            }
                            itemContentData[creditPlayItem.name] = contentItemArr;
                        }
                        item.contentData = itemContentData;
                        menuData.push(item);

                        if (isFirst) {
                            //设置默认选中的索引值为第一个
                            item.index = 0;
                            isFirst = false;
                        }
                    }
                    dispatch(menuData, currentLotteryCodePlay);
                }).catch(error => {
                    Modal.open(error);
                });
        }
    }
    getRecentExpect = (lotteryCode, term, type, unit) => {
        let _self = this;
        let codeType = Config.judgeCode(lotteryCode);
        return function (dispatch) {
            return RestAPI.request(`/api/app/lottery/award/log/${lotteryCode}`, {sign: term, size: 100}, 'get', false)
                .then((res) => {
                    let tableBodyOne = _self.getLuzituData(res, type, unit, codeType);
                    let data = {
                        type: type ? type : 0,
                        unit: unit ? unit : 1,
                        recentResult: res,
                        codeType: codeType,
                        luzituData: tableBodyOne
                    };
                    dispatch(data);
                }).catch(error => {
                    // console.log("error",error);
                    Modal.open(error);
                });
        }
    };
    getRecentExpectRefresh = (lotteryCode, term) => {
        let _self = this;
        return function (dispatch) {
            return RestAPI.request(`/api/app/lottery/award/log/${lotteryCode}`, {sign: term, size: 100}, 'get', false)
                .then((res) => {
                    dispatch(res);
                }).catch(error => {
                    // console.log("error",error);
                    Modal.open(error);
                });
        }
    };
    getLuzituData = (res, type, unit, codeType) => {
        type = type ? type : 0;
        unit = unit ? unit : 1;
        // console.log('codeType',codeType)
        //unit:1大小2龙虎3单双（默认大小）
        let tableBodyOne = [];
        for (let i = 0; i < 8; i++) {
            tableBodyOne[i] = [];
            for (let j = 0; j < 30; j++) {
                tableBodyOne[i][j] = {
                    num: '',
                    text: '',
                    expect: '',
                    animation: false,
                };
                tableBodyOne[i][j]['num'] = i + ',' + j;
            }
        }
        let flag = false;
        let status = '';
        let tips = '';
        let firstUnit = '';
        let widthLen = tableBodyOne[0].length - 1;
        for (let i = 7; i >= 0; i--) {
            for (let j = 0; j < 30; j++) {
                let itemResult = res[Math.abs(i - (tableBodyOne.length - 1)) * 30 + j];
                let itemExpect = itemResult.expect;
                if (!itemResult || !itemExpect) {
                    continue;
                }
                //时时彩
                firstUnit = Config.getTextOfLuzitu(unit, codeType, itemResult, type);
                let x, y;
                if (firstUnit === tips) {
                    status = status < (tableBodyOne.length - 1) ? status + 1 : status;
                    tableBodyOne[status][flag].text = firstUnit;
                    tableBodyOne[status][flag].expect = itemExpect;
                } else {
                    if (flag === false) {
                        x = 0;
                        y = widthLen;
                        flag = widthLen;
                    } else {
                        for (let k = 0; k < status / 2; k++) {
                            //数组对调位置
                            let text_one = tableBodyOne[k][flag];
                            let text_two = tableBodyOne[status - k][flag];
                            tableBodyOne[status - k][flag] = text_one;
                            tableBodyOne[k][flag] = text_two;
                        }
                        if (Number(flag - 1) === -1) {
                            return tableBodyOne
                        }
                        x = 0;
                        y = Number(flag - 1);
                        flag = flag - 1;
                    }
                    tableBodyOne[x][y].text = firstUnit;
                    tableBodyOne[x][y].expect = itemExpect;
                    status = 0;
                }
                tips = firstUnit;
            }
        }
    };
    getCurrentRule = (purchaseKey, purchaseType) => {
        let _self = this;
        return function (dispatch) {
            return RestAPI.request(`/api/app/lottery/purchase/${purchaseKey}/${purchaseType}`, null, 'get', false)
                .then((res) => {
                    let Arr = '';
                    if (res.example||res.instructions) {
                        res.example = res.example.split('<br>');
                        res.example.map((item) => {
                            Arr = Arr + item;
                        });
                        let data = {
                            gameRule: Arr + '例如：' + res.instructions
                        };
                        dispatch(data);

                    } else {
                        let data = {
                            gameRule: '暂无玩法介绍'
                        };
                        dispatch(data);
                    }
                }).catch(error => {
                    Modal.open(error);
                });
        }
    };

    setBtnDisabled = (_state, type) => {
        return function (dispatch) {
            dispatch({_state, type})
        }
    }


    getQuantity = (currentLotteryCodePlay, params) => {
        this.setBtnDisabled("betBtnDisabled", true);
        return function (dispatch) {
            return RestAPI.request(`/api/app/lottery/calc/${currentLotteryCodePlay}`, params, 'post', false)
                .then((res) => {
                    dispatch(res);
                }).catch(error => {
                    Modal.open(error);
                });
        }
    };
    getUser = (username) => {
        return function (dispatch) {
            return RestAPI.request(`/api/app/user/${username}/info`, null, 'get')
                .then((res) => {
                    dispatch(res);
                }).catch(error => {
                    Modal.open(error);
                });
        }
    };
    // getCurrentLottery = (lotteryCode) => {
    //     let that = this;
    //     return function (dispatch) {
    //         return RestAPI.request(`/api/app/lottery/expect/${lotteryCode}`, null, 'get', false)
    //             .then((res) => {
    //                 dispatch(res);
    //                 // that.isLoading(false);
    //             }).catch(error => {
    //                 Modal.open(error);
    //                 // that.isLoading(false);
    //             });
    //     }
    // };
}

export default alt.createActions(PlayAction);
