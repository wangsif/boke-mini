import React, {Component} from "react";
import {Form, Input, Button, DatePicker, Select,} from "antd";
import {trim} from "app/utils";
const {RangePicker} = DatePicker;
import {map} from 'lodash/fp';


const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;

class ClassifyFilter extends Component {

    constructor(props) {
        super(props);
        this.state={

        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let _self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {onCommit} = _self.props;
                let {classifyName} = values;
                onCommit && onCommit(trim(classifyName));
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataSource,onAddCard,onDelete,onSave ,deleteBtnDisabled,saveBtnDisabled} = this.props;
        const {classifyName} = dataSource.filter.toJS();
        return (
            <Form onSubmit={this.handleSubmit} layout="inline">
                 <FormItem label="分类名">
                    {getFieldDecorator('classifyName', {
                        initialValue: classifyName
                    }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入分类名"/>
                    )}
                  </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                        查询
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={ () => {
                        onAddCard && onAddCard(true);
                        } }>
                        添加
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" disabled={deleteBtnDisabled} onClick={ () => {
                        onDelete && onDelete();
                    } }>
                        删除
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" disabled={saveBtnDisabled} onClick={ () => {
                        onSave && onSave();
                    } }>
                        保存
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const Filter = Form.create()(ClassifyFilter);

export default Filter;
