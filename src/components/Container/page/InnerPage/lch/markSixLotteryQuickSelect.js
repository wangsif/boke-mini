import React from "react";
const animals = ["猴","鸡","狗","猪","鼠","牛","虎","兔","龙","蛇","马","羊"];
export const markSixLotteryQuickSelect=(lotteryValue, playData,checkType)=>{
    let data=playData;
    switch (lotteryValue) {
        case "单":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    if(name%2!==0){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "双":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    if(name%2===0){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "大":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    if(name>=25){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "小":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    if(name<25){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "合单":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    let totalString = name.toString(),
                        totalNum=0;
                    totalString.length===2?totalNum=Number(totalString.charAt(0))+Number(totalString.charAt(1)):totalNum=Number(totalString.charAt(0));
                    if(totalNum%2!==0){
                        ite.check=checkType;;
                    }
                })
                return value;
            });
            break;
        case "合双":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    let totalString = name.toString(),
                        totalNum=0;
                    totalString.length===2?totalNum=Number(totalString.charAt(0))+Number(totalString.charAt(1)):totalNum=Number(totalString.charAt(0));
                    if(totalNum%2===0){
                        ite.check=checkType;;
                    }
                })
                return value;
            });
            break;
        case "家禽":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    if(name%12===0||name%12===1||name%12===2||name%12===4||name%12===5|name%12===10){
                        ite.check=checkType;;
                    }
                })
                return value;
            });
            break;
        case "野兽":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    if(name%12===3||name%12===6||name%12===7||name%12===8||name%12===9||name%12===11){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "尾大":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    let lastArr = name.toString().split(""),
                        lastNum = lastArr[lastArr.length-1];
                    if(lastNum>=5||name===49){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "尾小":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    let lastArr = name.toString().split(""),
                        lastNum = lastArr[lastArr.length-1];
                    if(lastNum<5||name===49){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "合尾大":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    let totalString= name.toString(),
                        totalNum=0;
                    totalString.length===2?totalNum=Number(totalString.charAt(0))+Number(totalString.charAt(1)):totalNum=Number(totalString.charAt(0));
                    let lastNum = totalNum.toString().charAt(totalNum.toString().length-1);
                    if(Number(lastNum)>=5){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "合尾小":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    let totalString= name.toString(),
                        totalNum=0;
                    totalString.length===2?totalNum=Number(totalString.charAt(0))+Number(totalString.charAt(1)):totalNum=Number(totalString.charAt(0));
                    let lastNum = totalNum.toString().charAt(totalNum.toString().length-1);
                    if(Number(lastNum)<5){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "红波":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color} = ite;
                    if(color=="red"){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "蓝波":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color} = ite;
                    if(color=="blue"){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "绿波":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color} = ite;
                    if(color=="green"){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "红单":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="red"&&name%2!==0){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "红双":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="red"&&name%2===0){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "红大":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="red"&&name>=25){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "红小":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="red"&&name<25){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "蓝单":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="blue"&&name%2!==0){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "蓝双":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="blue"&&name%2===0){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "蓝大":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="blue"&&name>=25){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "蓝小":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="blue"&&name<25){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "绿单":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="green"&&name%2!==0){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "绿双":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="green"&&name%2===0){
                        ite.check=checkType
                    }
                })
                return value;
            });
            break;
        case "绿大":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="green"&&name>=25){
                        ite.check=checkType;
                    }
                })
                return value;
            });
            break;
        case "绿小":
            data = playData.map(value=>{
                value.map(ite=>{
                    let {color,name} = ite;
                    if(color=="green"&&name<25){
                        ite.check=checkType
                        return;
                    }
                })
                return value;
            });
            break;
        default:
            let nowYear = new Date().getFullYear();
            const twelveAnimals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"],
                twelveAnimalsOppsite=twelveAnimals.reverse();
            let num = nowYear%12,
                nowYearAni = animals[num],
                nowAnimalsIndex= twelveAnimalsOppsite.indexOf(nowYearAni),
                chooseAnimalsIndex = twelveAnimalsOppsite.indexOf(lotteryValue),
                diffIndex = Math.abs(nowAnimalsIndex-chooseAnimalsIndex);
            let chooseNum=0;
            if(chooseAnimalsIndex>nowAnimalsIndex){
                chooseNum=1+diffIndex;
            }else if(chooseAnimalsIndex<nowAnimalsIndex){
                chooseNum=13-diffIndex;
            }else if(chooseAnimalsIndex===nowAnimalsIndex){
                chooseNum=1;
            }
            if(chooseNum===12){
                chooseNum=0
            }
            data = playData.map(value=>{
                value.map(ite=>{
                    let {name} = ite;
                    if(name%12===chooseNum){
                        ite.check=checkType
                    }
                })
                return value;
            });
            break;
    }
    return data;
}