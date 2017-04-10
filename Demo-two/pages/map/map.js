//map.js
var app = getApp()

//map.js
Page({
    data: {
        longitude: '',
        latitude: '',
        stars: '',
        /*markers: [{
            iconPath: "",
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50
        }],*/
        /*polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color:"#FF0000DD",
            width: 2,
            dottedLine: true
        }],*/
        controls: [{
            id: 1,
            iconPath: '../../images/112834nnrfaooopahccaoh.png',
            position: {
                left: 0,
                top: 300,
                width: 50,
                height: 100
            },
            clickable: true
        }]
    },
    onLoad: function (options) {    //页面加载的时候先加载地图
        var that=this
        wx.getLocation({     //获取当前位置，打开地图
            type: 'wgs84',
            success: function(res) {
                console.log(res.latitude)
                console.log(res.longitude)
                that.setData({
                    longitude:res.longitude,
                    latitude:res.latitude
                })
            }
        })

        var starNum = 3,starArray = [],i=0;
        do{
            if(i<=starNum+1){
                starArray[i] = "full";
            }else{
                starArray[i] = "no";
            }
            starNum--;
            i++;
        }while(i<5);
        console.log(starArray);
        that.setData({
            stars: starArray
        })
    },
    makeCall: function(){      //点击拨打司机电话
        console.log("14787807674");
        wx.makePhoneCall({
            phoneNumber: '10086'
        })
    },
    /*makeCancel: function (e) {
        wx.redirectTo({
            url: '/pages/home/home'
        })
    },*/
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId);
        wx.redirectTo({
            url: '/pages/home/home'
        })
    }
})