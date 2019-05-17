import React, {Component} from 'react';
import RestAPI from 'utils/rest-api';
import context from 'app/context';
import LoginForm from './form';
import {message,Card} from 'antd';
import Config from 'app/common';
class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this)
    }


    onSubmit(username,password,authcode,uuid) {
        RestAPI.request(`/api/app/user/login`,{username, password,authCode:authcode,authcodeuuid:uuid},'POST',false)
            .then(data =>{
                Config.localItem(Config.localKey.userJwt,new Date().getTime());
                Config.setUserInfo(data);
                Config.removeLocalItem(Config.localKey.authCode)
                context.getBrowserHistory().push("/home")
            })
            .catch(function (error) {
                message.error(error.message)
            });
    }


    render() {
        return (
            <div className="container">
                <div className="account-container">
                        <Card title="个人博客登录">
                            <LoginForm onSubmit={this.onSubmit}/>
                        </Card>
                </div>
            </div>
        )
    }


    componentDidMount() {
    }

}

export default LoginPage;