import React, {Component} from 'react';
import ArticleStore from 'store/ArticleStore';
import {connect} from 'alt-react';
import { Row, Col } from 'antd';
class Article extends Component{
    render(){
        console.log(123);
        return(

            <div className="gutter-example">
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">col-6</div>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default connect (Article, {
    listenTo() {
        return [ArticleStore];
    },
    getProps() {
        return {
            // setting: ArticleStore.getState().setting,
            // filter: ArticleStore.getState().filter,
        }
    }
});