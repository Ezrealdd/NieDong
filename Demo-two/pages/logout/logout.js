/*
* 退出登录
* */


var app = getApp()
var getApi=require('../../utils/util.js')
var mdCopy=require('../../utils/md5_copy.js')
Page({
    data:{
        
    },
    onLoad: function () {
        
    },
    logout: function () {
        try{
            wx.clearStorageSync()
            //console.log("清除缓存失败")
        }catch (e){
            //清除缓存失败
        }

        wx.redirectTo({
            url: '/pages/home/home'
        })

        /*wx.getStorageInfo({
            success: function (res) {
                console.log(res.keys)
                console.log(res.currentSize)
                console.log(res.limitSize)

            }
        })*/
    }
})