import React, {Component} from 'react';
import SetQuestionFilter from './filter'
import {Table, Card, Button, Tooltip, Popconfirm} from 'antd';
import {map} from 'lodash/fp';
import SetQuestionAddModal from './modal';
import SetQuestionStore from 'store/SetQuestionStore';
import SetQuestionAction from 'actions/SetQuestionAction';
import {connect} from 'alt-react';
import ClassifyAction from "../../../../../actions/ClassifyAction";

class SetQuestion extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    //翻页触发
    pageChange = (page, pageSize) => {
        let {current} = page;
        SetQuestionAction.pageChange(current)
    };

    showEditModal = (show) => {
        SetQuestionAction.showEditModal(show);
    }

    editRow = (index, record) => {
        SetQuestionAction.editRow(record)
    }

    deleteRow = (id) => {
        SetQuestionAction.deleteRow(id);
    }

    handleAddSubmit = (answer, createTime, classifyKnowledge, description, setId, choose, id, title, paperIds, classifyKnowledgePath, dateRange) => {
        SetQuestionAction.add(answer, createTime, classifyKnowledge, description, setId, choose, id, title, paperIds, classifyKnowledgePath, dateRange);
    }

    handleEditSubmit = (editSetQuestionDataId, values,) => {
        SetQuestionAction.update(editSetQuestionDataId, values);
    }

    render() {
        let _self = this;
        let {setQuestion, filter, editModal, editSetQuestionData} = this.props;
        return (
            <div>
                <Card title="套题小题管理" style={{marginBottom: 30}}>
                    <SetQuestionFilter dataSource={{filter}} onCommit={SetQuestionAction.filterChange}
                                       onAddCard={this.showEditModal}/>
                </Card>
                <Card title="套题列表">
                    <Table dataSource={setQuestion.get('data').toArray()} onChange={this.pageChange}
                           bordered
                           columns={[
                               {
                                   title: '知识点',
                                   dataIndex: 'knowledgeString',
                                   key: 'knowledgeString',
                                   width: "10%"
                               },
                               {
                                   title: '题目',
                                   dataIndex: 'title',
                                   key: 'title',
                                   render(index, data) {
                                       if (data.title && data.title.length > 80) {
                                           return data.title.substring(0, 79) + '...';
                                       }
                                       return data.title
                                   },
                                   width: "15%"
                               },
                               {
                                   title: '选项',
                                   dataIndex: 'choose',
                                   key: 'choose',
                                   render(index, data) {
                                       if (data.choose && data.choose.length > 80) {
                                           return data.choose.substring(0, 79)+'...';
                                       } return data.choose
                                   },
                                   width: "10%"
                               },
                               {
                                   title: '解析',
                                   dataIndex: 'description',
                                   key: 'description',
                                   render(index, data) {
                                       if (data.description && data.description.length > 80) {
                                           return data.description.substring(0, 79)+'...';
                                       } return data.description
                                   },
                                   width: "20%"
                               },
                               {
                                   title: '套题ID',
                                   dataIndex: 'setId',
                                   key: 'setId',
                                   width: "5%"
                               },

                               {
                                   title: '试卷',
                                   dataIndex: 'paperTitles',
                                   key: 'paperTitles',
                                   width: "10%"
                               },
                               {
                                   title: '知识点路径',
                                   dataIndex: 'classifyStringPath',
                                   key: 'classifyStringPath'
                               },
                               {
                                   title: '答案',
                                   dataIndex: 'answer',
                                   key: 'answer',
                                   width: "3%"
                               },
                               {
                                   title: '创建时间',
                                   dataIndex: 'createTime',
                                   key: 'createTime',
                                   width: "10%"
                               },
                               {
                                   title: '操作',
                                   key: 'operator',
                                   width: "5%",
                                   fixed: 'right',
                                   render: (text, record, index) => {
                                       return (
                                           <div style={{backgroundColor: "transparent"}}>
                                               <Button style={{backgroundColor: '#00a854', color: '#fff'}}
                                                       onClick={() => this.editRow(index, record)}>详情</Button>
                                               <span className="ant-divider"/>
                                               <Popconfirm title={`确定要删吗?`}
                                                           onConfirm={() => this.deleteRow(record.id)}
                                                           okText="确认" cancelText="取消">
                                                   <Button type="danger">删除</Button>
                                               </Popconfirm>
                                           </div>
                                       )
                                   }
                               }
                           ]}
                           pagination={{
                               total: setQuestion.get('total'),
                               current: setQuestion.get('pageNo'),
                               pageSize: setQuestion.get('pageSize')
                           }} rowKey="id" loading={setQuestion.get('loading')} scroll={{x: "130%", y: 600}}/>
                    <Tooltip>
                        <span>总计{setQuestion.get('total')}条数据，每页显示{setQuestion.get('pageSize')}条，共{Math.ceil(setQuestion.get('total') / setQuestion.get('pageSize'))}页，当前第{setQuestion.get('pageNo')}页</span>
                    </Tooltip>
                </Card>
                {editModal.show ?
                    <SetQuestionAddModal show={editModal.show} onCloseModal={() => this.showEditModal(false)}
                                         onSubmit={this.handleAddSubmit} onEditSubmit={this.handleEditSubmit}
                                         editSetQuestionData={editSetQuestionData}/> : null}
            </div>
        )
    }

    componentDidMount() {
        let {setQuestion, filter} = this.props;
        SetQuestionAction.fetchData({
            pageNo: setQuestion.get('pageNo'),
            pageSize: setQuestion.get('pageSize')
        }, filter.toJS());
        ClassifyAction.fetchData();
    }

}

export default connect(SetQuestion, {
    listenTo() {
        return [SetQuestionStore];
    },
    getProps() {
        return {
            setQuestion: SetQuestionStore.getState().setQuestion,
            filter: SetQuestionStore.getState().filter,
            editModal: SetQuestionStore.getState().editModal,
            editSetQuestionData: SetQuestionStore.getState().editSetQuestionData
        }
    }
});
