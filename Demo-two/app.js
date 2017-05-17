var WebIM = require('./utils/WebIM.js')
var strophe = require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js').default
//app.js
App({
  /*  getRoomPage: function () {
        return this.getPage("pages/chatroom/chatroom")
    },
    getPage: function (pageName) {
        var pages = getCurrentPages()
        return pages.find(function (page) {
            return page.__route__ == pageName
        })
    },*/
  globalData: {
    userInfo: null,
    backMessageType: '',
    driverInfo: '',
    onCar: '',
    driverCancel: '',
    driverLocation: '',
    endTrip: '',
    endMessage: '',
    backMessage: ''
  },
  data: {
    passengerId:''
  },
  onLoad: function(){
    var passengerId = wx.getStorageSync('userId');
    this.setData({
      passengerId: passengerId
    })
  },
  onLaunch: function () {   //小程序初始化的时候执行一次。以后不主动调用不会再执行。
    var that = this;
    var passengerId = wx.getStorageSync('userId');
    //var passengerId = that.data.passengerId
    var options = {    //登录环信
      apiUrl: WebIM.config.apiURL,
      user: passengerId,
      pwd: '123456',
      //grant_type: 'password',
      appKey: 'miaoshare#shayijiao'       //'txzkj#shayijiao'
    }

    WebIM.conn.open(options)
    WebIM.conn.listen({

      onOpened: function (message) {    //打开环信连接
        console.log("登录成功 生命周期")
        //console.log(message)
        wx.setStorage({    //存储环信返回的access_token
          key: "hxUserToken",
          data: message.accessToken
        })
      },
      onTextMessage: function (message) {     //接收文本消息
        //console.log('app.js消息', message)
        var backMessage = JSON.parse(message.data)
        that.globalData.backMessage = backMessage
        if (backMessage.type == 11) {     //司机已接单
          console.log("司机接单")
          that.globalData.backMessageType = backMessage.type
          that.globalData.driverInfo = backMessage
        }else if (backMessage.type == 6) {    //司机实时位置
          console.log("乘客上车")
          that.globalData.onCar = backMessage.type
        } else if (backMessage.type == 8) {
          console.log('司机位置')
          that.globalData.driverLocation = backMessage.type
        } else if (backMessage.type == 9) {
          console.log('订单结束', backMessage)
          //that.globalData.endTrip = backMessage.type
          //that.globalData.endMessage = backMessage
        } else if (backMessage.type == 3) {
          console.log('司机取消')
          that.globalData.driverCancel = backMessage.type
        }
      },
      onError: function (error) {
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }
          wx.redirectTo({
            url: '/pages/login/login'
          });
          return;
        }

        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.redirectTo({
            url: '/pages/login/login'
          })
          return;
        }

      }
    })
  },
  getUserInfo: function (cb) {  //获取登录用户信息。其他页面通过getApp().getUserInfo(function(userinfo){console.log(userinfo);})调用这个方法，获取用户信息。cb是一个形参，类型是函数。
    var that = this
    if (this.globalData.userInfo) { //如果用户数据不为空。
      typeof cb == "function" && cb(this.globalData.userInfo)  //如果参数cb的类型为函数，那么执行cb，获取用户信息。
    } else {  //如果用户信息为空，也就是说第一次调用getUserInfo，会调用用户登录接口。
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo   //赋值给globalData，如果再次调用getUserInfo函数的时候，不需要调用登录接口。
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }
  
})