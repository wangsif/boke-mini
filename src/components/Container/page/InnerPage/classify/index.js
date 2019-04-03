import React, {Component} from 'react';
import ClassifyFilter from './filter'
import {Table, Card, Button, Tooltip, Popconfirm} from 'antd';
import {map} from 'lodash/fp';
import ClassifyAddModal from './modal';
import ClassifyStore from 'store/ClassifyStore';
import ClassifyAction from 'actions/ClassifyAction';
import {connect} from 'alt-react';

class Classify extends Component {

    constructor(props) {
        super(props);
        this.state = {}
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

    render() {
        let _self = this;
        let {classify, filter, editModal, editClassifyData} = this.props;
        return (
            <div>
                <Card title="分类管理" style={{marginBottom: 30}}>
                    <ClassifyFilter dataSource={{filter}} onCommit={ClassifyAction.filterChange}
                                    onAddCard={this.showEditModal}/>
                </Card>
                <Card title="分类列表">

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
