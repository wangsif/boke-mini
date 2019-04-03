import alt from 'app/alt';
import QuestionAction from 'actions/QuestionAction'
import {List, Map} from "immutable";

class QuestionStore{
    constructor(){
        this.state = this._getInitialState();
        this.bindActions(QuestionAction);
    }

    _getInitialState() {
        return {
            record: Map({
                loading: false,
                data: List(),
                total: 0,
                pageNo: 1,
                pageSize: 10,
                showModel: false
            }),
            filter: Map({
                classifyKnowledgePath: '',
                questionType: '',
                keyword:''
            }),
        }
    }

    onFilterChange({classifyKnowledgePath,questionType,keyword}) {

        this.setState(({record, filter}) => ({
            record: record.set('pageNo', 1),
            filter: filter
                .set('classifyKnowledgePath', classifyKnowledgePath)
                .set('questionType', questionType)
                .set('keyword', keyword)
        }));

    }

    onShowModels(showModel) {
        console.log(showModel)
        this.setState(({record}) => ({
            record: record.set('showModel', showModel)
        }));
    }

    onPageChange({pageNo}) {
        this.setState(({record}) => ({
            record: record.set('loading', false)
                .set('pageNo', pageNo)
        }))
        ;
    }

    onLoading(isLoding) {
        this.setState(({record}) => ({
            record: record.update('loading', v => isLoding)
        }));
    }

    onFetchData({questionDetails, total, pageNo, pageSize}) {
        this.setState(({record}) => ({
            record: record.set('loading', false)
                .set('data', List(questionDetails))
                .set('total', total)
                .set('pageNo', pageNo)
                .set('pageSize', pageSize)
        }));
    }
}

export default alt.createStore(QuestionStore);