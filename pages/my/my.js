// pages/my/my.js
var app = getApp();
var user = require('../../utils/user.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    position: "",
    bpt: "",
    phone: "",
    org_name: "",
    address: "",
    avatar: '',
    num: 0,
    soucCount:0,
    liulCount:0,
    dianzCount:0,
    nowLogincss:'none',
    showModel:'none',
    contentcss:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  
  
  },

  getcardrelationcount: function (openid){
    var that = this;
    wx.request({
      url: app.globalData.url + '/cardrelationcount.html',
      data: {
        otheropenid: openid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data;
        if (data.status == '1') {
          data = res.data.data;
          for (var i in data){
            if (data[i].type =='1'){
              that.setData({
                soucCount: data[i].count
              })
              continue;
            } else if (data[i].type == '2') {
              that.setData({
                liulCount: data[i].count
              })
              continue;
            } else if (data[i].type == '3') {
              that.setData({
                dianzCount: data[i].count
              })
              continue;
            }
          }
        } 
      }
    })
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 自定义tabber
    if(typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected: 2
      })
    }
    
    console.log("app.globalData.uid:" + app.globalData.uid);
    var that = this;

    if (app.globalData.uid == ''||null || app.globalData.token == ''||null) {
     
      that.setData({
        nowLogincss: '',
        contentcss: 'none',
        showModel:'none',
        // avatar:'/images/forum/default.png',//默认头像

      })

      return;
    }else{

      that.setData({
        nowLogincss: 'none',
        contentcss: '',
        showModel: 'none'
      })

    }
    var openid = wx.getStorageSync('cacheopenid');
    console.log("app.globalData.openid:" + openid);
    wx.request({
      url: app.globalData.url + '/getwentimpbj.html',
      data: {
        uid: openid
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        var data = res.data;
        var avatar = "../images/my.png";
        if (data.result == 'true') {
          if (data.data.fileUrl != '' && data.data.fileUrl != null) {
            avatar = data.data.fileUrl;
          }
          that.setData({
            name: data.data.name,
            position: data.data.duties,
            bpt: data.data.business,
            phone: data.data.phone,
            org_name: data.data.company,
            address: data.data.address,
            avatar: avatar
          })
        } else {
          that.getMeuser();
        }

      }
    })


    this.getcardrelationcount(openid);

   
    
  },


  getMeuser: function (){
    var that = this;
    console.log('数据库。未获取到用户信息')
    user.getUserInfo(that, function (res) {
      console.log('res的值：' + res)
      if (res) {
        var cacheuserInfo = wx.getStorageSync('cacheuserInfo');
        if (cacheuserInfo != '' & cacheuserInfo != null) {
          that.setData({
            name: cacheuserInfo.nickName,
            avatar: cacheuserInfo.avatarUrl
          })
        } else {
          that.setData({
            avatar: avatar
          })
        }
      }
    }).then(function () { }, function (error) {
      console.log("显示授权的css")
      var avatar = "../images/my.png";
      that.setData({
        avatar: avatar
      })
      console.log("false1122 .....");
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // },
  myxq:function(){
    wx.navigateTo({
      //url: 'myxq/myxq',

      url: '../card/carddetail/carddetail?data=' + JSON.stringify(this.data)
    })
  },
  xgmm:function(){
    wx.navigateTo({
      url: 'myxgmm/myxgmm',
    })
  },
  gywm:function(){
    wx.navigateTo({
      url: 'mygywm/mygywm',
    })
  },
  myliul: function (e) {
    var name = e.currentTarget.dataset.name;

    wx.navigateTo({
      url: 'myliul/myliul?name=' + name,
    })
  },
  
  mylogout:function(){
    wx.showModal({
      content: '退出当前账号?',
      success: function (res) {
        if (res.confirm) {
          app.setUid('', '')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    }) 


    
  },
  nowLogin: function () {
    var that = this;
    console.log('1111111')
    user.getUserInfo(this, function (res) {
      console.log('res的值：' + res)
      if (res) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
    }).then(function () { }, function (error) {
      // failure

      console.log("false1122 .....");
    })


    


  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '400-628-7087',
      success: function () {
        //        console.log("拨打电话成功！")
      },
      fail: function () {
        //   console.log("拨打电话失败！")
      }
    })
  }
})