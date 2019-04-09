import alt from 'app/alt';
import {Map, List} from 'immutable';
import QuestionDetailAction from 'actions/QuestionDetailAction';
import moment from 'moment';
import RestAPI from "../utils/rest-api";
import Config from "../app/common";
import {message} from "antd";
import QuestionDetailStore from "./QuestionDetailStore";

class UploadStore {
    constructor() {
        this.state = this._getInitialState();
        this.bindActions(UploadAction);
    }

    _getInitialState() {
        return {

        }
    }
    onUpdatUploadDetail(data){
        console.log(data)
        RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/question/${id}/item`,
            data,
            'POST',
            true
        ).then((data) => {
            message.success('修改成功！');
            _self.showEditModal(false);
            _self.fetchData({
                pageNo: questionDetail.get('pageNo'),
                pageSize: questionDetail.get('pageSize')
            },QuestionDetailStore.getState().filter.toJS());
        }).catch(error => {
            message.error('修改失败！' + error.message);
        });
    }

}

export default alt.createStore(UploadStore);
