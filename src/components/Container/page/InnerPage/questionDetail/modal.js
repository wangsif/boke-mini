import React, {Component, PropTypes} from 'react';
import {Form, Icon, Input, Button, Checkbox, Modal, Select, DatePicker, Upload, Cascader, message} from 'antd';
import ClassifyStore from "../../../../../store/ClassifyStore";
import {connect} from "alt-react";

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

class questionDetailAddModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            classify:ClassifyStore.getState().classify
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        let _self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {imgUrlList} = this.state;
                let {onSubmit, onEditSubmit, editQuestionDetailData} = this.props;
                console.log(editQuestionDetailData)
                if (editQuestionDetailData) {
                    onEditSubmit && onEditSubmit(editQuestionDetailData.id, values);
                }
                else {
                    onSubmit && onSubmit(...values);
                }
            }
        });
    }
    transformFormat = (data)=>{
        let newData = data.map(val=>{
            let newArray = {};
            newArray["children"]=[];
            newArray["value"] = "/"+val["pid"]+"/"+val["id"];
            newArray["label"] = val["classifyName"];
            newArray["id"] = val["pid"]+"-"+val["id"];
            if(val.children){
                val.children.map((item,index)=>{
                    let newObj ={};
                    newObj["value"] ="/"+item["pid"]+"/"+item["id"]+"/";
                    newObj["label"] = item.classifyName;
                    newObj["id"] ="0-"+ item.pid+"-"+index;
                    newArray["children"].push(newObj);
                });
            }
            return newArray
        })
        return newData;
    }
    onChange = (value) => {
        console.log(value);

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const { TextArea } = Input;
        let {onCloseModal, show, editQuestionDetailData,classify} = this.props;
        const {previewVisible, previewImage, fileList} = this.state;
        let questionData = this.transformFormat(classify.get("data").toArray());
        console.log(classify.get("data").toArray())
        console.log(questionData)
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
        if(classifyKnowledgePath){
            classifyKnowledgePath=["/0/"+classifyKnowledgePath.split("/")[1],classifyKnowledgePath]
        }
        return (
            <Modal width={800} title={opeartion} visible={show} onCancel={onCloseModal} footer={[]}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem style={formItemClass} {...formItemLayout} label='题目'>
                        {getFieldDecorator('title', {
                            initialValue: title
                        })(
                            <TextArea rows={4}/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='地区'>
                        {getFieldDecorator('area', {
                            initialValue: area
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='大题标题'>
                        {getFieldDecorator('categoryInPaper', {
                            initialValue: categoryInPaper
                        })(
                            <TextArea rows={1}/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label="题型">
                        {getFieldDecorator('questionType', {
                                initialValue: questionType
                            }
                        )(
                            <Select style={{width: 120}}>
                                <Option value="">全部</Option>
                                <Option value={1}>单选题</Option>
                                <Option value={2}>多选题</Option>
                                <Option value={3}>不定项选择题</Option>
                                <Option value={4}>判题</Option>
                                <Option value={5}>简答题</Option>
                                <Option value={6}>套题</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='问题描述（说明）'>
                        {getFieldDecorator('description', {
                            initialValue: description
                        })(
                            <TextArea rows={4}/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='选项'>
                        {getFieldDecorator('choose', {
                            initialValue: choose
                        })(
                            <TextArea rows={1}/>
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
                            <TextArea rows={1}/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='答案'>
                        {getFieldDecorator('answer', {
                            initialValue: answer
                        })(
                            <TextArea rows={1}/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label='作答时间'>
                        {getFieldDecorator('limitedTime', {
                            initialValue: limitedTime
                        })(
                            <TextArea rows={1}/>
                        )}
                    </FormItem>
                    <FormItem style={formItemClass} {...formItemLayout} label="知识点路径">
                        {getFieldDecorator('classifyKnowledgePath', {
                                initialValue: classifyKnowledgePath
                            }
                        )(
                            <Cascader onChange={this.onChange}  options={questionData} placeholder="请选择知识点路径"/>
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

export default connect(WrappedquestionDetailAddModal, {
    listenTo() {
        return [ClassifyStore];
    },
    getProps() {
        return {
            classify: ClassifyStore.getState().classify,
        }
    }
});
