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
	/*getLocation: function(e){  //获取经纬度
		//console.log(e)
		var that=this
		wx.getLocation({
			success: function(res){
				//console.log(res)
				that.setData({
					hasLocation: true,
					location: {
						longitude: res.longitude,
						latitude: res.latitude
					}
				})
			}
		})
	},*/
	
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

/*
* 调用test()方法，先创建一个a变量，然后将第一个setTimeout放到setTimeout对应的线程中执行（启动定时器timer），
* 第8行，修改test中变量a为4，然后将第二个setTimeout添加到setTimeout对应的线程队列中执行，执行13行，输出test中变量a，
* 此时为4；然后执行16行，输出全局变量a，此时为1.
 -> 1000ms之后，将第二个setTimeout的回调函数，添加到JS任务队列中，3000ms后将第一个setTimeout的回调函数，
 添加到JS任务队列中。
 -> JS主线程执行完成之后，会执行任务队列的事件，第二个setTimeout优先进入任务队列，所以优先执行，
 执行第10行，输出test中的变量a，值为4,然后di11行，将test中的变量a修改为5；2000ms之后第一个setTimeout进入任务队列，
 此时JS主线程栈为空，所以将其添加到JS主线程进行执行，第5行，输出test中的变量a，此时变量的值为5，第6行修改test变量a为3.
* */