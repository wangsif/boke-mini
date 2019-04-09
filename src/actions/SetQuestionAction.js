import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {Button, message, Popconfirm} from 'antd';
import {map} from 'lodash/fp';
import SetQuestionStore from 'store/SetQuestionStore';
import Config from 'app/common';
import React from "react";

class SetQuestionAction {

    constructor() {
        this.generateActions('showEditModal', 'editRow', 'isLoading')
    }

    loading(isLoding) {
        return isLoding;
    }

    pageChange(pageNo) {
        let {setQuestion, filter} =SetQuestionStore.getState();

        this.fetchData({
            pageNo: pageNo,
            pageSize: setQuestion.get('pageSize')
        }, filter.toJS());

        return pageNo;
    }

    deleteRow(id) {
        let _self = this;
        let {setQuestion} = SetQuestionStore.getState();

        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/setQuestion/${id}/item`, {},
                'delete',
                true
            ).then((data) => {
                message.success('删除成功！');
                _self.fetchData({
                    pageNo: setQuestion.get('pageNo'),
                    pageSize: setQuestion.get('pageSize')
                },SetQuestionStore.getState().filter.toJS());
            }).catch(error => {
                message.error('删除失败！' + error.message);
            });
        }

    }

    add(answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,) {
        var _self = this;
        let {setQuestion} = SetQuestionStore.getState();
        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/setQuestion/item`,
                {
answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,
                },
                'POST',
                true
            ).then((data) => {
                message.success('添加成功！');
                _self.showEditModal(false);
                _self.fetchData({
                    pageNo: setQuestion.get('pageNo'),
                    pageSize: setQuestion.get('pageSize')
                },SetQuestionStore.getState().filter.toJS());
            }).catch(error => {
                message.error("添加失败");
            });
        }
    }

    update(editSetQuestionDataId,val) {
        var _self = this;
        if(val[`classifyKnowledgePath`].length>2){
            val[`classifyKnowledgePath`]=val[`classifyKnowledgePath`][1];
        }else{
            val[`classifyKnowledgePath`]=val[`classifyKnowledgePath`][0];
        }
        val[`id`]=editSetQuestionDataId
        let {setQuestion} = SetQuestionStore.getState();
        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/setQuestion/item`,
                val,
                'POST',
                true
            ).then((data) => {
                message.success('修改成功！');
                _self.showEditModal(false);
                _self.fetchData({
                    pageNo: setQuestion.get('pageNo'),
                    pageSize: setQuestion.get('pageSize')
                },SetQuestionStore.getState().filter.toJS());
            }).catch(error => {
                message.error('修改失败！' + error.message);
            });

        }

    }

    filterChange(setId,keyword) {
        let pageNo = 1;
        this.fetchData({
            pageNo,
            pageSize: SetQuestionStore.getState().setQuestion.get('pageSize')
        }, {
            setId,keyword
        });
        return {
           setId,keyword
        };
    }

    fetchData({pageNo, pageSize}, {setId,keyword}) {
        let _self = this;
        keyword = keyword?keyword:''
        setId = setId?setId:''
        return function (dispatch) {
            _self.loading(true);
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/setQuestion/list`, {
                pageNo,setId,keyword,
                pageSize},'get',true)
                .then((res) => {
                    _self.loading(false);
                    let data = {
                    setQuestion: res.setQuestions,
                        total: res.total,
                    };
                    dispatch(data);

                }).catch(error => {
                    _self.loading(false);
                    message.error(error.message);
                });
        }
    }

}


export default alt.createActions(SetQuestionAction);
