import React, {Component} from "react";
import {Form, Input, Button, DatePicker, Select,} from "antd";
import {trim} from "app/utils";
const {RangePicker} = DatePicker;
import {map} from 'lodash/fp';


const dateFormat = 'YYYY/MM/DD';
const FormItem = Form.Item;

class SetQuestionFilter extends Component {

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
                let {answer,createTime,classifyKnowledge,description,setId,choose,id,title,paperIds,classifyKnowledgePath,dateRange} = values;
                onCommit && onCommit(trim(answer),createTime,classifyKnowledge,trim(description),setId,trim(choose),id,trim(title),trim(paperIds),trim(classifyKnowledgePath),dateRange);
            }
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {dataSource,onAddCard} = this.props;
        const {setId,keyword,paperIds} = dataSource.filter.toJS();
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
                 <FormItem label="所属试卷ID">
                    {getFieldDecorator('paperIds', {
                        initialValue: paperIds
                    }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入所属试卷ID"/>
                    )}
                  </FormItem>
                 <FormItem label="关键字">
                    {getFieldDecorator('keyword', {
                        initialValue: keyword
                    }
                    )(
                        <Input style={{width: '150px'}} placeholder="请输入所属知识点ID 路径"/>
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
