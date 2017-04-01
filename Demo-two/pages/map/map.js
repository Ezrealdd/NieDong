//map.js
var app = getApp()

//map.js
Page({
    data: {
        map_width: 380,
        map_height: 380
    },
    onLoad: function(){
      var that = this;
      //获取当前定位，并标示位置
      app.getLocationInfo(function(locationInfo){
          console.log('map',locationInfo);
          that.setData({
              longitude: locationInfo.longitude,
              latitude: locationInfo.latitude,
              markers:[
                  {
                      id: 0,
                      iconPath: "../../images/112833kvpoffbweu17mif.png",
                      longitude: locationInfo.longitude,
                      latitude: locationInfo.latitude,
                      width: 30,
                      height: 30
                  }
              ]
          })

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