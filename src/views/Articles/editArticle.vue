<template>
  <div class="publish-container">
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单校验：prop+v-model双向绑定的数据名 -->
      <!-- rules 验证规则，v-model必须写 -->
      <el-form ref="articleForm" :rules="rules" :model="article" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <!-- 使用v-model进行数据的双向绑定 -->
          <quill-editor
           v-model="article.content" 
           :options="editorOption"
           ref="myeditor"></quill-editor>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <!-- 根据后端接口约定 -->
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 1、根据当前选择的单选按钮控制自定义组件的显示和隐藏 -->
          <!-- 2、点击图片类型切换图片数量 -->
          <div class="coverBox" v-if="article.cover.type>0">
            <!-- 2.1 当前选中的图片类型绑定的动态值传递给自定义的子组件 -->
            <!-- 分析：通过article.cover.type将选中的图片类型和图片数量连接起来 -->
            <!-- 怎么连接，把 article.cover.type 选中的图片类型当做参数传递给子组件-->
            <!-- 发现问题：点击了单图选择了素材之后，再去点击三图，组件始终显示的只有一个，剩余的不会被渲染出来 -->
            <!-- 解决：子组件标签加key -->
            <!-- 5.2 通过ref获取组件对象,发表文章的时候，
            通过子组件中用于返回缓存图片数组的方法来获取到选择的图片
            将获取到的图片赋值给article.cover.images，在传递给后端-->
            <!-- 0.3 图片预览是在子组件实现的，所以要把后端返回的images数据传递给自定义的子组件 -->
            <cover
              :images="article.cover.images"
              :picknum="article.cover.type"
              :key="article.cover.type"
              ref="coveComponent"
            ></cover>
          </div>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择活动区域">
            <el-option
              v-for="channel in channels"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="hAddArticle(false)">发表</el-button>
          <el-button @click="hAddArticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入富文本编辑器
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { getChannel,article,editarticle } from "@/api/article";
//引入自定义组件
import Cover from "./Cover";

export default {
  // 注册组件
  components: { quillEditor, Cover },
  data() {
    return {
      //编辑器的配置项
      editorOption: {
        placeholder: "", //占位文字
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["image"],
          ],
        },
      },
      channels: [],
      article: {
        title: "", // 文章村里
        content: "", // 文章内容
        cover: {
          type: 0, // 封面图片的张数
          images: [], // 封面的地址
        },
        channel_id: "", // 频道id
        id:'',
      },
      rules: {
        title: [
          { required: true, message: "不能为空", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5到30之间", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
          { min: 20, max: 30000, message: "最少20个字", trigger: "blur" },
        ],
        channel_id: [
          { required: true, message: "请选择文章频道", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //获取频道接口的数据，渲染到下拉列表
    hGetChannels() {
      getChannel().then((res) => {
        this.channels = res.data.data.channels;
      });
    },

    // 0、编辑文章，最重要的部分，实现数据回填
    // 获取指定文章的数据完成数据回填
    hgetRender() {
      // 0.1 获取查询字符串传过来的id值
      this.id=location.hash.substring(location.hash.indexOf("=") + 1);
      article(this.id).then((res) => {
        //0.2 数据回填，后端响应到的数据给表单绑定的响应式数据article
        this.article = res.data.data;
      });
    },
    // 修改文章
    hAddArticle(isDraft) {
      // 获取子组件中方法返回的数据
      // 当单选按钮选中无图的时候，下面的子组件是不存在的，所以就不会有this.$refs.coveComponent.setImages()
      // 因此会报错
      // 解决：判断，只有单选按钮选中的类型>0的时候才会显示
      if (this.article.cover.type > 0) {
        this.article.cover.images = this.$refs.coveComponent.setImages();
      }
      //点击按钮，完成一个总的校验
      this.$refs["articleForm"].validate((valid) => {
        if (valid) {
           console.log(this.article);
          //valid为true,所有校验通过，执行这个逻辑
          editarticle(this.id,{
           draft:isDraft
          }, this.article).then((res) => {
            this.$message({
              message: "文章修改成功",
              type: "success",
            });
          });
        } else {
          //valid为false，说明有一个校验没有通过，执行这个逻辑
          return false;
        }
      });
    },
  },
  computed: {
    editor() {
      //返回真实的富文本编辑器Quill对象
      return this.$refs.myeditor.quill;
    },
  },
  mounted() {
    this.hGetChannels();
    this.hgetRender();
    //富文本编辑器设置高度
    this.editor.container.style.height = `${500}px`;
  },
};
</script>

<style lang="less" scoped>
</style>