<template>
  <el-container class="layout-container">
    <!-- 侧边栏菜单项收起侧边栏宽度64，展开的话侧边栏宽度200px -->
    <!-- 属性前面加:可以将绑定的值识别为表达式 -->
    <el-aside :width="isCollapse?'64px':'200px'" class="aside">
      <!-- isCollapse为true表示minLogo类名收起，true表示minLogo类名展开 -->
      <div class="logo" :class="{minLogo:isCollapse}"></div>
      <!-- 属性router控制是否使用 vue-router 的模式 -->
      <!-- 前面加:属性值可以识别为表达式 ，不加的话true会被认为是一个字符串，不会被编译-->
      <!-- default-active默认激活的是home  -->
      <el-menu
        :default-active="curActive"
        :router="true"
        class="nav-menu"
        background-color="#002033"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/home">
          <!-- 要按照路由定义规则把路由路径写全 -->
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <!-- 要按照路由定义规则把路由路径写全 -->
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/addArticle">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture-outline"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-s-custom"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">账户设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <!-- 绑定一个事件，控制展开收起 -->
        <div @click="hswitch">
          <!--isCollapse为true图标为el-icon-s-unfold，false图标类名为el-icon-s-fold-->
          <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
          <span>黑马程序员</span>
        </div>
        <el-dropdown>
          <!-- 默认插槽：用来显示触发开关 -->
          <div class="avatar-wrap">
            <img class="avatar" :src="userinfo.photo" alt />
            <span>{{userinfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!--具名插槽：用来显示下拉内容 -->
          <el-dropdown-menu slot="dropdown">
            <!-- 发现问题：点击设置是不会触发事件 -->
            <!-- 原因：原生事件绑定到组件有时候可能会不生效 -->
            <!-- 解决：不生效的情况下，只需要在事件后面添加.native事件修饰符，将事件转为原生事件 -->
            <el-dropdown-item @click.native="getSetting">设置</el-dropdown-item>
            <el-dropdown-item @click.native="quit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 二级路由渲染出口 -->
        <!-- 点击左侧菜单 显示出来的主题内容都是在layout这个组件下main区域显示的 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { userInfo } from "@/api/user";
import { removeData } from "@/store";

export default {
  data() {
    // isCollapse为true收起状态，为fasle展开状态
    // 注意点data中的数据页面一刷新就会回到初始值
    return {
      isCollapse: false, //默认展开状态
      userinfo: {},
      //动态获取路由
      curActive: location.hash.substring(1),
    };
  },
  methods: {
    // 控制菜单项展开或收起的方法
    hswitch() {
      // 取反
      this.isCollapse = !this.isCollapse;
    },

    //获取用户信息渲染到页面
    getinfo() {
      userInfo().then((res) => {
        this.userinfo = res.data.data;
      });
    },

    // 点击设置，跳转到个人设置页面
    getSetting() {
      // 发现问题：再次点击是个设置跳转的时候会报错
      //  console.log(this.$route);
      if (this.$route.path === "/setting") {
        return;
      }
      this.$router.push({
        path: "/setting",
      });
    },

    // 点击退出跳转到登录页
    // 询问框，是否退出
    // 确认退出，删除token，跳转到登录页面
    quit() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeData();
          this.$router.push({
            path: "/login",
          });
        })
        .catch(() => {});
    },
  },
  // 监听一个数据的变化，数据一旦发生变化，执行绑定的回调函数
  watch: {
    // 响应式数据变化的时机，路由发生变化时控制
    $route: function (newval) {
      // console.log(newval);
      this.curActive = newval.path;
    },
  },
  mounted() {
    this.getinfo();
    // 接值,同步name属性值 
    this.eventBus.$on('getName',(name)=>{
      this.userinfo.name=name
    })

    //接值，同步更新头像
    this.eventBus.$on('getPhoto',(photo)=>{
      this.userinfo.photo=photo
    })

  },
};
</script>

<style lang="less" scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: #002033;
  .el-menu {
    border-right: none;
  }
  .logo {
    width: 100%;
    height: 60px;
    background: #002244 url(./img/logo_admin.png) no-repeat center / 140px auto;
  }
  // 覆盖background 的图片和大小，类书写在logo的下方。
  .minLogo {
    background-image: url(./img/logo_admin_01.png);
    background-size: 36px auto;
  }
}
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  div:hover {
    cursor: pointer;
  }
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
.main {
  background-color: #e9eef3;
}
</style>