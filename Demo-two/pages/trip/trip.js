// map.js
var app=getApp();
Page({
    data: {
        longitude: '',
        latitude: '',
        markers: [{
            iconPath: "",
            id: 0,
            latitude: '',
            longitude: '',
            width: 50,
            height: 50
        }],
        controls: [{
            id: 1,
            iconPath: '',
            position: {
                left: 0,
                top: 300 - 50,
                width: 50,
                height: 50
            },
            clickable: true
        }]
    },
    onLoad: function () {
        var that=this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    markers: [{
                        iconPath: "",
                        id: 0,
                        latitude: res.latitude,
                        longitude: res.longitude,
                        width: 50,
                        height: 50
                    }],
                })

            }
        })

    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId)
    }
})