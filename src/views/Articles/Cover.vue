<template>
  <div id="cover">
    <!-- 注意点：number类型也是可以完成循环的 -->
    <div v-for="(item,index) in picknum" :key="item" @click="opendialog(index)" class="operateBox">
      <span>选择素材</span>
      <!-- 注意点：要确保当前预览区域和他要缓存的图片位置是对应的 
      直接给img绑定一个选中的素材图片的地址，那么三个预览区域显示出来的是相同的图片，是行不通的-->
      <img :src="imageArr[index]" class="img" v-show="imageArr[index]"/>
    </div>
    <!-- 对话框 -->
    <el-dialog :append-to-body="true" :visible.sync="dialogVisible" width="720px">
      <el-card class="box-card">
        <div style="padding-bottom: 20px;">
          <el-radio-group v-model="collect" size="mini" @change="changeVal">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
        </div>
        <el-row :gutter="10">
          <el-col
            v-for="(image) in imageList"
            @click.native="select(image)"
            :key="image.id"
            class="img_item"
            :xs="12"
            :sm="6"
            :md="6"
            :lg="4"
          >
            <div class="img_box">
              <img :src="image.url" alt />
              <div class="selected" v-show="image.isShow">
                <img src="./img/selected.png" alt />
              </div>
            </div>
          </el-col>
        </el-row>
        <el-pagination
          style="margin-top:10px;"
          background
          layout="sizes, prev, pager, next"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="10"
          @current-change="currentPageChange"
          @size-change="pageSizeChange"
          :total="total_cont"
        ></el-pagination>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getImgs, switchCollect } from "@/api/images";

export default {
  props: {
    picknum: {
      type: Number, //父组件传递过来的控制渲染几张图的参数
    },
    images: {
      type: Array,//父组件传递过来的当前选择的文章中图片数组
      default:function(){ //防止没有传递images参数
        return []
      }
    },
  },
  data() {
    return {
      imageList: [], // 素材列表
      total_cont: 0, // 素材总数
      curPage: 1, // 当前要请求第几页数据
      per_page: 10, // 当前每页的条数
      collect: false, // 未收藏状态 也就是全部数据
      dialogVisible: false,
      curImg: null, //当前选中的图片
      curIndex: 0, //当前选中图片的预览区对应的索引
      imageArr: [], //用来存放缓存的图片
    };
  },
  methods: {
    //3、点击选择素材，弹出dialog框，dialog框分页展示图片素材数据
    // 3.1 弹出dialog框
    opendialog(index) {
      this.dialogVisible = true;
      //当前素材预览区的索引
      this.curIndex = index;
      console.log(this.images);
    },
    // 3.2 dialog框分页展示图片素材数据
    // 3.2.1 获取到图片素材渲染到页面
    getList() {
      getImgs({
        page: this.curPage,
        collect: this.collect,
        per_page: this.per_page,
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
        this.imageList = newList;
        this.total_cont = res.data.data.total_count;
      });
    },
    // 3.2.2 筛选
    changeVal(val) {
      //假如双向绑定过来的数据发生了变化，就不用再重新给绑定的数据赋值了
      this.getList();
    },
    // 3.2.3 当前页码改变时触发的事件
    currentPageChange(val) {
      //改变当前页码值，重新渲染数
      this.curPage = val;
      this.getList();
    },
    // 3.2.4 每页显示条数改变时触发的事件
    pageSizeChange(val) {
      //改变当前每页显示条数
      this.pageSize = val;
      //重新渲染
      this.getList();
    },
    // 3.3 选择素材，当前点击那个图片，那个图片就为选中状态，其他的图片不选中
    // 分析：排他思想，通过v-if绑定image.isShow控制选中图标的显示和隐藏
    //      当前选中的图片为true，其他的为false
    select(image) {
      //把除了当前项的其他数据中的isShow改为false
      this.imageList.forEach((item) => {
        item.isShow = false;
      });
      image.isShow = true;
      //3.4 把当前选中的图片存到缓存中
      this.curImg = image;
    },

    // 4、点击确定，缓存的图片存放到对应的预览区
    // 4.1 数组+index，点击选择素材弹出对话框时，传递当前点击的图片盒子的索引值
    //     通过索引值，找到当前缓存的图片对应的预览区域
    //     点击确定时才是最终拿到的结果
    confirm() {
      // 当前点击的素材预览区对应的要显示的素材图片
      this.imageArr[this.curIndex] = this.curImg.url;
      // 关闭弹层
      this.dialogVisible = false;
    },

    // 4.2 点击取消，选中的图片image.isShow恢复为false，关闭弹层
    cancel() {
      this.imageList.forEach((item) => {
        item.isShow = false;
      });
      // 关闭弹层
      this.dialogVisible = false;
    },

    // 5、确定好选择的图片后传递给后端的images,从而来完成文章的发布
    // 注意点：接口需要的就是一个字符串类型的图片数组
    // 5.1 声明一个方法，通过这个方法，返回存有缓存图片的数组
    setImages() {
      return this.imageArr
    },
  },
  mounted() {
    this.getList();
    // 0.4 假如父组件传递过来的图片数据为undefined，说明没有图片，就不进行图片回填了
    // 加个判断，完成图片数据回填
    if (this.images.length>0) {
      this.imageArr = this.images;
    }
  },
};
</script>

<style lang="less" scoped>
.operateBox {
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-left: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 13px;
  color: #666;
  text-align: center;
  line-height: 100px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.img_item {
  position: relative;
  box-sizing: border-box;
  .img_box {
    height: 120px;
    margin-bottom: 10px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .selected {
      position: absolute;
      width: 20%;
      left: 0;
      top: 0;
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
.ql-editor{
  height:400px
}
</style>