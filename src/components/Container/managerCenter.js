import React, {Component, PropTypes, Fragment } from 'react';
import {Route, Switch, HashRouter  as Router,Link} from 'react-router-dom';
import {Menu, Icon, Button, Layout, Breadcrumb, message, Tabs, Input , Carousel } from 'antd';
import context from '../../app/context';
import Common from 'app/common';
import {map} from 'lodash/fp';
import Article from '../../components/Container/page/InnerPage/article/index';
import FindArticle from './page/InnerPage/article/findArticle/findArticle';
import MailAction from  'action/MailAction';
import AddArticle from './page/InnerPage/article/addArticle';

import Config from 'app/common';
import base from '../../assets/style/_variables/base.styl';
import Type1 from '../../components/Container/page/InnerPage/lch/index';
const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Search = Input.Search;
import {withRouter} from 'react-router';
import Bundle from "../../routes";
import Mail from "./page/InnerPage/mail";
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

    componentWillReceiveProps(nextProps){
        let key = nextProps.match.params.key;
        this.setState({
            key:key
        })
    }


    render() {
        // let userInfo = Common.getUserInfo();

        // let username = userInfo == null ? '' : userInfo.username;

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

            <Menu  defaultSelectedKeys={['setMeal']} mode="horizontal" selectedKeys={selectMenu}
                  style={{
                marginLeft: '200px',
                marginRight: '',
            }}>
                <Menu.Item  mode="horizontal" style={{lineHeight:'50px',textAlign: 'left', color : 'red' ,fontSize: '40px'}} disabled>
                    <span>阿福博客</span>
                </Menu.Item>
                <Menu.Item onClick={this.handleClick} key="mail">
                    <Icon type="mail" />
                    首页
                </Menu.Item>
                <Menu.Item onClick={this.handleClick} key="app">
                    <Icon type="appstore" />
                    个人日记
                </Menu.Item>
                <SubMenu onClick={this.handleClick}
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
                <Menu.Item onClick={this.handleClick} key="Liuhe">
                    <span>
                        老姐给你的六合统计
                    </span>
                </Menu.Item>

                <Link to={`${match.url}/search`}>
                    <Search
                        placeholder="请输入想要搜索的文章标题"
                        onSearch={value => {
                            MailAction.fetchData({pageNo:1,pageSize:3,title:value})
                            MailAction.updateTitle({title:value})
                            console.log(value)
                        }}

                        style={{ width: 250 }}
                    />
                </Link>

                    {/*<Menu mode="horizontal" onClick={this.logout} style={{*/}
                        {/*float: 'right',*/}
                        {/*lineHeight: '50px',*/}
                        {/*textAlign: 'center'*/}
                    {/*}}>*/}

                        {/*<SubMenu style={{width: 100}} title={<span><Icon type="user"/>{username}</span>}>*/}
                            {/*<Menu.Item key="logout" style={{width: '100%'}}>注销</Menu.Item>*/}
                            {/*console.log(123)*/}
                        {/*</SubMenu>*/}
                    {/*</Menu>*/}
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
                        <Route path={`${match.url}/`} component={Mail} exact/>
                        <Route path={`${match.url}/mail`} component={Mail}/>
                        <Route path={`${match.url}/app`} component={Article} />
                        <Route path={`${match.url}/search`} component={FindArticle} />
                        <Route path={`${match.url}/setting:1`} component={AddArticle} />
                        <Route path={`${match.url}/liuhe`} component={Type1} />

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
