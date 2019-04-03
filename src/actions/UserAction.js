import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {message} from 'antd';
import {map} from 'lodash/fp';
import UserStore from 'store/UserStore';
import Config from 'app/common';

class SetQuestionAction {

    constructor() {
        this.generateActions('showEditModal', 'editRow', 'isLoading')
    }

    loading(isLoding) {
        return isLoding;
    }

    pageChange(pageNo) {
        let {userInfos, filter} =UserStore.getState();

        this.fetchData({
            pageNo: pageNo,
            pageSize: userInfos.get('pageSize')
        }, filter.toJS());

        return pageNo;
    }

    // deleteRow(id) {
    //     let _self = this;
    //     let {userInfos} = UserStore.getState();
    //
    //     return function (dispatch) {
    //         return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/user/${id}/item`, {},
    //             'delete',
    //             true
    //         ).then((data) => {
    //             message.success('删除成功！');
    //             _self.fetchData({
    //                 pageNo: userInfos.get('pageNo'),
    //                 pageSize: userInfos.get('pageSize')
    //             },UserStore.getState().filter.toJS());
    //         }).catch(error => {
    //             message.error('删除失败！' + error.message);
    //         });
    //     }
    //
    // }
    //
    // add(username,nickName,id,gender,phone,createTime) {
    //     var _self = this;
    //     let {userInfos} = UserStore.getState();
    //     return function (dispatch) {
    //         return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/user/item`,
    //             {
    //                 answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,
    //             },
    //             'POST',
    //             true
    //         ).then((data) => {
    //             message.success('添加成功！');
    //             _self.showEditModal(false);
    //             _self.fetchData({
    //                 pageNo: userInfos.get('pageNo'),
    //                 pageSize: userInfos.get('pageSize')
    //             },UserStore.getState().filter.toJS());
    //         }).catch(error => {
    //             message.error("添加失败");
    //         });
    //     }
    // }

    // update(username,nickName,id,gender,phone) {
    //     var _self = this;
    //     let {userInfos} = UserStore.getState();
    //     return function (dispatch) {
    //         return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/user/${id}/item`,
    //             {
    //                 username,nickName,id,gender,phone
    //             },
    //             'POST',
    //             true
    //         ).then((data) => {
    //             message.success('修改成功！');
    //             _self.showEditModal(false);
    //             _self.fetchData({
    //                 pageNo: userInfos.get('pageNo'),
    //                 pageSize: userInfos.get('pageSize')
    //             },UserStore.getState().filter.toJS());
    //         }).catch(error => {
    //             message.error('修改失败！' + error.message);
    //         });
    //
    //     }
    //
    // }

    filterChange(username,nickName,id,gender,phone,createTime) {
        let pageNo = 1;
        this.fetchData({
            pageNo,
            pageSize: UserStore.getState().userInfos.get('pageSize')
        }, {
            username,nickName,id,gender,phone,createTime
        });
        return {
            username,nickName,id,gender,phone,createTime
        };
    }

    fetchData({pageNo, pageSize}, {username,nickName}) {
        let _self = this;
        return function (dispatch) {
            _self.loading(true);
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null?'*':Config.getUserInfo().username}/user/list`, {
                username,nickName,
                pageNo,
                pageSize},'get',true)
                .then((res) => {
                    _self.loading(false);
                    let data = {
                        userInfos: res.userInfos,
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
