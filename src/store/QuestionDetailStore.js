import alt from 'app/alt';
import {Map, List} from 'immutable';
import QuestionDetailAction from 'actions/QuestionDetailAction';
import moment from 'moment';

class QuestionDetailStore {
    constructor() {
        this.state = this._getInitialState();
        this.bindActions(QuestionDetailAction);
    }

    _getInitialState() {
        return {
            questionDetail: Map({
                loading: false,
                data: List(),
                total: 0,
                pageNo: 1,
                pageSize: 10
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
                keyword: '',
                dateRange: List([moment().subtract(1, 'M'), moment()]),//moment数组对象
            }),
            editModal: {
                show: false
            },
            editQuestionDetailData: null
        }
    }

    onLoading(isLoding) {
        this.setState(({questionDetail}) => ({
            questionDetail: questionDetail.update('loading', v => isLoding)
        }));
    }

    onAllPurchases(purchases) {

        this.setState({
            purchases: purchases
        })
    }

    showEditModal(show) {
        this.setState({
            editModal: {
                show: show
            },
            editQuestionDetailData: null
        })
    }


    onFilterChange({area, categoryInPaper, createTime, questionType, classifyKnowledge, description, choose, keyword, paperIds, score, answer, id, limitedTime, classifyKnowledgePath, dateRange}) {
        this.setState(({filter}) => ({
            filter: filter
                .set('area', area)
                .set('categoryInPaper', categoryInPaper)
                .set('createTime', createTime)
                .set('questionType', questionType)
                .set('classifyKnowledge', classifyKnowledge)
                .set('description', description)
                .set('choose', choose)
                .set('paperIds', paperIds)
                .set('score', score)
                .set('answer', answer)
                .set('id', id)
                .set('limitedTime', limitedTime)
                .set('classifyKnowledgePath', classifyKnowledgePath)
                .set('dateRange', List(dateRange))
                .set('keyword', keyword)
        }));
    }

    editRow(record) {

        this.setState({
            editModal: {
                show: true
            },
            editQuestionDetailData: record
        });
    }

    onPageChange(pageNo) {

        this.setState(({questionDetail}) => ({
            questionDetail: questionDetail.set('pageNo', pageNo)
        }));
    }

    onFetchData({questionDetail, total}) {
        let data = questionDetail;
        this.setState(({questionDetail}) => ({
            questionDetail: questionDetail.set('loading', false)
                .set('data', List(data))
                .set('total', total)
        }));
    }
}

export default alt.createStore(QuestionDetailStore);
