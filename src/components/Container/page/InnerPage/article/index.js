import React, {Component} from 'react';
import ArticleStore from 'store/ArticleStore';
import ArticleAction from 'action/ArticleAction';
import {connect} from 'alt-react';
import { Row, Col, List, Avatar, Icon } from 'antd';
const listData = [];



const IconText = ({ type, text }) => (
    <span>
    <Icon type={type} style={{ marginRight: 8 }} />
        {text}
  </span>
);

class Article extends Component{

    constructor(props) {
        super(props);
        this.state = {}
    }
    //翻页触发
    pageChange = (page, pageSize) => {
        let {current} = page;
        ArticleAction.pageChange(current)
    };


    render(){

        let _self = this;
        let {article, filter, editModal, editQuestionDetailData, classify} = this.props;
        console.log(article.get('data').toArray())


        for (let i = 0; i < article.get('total'); i++) {
            article.get('data').push({
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
                dataSource={article.get("data").toArray()}
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

        ArticleAction.fetchData({pageNo:"1", pageSize:"3"})
    }
}
export default connect(Article, {
    listenTo() {
        return [ArticleStore];
    },
    getProps() {
        return {
            article: ArticleStore.getState().article,
        }
    }
});
