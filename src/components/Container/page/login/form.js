import React,{Component,PropTypes} from 'react';
import md5 from 'md5';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
const FormItem = Form.Item;

class LoginForm extends React.Component {

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        let _self = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {onSubmit} = this.props;
                let {phone,password} = values;
                //password = md5(password);

                onSubmit && onSubmit(phone,password);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入用户名或手机号!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名或手机号" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}



const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;