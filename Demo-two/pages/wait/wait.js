/*
* 订单成功过度页面
* */

var app = getApp()
Page({
    data:{
        title: '正在为您优先叫车...',
    },
    makeCancel: function (e) {
        wx.redirectTo({
            url: '/pages/home/home'
        })
    }
})
