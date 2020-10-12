// pages/shouye/shouye.js
var app = getApp();
var time = 0;
var iscolse = true;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showView: false,
		showView1: false,
		imgUrls: {},
		hisCompany: {},
		indicatorDots: true,
		autoplay: true,
		interval: 3000,
		duration: 1000,
		color: "#ffffff",
		avatar: ''
	},
	onShow: function() {

		var that = this;
		wx.request({
			url: app.globalData.url + '/home_gethome.html',
			data: {
				access_token: app.getaccess_token(),
				timestamp: app.gettimestamp()
			},
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				var data = res.data;
				if (data.status == '1') {

					for (var i in data.data.company_banner) {
						data.data.company_banner[i].url = data.data.company_banner[i].url.replace('http', 'https').replace('***',
							'?').replace('###', '=')

					}
					that.setData({
						imgUrls: data.data.company_banner,
						hisCompany: data.data.his_company
					})

					//    console.log(data.data.his_company)

				}

			}
		})

	},
	onReady: function() {






	},

	/**
	 * 汇票收藏
	 */

	taphpsc: function() {

		var that = this;
		if (that.checklogin()) {

			return;

		};


		wx.navigateTo({
			url: "hpsc/hpsc"
		})

	},

	/**
	 * 授信申请
	 */

	tapapply: function() {

		var that = this;
		if (that.checklogin()) {

			return;

		};


		wx.navigateTo({
			url: "apply/apply"
		})

	},


	tapcal: function() {
		wx.navigateTo({
			url: "../cal/cal"
		})

	},
	tapclass: function() {
		var that = this;
		if (that.checklogin()) {

			return;

		};
		wx.navigateTo({
			url: "../class/class"
		})

	},


	// 跳转到搜索页
	search: function() {

		var hisCompany = JSON.stringify(this.data.hisCompany);
		// console.log(hisCompany.split('?').join('***').split('=').join('###'))





		wx.navigateTo({
			url: 'search/search?hisCompany=' + hisCompany.split('?').join('***').split('=').join('###')
		})
	},
	changeIndicatorDots: function(e) {
		this.setData({
			indicatorDots: !this.data.indicatorDots
		})
	},
	changeAutoplay: function(e) {
		this.setData({
			autoplay: !this.data.autoplay
		})
	},
	intervalChange: function(e) {
		this.setData({
			interval: e.detail.value
		})
	},
	durationChange: function(e) {
		this.setData({
			duration: e.detail.value
		})
	},
	onLoad: function(options) {
		// 生命周期函数--监听页面加载
		showView: (options.showView == "true" ? true : false)
		showView1: (options.showView1 == "true" ? true : false);
	},
	onChangeShowState: function() {




		// var that = this;
		// that.setData({
		//   showView: (!that.data.showView)
		// })

		let _this = this;

		if (_this.checklogin()) {
			return;
		}
		wx.showActionSheet({
			itemList: ['从相册中选择', '拍照', '手动录入'],
			//itemColor: '#DE4A2A',
			success: function(res) {
				if (!res.cancel) {
					if (res.tapIndex == 0) {
						_this.chooseWxImage('album')
					} else if (res.tapIndex == 1) {
						_this.chooseWxImage('camera')
					} else if (res.tapIndex == 2) {
						wx.navigateTo({
							url: 'xjsd/xjsd'
						})
					}
				}
			}
		})

	},

	checklogin: function() {
		// console.log("app.globalData.uid:" + app.globalData.uid);
		if (app.globalData.uid == '') {
			wx.showModal({
				title: '提示',
				content: "您尚未登录是否跳转登录",
				success: function(res) {

					if (res.confirm) {
						// console.log('用户点击确定')
						wx.navigateTo({
							url: '../my/mylogin/mylogin'
						})
					} else if (res.cancel) {
						//  console.log('用户点击取消')
					}


				}
			})
			return true;
		}
		return false;
	},
	chooseWxImage: function(type) {


		let _this = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: [type],
			success: function(res) {

				_this.setData({
					showView1: true
				})


				var avatar = res.tempFilePaths;

				// console.log(avatar)

				//调用上面定义的递归函数，一秒一刷新时间
				time = 0;

				//_this.upload(_this, avatar[0]);

				_this.countdown(_this, avatar[0]);




				//console.log('询价img_url:' + avatar[0])




			}
		})

	},
	forward: function(e) {
		var url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url: 'details/details?url=' + url.replace('?', '***').replace('=', '###')
		})
	},

	close: function() {
		if (iscolse) {
			time = 1000;
			var that = this;
			that.setData({
				showView1: (!that.data.showView1)
			})
		}

	},

	upload: function(_this, file) {




		wx.uploadFile({
			url: app.globalData.url + '/home_imagemanual.html',
			filePath: file,
			name: 'file',
			formData: {
				access_token: app.getaccess_token(),
				timestamp: app.gettimestamp(),
				role: app.globalData.role,
				token: app.globalData.token,
				uid: app.globalData.uid,
				rotateimage: 'true'

			},
			header: {
				"Content-Type": "multipart/form-data"
			},
			success: function(res) {
				wx.hideLoading();
				var data = res.data;

				if (typeof data == 'string') {
					//console.log('--------------------------------------')
					data = JSON.parse(data);
				}

				//console.log(data)
				if (data.status == '1') {


					setTimeout(function() {
						_this.setData({
							time: 99
						})

						setTimeout(function() {
							_this.setData({
								time: 100
							})

							iscolse = true;
							_this.setData({
								showView1: false
							})


							wx.navigateTo({
								url: 'xjjg/xjjg?selectprice_id=' + data.data.selectprice_id,
							})


						}, 500)


					}, 500)



				} else {

					iscolse = true;

					wx.showModal({
						title: '提示',
						content: data.message,
						success: function(res) {

							_this.setData({
								showView1: (!_this.data.showView1)
							})



						}
					})
					return;

				}
			}
		})
	},
	countdown: function(that, file) {


		that.setData({
			time: time
		})


		//console.log("time的值：" + time);
		if (time >= 1000) {

			time = 0;
			iscolse = true;
			return;
		}

		if (time == 93) {
			iscolse = false;

			// console.log("上传图片中。。。。。。。。。。。。。。。。。。。")
			that.upload(that, file);
			time = 0;
			return;
		}


		setTimeout(function() {

			time += 1;
			that.countdown(that, file);

		}, 80)

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
