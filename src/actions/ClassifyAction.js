import alt from 'app/alt';
import RestAPI from 'utils/rest-api';
import {message} from 'antd';
import {map} from 'lodash/fp';
import ClassifyStore from 'store/ClassifyStore';
import Config from 'app/common';

class ClassifyAction {

    constructor() {
        this.generateActions('showEditModal', 'editRow', 'isLoading')
    }

    loading(isLoding) {
        return isLoding;
    }


    deleteRow(id) {
        let _self = this;
        let {classify} = ClassifyStore.getState();

        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/classify/delete/${id}/`, {},
                'delete',
                true
            ).then((data) => {
                message.success('删除成功！');
                _self.fetchData({
                    pageNo: classify.get('pageNo'),
                    pageSize: classify.get('pageSize')
                }, ClassifyStore.getState().filter.toJS());
            }).catch(error => {
                message.error('删除失败！' + error.message);
            });
        }

    }

    add(classifyName, pid,) {
        var _self = this;
        let {classify} = ClassifyStore.getState();
        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/classify/add`,
                {
                    classifyName, pid
                },
                'POST',
                true
            ).then((data) => {
                message.success('添加成功！');
                _self.showEditModal(false);
                _self.fetchData({
                    pageNo: classify.get('pageNo'),
                    pageSize: classify.get('pageSize')
                }, ClassifyStore.getState().filter.toJS());
            }).catch(error => {
                message.error("添加失败");
            });
        }
    }

    update(classifyName, pid, id,) {
        var _self = this;
        let {classify} = ClassifyStore.getState();
        return function (dispatch) {
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/classify/${id}/item`,
                {
                    classifyName, pid, id,
                },
                'POST',
                true
            ).then((data) => {
                message.success('修改成功！');
                _self.showEditModal(false);
                _self.fetchData({
                }, ClassifyStore.getState().filter.toJS());
            }).catch(error => {
                message.error('修改失败！' + error.message);
            });

        }

    }

    filterChange(classifyName) {
        this.fetchData({}, {
            classifyName
        });
        return {
            classifyName
        };
    }

    fetchData() {
        let _self = this;
        return function (dispatch) {
            _self.loading(true);
            return RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/classify/route`,{},
                'get', true)
                .then((res) => {
                    _self.loading(false);
                    let data = {
                        classify: res.types,
                    };
                    dispatch(data);
                }).catch(error => {
                    _self.loading(false);
                    message.error(error.message);
                });
        }
    }

}


export default alt.createActions(ClassifyAction);
