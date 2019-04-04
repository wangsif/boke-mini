import React, {Component, PropTypes} from 'react';
import {Form, Icon, Input, Button, Checkbox, Modal, Select, DatePicker, Upload, Cascader, message} from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

const formItemClass = {
    margin: 0
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 14,
            offset: 6,
        },
    },
};

class questionDetailAddModal extends Component {

    constructor(props) {
        super(props);
        this.state = {}

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        let _self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {imgUrlList} = this.state;
                let {onSubmit, onEditSubmit, editQuestionDetailData} = this.props;
                let {area, categoryInPaper, createTime, questionType, classifyKnowledge, description, choose, title, paperIds, score, answer, id, limitedTime, classifyKnowledgePath,} = values;
                if (editQuestionDetailData) {
                    onEditSubmit && onEditSubmit(editQuestionDetailData.id, area, categoryInPaper, createTime, questionType, classifyKnowledge, description, choose, title, paperIds, score, answer, id, limitedTime, classifyKnowledgePath,);
                }
                else {
                    onSubmit && onSubmit(area, categoryInPaper, createTime, questionType, classifyKnowledge, description, choose, title, paperIds, score, answer, id, limitedTime, classifyKnowledgePath,);
                }
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        let {onCloseModal, show, editQuestionDetailData,classify} = this.props;
        const {previewVisible, previewImage, fileList} = this.state;
        const opeartion = editQuestionDetailData ? '修改' : '添加';
        const btnValue = editQuestionDetailData ? '保存' : '添加';
        let area
        let categoryInPaper
        let createTime
        let questionType
        let classifyKnowledge
        let description
        let choose
        let title
        let paperIds
        let score
        let answer
        let id
        let limitedTime
        let classifyKnowledgePath
        if (editQuestionDetailData) {
            area = editQuestionDetailData.area
            categoryInPaper = editQuestionDetailData.categoryInPaper
            createTime = editQuestionDetailData.createTime
            questionType = editQuestionDetailData.questionType
            classifyKnowledge = editQuestionDetailData.classifyKnowledge
            description = editQuestionDetailData.description
            choose = editQuestionDetailData.choose
            title = editQuestionDetailData.title
            paperIds = editQuestionDetailData.paperIds
            score = editQuestionDetailData.score
            answer = editQuestionDetailData.answer
            id = editQuestionDetailData.id
            limitedTime = editQuestionDetailData.limitedTime
            classifyKnowledgePath = editQuestionDetailData.classifyKnowledgePath
        }
        return (
            <Modal width={800} title={opeartion} visible={show} onCancel={onCloseModal} footer={[]}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem style={formItemClass} {...formItemLayout} label='题目'>
                        {getFieldDecorator('title', {
                            initialValue: title
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    {/*<FormItem style={formItemClass} {...formItemLayout} label='地区'>*/}
                        {/*{getFieldDecorator('area', {*/}
                            {/*initialValue: area*/}
                        {/*})(*/}
                            {/*<Input/>*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    <FormItem style={formItemClass} {...formItemLayout} label='大题标题'>
                        {getFieldDecorator('categoryInPaper', {
                            initialValue: categoryInPaper
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='题型'>
                        {getFieldDecorator('questionType', {
                            initialValue: questionType
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='问题描述（说明）'>
                        {getFieldDecorator('description', {
                            initialValue: description
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='选项'>
                        {getFieldDecorator('choose', {
                            initialValue: choose
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    {/*<FormItem style={formItemClass} {...formItemLayout} label='所属试卷'>
                        {getFieldDecorator('paperIds', {
                            initialValue: paperIds
                        })(
                            <Input/>
                        )}
                    </FormItem>*/}
                    <FormItem style={formItemClass} {...formItemLayout} label='分值'>
                        {getFieldDecorator('score', {
                            initialValue: score
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='答案'>
                        {getFieldDecorator('answer', {
                            initialValue: answer
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='作答时间'>
                        {getFieldDecorator('limitedTime', {
                            initialValue: limitedTime
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='知识点路径'>
                        {getFieldDecorator('classifyKnowledgePath', {
                            initialValue: classifyKnowledgePath
                        })(
                            <Input disabled="true"/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">{btnValue}</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}


const WrappedquestionDetailAddModal = Form.create()(questionDetailAddModal);

export default WrappedquestionDetailAddModal;
