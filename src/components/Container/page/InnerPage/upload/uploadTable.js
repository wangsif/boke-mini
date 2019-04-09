import React from "react";
import {Button, Popconfirm, Table} from "antd";
export default class UploadTable extends React.Component{
    render(){
        let {editRow,deleteRow,uploadData} = this.props;
        return (
            <Table bordered columns={[
                {
                    title: '序号', width: "3%",dataIndex: 'id', key: 10,render(text, record, index) {
                        return index;
                    },
                },
                {
                    title: '题目类型', width: "7%", dataIndex: 'questionType', key: 0,
                    render(index, data) {
                        if (data.questionType == 1) {
                            return <div>单选题</div>
                        } else if (data.questionType == 2) {
                            return <div>多选题</div>
                        } else if (data.questionType == 3) {
                            return <div>不定项选择题</div>
                        } else if (data.questionType == 4) {
                            return <div>判断题</div>
                        } else if (data.questionType == 5) {
                            return <div>简答题</div>
                        } else if (data.questionType == 6) {
                            return <div>套题</div>
                        }
                    },
                },
                {
                    title: '地区', width: "7%", dataIndex: 'area', key: 1,
                },
                {
                    title: '题目', width: "12%", dataIndex: 'title', key: 2,
                },
                {
                    title: '大题标题', width: "15%", dataIndex: 'categoryInPaper', key:3 ,
                },
                {
                    title: '标准作答时间', width: "10%", dataIndex: 'limitedTime', key: 4,
                },
                {
                    title: '解析', width: "20%", dataIndex: 'description', key: 5,
                },
                {
                    title: '选项', width: "10%", dataIndex: 'choose', key: 6,
                },
                {
                    title: '答案', width: "6%", dataIndex: 'answer', key:7,
                },
                {
                    title: '分值', width: "5%", dataIndex: 'score', key: 8,
                },
                {
                    title: '操作',
                    key: 9,
                    fixed: 'right',
                    width: "5%",
                    render: (text, record, index) => {
                        return(
                            <div key={index}>
                                <Button style={{backgroundColor: '#00a854', color: '#fff'}}
                                        onClick={() => editRow(index, record)}>编辑</Button >
                                <span className="ant-divider"/>
                                <Popconfirm title={`确定要删吗?`}
                                            onConfirm={() => deleteRow(text, record)}
                                            okText="确认" cancelText="取消">
                                    <Button type="danger">删除</Button>
                                </Popconfirm>
                            </div>
                        )},
                },
            ]} dataSource={uploadData} rowKey="id" scroll={{ x: "130%", y: 600 }} />
        )
    }
}