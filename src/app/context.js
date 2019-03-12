import {createBrowserHistory} from 'history'


//应用上下文对象

export default (()=>{
    //全局唯一的history访问点和,router context里面的是同一个引用
    let history = createBrowserHistory();
    return{
        getBrowserHistory(){
            return history;
        },
    }
})();
