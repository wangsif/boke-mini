import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import Config from '../app/common';
import QuestionStore from 'store/QuestionStore'
import {message} from 'antd';

class QuestionAction {
    constructor() {
        this.generateActions('showModels')
    }

    loading(isLoading) {
        return isLoading;
    }

    filterChange({questionType, keyword}) {
        let pageSize = 10;
        let pageNo = 1;
        let classifyKnowledgePath = '';
        this.fetchData({pageNo, pageSize}, {classifyKnowledgePath, questionType, keyword});
        return {pageNo, pageSize, questionType, keyword};
    }

    pageChange(pageNo) {
        let {filter} = QuestionStore.getState();
        this.fetchData({
            pageNo: pageNo,
            pageSize: 10,
        }, filter.toJS());

        return {pageNo};
    }

    modifyQuestion(id, title, categoryInPaper, questionType, classifyKnowledgePath, classifyKnowledge, choose,
                   answer, description, area, limitedTime, score) {
        let _self = this;
        let url = `/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/modify`;
        RestAPI.request(url, {
            id, title, categoryInPaper, questionType, classifyKnowledgePath, classifyKnowledge, choose,
            answer, description, area, limitedTime, score
        }, 'post', true).then((res) => {
            message.success("修改成功");
            let {question} = QuestionAction.getState();
            _self.pageChange(question.get("pageNo"))
        }).catch((error)=> {
            message.error(error.message)
        });
    }

    fetchData({pageSize, pageNo}, {classifyKnowledgePath, questionType, keyword}) {
        let _self = this;
        return function (dispatch) {
            _self.loading(true);
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/question/questions`, {
                classifyKnowledgePath: classifyKnowledgePath ? classifyKnowledgePath : '',
                questionType: questionType ? questionType : '',
                keyword: keyword ? keyword : '',
                pageNo: pageNo,
                pageSize: 10
            }, 'get', true)
                .then((res) => {

                    _self.loading(false);
                    let data = {
                        questionDetails: res.questionDetails,
                        total: res.total,
                        pageNo: pageNo,
                        pageSize: 10
                    };

                    dispatch(data);
                }).catch(error => {
                    _self.loading(false);
                    message.error(error.message);
                });
        }
    }
}

export default alt.createActions(QuestionAction);