import React, {Component} from 'react';
import {Button, Upload, Card, Icon, message, Table, Popconfirm,Tabs} from 'antd'
import Config from 'app/common';
import WrappedUploadEdit from "./uploadEdit";
import RestAPI from "../../../../../utils/rest-api";
import UploadTable from "./uploadTable";
import Classify from "../classify";
import ClassifyAction from "../../../../../actions/ClassifyAction";
const TabPane = Tabs.TabPane;
class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state={
            uploadData:[],
            showEditView:false,
            currentRecord:{},
            dataSource:[],
        }
    }


    onChange=(info)=> {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
            let uploadData = info.file.response;
            this.setState({
                uploadData,
                dataSource:uploadData.classified
            });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传错误.`);
        }
    }
    updateData = (rowData,rowid)=>{
        let {dataSource} = this.state;
        let newData = dataSource.map(data=>{
            if(data.id===rowid){
                rowData["id"] = rowid
                data = rowData
            }
            return data;
        });
        this.setState({
            dataSource:newData
        });
    }
    showEdit = (param) =>{
        this.setState({
            showEditView:param
        });
    }
    editRow = (index, record)=>{
        this.setState({
            currentRecord: record
        });
        this.showEdit(true);
    }
    changeCheck = (index)=>{
        let {uploadData} = this.state;
        if(index==1){
            this.setState({
                dataSource:uploadData.classified
            });
        }else if(index==2){
            this.setState({
                dataSource:uploadData.unclassified
            });
        }
    }
    deleteRow = (row, record)=>{
        let {dataSource} = this.state;
        RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/question/${row.id}/item`,
            null,
            'DELETE',
            true
        ).then((data) => {
            message.success('删除成功！');
            let newData = dataSource.filter(data=>{
                return data.id!==row.id;
            });
            this.setState({
                dataSource:newData
            });
        }).catch(error => {
            console.log(error)
            message.error('删除失败！' + error.message);
        });
    }

    componentDidMount(){
        let{classify,filter} = this.props;
        ClassifyAction.fetchData(filter.toJS());
    }

    render() {
        let {dataSource,showEditView,currentRecord} = this.state;
        const props = {
            name: 'wordFile',
            action: `/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/word/upload`,
            headers: {
                authorization: 'authorization-text',
            },
        }
        return (
            <div>
                <Card title="试卷上传">
                    <Upload {...props} onChange={this.onChange}>
                        <Button>
                            <Icon type="upload"/> 点击上传试卷
                        </Button>
                    </Upload>
                </Card>

                <Card>
                    <Tabs onChange={this.changeCheck} type="card">
                        <TabPane tab="已归类" key="1">
                            <UploadTable editRow={this.editRow} deleteRow={this.deleteRow} uploadData={dataSource}/>
                        </TabPane>
                        <TabPane tab="未归类" key="2">
                            <UploadTable editRow={this.editRow} deleteRow={this.deleteRow} uploadData={dataSource}/>
                            </TabPane>
                        <TabPane tab="分类管理" key="3"><Classify/></TabPane>
                    </Tabs>
                </Card>
                {showEditView?<WrappedUploadEdit updateData={this.updateData} currentRecord={currentRecord} showEdit={this.showEdit} showEditView={showEditView}/>:null}
            </div>
        );
    }
}

export default UploadFile;