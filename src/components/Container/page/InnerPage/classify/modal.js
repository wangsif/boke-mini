import React, {Component, PropTypes} from 'react';
import {Form, Icon, Input, Button, Checkbox, Modal, Select, DatePicker, Upload, Cascader, message} from 'antd';
import {connect} from "alt-react";
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

class classifyAddModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        let _self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {onEditSubmit, editClassifyData} = this.props;
                let {classifyName,classifyType} = values;
                classifyType = classifyType.split("/")[1]
                onEditSubmit && onEditSubmit(classifyName,classifyType);
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        let {onCloseModal, show, editClassifyData} = this.props;
        const {previewVisible, previewImage, fileList} = this.state;
        const opeartion = editClassifyData ? '修改' : '添加';
        const btnValue = editClassifyData ? '保存' : '添加';
        let classifyName
        let pid
        let id
        if (editClassifyData) {
            classifyName = editClassifyData.classifyName
            pid = editClassifyData.pid
            id = editClassifyData.id
        }
        const optionG = [<Option key={0} value={0+"/"+0}>第一级分类</Option>];
        let oneClassifyData = this.props.classify.get("data").toArray();
        oneClassifyData.map((val,ind)=>{
            optionG.push(<Option key={ind+1} value={val.pid+"/"+val.id}>{val.classifyName}</Option>)
        });
        return (
            <Modal width={800} title={opeartion} visible={show} onCancel={onCloseModal} footer={[]}>
                <Form onSubmit={this.handleSubmit}>
                        <FormItem style={formItemClass} {...formItemLayout} label='分类名'>
                            {getFieldDecorator('classifyName', {
                                initialValue: classifyName
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem style={formItemClass} {...formItemLayout} label='所属分类'>
                            {getFieldDecorator('classifyType')(
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="请选择所属分类"
                                >
                                    {optionG}
                                </Select>,
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


const WrappedclassifyAddModal = Form.create()(classifyAddModal);

export default connect(WrappedclassifyAddModal, {
    listenTo() {
        return [ClassifyStore];
    },
    getProps() {
        return {
            classify: ClassifyStore.getState().classify,
        }
    }
});
