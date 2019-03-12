import React, {Component} from 'react';
import RestAPI from 'utils/rest-api';
import context from 'app/context';
import LoginForm from './form';
import {message,Card} from 'antd';
import Config from 'app/common';
import {withRouter} from 'react-router';
import md5 from 'md5'
class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this)
    }


    onSubmit() {

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

export default withRouter(LoginPage);