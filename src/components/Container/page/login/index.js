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


    onSubmit(username,password) {
        RestAPI.request(`/api/manager/admin/`+username+`/login`,{password},'GET',true)
            .then(data =>{
                Config.localItem(Config.localKey.userJwt,new Date().getTime());
                Config.setUserInfo(data);
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
                        <Card title="小灶助考管理后台登录">
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