/*
* 订单成功过度页面
* */

var app = getApp()
var getApi=require('../../utils/util.js')
var mdCopy=require('../../utils/md5_copy.js')
var strophe =require('../../utils/strophe.js')
var WebIM=require('../../utils/WebIM.js')
var WebIM=WebIM.default
Page({
    data:{
        title: '正在为您优先叫车...',
        apiUrl: 'https://syjpp.txzkeji.com/passenger/api'
    },
    onLoad: function () {
        /*app.globalData.testmsg = "瞎测试"
        console.log(app.globalData)*/
        console.log(app.globalData.backMessageType)

        /*function nextPage() {
            if(app.globalData.backMessageType==11){
                wx.redirectTo({
                    url: '/pages/haveOrder/haveOrder'
                })
            }
        }*/
        var setTimeoutId = setTimeout(function nextPage() {
            if(app.globalData.backMessageType==11){
                console.log("司机接单")
                wx.redirectTo({
                    url: '/pages/haveOrder/haveOrder'
                })
            }
        },10000);


    },
    makeCancel: function (e) {
        var that=this
        var order_num =''   //获取本地存储中的订单编号
        try{
            var value=wx.getStorageSync('order_num')
            if(value){
                order_num=value
            }
        }catch(e){
            //没有获取订单编号
        }

        var tokenArr=[];    //获取storage里面的token
        try{
            var value=wx.getStorageSync('token')
            if(value){
                tokenArr = value;
                console.log(value)
            }
        }catch(e){
            console.log('失败')
        }

        var userToken='';     //获取storage中的user_token
        try{
            var value=wx.getStorageSync('userInfo')
            if(value){
                userToken=value;
            }
        }catch(e){
            console.log('user_token错误')
            wx.redirectTo({
                url: '/pages/login/login'
            })
        }

        var ranString=getApi.randomString(12);
        var ranStringCode=getApi.randomString(12);
        var timestampToken=new Date().getTime();

        var orderNum = ''
        try{
            var value=wx.getStorageSync('order_num')
            if(value){
                orderNum=value;
            }
        }catch(e){
            console.log('获取订单编号错误')
        }

        console.log(orderNum);
        var orderObj={
            'order_number':orderNum
        }
        var orderCode=JSON.stringify(orderObj);

        function createSignCode() {   //获取接口的sign
            var params=[];
            params[0]= 'access_token='+tokenArr[0];
            params[1]= 'format=JSON';
            params[2]= 'method=user.order.create';
            params[3]= 'once='+ranStringCode;
            params[4]= 'post_body='+orderCode;
            params[5]= 'secret_token='+tokenArr[1];
            params[6]= 'timestamp='+timestampToken;
            params[7]= 'user_token='+userToken;
            params[8]= 'version=0.1';
            //console.log(params);
            var signCode = params.join('&');
            return mdCopy.md5(signCode);
        }

        wx.request({    //取消订单
            url: that.data.apiUrl,
            data: {
                access_token : tokenArr[0],
                format : 'JSON',
                method : 'user.order.cancelredisorder',
                once : ranStringCode,
                post_body :orderCode,
                secret_token : tokenArr[1],
                timestamp : timestampToken,
                user_token : userToken,
                version : '0.1',
                sign : createSignCode()
            },
            header:{
                "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success:function (res) {
                console.log(res)
                //var isCall=res.data.result.success;
                if(res.data.result.success==1){
                    wx.redirectTo({
                        url: '/pages/home/home'
                    })
                }else{
                    wx.redirectTo({
                        url: '/pages/home/home'
                    })
                }
            }
        })




        /*wx.redirectTo({
            url: '/pages/home/home'
        })*/
    }
})
