import React, {Component} from 'react';
import ContentStore from  'store/ContentStore';
import {connect} from 'alt-react';
import { Row, Col, List, Avatar, Icon ,Pagination } from 'antd';


class Content extends Component{

    render(){
        return(1);
    }
}
export default connect(Content, {
   listenTo(){
       return [ContentStore];
   } ,
    getProps(){
       return{

       }
    }
});