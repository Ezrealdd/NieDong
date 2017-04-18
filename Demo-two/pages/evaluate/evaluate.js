/*
* 评价页面
* */
var app=getApp()
var count=0
Page({
    data: {
        stars: [0,1,2,3,4],
        headStars: '',
        normalSrc: '../../images/no-star.png',
        selectedSrc: '../../images/full-star.png',
        halfSrc: '../../images/half-star.png',
        key: 0   //评分
    },
    onLoad: function (options) {
      var that=this
        var starNum = 3,starArr=[],i=0;   //司机评分
        do{
            if(i<=starNum+1){
                starArr[i] = "full";
            }else{
                starArr[i] = "no";
            }
            starNum--;
            i++;
        }while(i<5);3
        that.setData({
            headStars: starArr
        })
    },
    selectLeft: function (e) {     //乘客点击评分
        console.log('left');
        var key = e.currentTarget.dataset.key
        if(this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5){
            key = 0;
        }
        count = key
        this.setData({
            key: key
        })

    },
    selectRight: function(e){
      console.log('right')
      var key = e.currentTarget.dataset.key
      count  = key;
      this.setData({
          key: key
      })
    },

    makeCall: function (e) {   //投诉电话
        wx.makePhoneCall({
            phoneNumber: '10086'
        });
    },
    bindFormSubmit: function (e) {    //提交评价返回主界面
        console.log(e.detail.value.textarea);
        wx.redirectTo({
            url: '/pages/home/home'
        })
    },
    clickstar: function (e) {
        console.log("点击")
    }

})