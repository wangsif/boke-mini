import React, {Component} from 'react';
import {connect} from 'alt-react';
import { Row, Col, List, Avatar, Icon } from 'antd';
import MailAction from "action/MailAction";
import MainStore from "store/MainStore";
const listData = [];


const IconText = ({ type, text }) => (
    <span>
    <Icon type={type} style={{ marginRight: 8 }} />
        {text}
  </span>
);

class FindArticle extends Component{

    constructor(props) {
        super(props);
        this.state = {}
    }
    // //翻页触发
    // pageChange = (page, pageSize) => {
    //     let {current} = page;
    //     ArticleAction.pageChange(current)
    // };


    render(){

        let _self = this;
        let {article1, filter, editModal, editQuestionDetailData, classify} = this.props;
        console.log(article1.get('data').toArray())


        for (let i = 0; i < article1.get('total'); i++) {
            article1.get('data').push({
                href: '',
                title: ``,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' ,
                createTime:'',
                content:
                    '',
            });
        }
        return(

            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={article1.get("data").toArray()}
                // footer={
                //     <div>
                //         <b>ant design</b> footer part
                //     </div>
                // }
                renderItem={item => (
                    <List.Item
                        key={item.title}
                        actions={[
                            <IconText type="star-o" text="156" />,
                            <IconText type="like-o" text="156" />,
                            <IconText type="message" text="2" />,
                        ]}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={<a href={item.href}>{item.title}</a>}
                            createTime ={item.createTime}
                            content={item.content}
                        />
                        发布时间： {item.createTime}<br/>
                        {item.content}

                    </List.Item>

                )}
            />
        );
    }

    componentDidMount() {

        MailAction.fetchData({pageNo:"1", pageSize:"3",title:""})
    }
}
export default connect(FindArticle, {
    listenTo() {
        return [MainStore];
    },
    getProps() {
        return {
            article1: MainStore.getState().article1,
        }
    }
});
