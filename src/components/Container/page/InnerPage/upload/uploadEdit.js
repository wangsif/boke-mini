import React, {Component, PropTypes} from 'react';
import {Form, Icon, Input, Button, Checkbox, Modal, Select, DatePicker, Upload, Cascader, message} from 'antd';
import RestAPI from "../../../../../utils/rest-api";
import Config from "../../../../../app/common";
import ClassifyStore from "../../../../../store/ClassifyStore";
import {connect} from "alt-react";
import ClassifyAction from "../../../../../actions/ClassifyAction";
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
        this.state = {
            classify:ClassifyStore.getState().classify
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        ClassifyAction.fetchData();
    }

    handleSubmit(e) {
        let _self = this;
        let {showEdit,currentRecord,updateData} = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            let post = values;
             post["classifyKnowledgePath"]= values.classifyKnowledgePath[1];

            if (!err) {
                RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/question/${currentRecord.id}/item`,
                    post,
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

    render() {
        const {getFieldDecorator} = this.props.form;
        let { showEdit,showEditView,currentRecord,classify} = this.props;
        let {questionType,area,title,categoryInPaper,limitedTime,description,choose,answer,score,classifyKnowledgePath} = currentRecord;
        let questionData = this.transformFormat(classify.get("data").toArray());
        if(classifyKnowledgePath){
            classifyKnowledgePath=["/0/"+classifyKnowledgePath.split("/")[1],classifyKnowledgePath]
        }
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
                    <FormItem style={formItemClass} {...formItemLayout} label="知识点路径">
                        {getFieldDecorator('classifyKnowledgePath', {
                                initialValue: classifyKnowledgePath
                            }
                        )(
                            <Cascader onChange={this.onChange}  options={questionData} placeholder="请选择知识点路径"/>
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

export default connect (WrappedUploadEdit,{
    listenTo() {
        return [ClassifyStore];
    },
    getProps() {
        return {
            classify: ClassifyStore.getState().classify,
        }
    }
});
