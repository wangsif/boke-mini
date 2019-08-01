import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import Modal from "../components/Container/page/InnerPage/lch/Modal";
import {map} from 'lodash/fp';
import Config from 'app/common';
import {message} from "antd";


class LchAction {

    constructor(){
        this.generateActions('isLoading')
    }
    loading(isLoding) {
        return isLoding;
    }

    fetchData(){
        let _self = this;
        return function (dispatch) {
            _self.loading(true);
            return RestAPI.request(`/api/app/lch/findData`,{

            },'get',true).then((res) =>{
                _self.loading(false);
                let data = {
                    lchData:res.lchData,
                    allMoney:res.allMoney
                };
                console.log(_self)
                console.log(data)
                dispatch(data);
            }).catch(error => {
                _self.loading(false);
                message.error(error.message);
            });
        }
    }


    addSubject1(id,totalMoney){

        let _self = this;
        return RestAPI.request(`/api/app/lch/addMoney`,
            {
                id,totalMoney
            },
            'POST',
            true
        ).then(() => {
            message.success('添加成功！');
            _self.fetchData()
        }).catch(error => {
            message.error(error.message);
        });
    }

}
export default alt.createActions(LchAction);