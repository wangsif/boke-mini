import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {message} from 'antd';
import {map} from 'lodash/fp';
import QuestionDetailStore from 'store/QuestionDetailStore';
import Config from 'app/common';

class QuestionDetailAction {

    constructor() {
        this.generateActions('showEditModal', 'editRow', 'isLoading')
    }

    loading(isLoding) {
        return isLoding;
    }

    pageChange(pageNo) {
        let {questionDetail, filter} =QuestionDetailStore.getState();

        this.fetchData({
            pageNo: pageNo,
            pageSize: questionDetail.get('pageSize')
        }, filter.toJS());

        return pageNo;
    }

    deleteRow(id) {
        let _self = this;
        let {questionDetail} = QuestionDetailStore.getState();

        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/question/${id}/item`, {},
                'delete',
                true
            ).then((data) => {
                message.success('删除成功！');
                _self.fetchData({
                    pageNo: questionDetail.get('pageNo'),
                    pageSize: questionDetail.get('pageSize')
                },QuestionDetailStore.getState().filter.toJS());
            }).catch(error => {
                message.error('删除失败！' + error.message);
            });
        }

    }

    add(area,categoryInPaper,createTime,questionType,classifyKnowledge,description,choose,title,paperIds,score,answer,id,limitedTime,classifyKnowledgePath,) {
        var _self = this;
        let {questionDetail} = QuestionDetailStore.getState();
        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/question/item`,
                {
area,categoryInPaper,createTime,questionType,classifyKnowledge,description,choose,title,paperIds,score,answer,id,limitedTime,classifyKnowledgePath,
                },
                'POST',
                true
            ).then((data) => {
                message.success('添加成功！');
                _self.showEditModal(false);
                _self.fetchData({
                    pageNo: questionDetail.get('pageNo'),
                    pageSize: questionDetail.get('pageSize')
                },QuestionDetailStore.getState().filter.toJS());
            }).catch(error => {
                message.error("添加失败");
            });
        }
    }

    update( editQuestionDetailDataId,val) {
        var _self = this;
        val["classifyKnowledgePath"] = val["classifyKnowledgePath"][1];
        let {questionDetail} = QuestionDetailStore.getState();
        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/question/${editQuestionDetailDataId}/item`,
                val,
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


    filterChange({questionType,classifyKnowledgePath,keyword}) {
        let pageNo = 1;
        this.fetchData({
            pageNo,
            pageSize: QuestionDetailStore.getState().questionDetail.get('pageSize')
        }, {
            questionType,classifyKnowledgePath,keyword
        });
        return {
            questionType,classifyKnowledgePath,keyword
        };
    }

    fetchData({pageNo, pageSize}, {questionType,keyword,paperIds,score,answer,classifyKnowledgePath}) {
        let _self = this;
        return function (dispatch) {
            _self.loading(true);
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/question/list`, {
                questionType,keyword,classifyKnowledgePath,
                pageNo,
                pageSize},'get',true)
                .then((res) => {
                    _self.loading(false);
                    let data = {
                    questionDetail: res.questionDetails,
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


export default alt.createActions(QuestionDetailAction);
