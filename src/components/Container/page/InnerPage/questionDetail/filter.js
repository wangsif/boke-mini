import React, {Component} from "react";
import {Form, Input, Button, DatePicker, Select, TreeSelect,Cascader} from "antd";
import {trim} from "app/utils";

const {RangePicker} = DatePicker;
const TreeNode = TreeSelect.TreeNode;
import {map} from 'lodash/fp';
import {connect} from "alt-react";
import QuestionDetailStore from "../../../../../store/QuestionDetailStore";
import ClassifyStore from "../../../../../store/ClassifyStore";
import QuestionDetailAction from "../../../../../actions/QuestionDetailAction";
import ClassifyAction from "../../../../../actions/ClassifyAction";


const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;

class QuestionDetailFilter extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleSubmit(e) {
        e.preventDefault();
        let _self = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let {onCommit} = _self.props;
                let {keyword, area, categoryInPaper, createTime, questionType, classifyKnowledge, description, choose, title, paperIds, score, answer, id, limitedTime, classifyKnowledgePath, dateRange} = values;
                classifyKnowledgePath = classifyKnowledgePath[1];
                onCommit && onCommit({questionType, classifyKnowledgePath, keyword});
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
            val.children.map((item,index)=>{
                let newObj ={};
                newObj["value"] ="/"+item["pid"]+"/"+item["id"]+"/";
                newObj["label"] = item.classifyName;
                newObj["id"] ="0-"+ item.pid+"-"+index;
                newArray["children"].push(newObj);
            });
            return newArray
        })
        return newData;
    }
    onChange = (value) => {
        console.log(value);

    }
    render() {

        const {getFieldDecorator} = this.props.form;
        const {dataSource, onAddCard,classify} = this.props;
        const {area, categoryInPaper, createTime, questionType, classifyKnowledge, description, choose, title, paperIds, score, answer, id, limitedTime, classifyKnowledgePath, dateRange, keyword} = dataSource.filter.toJS();
        let questionData = this.transformFormat(classify.get("data").toArray());
        console.log(questionData)
        return (
            <Form onSubmit={this.handleSubmit} layout="inline">

                <FormItem label="题干关键字">
                    {getFieldDecorator('keyword', {
                            initialValue: keyword
                        }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入关键字"/>
                    )}
                </FormItem>

                <FormItem label="知识点路径">
                    {getFieldDecorator('classifyKnowledgePath', {
                            initialValue: classifyKnowledgePath
                        }
                    )(
                        <Cascader onChange={this.onChange}  options={questionData} style={{width: '150px'}} placeholder="请输入知识点路径"/>
                    )}
                </FormItem>

                <FormItem label="题型">
                    {getFieldDecorator('questionType', {
                            initialValue: questionType
                        }
                    )(
                        <Select style={{width: 120}}>
                            <Option value="">全部</Option>
                            <Option value="1">单选题</Option>
                            <Option value="2">多选题</Option>
                            <Option value="3">不定项选择题</Option>
                            <Option value="4">判题</Option>
                            <Option value="5">简答题</Option>
                            <Option value="6">套题</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                        查询
                    </Button>
                </FormItem>
                <FormItem>
                    {/*<Button type="primary" onClick={ () => {*/}
                    {/*onAddCard && onAddCard(true);*/}
                    {/*} }>*/}
                    {/*添加*/}
                    {/*</Button>*/}
                </FormItem>
            </Form>
        );
    }
    componentDidMount() {
        ClassifyAction.fetchData();
    }
}

const Filter = Form.create()(QuestionDetailFilter);

export default connect(Filter, {
    listenTo() {
        return [ClassifyStore];
    },
    getProps() {
        return {
            classify:ClassifyStore.getState().classify
        }
    }
});
