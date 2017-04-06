/*
* 请求token，操作接口函数
* */
var mdCopy = require('md5_copy.js');    //应用md5算法

function formatTime(date) {     //时间格式
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {    //0+字符串
  n = n.toString()
  return n[1] ? n : '0' + n
}

function randomString(length) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
  if(!length){
    length = Math.floor(Math.random()*chars.length);
  }
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

var ranString = randomString(12);   //生成随机字符串
var ranStringCode = randomString(12);   //申请验证码时候的随机字符串
var timestampToken = new Date().getTime();   //生成时间戳
function createSign() {   //生成签名(获取token)
    var signStrCopy = 'access_token=test&' + 'format=JSON&' + 'once=' + ranString + '&' + 'secret_token=test.secret&' + 'timestamp=' + timestampToken + '&' + 'user_token=test.user&' + 'version=0.1' ;
    return mdCopy.md5(signStrCopy);
}


function getToken(phone){    //获取token去请求验证码,参数是电话号码
    var checkCode = '';     //定义接受验证码的变量
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
        sign: createSign()
    },
      header: {
          "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function(res) {
          //console.log(res);
          var getAccess_token = res.data.result.access_token;
          var getSecret_token = res.data.result.secret_token;
          var tokenArr = [res.data.result.access_token,res.data.result.secret_token];   //获取token，下面用到请求验证码数据
          //console.log(tokenArr);

          var phoneObj = {"type":"login","phone":phone};         //post_body里面参数
          var phoneCode = JSON.stringify(phoneObj);                //post_body转换成json字符串
          //function checkNumber(){
              //console.log(phoneCode);

              function createSignCode(){
                  var params =[];   //签名字符串数组
                  params[0]= 'access_token='+tokenArr[0];
                  params[1]= 'format=JSON';
                  params[2]= 'method=user.common.smssend';
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

              wx.request({     //通过token去获取验证码
                  url: "https://syjp.txzkeji.com/passenger/api",
                  data: {
                      access_token : tokenArr[0],
                      format : 'JSON',
                      method : 'user.common.smssend',
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
                      checkCode=res.data.result.code;
                      console.log(checkCode);

                  }

              });

          //}

      },
        error: {}
  });
}

/*function getLogin(code,phone) {     //获取token去请求登录，参数是验证码和手机号
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
            sign: createSign()
        },
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
            console.log(res);
            //var getAccess_token = res.data.result.access_token;
            //var getSecret_token = res.data.result.secret_token;
            var tokenArr = [res.data.result.access_token,res.data.result.secret_token];   //获取token，下面用到请求登录信息
            //console.log(tokenArr);

            var phoneObj = {"code":code,"phone":phone};         //post_body里面参数
            var phoneCode = JSON.stringify(phoneObj);                //post_body转换成json字符串
            //function checkNumber(){
            //console.log(phoneCode);

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

                }

            });

            //}

        },
        error: {}
    });
}*/


module.exports = {
  formatTime: formatTime,
  getToken: getToken,
  randomString : randomString,
  createSign : createSign
}

