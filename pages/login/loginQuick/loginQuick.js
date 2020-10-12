// pages/login/loginQuick/loginQuick.js
// 验证码倒计时
var countdown = 60;
var settime = function(that) {
	if (countdown == 0) {
		that.setData({
			is_show: true
		})
		countdown = 60;
		return;
	} else {
		that.setData({
			is_show: false,
			last_time: countdown
		})

		countdown--;
	}
	setTimeout(function() {
		settime(that)
	}, 1000)
}

var app = getApp();

Page({

	/* 页面的初始数据*/
	data: {
		last_time: '', //验证码时间
		is_show: true, //控制验证码显示的文字 
		verify_id: '',
		phone: '', //手机号
		yzm: '' //验证码
	},
	// 手机号
	bindPhone(e) {
		this.setData({
			phone: e.detail.value
		})
	},
	blurverify(e) {
		this.setData({
			yzm: e.detail.value
		})
	},
	// 跳转到注册
	register() {
		wx.reLaunch({
			url: '/pages/my/myzhuce/myzhuce',
		})
	},
	// 跳转到密码登录
	handleLogin() {
		wx.redirectTo({
			url: '/pages/login/login',
		})
	},
	// 获取验证码
	clickVerify: function() {
		var that = this;
		wx.request({
			url: app.globalData.url + '/login_verify_code.html',
			data: {
				access_token: app.getaccess_token(),
				timestamp: app.gettimestamp(),
				user_phone: that.data.phone
			},
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				var data = res.data;
				console.log(data)
				if (data.status == '10001') {
					// 将获取验证码按钮隐藏60s，60s后再次显示
					that.setData({
						is_show: (!that.data.is_show), //false
						verify_id: data.data.verify_id
					})
					settime(that);
				} else {
					app.message(data.message);
				}
			}
		})
	},

	loginBtn() {
		if (this.data.phone == null || this.data.phone == '') {
			this.message("手机号不能为空");
			return;
		}
		console.log(this)
		this.loginrequest(this.data.phone, this.data.yzm)
	},
	// 验证码登录
	loginrequest: function(phone, yzm) {
		var that = this;
		wx.request({
			url: app.globalData.url + '/sms_login.html',
			data: {
				access_token: app.getaccess_token(),
				timestamp: app.gettimestamp(),
				user_phone: phone,
				code: yzm,
				// version: "3.0.1",
				client: "wechat",
				openid: app.globalData.openid
			},
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				var data = res.data;
				console.log(data)
				if (data.status == '10001') {
					app.setUid(data.data.id, data.data.token)
					wx.navigateBack({
						delta: 2
					})
				} else {
					console.log(data.message)
					that.message(data.message);
				}
			}
		})
	},

	// 微信登录
	weixinlogin: function() {
		var that = this;
		var openid = wx.getStorageSync('cacheopenid');
		console.log(openid)
		wx.request({
			url: app.globalData.url + '/home_weilogin.html',
			data: {
				openid: openid
			},
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: function(res) {
				var data = res.data;
				console.log(data)
				if (data.status == '1') {
					app.setUid(data.data.id, data.data.token)

					wx.navigateBack({
						delta: 2
					})

				} else {

					wx.navigateTo({
						url: '/pages/my/myzhuce/myzhuce'
					})
				}
			}
		})
	},
	// 弹框
	message: function(message) {
		wx.showModal({
			title: '提示',
			content: message,
			success: function(res) {

			}
		})
	},
	// 拨打电话
	handlePhone() {
		wx.makePhoneCall({
			phoneNumber: '400-628-7087',
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
