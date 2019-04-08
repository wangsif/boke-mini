import alt from 'app/alt';
import {Map,List} from 'immutable';
import ClassifyAction from 'actions/ClassifyAction';
import moment from 'moment';
import RestAPI from "../utils/rest-api";
import Config from "../app/common";
import {message} from "antd";

class ClassifyStore{
    constructor() {
        this.state = this._getInitialState();
        this.bindActions(ClassifyAction);
    }

    _getInitialState(){
        return{
            classify:Map({
                loading:false,
                data:List()
            }),
            filter:Map({
                classifyName:'',pid:'',id:''
            }),
            editModal: {
                show: false
            },
            editClassifyData: Map({
                classifyName:"",
                classifyType:""
            }),
        }
    }
    onDeleteClassifyData=(data) =>{
        RestAPI.request(`/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/classify/item`, {ids:data.toString()},
            'delete',
            true
        ).then((data) => {
            ClassifyAction.fetchData();
            message.success('删除成功！');

        }).catch(error => {
            message.error('删除失败！' + error.message);
        });
    }
    onLoading(isLoding){
        this.setState(({classify})=>({
            classify: classify.update('loading',v=>isLoding)}));
    }

    onAllPurchases(purchases){

        this.setState({
            purchases:purchases
        })
    }

     showEditModal(show){
            this.setState({
                editModal: {
                    show: show
                },
                editClassifyData: null
            })
        }


    onFilterChange({classifyName,pid,id,dateRange}){
        this.setState(({filter})=>({
            filter:filter
                .set('classifyName',classifyName)
                .set('pid',pid)
                .set('id',id)
        }));
    }

    editRow(record){

        this.setState({
            editModal: {
                show: true
            },
            editClassifyData: record
        });
    }

    onPageChange(pageNo){

        this.setState(({classify})=>({
            classify:classify.set('pageNo',pageNo)}));
    }

    onFetchData({classify,total}){

        let data = classify;
        this.setState(({classify})=>({
        classify:classify.set('loading',false)
                .set('data',List(data))
                .set('total',total)
        }));
    }
}

export default alt.createStore(ClassifyStore);
