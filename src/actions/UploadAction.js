import alt from 'app/alt';
import {map} from 'lodash/fp';

class UploadAction {

    constructor() {
        this.generateActions('updatUploadDetail')
    }

    loading(isLoding) {
        return isLoding;
    }



}


export default alt.createActions(UploadAction);
