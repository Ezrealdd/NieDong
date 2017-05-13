// map.js
var app=getApp();
var getApi = require('../../utils/util.js')
var mdCopy = require('../../utils/md5_copy.js')
Page({
    data: {
        scale: 16,
        longitude: '',
        latitude: '',
        markers: [{
            iconPath: "",
            id: 0,
            latitude: '',
            longitude: '',
            width: 50,
            height: 50
        },{
            iconPath: "",
            id: 0,
            latitude: '',
            longitude: '',
            width: 50,
            height: 50
        }],
        controls: [{
            id: 1,
            iconPath: '',
            position: {
                left: 0,
                top: 300 - 50,
                width: 50,
                height: 50
            },
            clickable: true
        }],
        apiUrl: 'https://syjp.txzkeji.com/passenger/api'

    },
    onLoad: function () {
        var that=this
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    /*markers: [{
                        iconPath: "",
                        id: 0,
                        latitude: res.latitude,
                        longitude: res.longitude,
                        width: 50,
                        height: 50
                    },{
                        iconPath: "../../images/destnation.png",
                        id: 0,
                        latitude: '',
                        longitude: '',
                        width: 50,
                        height: 50
                    }],*/
                })

            }
        })

        var driverInfo = app.globalData.driverInfo
        var driverId = driverInfo.attache.driver_id
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


        var driverLocation=setInterval(function getDriverLocation() {   //刷新司机位置
            if(app.globalData.driverLocation==8){
                console.log("司机位置")
                wx.request({
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
                        var endPoint = res.data.result.end_point
                        var endPointArr = JSON.parse(endPoint)
                        console.log(driverLocation)
                        console.log(endPointArr)
                        console.log(that.data.markers)
                        that.setData({
                            scale: 13,
                            markers: [{
                                iconPath: "../../images/taxi.png",
                                id: 1,
                                latitude: driverLocation[1],
                                longitude: driverLocation[0],
                                width: 32,
                                height: 40
                            },{
                                iconPath: "../../images/destnation.png",
                                id: 2,
                                latitude: endPointArr[1],
                                longitude: endPointArr[0],
                                width: 40,
                                height: 40
                                }]
                        })
                        console.log(that.data.markers)
                    }
                })
            }
        },5000)

        var setInervalEnd = setInterval(function nextPage() {
            if(app.globalData.endTrip==9){
                console.log('付钱')
                wx.redirectTo({
                    url: '/pages/pay/pay'
                });
                clearInterval(driverLocation)
                clearInterval(setInervalEnd)
            }
        },3000)

    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId)
    }
})