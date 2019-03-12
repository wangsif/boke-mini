import React,{Component}from 'react';
import {notification,Icon} from 'antd';



/**
 * 获取周日期区间,本周一到下周一的日期
 * @param week
 * @returns {*[]}
 */
export function getDateRangeByWeek(year,week){

    let firstInCurWeek = moment(`${year}-06-01`).isoWeek(week).subtract(3,'days');
    let firstInNextWeek = moment(`${year}-06-01`).isoWeek(week).subtract(3,'days').add(1,'weeks');

    return [firstInCurWeek.format('YYYY-MM-DD HH:mm:ss'),firstInNextWeek.format('YYYY-MM-DD HH:mm:ss')];
}

//去掉空格方法
export function trim(s) {
    if (s!=null) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }
}

//提示消息工具 1 表示成功消息 2表示 错误消息 3表示提示消息
export function notisfy(type,msg){
    switch(type){
        case 1:
            notification.open({
                message: '成功消息',
                description:msg,
                icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
            });
        break;
        case 2:
            notification.open({
                message: '错误消息',
                description:msg,
                icon: <Icon type="frown" style={{ color: 'red' }} />,
            });
            break;
        case 3:
            notification.open({
                message: '提示消息',
                description:msg,
                icon: <Icon type="meh" style = {{color:'orange'}}/>,
            });
            break;
    }

}
export function setRouteInfo(routeInfo) {
    //removeRouteInfo();
    sessionStorage.setItem(CACHE_ROUTE_INFO_ALIAS, JSON.stringify(routeInfo));
}




