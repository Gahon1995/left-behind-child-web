<template>
  <div>
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <h3 class="title">留守儿童援助系统web设计</h3>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input
            v-model="loginForm.username"
            name="username"
            type="text"
            auto-complete="on"
            placeholder="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            placeholder="password"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button
              :loading="loading"
              type="danger"
              style="width:30%; margin-left:10px;"
              @click="register=true"
            >注册</el-button>
            <el-button
              :loading="loading"
              type="primary"
              style="width:60%; float: right;margin-right:10px;"
              @click.native.prevent="handleLogin"
            >登录</el-button>
          </div>
        </el-form-item>
        <div class="tips">
          <span style="margin-right:20px;">username: admin</span>
          <span>password: gao123456</span>
          <span>注册新用户</span>
        </div>
      </el-form>
    </div>
    <div>
      <el-dialog
        :visible.sync="register"
        title="注册"
        style="margin: auto; width: 100%; max-width: 1000px"
      >
        <el-form
          ref="user"
          :model="user"
          :rules="rules2"
          status-icon
          label-width="100px"
          class="register"
        >
          <el-form-item label="姓名：" prop="username">
            <el-input v-model="user.username"/>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <template>
              <el-radio v-model="user.sex" label="1">男</el-radio>
              <el-radio v-model="user.sex" label="0">女</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="电话：" prop="phone">
            <el-input v-model.number="user.phone"/>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="user.email"/>
          </el-form-item>

          <el-form-item label="密码：" prop="pass">
            <el-input v-model="user.password" type="password" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkPass">
            <el-input v-model="user.checkPass" type="password" auto-complete="off"/>
          </el-form-item>
          <div style="text-align: center">
            <el-button type="primary" @click="submitForm('user')">提交</el-button>
            <el-button @click="resetForm('user')">重置</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { isvalidUsername, isvalidateEmail } from '@/utils/validate'
import { register } from '@/api/login.js'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!isvalidateEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.user.checkPass !== '') {
          this.$refs.user.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '张三',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      register: false,
      user: {
        username: null,
        password: null,
        sex: null,
        phone: '',
        email: null,
        checkPass: null
      },
      rules2: {
        username: [{ required: true, trigger: 'change' }],
        phone: [
          // { validator: validateMobile, trigger: 'blur' },
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[34578]\d{9}$/,
            message: '目前只支持中国大陆的手机号码'
          }
        ],
        sex: [{ required: true, trigger: 'change' }],
        email: [
          { required: true, validator: validateEmail, trigger: 'change' }
        ],
        password: [{ validator: validatePass1, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/dashboard' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          register(this.user)
            .then(response => {
              this.loading = false
              this.$notify({
                title: '成功',
                message: '注册成功',
                type: 'success',
                duration: 1000
              })
              this.loginForm.username = this.user.username
              this.loginFor.password = this.user.password
              this.resetForm(this.user)
              this.register = false
            })
            .catch(() => {
              this.loading = false
              this.register = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        box-shadow: 0 0 0px 1000px;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
