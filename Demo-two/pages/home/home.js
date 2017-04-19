/*
* 主页叫车页面
* */

var app = getApp()
var getApi=require('../../utils/util.js')
var mdCopy=require('../../utils/md5_copy.js')
var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default
Page({
	data:{
		//text：“这是一个页面”
        testData: '66666',
		buttonDisabled: false,
		modalHidden: true,
		show: false,
        hasLocation: false,
		location: {
            longitude: '',
            latitude: '',
            name: '请选择上车位置',
			address: ''
		},
		destination: {
			longitude: '',
            latitude: '',
            name: '请选择目的地',
			address: ''
		},
		userInfo: '',
        tokenUrl:  'https://syjpp.txzkeji.com/passenger/token',
        apiUrl:  'https://syjpp.txzkeji.com/passenger/api'
	},
	showModal: function(){
		//显示覆盖层
		var animation = wx.createAnimation({
		    duration: 400,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateX(-300).step()
		this.setData({
			animationData:animation.export(),
			showModalStatus: true
		})
		setTimeout(function(){
			animation.translateX(0).step()
			this.setData({
				animationData: animation.export()
			})
		}.bind(this),200)
	},
	hideModal: function(){
		//隐藏覆盖层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateX(-300).step()
		this.setData({
			animationData: animation.export(),
		})
		setTimeout(function(){
			animation.translateX(0).step()
			this.setData({
				animationData: animation.export(),
				showModalStatus: false
			})
		}.bind(this), 200)
	},
	choseLocation: function(e){    //选择当前位置
		//console.log(e)
		var that=this
		wx.chooseLocation({
			success: function(res){
				console.log(res)
				that.setData({
					hasLocation: true,
					location:{
						longitude: res.longitude,
						latitude: res.latitude,
                        name: res.name,
						address: res.address
					},
				})
			},
			fail:function(){
				console.log('选择错误')
			},
			compete: function(){
				console.log('选择失败')
			}
		})
	},
    choseDestination: function(e){   //选择目的地
        //console.log(e)
        var that=this
        wx.chooseLocation({
            success: function(res){
                console.log(res)
                that.setData({
                    hasLocation: true,
                    destination:{
                        longitude: res.longitude,
                        latitude: res.latitude,
                        name: res.name,
						address: res.address
                    },
                })
            },
            fail:function(){
                console.log('选择错误')
            },
            compete: function(){
                console.log('选择失败')
            }
        })
    },
	callTheCar : function (e) {
         var that = this;
         var tokenArr=[];    //获取storage里面的token
         try{
         	var value=wx.getStorageSync('token')
			 if(value){
         		tokenArr = value;
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
		 //console.log(userToken);

		 var hxUserToken ='';
		 try{
		 	var value=wx.getStorageSync('hxUserToken')
			 if(value){
		 		hxUserToken=value;
			 }
		 }catch(e){
		 	console.log('hxUserToken获取失败')
             wx.redirectTo({
                 url: '/pages/login/login'
             })
		 }

        var ranString=getApi.randomString(12);
        var ranStringCode = getApi.randomString(12);   //申请验证码时候的随机字符串
        var timestampToken = new Date().getTime();   //生成时间戳

		console.log(that.data.location.address)   //起点
		var orderObj={
			'is_appointment':'0',
			'is_carpool':'0',
			'start_addr':that.data.location.address,
			'end_addr':that.data.destination.address,
			'route_planning':[that.data.location.address,that.data.destination.address],
			'longitude':that.data.location.longitude,
			'latitude':that.data.location.latitude,
			'preprice':'10',
			'start_point':[that.data.location.longitude,that.data.location.latitude],
			'end_point':[that.data.destination.longitude,that.data.destination.latitude],
			'plan_point':[that.data.location.longitude,that.data.location.latitude,that.data.destination.longitude,that.data.destination.latitude]
		};
		var orderCode= JSON.stringify(orderObj);
		function createSignCode() {    //获取接口的sign
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

        console.log(hxUserToken)
        if(userToken || hxUserToken){     //判断token是否存在
            /*var options={
            	apiUrl: WebIM.config.apiURL,
				accessToken: hxUserToken,
				appkey: 'txzkj#shayijiao'
			}
			WebIM.conn.open(options);*/

			wx.request({
                url: that.data.apiUrl,
                data: {
                    access_token : tokenArr[0],
                    format : 'JSON',
                    method : 'user.order.create',
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
                            url: '/pages/wait/wait'
                        })
                        wx.setStorage({
                            key:'order_num',
                            data:res.data.result.order_num
                        })
                    }else{
                        wx.showModal({
                            title:'叫车失败，请重试！',
                            confirmText:'OK',
                            showCancel:false
                        })
                    }
                }
            })
		}else{
            wx.redirectTo({
                url: '/pages/login/login'
            })
		}



    },
	makePhoneCall: function (e) {
        wx.makePhoneCall({
            phoneNumber: '10086'
        })
    }


})
