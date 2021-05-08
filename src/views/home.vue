<template lang="html">
  <div id="home">
    <div class="operator_head">
      <pageHead @skinPeeler='skinPeeler'></pageHead>
    </div>
    <div class="operator_content clearfix">
      <div class="operator_content_left">
        <sideMenu :autoLoad="$route.query.autoLoad == true" :bars="bars" :bgColor="bgColor" :textColor="textColor" :activeTextColor="activeTextColor"></sideMenu>
        <div class="right_line"></div>
      </div>
      <div class="operator_content_right">
        <!-- 面包屑 -->
        <div class="mt20px">
          <breadCrumbs ></breadCrumbs>
        </div>
        <div class="mt20px">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageHead from './pageHead'
import sideMenu from '../components/sideMenu'
import breadCrumbs from '../components/breadCrumbs'
export default {
  name: 'home',
  components: {
    pageHead,
    sideMenu,
    breadCrumbs
  },
  data: function () {
    return {
      bars: [{
        title: '首页内容',
        icon: 'el-icon-s-data',
        path: '/carousel'
      }, {
        title: '服务套餐',
        icon: 'el-icon-tickets',
        path: '/theme'
      }, {
        title: '客户预约',
        icon: 'el-icon-s-order',
        path: '/order'
      }, {
        title: '用户管理',
        icon: 'el-icon-s-custom',
        path: '/users'
      }],
      bgColor: '#fff',
      textColor: '#000',
      activeTextColor: '#2FA4F5'
    }
  },
  methods: {
    skinPeeler: function (color) {
      if (color === '#6A6969') {
        this.bgColor = '#fff'
        this.textColor = '#000'
        this.activeTextColor = '#2FA4F5'
      } else if (color === '#034CA8') {
        this.bgColor = '#034CA8'
        this.textColor = 'white'
        this.activeTextColor = '#FF9E01'
      } else if (color === '#3e3c3c') {
        this.bgColor = '#3e3c3c'
        this.activeTextColor = '#D3AF8A'
        this.textColor = 'white'
      } else if (color === '#BFA044') {
        this.bgColor = '#BFA044'
        this.textColor = 'white'
        this.activeTextColor = '#0E649F'
      }
    }
  },
  created: function () {

  }
}
</script>

<style lang="css" scoped>
  .operator_head {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }

  .operator_content {
    padding-top: 80px;
  }

  .operator_content_left {
    height: 100%;
    width: 15%;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 80px;
    box-sizing: border-box;
    box-shadow: 0 -3px 4px  rgba(0,0,0,.15);
  }

  .right_line {
    height: 100%;
    width: 1px;
    background: #e6e6e6;
    position: absolute;
    top: 0;
    right: 0px;
  }

  .operator_content_right {
    margin-left: 15%;
    padding: 0 20px 100px 20px;
  }
</style>
