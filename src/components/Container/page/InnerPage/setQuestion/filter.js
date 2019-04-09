import React, {Component} from "react";
import {Form, Input, Button, DatePicker, Select,} from "antd";
import {trim} from "app/utils";
const {RangePicker} = DatePicker;
import {map} from 'lodash/fp';
import ClassifyStore from "../../../../../store/ClassifyStore";


const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;

class SetQuestionFilter extends Component {

    constructor(props) {
        super(props);
        this.state={
            classify:ClassifyStore.getState().classify,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let _self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {onCommit} = _self.props;
                let {answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,dateRange} = values;
                onCommit && onCommit(trim(answer),createTime,classifyKnowledge,trim(description),setId,trim(choose),id,trim(title),trim(paperIds),trim(classifyKnowledgePath),dateRange);
            }
        });
    }

    transformFormat = (data)=>{
        let newData = data.map(val=>{
            let newArray = {};
            newArray["children"]=[];
            newArray["value"] = "/"+val["pid"]+"/"+val["id"];
            newArray["label"] = val["classifyName"];
            newArray["id"] = val["pid"]+"-"+val["id"];
            if(val.children){
                val.children.map((item,index)=>{
                    let newObj ={};
                    newObj["value"] ="/"+item["pid"]+"/"+item["id"]+"/";
                    newObj["label"] = item.classifyName;
                    newObj["id"] ="0-"+ item.pid+"-"+index;
                    newArray["children"].push(newObj);
                });
            }
            return newArray
        })
        return newData;
    }
    onChange = (value) => {
        console.log(value);

    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataSource,onAddCard} = this.props;
        const {setId,keyword,paperIds} = dataSource.filter.toJS();
        let {classify} = this.state;
        let questionData = this.transformFormat(classify.get("data").toArray());
        return (
            <Form onSubmit={this.handleSubmit} layout="inline">
                 <FormItem label="所属套题ID">
                    {getFieldDecorator('setId', {
                        initialValue: setId
                    }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入所属套题ID"/>
                    )}
                  </FormItem>
                 <FormItem label="关键字">
                    {getFieldDecorator('keyword', {
                        initialValue: keyword
                    }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入关键字"/>
                    )}
                  </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                        查询
                    </Button>
                </FormItem>
                {/*<FormItem>*/}
                    {/*<Button type="primary" onClick={ () => {*/}
                        {/*onAddCard && onAddCard(true);*/}
                        {/*} }>*/}
                        {/*添加*/}
                    {/*</Button>*/}
                {/*</FormItem>*/}
            </Form>
        );
    }
}

const Filter = Form.create()(SetQuestionFilter);

export default Filter;
