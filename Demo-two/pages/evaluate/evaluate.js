/*
* 评价页面
* */

Page({
    data: {
        stars: [0,1,2,3,4],
        headStars: '',
        normalSrc: '../../images/no-star.png',
        selectedSrc: '../../images/full-star.png',
        key: 0
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
        }while(i<5);

        /*var starArray = [],j=0;    //乘客评分
        for(j=0;j<5;j++){
            starArray[j]='no';
        }
        console.log(starArray);*/
        that.setData({
            headStars: starArr
        })
    },
    select: function (e) {     //乘客点击评分
        console.log(e)
        var key = e.currentTarget.dataset.key
        console.log(key)
        if(this.data.key == 0 && e.currentTarget.dataset.key == 0){
            key = 0;
        }

    },

    makeCall: function (e) {   //投诉电话
        wx.makePhoneCall({
            phoneNumber: '10086'
        })
    },
    bindFormSubmit: function (e) {    //提交评价返回主界面
        console.log(e.detail.value.textarea);
        wx.redirectTo({
            url: '/pages/home/home'
        })
    }

})