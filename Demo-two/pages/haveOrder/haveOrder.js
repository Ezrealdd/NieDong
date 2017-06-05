/*
* 司机接单过度页面
* */
var app = getApp()
Page({
    data: {
        title: '司机已接单，请耐心等待...'
    },
    onLoad: function (option) {
        var timerId = setTimeout(function () {
            wx.redirectTo({
                url: '/pages/map/map'
            })
        }, 2000);
    }
})