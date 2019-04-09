import React, {Component} from 'react';
import QuestionDetailFilter from './filter'
import {Table,Card,Button,Tooltip,Popconfirm} from 'antd';
import {map} from 'lodash/fp';
import QuestionDetailAddModal from './modal';
import QuestionDetailStore from 'store/QuestionDetailStore';
import QuestionDetailAction from 'actions/QuestionDetailAction';
import {connect} from 'alt-react';
import ClassifyAction from "../../../../../actions/ClassifyAction";
import ClassifyStore from "../../../../../store/ClassifyStore";

class QuestionDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    //翻页触发
    pageChange = (page, pageSize) => {
        let {current} = page;
        QuestionDetailAction.pageChange(current)
    };

    showEditModal = (show) => {
        QuestionDetailAction.showEditModal(show);
    }

    editRow = (index, record) => {
        QuestionDetailAction.editRow(record)
    }

    deleteRow = (id) => {
        QuestionDetailAction.deleteRow(id);
    }

     handleAddSubmit = (area,categoryInPaper,createTime,questionType,classifyKnowledge,description,choose,title,paperIds,score,answer,id,limitedTime,classifyKnowledgePath,dateRange) => {
        QuestionDetailAction.add(area,categoryInPaper,createTime,questionType,classifyKnowledge,description,choose,title,paperIds,score,answer,id,limitedTime,classifyKnowledgePath,dateRange);
    }

    handleEditSubmit = (editQuestionDetailDataId,area,categoryInPaper,createTime,questionType,classifyKnowledge,description,choose,title,paperIds,score,answer,id,limitedTime,classifyKnowledgePath,) => {
        QuestionDetailAction.update(editQuestionDetailDataId,area,categoryInPaper,createTime,questionType,classifyKnowledge,description,choose,title,paperIds,score,answer,id,limitedTime,classifyKnowledgePath,);
    }
    render() {
        let _self = this;
        let {questionDetail, filter,editModal, editQuestionDetailData, classify} = this.props;
        return (
            <div >
                <Card title="题目管理" style={{marginBottom: 30}}>
                    <QuestionDetailFilter dataSource={{filter}} onCommit={QuestionDetailAction.filterChange} onAddCard={this.showEditModal} />
                </Card>
                <Card title="题目列表">
                    <Table dataSource={questionDetail.get('data').toArray()} onChange={this.pageChange} scroll={{x: 100 | true}}
                           bordered
                           columns={[
                               {
                                    title: '地区',
                                    dataIndex: 'area',
                                    key: 'area',
                                    align:'left'
                                },
                               {
                                    title: '大题标题',
                                    dataIndex: 'categoryInPaper',
                                    key: 'categoryInPaper',
                                    align:'left'
                                },

                               {
                                    title: '题型',
                                   key: 'questionType',
                                   render(index, data) {
                                       if (data.questionType == 1) {
                                           return <div>单选题</div>
                                       } else if (data.questionType == 2) {
                                           return <div>多选题</div>
                                       } else if (data.questionType == 3) {
                                           return <div>不定项选择题</div>
                                       } else if (data.questionType == 4) {
                                           return <div>判断题</div>
                                       } else if (data.questionType == 5) {
                                           return <div>简答题</div>
                                       } else if (data.questionType == 6) {
                                           return <div>套题</div>
                                       }
                                   },
                                   align: 'left'
                                },
                               {
                                    title: '所属知识点',
                                    dataIndex: 'knowledgeString',
                                    key: 'knowledgeString',
                                    align:'left'
                                },
                               {
                                    title: '问题描述（说明）',
                                    dataIndex: 'description',
                                    key: 'description',
                                    align:'left'
                                },
                               {
                                    title: '选项',
                                    dataIndex: 'choose',
                                    key: 'choose',
                                    align:'left'
                                },
                               {
                                    title: '题目',
                                    dataIndex: 'title',
                                    key: 'title',
                                    align:'left'
                                },
                               {
                                    title: '所属试卷',
                                    dataIndex: 'paperTitles',
                                    key: 'paperTitles',
                                    align:'left'
                                },
                               {
                                    title: '分值',
                                    dataIndex: 'score',
                                    key: 'score',
                                    align:'left'
                                },
                               {
                                    title: '答案',
                                    dataIndex: 'answer',
                                    key: 'answer',
                                    align:'left'
                                },
                               {
                                    title: '作答时间',
                                    dataIndex: 'limitedTime',
                                    key: 'limitedTime',
                                    align:'left'
                                },
                               {
                                    title: '知识点路径',
                                    dataIndex: 'classifyStringPath',
                                    key: 'classifyStringPath',
                                    align:'left'
                                },
                               {
                                   title: '创建时间',
                                   dataIndex: 'createTime',
                                   key: 'createTime',
                                   align:'left'
                               },
                                {
                                    title: '操作',
                                    key: 'operator',
                                    render: (text, record, index) => {
                                    return (
                                        <div>
                                            <Button style={{backgroundColor: '#00a854', color: '#fff'}}
                                            onClick={() => this.editRow(index, record)}>编辑</Button >
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
                        total: questionDetail.get('total'),
                        current: questionDetail.get('pageNo'),
                        pageSize: questionDetail.get('pageSize')
                    }} rowKey="id" loading={questionDetail.get('loading')}/>
                    <Tooltip>
                        <span>总计{questionDetail.get('total')}条数据，每页显示{questionDetail.get('pageSize')}条，共{Math.ceil(questionDetail.get('total') / questionDetail.get('pageSize'))}页，当前第{questionDetail.get('pageNo')}页</span>
                    </Tooltip>
                </Card>
                {editModal.show ? <QuestionDetailAddModal classify={classify} show={editModal.show} onCloseModal={()=>this.showEditModal(false)}
                    onSubmit={this.handleAddSubmit} onEditSubmit={this.handleEditSubmit}
                    editQuestionDetailData={editQuestionDetailData}/> : null}
            </div>
        )
    }

    componentDidMount() {
        let {questionDetail, filter} = this.props;
        QuestionDetailAction.fetchData({
            pageNo: questionDetail.get('pageNo'),
            pageSize: questionDetail.get('pageSize')
        }, filter.toJS());
        ClassifyAction.fetchData();
    }

}

export default connect(QuestionDetail, {
    listenTo() {
        return [QuestionDetailStore];
    },
    getProps() {
        return {
            questionDetail: QuestionDetailStore.getState().questionDetail,
            filter: QuestionDetailStore.getState().filter,
            editModal: QuestionDetailStore.getState().editModal,
            editQuestionDetailData:QuestionDetailStore.getState().editQuestionDetailData,
            classify:ClassifyStore.getState().classify
        }
    }
});
