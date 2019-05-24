import React, {Component} from 'react';
import {Carousel, Layout} from "antd";
const {Header, Content, Footer, Sider} = Layout;
import MailAction from 'action/MailAction';
import MainStore from 'store/MainStore';

class Mail extends Component{

    render(){
        return(
            <Header style={{
                background: '#fff',
                padding: 0,
                height: '50px',
                width : '512px',
                marginLeft: '300px',
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
        );
    }


}
export default Mail;