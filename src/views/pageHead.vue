<template lang="html">
  <div id="header" class="operatorHeader clearfix" :style="{'background': `${backgroundColor}`}">
    <div class="w15 fl text-center">
      <div class="logo"></div>
    </div>
    <div class="w70 fl text-left">
      <h3 class="ml20px">摄影小程序后台管理</h3>
    </div>
    <div class="w15 fl text-right">
      <div class="userInfo" @click.stop="showList()">
        <div class="userAvatar"></div>
        <div class="userName">
          <span class="fz16px">{{$store.state.userInfo && $store.state.userInfo.chineseName ? $store.state.userInfo.chineseName : null}}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <ul class="operatorList">
          <li class="operatorItem">
            <router-link style="display: block;" to="/portal">
              <i class="el-icon-s-custom"></i>
              <span to="/portal">门户首页</span>
            </router-link>
          </li>
          <li class="operatorItem" @click="loginOut()">
            <i class="el-icon-switch-button"></i>
            <span>退出登录</span>
          </li>
        </ul>
       <div class="skinPeeler" @click.stop="skinPeeler()">
         <i class="skinLogo"></i>
         <ul class="skinPeelerList">
           <li class="skinPeelerItem" v-for="(item, index) in skinList" :key="index" @click="choice(item, index)">
             <span>{{item.name}}</span>
           </li>
         </ul>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'pageHead',
  components: {

  },
  data () {
    return {
      skinList: [{
        name: '默认主题',
        color: '#6A6969'
      }, {
        name: '科技蓝主题',
        color: '#034CA8'
      }, {
        name: '高端黑主题',
        color: '#3e3c3c'
      }, {
        name: '土豪金主题',
        color: '#BFA044'
      }],
      backgroundColor: '#6A6969'
    }
  },
  methods: {
    showList () {
      $('.userInfo .operatorList').slideToggle()
      $('.skinPeeler .skinPeelerList').slideUp()
    },
    loginOut () {
      this.globalData.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('authorityList')
      localStorage.removeItem('skinPeelerColor')
      this.$store.commit('increment', {
        name: 'userInfo',
        value: null
      })
      this.globalData.isLogin = false
      this.globalData.userPermission = []
      this.$router.push({
        path: '/login'
      })
    },
    skinPeeler () {
      $('.skinPeeler .skinPeelerList').slideToggle()
      $('.userInfo .operatorList').slideUp()
    },
    choice (item) {
      this.backgroundColor = item.color
      this.$emit('skinPeeler', this.backgroundColor)
      localStorage.setItem('skinPeelerColor', this.backgroundColor)
    }
  },
  created () {
    $(document).on('click', () => {
      $('.userInfo .operatorList').slideUp()
      $('.skinPeeler .skinPeelerList').slideUp()
    })
    this.backgroundColor = localStorage.getItem('skinPeelerColor')
    this.$emit('skinPeeler', this.backgroundColor)
  }
}
</script>

<style lang="css" scoped>
  .operatorHeader {
    line-height: 80px;
    color: #fff;
    background: #6A6969;
  }
  .menuList {
    display: inline-block;
    box-sizing: border-box;
    line-height: 40px;
    vertical-align: middle;
    margin-left: 20px;
  }

  .menuList .menuItem {
    float: left;
    padding: 0 10px;
    margin: 0 10px;
    cursor: pointer;
  }

  .userAvatar {
    height: 40px;
    width: 40px;
    background: url(../assets/img/defaultAvatar.jpg) no-repeat center;
    background-size: cover;
    border-radius: 50%;
    float: left;
    margin-top: 20px;
  }

  .userInfo {
    padding-right: 30px;
    position: relative;
    cursor: pointer;
  }

  .userName {
    float: right;
    position: relative;
    display: inline-block;
  }

  .userInfo .operatorList {
    width: 150px;
    background: #fff;
    line-height: 40px;
    color: #000;
    text-align: center;
    position: absolute;
    top: 65px;
    right: 30px;
    z-index: 1000;
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.22);
    border-radius: 5px;
    display: none;
  }

  .userInfo .operatorList .operatorItem {
    border-bottom: 0.5px solid rgb(187, 187, 187, 0.8);
    margin: 0 16px;
    box-sizing: border-box;
  }
  .skinPeelerList .skinPeelerItem:hover{
    background-color: #ccc;
    margin: 0 ;
  }
  .userInfo .operatorList .operatorItem:last-child {
    border-bottom: none;
  }

  .logo {
    width: 100%;
    height: 36px;
    margin-top: 22px;
    background-size: contain;
    /* background-image: url(../assets/img/logo.png); */
    background-position: center;
    background-repeat: no-repeat;
  }

  .skinPeeler{
    float: right;
    color: #fff;
    font-size: 28px;
    height: 80px;
    box-sizing: border-box;
    position: relative;
    display: inline-block;
    margin-right: 20px;
  }

  .skinPeelerList {
    width: 150px;
    background: #fff;
    line-height: 40px;
    color: #000;
    text-align: center;
    position: absolute;
    top: 65px;
    right: -65px;
    z-index: 1000;
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.22);
    border-radius: 5px;
    display: none;
  }

  .skinPeelerList .skinPeelerItem {
    border-bottom: 0.5px solid rgb(187, 187, 187, 0.8);
    margin: 0 16px;
    font-size: 16px;
    box-sizing: border-box;
  }
  .skinPeelerList .skinPeelerItem:last-child {
    border-bottom: none;
  }
  .skinPeeler .skinLogo{
    background:url(../assets/img/skin.png) no-repeat center;
    background-size: cover;
    display: inline-block;
    width: 30px;
    height: 20px;
    position: absolute;
    top: 29px;
    left: -26px;
  }
</style>
