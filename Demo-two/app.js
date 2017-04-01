//app.js
App({
	onLaunch:function(){   //小程序初始化的时候执行一次。以后不主动调用不会再执行。
		/*var logs = wx.getStorageSync('logs') || []  //获取本地缓存中的logs属性。
		logs.unshift(Date.now()) //当前登录时间添加到数组中。
		wx.setStorageSync('logs',logs)  //将数据存入本地缓存。wx是全局对象。
		*/
	},
	getUserInfo:function(cb){  //获取登录用户信息。其他页面通过getApp().getUserInfo(function(userinfo){console.log(userinfo);})调用这个方法，获取用户信息。cb是一个形参，类型是函数。
		var that = this
		if(this.globalData.userInfo){ //如果用户数据不为空。
			typeof cb == "function" && cb(this.globalData.userInfo)  //如果参数cb的类型为函数，那么执行cb，获取用户信息。
		}else{  //如果用户信息为空，也就是说第一次调用getUserInfo，会调用用户登录接口。
			wx.login({
				success: function(){
					wx.getUserInfo({
						success: function(res){
							that.globalData.userInfo = res.userInfo   //赋值给globalData，如果再次调用getUserInfo函数的时候，不需要调用登录接口。
							typeof cb == "function" && cb(that.globalData.userInfo)  
						}
					})
				}
			})
		}
	},
	/*getLocationInfo: function(cb){
		var that = this;
		if(this.globalData.locationInfo){
			cb(this.globalData.locationInfo)
		}else{
			wx.getLocation({
				type: 'gcj02',
				success: function(res){
					that.globalData.locationInfo = res;
					cb(that.globalData.locationInfo)
				},
				fail: function(){
					//fail
				},
				complete: function(){

				}
			})
		}
	},*/
	globalData:{
		userInfo:null
	}
})