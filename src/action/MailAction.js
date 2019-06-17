import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {message} from 'antd';
import ArticleStore from "../store/ArticleStore";

class MailAction {

    constructor(){
        this.generateActions('showEditModal', 'isLoading','title')   //注册action名字
    }

    loading(isLoding){
        return isLoding;
    }
    updateTitle(title){
        console.log(title)
        return title;
    }


    pageChange(pageNo,title) {

        this.fetchData({
            pageNo: pageNo,
            pageSize: 3,
            title:title

        });
        console.log(pageNo)

        return pageNo,title;
    }

    fetchData({pageNo,pageSize,title}) {
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
                        title:title
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


