import React, {Component} from 'react';
import alt from 'app/alt';
import {Map, List} from 'immutable';
import ContentAction from "../action/ContentAction";

class ContentStore {
    constructor() {
        this.state = this._getInitialState();
        this.bindActions(ContentAction);
    }

}
export default alt.createStore(ContentStore)