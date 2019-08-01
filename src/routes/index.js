import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Common from 'app/common';
import context from 'app/context';
import LoginPage from 'bundle-loader?lazy!../components/Container/page/login';
import ManagerCenter from 'bundle-loader?lazy!../components/Container/managerCenter';
import Bundle from 'utils/Bundle';
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
        <Route path='/' component={Manager} exact/>
        <Route path='/login' component={Login}/>
        <Route path='/home' component={Manager} exact/>
    </div>
;



