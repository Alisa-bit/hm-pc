<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <el-form class="login-form" status-icon>
        <!-- 表单中通过v-model双向绑定一个数据 -->
        <el-form-item prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.flag">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="gologin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//引入封装axios请求的模块
import request from "@/utils/request";

export default {
  data() {
    // 返回一个响应式数据
    return {
      form: {
        mobile: "13911111111",
        code: "246810",
        flag: false,
      },
    };
  },
  methods: {
    // 登录功能
    gologin() {
      console.log(this.form.flag);
      //如果没有同意协议就弹出提示框
      if (!this.form.flag) {
        this.$message.error({
          message: "没有同意协议"
        });
        return;
      }
      //发生登录请求
      request({
        url: "/mp/v1_0/authorizations",
        method: "post",
        data: {
          mobile: this.form.mobile,
          code: this.form.code,
        },
      }).then((res)=>{
        // 点击登录进入加载页面
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
// 铺满整屏
.login-container {
  // 通过定位让盒子铺满整个屏幕
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  //主轴为垂直方向
  flex-direction: column;
  // 居中对齐
  justify-content: center;
  align-items: center;
  background: url("./img/login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      // 水平居中
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("./img/logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>