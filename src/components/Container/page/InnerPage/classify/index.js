import React, {Component} from 'react';
import ClassifyFilter from './filter'
import {Table, Card, Button, Tooltip, Popconfirm, message} from 'antd';
import {map} from 'lodash/fp';
import ClassifyAddModal from './modal';
import ClassifyStore from 'store/ClassifyStore';
import ClassifyAction from 'actions/ClassifyAction';
import {connect} from 'alt-react';
import ClassifyList from "./classifyList";
import RestAPI from "../../../../../utils/rest-api";
import Config from "../../../../../app/common";
class Classify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyArr:[],
            oneKeyArr:[],
            classifyData:[],
            originData:[],
            haveSaved:false,
            deleteBtnDisabled:true,
            saveBtnDisabled:true,
        }
    }
    componentWillReceiveProps(nextProps,nextState){
        if(nextProps.classify!==this.props.classify){
            let classifyData =this.transformFormat(nextProps.classify.get("data").toArray());
            this.setState({
                classifyData
            });
        }
        if(nextProps.haveDeleted!==this.props.haveDeleted){
            this.setState({
                deleteBtnDisabled:true
            });
        }
    }
    showEditModal = (show) => {
        ClassifyAction.showEditModal(show);
    }

    editRow = (index, record) => {
        ClassifyAction.editRow(record)
    }

    deleteRow = (id) => {
        ClassifyAction.deleteRow(id);
    }

    handleAddSubmit = (classifyName, pid, id, dateRange) => {
        ClassifyAction.add(classifyName, pid, id, dateRange);
    }
    transfromOriginData = (newData,dragKeyArr,updateKeyArr)=>{ 

       let originData = newData.map(val=>{
            let newArray = {};
            if(val.children){
                newArray["children"]=[];
                newArray["id"] = val["key"].split("/")[1];
                newArray["pid"] = val["key"].split("/")[0];
                newArray["classifyName"] = val["title"];
                val.children.map((item,index)=>{
                    let newObj ={};
                    let itemIndex = dragKeyArr.indexOf(item.key);
                    if(itemIndex!==-1){
                        newObj["id"] = updateKeyArr[itemIndex].split("/")[2];
                        newObj["pid"] = updateKeyArr[itemIndex].split("/")[1];
                    }else {
                        newObj["id"] = item["key"].split("/")[2];
                        newObj["pid"] = item["key"].split("/")[1];
                    }
                    newObj["classifyName"] = item["title"];
                    newArray["children"].push(newObj);
                });
            }else {
                newArray["children"]=[];
                newArray["id"] = val["key"].split("/")[2];
                newArray["pid"] = val["key"].split("/")[0];
                newArray["classifyName"] = val["title"];
            }
            return newArray
        });
      this.setState({
          originData,
          saveBtnDisabled:false
      })
    }
    handleEditSubmit = ( classifyName,classifyType) => {
        RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/classify/add/`,
            {
                "classifyName":classifyName,
                "pid":classifyType
            },
            'POST',
            true
        ).then((data) => {
            this.showEditModal(false);
            ClassifyAction.fetchData();
            message.success('添加成功！');

        }).catch(error => {
            message.error('添加失败！' + error.message);
        });
    }

    // getRoute() {
    //     const route = ClassifyAction.fetchData();
    //     route.dataSource.data.classify.map(val => {
    //         let newArray = [];
    //         newArray["value"] = val["pid"];
    //         val.children.map(item => {
    //             newArray["children"]["value"] = item.value;
    //         })
    //         return newArray
    //     })
    // }
    transformFormat = (data)=>{
        let newData = data.map(val=>{
            let newArray = {};
            newArray["children"]=[];
            newArray["value"] = "/"+val["pid"]+"/"+val["id"];
            newArray["title"] = val["classifyName"];
            newArray["key"] = val["pid"]+"/"+val["id"];
            if(val.children){
                val.children.map((item,index)=>{
                    let newObj ={};
                    newObj["value"] ="/"+item["pid"]+"/"+item["id"]+"/";
                    newObj["title"] = item.classifyName;
                    newObj["key"] = "0/"+item["pid"]+"/"+item["id"];
                    newArray["children"].push(newObj);
                });
            }
            return newArray
        })
        return newData;
    }
    // filterData=(data,id)=>{
    //     let newData = data.filter(value=>{
    //         let newArr= value.children.filter(item=>{
    //             if(item){
    //                 return item.key===id;
    //             }
    //         });
    //         return newArr[0];
    //     });
    //     return newData;
    // }
    onDelete = (data)=>{
        let {keyArr} = this.state;
        let deletdIds = keyArr.map(idGroup=>{
            let idArr = idGroup.split('/');
            return idArr[idArr.length-1];
        });
        ClassifyAction.deleteClassifyData(deletdIds);
    }
    onSave = ()=>{
        let {originData} = this.state;
        let postData = JSON.stringify({"types": originData})
        RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/classify/modify/`,
            {
                "classifyJSON":postData
            },
            'POST',
            true
        ).then((data) => {
            this.setState({
                haveSaved:new Boolean(true),
                saveBtnDisabled:true,
            });
            ClassifyAction.fetchData();
            message.success('修改成功！');

        }).catch(error => {
            message.error('修改失败！' + error.message);
        });
    }
    onGetSelectKey = (keys)=>{
        this.setState({
            keyArr:  keys,
        });
        if(keys.length!==0){
            this.setState({
                deleteBtnDisabled:false
            });
        }else if(keys.length===0){
            this.setState({
                deleteBtnDisabled:true
            })
        }
    }
    onSelectDeleteSingle = (keys)=>{
        this.setState({
            keyArr: keys,
        });
        if(keys.length!==0){
            this.setState({
                deleteBtnDisabled:false
            });
        }else if(keys.length===0){
            this.setState({
                deleteBtnDisabled:true
            })
        }
    }
    render() {
        let _self = this;
        let {classify, filter, editModal, editClassifyData} = this.props;
        let {classifyData,originData,haveSaved,deleteBtnDisabled,keyArr,saveBtnDisabled} = this.state;

        return (
            <div>
                <Card title="分类管理" style={{marginBottom: 30}}>
                    <ClassifyFilter dataSource={{filter}} deleteBtnDisabled={deleteBtnDisabled} onCommit={ClassifyAction.filterChange} saveBtnDisabled={saveBtnDisabled}
                                    originData={originData}
                                    onSave={this.onSave}
                                    onDelete={this.onDelete.bind(this,classifyData)}
                                    onAddCard={this.showEditModal}/>
                </Card>
                <Card title="分类列表">
                    <ClassifyList haveSaved={haveSaved} transfromOriginData={this.transfromOriginData} checkable={true} onSelectDeleteSingle={this.onSelectDeleteSingle} classify={classifyData} onGetSelectKey={this.onGetSelectKey}/>
                </Card>
                {editModal.show ? <ClassifyAddModal show={editModal.show} onCloseModal={() => this.showEditModal(false)}
                                                    onSubmit={this.handleAddSubmit} onEditSubmit={this.handleEditSubmit}
                                                    editClassifyData={editClassifyData}/> : null}
            </div>
        )
    }

    componentDidMount() {
        let {classify, filter} = this.props;
        ClassifyAction.fetchData(filter.toJS());
    }

}

export default connect(Classify, {
    listenTo() {
        return [ClassifyStore];
    },
    getProps() {
        return {
            classify: ClassifyStore.getState().classify,
            filter: ClassifyStore.getState().filter,
            editModal: ClassifyStore.getState().editModal,
            editClassifyData: ClassifyStore.getState().editClassifyData,
            haveDeleted:ClassifyStore.getState().haveDeleted
        }
    }
});
