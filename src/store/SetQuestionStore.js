import alt from 'app/alt';
import {Map, List} from 'immutable';
import SetQuestionAction from 'actions/SetQuestionAction';
import moment from 'moment';

class SetQuestionStore {
    constructor() {
        this.state = this._getInitialState();
        this.bindActions(SetQuestionAction);
    }

    _getInitialState() {
        return {
            setQuestion: Map({
                loading: false,
                data: List(),
                total: 0,
                pageNo: 1,
                pageSize: 10
            }),
            filter: Map({
                answer: '',
                createTime: '',
                classifyKnowledge: '',
                description: '',
                setId: '',
                choose: '',
                id: '',
                title: '',
                paperIds: '',
                keyword:'',
                classifyKnowledgePath: '',
                dateRange: List([moment().subtract(1, 'M'), moment()]),//moment数组对象
            }),
            editModal: {
                show: false
            },
            editSetQuestionData: null
        }
    }

    onLoading(isLoding) {
        this.setState(({setQuestion}) => ({
            setQuestion: setQuestion.update('loading', v => isLoding)
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
            editSetQuestionData: null
        })
    }


    onFilterChange({answer, createTime, classifyKnowledge, description, setId, choose, id, title, paperIds, classifyKnowledgePath, dateRange, keyword}) {
        this.setState(({filter}) => ({
            filter: filter
                .set('answer', answer)
                .set('createTime', createTime)
                .set('classifyKnowledge', classifyKnowledge)
                .set('description', description)
                .set('setId', setId)
                .set('choose', choose)
                .set('id', id)
                .set('title', title)
                .set('paperIds', paperIds)
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
            editSetQuestionData: record
        });
    }

    onPageChange(pageNo) {

        this.setState(({setQuestion}) => ({
            setQuestion: setQuestion.set('pageNo', pageNo)
        }));
    }

    onFetchData({setQuestion, total}) {

        let data = setQuestion;
        this.setState(({setQuestion}) => ({
            setQuestion: setQuestion.set('loading', false)
                .set('data', List(data))
                .set('total', total)
        }));
    }
}

export default alt.createStore(SetQuestionStore);
