//tip:单条数据，multiple:多条数据
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Modal from './Modal';
import context from 'app/context';
export default class ModalBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'',
            key:0,
        };
    }
    componentWillMount(){
        let {multiple,tip} = this.props;
        if(multiple&&multiple.length>0){
            this.setState({
                title:multiple[0].title
            })
        }
        if(!tip&&!multiple.length){
            context.getBrowserHistory().push("/login");
        }
    }
    render() {
        let {tip,multiple,style,styleValue} = this.props;
        let {title,key}=this.state;
        return (
            <div className="loading" style={style}>
                <div className="loading-mask">
                    <div className="loading-outter" style={styleValue}>
                        <div className="loading-wrap">
                            {title?title:'温馨提示'}
                        </div>
                        {multiple?<div className="loading-text">
                            {multiple[key].content}
                        </div>:<div className="loading-text">{tip?tip:'请重新登录'}</div>}
                        <div className="textRight">
                            {multiple? <button className="modalClose" onClick={()=>{
                                this.changePage()
                            }}>{key===(multiple.length-1)?"关闭":'下一条'}</button>: <button className="modalClose" onClick={()=>{
                                Modal.close();
                            }}>关闭</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    changePage=()=>{
        let {key}=this.state;
        let {multiple} = this.props;
        if(key===(multiple.length-1)){
            Modal.close();
        }else {
            this.setState({
                key:(key+1),
                title:multiple[key+1].title
            })
        }
    }
}

ModalBody.propTypes = {
    tip: PropTypes.string,
    multiple:PropTypes.array,
    title:PropTypes.string,
};

ModalBody.newInstance = function newNotificationInstance(properties) {
    let props = properties || {};
    let div = document.createElement('div');
    document.body.appendChild(div);
    let notification = ReactDOM.render(React.createElement(ModalBody, props), div);
    return {
        destroy() {
            ReactDOM.unmountComponentAtNode(div);
            document.body.removeChild(div);
        },
    };
};