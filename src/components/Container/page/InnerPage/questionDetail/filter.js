import React, {Component} from "react";
import {Form, Input, Button, DatePicker, Select, TreeSelect} from "antd";
import {trim} from "app/utils";

const {RangePicker} = DatePicker;
const TreeNode = TreeSelect.TreeNode;
import {map} from 'lodash/fp';


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

                onCommit && onCommit({questionType, classifyKnowledgePath, keyword});
            }
        });
    }


    render() {

        const {getFieldDecorator} = this.props.form;
        const {dataSource, onAddCard} = this.props;
        const {area, categoryInPaper, createTime, questionType, classifyKnowledge, description, choose, title, paperIds, score, answer, id, limitedTime, classifyKnowledgePath, dateRange, keyword} = dataSource.filter.toJS();
        return (
            <Form onSubmit={this.handleSubmit} layout="inline">

                <FormItem label="题干关键字">
                    {getFieldDecorator('keyword', {
                            initialValue: keyword
                        }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入知识点路径"/>
                    )}
                </FormItem>

                <FormItem label="知识点路径">
                    {getFieldDecorator('classifyKnowledgePath', {
                            initialValue: classifyKnowledgePath
                        }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入知识点路径2"/>
                    )}
                </FormItem>

                <FormItem label="题型">
                    {getFieldDecorator('questionType', {
                            initialValue: questionType
                        }
                    )(
                        <Select style={{width: 120}}>
                            <Option value="0">全部</Option>
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
}

const Filter = Form.create()(QuestionDetailFilter);

export default Filter;
