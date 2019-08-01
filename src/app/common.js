import {CACHE_USER_INFO_ALIAS} from './constant.js';
import {browserHistory} from 'react-router';

const Main = {
    localKey: { // 本地存储Key
        userJwt: 'USER_AUTHORIZATION'
    },
    /**
     * 只能输入英文
     *
     * @param {any} str
     * @returns
     */
    checkEng(str) {
        var reg = new RegExp(/^[A-Za-z]+$/);
        return str && reg.test(str);
    },
    /**
     * 参数格式化
     *
     * @param {any} data
     * @returns
     */
    paramFormat(data) {
        let paramArr = [];
        let paramStr = '';
        for (let attr in data) {
            paramArr.push(attr + '=' + data[attr]);
        }
        paramStr = paramArr.join('&');
        return paramStr ? '?' + paramStr : paramStr;
    },
    /**
     * 本地数据存储或读取
     *
     * @param {any} key
     * @param {any} value
     * @returns
     */
    localItem(key, value) {
        if (arguments.length == 1) {
            return localStorage.getItem(key) && localStorage.getItem(key) !== 'null' ? localStorage.getItem(key) : null;
        } else {
            return localStorage.setItem(key, value);
        }
    },
    /**
     * 删除本地数据
     *
     * @param {any} k
     * @returns
     */
    removeLocalItem(key) {
        if (arguments.length == 1) {
            return localStorage.removeItem(key);
        } else {
            return localStorage.clear();
        }
    },

    // setUserInfo(userInfo){
    //     sessionStorage
    //         .setItem(CACHE_USER_INFO_ALIAS, JSON.stringify(userInfo));
    // },
    // // getUserInfo(){
    // //     let userInfo = JSON.parse(sessionStorage.getItem(CACHE_USER_INFO_ALIAS));
    // //     if (!userInfo) {
    // //         browserHistory.push('/login');
    // //         return;
    // //     }
    //
    //     return userInfo;
    // },
    setSessionStorage(key, value){
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    getSessionStorage(key){
        let value = JSON.parse(sessionStorage.getItem(key));
        return value;
    },

    getJwt(){
        try{
            return this.getUserInfo().jwt;
        }catch(e){
            return "";
        }
    },

    getRefreshToken(){
        try{
            return this.getUserInfo().refreshToken;
        }catch(e){
            return "";
        }
    }

};

export default Main;
