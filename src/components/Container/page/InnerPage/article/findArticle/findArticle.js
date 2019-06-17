import React, {Component} from 'react';
import {connect} from 'alt-react';         //联系到alt
import {Row, Col, List, Avatar, Icon, Pagination} from 'antd';
import MailAction from 'action/MailAction';
import MainStore from 'store/MainStore';
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
        this.pageChange = this.pageChange.bind(this)

    }
    //翻页触发
    pageChange = (page) => {
        console.log(1111)
        let {pageNo,title} = page;
        console.log(title)
        MailAction.pageChange(pageNo,title.title)
        console.log(page)
        console.log(title)
    };

    render(){

        let _self = this;
        let {article1} = this.props;
        for (let i = 0; i < article1.get('total'); i++) {
            article1.get('data').push({
                href: '',
                title: ``,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' ,
                createTime:'',
                content:
                    '',
                image:''
            });
        }

        return(
            <div>
                <List
                    itemLayout="vertical"
                    size="large"
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
                <Pagination defaultCurrent={1}  defaultPageSize={3} total={article1.get('total')} onChange={(page, pageSize)=>{
                    this.pageChange({pageNo:page, pageSize,title:article1.get("title")})
                    console.log(page)
                }}/>

            </div>
        );
    }

    componentDidMount() {
        let {article1} = this.props;
        MailAction.fetchData({pageNo: article1.get('pageNo'),
            pageSize: "3",title:article1.get('title')})
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
