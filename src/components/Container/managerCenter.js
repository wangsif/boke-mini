import React, {Component, PropTypes} from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {Menu, Icon, Button, Layout, Breadcrumb, message} from 'antd';
import context from '../../app/context';
import Common from 'app/common';

import Config from 'app/common';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
import {withRouter} from 'react-router';

class ManagerCenter extends Component {
    state = {
        collapsed: false,
        selectMenu: ['statement']
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    };

    logout = (e) => {
        // 模拟退出
        if (e.key == 'logout') {
            let data = Config.getUserInfo();
            data.jwt = "";
            Config.setUserInfo(data);
            Common.removeLocalItem(Common.localKey.userJwt);
            context.getBrowserHistory().push(`/login`);
        }

    };

    sideBarClick = ({key}) => {
        context.getBrowserHistory().push(`/home/${key}`);

        this.setState(() => ({
            selectMenu: [key]
        }));
    };

    render() {

        let userInfo = Common.getUserInfo();

        let username = userInfo == null ? '' : userInfo.username;

        let {selectMenu} = this.state;
        let {match, location} = this.props;

        let screenHeight = document.body.offsetHeight;
        let contentHeight = (screenHeight - 125) + 'px';
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="layout-logo">
                        <span className="logo-text">小灶助考管理系统</span>
            </div>
                    <Menu theme="dark" defaultSelectedKeys={['setMeal']} selectedKeys={selectMenu} mode="inline"
                          onSelect={this.sideBarClick}>
                    </Menu>
                </Sider>
                <Layout style={{overflowY: 'hidden'}}>
                    <Header style={{
                        background: '#fff',
                        padding: 0,
                        height: '50px',
                    }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        <Menu mode="horizontal" onClick={this.logout} style={{
                            float: 'right',
                            lineHeight: '50px',
                            textAlign: 'center'
                        }}>
                            <SubMenu style={{width: 100}} title={<span><Icon type="user"/>{username}</span>}>
                                <Menu.Item key="logout" style={{width: '100%'}}>注销</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 0,
                            background: '#f0f2f5',
                            height: contentHeight,
                            overflow: 'scroll'
                        }}>
                    </Content>
                    <Footer style={{textAlign: 'center', padding: '0px'}}>
                        ota-app-server Design ©2018 Created by KaoPuYun
                    </Footer>
                </Layout>
            </Layout>
        );
    }

    componentDidMount() {
        let key = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
        this.setState(() => ({
            selectMenu: [key]
        }));
    }
}

export default withRouter(ManagerCenter) ;
