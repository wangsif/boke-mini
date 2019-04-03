import alt from 'app/alt';
import {Map, List} from 'immutable';
import UserAction from 'actions/UserAction';
import moment from 'moment';

class UserStore {
    constructor() {
        this.state = this._getInitialState();
        this.bindActions(UserAction);
    }

    _getInitialState() {
        return {
            userInfos: Map({
                loading: false,
                data: List(),
                total: 0,
                pageNo: 1,
                pageSize: 10
            }),
            filter: Map({
                username: '', nickName: ''
            }),
            editModal: {
                show: false
            },
            editUserData: null
        }
    }

    // onLoading(isLoding){
    //     this.setState(({user})=>({
    //         user: user.update('loading',v=>isLoding)}));
    // }


    showEditModal(show) {
        this.setState({
            editModal: {
                show: show
            },
            editUserData: null
        })
    }


    onFilterChange({username, nickName}) {

        this.setState(({filter}) => ({
            filter: filter
                .set('username', username === undefined ? '' : username)
                .set('nickName', nickName === undefined ? '' : nickName)
        }));
    }

    editRow(record) {

        this.setState({
            editModal: {
                show: true
            },
            editUserData: record
        });
    }

    onPageChange(pageNo) {

        this.setState(({userInfos}) => ({
            user: userInfos.set('pageNo', pageNo)
        }));
    }

    onFetchData({userInfos, total}) {

        console.log(List(data))
        let data = userInfos;
        this.setState(({userInfos}) => ({
            userInfos: userInfos.set('loading', false)
                .set('data', List(data))
                .set('total', total)
        }));
    }
}

export default alt.createStore(UserStore);
