<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 单选按钮组 -->
      <div style="padding-bottom: 20px;">
        <!--size当前按钮的大小  -->
        <!-- scflag 的值就是当前点击按钮的label值 -->
        <!-- change当前按钮发生变化时会触发，并且会把当前按钮的值当做实参传递进去 -->
        <el-radio-group v-model="scflag" size="mini" @change="changeVal">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          type="success"
          size="mini"
          style="float:right"
          @click="dialogVisible = true"
        >上传图片素材</el-button>
      </div>
      <!-- /单选按钮组 -->

      <!-- 素材列表 -->
      <!-- 一行占24份 -->
      <!-- el-row 代表行 gutter列之间的间隔 -->
      <!-- el-col 代表列 xs、sm、md、lg那不同屏幕划分份数 -->
      <!-- lg:4  每个行24份，大屏幕下每一列占4份==》1/6 -->
      <el-row :gutter="10">
        <el-col
          class="img_item"
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(image,index) in imgList"
          :key="image.id"
          @mouseenter.native="mEnter(image)"
          @mouseleave.native="mLeave(image)"
        >
          <div class="img_box">
            <img :src="image.url" />
          </div>
          <div class="option" v-show="image.isShow">
            <!-- 未收藏，字体图标颜色为白色 -->
            <!-- 已收藏，字体图标颜色为黄色 -->
            <!-- 当item.is_collected为true,已收藏 -->
            <!-- 当item.is_collected为false,未收藏 -->
            <span
              class="el-icon-star-off"
              :style="{color:image.is_collected ?'yellow':'#fff'}"
              @click="hswitchCollect(image)"
            ></span>
            <span class="el-icon-delete" @click="hdelImg(image,index)"></span>
          </div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->

      <!-- 分页 -->
      <!-- 发现问题 -->
      <!-- 前端：分页组件默认每页显示10条数据 -->
      <!-- pageNum = total(17)/pageSize(10) -->
      <!-- 后端：默认每页显示20条 -->
      <!-- pageNum = total(17)/pageSize(20) -->
      <!-- 解决：前后端保持每页显示条数一致 -->
      <!-- 注意点：layout中结构的顺序 -->
      <el-pagination
        background
        layout="sizes,prev, pager, next"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- append-to-body 可以保证内外层 Dialog 和遮罩层级关系的正确-->
    <el-dialog title="提示" :visible.sync="dialogVisible" append-to-body @close="hclose">
      <!-- action 代表图片上传的接口地址 
           :headers 代表接口的请求头设置 
           on-success 文件上传成功时的钩子
           before-upload 上传图片之前的钩子,参数为上传的文件,用来做文件上传的校验
           show-file-list 是否显示已上传文件列表
      name: 设置上传的文件参数名，要与后端接口中的要求一致。-->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        name="image"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImgs, switchCollect, delImg, uploadImg } from "@/api/images";
// 引入操作本地存储获取数据的模块
import { getData } from "@/store"

export default {
  name: "ImageIndex",
  data() {
    return {
      imageUrl: null,
      scflag: false,
      imgList: [],
      total: 0, //总条目数
      curPage: 1, //当前第几页
      pageSize: 5, //每页显示条数
      dialogVisible: false,
      headers: { Authorization: `Bearer ${getData().token}` },
    };
  },

  methods: {
    // 遮罩关闭时触发的事件
    // 当遮罩关闭时，把之前上传图片的路径清空
    hclose() {
      this.imageUrl = null;
    },

    // 上传图片成功之后执行的方法
    handleAvatarSuccess(response) {
      this.imageUrl = response.data.url;
      this.$message.success("上传素材成功");
    },

    //文件上传之前执行的方法
    // 上传文件前的校验
    beforeAvatarUpload(file) {
      // file上传文件的对象，包含了我们当前选择图片的所有信息
      //判断文件的类型
      const isJPG = file.type === "image/jpeg";
      //判断文件的大小，文件大小不超过2Mb
      // file.size是1字节=1b
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // 返回值必须为布尔值，true校验通过继续执行真正的上传逻辑，false校验不通过不再上传到服务器
      return isJPG && isLt2M;
    },

    // 删除收藏的素材
    hdelImg(image, index) {
      delImg(image.id).then((res) => {
        this.$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 方法一：重新渲染数据
            // 方法二：更新本地数据，直接将删除的数据删除掉
            this.imgList.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {});
      });
    },

    //调接口收藏或者取消收藏的操作
    hswitchCollect(image) {
      let { is_collected, id } = image;
      // 如果is_collected为true,传给后端的数据应该是false
      // 如果is_collected为false,传给后端的数据应该是true
      switchCollect(id, !is_collected).then((res) => {
        // 成功回调
        // 方法一：重新更新请求，用更新后的数据渲染页面
        // 方法二：同步更新视图依赖的响应式数据image.is_collected

        image.is_collected = !image.is_collected;
      });
    },

    // 思路分析：响应回来的数据，每一项都添加一个isShow属性，
    // 用来当前数据渲染到页面之后某个区域的显示和隐藏
    // 鼠标移入，收藏区域显示
    mEnter(image) {
      image.isShow = true;
    },
    // 鼠标移入，收藏区域隐藏
    mLeave(image) {
      image.isShow = false;
    },

    //获取到图片素材渲染到页面
    getList() {
      getImgs({
        page: this.curPage,
        collect: this.scflag,
        per_page: this.pageSize,
      }).then((res) => {
        let list = res.data.data.results;

        // 给每个数据添加一个isShow属性，用于图片收藏区域的显示和隐藏
        let newList = list.map((item) => {
          return {
            ...item,
            isShow: false,
          };
        });

        //图片依赖的数据
        this.imgList = newList;
        this.total = res.data.data.total_count;
      });
    },

    //单选按钮组绑定值变化时触发的事件
    // 此时绑定的值已经发生变化了
    // 要做的事情，重新渲染页面
    changeVal(val) {
      //假如双向绑定过来的数据发生了变化，就不用再重新给绑定的数据赋值了
      this.getList();
    },

    //当前页码改变时触发的事件
    currentPageChange(val) {
      //改变当前页码值，重新渲染数
      this.curPage = val;
      this.getList();
    },

    // 每页显示条数改变时触发的事件
    pageSizeChange(val) {
      //改变当前每页显示条数
      this.pageSize = val;
      //重新渲染
      this.getList();
    },
  },

  mounted() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
.img_item {
  position: relative;
  box-sizing: border-box;
  .img_box {
    height: 180px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.option {
  position: absolute;
  left: 5px;
  right: 5px;
  bottom: 5px;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  display: flex;
  span {
    flex: 1;
    text-align: center;
    cursor: pointer;
    line-height: 30px;
  }
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
.avatar-uploader {
  img {
    width: 100%;
  }
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
</style>
