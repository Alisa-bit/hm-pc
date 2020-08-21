<template>
  <div class="setting-container">
    <el-card>
      <!-- 导航 -->
      <div slot="header">
        <div slot="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">100</el-form-item>
            <el-form-item label="手机：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体简介：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="updateUser(userInfo.id)" type="primary">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="12">
          <!-- 上传组件 action必须属性-->
          <!-- http-request 覆盖默认的上传行为，可以自定义上传的实现 -->
          <!-- upload组件默认使用post请求，不支持自定义请求 -->
          <el-upload
            class="avatar-uploader"
            action
            :http-request="uploadPhoto"
            :show-file-list="false"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="edit-photo">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 引入获取用户信息的接口
import { userInfo } from "@/api/user";
import { editUserinfo, editUserImg } from "@/api/setting";

export default {
  name: "my-setting",
  data() {
    return {
      // 用户信息
      userInfo: {
        mobile: "",
        name: "", //用户name必须为1-7位
        intro: "",
        email: "",
        photo: "",
      },
      // 支持上传组件的数据
      imageUrl: null,
    };
  },
  methods: {
    addCont(){
      console.log('父函数组件调用了');
    },

    // 修改用户个人资料
    updateUser(id) {
      editUserinfo( {
          name: this.userInfo.name,
          intro: this.userInfo.intro,
          email: this.userInfo.email,
        }).then((res) => {
        // 传值
         this.eventBus.$emit('getName',this.userInfo.name);
      });
    },

    // 修改用户头像，通过自定义上传事件
    uploadPhoto(res) {
      let { file } = res;

      // 接口需要我们上传一个formdata形式的数据完成上传
      let formdata=new FormData();
      formdata.append('photo',file);//文件以键值对形式存到formdata对象中
      editUserImg(formdata).then(res=>{
        this.userInfo.photo=res.data.data.photo
         // 传值
         this.eventBus.$emit('getPhoto',this.userInfo.photo);
      })
    },

    //获取用户信息进行数据回填
    hgetUserInfo() {
      userInfo().then((res) => {
        this.userInfo = res.data.data;
      });
    },
  },
  mounted() {
    this.hgetUserInfo();
  },
};
</script>

<style scoped lang='less'>
.avatar {
  width: 178px;
  height: 178px;
  line-height: 178px;
}
.avatar-uploader {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.edit-photo {
  font-size: 12px;
  text-align: center;
}
</style>