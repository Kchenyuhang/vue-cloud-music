<template>
  <div class="bg">
    <div class="container">
      <mu-form ref="form" :model="validateForm" class="login-form">
        <el-radio-group v-model="labelPosition" size="small">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
        <div style="margin: 20px;"></div>
        <el-form :label-position="labelPosition" label-width="80px" :model="validateForm">
          <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '用户名不能为空' }]">
            <el-input v-model="validateForm.username" prop="username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '密码不能为空' }]">
            <el-input type="password" v-model="validateForm.password" prop="password"></el-input>
          </el-form-item>
          <!-- <mu-auto-complete label="提示输入内容" v-model="verifyCode"></mu-auto-complete> -->
          <mu-form-item style="margin-left: 17%">
            <mu-text-field v-model="verifyCode"></mu-text-field>
            <img class="verify" @click.prevent="refresh" ref="codeImg" />
          </mu-form-item>
          <mu-form-item prop="isAgree" :rules="argeeRules" style="margin-left: 17%">
            <mu-checkbox label="同意用户协议" v-model="validateForm.isAgree"></mu-checkbox>
          </mu-form-item>
          <mu-form-item style="margin-left: 17%">
            <mu-button color="primary" @click="submit">提交</mu-button>
            <mu-button @click="clear">重置</mu-button>
            <v-btn color="purple" dark @click="gitHub">
              GitHub
            </v-btn>
          </mu-form-item>
        </el-form>
      </mu-form>
      <!--遮罩-->
      <div class="mask" v-if="show">
        <div class="dialog">
          <h3>请选择要进入系统的角色</h3>
          <div class="btn-wrapper">
            <mu-button
              v-for="(role, index) in roles"
              :key="index"
              color="primary"
              class="btn"
              @click="gotoIndex(role.roleId)"
            >
              {{ role.roleName }}
            </mu-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      argeeRules: [{ validate: (val) => !!val, message: '必须同意用户协议' }],
      validateForm: {
        username: 'yhChen',
        password: '123456',
        isAgree: false
      },
      verifyCode: '',
      menuList: [],
      show: false,
      roles: [],

      vailiable: true,
      labelPosition: 'right'
    }
  },
  components: {},
  created() {
    this.axios
      .get(this.GLOBAL.baseUrl + '/captcha?name=' + this.validateForm.username, { responseType: 'blob' })
      .then((res) => {
        let img = this.$refs.codeImg
        let url = window.URL.createObjectURL(res.data)
        img.src = url
      })
  },
  mounted() {},
  methods: {
    submit() {
      //表单验证通过
      this.$refs.form.validate().then((result) => {
        console.log('form valid: ', result)
        //表单验证通过后才显示验证码
        this.axios({
          method: 'post',
          url: this.GLOBAL.baseUrl + '/sysAdmin/login',
          data: {
            name: this.validateForm.username,
            password: this.validateForm.password,
            verifyCode: this.verifyCode
          }
        }).then((res) => {
          //登录成功
          if (res.data.code === 1) {
            //存token
            localStorage.setItem('token', res.data.data.token)
            this.$store.commit('setToken', res.data.data.token)
            // let admin = {
            //   id: res.data.data.admin.id,
            //   name: res.data.data.admin.name,
            //   roles: res.data.data.admin.roles,
            //   avatar: res.data.data.admin.avatar
            // }
            //存admin
            localStorage.setItem('id', res.data.data.admin.id)
            localStorage.setItem('name', res.data.data.admin.name)
            localStorage.setItem('avatar', res.data.data.admin.avatar)
            this.$store.commit('setName', res.data.data.admin.name)
            this.$store.commit('setAvatar', res.data.data.admin.avatar)
            this.roles = res.data.data.admin.roles
            //角色数量超过1个
            if (this.roles.length > 1) {
              //弹出遮罩层选择
              alert('登录成功，你的角色不只一个，请选择')
              //显示遮罩层，遮罩层按钮具体点击事件 gotoDashboard(roleId)
              this.show = true
            } else {
              //只有一个角色
              const roleId = res.data.data.admin.roles[0].roleId
              //将roleId存入全局
              localStorage.setItem('roleId', roleId)
              this.$router.push('/')
            }
          } else {
            //登录失败
            alert(res.data.msg)
            //清空验证码文本框
            this.verifyCode = ''
          }
        })
      })
    },
    //获取验证码
    refresh() {
      //点击验证码图片，重新请求，刷新
      this.axios
        .get(this.GLOBAL.baseUrl + '/captcha?name=' + this.validateForm.username, { responseType: 'blob' })
        .then((res) => {
          let img = this.$refs.codeImg
          let url = window.URL.createObjectURL(res.data)
          img.src = url
        })
    },
    clear() {
      this.$refs.form.clear()
      this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      }
    },
    gotoIndex(roleId) {
      //将roleId存入全局
      localStorage.setItem('roleId', roleId)
      this.$router.push('/')
    },
    gitHub() {
      const authorize_uri = 'https://github.com/login/oauth/authorize'
      const client_id = '930f71fdbece9a36b028'
      const redirect_uri = 'http://localhost:8080/login/oauth2/code/github'
      window.location.href = `${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`
    }
  },
  computed: {}
}
</script>
<style scoped lang="scss">
.bg {
  background-image: url('../../assets/img/bottle.jpg');
  opacity: 0.8;
  height: 100vh;
  display: block;
  align-items: center;
  justify-content: center;
}
.container {
  max-width: 600px;
  margin-left: 15%;
  padding-top: 13%;
}
.login-form {
  max-width: 500px;
  margin-left: 300px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
}
.mask {
  z-index: 900;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  .dialog {
    z-index: 1000;
    width: 400px;
    height: 300px;
    line-height: 100px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    padding-top: 50px;
    .btn-wrapper {
      margin-left: 60px;
      display: flex;
      .btn {
        margin: 20px;
      }
    }
  }
}
</style>
