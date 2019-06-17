import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {message} from 'antd';

class ContentAction {

    constructor(){
        this.generateActions('showEditModal', 'isLoading')
    }


    filterData({title}){
        let _self = this;
        return function (dispatch) {
            _self.loading(true)
            return RestAPI.request(`/api/app/article/findContent`,{
                title
            },'get',true).then((res) => {
                _self.loading(false);
                let data = {
                    content : res.articles,
                    total : res.total
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
export default alt.createAction(ContentAction)