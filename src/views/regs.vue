<template>
  <div id="regbg" class="regbg">
    <div class="content">
      <div class="loginText">摄影小程序后台管理</div>
      <div class="regbg_box">
        <div class="regbg_left">
          <div class="regbg_left_top">
            <span>新用户注册</span>
          </div>
          <div class="regbg_left_box">
            <div class="inputWrap">
              <label class="inputLabel"><i class="el-icon-user"></i></label>
              <input placeholder="请输入昵称" v-model="userName" class="el-input" />
            </div>
            <div class="inputWrap ">
              <label class="inputLabel"><i class="el-icon-mobile-phone"></i></label>
              <input placeholder="请输入手机号" v-model="phone" class="el-input" />
            </div>
            <div class="inputWrap ">
              <label class="inputLabel"><i class="el-icon-message"></i></label>
              <input placeholder="请输入邮箱" v-model="email" class="el-input" />
            </div>
            <!-- <div class="inputWrap clearfix">
              <div class="w60 fl">
                <label class="inputLabel"><i class="el-icon-postcard"></i></label>
                <input placeholder="请输入验证码" v-model="verificationCode" class="el-input input_display" />
              </div>
              <div class="w40 fl">
                <button :style="{color: displayBtn ? 'red': '', cursor: displayBtn ? 'not-allowed' : 'pointer'}" @click="getCode()" :disabled="displayBtn">{{btnText}}</button>
              </div>
            </div> -->
            <div class="inputWrap">
              <label class="inputLabel"><i class="el-icon-lock"></i></label>
              <input placeholder="请输入密码" type="password" v-model="userPassword" class="el-input " />
            </div>
            <div class="inputWrap ">
              <label class="inputLabel"><i class="el-icon-lock"></i></label>
              <input placeholder="再次输入密码" type="password" v-model="confirmPassword" class="el-input" />
            </div>
            <button @click="register()">注册</button>
            <div class="regbg_left_text">
              <span>已有账号？立即<router-link to="/login"><a>登录</a></router-link></span>
            </div>
          </div>
        </div>
        <div class="regbg_right">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'regs',
  components: {},
  data () {
    return {
      userName: '',
      userPassword: '',
      phone: '',
      verificationCode: '',
      confirmPassword: '',
      btnText: '获取验证码',
      displayBtn: false,
      count: 60,
      timer: null,
      email: null
    }
  },
  methods: {
    async getCode () { // 获取验证码
      const result = await this.getSMSCode(this.phone, 0)
      if (!result) {
        return
      }
      this.displayBtn = true
      this.btnText = `${this.count}s`
      this.timer = setInterval(() => {
        if (this.count > 1) {
          this.count--
          this.btnText = `${this.count}s`
        } else {
          this.count = 60
          this.btnText = '重新获取'
          this.displayBtn = false
          clearInterval(this.timer)
        }
      }, 1000)
    },
    async register () {
      let msg// 注册
      if (!this.userName) {
        msg = '请输入账号'
      } else if (!this.phone) {
        msg = '请输入正确的手机号'
      } else if (!this.email) {
        msg = '请输入邮箱'
      } else if (!this.userPassword) {
        msg = '请输入密码'
      } else if (this.userPassword !== this.confirmPassword) {
        msg = '两次输入的密码不一致'
      }
      if (msg) {
        this.$message({
          type: 'warning',
          message: msg
        })
        return
      }
      const data = {
        chineseName: this.userName,
        username: this.phone,
        password: this.userPassword,
        email: this.email
      }
      this.showLoading()
      this.$axios({
        method: 'post',
        url: '/userInformations/signUp',
        data
      }).then((response) => {
        if (response.data.code === 0) {
          this.$message({
            type: 'success',
            message: '注册成功,请登录'
          })
          setTimeout(() => {
            this.$router.push({
              path: '/login'
            })
          }, 1000)
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
        this.hideLoading()
      }).catch((error) => {
        console.log(error)
        this.hideLoading()
      })
    }
  }
}
</script>

<style scoped="scoped">
  #regbg {
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/web.jpg);
    background-size: cover;
    background-position: center;
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
  }

  .content {
    position: absolute;
    padding: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
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

  .regbg_box {
    background-color: #0D4684;
    display: flex;
  }

  .regbg_left {
    flex: 4;
    width: 100%;
    border: 2px solid #019efd;
    background-color: #163a9e;
    box-shadow: 0 0 5px 2px #145fc5;
    margin-right: 8px;
  }

  .regbg_left_top {
    width: 100%;
    text-align: center;
    padding-top: 20px;
  }

  .regbg_left_top span {
    line-height: 40px;
    color: #fff;
    font-size: 18px;
    border-bottom: 2px solid #0468c4;
    transition-duration: 0.5s;
    padding-bottom: 2px;
  }

  .regbg_left_box {
    padding-top: 30px;
    width: 78%;
    margin: auto;

  }

  .inputWrap {
    color: #fff;
    position: relative;
  }

  .inputWrap .inputLabel {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 0;
    top: 45%;
    transform: translateY(-50%);
    text-align: center;
    z-index: 100;
  }

  .inputWrap .el-input {
    width: 100%;
    height: 40px;
    margin-bottom: 20px;
    padding-left: 40px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background-color: transparent;
    box-sizing: border-box;
    color: #fff;
  }

  .inputWrap button {
    font-size: 14px;
    margin: 0;
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

  button {
    width: 100%;
    height: 40px;
    margin-top: 20px;
    background-color: #008BFF;
    outline: none;
    border: transparent;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }

  .regbg_left_text {
    float: right;
    color: #fff;
    font-size: 14px;
    padding-top: 8px;
    margin-bottom: 40px;
  }

  .regbg_left_text a {
    font-size: 16px;
    padding-left: 4px;
    color: #008BFF;
    cursor: pointer;
    border-bottom: 2px solid #008BFF;
    padding-bottom: 1px;
  }

  .regbg_right {
    flex: 7;
    background-image: url(../assets/img/webrght.jpg);
    box-shadow: 0 0 5px 2px #145fc5;
    background-size: cover;
    background-position: center;
    position: relative;
  }
</style>
