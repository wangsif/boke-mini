import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {message} from 'antd';
import Config from 'app/common';

class MailAction {
    constructor(){
        this.generateActions( 'isLoading')
    }
    loading(isLoding){
        return isLoding;
    }

    fetchData({pageNo=1,pageSize=3,title}) {
        let _self = this;
        return function (dispatch) {
            _self.loading(true)
            return RestAPI.request(`/api/app/article/findBoke`, {
                title,
                pageNo,
                pageSize},'get',true)
                .then((res) => {
                    _self.loading(false);
                    let data = {
                        article1: res.articles,
                        total: res.total,
                    };
                    console.log(data)
                    dispatch(data);
                }).catch(error => {
                    _self.loading(false);
                    message.error(error.message);
                });
        }
    }
}
export default alt.createActions(MailAction)


