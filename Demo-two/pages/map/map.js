//map.js
var app = getApp()
var getApi = require('../../utils/util.js')
var mdCopy = require('../../utils/md5_copy.js')

//map.js
Page({
    data: {
        longitude: '',
        latitude: '',
        stars: '',
        starNum: 0,
        driverImage: '../../images/driverhead.png',
        driverPhone: '',
        driverId: '',
        driverCard: '',
        markers: [{
            iconPath: "",
            id: 0,
            latitude: '',
            longitude: '',
            width: '',
            height: ''
        }],
        /*polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color:"#FF0000DD",
            width: 2,
            dottedLine: true
        }],*/
        /*controls: [{
            id: 1,
            iconPath: '../../images/cancel.png',
            position: {
                left: '',
                top: '',
                width: '',
                height: ''
            },
            clickable: true
        }],*/
        token: '',
        userInfo: '',
        apiUrl: 'https://syjp.txzkeji.com/passenger/api'

    },
    starCount: function (originStars) {
      var starNum= originStars*10/10,stars = [],i=0;
      do{
          if(starNum>=1){
              stars[i] = 'full';
          }else if(starNum>=0.5){
              stars[i] = 'half';
          }else{
              stars[i] = 'no';
          }
          starNum--;
          i++;
      }while (i<5)
        return stars;
    },
    onLoad: function (options) {    //页面加载的时候先加载地图
        var that=this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    controls:[{
                        id: 1,
                        iconPath: '../../images/cancel.png',
                        position: {
                          left: (res.screenWidth / 10) - (res.screenWidth / 27),
                          top: (res.screenHeight/10) + (res.screenHeight/10)*5.9,
                          width: res.screenWidth - 45,
                          height: (res.screenHeight/10) - 20
                        },
                        clickable: true
                    }]
                })
            }

        })

        wx.getLocation({     //获取当前位置，打开地图
            type: 'wgs84',
            success: function(res) {
                //console.log(res.latitude)
                //console.log(res.longitude)
                that.setData({
                    longitude:res.longitude,
                    latitude:res.latitude
                })
            }
        })

        console.log(app.globalData.driverInfo);
        var driverInfo = app.globalData.driverInfo
        var starNum = driverInfo.attache.driver_server_score
        //var image = driverInfo.attache.driver_cover
        var driverPhone = driverInfo.attache.driver_phone
        var driverId = driverInfo.attache.driver_id
        var driverCard = driverInfo.attache.number_plate

        console.log(that.starCount(starNum));
        that.setData({     //修改页面显示值
            stars : that.starCount(starNum),
            driverPhone : driverInfo.attache.driver_phone,
            driverId : driverInfo.attache.driver_id,
            driverCard: driverInfo.attache.number_plate
        })

        console.log(starNum)
        /*var starArray = [],i=0;   //显示司机评分
        do{
            if(i<=starNum){
                starArray[i] = "full";
            }else{
                starArray[i] = "no";
            }
            starNum--;
            i++;
        }while(i<5);
        console.log(starArray);*/


        var tokenArr =''
        var userToken = ''
        try{    // 获取token
            var value = wx.getStorageSync('token')
            if(value){
                tokenArr = value
            }
        }catch (e){
            console.log("获取token失败")
        }

        try{    //获取user_token
            var value = wx.getStorageSync('userInfo')
            if(value){
                userToken = value
            }
        }catch (e){
            console.log("获取user_token失败")
        }
        that.setData({
            stars: that.starCount(starNum),
            token: tokenArr,
            userInfo: userToken
        })

        var ranString=getApi.randomString(12);
        var ranStringCode = getApi.randomString(12);   //申请验证码时候的随机字符串
        var timestampToken = new Date().getTime();   //生成时间戳
        var driverObj = {driver_id : driverId}
        var driverCode = JSON.stringify(driverObj)

        function createSignCode() {    //获取接口的sign
            var params=[];
            params[0]= 'access_token='+tokenArr[0];
            params[1]= 'format=JSON';
            params[2]= 'method=user.lbs.getpoint';
            params[3]= 'once='+ranStringCode;
            params[4]= 'post_body='+driverCode;
            params[5]= 'secret_token='+tokenArr[1];
            params[6]= 'timestamp='+timestampToken;
            params[7]= 'user_token='+userToken;
            params[8]= 'version=0.1';
            //console.log(params);
            var signCode = params.join('&');
            return mdCopy.md5(signCode);
        }

        wx.request({     //获取司机位置
            url: that.data.apiUrl,
            data: {
                access_token : tokenArr[0],
                format : 'JSON',
                method : 'user.lbs.getpoint',
                once : ranStringCode,
                post_body :driverCode,
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
                var driverLocation = res.data.result.location
                that.setData({
                    markers: [{
                        iconPath: "../../images/taxi.png",
                        id: 0,
                        latitude: driverLocation[1],
                        longitude: driverLocation[0],
                        width: 32,
                        height: 40
                    }]
                })
            }
        })

        var setInervalId = setInterval(function nextPage() {
          if (app.globalData.backMessage.type==6){
                console.log(app.globalData.backMessage)
                wx.redirectTo({
                    url: '/pages/trip/trip'
                });
                clearInterval(setInervalId)
          } else if (app.globalData.backMessage.type == 3){
                wx.showToast({
                    title: '司机取消订单',
                    icon: 'cancel',
                    duration: 5000
                });
               setTimeout(function () {
                   wx.redirectTo({
                       url: '/pages/home/home'
                   });
               },4000)
                clearInterval(setInervalId)
            }else{
              console.log("没收到消息")
            }
        },3000);

    },
    makeCall: function(){      //点击拨打司机电话
        var that = this
        var driverInfo = app.globalData.driverInfo
        var driverPhone = driverInfo.attache.driver_phone
        console.log(driverPhone)
        wx.makePhoneCall({
            phoneNumber: driverPhone
        })
    },
    makeCancel: function (e) {
        var that= this
        var tokenArr= that.data.token
        var userToken = that.data.userInfo

        console.log(tokenArr)
        console.log(userToken)
        var order_number =''
        try{
            var value =wx.getStorageSync('order_num')
            if(value){
                order_number =value
            }
        }catch (e){
            console.log("获取订单编号失败")
        }

        console.log(order_number)
        var ranString=getApi.randomString(12);
        var ranStringCode = getApi.randomString(12);   //申请验证码时候的随机字符串
        var timestampToken = new Date().getTime();   //生成时间戳
        var orderObj = {
            order_number : order_number,
            reason : '取消订单',
            type: '1'
        }
        var orderCode = JSON.stringify(orderObj)
        console.log(orderCode)
        console.log(typeof(orderCode))

        function createSignCode() {    //获取接口的sign
            var params=[];
            params[0]= 'access_token='+tokenArr[0];
            params[1]= 'format=JSON';
            params[2]= 'method=user.order.cancel';
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

        wx.request({     //取消订单
            url: that.data.apiUrl,
            data: {
                access_token : tokenArr[0],
                format : 'JSON',
                method : 'user.order.cancel',
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
                if(res.data.result.success == 1){
                    wx.redirectTo({
                        url: '/pages/home/home'
                    })
                }
            }
        })
        /*wx.redirectTo({
            url: '/pages/home/home'
        })*/
    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId);
        wx.redirectTo({
            url: '/pages/home/home'
        })
    }
})