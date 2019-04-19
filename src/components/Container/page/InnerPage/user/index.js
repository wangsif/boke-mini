import React, {Component} from 'react';
import UserFilter from './filter'
import {Table,Card,Button,Tooltip,Popconfirm} from 'antd';
import {map} from 'lodash/fp';
import UserStore from 'store/UserStore';
import UserAction from 'actions/UserAction';
import {connect} from 'alt-react';

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    //翻页触发
    pageChange = (page, pageSize) => {
        let {current} = page;
        console.log(current)
        UserAction.pageChange(current)
    };

    showEditModal = (show) => {
        UserAction.showEditModal(show);
    }

    editRow = (index, record) => {
        UserAction.editRow(record)
    }

    deleteRow = (id) => {
        UserAction.deleteRow(id);
    }

    // handleAddSubmit = (username,nickName) => {
    //     UserAction.add(username,nickName);
    // }

    // handleEditSubmit = (username,nickName) => {
    //     UserAction.update(username,nickName);
    // }

    render() {
        let _self = this;
        let {userInfos, filter,editModal, editUserData} = this.props;
        console.log(userInfos.get('pageNo'))
        return (
            <div >
                <Card title="用户管理" style={{marginBottom: 30}}>
                    <UserFilter dataSource={{filter}} onCommit={UserAction.filterChange} onAddCard={this.showEditModal} />
                </Card>
                <Card title="列表">
                    <Table dataSource={userInfos.get('data').toArray()} onChange={this.pageChange}
                           bordered
                           columns={[
                               {
                                   title: '用户名',
                                   dataIndex: 'username',
                                   key: 'username',
                                   align:'left'
                               },
                               {
                                   title: '昵称',
                                   dataIndex: 'nickName',
                                   key: 'nickName',
                                   align:'left'
                               },
                               {
                                   title: '手机号码',
                                   dataIndex: 'phone',
                                   key: 'phone',
                                   align:'left'
                               },
                               {
                                   title: '性别',
                                   dataIndex: 'gender',
                                   render(index,data){
                                       if (data.gender==0){
                                        return<div>男</div>
                                       }else if(data.gender==1)return<div>女</div>
                                   }
                               },
                               {
                                   title: '创建时间',
                                   dataIndex: 'createTime',
                                   key: 'createTime',
                                   align:'left'
                               },
                               // {
                               //     title: '操作',
                               //     key: 'operator',
                               //     render: (text, record, index) => {
                               //         return (
                               //             <div>
                               //                 <Button style={{backgroundColor: '#00a854', color: '#fff'}}
                               //                         onClick={() => this.editRow(index, record)}>编辑</Button >
                               //                 <span className="ant-divider"/>
                               //                 <Popconfirm title={`确定要删吗?`}
                               //                             onConfirm={() => this.deleteRow(record.id)}
                               //                             okText="确认" cancelText="取消">
                               //                     <Button type="danger">删除</Button>
                               //                 </Popconfirm>
                               //
                               //             </div>
                               //         )
                               //     }
                               // }
                           ]}
                           pagination={{
                               total: userInfos.get('total'),
                               currentPage: userInfos.get('pageNo'),
                               pageSize: userInfos.get('pageSize')
                           }} rowKey="id" loading={userInfos.get('loading')}/>
                    <Tooltip>
                        <span>总计{userInfos.get('total')}条数据，每页显示{userInfos.get('pageSize')}条，共{Math.ceil(userInfos.get('total') / userInfos.get('pageSize'))}页，当前第{userInfos.get('pageNo')}页</span>
                    </Tooltip>
                </Card>
                {editModal.show ? <UserAddModal show={editModal.show} onCloseModal={()=>this.showEditModal(false)}
                                                       onSubmit={this.handleAddSubmit} onEditSubmit={this.handleEditSubmit}
                                                       editUserData={editUserData}/> : null}
            </div>
        )
    }

    componentDidMount() {
        let {userInfos, filter} = this.props;
        UserAction.fetchData({
            pageNo: userInfos.get('pageNo'),
            pageSize: userInfos.get('pageSize')
        }, filter.toJS());
    }

}

export default connect(User, {
    listenTo() {
        return [UserStore];
    },
    getProps() {
        return {
            userInfos: UserStore.getState().userInfos,
            filter: UserStore.getState().filter,
            editModal: UserStore.getState().editModal,
            editUserData:UserStore.getState().editUserData
        }
    }
});
