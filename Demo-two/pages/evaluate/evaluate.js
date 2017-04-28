/*
* 评价页面
* */
var app=getApp()
var getApi = require('../../utils/util.js')
var mdCopy=require('../../utils/md5_copy.js')
var strophe = require('../../utils/strophe.js')
var count=0
Page({
    data: {
        stars: [0,1,2,3,4],
        headStars: '',
        normalSrc: '../../images/no-star.png',
        selectedSrc: '../../images/full-star.png',
        halfSrc: '../../images/half-star.png',
        key: 0,   //评分
        driverImage: '../../images/driverhead.png',
        driverPhone: '',
        driverId: '',
        driverCard: '',
        token: '',
        userInfo: '',
        apiUrl: 'https://syjpp.txzkeji.com/passenger/api'
    },
    starCount: function (orginStars) {
       var starNum = orginStars*10/10, stars =[],i=0;
       do{
           if(starNum>=1){
               stars[i] = 'full';
           }else if(starNum>=0.5){
               stars[i] = 'half';
           }else{
               stars[i] = 'no'
           }
           starNum--;
           i++;
       }while (i<5)
        return stars;
    },
    onLoad: function (options) {
      var that=this

        var driverInfo = app.globalData.driverInfo
        //var starNum = driverInfo.attache.driver_server_score
        //var image = driverInfo.attache.driver_cover
        //var driverPhone = driverInfo.attache.driver_phone
        //var driverId = driverInfo.attache.driver_id
        //var driverCard = driverInfo.attache.number_plate

        var starNum = 3.5;
        var headStars = that.starCount(starNum)
        that.setData({     //修改页面显示值
            headStars : headStars,
            //driverPhone : driverInfo.attache.driver_phone,
            //driverId : driverInfo.attache.driver_id,
            //driverCard: driverInfo.attache.number_plate
        });
    },
    selectLeft: function (e) {     //乘客点击评分
        var that = this
        console.log('left');
        var key = e.currentTarget.dataset.key
        if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key = 0;
        }
        count = key
        that.setData({
            key: key
        })

    },
    selectRight: function(e){
      var that = this
        console.log('right')
        var key = e.currentTarget.dataset.key
        count = key
        that.setData({
            key: key
        })
    },

    makeCall: function (e) {   //投诉电话
        var that=this
        wx.makePhoneCall({
            phoneNumber: '400-000-6777'
        });
    },
    bindFormSubmit: function (e) {    //提交评价返回主界面
        var that = this
        console.log(e.detail.value.textarea);
        var tokenArr=[];    //获取storage里面的token
        try{
            var value=wx.getStorageSync('token')
            if(value){
                tokenArr = value;
            }
        }catch(e){
            console.log('失败')
        }

        var userToken=0;     //获取storage中的user_token
        try{
            var value=wx.getStorageSync('userInfo')
            if(value){
                userToken=value;
            }
        }catch(e){
            console.log('user_token错误')
        }

        var order_number=0;     //获取storage中的user_token
        try{
            var value=wx.getStorageSync('order_num')
            if(value){
                userToken=value;
            }
        }catch(e){
            console.log('order_num错误')

        }


        var ranString=getApi.randomString(12);
        var ranStringCode = getApi.randomString(12);   //申请验证码时候的随机字符串
        var timestampToken = new Date().getTime();   //生成时间戳
        var orderObj = {
               driver_id : that.data.driverId,
               order: order_number,
               content: '',
               score: '5'
        }
        var orderCode = JSON.stringify(orderObj)

        function createSignCode() {    //获取接口的sign
            var params=[];
            params[0]= 'access_token='+tokenArr[0];
            params[1]= 'format=JSON';
            params[2]= 'method=user.lbs.getpoint';
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

        wx.request({
            url: that.data.apiUrl,
            data: {
                access_token : tokenArr[0],
                format : 'JSON',
                method : 'user.user.comment',
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
            success: function (res) {
                console.log(res)
                wx.redirectTo({
                    url: '/pages/home/home'
                })
            }
        })



    }

})