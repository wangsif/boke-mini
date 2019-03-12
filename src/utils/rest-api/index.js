import fetch from 'isomorphic-fetch';
import {flow, map, reduce} from 'lodash/fp';

class NetworkError extends Error {
    constructor(statusCode, statusText) {
        super('网络异常,请检查您的网络连接');
        this.isNetworkError = true;
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
}

export default (() => {
    let aopFn = null;
    let refreshNewToken = null;

    return {
        init(callback, refreshToken) {
            aopFn = callback;
            refreshNewToken = refreshToken;
        },
        download(url, parameters, fileName) {
            let queryString = '';
            if (parameters) {
                queryString = flow(
                    map(k => ({
                        name: k,
                        value: parameters[k]
                    })),
                    reduce((rs, {name, value}) => {
                        if (!value && value !== 0) {
                            return rs += '';
                        } else {

                            return rs += `${name}=${value}&`;
                        }
                    }, '')
                )(Object.keys(parameters));
                if (queryString.indexOf('&')) {
                    queryString = queryString.substring(0, queryString.length - 1);
                }
                fetch(url + "?" + queryString, {
                    method: 'get',
                    mode: 'cors',//允许带有CORs Header的跨域资源Response
                    credentials: ' '//允许携带cookie
                })
                    .then(res => res.blob().then(blob => {
                        let a = document.createElement('a');
                        a.href = window.URL.createObjectURL(blob);
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }))
            }

        },
        request(url, parameters, method, isValidateJwt,) {
            let head = null;
            method = method.toUpperCase();
            if (method == 'POST' || method == 'PUT' || method == 'PATCH') {
                head = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': ''
                    },
                    mode: 'cors',
                    body: JSON.stringify(parameters || {}),
                    credentials: 'include'
                }
            } else {
                if (parameters) {
                    let paramsArray = [];
                    //拼接参数
                    Object.keys(parameters).forEach(key => paramsArray.push(key + '=' + encodeURIComponent(parameters[key])));
                    if (url.search(/\?/) === -1) {
                        url += '?' + paramsArray.join('&')
                    } else {
                        url += '&' + paramsArray.join('&')
                    }
                }
                head = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/text;charset=utf-8',
                    }
                }
            }
            return refreshNewToken(isValidateJwt).then((jwt) => {

                head.headers.Authorization = jwt;
                return fetch(url, head)
                    .then(function (response) {
                        if (response.status == 500 ||response.status == 504) {
                            throw new NetworkError(response.status, response.statusText);
                        }
                        return response.json();
                    }).then(function (res) {
                        if (aopFn) {
                            return aopFn(res);
                        }
                        return res;
                    }).catch(function (error) {
                        let index = error.toString().indexOf("Unexpected end of JSON input");
                        //如果是json转换失败的异常，就是后端没有返回值（后端json转换使用工具转的，所以正常是不会出现问题的），此时返回一个新的Promise对象，这样前端调用的时候就不会报错了
                        if (index >= 0) {
                            return aopFn('');
                        }
                        else {
                            //如果不是的话，则继续将异常往上抛
                            throw error;
                        }
                    });
            });
        },

    }
})();