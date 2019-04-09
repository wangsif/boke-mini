import React from "react";
import { Tree ,Button,message} from 'antd';

const { TreeNode } = Tree;

export default class ClassifyList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            gData:[],
            a:[],
            expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
            updateKeyArr:[],
            dragKeyArr:[],
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.classify!==this.props.classify){
            this.setState({
                gData:nextProps.classify
            });
        }
        if(nextProps.haveSaved!==this.props.haveSaved){
            this.setState({
                updateKeyArr:[],
                dragKeyArr:[]
            });
        }
    }
    // onDragEnter = (info) => {
    //     console.log(info);
        // expandedKeys 需要受控时设置
        // this.setState({
        //   expandedKeys: info.expandedKeys,
        // });
    // }

    onDrop = (info) => {
        let {transfromOriginData} = this.props;
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const dragNextKey = info.dragNode.props.children;
        let updateKey="";
        let {updateKeyArr,dragKeyArr} = this.state;
        if(dropKey.split('/').length>=3 ||(dragKey.split('/').length===2 && dropKey.split('/').length===3) ||(dragKey.split('/').length===2 && dropKey.split('/').length===2) ){
            message.error("错误！分类等级不允许超过两级");
            return false;
        }
        updateKey = dropKey+'/'+dragKey.split('/')[dragKey.split('/').length-1];
        updateKeyArr.push(updateKey);
        dragKeyArr.push(dragKey);
        this.setState({
            updateKeyArr,
            dragKeyArr
        });
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.state.gData];
        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 // Has children
            && info.node.props.expanded // Is expanded
            && dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        transfromOriginData(data,dragKeyArr,updateKeyArr);
        this.setState({
            gData: data,
        });
    }
    onCheck = (checkedKeys, info) => {
        let {onGetSelectKey} = this.props;
        onGetSelectKey(checkedKeys);
    }
    onSelect = (checkedKeys, info)=>{
        let {onSelectDeleteSingle} = this.props;
        onSelectDeleteSingle(checkedKeys);
    }
    render() {
        let {gData} = this.state;
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.key} title={item.title} />;
        });
        return (
            <div>
            <Tree
                className="draggable-tree"
                onSelect={this.onSelect}
                defaultExpandedKeys={this.state.expandedKeys}
                checkable
                draggable
                blockNode
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                onCheck={this.onCheck}
            >
                {loop(this.state.gData)}
            </Tree>
                {/*<Popconfirm placement="top"*/}
                            {/*title={`确认修改?`}*/}
                            {/*onConfirm={() => {*/}
                                {/*UserAction.upToGeneralAgent(record.username);*/}
                            {/*}} okText="确认"*/}
                            {/*cancelText="取消">*/}
                    {/*<Button type="danger">升为总代</Button>*/}
                {/*</Popconfirm>*/}
            </div>
        );
    }
}