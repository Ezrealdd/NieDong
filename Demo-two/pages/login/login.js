/*
*  登录页面
* */
var getApi=require('../../utils/util.js')   //获取验证码api
var mdCopy=require('../../utils/md5_copy.js')
var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default
var app = getApp()  //获取应用实例
Page({
	data: {
      motto: '登录',
/*	  pickerHidden: true,
	  chosen: '',*/
	  userPhone: '',
	  checkNumber: '',
      grant_type: 'password'
  },
  onLoad: function () {
	  //this.login()
  },
  userPhoneInput: function(e){
  	this.setData({
  		userPhone: e.detail.value
	})
  },

  checkNumInput: function (e) {
	 this.setData({
	 	checkNumber: e.detail.value
	 })
  },


  getCheckNum : function(e){    //点击获得验证码
  	var that = this
	console.log(that.data.userPhone);
	var testCode =  getApi.getToken(that.data.userPhone);
  	console.log(testCode);

	//var timestamp = new Date().getTime()
  	//console.log(timestamp)
	//console.log(getApi.randomString(12))
	//var tokenTest = getApi.createSign()
	  /*wx.login({
	  	success: function(e){
	  		console.log(e);

	  		wx.getUserInfo({
	  			success: function(res2){
	  				console.log(res2);
	  				var encryptedData = encodeURIComponent(res2.encryptedData);
	  				var iv = res2.iv;

                    wx.request({
                        //url: 'https://api.weixin.qq.com/sns/jscode2session',
                        url: 'https://syjp.txzkeji.com/user.wx.wxlogin',
                        data: {
                            code: e.code,
                            signatrue: res2.signatrue,
                            rawData: res2.rawData,
                            iv: res2.iv,
                            encryptedData: res2.encryptedData
                        },
                        header:{
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        method: 'POST',
                        success: function(res){
                            console.log(res);
                        }
                    });
				}
			});

		}
	  });*/

  },

  login : function (e) {
	  var that = this;
      //console.log(that.data.userPhone);
	  //console.log(that.data.checkNumber);

	  var ranString=getApi.randomString(12);
      var ranStringCode = getApi.randomString(12);   //申请验证码时候的随机字符串
      var timestampToken = new Date().getTime();   //生成时间戳

      if(that.data.userPhone == ''){    //判断号码是否输入
          wx.showModal({
              title: '请输入手机号！',
              confirmText: 'OK',
              showCancel: false
          })
      }else if(that.data.checkNumber == ''){     //判断验证码是否输入
          wx.showModal({
              title: '请输入验证码！',
              confirmText: 'OK',
              showCancel: false
          })
      }else{

          wx.request({
              url: "https://syjp.txzkeji.com/passenger/token",
              data:{
                  secret_token: "test.secret",
                  access_token: "test",
                  user_token: "test.user",
                  once: ranString,
                  timestamp: timestampToken,
                  version: '0.1',
                  format: 'JSON',
                  sign: getApi.createSign()
              },
              header: {
                  "content-type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: function(res) {
                  //console.log(res);
                  //var getAccess_token = res.data.result.access_token;
                  //var getSecret_token = res.data.result.secret_token;
                  var tokenArr = [res.data.result.access_token,res.data.result.secret_token];   //获取token，下面用到请求登录信息
                  //console.log(tokenArr);

                  wx.setStorage({      //token存储到本地，以后的接口继续使用
                      key:"token",
                      data:tokenArr
                  })
                  var phoneObj = {"code":that.data.checkNumber,"phone":that.data.userPhone};         //post_body里面参数
                  var phoneCode = JSON.stringify(phoneObj);                //post_body转换成json字符串

                  function createSignCode(){
                      var params =[];   //签名字符串数组
                      params[0]= 'access_token='+tokenArr[0];
                      params[1]= 'format=JSON';
                      params[2]= 'method=user.base.login';
                      params[3]= 'once='+ranStringCode;
                      params[4]= 'post_body='+phoneCode;
                      params[5]= 'secret_token='+tokenArr[1];
                      params[6]= 'timestamp='+timestampToken;
                      params[7]= 'user_token=test.user';
                      params[8]= 'version=0.1';
                      //console.log(params);
                      var signCode = params.join('&');
                      return mdCopy.md5(signCode);
                  }

                  wx.request({     //通过token去获取登录信息
                      url: "https://syjp.txzkeji.com/passenger/api",
                      data: {
                          access_token : tokenArr[0],
                          format : 'JSON',
                          method : 'user.base.login',
                          once : ranStringCode,
                          post_body :phoneCode,
                          secret_token : tokenArr[1],
                          timestamp : timestampToken,
                          user_token : 'test.user',
                          version : '0.1',
                          sign : createSignCode()
                      },
                      header:{
                          "content-type": "application/x-www-form-urlencoded"
                      },
                      method: "POST",
                      success: function(res){
                          console.log(res);
                          var passengerId = res.data.result.hx_user;
                          console.log(passengerId)
                          wx.setStorage({     //返回的用户数据保存到本地存储
                              key:"userInfo",
                              data:res.data.result
                          });

                          /*var options = {   //注册环信
                              username: passengerId,
                              password: '123456',
                              nickname: 'nickname',
                              appKey: 'txzkj#shayijiao',
                              success: function () {

                              },
                              error: function(){

                              },
                              apiUrl:WebIM.config.apiURL
                          };
                          WebIM.utils.registerUser(options);*/

                          var options = {    //登录环信
                              apiUrl: WebIM.config.apiURL,
                              user: passengerId,
                              pwd: '123456',
                              //grant_type: 'password',
                              appKey: 'txzkj#shayijiao'
                          }
                          console.log('open')
                          WebIM.conn.open(options)

						  WebIM.conn.listen({      //连接成功回调函数
						  	   onOpened: function(message){    //打开环信连接
						  	   	  console.log(message)
                                   wx.setStorage({    //存储环信返回的access_token
                                      key:"hxUserToken",
                                      data:message.accessToken
                                  })
							   },

                               onTextMessage: function (message){     //接收文本消息
                                  console.log('onTextMessage', message)
							  }
						  })

						  if(res.data.result.success == 1){
                              wx.redirectTo({
                                  url: '/pages/home/home'
                              })
						  }else if(res.data.result.success == 101){
                              console.log('111');
						      wx.showModal({
                                  title: '短信验证码错误！',
                                  confirmText: 'OK',
                                  showCancel: false
                              })
						  }else{
                              wx.showModal({
                                  title: '登录失败，请重试！',
                                  confirmText: 'OK',
                                  showCancel: false
                              })
                          }

                      }

                  });

                  //}

              },
              error: {}
          });


      }


  }

})