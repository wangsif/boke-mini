import React, {Component, PropTypes} from 'react';
import {Form, Icon, Input, Button, Checkbox, Modal, Select, DatePicker, Upload, Cascader, message} from 'antd';
import RestAPI from "../../../../../utils/rest-api";
import Config from "../../../../../app/common";
import ClassifyStore from "../../../../../store/ClassifyStore";
const Option = Select.Option;
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

class UploadEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {}

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        let _self = this;
        let {showEdit,currentRecord,updateData} = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/question/${currentRecord.id}/item`,
                    values,
                    'POST',
                    true
                ).then((data) => {
                    message.success('修改成功！');
                    updateData(values,currentRecord.id);
                    showEdit(false);
                }).catch(error => {
                    console.log(error)
                    message.error('修改失败！' + error.message);
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        let { showEdit,showEditView,currentRecord} = this.props;
        let {questionType,area,title,categoryInPaper,limitedTime,description,choose,answer,score} = currentRecord;
        return (
            <Modal width={800}  visible={showEditView} onCancel={()=>{showEdit(false)}} footer={[]}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem style={formItemClass} {...formItemLayout} label='题目类型'>
                        {getFieldDecorator('questionType', {
                            initialValue:questionType
                        })(
                            <Select>
                                <Option value={1}>单选题</Option>
                                <Option value={2}>多选题</Option>
                                <Option value={3}>不定项选择题</Option>
                                <Option value={4}>判断题</Option>
                                <Option value={5}>简答题</Option>
                                <Option value={6}>套题</Option>
                            </Select>
                        )}
                    </FormItem>
                    {/*<FormItem style={formItemClass} {...formItemLayout} label='地区'>*/}
                    {/*{getFieldDecorator('area', {*/}
                    {/*initialValue: area*/}
                    {/*})(*/}
                    {/*<Input/>*/}
                    {/*)}*/}
                    {/*</FormItem>*/}
                    <FormItem style={formItemClass} {...formItemLayout} label='地区'>
                        {getFieldDecorator('area', {
                            initialValue: area
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='题目'>
                        {getFieldDecorator('title', {
                            initialValue: title
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='大题标题'>
                        {getFieldDecorator('categoryInPaper', {
                            initialValue: categoryInPaper
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='标准作答时间'>
                        {getFieldDecorator('limitedTime', {
                            initialValue: limitedTime
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
                    <FormItem style={formItemClass} {...formItemLayout} label='解析'>
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
                    <FormItem style={formItemClass} {...formItemLayout} label='答案'>
                        {getFieldDecorator('answer', {
                            initialValue: answer
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='分值'>
                        {getFieldDecorator('score', {
                            initialValue: score
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}


const WrappedUploadEdit = Form.create()(UploadEdit);

export default WrappedUploadEdit;
