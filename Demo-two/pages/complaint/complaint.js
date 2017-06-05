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
    starCount: function(orginStars){
      var starNum = orginStars * 10 / 10, stars = [], i = 0;
      do {
        if (starNum >= 1) {
          stars[i] = 'full';
        } else if (starNum >= 0.5) {
          stars[i] = 'half';
        } else {
          stars[i] = 'no'
        }
        starNum--;
        i++;
      } while (i < 5)
      return stars;
    },
    selectLeft: function(e){
      var that = this
      console.log('left');
      var key = e.currentTarget.dataset.key
      if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
        //只有一颗星的时候,再次点击,变为0颗
        key = 0;
      }
      var count = key
      that.setData({
        key: key
      })
      console.log(count)
    },
    selectRight:function (e) {
      var that = this
      console.log('right')
      var key = e.currentTarget.dataset.key
      var count = key
      that.setData({
        key: key
      })
      console.log(count)
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