import alt from 'app/alt';
import {Map, List} from 'immutable';
import MailAction from 'action/MailAction';
class MainStore {
    constructor() {
        this.state = this._getInitialState();
        this.bindActions(MailAction);
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
            editModal: {
                show: false
            },
            editQuestionDetailData: null
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
}
export default  alt.createStore(MainStore);