<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="文章标题" width="180"></el-table-column>
      <el-table-column prop="total_comment_count" label="总评论数" width="180"></el-table-column>
      <el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
      <el-table-column prop="fans_comment_count" label="评论状态">
        <template slot-scope="scope">
          <span v-if="scope.row.comment_status">关闭</span>
          <span v-if="!scope.row.comment_status">打开</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽，当前这一行的数据传递给打开事件-->
        <!-- v-if 控制按钮的显示和隐藏 true显示，false隐藏-->
        <!-- 分析：假如一开始是打开评论，那么对应的当前行scope.row.comment_status值为true
         点击打开评论按钮，对这个值取反结果为false，打开评论就会隐藏，相对应的关闭状态就会显示
         因为关闭状态的v-if做的是取反操作，!false取反=true
        -->
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            v-if="scope.row.comment_status"
            @click="handleTogger(scope.row)"
          >打开评论</el-button>
          <el-button
            size="mini"
            type='danger'
            v-if="!scope.row.comment_status"
            @click="handleTogger(scope.row)"
          >关闭评论</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination 
    class="pageContainer"
    background 
    layout="prev, pager, next" 
    :current-page='curPage'
    @current-change='changePage'
    :total="totalCount"></el-pagination>
  </el-card>

  
</template>

 <script>
import { articleList} from "@/api/article"
import {commentStatus } from "@/api/comment"

export default {
  data() {
    return {
      tableData: [],
      curPage:JSON.parse(localStorage.getItem('page'))||1, //当前页面
      totalCount:0 //总条目数
    };
  },
  methods: {
    //获取关于评论字段的数据
    // data中绑定的响应式数据修改为服务器返回的数据
    getList() {
      // 根据接口文档，传comment返回用于评论管理的字段
      articleList({
        page:this.curPage,
        response_type: "comment",
      }).then((res) => {
        //修改数据
        this.tableData = res.data.data.results;
        // 修改总条目数
        this.totalCount=res.data.data.total_count
      });
    },

    // 修改当前文章的评论状态
    // 注意点：put方式url传递参数，请求体修改数据
    // 通过params往url地址栏传递查询字符串
    // 通过data修改对应的数据
    handleTogger(row) {
      let comment_status = !row.comment_status;
      let id=row.id.toString();
      commentStatus(id,comment_status).then(res=>{
        this.getList();
      });
    },

    // 当前页码改变时触发的事件
    // 修改当前页码
    // 重新渲染页面
    changePage(val){
      // val参数为当前的页码值
      this.curPage=val;
      this.getList();
      localStorage.setItem('page',JSON.stringify(val));
    }
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
.pageContainer{
  margin-top: 20px;
}
</style>