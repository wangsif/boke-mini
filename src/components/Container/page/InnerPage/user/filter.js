import React, {Component} from "react";
import {Form, Input, Button, DatePicker, Select,} from "antd";
import {trim} from "app/utils";
const {RangePicker} = DatePicker;
import {map} from 'lodash/fp';

const FormItem = Form.Item;

class UserFilter extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let _self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {onCommit} = _self.props;
                let {username,nickName,id,gender,phone,createTime} = values;
                onCommit && onCommit(username,nickName,id,gender,phone,createTime);
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataSource,onAddCard} = this.props;
        const {username,nickName,id,gender,phone,createTime} = dataSource.filter.toJS();
        return (
            <Form onSubmit={this.handleSubmit} layout="inline">
                <FormItem label="用户名">
                    {getFieldDecorator('username', {
                            initialValue: username
                        }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入用户名"/>
                    )}
                </FormItem>
                <FormItem label="">
                    {getFieldDecorator('nickName', {
                            initialValue: nickName
                        }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入昵称"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                        查询
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
const Filter = Form.create()(UserFilter);

export default Filter;