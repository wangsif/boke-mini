import alt from 'app/alt';
import {Map, List} from 'immutable';
import LchAction from 'action/LchAction';
import Modal from "../components/Container/page/InnerPage/lch/Modal";
import Config from 'app/common';
import RestAPI from 'utils/rest-api';

class LchStore {
    constructor(){
        this.state = this.__getInitialState();
        this.bindActions(LchAction);
    }

    __getInitialState(){
        return {
            lchData: Map({
                loading: false,
                data: List(),
                total: 0,
                pageNo: 1,
                pageSize: 10,
                totalMoney:""
            }),
            editModal: {
                show: false
            },
            editUserData: null
        }

    }

    onFetchData({lchData, allMoney}){
        let data = lchData;
        this.setState(({lchData}) => ({
            lchData: lchData.set('loading', false)
                .set('data', List(data))
                .set('total', allMoney)
        }));
        console.log(data)

    }

}
export default alt.createStore(LchStore);