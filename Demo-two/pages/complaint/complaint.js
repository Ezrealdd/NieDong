/*
* 服务评价
* */

Page({
    data: {
        stars: [0,1,2,3,4],
        normalSrc: '../../images/no-star.png',
        selectedSrc: '../../images/full-star.png',
        halfSrc: '../../images/half-star.png',
        key: 0,
        date: '2017-04-01',
        time: '12:01'
    },
    selectLeft: function(e){
        var key = e.currentTarget.dataset.key
        if(this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5){
            key = 0;
        }
        count = key
        this.setData({
            key: key
        })
    },
    selectRight:function (e) {
        var key=e.currentTarget.dataset.key
        count =key
        this.setData({
            key: key
        })
    },
    bindFormSubmit: function (e) {    //提交评价返回主界面
        console.log(e.detail.value.textarea);
        wx.redirectTo({
            url: '/pages/home/home'
        })
    },
    bindDataChange: function (e) {
        var that=this
        that.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        var that=this
        that.setData({
            time: e.detail.value
        })
    }


})