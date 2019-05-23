import React, {Component} from 'react';
import alt from 'app/alt';
import {Map, List} from 'immutable';
import ArticleAction from 'action/ArticleAction';
class ArticleStore{

    constructor() {
        this.state = this._getInitialState();
        this.bindActions(ArticleAction);
    }
    _getInitialState() {
        return {
            article: Map({
                loading: false,
                data: List(),
                total: 0,
                pageNo: 1,
                pageSize: 3
            }),
            filter: Map({
                area: '',
                categoryInPaper: '',
                createTime: '',
                questionType: '',
                classifyKnowledge: '',
                description: '',
                choose: '',
                title: '',
                paperIds: '',
                score: '',
                answer: '',
                id: '',
                limitedTime: '',
                classifyKnowledgePath: '',
                keyword: ''
            }),
            editModal: {
                show: false
            },
            editQuestionDetailData: null
        }
    }

    onLoading(isLoding) {
        this.setState(({article}) => ({
            article: article.update('loading', v => isLoding)
        }));
    }
    onPageChange(pageNo) {

        this.setState(({article}) => ({
            article: article.set('pageNo', pageNo)
        }));
    }


    onFetchData({article, total}) {
        let data = article;
        console.log(data)
        this.setState(({article}) => ({
            article: article.set('loading', false)
                .set('data', List(data))
                .set('total', total)
        }));
    }
}
export default  alt.createStore(ArticleStore);