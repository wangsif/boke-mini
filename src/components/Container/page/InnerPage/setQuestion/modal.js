import React, {Component, PropTypes} from 'react';
import {Form, Icon, Input, Button, Checkbox, Modal, Select, DatePicker, Upload, Cascader, message} from 'antd';
import ClassifyStore from "../../../../../store/ClassifyStore";

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

class setQuestionAddModal extends Component {

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
                let {onSubmit, onEditSubmit, editSetQuestionData} = this.props;
                let {answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,} = values;
                if (editSetQuestionData) {
                    onEditSubmit && onEditSubmit(editSetQuestionData.id,answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,);
                }
                else {
                    onSubmit && onSubmit(answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,);
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
        let {onCloseModal, show, editSetQuestionData} = this.props;
        const {previewVisible, previewImage, fileList,classify} = this.state;
        let questionData = this.transformFormat(classify.get("data").toArray());
        const opeartion = editSetQuestionData ? '修改' : '添加';
        const btnValue = editSetQuestionData ? '保存' : '添加';
        let answer
        let createTime
        let classifyKnowledge
        let description
        let setId
        let choose
        let id
        let title
        let paperIds
        let classifyKnowledgePath
        if (editSetQuestionData) {
            answer = editSetQuestionData.answer
            classifyKnowledge = editSetQuestionData.classifyKnowledge
            description = editSetQuestionData.description
            choose = editSetQuestionData.choose
            title = editSetQuestionData.title
            classifyKnowledgePath = editSetQuestionData.classifyKnowledgePath
        }
        return (
            <Modal width={800} title={opeartion} visible={show} onCancel={onCloseModal} footer={[]}>
                <Form onSubmit={this.handleSubmit}>
                        <FormItem style={formItemClass} {...formItemLayout} label='答案'>
                            {getFieldDecorator('answer', {
                                initialValue: answer
                            })(
                                <Input/>
                            )}
                        </FormItem>
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
                        <FormItem style={formItemClass} {...formItemLayout} label='题目'>
                            {getFieldDecorator('title', {
                                initialValue: title
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    <FormItem label="知识点路径">
                        {getFieldDecorator('classifyKnowledgePath', {
                                initialValue: classifyKnowledgePath
                            }
                        )(
                            <Cascader onChange={this.onChange}  options={questionData} style={{width: '150px'}} placeholder="请选择知识点路径"/>
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


const WrappedsetQuestionAddModal = Form.create()(setQuestionAddModal);

export default WrappedsetQuestionAddModal;
