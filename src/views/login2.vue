<template>
  <div id="loginbg" class="loginbg">
    <div class="content clearfix">
      <div class="loginText">摄影小程序后台管理</div>
      <div class="login clearfix">
        <div class="login_top">
          <span class="account active">账号密码登录</span>
        </div>
        <div class="login_box">
          <div>
            <div class="inputWrap">
              <label class="inputLabel"><i class="el-icon-user"></i></label>
              <input placeholder="请输入手机号/邮箱" v-model="username" class="el-input input_display" />
            </div>
            <div class="inputWrap mt20px">
              <label class="inputLabel"><i class="el-icon-lock"></i></label>
              <input placeholder="请输入密码" type="password" v-model="password" class="el-input input_display" />
            </div>
          </div>
          <button class="loginBtn" @click="login()">登录</button>
          <div class="login_text">
            <router-link to="/signUp"><span class="login_text_regs">立即注册</span></router-link>
          </div>
        </div>
      </div>
      <div class="right">
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'login',
  components: {
  },
  data () {
    return {
      autoLogin: true,
      password: null,
      username: null
    }
  },
  methods: {
    async login () {
      let msg
      if (!this.username) {
        msg = '请输入手机号或邮箱'
      } else if (!this.password) {
        msg = '请输入密码'
      }
      if (msg) {
        this.$message({
          type: 'warning',
          message: msg
        })
        return
      }
      this.$axios({
        method: 'post',
        url: '/UserInformations/login',
        data: {
          username: this.username,
          password: this.password
        }
      }).then((response) => {
        if (response.data.code === 0) {
          this.globalData.token = response.data.data
          this.globalData.isLogin = true
          this.getUserInfo().then((result) => {
            this.$store.state.userInfo = result
            this.$message({
              type: 'success',
              message: '登录成功'
            })
            if (this.autoLogin) {
              localStorage.setItem('token', response.data.data)
              localStorage.setItem('autoLogin', this.autoLogin)
              localStorage.setItem('username', this.username)
              localStorage.setItem('password', this.password)
            }
            this.$router.push({
              path: '/home'
            })
          })
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      }).catch((error) => {
        if (error.response) {
          const err = error.response.data
          this.$message({
            type: 'error',
            message: `${err.error.message || '登录失败'}`
          })
        }
      })
    }
  },
  created () {
    $(document).bind('keyup', e => {
      if (e.keyCode === 13) {
        this.login()
      }
    })
  },
  destroyed () {
    $(document).unbind('keyup')
  }
}
</script>

<style scoped="scoped">
#loginbg {
  width: 100%;
  height: 100%;
  background-image: url(./static/img/web.jpg);
  background-size: cover;
  background-position: center;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
}

.content {
  position: absolute;
  width: 60%;
  padding: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}

.loginText {
  text-align: center;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  font-weight: bold;
  font-size: 40px;
  transform: translateY(-80px);
}

/* .loginText p {
  box-shadow: 0 0 5px 2px #145fc5;
} */

.login {
  flex: 4;
  border: 2px solid #019efd;
  background-color: #163a9e;
  padding: 0 30px 30px 30px;
  box-shadow: 0 0 5px 2px #145fc5;
}

.login_top {
  width: 100%;
  line-height: 60px;
  margin-bottom: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.login_top span {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.login_top .active {
  width: 108px;
  transition-duration: 0.5s;
  border-bottom: 2px solid #0468c4;
}

.login_top_borer {
  border-right: 1px solid #d9d9d9;
  height: 40px;
  margin-top: 10px;
}

.login_box {
  /* width: 400px;
  margin: auto; */
}

.login_text {
  /* width: 400px; */
  /* padding-right: 0; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 10px;
}

.login_text span {
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}

/* .login_text .login_text_regs {
  color: #008BFF;
  border-bottom: 2px solid #008BFF;
  padding-bottom: 1px;
} */

.inputWrap {
  color: #fff;
  position: relative;
}

.inputWrap .inputLabel {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  line-height: 30px;
  z-index: 100;
}

.inputWrap .el-input {
  width: 100%;
  height: 40px;
  padding-left: 40px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background-color: transparent;
  box-sizing: border-box;
  color: #fff;
}

.inputWrap .el-input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #ccc;
}

.inputWrap .el-input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #ccc;
}

.inputWrap .el-input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #ccc;
}

.account_button {
  width: 100px;
  height: 40px;
  line-height: 40px;
  border: transparent;
  cursor: pointer;
  background-color: transparent;
  margin: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 200;
  outline: none;
  color: #fff;
}

.input_item2 {
  float: left;
  width: 250px;
}

.loginBtn {
  width: 100%;
  height: 40px;
  outline: none;
  background-color: #008bff;
  margin-top: 80px;
  border: transparent;
  cursor: pointer;
  color: #fff;
}

.right {
  flex: 7;
  position: relative;
  background: url(/static/img/webrght.jpg);
  background-size: cover;
  /* border: 4px solid #0d5a9e; */
  box-shadow: 0 0 5px 2px #145fc5;
  margin-left: 5px;
}

.right_text {
  position: absolute;
  bottom: 0px;
  left: 0px;
  color: #fff;
  font-size: 24px;
}

.right_text span {
  padding: 0px 58px;
  border-right: 2px solid #979dbc;
}

.codeBox {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 200;
}
</style>
