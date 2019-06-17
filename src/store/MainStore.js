import alt from 'app/alt';
import {Map, List} from 'immutable';
import MailAction from 'action/MailAction';
import React from 'react';
class MainStore {
    constructor() {
        this.state = this._getInitialState();             //定义state初始值的阶段
        this.bindActions(MailAction);                  //监听action
    }
    _getInitialState() {
        return {
            article1: Map({
                loading: false,
                data: List(),
                total: 0,
                pageNo: 1,
                pageSize: 3,
                title: ''
            }),

        }
    }



    onLoading(isLoding) {
        this.setState(({article1}) => ({
            article1: article1.update('loading', v => isLoding)
        }));
    }
    onFetchData({article1, total}) {
        let data = article1;
        console.log(data)
        this.setState(({article1}) => ({
            article1: article1.set('loading', false)
                .set('data', List(data))
                .set('total', total)
        }));
    }

    onPageChange(pageNo,title) {

        this.setState(({article1}) => ({
            article1: article1.set('pageNo', pageNo),
            title : title
        }));
        console.log(title)
        console.log(pageNo)
    }

    onUpdateTitle(title){
        this.setState(({article1}) => ({
            article1: article1.set('title',title),
        }));
        console.log(title)
    }


}
export default  alt.createStore(MainStore);