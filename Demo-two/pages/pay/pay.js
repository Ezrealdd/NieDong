/*
* 支付页面
* */

var app= getApp();
Page({
   data:{
       origin: '',
       end: '',
       payNum: ''
   },
    
   onLoad: function () {
       var that =this
       var endMessage = ''
       var origin = wx.getStorageSync('origin');
       var end = wx.getStorageSync('end');
       var payNum = wx.getStorageSync('payNum');
       that.setData({
         origin: origin,
         end: end,
         payNum: payNum
       })



       /*var setInervalId = setInterval(function nextPage() {
           if(app.globalData.endTrip==9){
               console.log("里程结束")
               var endMessage = app.globalData.endMessage
               console.log(endMessage)
               that.setData({
                   origin: endMessage.attache.order_start_address,
                   end: endMessage.attache.order_end_address,
                   payNum : endMessage.attache.money
               })

               clearInterval(setInervalId)
           }
       },3000);*/

   },

    endTrip: function () {
        var that = this
        wx.redirectTo({
            url: '/pages/evaluate/evaluate'
        })
    }

})