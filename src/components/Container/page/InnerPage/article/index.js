import React, {Component} from 'react';
import ArticleStore from 'store/ArticleStore';
import ArticleAction from 'action/ArticleAction';
import {connect} from 'alt-react';
import { Row, Col, List, Avatar, Icon ,Pagination } from 'antd';



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
        this.pageChange = this.pageChange.bind(this)
    }
    //翻页触发
    pageChange = (page) => {
        console.log(1111)
        let {pageNo} = page;
        ArticleAction.pageChange(pageNo)
    };


    render(){

        let _self = this;
        let {article} = this.props;



        for (let i = 0; i < article.get('total'); i++) {
            console.log(i)
            article.get('data').push({
                href: '',
                title: ``,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' ,
                createTime:'',
                content:
                    '',
                image:''
            });
        }
        console.log(article.get('data').toArray())


        return(
            <div>
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={article.get("data").toArray()}
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
                                image={item.image}
                            />
                            发布时间： {item.createTime}<br/>
                            {item.content}

                        </List.Item>
                    )}
                />

                <Pagination defaultCurrent={1}  defaultPageSize={3} total={article.get('total')} onChange={(page, pageSize)=>{
                    this.pageChange({pageNo:page, pageSize})
                }}/>
            </div>
        );
    }
    componentDidMount() {

        let {article} = this.props;
        ArticleAction.fetchData({pageNo:article.get("pageNo"), pageSize:"3"})
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
