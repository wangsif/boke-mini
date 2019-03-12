import React from 'react';
import {render} from 'react-dom';
import {Router, Route } from 'react-router-dom'
import moment from 'moment';
import Q from 'q';
import LoginPage from 'bundle-loader?lazy&name=app-[name]!components/Container/page/login';
import ManagerCenter from 'bundle-loader?lazy&name=app-[name]!components/Container/managerCenter';
import Bundle from 'utils/Bundle';
import Config from 'app/common';

'use strict';

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';

moment.locale('zh-cn');


/**
 * 全局导入antd组件样式
 */
import 'antd/dist/antd.css';


/**
 * 引入自身样式
 */
import './assets/style';


//引入字体样式
//require('font-awesome-webpack');


import App from './routes';
import RestAPI from 'utils/rest-api';
import context from './app/context';
import jwt from 'jsonwebtoken';

const secret = 'wjcketxkdwapwqcnwtqasdacmtawnefasdfsa';


RestAPI.init((responseJson) => Q.promise((resolve, reject) => {//简单的AOP扩展

        if (responseJson.code) {
            if (responseJson.code == 'auth-token-time-out'||responseJson.code == 'missing-auth-token'||responseJson.code == 'invalid-auth-token') {
                context.getBrowserHistory().push("/login");
            }
            reject(new Error(responseJson.msg));
        }
        resolve(responseJson);
    }),
    (isValidateJwt) => Q.promise((resolve, reject) => {

        if (!isValidateJwt) {
            resolve("")
        } else {
            jwt.verify(Config.getJwt().substring(7), Buffer.from(secret, 'base64'), {algorithms: ['HS512']}, function (err, decoded) {
                if (err && err.name == 'TokenExpiredError') {
                    let params = {
                        refreshToken: Config.getRefreshToken(),
                        jwt: Config.getJwt().substring(7)
                    };
                    fetch('/api/manager/admin/auth/refreshToken', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                        },
                        mode: 'cors',
                        body: JSON.stringify(params || {}),
                        credentials: 'include'
                    }).then(function (response) {
                        return response.json();
                    }).then((res) => {
                        let username = Config.getUserInfo();
                        if (res.code) {
                            context.getBrowserHistory().push("/login");
                        }else if(res.jwt){
                            username.jwt = res.jwt;
                            username.refreshToken = res.refreshToken;
                            Config.setUserInfo(username)
                        }
                        resolve(res.jwt)
                    })
                } else {
                    resolve(Config.getJwt())
                }
            })

        }
    }));
const Login = () => (
    <Bundle load={LoginPage}>
        {Login => <Login />}
    </Bundle>
);
const Manager = () => (
    <Bundle load={ManagerCenter}>
        {Manager => <Manager />}
    </Bundle>
);

const app = () =>
    <div>
        <Route path='/' component={Login} exact/>
        <Route path='/login' component={Login}/>
        <Route path='/home' component={Manager}/>
    </div>
;



render(
    <Router history={context.getBrowserHistory()}>
        {app()}
    </Router>,
    document.getElementById('root')
);











