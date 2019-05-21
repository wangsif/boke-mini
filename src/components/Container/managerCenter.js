import React, {Component, PropTypes, Fragment } from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {Menu, Icon, Button, Layout, Breadcrumb, message, Tabs} from 'antd';
import context from '../../app/context';
import Common from 'app/common';
import {map} from 'lodash/fp';
import Article from '../../components/Container/page/InnerPage/article/index';

import Config from 'app/common';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import {withRouter} from 'react-router';
import Bundle from "../../routes";
const TabPane = Tabs.TabPane;

class ManagerCenter extends Component {
    state = {
        current: 'mail',
        collapsed: false,
        selectMenu: ['statement'],
        panes: [],
        activeKey: '1'
    };

    //元素可见状态
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    //折叠
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

    // sideBarClick = ({key}) => {
    //     context.getBrowserHistory().push(`/home/${key}`);
    //
    //     this.setState(() => ({
    //         selectMenu: [key]
    //     }));
    // };
    handleClick = ({key}) => {
    context.getBrowserHistory().push(`/home/${key}`);
    console.log(key)
    this.setState(() => ({
           selectMenu: [key]
        }));
    };


    render() {
        let userInfo = Common.getUserInfo();

        let username = userInfo == null ? '' : userInfo.username;

        let {selectMenu} = this.state;
        let {match, location,activeKey,panes} = this.props;

        let screenHeight = document.body.offsetHeight;
        let contentHeight = (screenHeight - 125) + 'px';
        return (
            <Layout>
            <Header style={{
                background: '#fff',
                padding: 0,
                height: '50px',
            }}>

            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]}  defaultSelectedKeys={['setMeal']} mode="horizontal" selectedKeys={selectMenu} >
                <Menu.Item mode="horizontal" style={{lineHeight:'50px',textAlign: 'left', color : 'red' ,fontSize: '40px'}} disabled>
                    <span>阿福博客</span>
                </Menu.Item>
                <Menu.Item key="mail">
                    <Icon type="mail" />
                    首页
                </Menu.Item>
                <Menu.Item key="app">
                    <Icon type="appstore" />
                    个人日记
                </Menu.Item>
                <SubMenu
                    title={
                        <span className="submenu-title-wrapper">
              <Icon type="setting" />
              代码分享
            </span>
                    }
                >
                    <MenuItemGroup title="Item 1">
                        <Menu.Item key="setting:1">Option 1</Menu.Item>
                        <Menu.Item key="setting:2">Option 2</Menu.Item>
                    </MenuItemGroup>
                    <MenuItemGroup title="Item 2">
                        <Menu.Item key="setting:3">Option 3</Menu.Item>
                        <Menu.Item key="setting:4">Option 4</Menu.Item>
                    </MenuItemGroup>
                </SubMenu>
                <Menu.Item key="alipay">
                    <span>
                        留言板
                    </span>
                </Menu.Item>


                    <Menu mode="horizontal" onClick={this.logout} style={{
                        float: 'right',
                        lineHeight: '50px',
                        textAlign: 'center'
                    }}>

                        <SubMenu style={{width: 100}} title={<span><Icon type="user"/>{username}</span>}>
                            <Menu.Item key="logout" style={{width: '100%'}}>注销</Menu.Item>
                        </SubMenu>
                    </Menu>
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
                    <Switch>
                        <Route path={`${match.url}/app`} component={Article} />
                    </Switch>
                </Content>

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
