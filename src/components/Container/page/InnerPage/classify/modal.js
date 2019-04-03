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
                const {imgUrlList} = this.state;
                let {onSubmit, onEditSubmit, editClassifyData} = this.props;
                let {classifyName,pid,id,} = values;
                if (editClassifyData) {
                    onEditSubmit && onEditSubmit(editClassifyData.id,classifyName,pid,id,);
                }
                else {
                    onSubmit && onSubmit(classifyName,pid,id,);
                }
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
                    <FormItem style={formItemClass} {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">{btnValue}</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}


const WrappedclassifyAddModal = Form.create()(classifyAddModal);

export default WrappedclassifyAddModal;
