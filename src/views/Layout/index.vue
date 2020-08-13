<template>
    <el-container class="layout-container ">
      <!-- 侧边栏菜单项收起侧边栏宽度64，展开的话侧边栏宽度200px -->
      <!-- 属性前面加:可以将绑定的值识别为表达式 -->
      <el-aside 
      :width="isCollapse?'64px':'200px'" 
      class="aside" >
      <!-- isCollapse为true表示minLogo类名收起，true表示minLogo类名展开 -->
        <div class="logo" :class="{minLogo:isCollapse}"></div>
        <!-- 属性router控制是否使用 vue-router 的模式 -->
        <!-- 前面加:属性值可以识别为表达式 ，不加的话true会被认为是一个字符串，不会被编译-->
        <el-menu
        :router="true"
        default-active="2"
        class="nav-menu"
        background-color="#002033"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
        active-text-color="#ffd04b">
          <el-menu-item index="/articles">
            <!-- 要按照路由定义规则把路由路径写全 -->
            <i class="el-icon-house"></i>
            <span slot="title">文章列表</span>
          </el-menu-item>
          <el-menu-item index="/addArcticle">
            <i class="el-icon-s-promotion"></i>
            <span slot="title">发布文章</span>
          </el-menu-item>
           <el-menu-item index="/editArticle">
            <i class="el-icon-edit"></i>
            <span slot="title">编辑文章</span>
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
              <img class="avatar" src="http://toutiao.meiduo.site/FrvifflobfNNRM9V_ZBTI2ZaTH4n" alt="">
              <span>用户昵称</span>
             <i class="el-icon-arrow-down el-icon--right"></i>
             </div>
          <!--具名插槽：用来显示下拉内容 -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
           </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <!-- 二级路由渲染出口 -->
          <!-- 点击左侧菜单 显示出来的主题内容都是在layout这个组件下main区域显示的 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data(){
    // isCollapse为true收起状态，为fasle展开状态
    return {
      isCollapse:false//默认展开状态
      }
  },
  methods:{
    // 控制菜单项展开或收起的方法
    hswitch(){
      // 取反
      this.isCollapse=!this.isCollapse
    }
  }
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
  .logo{
      width: 100%;
      height: 60px;
      background: #002244 url(./img/logo_admin.png) no-repeat center / 140px auto;
    }
    // 覆盖background 的图片和大小，类书写在logo的下方。
    .minLogo{
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
  div:hover{
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