import React, {Component, PropTypes} from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom';
import {Menu, Icon, Button, Layout, Breadcrumb, message} from 'antd';
import context from '../../app/context';
import Common from 'app/common';

import Config from 'app/common';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
import {withRouter} from 'react-router';
import Classify from '../../components/Container/page/InnerPage/classify/index'
import UploadFile from '../../components/Container/page/InnerPage/upload/index'
import QuestionDetail from '../../components/Container/page/InnerPage/questionDetail/index'
import SetQuestion from '../../components/Container/page/InnerPage/setQuestion/index'
import User from '../../components/Container/page/InnerPage/user/index'

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
                        <Menu.Item key="app/upload"><Icon type="inbox" /><span>上传试卷</span></Menu.Item>
                        <Menu.Item key="app/classify"><Icon type="inbox" /><span>分类管理</span></Menu.Item>
                        <Menu.Item key="app/QuestionDetail"><Icon type="inbox" /><span>题目管理</span></Menu.Item>
                        <Menu.Item key="app/SetQuestion"><Icon type="inbox" /><span>套题小题管理</span></Menu.Item>
                        <Menu.Item key="app/User"><Icon type ="inbox"/><span>用户管理</span></Menu.Item>
                        {/*<SubMenu key="update" title={<span><Icon type="dot-chart" /><span>更新管理</span></span>}>*/}
                            {/*<Menu.Item key="update/list"><Icon type="inbox" /><span>更新列表</span></Menu.Item>*/}
                        {/*</SubMenu>*/}
                        {/*<SubMenu key="version" title={<span><Icon type="tablet" /><span>版本管理</span></span>}>*/}
                            {/*<Menu.Item key="version/list"><Icon type="tablet" /><span>版本列表</span></Menu.Item>*/}
                        {/*</SubMenu>*/}
                        {/*<SubMenu key="device" title={<span><Icon type="inbox" /><span>设备管理</span></span>}>*/}
                            {/*<Menu.Item key="device/list"><Icon type="inbox" /><span>设备列表</span></Menu.Item>*/}
                            {/*<Menu.Item key="device/log"><Icon type="inbox" /><span>设备更新记录</span></Menu.Item>*/}
                            {/*<Menu.Item key="bDevice/list"><Icon type="inbox" /><span>灰度更新设备管理</span></Menu.Item>*/}
                        {/*</SubMenu>*/}
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
                        <Switch>
                            <Route path={`${match.url}`} component={Classify} exact/>
                            <Route path={`${match.url}/app/classify`} component={Classify}/>
                            <Route path={`${match.url}/app/Upload`} component={UploadFile}/>
                            <Route path={`${match.url}/app/QuestionDetail`} component={QuestionDetail}/>
                            <Route path={`${match.url}/app/SetQuestion`} component={SetQuestion}/>
                            <Route path={`${match.url}/app/User`} component={User}/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', padding: '0px'}}>
                        xiaozao-app-server Design ©2019 Created by KaoPuYun
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
