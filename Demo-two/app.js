require('./utils/strophe')
var WebIM = require('./utils/WebIM.js').default
//app.js
App({
    getRoomPage: function () {
        return this.getPage("pages/chatroom/chatroom")
    },
    getPage: function (pageName) {
        var pages = getCurrentPages()
        return pages.find(function (page) {
            return page.__route__ == pageName
        })
    },

	onLaunch:function(){   //小程序初始化的时候执行一次。以后不主动调用不会再执行。
		var that = this;
		var passengerId = '';
        wx.getStorage({
        	key: 'user',
			success: function(res){
        		//console.log(res.data);
        		var passengerId = res.data.hx_user
			}
		})
		/*var options = {   //登录环信
			apiUrl: WebIM.config.apiURL,
			user: passengerId,
			pwd: '123456',
            appKey: '1143170404115272#shayijiao',
            success: function (token) {
                var token = token.access_token;
                //WebIM.utils.setCookie('webim_' + encryptUsername, token, 1);
            },
            error: function(){
            }
        };
        WebIM.conn.open(options);*/

        /*WebIM.conn.listen({
			onOpened: function(message){
				console.log("1111111")
				WebIM.conn.setPresence()
				//WebIM.conn.getRoster(rosters)
			},
			onPresence: function(message){
				var pages = getCurrentPages()
				if(message.type == "unsubscribe"){
					pages[0].moveFriend(message)
				}
				if(message.type === "subscribe"){
					if(message.status === '[resp:true]'){
						return
					}else{
						pages[0].handleFriendMsg(message)
					}
				}
			},
			onRoster: function(message){
				var pages = getCurrentPages()
				if(pages[0]){
					pages[0].onShow()
				}
			},
            onTextMessage: function (message) {
                console.log('onTextMessage', message)
                var page = that.getRoomPage()
                console.log(page)
                if (message) {
                    if (page) {
                        page.receiveMsg(message, 'txt')
                    } else {
                        var chatMsg = that.globalData.chatMsg || []
                        var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
                        var time = WebIM.time()
                        var msgData = {
                            info: {
                                from: message.from,
                                to: message.to
                            },
                            username: message.from,
                            yourname: message.from,
                            msg: {
                                type: 'txt',
                                data: value
                            },
                            style: '',
                            time: time,
                            mid: 'txt' + message.id
                        }
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },
            onError: function (error) {     //各种异常
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                    //console.log('WEBIM_CONNCTION_DISCONNECTED 123', WebIM.conn.autoReconnectNumTotal, WebIM.conn.autoReconnectNumMax);
                    if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                        return;
                    }
                    // wx.('Error', 'server-side close the websocket connection')
                    // NavigationActions.login()/

                    wx.showToast({
                        title: 'server-side close the websocket connection',
                        duration: 1000
                    });
                    wx.redirectTo({
                        url: '/pages/login/login'
                    });
                    return;
                }

                // 8: offline by multi login
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                    //console.log('WEBIM_CONNCTION_SERVER_ERROR');
                    // Alert.alert('Error', 'offline by multi login')
                    // NavigationActions.login()

                    wx.showToast({
                        title: 'offline by multi login',
                        duration: 1000
                    })
                    wx.redirectTo({
                        url: '/pages/login/login'
                    })
                    return;
                }
            }


		})*/
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

	globalData:{
		userInfo:null,
		chatMsg: []
	}
})