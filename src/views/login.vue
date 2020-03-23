<template>
  <div class="loginBg">
    <div class="loginBox">
      <h3 class="login-title">星星摄影服务平台</h3>
      <div class="input">
        <input v-model="username" placeholder="请输入手机号/邮箱" />
      </div>
      <div class="input mt20px">
        <input type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <div class="mt20px">
        <button class="login-btn" @click="login()">立即登录</button>
      </div>
      <div class="mt20px clearfix">
        <div class="w50 fl text-left">
          <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
        </div>
        <div class="w50 fl text-right" style="color: #ced1df;">
          <router-link to="">忘记密码？</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  components: {

  },
  data () {
    return {
      username: null,
      password: null,
      autoLogin: true
    }
  },
  methods: {
    login () {
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
          this.$message({
            type: 'success',
            message: '登录成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: `${error.msg || '登录失败'}`
        })
      })
    }
  }
}
</script>

<style scoped>
  .loginBg {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-image: url(../assets/img/loginBg.jpg);
    background-size: cover;
    background-position: center;
  }

  .loginBox {
    display: inline-block;
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 30px 20px;
    background-color: rgba(0, 0, 0, 0.4);
    transform: translate(-50%, -50%);
    border-radius: 10px;
    border: 1px solid rgba(250, 250, 250, 0.6);
  }

  .login-title {
    color: #ced1df;
    margin-bottom: 30px;
  }

  .input input {
    width: 400px;
    height: 50px;
    padding: 5px 10px;
    box-sizing: border-box;
    background-color: transparent;
    color: #fff;
    outline: none;
    display: inline-block;
    border: 1px solid rgba(255, 255, 255, 0.6);
    font-size: 18px;
    border-radius: 5px;
  }

  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #ced1df;
    font-size: 16px;
  }

  input:-moz-placeholder,
  textarea:-moz-placeholder {
    color: #ced1df;
    font-size: 16px;
  }

  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #ced1df;
    font-size: 16px;
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #ced1df;
    font-size: 16px;
  }
</style>

<style>
  .loginBox .el-checkbox__input.is-checked .el-checkbox__inner,
  .loginBox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #fff;
    border-color: #fff;
  }

  .loginBox .el-checkbox {
    color: #ced1df;
  }

  .loginBox .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #ced1df;
  }

  .loginBox .el-checkbox__inner::after {
    border-color: #ced1df;
  }

  .login-btn {
    width: 100%;
    line-height: 50px;
    background-color: #409eff;
    box-shadow: 0px 0px 10px 1px #6597ca  inset;
    color: #fff;
    outline: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
