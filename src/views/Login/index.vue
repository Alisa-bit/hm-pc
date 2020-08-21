<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <el-form class="login-form" :rules="formrules" :model="form" ref="myfrom">
        <!-- 表单中通过v-model双向绑定一个数据 -->
        <el-form-item prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item prop="flag">
          <el-checkbox v-model="form.flag">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="loginvalidet" v-loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入用户登录接口的封装函数
import { login } from "@/api/user";
// 引入保存本地数据的模块
import { saveData } from "@/store";

export default {
  data() {
    // 在返回一个响应式数据之前自定义验证规则
    // value表单项绑定的值
    // callback可执行函数
    // 效验失败:callback(new Error('错误提示信息'))返回一个错误提示信息
    // 效验成功：callback()直接执行（必须执行的函数）
    const validatepass = (rules, value, callback) => {
      // 如果没有输入验证码，说明为空
      // 空的话弹出错误提示信息
      if (!value) {
        callback(new Error("不能为空"));
      }
      if (value.length !== 6) {
        callback(new Error("长度必须为6位数"));
      }
      callback();
    };
    // 判断用户是否勾选协议的自定义验证规则
    const validatepass2 = (rules, value, callback) => {
      if (!value) {
        callback(new Error("请勾选协议"));
      }
      callback();
    };
    //手机号自定义验证规则
    const ValidateTel = (rules, value, callback) => {
      // 如果用户输入的是非数字，提示错误信息输入的不是数字
      if (isNaN(value)) {
        callback(new Error("输入的不是数字哦"));
      }
      if (value.length > 11) {
        callback(new Error("手机号不能超过11位数"));
      }
      callback();
    };
    // 返回一个响应式数据
    return {
      form: {
        mobile: "13911111111",
        code: "246810",
        flag: false,
      },
      loading: false,
      // 定义表单验证规则
      formrules: {
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: ValidateTel, trigger: "blur" },
        ],
        code: [{ validator: validatepass, trigger: "blur" }],
        flag: [
          //改变的时候触发
          { validator: validatepass2, trigger: "change" },
        ],
      },
    };
  },
  methods: {
    //登录效验
    loginvalidet() {
      // valid代表当前所有表单项整体效验结果，如果整个表单项都效验成功，valid结果为true
      // 如果表单项有一个或者多个效验失败，valid结果为false
      this.$refs["myfrom"].validate((valid) => {
        if (valid) {
          // 效验成功后执行的逻辑
          this.dologin();
        } else {
          //效验失败后执行的业务逻辑
          return false;
        }
      });
    },
    // 登录功能
    dologin() {
      // 发生登录请求
      // 发送请求之前开启加载效果
      this.loading = true;
      login(this.form.mobile, this.form.code)
        .then((res) => {
          this.loading = false;
          // 登录成功给出成功提示
          this.$message({
            message: "登录成功啦",
            type: "success",
          });
      
          // 本地存储传过去的是对象格式
          // 服务器端获取到的数据保存到本地
          saveData(res.data.data);

          // 登录成功，跳转到首页
          this.$router.push({
            path:'/'
          });
        })
        .catch((error) => {
          this.loading = false;
          // 登录失败给出警告提示
          this.$message.error({
            message: "登录失败啦",
          });
        });
      //优化频繁登录问题
      // 思路：发送请求之前同时开启一个load加载效果
      //       论请求成功与否，都要关闭loading效果
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
