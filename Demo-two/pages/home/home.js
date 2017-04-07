var app = getApp()
Page({
	data:{
		//text：“这是一个页面”
        testData: '66666',
		buttonDisabled: false,
		modalHidden: true,
		show: false,
        hasLocation: false,
		location: {
            longitude: '',
            latitude: '',
            name: '请选择上车位置'
		},
		destination: {
			longitude: '',
            latitude: '',
            name: '请选择目的地'
		},
		userInfo: ''
	},
	showModal: function(){
		//显示覆盖层
		var animation = wx.createAnimation({
		    duration: 400,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateX(-300).step()
		this.setData({
			animationData:animation.export(),
			showModalStatus: true
		})
		setTimeout(function(){
			animation.translateX(0).step()
			this.setData({
				animationData: animation.export()
			})
		}.bind(this),200)
	},
	hideModal: function(){
		//隐藏覆盖层
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: "linear",
			delay: 0
		})
		this.animation = animation
		animation.translateX(-300).step()
		this.setData({
			animationData: animation.export(),
		})
		setTimeout(function(){
			animation.translateX(0).step()
			this.setData({
				animationData: animation.export(),
				showModalStatus: false
			})
		}.bind(this), 200)
	},
	choseLocation: function(e){    //选择当前位置
		//console.log(e)
		var that=this
		wx.chooseLocation({
			success: function(res){
				console.log(res)
				that.setData({
					hasLocation: true,
					location:{
						longitude: res.longitude,
						latitude: res.latitude,
                        name: res.name
					},
				})
			},
			fail:function(){
				console.log('选择错误')
			},
			compete: function(){
				console.log('选择失败')
			}
		})
	},
    choseDestination: function(e){   //选择目的地
        //console.log(e)
        var that=this
        wx.chooseLocation({
            success: function(res){
                console.log(res)
                that.setData({
                    hasLocation: true,
                    destination:{
                        longitude: res.longitude,
                        latitude: res.latitude,
                        name: res.name
                    },
                })
            },
            fail:function(){
                console.log('选择错误')
            },
            compete: function(){
                console.log('选择失败')
            }
        })
    },
	makeCall : function (e) {
         var that = this;
         wx.getStorage({
         	key : "username",
			success : function(res) {
					console.log(res.data);
		      }
		 });

    }


})
