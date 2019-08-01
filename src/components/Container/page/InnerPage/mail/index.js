import React, {Component} from 'react';
import {Carousel, Layout, Card } from "antd";
const {Header, Content, Footer, Sider} = Layout;
import MailAction from 'action/MailAction';
import MainStore from 'store/MainStore';

const { Meta } = Card;

class Mail extends Component{

    render(){
        return(
        <Layout>

            <Header style={{
                background: '#fff',
                padding: 0,
                height: '50px',
                width : '512px',
                marginLeft: '200px',
                marginRight: 'auto',
            }}>
                <Carousel autoplay style={{width : '300px'}}>
                    <div>
                        <img width={'100%'} height={'100%'} src="http://wangsf.xyz/images/timg_(2).jpg" />
                    </div>
                    <div>
                        <img src="http://wangsf.xyz/images/5a06dc6f953c457bbc24a6116cebf36e6f67873220cad-l8DAkl_fw658.jpg" />
                    </div>
                    <div>
                        <img src="http://wangsf.xyz/images/timg.jpg" />
                    </div>
                    <div>
                        <img src="http://wangsf.xyz/images/timg_(1).jpg" />
                    </div>
                </Carousel>
            </Header>

            <Card
                hoverable
                style={{ width: '300px',
                         height : '100px',
                         marginLeft: 'auto',
                         marginRight: '150px',
                         marginTop : '-50px',}}
                cover={<img alt="example" src="http://wangsf.xyz/images/20190618094520.jpg" />}
            >
                <Meta title="每日鸡汤" description="啊！多打代码，真是开心呀！打代码！变牛逼！" />
            </Card>
        </Layout>

        );
    }


}
export default Mail;