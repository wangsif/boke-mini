import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {message} from 'antd';
import Config from 'app/common';
import ArticleStore from 'store/ArticleStore';

class ArticleAction {

    constructor(){
        this.generateActions('showEditModal', 'isLoading')
    }
    loading(isLoding){
        return isLoding;
    }
    pageChange(pageNo) {
        let {article, filter} =ArticleStore.getState();

        this.fetchData({
            pageNo: pageNo,
            pageSize: article.get('pageSize')
        }, filter.toJS());

        return pageNo;
    }


    fetchData({pageNo, pageSize}) {
        let _self = this;
        return function (dispatch) {
            _self.loading(true);
            return RestAPI.request(`/api/app/article/queryBoke`, {
                pageNo,
                pageSize},'get',true)
                .then((res) => {
                    _self.loading(false);
                    let data = {
                        article: res.articles,
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

export default alt.createActions(ArticleAction)