import React, {Component} from 'react';
import ClassifyFilter from './filter'
import {Table, Card, Button, Tooltip, Popconfirm} from 'antd';
import {map} from 'lodash/fp';
import ClassifyAddModal from './modal';
import ClassifyStore from 'store/ClassifyStore';
import ClassifyAction from 'actions/ClassifyAction';
import {connect} from 'alt-react';
import ClassifyList from "./classifyList";

class Classify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            keyArr:[]
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

    handleEditSubmit = (editClassifyDataId, classifyName, pid, id,) => {
        ClassifyAction.update(editClassifyDataId, classifyName, pid, id,);
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
            newArray["key"] = val["pid"]+"-"+val["id"];
            val.children.map((item,index)=>{
                let newObj ={};
                newObj["value"] ="/"+item["pid"]+"/"+item["id"]+"/";
                newObj["title"] = item.classifyName;
                newObj["key"] ="0-"+ item.pid+"-"+index;
                newArray["children"].push(newObj);
            });
            return newArray
        })
        return newData;
    }
    onDelete = (data)=>{
        console.log(data)
        let {keyArr} = this.state;
        console.log(keyArr)
        let filterData=[];
        keyArr.map(kid=>{
            filterData = data.filter(item=>{
                if(item.key.split('-').length===2){
                    console.log(item.key!==kid)
                    return item.key!==kid;
                }
                return true; 
            });
        });
        console.log(filterData)
    }
    onGetSelectKey = (keys)=>{
        this.setState({
          keyArr:  keys
        });
    }
    render() {
        let _self = this;
        let {classify, filter, editModal, editClassifyData} = this.props;
        classify = this.transformFormat(classify.get("data").toArray());
        return (
            <div>
                <Card title="分类管理" style={{marginBottom: 30}}>
                    <ClassifyFilter dataSource={{filter}} onCommit={ClassifyAction.filterChange}
                                    onDelete={this.onDelete.bind(this,classify)}
                                    onAddCard={this.showEditModal}/>
                </Card>
                <Card title="分类列表">
                    <ClassifyList checkable={true} classify={classify} onGetSelectKey={this.onGetSelectKey}/>
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
            editClassifyData: ClassifyStore.getState().editClassifyData
        }
    }
});
