import React,{Component,PropTypes} from 'react';
import md5 from 'md5';
import RestAPI from 'utils/rest-api';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import Base64  from 'base-64';
const FormItem = Form.Item;


class LoginForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            checkCodeImg:"",
            uuid:""

        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        let _self = this;
        e.preventDefault();      //取消事件的默认动作。
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {onSubmit} = this.props;
                let {username, password, authcode} = values;
                //password = md5(password);
                let {uuid} = this.state;
                onSubmit && onSubmit(username, password, authcode,uuid);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let {checkCodeImg} = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
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
                    <div>
                        {getFieldDecorator('authcode', {
                            rules: [{required: true, message: '请输入验证码!'}],
                        })(
                            <div style={{width: "60%", float: "left"}}><Input
                                prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="text" placeholder="验证码"/>
                            </div>
                        )}
                        <div style={{width: "40%", float: "left", textAlign: "center"}}>
                            <img src={checkCodeImg} className="checkCodeImg" width="75px" onClick={this.getCheckCode}/>
                        </div>
                    </div>
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" style={{width:'100%'}}>
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
    componentWillMount() {
        this.getCheckCode()
    }
    getCheckCode = ()=>{
        RestAPI.request(`/api/app/user/authcode`, null, 'get').then((res) => {
            let {date,id} = res;
            console.log(date)
            //var a =  Base64.encode(date);
            this.setState({

                checkCodeImg:date,
                uuid:id
            });
        }).catch((error) => {
            Modal.open(error + ',请再次尝试，如有疑问可随时咨询在线客服');
        });
    }
}



const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;